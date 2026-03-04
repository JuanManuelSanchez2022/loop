import re

def find_single_backslash_u(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        for line_num, line in enumerate(f, 1):
            # Find \u that is NOT preceded by another \
            # using a negative lookbehind.
            for match in re.finditer(r'(?<!\\)\\u', line):
                # Check if it's followed by 4 hex digits (valid unicode)
                start = match.start()
                suffix = line[start+2:start+6]
                if not re.match(r'[0-9a-fA-F]{4}', suffix):
                    print(f"FOUND invalid \\u at {line_num}:{start+1}")
                    print(f"Context: {line[max(0, start-40):min(len(line), start+40)].strip()}")

if __name__ == "__main__":
    find_single_backslash_u('dev_bundle.js')
