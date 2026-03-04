import re

def find_invalid_unicode(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        for line_num, line in enumerate(f, 1):
            matches = re.finditer(r'\\u', line)
            for m in matches:
                start = m.start()
                if start + 6 <= len(line):
                    hex_part = line[start+2:start+6]
                    if re.match(r'[0-9a-fA-F]{4}', hex_part):
                        continue
                if start + 2 < len(line) and line[start+2] == '{':
                    if '}' in line[start:]:
                        continue
                print(f"Potential invalid unicode escape at {line_num}:{start+1}")
                print(f"Snippet: {line[start:start+20]}")

if __name__ == "__main__":
    find_invalid_unicode('dev_bundle.js')
