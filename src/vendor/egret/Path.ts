
export function normalize(filename: string): string {
    const arr: string[] = filename.split("/");
    return arr.filter((value: string, index: number): boolean => !!value || index == arr.length - 1).join("/");
}

export function basename(filename: string): string {
    return filename.substr(filename.lastIndexOf("/") + 1);
}

export function dirname(path: string): string {
    return path.substr(0, path.lastIndexOf("/"));
}
