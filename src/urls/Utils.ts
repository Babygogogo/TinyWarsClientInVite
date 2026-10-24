export function checkIsValidHttp(url: string): boolean {
    try {
        const protocol = new URL(url).protocol;
        return protocol === 'http:' || protocol === 'https:';
    } catch (err) {
        return false;
    }
}
