import {
    Units_Constants,
    Numbers_Utils,
    Helpers_Misc,
} from "../../internal.ts";

export function checkIsUnitIdCompact(unitIdList: number[]): boolean {
    if (unitIdList.length <= 0) {
        return true;
    }

    const unitIdSet = new Set<number>();
    for (const unitId of unitIdList) {
        if ((unitId < 0) || (unitIdSet.has(unitId))) {
            return false;
        }
        unitIdSet.add(unitId);
    }

    if (!unitIdSet.has(0)) {
        return false;
    }
    for (const unitId of unitIdSet) {
        if ((unitId > 0) && (!unitIdSet.has(unitId - 1))) {
            return false;
        }
    }

    return true;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function checkIsValidActionStateId(actionState: number): boolean {
    return Units_Constants.AllActionStateIdArray.includes(actionState);
}

export function checkIsValidActionStateIdSubset(actionStateArray: number[]): boolean {
    return (actionStateArray.length === new Set(actionStateArray).size)
        && (actionStateArray.every(v => checkIsValidActionStateId(v)));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function checkIsValidAiModeId(aiMode: number): boolean {
    return Units_Constants.AllAiModeIdArray.includes(aiMode);
}
export function checkIsValidAiModeIdSubset(aiModeArray: number[]): boolean {
    return (new Set(aiModeArray).size === aiModeArray.length)
        && (aiModeArray.every(v => checkIsValidAiModeId(v)));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function checkIsValidEncodedTagId(encodedTagId: number): boolean {
    return (encodedTagId >= 0) && (encodedTagId <= Units_Constants.TagId.MaxEncodedTagId);
}

export function getEncodedTagId(tagIdArray: number[]): number {
    let encodedTagIds = 0;
    for (const tagId of tagIdArray) {
        encodedTagIds |= (1 << (tagId - 1));
    }
    return encodedTagIds;
}

export function checkIsValidTagId(tagId: number): boolean {
    return (tagId >= Units_Constants.TagId.MinTagId) && (tagId <= Units_Constants.TagId.MaxTagId);
}
export function checkIsValidTagIdSubset(subset: number[]): boolean {
    return (subset.length <= Units_Constants.TagId.MaxTagId - Units_Constants.TagId.MinTagId + 1)
        && (subset.every(v => checkIsValidTagId(v)))
        && (new Set(subset).size == subset.length);
}

export function getTagIdList(encodedTagIds: number, hasTag: boolean): number[] {
    const tagIdArray: number[] = [];
    for (let tagId = Units_Constants.TagId.MinTagId; tagId <= Units_Constants.TagId.MaxTagId; ++tagId) {
        if (hasTag === !!((encodedTagIds >>> (tagId - 1)) & 1)) {
            tagIdArray.push(tagId);
        }
    }
    return tagIdArray;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getNormalizedHp(hp: number): number {
    return Math.ceil(hp / Units_Constants.Hp.Normalizer);
}

export function checkIsMeetLoadedStateId(stateId: number, isLoaded: boolean): boolean {
    switch (stateId) {
        case Units_Constants.LoadedStateId.AnyState     : return true;
        case Units_Constants.LoadedStateId.IsNotLoaded  : return !isLoaded;
        case Units_Constants.LoadedStateId.IsLoaded     : return isLoaded;
        default                             : throw Helpers_Misc.newError(`Invalid state: ${stateId}`);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function checkIsValidProduceMaterial(material: number): boolean {
    return (material === Math.floor(material))
        && (material >= Units_Constants.ProduceMaterialHardLimit.Min)
        && (material <= Units_Constants.ProduceMaterialHardLimit.Max);
}
export function getValidProduceMaterial(material: number): number {
    return Numbers_Utils.getValueInRange({
        minValue    : Units_Constants.ProduceMaterialHardLimit.Min,
        maxValue    : Units_Constants.ProduceMaterialHardLimit.Max,
        rawValue    : Math.floor(material),
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function checkIsValidPrimaryAmmo(ammo: number): boolean {
    return (ammo === Math.floor(ammo))
        && (ammo >= Units_Constants.PrimaryAmmoHardLimit.Min)
        && (ammo <= Units_Constants.PrimaryAmmoHardLimit.Max);
}
export function getValidPrimaryAmmo(ammo: number): number {
    return Numbers_Utils.getValueInRange({
        minValue    : Units_Constants.PrimaryAmmoHardLimit.Min,
        maxValue    : Units_Constants.PrimaryAmmoHardLimit.Max,
        rawValue    : Math.floor(ammo),
    });
}
