import {
    Egret_Egret,
} from "./internal.ts";

const LogLevel = {
    All   : 0,
    Trace : 1,
    Debug : 2,
    Log   : 3,
    Info  : 4,
    Warn  : 5,
    Error : 6,
    Off   : 0xFFFFFFFF,
} as const;

const CONSOLE           = window.console;
const LOG_LEVEL: number = window.CLIENT_VERSION === "DEVELOP" ? LogLevel.All : LogLevel.Off;
const IS_ASSERT_ENABLED = true;

export function trace(...rest: unknown[]): void {
    if (LOG_LEVEL <= LogLevel.Trace) {
        if (Egret_Egret.Capabilities.isMobile) {
            CONSOLE.trace(rest.join(" "));
        } else {
            CONSOLE.trace(...rest);
        }
    }
}

export function debug(...rest: unknown[]): void {
    if (LOG_LEVEL <= LogLevel.Debug) {
        if (Egret_Egret.Capabilities.isMobile) {
            CONSOLE.debug(rest.join(" "));
        } else {
            CONSOLE.debug(...rest);
        }
    }
}

export function log(...rest: unknown[]): void {
    if (LOG_LEVEL <= LogLevel.Log) {
        if (Egret_Egret.Capabilities.isMobile) {
            CONSOLE.log(rest.join(" "));
        } else {
            CONSOLE.log(...rest);
        }
    }
}

export function info(...rest: unknown[]): void {
    if (LOG_LEVEL <= LogLevel.Info) {
        if (Egret_Egret.Capabilities.isMobile) {
            CONSOLE.info(rest.join(" "));
        } else {
            CONSOLE.info(...rest);
        }
    }
}

export function warn(...rest: unknown[]): void {
    if (LOG_LEVEL <= LogLevel.Warn) {
        if (Egret_Egret.Capabilities.isMobile) {
            CONSOLE.warn(rest.join(" "));
        } else {
            CONSOLE.warn(...rest);
        }
    }
}

export function error(...rest: unknown[]): void {
    if (LOG_LEVEL <= LogLevel.Error) {
        if (Egret_Egret.Capabilities.isMobile) {
            CONSOLE.error(rest.join(" "));
        } else {
            CONSOLE.error(...rest);
        }
    }
}

export function dump(obj: unknown): void {
    log(JSON.stringify(obj));
}

export function assert(cond: boolean, ...rest: unknown[]): void {
    if (IS_ASSERT_ENABLED) {
        if (Egret_Egret.Capabilities.isMobile) {
            CONSOLE.assert(cond, rest.join(" "));
        } else {
            CONSOLE.assert(cond, ...rest);
        }
    }
}
