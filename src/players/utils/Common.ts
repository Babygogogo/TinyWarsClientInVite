import {
    Players_Constants,
    Numbers_Utils,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { SerialPlayerManager } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";

export function checkIsValidAliveStateId(aliveState: number): boolean {
    return Players_Constants.AllAliveStateIdArray.includes(aliveState);
}
export function checkIsValidAliveStateIdSubset(aliveStateArray: number[]): boolean {
    return ((new Set(aliveStateArray)).size === aliveStateArray.length)
        && (aliveStateArray.every(v => checkIsValidAliveStateId(v)));
}

export function checkIsValidPlayerIndex(playerIndex: number, playersCountUnneutral: number): boolean {
    return (playerIndex >= Players_Constants.PlayerIndex.Neutral) && (playerIndex <= playersCountUnneutral);
}
export function checkIsValidPlayerIndexSubset(playerIndexArray: number[], playersCountUnneutral: number): boolean {
    return ((new Set(playerIndexArray)).size === playerIndexArray.length)
        && (playerIndexArray.every(v => checkIsValidPlayerIndex(v, playersCountUnneutral)));
}

export function checkIsValidFund(fund: number): boolean {
    return (Math.floor(fund) === fund)
        && (fund >= Players_Constants.Fund.MinFund)
        && (fund <= Players_Constants.Fund.MaxFund);
}
export function getValidFund(fund: number): number {
    return Numbers_Utils.getValueInRange({
        minValue    : Players_Constants.Fund.MinFund,
        maxValue    : Players_Constants.Fund.MaxFund,
        rawValue    : Math.floor(fund),
    });
}

export function getPlayersCountUnneutral(playerManagerData: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayerManager>): number {
    const playerIndexSet = new Set<number>();
    for (const playerData of playerManagerData ? playerManagerData.getPlayers() : []) {
        const playerIndex = playerData.getPlayerIndex();
        if (playerIndex >= Players_Constants.PlayerIndex.First) {
            playerIndexSet.add(playerIndex);
        }
    }
    return playerIndexSet.size;
}
