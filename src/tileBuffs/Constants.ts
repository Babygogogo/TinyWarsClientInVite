import {
    Turns_Constants,
} from "../internal.ts";

 
export const enum EndTimeModification {
    MaxEndPlayerIndex = 10000,
    MinEndPlayerIndex = -MaxEndPlayerIndex,
    MaxEndTurnIndex   = Turns_Constants.TurnIndex.MaxLimit,
    MinEndTurnIndex   = -MaxEndTurnIndex,
}

 
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
