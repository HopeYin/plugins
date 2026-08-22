#!/usr/bin/env python3
"""Manual local sync: pull upstream Codex changes and regenerate Kimi manifests."""

import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent


def run(cmd, **kwargs):
    print(f"$ {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=REPO_ROOT, text=True, **kwargs)
    if result.returncode != 0:
        print(f"Command failed with exit code {result.returncode}", file=sys.stderr)
        sys.exit(result.returncode)
    return result


def main():
    run(["git", "fetch", "upstream"])
    run(["git", "merge", "upstream/main", "--no-edit"])
    run([sys.executable, "scripts/generate_kimi_manifests.py"])

    status = run(["git", "status", "--short"], capture_output=True)
    if not status.stdout.strip():
        print("No changes to commit")
        return

    run(["git", "add", "-A"])
    run(["git", "commit", "-m", "chore: local sync upstream and regenerate kimi manifests"])
    run(["git", "push", "origin", "main"])
    print("Local sync complete")


if __name__ == "__main__":
    main()
