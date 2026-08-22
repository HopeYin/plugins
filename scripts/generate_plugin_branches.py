#!/usr/bin/env python3
"""Create one orphan branch per plugin, with plugin files at the branch root.

This lets Kimi Code install each plugin from:
  https://github.com/<owner>/<repo>/tree/plugin/<plugin-name>
"""

import shutil
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
PLUGINS_DIR = REPO_ROOT / "plugins"
WORKTREE = REPO_ROOT / ".branch-worktree"


def run(cmd, cwd=None, check=True):
    print(f"$ {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=cwd or REPO_ROOT, text=True, capture_output=True)
    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)
    if check and result.returncode != 0:
        raise RuntimeError(f"Command failed: {' '.join(cmd)}")
    return result


def copy_plugin_to_worktree(plugin_dir: Path):
    """Copy plugin_dir contents into the worktree root, replacing existing files."""
    for item in plugin_dir.iterdir():
        dest = WORKTREE / item.name
        if dest.exists():
            if item.is_dir():
                shutil.rmtree(dest)
            else:
                dest.unlink()
        if item.is_dir():
            shutil.copytree(item, dest)
        else:
            shutil.copy2(item, dest)


def build_branch(plugin_dir: Path):
    branch = f"plugin/{plugin_dir.name}"
    print(f"\n=== Building branch {branch} ===")

    # Create a fresh orphan branch for this plugin
    run(["git", "checkout", "--orphan", branch], cwd=WORKTREE)

    # Wipe the worktree clean (leave the .git directory)
    subprocess.run(
        ["git", "rm", "--cached", "-rf", "."],
        cwd=WORKTREE,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=True,
    )
    for child in WORKTREE.iterdir():
        if child.name == ".git":
            continue
        if child.is_dir():
            shutil.rmtree(child)
        else:
            child.unlink()

    # Copy the plugin files to the branch root
    copy_plugin_to_worktree(plugin_dir)

    # Commit and push
    run(["git", "add", "-A"], cwd=WORKTREE)
    run(["git", "commit", "-m", f"plugin: {plugin_dir.name}"], cwd=WORKTREE)
    run(["git", "push", "origin", branch, "--force-with-lease"], cwd=WORKTREE)

    # Detach and delete the local branch so the next iteration can reuse the name
    run(["git", "checkout", "--detach"], cwd=WORKTREE)
    run(["git", "branch", "-D", branch], cwd=WORKTREE)


def main():
    if not PLUGINS_DIR.is_dir():
        print(f"Plugins directory not found: {PLUGINS_DIR}", file=sys.stderr)
        sys.exit(1)

    # Prepare a single disposable worktree
    if WORKTREE.exists():
        run(["git", "worktree", "remove", "--force", str(WORKTREE)], check=False)
    run(["git", "worktree", "add", "--detach", str(WORKTREE), "main"])

    try:
        for plugin_dir in sorted(PLUGINS_DIR.iterdir()):
            if not plugin_dir.is_dir():
                continue
            if not (plugin_dir / "kimi.plugin.json").exists():
                print(f"SKIP {plugin_dir.name}: no kimi.plugin.json")
                continue
            build_branch(plugin_dir)
    finally:
        run(["git", "worktree", "remove", "--force", str(WORKTREE)], check=False)


if __name__ == "__main__":
    main()
