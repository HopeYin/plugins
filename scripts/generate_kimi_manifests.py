#!/usr/bin/env python3
"""Generate Kimi plugin manifests from OpenAI Codex plugin manifests.

Preserves the original `.codex-plugin/` directory and writes a new
`kimi.plugin.json` next to it for each plugin that lacks one.
"""

import json
import re
import sys
from pathlib import Path

PLUGIN_ROOT = Path(__file__).resolve().parent.parent
PLUGINS_DIR = PLUGIN_ROOT / "plugins"
LOG_FILE = PLUGIN_ROOT / "scripts" / "kimi_manifest_changes.log"

VALID_NAME_RE = re.compile(r"^[a-z0-9][a-z0-9_-]{0,63}$")


def sanitize_name(name: str, fallback: str) -> str:
    """Make a name valid for Kimi plugin id: [a-z0-9][a-z0-9_-]{0,63}."""
    s = name.lower()
    s = re.sub(r"[^a-z0-9_-]+", "-", s)
    s = s.strip("-")
    if not VALID_NAME_RE.match(s):
        s = sanitize_name(fallback, "plugin")
    if not s:
        s = "plugin"
    return s


def format_author(author):
    if isinstance(author, dict):
        parts = []
        if author.get("name"):
            parts.append(author["name"])
        if author.get("email"):
            parts.append(f"<{author['email']}>")
        if author.get("url"):
            parts.append(f"({author['url']})")
        return " ".join(parts) if parts else None
    if isinstance(author, str):
        return author
    return None


def map_interface(codex_interface):
    if not isinstance(codex_interface, dict):
        return None
    kimi = {}
    for key in (
        "displayName",
        "shortDescription",
        "longDescription",
        "developerName",
        "websiteURL",
        "category",
    ):
        val = codex_interface.get(key)
        if val is not None:
            kimi[key] = val
    return kimi if kimi else None


def convert_manifest(codex: dict, plugin_dir_name: str) -> dict:
    kimi = {
        "$schema": "https://kimi.com/schemas/kimi.plugin.schema.json",
    }

    raw_name = codex.get("name") or plugin_dir_name
    kimi["name"] = sanitize_name(raw_name, plugin_dir_name)
    kimi["version"] = codex.get("version") or "0.0.0"

    if codex.get("description"):
        kimi["description"] = codex["description"]
    if codex.get("keywords"):
        kimi["keywords"] = codex["keywords"]

    author = format_author(codex.get("author"))
    if author:
        kimi["author"] = author

    if codex.get("homepage"):
        kimi["homepage"] = codex["homepage"]
    if codex.get("license"):
        kimi["license"] = codex["license"]
    if codex.get("skills"):
        kimi["skills"] = codex["skills"]

    interface = map_interface(codex.get("interface"))
    if interface:
        kimi["interface"] = interface

    # If the Codex manifest already declares MCP servers, try to carry them over.
    if codex.get("mcpServers"):
        kimi["mcpServers"] = codex["mcpServers"]

    return kimi


def main():
    if not PLUGINS_DIR.is_dir():
        print(f"Plugins directory not found: {PLUGINS_DIR}", file=sys.stderr)
        sys.exit(1)

    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    logs = []
    generated = 0
    existing = 0
    errors = 0
    name_registry = {}

    for plugin_dir in sorted(PLUGINS_DIR.iterdir()):
        if not plugin_dir.is_dir():
            continue

        codex_manifest = plugin_dir / ".codex-plugin" / "plugin.json"
        kimi_manifest = plugin_dir / "kimi.plugin.json"
        kimi_alt = plugin_dir / ".kimi-plugin" / "plugin.json"

        if not codex_manifest.is_file():
            continue

        if kimi_manifest.exists() or kimi_alt.exists():
            existing += 1
            logs.append(f"SKIP {plugin_dir.name}: Kimi manifest already exists")
            continue

        try:
            with codex_manifest.open("r", encoding="utf-8") as f:
                codex = json.load(f)
        except Exception as e:
            errors += 1
            logs.append(f"ERROR {plugin_dir.name}: failed to read Codex manifest: {e}")
            continue

        try:
            kimi = convert_manifest(codex, plugin_dir.name)
        except Exception as e:
            errors += 1
            logs.append(f"ERROR {plugin_dir.name}: conversion failed: {e}")
            continue

        base_name = kimi["name"]
        unique_name = base_name
        counter = 1
        while unique_name in name_registry:
            suffix = f"-{counter}"
            max_base_len = 64 - len(suffix)
            unique_name = f"{base_name[:max_base_len]}{suffix}"
            counter += 1
        name_registry[unique_name] = plugin_dir.name
        if unique_name != base_name:
            kimi["name"] = unique_name
            logs.append(f"RENAME {plugin_dir.name}: {base_name} -> {unique_name}")

        with kimi_manifest.open("w", encoding="utf-8") as f:
            json.dump(kimi, f, ensure_ascii=False, indent=2)
            f.write("\n")

        generated += 1
        logs.append(
            f"GENERATE {plugin_dir.name} -> {kimi_manifest.relative_to(PLUGIN_ROOT)}"
        )

    summary = (
        f"DONE: generated={generated}, existing={existing}, errors={errors}, "
        f"total_plugins_with_manifest={existing + generated}"
    )
    logs.append(summary)

    with LOG_FILE.open("w", encoding="utf-8") as f:
        f.write("\n".join(logs) + "\n")

    print(summary)


if __name__ == "__main__":
    main()
