import os

def print_structure(path='.', prefix='', level=0, max_level=3):
    if level > max_level:
        return
    try:
        items = sorted(os.listdir(path))
    except PermissionError:
        return  # skip folders we can't access

    for i, item in enumerate(items):
        full_path = os.path.join(path, item)
        connector = '└── ' if i == len(items) - 1 else '├── '
        print(prefix + connector + item)
        if os.path.isdir(full_path):
            extension = '    ' if i == len(items) - 1 else '│   '
            print_structure(full_path, prefix + extension, level + 1, max_level)

# Run it
print_structure('.', max_level=2)
