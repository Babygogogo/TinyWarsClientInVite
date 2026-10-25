
import { $warn } from "./Egret";

export function getItem(key: string): string | null {
    return window.localStorage.getItem(key);
}

export function setItem(key: string, value: string): boolean {
    try {
        window.localStorage.setItem(key, value);
        return true;
    } catch {
        $warn(1047, key, value);
        return false;
    }
}

export function removeItem(key: string): void {
    window.localStorage.removeItem(key);
}

export function clear(): void {
    window.localStorage.clear();
}
