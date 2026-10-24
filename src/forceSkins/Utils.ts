import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import * as ForceSkinsConstants from "./Constants.ts";
import * as GameHelpersGhFactory from "../gameHelpers/GhFactory.ts";
import * as LocalDataStorage2 from "../localData/Storage.ts";
import * as PlayersConstants from "../players/Constants.ts";

export function getAllSkinIdArray(includeNeutral: boolean): number[] {
    return includeNeutral ? ForceSkinsConstants.AllSkinIdArrayIncludeNeutral : ForceSkinsConstants.AllSkinIdArrayExcludeNeutral;
}

export function getDefaultSkinId(playerIndex: number): number {
    return playerIndex;
}

export function getOriginSkinIdArray(war: BaseWarInterfaceIBwWar.IBwWar, includeNeutral: boolean): number[] {
    return war.getPlayerManager().getAllPlayers(includeNeutral).map(v => v.getUnitAndTileSkinId());
}
export function getRawOverridingSkinIdArray(war: BaseWarInterfaceIBwWar.IBwWar): AuxiliaryTypesAuxiliaryTypes.Undefinable<AuxiliaryTypesAuxiliaryTypes.Undefinable<number>[]> {
    if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
        const warId = war.getWarId();
        return warId == null ? undefined : LocalDataStorage2.getMpwOverridingSkinIdArray(warId);
    }

    if (war instanceof GameHelpersGhFactory.getHrwWarClass()) {
        const warId = war.getWarId();
        return warId == null ? undefined : LocalDataStorage2.getMpwOverridingSkinIdArray(warId);
    }

    if (war instanceof GameHelpersGhFactory.getRwWarClass()) {
        const replayId = war.getReplayId();
        return LocalDataStorage2.getRwOverridingSkinIdArray(replayId);
    }

    if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
        return war.getSaveSlotExtraData()?.getOverridingSkinIdArray();
    }

    return undefined;
}
export function getRevisedOverridingSkinIdArray(war: BaseWarInterfaceIBwWar.IBwWar): number[] {
    return reviseOverridingSkinIdArray(getOriginSkinIdArray(war, false), getRawOverridingSkinIdArray(war));
}
export function getRawOverridingSkinId(war: BaseWarInterfaceIBwWar.IBwWar, playerIndex: number): number | undefined {
    if (playerIndex < PlayersConstants.PlayerIndex.First) {
        return undefined;
    }

    const arr = getRawOverridingSkinIdArray(war);
    return arr ? (arr[playerIndex - 1] ?? undefined) : undefined;
}
export function getFinalSkinIdArray(war: BaseWarInterfaceIBwWar.IBwWar, includeNeutral: boolean): number[] {
    const skinIdArray           = getOriginSkinIdArray(war, includeNeutral);
    const overridingSkinIdArray = getRawOverridingSkinIdArray(war);
    if (overridingSkinIdArray != null) {
        if (includeNeutral) {
            for (let i = 1; i < skinIdArray.length; ++i) {
                const skinId = overridingSkinIdArray[i - 1];
                if ((skinId != null) && (skinId >= PlayersConstants.PlayerIndex.First)) {
                    skinIdArray[i] = skinId;
                }
            }
        } else {
            for (let i = 0; i < skinIdArray.length; ++i) {
                const skinId = overridingSkinIdArray[i];
                if ((skinId != null) && (skinId >= PlayersConstants.PlayerIndex.First)) {
                    skinIdArray[i] = skinId;
                }
            }
        }
    }

    return skinIdArray;
}
export function getFinalSkinId(war: BaseWarInterfaceIBwWar.IBwWar, playerIndex: number): number {
    const originSkinId = war.getPlayer(playerIndex).getUnitAndTileSkinId();
    if (playerIndex < PlayersConstants.PlayerIndex.First) {
        return originSkinId;
    } else {
        return getFinalSkinId2(originSkinId, getRawOverridingSkinId(war, playerIndex));
    }
}
export function getFinalSkinId2(originSkinId: number, overridingSkinId: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): number {
    return ((overridingSkinId != null) && (overridingSkinId >= PlayersConstants.PlayerIndex.First))
        ? overridingSkinId
        : originSkinId;
}

export function checkIsValidSkinId(skinId: number, allowNeutral: boolean): boolean {
    if (allowNeutral) {
        return (skinId >= ForceSkinsConstants.SkinId.Neutral) && (skinId <= ForceSkinsConstants.SkinId.Last);
    } else {
        return (skinId >= ForceSkinsConstants.SkinId.First) && (skinId <= ForceSkinsConstants.SkinId.Last);
    }
}

function reviseOverridingSkinIdArray(originSkinIdArray: number[], targetSkinIdArray: AuxiliaryTypesAuxiliaryTypes.Undefinable<AuxiliaryTypesAuxiliaryTypes.Undefinable<number>[]>): number[] {
    if (targetSkinIdArray == null) {
        return originSkinIdArray.concat();
    }

    const result: number[] = [];
    for (let i = 0; i < originSkinIdArray.length; ++i) {
        const skinId = targetSkinIdArray[i];
        if ((skinId == null) || (skinId < PlayersConstants.PlayerIndex.First)) {
            result[i] = originSkinIdArray[i];
        } else {
            result[i] = skinId;
        }
    }

    return result;
}
