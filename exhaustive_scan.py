import re
import os

def exhaustive_scan(file_path):
    print(f"Scanning {file_path}...")
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return
    
    # regex for \ followed by anything that isn't a known escape or valid u/x
    matches = re.finditer(r'(?<!\\)\\([uUx][^{])|\\\\u|\\\\x', content)
    # Actually, let's just find all \u, \x, \U
    matches = re.finditer(r'(?<!\\)\\([uUx])', content)
    
    found = False
    for m in matches:
        char = m.group(1)
        pos = m.start()
        
        is_valid = False
        if char == 'u':
            if pos + 5 < len(content):
                if re.match(r'[0-9a-fA-F]{4}', content[pos+2:pos+6]): is_valid = True
            if not is_valid and pos + 2 < len(content) and content[pos+2] == '{':
                end_brace = content.find('}', pos)
                if end_brace != -1 and end_brace - pos < 10: is_valid = True
        elif char == 'x':
            if pos + 3 < len(content):
                if re.match(r'[0-9a-fA-F]{2}', content[pos+2:pos+4]): is_valid = True
        elif char == 'U':
            if pos + 9 < len(content):
                if re.match(r'[0-9a-fA-F]{8}', content[pos+2:pos+10]): is_valid = True
        
        if not is_valid:
            line_num = content.count('\n', 0, pos) + 1
            col = pos - content.rfind('\n', 0, pos)
            snippet = content[pos:pos+30].replace('\n', '\\n')
            print(f"INVALID \\{char} at {line_num}:{col} -> {snippet}")
            found = True
            
    if not found:
        print("No problematic escapes found.")

if __name__ == "__main__":
    import sys
    target = 'dev_bundle.js'
    if len(sys.argv) > 1:
        target = sys.argv[1]
    exhaustive_scan(target)
