import sys

def inspect_location(file_path, line_num, col_num):
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            for i, line in enumerate(f, 1):
                if i == line_num:
                    print(f"Line {line_num}, Column {col_num}:")
                    # Show context around the column
                    start = max(0, col_num - 50)
                    end = min(len(line), col_num + 50)
                    print(f"Snippet: ...{line[start:end]}...")
                    # Point to the exact column
                    pointer = " " * (col_num - start + 10) + "^"
                    print(pointer)
                    return
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python inspect_location.py <file> <line> <col>")
    else:
        inspect_location(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]))
