import os

def check_file(filepath):
    try:
        with open(filepath, 'rb') as f:
            content = f.read()
        
        for i, byte in enumerate(content):
            if not (32 <= byte <= 126 or byte in (9, 10, 13)):
                # Search for line/col
                try:
                    text = content.decode('utf-8', errors='ignore')
                    lines = text.splitlines()
                    count = 0
                    for line_idx, line in enumerate(lines):
                        if count + len(line) + 1 > i:
                            char_idx = i - count
                            print(f"File: {filepath}, Line: {line_idx+1}, CharCode: {byte}, Pos: {char_idx}")
                            return
                        count += len(line) + 1
                    print(f"File: {filepath} contains unusual char {byte} at byte {i}")
                    return
                except:
                    print(f"File: {filepath} contains unusual char {byte} at byte {i}")
                    return
    except Exception as e:
        pass

def walk_all(root_dir):
    for root, dirs, files in os.walk(root_dir):
        if 'node_modules' in root or '.git' in root or '.expo' in root or 'dist' in root or '.idea' in root:
            continue
        for file in files:
            if file.endswith(('.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip', '.lock', '.json')):
                continue
            ext = os.path.splitext(file)[1].lower()
            if ext in ('.js', '.jsx', '.ts', '.tsx', '.env', '.md', '.txt', '.py'):
                check_file(os.path.join(root, file))

if __name__ == "__main__":
    walk_all('.')
