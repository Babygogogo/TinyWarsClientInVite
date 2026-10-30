import {
    ForceSkins_Constants,
    HalfwayReplayWar_Model_HrwWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWar,
    SinglePlayerWar_Model_SpwWar,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
    LocalData_Storage,
    Players_Constants,
} from "../internal.ts";

export function getAllSkinIdArray(includeNeutral: boolean): number[] {
    return includeNeutral ? ForceSkins_Constants.AllSkinIdArrayIncludeNeutral : ForceSkins_Constants.AllSkinIdArrayExcludeNeutral;
}

export function getDefaultSkinId(playerIndex: number): number {
    return playerIndex;
}

export function getOriginSkinIdArray(war: BaseWar_Interface_IBwWar.IBwWar, includeNeutral: boolean): number[] {
    return war.getPlayerManager().getAllPlayers(includeNeutral).map(v => v.getUnitAndTileSkinId());
}
export function getRawOverridingSkinIdArray(war: BaseWar_Interface_IBwWar.IBwWar): AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>[]> {
    if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        const warId = war.getWarId();
        return warId == null ? undefined : LocalData_Storage.getMpwOverridingSkinIdArray(warId);
    }

    if (war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) {
        const warId = war.getWarId();
        return warId == null ? undefined : LocalData_Storage.getMpwOverridingSkinIdArray(warId);
    }

    if (war instanceof ReplayWar_Model_RwWar.RwWar) {
        const replayId = war.getReplayId();
        return LocalData_Storage.getRwOverridingSkinIdArray(replayId);
    }

    if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        return war.getSaveSlotExtraData()?.getOverridingSkinIdArray();
    }

    return undefined;
}
export function getRevisedOverridingSkinIdArray(war: BaseWar_Interface_IBwWar.IBwWar): number[] {
    return reviseOverridingSkinIdArray(getOriginSkinIdArray(war, false), getRawOverridingSkinIdArray(war));
}
export function getRawOverridingSkinId(war: BaseWar_Interface_IBwWar.IBwWar, playerIndex: number): number | undefined {
    if (playerIndex < Players_Constants.PlayerIndex.First) {
        return undefined;
    }

    const arr = getRawOverridingSkinIdArray(war);
    return arr ? (arr[playerIndex - 1] ?? undefined) : undefined;
}
export function getFinalSkinIdArray(war: BaseWar_Interface_IBwWar.IBwWar, includeNeutral: boolean): number[] {
    const skinIdArray           = getOriginSkinIdArray(war, includeNeutral);
    const overridingSkinIdArray = getRawOverridingSkinIdArray(war);
    if (overridingSkinIdArray != null) {
        if (includeNeutral) {
            for (let i = 1; i < skinIdArray.length; ++i) {
                const skinId = overridingSkinIdArray[i - 1];
                if ((skinId != null) && (skinId >= Players_Constants.PlayerIndex.First)) {
                    skinIdArray[i] = skinId;
                }
            }
        } else {
            for (let i = 0; i < skinIdArray.length; ++i) {
                const skinId = overridingSkinIdArray[i];
                if ((skinId != null) && (skinId >= Players_Constants.PlayerIndex.First)) {
                    skinIdArray[i] = skinId;
                }
            }
        }
    }

    return skinIdArray;
}
export function getFinalSkinId(war: BaseWar_Interface_IBwWar.IBwWar, playerIndex: number): number {
    const originSkinId = war.getPlayer(playerIndex).getUnitAndTileSkinId();
    if (playerIndex < Players_Constants.PlayerIndex.First) {
        return originSkinId;
    } else {
        return getFinalSkinId2(originSkinId, getRawOverridingSkinId(war, playerIndex));
    }
}
export function getFinalSkinId2(originSkinId: number, overridingSkinId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): number {
    return ((overridingSkinId != null) && (overridingSkinId >= Players_Constants.PlayerIndex.First))
        ? overridingSkinId
        : originSkinId;
}

export function checkIsValidSkinId(skinId: number, allowNeutral: boolean): boolean {
    if (allowNeutral) {
        return (skinId >= ForceSkins_Constants.SkinId.Neutral) && (skinId <= ForceSkins_Constants.SkinId.Last);
    } else {
        return (skinId >= ForceSkins_Constants.SkinId.First) && (skinId <= ForceSkins_Constants.SkinId.Last);
    }
}

function reviseOverridingSkinIdArray(originSkinIdArray: number[], targetSkinIdArray: AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>[]>): number[] {
    if (targetSkinIdArray == null) {
        return originSkinIdArray.concat();
    }

    const result: number[] = [];
    for (let i = 0; i < originSkinIdArray.length; ++i) {
        const skinId = targetSkinIdArray[i];
        if ((skinId == null) || (skinId < Players_Constants.PlayerIndex.First)) {
            result[i] = originSkinIdArray[i];
        } else {
            result[i] = skinId;
        }
    }

    return result;
}
