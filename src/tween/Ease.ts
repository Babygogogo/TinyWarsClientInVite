

export function get(amount: number): (num: number) => number {
    if (amount < -1) {
        amount = -1;
    }
    if (amount > 1) {
        amount = 1;
    }
    return function (t) {
        if (amount == 0) {
            return t;
        }
        if (amount < 0) {
            return t * (t * -amount + 1 + amount);
        }
        return t * ((2 - t) * amount + (1 - amount));
    };
}

export function getPowIn(pow: number): (num: number) => number {
    return function (t) {
        return Math.pow(t, pow);
    };
}

export function getPowOut(pow: number): (num: number) => number {
    return function (t) {
        return 1 - Math.pow(1 - t, pow);
    };
}

export function getPowInOut(pow: number): (num: number) => number {
    return function (t) {
        if ((t *= 2) < 1)
            return 0.5 * Math.pow(t, pow);
        return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
    };
}

export function sineIn(t: number): number {
    return 1 - Math.cos(t * Math.PI / 2);
}

export function sineOut(t: number): number {
    return Math.sin(t * Math.PI / 2);
}

export function sineInOut(t: number): number {
    return -0.5 * (Math.cos(Math.PI * t) - 1);
}

export function getBackIn(amount: number): (num: number) => number {
    return function (t) {
        return t * t * ((amount + 1) * t - amount);
    };
}

export function getBackOut(amount: number): (num: number) => number {
    return function (t) {
        return (--t * t * ((amount + 1) * t + amount) + 1);
    };
}

export function getBackInOut(amount: number): (num: number) => number {
    amount *= 1.525;
    return function (t) {
        if ((t *= 2) < 1)
            return 0.5 * (t * t * ((amount + 1) * t - amount));
        return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
    };
}

export function circIn(t: number): number {
    return -(Math.sqrt(1 - t * t) - 1);
}

export function circOut(t: number): number {
    return Math.sqrt(1 - (--t) * t);
}

export function circInOut(t: number): number {
    if ((t *= 2) < 1) {
        return -0.5 * (Math.sqrt(1 - t * t) - 1);
    }
    return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
}

export function bounceIn(t: number): number {
    return 1 - bounceOut(1 - t);
}

export function bounceOut(t: number): number {
    if (t < 1 / 2.75) {
        return (7.5625 * t * t);
    }
    else if (t < 2 / 2.75) {
        return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
    }
    else if (t < 2.5 / 2.75) {
        return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
    }
    else {
        return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
    }
}

export function bounceInOut(t: number): number {
    if (t < 0.5) {
        return bounceIn(t * 2) * .5;
    }
    return bounceOut(t * 2 - 1) * 0.5 + 0.5;
}

export function getElasticIn(amplitude: number, period: number): (num: number) => number {
    const pi2 = Math.PI * 2;
    return function (t) {
        if (t == 0 || t == 1)
            return t;
        const s = period / pi2 * Math.asin(1 / amplitude);
        return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
    };
}

export function getElasticOut(amplitude: number, period: number): (num: number) => number {
    const pi2 = Math.PI * 2;
    return function (t) {
        if (t == 0 || t == 1)
            return t;
        const s = period / pi2 * Math.asin(1 / amplitude);
        return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1);
    };
}

export function getElasticInOut(amplitude: number, period: number): (num: number) => number {
    const pi2 = Math.PI * 2;
    return function (t) {
        const s = period / pi2 * Math.asin(1 / amplitude);
        if ((t *= 2) < 1)
            return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
        return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
    };
}

export const quadIn         = getPowIn(2);
export const quadOut        = getPowOut(2);
export const quadInOut      = getPowInOut(2);
export const cubicIn        = getPowIn(3);
export const cubicOut       = getPowOut(3);
export const cubicInOut     = getPowInOut(3);
export const quartIn        = getPowIn(4);
export const quartOut       = getPowOut(4);
export const quartInOut     = getPowInOut(4);
export const quintIn        = getPowIn(5);
export const quintOut       = getPowOut(5);
export const quintInOut     = getPowInOut(5);
export const backIn         = getBackIn(1.7);
export const backOut        = getBackOut(1.7);
export const backInOut      = getBackInOut(1.7);
export const elasticIn      = getElasticIn(1, 0.3);
export const elasticOut     = getElasticOut(1, 0.3);
export const elasticInOut   = getElasticInOut(1, 0.3 * 1.5);
