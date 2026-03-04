
import os
import re

def search_for_unescaped_paths(root_dir):
    print(f"Searching for unescaped Windows paths in {root_dir}...")
    # Matches like "C:\Users" or 'C:\Users' (single backslash before U)
    # Also check other drive letters just in case
    pattern = re.compile(r'["\'][A-Za-z]:\\[UuXx]')
    
    for root, dirs, files in os.walk(root_dir):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.git' in dirs:
            dirs.remove('.git')
        if '.expo' in dirs:
            dirs.remove('.expo')
        
        for file in files:
            if file.endswith(('.js', '.ts', '.jsx', '.tsx', '.json')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        for i, line in enumerate(f, 1):
                            if pattern.search(line):
                                print(f"POTENTIAL ISSUE in {file_path}:{i}")
                                print(f"  Line: {line.strip()}")
                except Exception as e:
                    pass

if __name__ == "__main__":
    search_for_unescaped_paths('.')
