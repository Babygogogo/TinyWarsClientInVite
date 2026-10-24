import * as HelpersMisc from "../../helpers/Misc.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as UnitsConstants from "../Constants.ts";

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
    return UnitsConstants.AllActionStateIdArray.includes(actionState);
}

export function checkIsValidActionStateIdSubset(actionStateArray: number[]): boolean {
    return (actionStateArray.length === new Set(actionStateArray).size)
        && (actionStateArray.every(v => checkIsValidActionStateId(v)));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function checkIsValidAiModeId(aiMode: number): boolean {
    return UnitsConstants.AllAiModeIdArray.includes(aiMode);
}
export function checkIsValidAiModeIdSubset(aiModeArray: number[]): boolean {
    return (new Set(aiModeArray).size === aiModeArray.length)
        && (aiModeArray.every(v => checkIsValidAiModeId(v)));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function checkIsValidEncodedTagId(encodedTagId: number): boolean {
    return (encodedTagId >= 0) && (encodedTagId <= UnitsConstants.TagId.MaxEncodedTagId);
}

export function getEncodedTagId(tagIdArray: number[]): number {
    let encodedTagIds = 0;
    for (const tagId of tagIdArray) {
        encodedTagIds |= (1 << (tagId - 1));
    }
    return encodedTagIds;
}

export function checkIsValidTagId(tagId: number): boolean {
    return (tagId >= UnitsConstants.TagId.MinTagId) && (tagId <= UnitsConstants.TagId.MaxTagId);
}
export function checkIsValidTagIdSubset(subset: number[]): boolean {
    return (subset.length <= UnitsConstants.TagId.MaxTagId - UnitsConstants.TagId.MinTagId + 1)
        && (subset.every(v => checkIsValidTagId(v)))
        && (new Set(subset).size == subset.length);
}

export function getTagIdList(encodedTagIds: number, hasTag: boolean): number[] {
    const tagIdArray: number[] = [];
    for (let tagId = UnitsConstants.TagId.MinTagId; tagId <= UnitsConstants.TagId.MaxTagId; ++tagId) {
        if (hasTag === !!((encodedTagIds >>> (tagId - 1)) & 1)) {
            tagIdArray.push(tagId);
        }
    }
    return tagIdArray;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getNormalizedHp(hp: number): number {
    return Math.ceil(hp / UnitsConstants.Hp.Normalizer);
}

export function checkIsMeetLoadedStateId(stateId: number, isLoaded: boolean): boolean {
    switch (stateId) {
        case UnitsConstants.LoadedStateId.AnyState     : return true;
        case UnitsConstants.LoadedStateId.IsNotLoaded  : return !isLoaded;
        case UnitsConstants.LoadedStateId.IsLoaded     : return isLoaded;
        default                             : throw HelpersMisc.newError(`Invalid state: ${stateId}`);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function checkIsValidProduceMaterial(material: number): boolean {
    return (material === Math.floor(material))
        && (material >= UnitsConstants.ProduceMaterialHardLimit.Min)
        && (material <= UnitsConstants.ProduceMaterialHardLimit.Max);
}
export function getValidProduceMaterial(material: number): number {
    return NumbersUtils.getValueInRange({
        minValue    : UnitsConstants.ProduceMaterialHardLimit.Min,
        maxValue    : UnitsConstants.ProduceMaterialHardLimit.Max,
        rawValue    : Math.floor(material),
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function checkIsValidPrimaryAmmo(ammo: number): boolean {
    return (ammo === Math.floor(ammo))
        && (ammo >= UnitsConstants.PrimaryAmmoHardLimit.Min)
        && (ammo <= UnitsConstants.PrimaryAmmoHardLimit.Max);
}
export function getValidPrimaryAmmo(ammo: number): number {
    return NumbersUtils.getValueInRange({
        minValue    : UnitsConstants.PrimaryAmmoHardLimit.Min,
        maxValue    : UnitsConstants.PrimaryAmmoHardLimit.Max,
        rawValue    : Math.floor(ammo),
    });
}
