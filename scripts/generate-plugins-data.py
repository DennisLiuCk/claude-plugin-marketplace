#!/usr/bin/env python3
"""
Generate plugins-data.js from marketplace.json

This script reads the marketplace.json file and generates a JavaScript
file containing all plugin data for the GitHub Pages website.

Usage:
    python scripts/generate-plugins-data.py
"""

import json
import os
from pathlib import Path

# Define plugin icons mapping
PLUGIN_ICONS = {
    'agent-sdk-dev': '🔧',
    'feature-dev': '🚀',
    'frontend-design': '🎨',
    'ralph-wiggum': '🔄',
    'plugin-dev': '📦',
    'pr-review-toolkit': '👀',
    'commit-commands': '💾',
    'code-review': '🔍',
    'hookify': '🪝',
    'security-guidance': '🔒',
    'explanatory-output-style': '💡',
    'learning-output-style': '📚'
}

CATEGORY_NAMES = {
    'development': '開發工具',
    'productivity': '生產力',
    'security': '安全',
    'learning': '學習'
}


def load_marketplace_data():
    """Load marketplace.json from the repository root."""
    root_dir = Path(__file__).parent.parent
    marketplace_path = root_dir / '.claude-plugin' / 'marketplace.json'

    if not marketplace_path.exists():
        raise FileNotFoundError(f"Marketplace file not found: {marketplace_path}")

    with open(marketplace_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def get_display_name(plugin_name):
    """Convert plugin name to display name (Title Case)."""
    # Convert kebab-case to Title Case
    words = plugin_name.split('-')
    return ' '.join(word.capitalize() for word in words)


def get_source_type(plugin):
    """Determine if plugin is official or community."""
    # For now, all plugins are official
    # In the future, this can be extended to check for community plugins
    return "official"


def generate_plugin_data(marketplace_data):
    """Generate plugin data structure."""
    plugins = []

    github_base_url = "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main"

    for plugin in marketplace_data.get('plugins', []):
        plugin_name = plugin['name']
        display_name = get_display_name(plugin_name)
        icon = PLUGIN_ICONS.get(plugin_name, '🔌')
        source_type = get_source_type(plugin)

        # Extract author name without "(繁體中文版)" for cleaner display
        author_name = plugin['author']['name']
        if '(' in author_name:
            author_name = author_name.split('(')[0].strip()

        plugin_data = {
            'name': plugin_name,
            'displayName': display_name,
            'description': plugin['description'],
            'version': plugin['version'],
            'author': {
                'name': author_name,
                'chineseName': '繁體中文版',
                'email': plugin['author']['email']
            },
            'source': plugin['source'],
            'category': plugin['category'],
            'sourceType': source_type,
            'icon': icon,
            'githubUrl': f"{github_base_url}/{plugin['source']}"
        }

        plugins.append(plugin_data)

    return plugins


def generate_js_file(marketplace_data, plugins):
    """Generate the JavaScript file content."""
    js_content = """// Plugin data - Generated from marketplace.json
// This data structure includes all plugins with their metadata

const PLUGIN_ICONS = {
"""

    # Add plugin icons
    for name, icon in PLUGIN_ICONS.items():
        js_content += f"    '{name}': '{icon}',\n"

    js_content += """};

const CATEGORY_NAMES = {
"""

    # Add category names
    for category, name in CATEGORY_NAMES.items():
        js_content += f"    '{category}': '{name}',\n"

    js_content += """};

const pluginsData = {
"""

    # Add marketplace info
    js_content += f"""    marketplace: {{
        name: "{marketplace_data['name']}",
        version: "{marketplace_data['version']}",
        description: "{marketplace_data['description']}",
        owner: {{
            name: "{marketplace_data['owner']['name']}",
            email: "{marketplace_data['owner']['email']}"
        }}
    }},
    plugins: [
"""

    # Add each plugin
    for i, plugin in enumerate(plugins):
        # Add comma only if not the last item
        trailing_comma = "," if i < len(plugins) - 1 else ""
        js_content += f"""        {{
            name: "{plugin['name']}",
            displayName: "{plugin['displayName']}",
            description: "{plugin['description']}",
            version: "{plugin['version']}",
            author: {{
                name: "{plugin['author']['name']}",
                chineseName: "{plugin['author']['chineseName']}",
                email: "{plugin['author']['email']}"
            }},
            source: "{plugin['source']}",
            category: "{plugin['category']}",
            sourceType: "{plugin['sourceType']}",
            icon: PLUGIN_ICONS['{plugin['name']}'],
            githubUrl: "{plugin['githubUrl']}"
        }}{trailing_comma}
"""

    js_content += """    ]
};

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.pluginsData = pluginsData;
    window.PLUGIN_ICONS = PLUGIN_ICONS;
    window.CATEGORY_NAMES = CATEGORY_NAMES;
}
"""

    return js_content


def write_js_file(content):
    """Write the generated JavaScript content to file."""
    root_dir = Path(__file__).parent.parent
    output_path = root_dir / 'docs' / 'js' / 'data.js'

    # Ensure directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return output_path


def main():
    """Main function to generate plugins data."""
    try:
        print("🔄 Loading marketplace data...")
        marketplace_data = load_marketplace_data()

        print(f"📦 Found {len(marketplace_data['plugins'])} plugins")

        print("🔨 Generating plugin data...")
        plugins = generate_plugin_data(marketplace_data)

        print("📝 Generating JavaScript file...")
        js_content = generate_js_file(marketplace_data, plugins)

        print("💾 Writing to file...")
        output_path = write_js_file(js_content)

        if output_path.exists():
            size = output_path.stat().st_size
            print(f"📄 Generated file size: {size} bytes")
        else:
            print("❌ Error: File was not created!")
            exit(1)

        print(f"✅ Successfully generated: {output_path}")
        print(f"📊 Total plugins: {len(plugins)}")

        # Show category breakdown
        categories = {}
        for plugin in plugins:
            category = plugin['category']
            categories[category] = categories.get(category, 0) + 1

        print("\n📋 Category breakdown:")
        for category, count in sorted(categories.items()):
            print(f"  - {CATEGORY_NAMES[category]}: {count}")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)


if __name__ == '__main__':
    main()
