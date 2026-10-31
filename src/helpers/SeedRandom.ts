interface State {
    i?  : number | null | undefined;
    j?  : number | null | undefined;
    S   : number[];
}

export interface IGenerator {
    getNext(): number;
    quick(): number;
    int32(): number;
    double(): number;
    state(): State;
}

interface SeedRandomOptions {
    state?      : boolean | State;
}

//
// The following constants are related to IEEE 754 limits.
//

// Detect the global object, even if operating in strict mode.
// http://stackoverflow.com/a/14387057/265298
// var global = (0, eval)('this'),
const width         = 256;                      // each RC4 output is 0 <= x < 256
const chunks        = 6;                        // at least six RC4 outputs for each double
const digits        = 52;                       // there are 52 significant digits in a double
const startDenom    = Math.pow(width, chunks);
const significance  = Math.pow(2, digits);
const overflow      = significance * 2;
const mask          = width - 1;

// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
class Arc4 {
    public i    = 0;
    public j    = 0;
    public S    : number[] = [];

    public constructor(key: number[]) {
        // The empty key [] is treated as [0].
        let keylen = key.length;
        if (!keylen) {
            key = [keylen++];
        }

        // Set up S using the standard key scheduling algorithm.
        const s = this.S;
        let i   = 0;
        while (i < width) {
            s[i] = i++;
        }

        let j   = 0;
        let t   : number;
        for (i = 0; i < width; i++) {
            s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
            s[j] = t;
        }

        this.g(width);
    }

    // The "g" method returns the next (count) outputs as one number.
    public g(count: number): number {
        // Using instance members instead of closure state nearly doubles speed.
        const s = this.S;
        let i   = this.i;
        let j   = this.j;
        let r   = 0;
        let t   : number;
        while (count--) {
            t = s[i = mask & (i + 1)];
            r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
        }

        this.i = i;
        this.j = j;

        return r;
        // For robust unpredictability, the function call below automatically
        // discards an initial batch of values.  This is called RC4-drop[256].
        // See http://google.com/search?q=rsa+fluhrer+response&btnI
    }

    public exportState(): State {
        return {
            i : this.i,
            j : this.j,
            S : this.S.slice(),
        };
    }
    public importState(state: State): void {
        this.i = state.i ?? 0;
        this.j = state.j ?? 0;
        this.S = state.S.slice();
    }
}

// Converts an array of char codes to a string
function toString(a: number[] | Uint8Array): string {
    return String.fromCharCode.apply(0, a as number[]);
}

// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
function mixKey(seed: number | string, key: number[]): string {
    const stringSeed = seed + '';
    let smear: any, j = 0;
    while (j < stringSeed.length) {
        key[mask & j] =
            mask & ((smear ^= key[mask & j] * 19) + stringSeed.charCodeAt(j++));
    }
    return toString(key);
}

// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
function autoSeed(pool: number[]): string {
    try {
        const out = new Uint8Array(width);
        window.crypto.getRandomValues(out);
        return toString(out);
    } catch (e) {
        // const plugins = window.navigator?.plugins;
        // return [
        //     +new Date,
        //     window,
        //     plugins,
        //     window.screen,
        //     toString(pool)
        // ];
        return toString(pool.concat(Math.random()));
    }
}

const pool: number[] = [];
mixKey(Math.random(), pool);

export class Generator implements IGenerator {
    private readonly _arc4: Arc4;

    public constructor(seed?: string, options: SeedRandomOptions = {}) {
        const key: number[] = [];
        mixKey(seed ?? autoSeed(pool), key);

        // This function returns a random double in [0, 1) that contains
        // randomness in every bit of the mantissa of the IEEE 754 value.
        this._arc4 = new Arc4(key);

        // Mix the randomness into accumulated entropy.
        mixKey(toString(this._arc4.S), pool);

        const state = options.state;
        if ((state) && (typeof state === 'object') && (state.S)) {
            this._arc4.importState(state);
        }
    }

    public getNext(): number {
        let n = this._arc4.g(chunks),       // Start with a numerator n < 2 ^ 48
            d = startDenom,                 //   and denominator d = 2 ^ 48.
            x = 0;                          //   and no 'extra last byte'.
        while (n < significance) {          // Fill up all significant digits by
            n = (n + x) * width;            //   shifting numerator and
            d *= width;                     //   denominator and generating a
            x = this._arc4.g(1);            //   new least-significant-byte.
        }
        while (n >= overflow) {             // To avoid rounding up, before adding
            n /= 2;                         //   last byte, shift everything
            d /= 2;                         //   right using integer math until
            x >>>= 1;                       //   we have exactly the desired bits.
        }
        return (n + x) / d;                 // Form the number within [0, 1).
    }
    public int32(): number {
        return this._arc4.g(4) | 0;
    }
    public quick(): number {
        return this._arc4.g(4) / 0x100000000;
    }
    public state(): State {
        return this._arc4.exportState();
    }
    public double(): number {
        return this.getNext();
    }
}
