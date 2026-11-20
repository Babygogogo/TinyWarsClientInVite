import commonTextUrl from "./CommonText.json?url&no-inline";

export const CommonText: Record<number, string[]> = {};

let _initPromise: Promise<void> | undefined;

export function init(): Promise<void> {
    return _initPromise ??= _load().catch((error: unknown) => {
        _initPromise = undefined;
        throw error;
    });
}

async function _load(): Promise<void> {
    const response = await fetch(commonTextUrl);
    if (!response.ok) {
        throw new Error(`Failed to load CommonText: HTTP ${response.status}`);
    }

    const data: unknown = await response.json();
    if ((data == null) || (typeof data !== "object") || Array.isArray(data)) {
        throw new Error("Invalid CommonText: expected a text dictionary");
    }

    const entries = Object.entries(data);
    if (!entries.length) {
        throw new Error("Invalid CommonText: empty text dictionary");
    }

    for (const [key, texts] of entries) {
        if ((!/^(0|[1-9]\d*)$/.test(key))                               ||
            (!Array.isArray(texts))                                     ||
            (texts.length !== 3)                                        ||
            (!texts.every((text: unknown) => typeof text === "string"))
        ) {
            throw new Error(`Invalid CommonText entry: ${key}`);
        }
        CommonText[Number(key)] = texts;
    }
}
