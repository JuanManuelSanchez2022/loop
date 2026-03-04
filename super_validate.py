import re
import sys
import os

def validate_file(file_path):
    if not os.path.exists(file_path):
        print(f"File {file_path} does not exist.")
        return
        
    print(f"\nScanning {file_path}...")
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return
    
    found = False
    for i, line in enumerate(lines):
        line_num = i + 1
        # Find single backslash NOT preceded by another backslash
        matches = re.finditer(r'(?<!\\)\\([^\\"\'rntbfv0-7])', line)
        for m in matches:
            char = m.group(1)
            start = m.start()
            
            is_valid = False
            if char == 'u':
                if start + 5 < len(line):
                    if re.match(r'[0-9a-fA-F]{4}', line[start+2:start+6]): is_valid = True
                if not is_valid and start + 2 < len(line) and line[start+2] == '{':
                    if '}' in line[start:start+20]: is_valid = True
            elif char == 'x':
                if start + 3 < len(line):
                    if re.match(r'[0-9a-fA-F]{2}', line[start+2:start+4]): is_valid = True
            elif char == 'U':
                if start + 9 < len(line):
                    if re.match(r'[0-9a-fA-F]{8}', line[start+2:start+10]): is_valid = True
            
            if not is_valid:
                snippet = line[start:start+30].replace('\n', '\\n')
                print(f"Line {line_num}, Pos {start+1}: \\{char} -> {repr(snippet)}")
                found = True
                
    if not found:
        print("No invalid escapes found in " + file_path)

if __name__ == "__main__":
    validate_file('dev_bundle.js')
    validate_file('bundle.js')
    # Scan and find newest .hbc or .bundle in dist
    for root, dirs, files in os.walk('dist'):
        for file in files:
            if file.endswith('.js'):
                validate_file(os.path.join(root, file))
