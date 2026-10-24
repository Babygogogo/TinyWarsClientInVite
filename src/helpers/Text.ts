import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";

export function checkIsCharInRange(char: string, minChar: string, maxChar: string): boolean {
    return (char >= minChar) && (char <= maxChar);
}

export function format(...args: (AuxiliaryTypesAuxiliaryTypes.Undefinable<number | string>)[]): string {
    let i = 0, a: any, f = args[i++] as string, m: any[] | null, p, c, x;
    const o = [], s = '';

    while (f) {
        m = /^[^\x25]+/.exec(f);
        if (m) {
            o.push(m[0]);
            f = f.substring(m[0].length);
            continue;
        }

        m = /^\x25{2}/.exec(f);
        if (m) {
            o.push('%');
            f = f.substring(m[0].length);
            continue;
        }

        m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f);
        if (m) {
            if (((a = args[m[1] || i++]) == null) || (a == null)) {
                throw ('Too few arguments.');
            }
            if (/[^s]/.test(m[7])) {
                const aa = Number(a);
                if (isNaN(aa)) {
                    throw ('Expecting number but found ' + typeof (a));
                } else {
                    a = aa;
                }
            }
            switch (m[7]) {
                case 'b': a = a.toString(2); break;
                case 'c': a = String.fromCharCode(a); break;
                case 'i': a = parseInt(a); break;
                case 'd': a = parseInt(a); break;
                case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
                case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
                case 'o': a = a.toString(8); break;
                case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
                case 'u': a = Math.abs(a); break;
                case 'x': a = a.toString(16); break;
                case 'X': a = a.toString(16).toUpperCase(); break;
            }
            a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+' + a : a);
            c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
            x = m[5] - String(a).length - s.length;
            p = m[5] ? repeat(c, x) : '';
            o.push(s + (m[4] ? a + p : p + a));
            f = f.substring(m[0].length);
            continue;
        }

        throw ('Huh ?!');
    }

    return o.join('');
}

/** 获取一个整数的位数。不计负数的符号；0-9计为1；10-99计为2；以此类推 */
export function getDigitsCount(num: number): number {
    num = Math.abs(num);
    let count = 1;
    while (num >= 10) {
        ++count;
        num = Math.floor(num / 10);
    }

    return count;
}

export function getNumText(num: number, targetLength = 2): string {
    return repeat("0", targetLength - getDigitsCount(num)) + num;
}
export function getSignedNumText(num: number): string {
    return num >= 0 ? `+${num}` : `${num}`;
}

export function getSuffixForRankIndex(rank: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): string | null {
    if (rank == null) {
        return null;
    } else {
        if (Math.floor(rank / 10) % 10 === 1) {
            return `th`;
        } else {
            const num = rank % 10;
            if (num === 1) {
                return `st`;
            } else if (num === 2) {
                return `nd`;
            } else if (num === 3) {
                return `rd`;
            } else {
                return `th`;
            }
        }
    }
}

export function getTextColor(value: number, defaultValue: number, isLessBetter = false): number {
    if (value > defaultValue) {
        return isLessBetter ? 0xFF0000 : 0x00FF00;
    } else if (value < defaultValue) {
        return isLessBetter ? 0x00FF00 : 0xFF0000;
    } else {
        return 0xFFFFFF;
    }
}

export function getTruncatedText(text: string, limit: number): string {
    text = text.trim().replace(/\n/g, ` `);
    if (text.length <= limit) {
        return text;
    } else {
        return `${text.substring(0, limit)}...`;
    }
}

export function repeat(str: string, times: number): string {
    return (new Array(Math.max(times, 0) + 1)).join(str);
}
