export class TextReader {
    private _str    : string;
    private _index  = 0;

    public constructor(str: string) {
        this._str = str;
    }

    public read(): string | null {
        const length = this._str.length;
        if (this._index >= length) {
            return null;
        }

        return this._str[this._index++];
    }
}
