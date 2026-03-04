import re
import sys

def validate_bundle(file_path, target_line=None):
    print(f"Validating {file_path}...")
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    total_lines = len(lines)
    print(f"Total lines: {total_lines}")

    if target_line and 0 < target_line <= total_lines:
        line_content = lines[target_line - 1]
        print(f"\nTarget Line {target_line}:")
        print(f"Length: {len(line_content)}")
        # Use repr to see exact characters
        print(f"Content: {repr(line_content)}")
        
        # Look for unicode escapes in this line
        print("\nEscapes in target line:")
        matches = re.finditer(r'(?<!\\)\\([uUx])', line_content)
        for m in matches:
            char = m.group(1)
            pos = m.start()
            snippet = line_content[pos:pos+15]
            print(f"Pos {pos+1}: \\{char} -> {repr(snippet)}")

    print("\nGlobal Scan for invalid single-backslash escapes:")
    invalid_found = False
    for i, line in enumerate(lines):
        line_num = i + 1
        matches = re.finditer(r'(?<!\\)\\([uUx])', line)
        for m in matches:
            char = m.group(1)
            start = m.start()
            
            is_valid = False
            if char == 'u':
                if start + 5 < len(line):
                    hex_part = line[start+2:start+6]
                    if re.match(r'[0-9a-fA-F]{4}', hex_part):
                        is_valid = True
                if not is_valid and start + 2 < len(line) and line[start+2] == '{':
                    if '}' in line[start:start+15]:
                        is_valid = True
            elif char == 'x':
                if start + 3 < len(line):
                    hex_part = line[start+2:start+4]
                    if re.match(r'[0-9a-fA-F]{2}', hex_part):
                        is_valid = True
            elif char == 'U':
                if start + 9 < len(line):
                    hex_part = line[start+2:start+10]
                    if re.match(r'[0-9a-fA-F]{8}', hex_part):
                        is_valid = True
            
            if not is_valid:
                snippet = line[start:start+20].replace('\n', '\\n')
                print(f"Line {line_num}, Pos {start+1}: \\{char} -> {repr(snippet)}")
                invalid_found = True

    if not invalid_found:
        print("No invalid single-backslash escapes found.")

if __name__ == "__main__":
    validate_bundle('dev_bundle.js', target_line=173145)
