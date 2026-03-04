
import re
import sys

def find_malformed_escapes(file_path):
    print(f"Checking {file_path} for malformed escape sequences...")
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        print(f"Error: {e}")
        return

    # Look for \u, \x, \U not preceded by \
    # We use a non-capturing group for the lookbehind to avoid issues
    matches = re.finditer(r'(?<!\\)\\([uUx])', content)
    
    found = False
    for m in matches:
        char = m.group(1)
        pos = m.start()
        
        # Check if it's a valid escape
        is_valid = False
        if char == 'u':
            if pos + 5 < len(content) and re.match(r'[0-9a-fA-F]{4}', content[pos+2:pos+6]):
                is_valid = True
            elif pos + 2 < len(content) and content[pos+2] == '{':
                end = content.find('}', pos)
                if end != -1 and end - pos < 10:
                    is_valid = True
        elif char == 'x':
            if pos + 3 < len(content) and re.match(r'[0-9a-fA-F]{2}', content[pos+2:pos+4]):
                is_valid = True
        elif char == 'U':
            # \U is NOT a standard JS escape.
            is_valid = False

        if not is_valid:
            # Find line/col
            line = content.count('\n', 0, pos) + 1
            col = pos - content.rfind('\n', 0, pos)
            snippet = content[max(0, pos-20):pos+40].replace('\n', '\\n')
            print(f"BAD ESCAPE \\{char} at {line}:{col}")
            print(f"Context: {snippet}")
            print(" " * (20 + 9) + "^") 
            found = True

    if not found:
        print("No malformed escapes found.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        find_malformed_escapes(sys.argv[1])
    else:
        print("Usage: python find_malformed_paths.py <file>")
