

 
export const enum TimerTypeId {
    NoBoot      = 0,
    Regular     = 1,
    Incremental = 2,
}

export namespace Regular {
    export const MaxLimit                       = 3600 * 24 * 7;

    export const DefaultParams                  = [TimerTypeId.Regular, 3600 * 24 * 3];
}

export namespace Incremental {
    export const MaxLimit                       = 3600 * 24;
    export const MaxLimitForInitialTime         = 3600 * 24;
    export const MaxLimitForIncrementPerUnit    = 3600;
    export const MaxLimitForIncrementPerTurn    = 3600 * 24;

    export const DefaultParams                  = [TimerTypeId.Incremental, 60 * 10, 5, 30];
}

export const DefaultParams = Regular.DefaultParams;
