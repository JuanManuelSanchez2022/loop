import os

def find_invalid_unicode(root_dir):
    print(f"Scanning {root_dir}...")
    for root, dirs, files in os.walk(root_dir):
        if '.cache' in root: continue
        for file in files:
            if not file.endswith('.js'): continue
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'rb') as f:
                    content = f.read()
            except:
                continue

            i = 0
            while i < len(content) - 1:
                if content[i] == 92 and content[i+1] == 117:
                    count = 0
                    j = i - 1
                    while j >= 0 and content[j] == 92:
                        count += 1
                        j -= 1
                    
                    if count % 2 == 0:
                        valid = False
                        if i + 5 < len(content):
                            hex_part = content[i+2:i+6]
                            if all((ord('0') <= c <= ord('9')) or (ord('a') <= c <= ord('f')) or (ord('A') <= c <= ord('F')) for c in hex_part):
                                valid = True
                        if not valid and i + 2 < len(content) and content[i+2] == ord('{'):
                            k = i + 3
                            while k < len(content) and k < i + 15:
                                if content[k] == ord('}'):
                                    valid = True
                                    break
                                k += 1
                        
                        if not valid:
                            try:
                                snippet = content[max(0, i-10):min(len(content), i+30)].decode('utf-8', errors='ignore').replace('\n', '\\n')
                                print(f"INVALID UNICODE in {file_path} -> {snippet}")
                            except:
                                pass
                i += 1

if __name__ == "__main__":
    find_invalid_unicode('node_modules')
    find_invalid_unicode('src')
    find_invalid_unicode('.')
baundary update
