import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { AllAliveStateIdArray, PlayerIndex, Fund } from "../Constants.ts";
import type { SerialPlayerManager } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";

export function checkIsValidAliveStateId(aliveState: number): boolean {
    return AllAliveStateIdArray.includes(aliveState);
}
export function checkIsValidAliveStateIdSubset(aliveStateArray: number[]): boolean {
    return ((new Set(aliveStateArray)).size === aliveStateArray.length)
        && (aliveStateArray.every(v => checkIsValidAliveStateId(v)));
}

export function checkIsValidPlayerIndex(playerIndex: number, playersCountUnneutral: number): boolean {
    return (playerIndex >= PlayerIndex.Neutral) && (playerIndex <= playersCountUnneutral);
}
export function checkIsValidPlayerIndexSubset(playerIndexArray: number[], playersCountUnneutral: number): boolean {
    return ((new Set(playerIndexArray)).size === playerIndexArray.length)
        && (playerIndexArray.every(v => checkIsValidPlayerIndex(v, playersCountUnneutral)));
}

export function checkIsValidFund(fund: number): boolean {
    return (Math.floor(fund) === fund)
        && (fund >= Fund.MinFund)
        && (fund <= Fund.MaxFund);
}
export function getValidFund(fund: number): number {
    return getValueInRange({
        minValue    : Fund.MinFund,
        maxValue    : Fund.MaxFund,
        rawValue    : Math.floor(fund),
    });
}

export function getPlayersCountUnneutral(playerManagerData: Undefinable<SerialPlayerManager>): number {
    const playerIndexSet = new Set<number>();
    for (const playerData of playerManagerData ? playerManagerData.getPlayers() : []) {
        const playerIndex = playerData.getPlayerIndex();
        if (playerIndex >= PlayerIndex.First) {
            playerIndexSet.add(playerIndex);
        }
    }
    return playerIndexSet.size;
}
