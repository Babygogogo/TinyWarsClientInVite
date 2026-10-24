import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as PlayersConstants from "../Constants.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialPlayerManager from "../../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";

type SerialPlayerManager    = ProtoSchemaCommonProtoWarSerializationSerialPlayerManager.SerialPlayerManager;

export function checkIsValidAliveStateId(aliveState: number): boolean {
    return PlayersConstants.AllAliveStateIdArray.includes(aliveState);
}
export function checkIsValidAliveStateIdSubset(aliveStateArray: number[]): boolean {
    return ((new Set(aliveStateArray)).size === aliveStateArray.length)
        && (aliveStateArray.every(v => checkIsValidAliveStateId(v)));
}

export function checkIsValidPlayerIndex(playerIndex: number, playersCountUnneutral: number): boolean {
    return (playerIndex >= PlayersConstants.PlayerIndex.Neutral) && (playerIndex <= playersCountUnneutral);
}
export function checkIsValidPlayerIndexSubset(playerIndexArray: number[], playersCountUnneutral: number): boolean {
    return ((new Set(playerIndexArray)).size === playerIndexArray.length)
        && (playerIndexArray.every(v => checkIsValidPlayerIndex(v, playersCountUnneutral)));
}

export function checkIsValidFund(fund: number): boolean {
    return (Math.floor(fund) === fund)
        && (fund >= PlayersConstants.Fund.MinFund)
        && (fund <= PlayersConstants.Fund.MaxFund);
}
export function getValidFund(fund: number): number {
    return NumbersUtils.getValueInRange({
        minValue    : PlayersConstants.Fund.MinFund,
        maxValue    : PlayersConstants.Fund.MaxFund,
        rawValue    : Math.floor(fund),
    });
}

export function getPlayersCountUnneutral(playerManagerData: AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialPlayerManager>): number {
    const playerIndexSet = new Set<number>();
    for (const playerData of playerManagerData ? playerManagerData.getPlayers() : []) {
        const playerIndex = playerData.getPlayerIndex();
        if (playerIndex >= PlayersConstants.PlayerIndex.First) {
            playerIndexSet.add(playerIndex);
        }
    }
    return playerIndexSet.size;
}
