import type * as web from "./WebCore";
import type * as sys from "./SysCore";
import type * as processor from "./ProcessorCore";

interface RuntimeModules {
    web: typeof web;
    sys: typeof sys;
    processor: typeof processor;
}

let modules: RuntimeModules | undefined;

function getModules(): RuntimeModules {
    if (!modules) {
        throw new Error("Egret runtime is not initialized. Import a public Egret module instead of a Core module.");
    }
    return modules;
}

export function initializeRuntime(value: RuntimeModules): void {
    modules = value;
}

export const runtime = {
    get web(): typeof web {
        return getModules().web;
    },
    get sys(): typeof sys {
        return getModules().sys;
    },
    get processor(): typeof processor {
        return getModules().processor;
    },
};
