import {
    Turns_Constants,
} from "../internal.ts";

// eslint-disable-next-line no-shadow
export const enum EndTimeModification {
    MaxEndPlayerIndex = 10000,
    MinEndPlayerIndex = -MaxEndPlayerIndex,
    MaxEndTurnIndex   = Turns_Constants.TurnIndex.MaxLimit,
    MinEndTurnIndex   = -MaxEndTurnIndex,
}

// eslint-disable-next-line no-shadow
export const enum BuffTypeId {
    NoProduction    = 1,
    NoIncome        = 2,
    Custom          = 9,
}
export const AllBuffTypeIdArray = [
    BuffTypeId.NoProduction,
    BuffTypeId.NoIncome,
    BuffTypeId.Custom,
];
