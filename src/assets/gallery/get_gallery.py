import os
import json

def get_directory_structure(rootdir):
    """
    Creates a nested dictionary that represents the folder structure of rootdir
    """
    dir_structure = {}
    for dirpath, dirnames, filenames in os.walk(rootdir):
        folders = dirpath.split(os.sep)
        current_dir = dir_structure
        for folder in folders:
            current_dir = current_dir.setdefault(folder, {})
        current_dir['files'] = [f for f in filenames if f.endswith('.jpg') or f.endswith('.png')]
    return dir_structure

def write_to_json(data, output_file):
    """
    Writes the given data to a JSON file
    """
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=4)

if __name__ == '__main__':
    directory_path = "."  # Replace this with your directory path
    output_file = "gallery.json"  # Output file name

    directory_structure = get_directory_structure(directory_path)
    write_to_json(directory_structure, output_file)
    print(f"Directory structure saved to {output_file}")
