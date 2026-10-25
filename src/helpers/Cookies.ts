import Cookies from "js-cookie";

export function setValue(key: string, value: string): void {
    Cookies.set(key, value, { expires: 365 });
}

export function getInt(key: string): number | null {
    const value = Cookies.get(key);
    if (value == null) {
        return null;
    }
    const result = parseInt(value);
    return isNaN(result) ? null : result;
}

export function getFloat(key: string): number | null {
    const value = Cookies.get(key);
    if (value == null) {
        return null;
    }
    const result = parseFloat(value);
    return isNaN(result) ? null : result;
}

export function getString(key: string): string | null {
    return Cookies.get(key) ?? null;
}
