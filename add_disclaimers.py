#!/usr/bin/env python3
"""Add legal disclaimers to all tool pages that don't have one yet."""

import os
import re

# Disclaimer template
DISCLAIMER = '''<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.15);border-radius:12px;padding:1.2rem;margin-bottom:1.5rem;">
    <p style="color:#fbbf24;font-weight:600;margin-bottom:0.5rem;">⚠️ Hinweis</p>
    <p style="color:var(--text-muted);font-size:0.85rem;line-height:1.6;">Dieser Rechner dient nur der Orientierung. Die berechneten Werte sind unverbindlich. Konsultiere im Zweifel einen Fachmann (Steuerberater, Arzt, etc.). Wir übernehmen keine Haftung für Folgen aus der Nutzung.</p>
</div>'''

# Tools that already have disclaimers (checked manually)
DISCLAIMER_TOOLS = {
    'rechnungsgenerator', 'angebotsrechner', 'werkzeug-afa-rechner',
    'stundensatz-rechner', 'freelancer-rechner', 'ust-rechner'
}

def add_disclaimer_to_file(filepath):
    """Add disclaimer to a single HTML file if not present."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Skip if already has disclaimer
    if 'Rechtlicher Hinweis' in content or '⚠️ Hinweis' in content:
        print(f"  ✓ Already has disclaimer: {filepath}")
        return False
    
    # Find the tool-interface div and add disclaimer after it opens
    # Pattern: <div class="tool-interface"> or <div class="tool-interface">
    pattern = r'(<div class="tool-interface">)'
    match = re.search(pattern, content)
    
    if match:
        # Insert disclaimer right after the opening tag
        insert_pos = match.end()
        new_content = content[:insert_pos] + '\n' + DISCLAIMER + '\n' + content[insert_pos:]
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  ✓ Added disclaimer: {filepath}")
        return True
    else:
        print(f"  - No tool-interface found: {filepath}")
        return False

def main():
    base_dir = '.'
    modified_count = 0
    
    # Iterate through all directories
    for item in os.listdir(base_dir):
        item_path = os.path.join(base_dir, item)
        
        # Skip non-directories and special folders
        if not os.path.isdir(item_path):
            continue
        if item in ['blog', 'impressum', 'datenschutz', 'guides', 'test', '.git', '__pycache__']:
            continue
        
        # Look for index.html in each tool directory
        index_file = os.path.join(item_path, 'index.html')
        if os.path.exists(index_file):
            print(f"\nChecking: {item}/")
            if add_disclaimer_to_file(index_file):
                modified_count += 1
    
    print(f"\n✅ Done! Added disclaimers to {modified_count} tools.")

if __name__ == '__main__':
    main()