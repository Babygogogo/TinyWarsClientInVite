import {
    CoSkills_Constants,
    ForceSkins_Constants,
    ForceSkins_Utils,
    Helpers_Collection,
    Helpers_Misc,
    Numbers_Constants,
    Numbers_Utils,
    Players_Constants,
    Units_Constants,
    Units_Types,
    type Units_Unit,
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
        minValue : Units_Constants.ProduceMaterialHardLimit.Min,
        maxValue : Units_Constants.ProduceMaterialHardLimit.Max,
        rawValue : Math.floor(material),
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
        minValue : Units_Constants.PrimaryAmmoHardLimit.Min,
        maxValue : Units_Constants.PrimaryAmmoHardLimit.Max,
        rawValue : Math.floor(ammo),
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function generateViewData(unit: Units_Unit.Unit, ignorePosition: boolean): Units_Types.ViewData {
    const player            = unit.getPlayer();
    const playerIndex       = unit.getPlayerIndex();
    const coUsingSkillType  = player.getCoUsingSkillType();

    return {
        unitTypeId           : unit.getUnitType(),
        gridX                : ignorePosition ? 0 : unit.getGridX(),
        gridY                : ignorePosition ? 0 : unit.getGridY(),
        playerIndex          : playerIndex,
        skinId               : ForceSkins_Utils.getFinalSkinId(unit.getWar(), playerIndex),
        normalizedHp         : unit.getNormalizedCurrentHp(),
        animationTypeId      : Units_Constants.AnimationTypeId.Stand,
        isDark               : unit.getActionState() === Units_Constants.ActionStateId.Acted,
        isLoadedByUnit       : unit.getLoaderUnitId() != null,
        isActiveCoSkillReady : (player.getCoCurrentEnergy() >= (player.getCoPowerEnergy() ?? player.getCoSuperPowerEnergy() ?? Numbers_Constants.MaxInt32))
            && (coUsingSkillType === CoSkills_Constants.SkillTypeId.Passive),

        promotion          : unit.getCurrentPromotion(),
        coSkillTypeIdInUse : coUsingSkillType,
        isCoOnboard        : unit.getIsCoOnboard(),
        isFuelInShort      : unit.checkIsFuelInShort(),
        isAmmoInShort      : unit.checkIsPrimaryWeaponAmmoInShort() || unit.checkIsFlareAmmoInShort(),
        isMaterialInShort  : unit.checkIsBuildMaterialInShort() || unit.checkIsProduceMaterialInShort(),
        isDived            : unit.getIsDiving(),
        isCapturingTile    : unit.checkIsCapturingTile(),
        isBuildingTile     : unit.checkIsBuildingTile(),
        hasLoadedUnits     : unit.getLoadedUnitsCount() > 0,
        buffTypeIdList     : unit.getBuffList().map(v => v.getBuffTypeId()),
    };
}
export function generateDefaultViewData(): Units_Types.ViewData {
    return {
        unitTypeId           : Units_Constants.UnitTypeId.First,
        gridX                : 0,
        gridY                : 0,
        playerIndex          : Players_Constants.PlayerIndex.First,
        skinId               : ForceSkins_Constants.SkinId.First,
        normalizedHp         : Units_Constants.Hp.MaxNormalizedHp,
        animationTypeId      : Units_Constants.AnimationTypeId.Stand,
        isDark               : false,
        isLoadedByUnit       : false,
        isActiveCoSkillReady : false,

        promotion          : 0,
        coSkillTypeIdInUse : CoSkills_Constants.SkillTypeId.Passive,
        isCoOnboard        : false,
        isFuelInShort      : false,
        isAmmoInShort      : false,
        isMaterialInShort  : false,
        isDived            : false,
        isCapturingTile    : false,
        isBuildingTile     : false,
        hasLoadedUnits     : false,
        buffTypeIdList     : [],
    };
}
export function mergeViewDataFrom(target: Units_Types.ViewData, source: Partial<Units_Types.ViewData>): boolean {
    let hasChanged  = false;

    // for (const [key, newValue] of Object.entries(source) as [keyof Units_Types.ViewData, Units_Types.ViewData[keyof Units_Types.ViewData]][]) {
    //     if ((newValue !== undefined) && (target[key] !== newValue)) {
    //         (target[key] as typeof newValue)= newValue;
    //         hasChanged = true;
    //     }
    // }

    if ((source.unitTypeId !== undefined) &&
        (target.unitTypeId !== source.unitTypeId)
    ) {
        target.unitTypeId = source.unitTypeId;
        hasChanged = true;
    }
    if ((source.gridX !== undefined) &&
        (target.gridX !== source.gridX)
    ) {
        target.gridX = source.gridX;
        hasChanged = true;
    }
    if ((source.gridY !== undefined) &&
        (target.gridY !== source.gridY)
    ) {
        target.gridY = source.gridY;
        hasChanged = true;
    }
    if ((source.playerIndex !== undefined) &&
        (target.playerIndex !== source.playerIndex)
    ) {
        target.playerIndex = source.playerIndex;
        hasChanged = true;
    }
    if ((source.skinId !== undefined) &&
        (target.skinId !== source.skinId)
    ) {
        target.skinId = source.skinId;
        hasChanged = true;
    }
    if ((source.normalizedHp !== undefined) &&
        (target.normalizedHp !== source.normalizedHp)
    ) {
        target.normalizedHp = source.normalizedHp;
        hasChanged = true;
    }
    if ((source.animationTypeId !== undefined) &&
        (target.animationTypeId !== source.animationTypeId)
    ) {
        target.animationTypeId = source.animationTypeId;
        hasChanged = true;
    }
    if ((source.isDark !== undefined) &&
        (target.isDark !== source.isDark)
    ) {
        target.isDark = source.isDark;
        hasChanged = true;
    }
    if ((source.isLoadedByUnit !== undefined) &&
        (target.isLoadedByUnit !== source.isLoadedByUnit)
    ) {
        target.isLoadedByUnit = source.isLoadedByUnit;
        hasChanged = true;
    }
    if ((source.isActiveCoSkillReady !== undefined) &&
        (target.isActiveCoSkillReady !== source.isActiveCoSkillReady)
    ) {
        target.isActiveCoSkillReady = source.isActiveCoSkillReady;
        hasChanged = true;
    }
    if ((source.promotion !== undefined) &&
        (target.promotion !== source.promotion)
    ) {
        target.promotion = source.promotion;
        hasChanged = true;
    }
    if ((source.coSkillTypeIdInUse !== undefined) &&
        (target.coSkillTypeIdInUse !== source.coSkillTypeIdInUse)
    ) {
        target.coSkillTypeIdInUse = source.coSkillTypeIdInUse;
        hasChanged = true;
    }
    if ((source.isCoOnboard !== undefined) &&
        (target.isCoOnboard !== source.isCoOnboard)
    ) {
        target.isCoOnboard = source.isCoOnboard;
        hasChanged = true;
    }
    if ((source.isFuelInShort !== undefined) &&
        (target.isFuelInShort !== source.isFuelInShort)
    ) {
        target.isFuelInShort = source.isFuelInShort;
        hasChanged = true;
    }
    if ((source.isAmmoInShort !== undefined) &&
        (target.isAmmoInShort !== source.isAmmoInShort)
    ) {
        target.isAmmoInShort = source.isAmmoInShort;
        hasChanged = true;
    }
    if ((source.isMaterialInShort !== undefined) &&
        (target.isMaterialInShort !== source.isMaterialInShort)
    ) {
        target.isMaterialInShort = source.isMaterialInShort;
        hasChanged = true;
    }
    if ((source.isDived !== undefined) &&
        (target.isDived !== source.isDived)
    ) {
        target.isDived = source.isDived;
        hasChanged = true;
    }
    if ((source.isCapturingTile !== undefined) &&
        (target.isCapturingTile !== source.isCapturingTile)
    ) {
        target.isCapturingTile = source.isCapturingTile;
        hasChanged = true;
    }
    if ((source.isBuildingTile !== undefined) &&
        (target.isBuildingTile !== source.isBuildingTile)
    ) {
        target.isBuildingTile = source.isBuildingTile;
        hasChanged = true;
    }
    if ((source.hasLoadedUnits !== undefined) &&
        (target.hasLoadedUnits !== source.hasLoadedUnits)
    ) {
        target.hasLoadedUnits = source.hasLoadedUnits;
        hasChanged = true;
    }
    if ((source.buffTypeIdList !== undefined) &&
        (!Helpers_Collection.checkIsSameList(target.buffTypeIdList, source.buffTypeIdList))
    ) {
        target.buffTypeIdList.length = 0;
        target.buffTypeIdList.push(...source.buffTypeIdList);
        hasChanged = true;
    }

    return hasChanged;
}
