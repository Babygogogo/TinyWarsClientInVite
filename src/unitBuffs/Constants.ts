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
    Fire            = 1,
    // Wet             = 2,
    // Flying          = 3,
    // Weak            = 4,
    // Fragile         = 5,
    // Boost           = 6,
    // Shielded        = 7,
    Disease         = 8,
    Custom          = 9,
}

export const AllBuffTypeIdArray = [
    BuffTypeId.Fire,
    BuffTypeId.Disease,
    BuffTypeId.Custom,
];
