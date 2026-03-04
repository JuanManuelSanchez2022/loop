
import re
import sys

def find_single_backslashes(file_path):
    print(f"Scanning {file_path} for single backslashes followed by U, u, or x...")
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        print(f"Error: {e}")
        return

    # Regex for single \ followed by U, u, or x
    # Negative lookbehind for another \
    # Positive lookahead for U, u, or x
    pattern = r'(?<!\\)\\([Uux])'
    matches = re.finditer(pattern, content)
    
    found = False
    for m in matches:
        char = m.group(1)
        pos = m.start()
        
        # Check if it's a valid escape
        is_valid = False
        if char == 'u':
            # Valid if \uXXXX or \u{X...}
            if pos + 5 < len(content) and re.match(r'[0-9a-fA-F]{4}', content[pos+2:pos+6]):
                is_valid = True
            elif pos + 2 < len(content) and content[pos+2] == '{':
                end = content.find('}', pos)
                if end != -1 and end - pos < 10:
                    is_valid = True
        elif char == 'x':
            # Valid if \xXX
            if pos + 3 < len(content) and re.match(r'[0-9a-fA-F]{2}', content[pos+2:pos+4]):
                is_valid = True
        elif char == 'U':
            # \U is never valid in standard JS
            is_valid = False

        if not is_valid:
            line = content.count('\n', 0, pos) + 1
            col = pos - content.rfind('\n', 0, pos)
            snippet = content[max(0, pos-40):pos+60].replace('\n', '\\n')
            print(f"FOUND INVALID ESCAPE \\{char} at {line}:{col}")
            print(f"  Context: {snippet}")
            found = True

    if not found:
        print("No invalid single backslash escapes found.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        find_single_backslashes(sys.argv[1])
    else:
        print("Usage: python find_single_backslash_u.py <file>")
