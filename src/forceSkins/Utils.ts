import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import {
    AllSkinIdArrayIncludeNeutral,
    AllSkinIdArrayExcludeNeutral,
    SkinId,
} from "./Constants.ts";
import {
    getMpwWarClass,
    getHrwWarClass,
    getRwWarClass,
    getSpwWarClass,
} from "../gameHelpers/GhFactory.ts";
import {
    getMpwOverridingSkinIdArray,
    getRwOverridingSkinIdArray,
} from "../localData/Storage.ts";
import { PlayerIndex } from "../players/Constants.ts";

export function getAllSkinIdArray(includeNeutral: boolean): number[] {
    return includeNeutral ? AllSkinIdArrayIncludeNeutral : AllSkinIdArrayExcludeNeutral;
}

export function getDefaultSkinId(playerIndex: number): number {
    return playerIndex;
}

export function getOriginSkinIdArray(war: IBwWar, includeNeutral: boolean): number[] {
    return war.getPlayerManager().getAllPlayers(includeNeutral).map(v => v.getUnitAndTileSkinId());
}
export function getRawOverridingSkinIdArray(war: IBwWar): Undefinable<Undefinable<number>[]> {
    if (war instanceof getMpwWarClass()) {
        const warId = war.getWarId();
        return warId == null ? undefined : getMpwOverridingSkinIdArray(warId);
    }

    if (war instanceof getHrwWarClass()) {
        const warId = war.getWarId();
        return warId == null ? undefined : getMpwOverridingSkinIdArray(warId);
    }

    if (war instanceof getRwWarClass()) {
        const replayId = war.getReplayId();
        return getRwOverridingSkinIdArray(replayId);
    }

    if (war instanceof getSpwWarClass()) {
        return war.getSaveSlotExtraData()?.getOverridingSkinIdArray();
    }

    return undefined;
}
export function getRevisedOverridingSkinIdArray(war: IBwWar): number[] {
    return reviseOverridingSkinIdArray(getOriginSkinIdArray(war, false), getRawOverridingSkinIdArray(war));
}
export function getRawOverridingSkinId(war: IBwWar, playerIndex: number): number | undefined {
    if (playerIndex < PlayerIndex.First) {
        return undefined;
    }

    const arr = getRawOverridingSkinIdArray(war);
    return arr ? (arr[playerIndex - 1] ?? undefined) : undefined;
}
export function getFinalSkinIdArray(war: IBwWar, includeNeutral: boolean): number[] {
    const skinIdArray           = getOriginSkinIdArray(war, includeNeutral);
    const overridingSkinIdArray = getRawOverridingSkinIdArray(war);
    if (overridingSkinIdArray != null) {
        if (includeNeutral) {
            for (let i = 1; i < skinIdArray.length; ++i) {
                const skinId = overridingSkinIdArray[i - 1];
                if ((skinId != null) && (skinId >= PlayerIndex.First)) {
                    skinIdArray[i] = skinId;
                }
            }
        } else {
            for (let i = 0; i < skinIdArray.length; ++i) {
                const skinId = overridingSkinIdArray[i];
                if ((skinId != null) && (skinId >= PlayerIndex.First)) {
                    skinIdArray[i] = skinId;
                }
            }
        }
    }

    return skinIdArray;
}
export function getFinalSkinId(war: IBwWar, playerIndex: number): number {
    const originSkinId = war.getPlayer(playerIndex).getUnitAndTileSkinId();
    if (playerIndex < PlayerIndex.First) {
        return originSkinId;
    } else {
        return getFinalSkinId2(originSkinId, getRawOverridingSkinId(war, playerIndex));
    }
}
export function getFinalSkinId2(originSkinId: number, overridingSkinId: Undefinable<number>): number {
    return ((overridingSkinId != null) && (overridingSkinId >= PlayerIndex.First))
        ? overridingSkinId
        : originSkinId;
}

export function checkIsValidSkinId(skinId: number, allowNeutral: boolean): boolean {
    if (allowNeutral) {
        return (skinId >= SkinId.Neutral) && (skinId <= SkinId.Last);
    } else {
        return (skinId >= SkinId.First) && (skinId <= SkinId.Last);
    }
}

function reviseOverridingSkinIdArray(originSkinIdArray: number[], targetSkinIdArray: Undefinable<Undefinable<number>[]>): number[] {
    if (targetSkinIdArray == null) {
        return originSkinIdArray.concat();
    }

    const result: number[] = [];
    for (let i = 0; i < originSkinIdArray.length; ++i) {
        const skinId = targetSkinIdArray[i];
        if ((skinId == null) || (skinId < PlayerIndex.First)) {
            result[i] = originSkinIdArray[i];
        } else {
            result[i] = skinId;
        }
    }

    return result;
}
