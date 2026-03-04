
import re
import os
import sys

def scan_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        return

    # Regex for a single \ followed by anything
    # We want to identify \uXXXX, \u{...}, \xXX and report anything else that looks like a path leak
    pattern = r'(?<!\\)\\([a-zA-Z])'
    matches = re.finditer(pattern, content)
    
    for m in matches:
        char = m.group(1)
        pos = m.start()
        
        is_known_good = char in 'nrtbfv"\'\\'
        is_unicode = False
        if char == 'u':
            # Check for \uXXXX or \u{X...}
            if pos + 5 < len(content) and re.match(r'[0-9a-fA-F]{4}', content[pos+2:pos+6]):
                is_unicode = True
            elif pos + 2 < len(content) and content[pos+2] == '{':
                end = content.find('}', pos)
                if end != -1 and end - pos < 10:
                    is_unicode = True
        elif char == 'x':
            if pos + 3 < len(content) and re.match(r'[0-9a-fA-F]{2}', content[pos+2:pos+4]):
                is_unicode = True
        
        if not is_known_good and not is_unicode:
            # Check context: is it likely a path?
            snippet = content[max(0, pos-10):pos+30].replace('\n', '\\n')
            # If it's something like \Users, \Documents, \OneDrive, it's a bug!
            # These often happen when a Windows path is injected.
            line = content.count('\n', 0, pos) + 1
            col = pos - content.rfind('\n', 0, pos)
            
            # Special check for \U which is a major suspect for 'invalid unicode escape'
            if char.upper() == 'U':
                print(f"CRITICAL: Found \\{char} at {file_path}:{line}:{col}")
                print(f"  Context: {snippet}")
            else:
                # Optionally report other unknown escapes if they look like paths
                if any(p in snippet for p in [':\\', 'Users', 'Proyectos', 'Documents']):
                    print(f"PATH LEAK: Found \\{char} at {file_path}:{line}:{col}")
                    print(f"  Context: {snippet}")

def scan_dir(root_dir):
    print(f"Scanning directory {root_dir}...")
    for root, dirs, files in os.walk(root_dir):
        if any(d in root for d in ['node_modules', '.git', '.expo']):
            continue
        for file in files:
            if file.endswith(('.js', '.ts', '.jsx', '.tsx', '.json')):
                scan_file(os.path.join(root, file))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if os.path.isdir(sys.argv[1]):
            scan_dir(sys.argv[1])
        else:
            scan_file(sys.argv[1])
    else:
        scan_dir('.')
