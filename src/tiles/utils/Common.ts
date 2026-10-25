import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import type {
    TileTemplateCfg as ProtoSchemaCommonProtoConfigTileTemplateCfg,
} from "../../proto/schema/CommonProto/Config/TileTemplateCfg.ts";
import type {
    TileCustomBuildingData as ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData,
} from "../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import { CustomName, AllThemeTypeIdArray } from "../constants/Common.ts";

type TileTemplateCfg        = ProtoSchemaCommonProtoConfigTileTemplateCfg;
type TileCustomBuildingData = ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

export function getMaxCapturePoint(templateCfg: TileTemplateCfg, customBuildingData: Undefinable<TileCustomBuildingData>): Undefinable<number> {
    return templateCfg.getIsCustomizableBuilding()
        ? customBuildingData?.getMaxCapturePoint()
        : templateCfg.getMaxCapturePoint();
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getMaxBuildPoint(templateCfg: TileTemplateCfg, customBuildingData: Undefinable<TileCustomBuildingData>): Undefinable<number> {
    return templateCfg.getIsCustomizableBuilding()
        ? null
        : templateCfg.getMaxBuildPoint();
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getMaxHp(templateCfg: TileTemplateCfg, customBuildingData: Undefinable<TileCustomBuildingData>): Undefinable<number> {
    return templateCfg.getIsCustomizableBuilding()
        ? null
        : templateCfg.getMaxHp();
}

export function getIsDefeatedOnCapture(templateCfg: TileTemplateCfg, customBuildingData: Undefinable<TileCustomBuildingData>): boolean {
    return templateCfg.getIsCustomizableBuilding()
        ? customBuildingData?.getIsDefeatedOnCapture() ?? false
        : templateCfg.getIsDefeatedOnCapture();
}

export function getDefenseAmount(templateCfg: TileTemplateCfg, customBuildingData: Undefinable<TileCustomBuildingData>): number {
    return templateCfg.getIsCustomizableBuilding()
        ? customBuildingData?.getDefenseAmount() ?? 0
        : templateCfg.getDefenseAmount();
}
export function getDefenseUnitTypeArray(templateCfg: TileTemplateCfg, customBuildingData: Undefinable<TileCustomBuildingData>, gameConfig: GcData): Undefinable<number[]> {
    return (templateCfg.getIsCustomizableBuilding())
        ? customBuildingData?.getDefenseUnitTypeArray()
        : gameConfig.getUnitCategoryCfg(templateCfg.getDefenseUnitCategoryId())?.getUnitTypeIds();
}
export function checkCanDefendUnit({ templateCfg, customBuildingData, gameConfig, unitType }: {
    templateCfg         : TileTemplateCfg;
    customBuildingData  : Undefinable<TileCustomBuildingData>;
    gameConfig          : GcData;
    unitType            : number;
}): boolean {
    if (templateCfg.getIsCustomizableBuilding()) {
        return customBuildingData?.getDefenseUnitTypeArray().includes(unitType) ?? false;
    } else {
        return gameConfig.checkIsUnitTypeInCategory(unitType, templateCfg.getDefenseUnitCategoryId());
    }
}

export function checkCanRepairOrSupplyUnitType({ templateCfg, customBuildingData, gameConfig, unitType }: {
    templateCfg         : TileTemplateCfg;
    customBuildingData  : Undefinable<TileCustomBuildingData>;
    gameConfig          : GcData;
    unitType            : number;
}): boolean {
    if (templateCfg.getIsCustomizableBuilding()) {
        return customBuildingData?.getRepairUnitTypeArray().includes(unitType) ?? false;
    } else {
        const unitCategoryId = templateCfg.getRepairUnitCategoryId();
        return unitCategoryId == null
            ? false
            : gameConfig.checkIsUnitTypeInCategory(unitType, unitCategoryId);
    }
}
export function getRepairUnitTypeArray(templateCfg: TileTemplateCfg, customBuildingData: Undefinable<TileCustomBuildingData>, gameConfig: GcData): Undefinable<number[]> {
    if (templateCfg.getIsCustomizableBuilding()) {
        return customBuildingData?.getRepairUnitTypeArray();
    } else {
        const unitCategoryId = templateCfg.getRepairUnitCategoryId();
        return unitCategoryId == null
            ? null
            : gameConfig.getUnitCategoryCfg(unitCategoryId)?.getUnitTypeIds();
    }
}
export function getRepairNormalizedHp(templateCfg: TileTemplateCfg, customBuildingData: Undefinable<TileCustomBuildingData>): Undefinable<number> {
    return templateCfg.getIsCustomizableBuilding()
        ? customBuildingData?.getRepairNormalizedHp()
        : templateCfg.getRepairAmount();
}

export function getIncomePerTurn(templateCfg: TileTemplateCfg, customBuildingData: Undefinable<TileCustomBuildingData>): number {
    return templateCfg.getIsCustomizableBuilding()
        ? customBuildingData?.getIncomePerTurn() ?? 0
        : templateCfg.getIncomePerTurn();
}

export function getVisionRange(templateCfg: TileTemplateCfg, customBuildingData: Undefinable<TileCustomBuildingData>): number {
    return templateCfg.getIsCustomizableBuilding()
        ? customBuildingData?.getVisionRange() ?? 0
        : templateCfg.getVisionRange();
}
export function getIsVisionEnabledForAllPlayers(templateCfg: TileTemplateCfg, customBuildingData: Undefinable<TileCustomBuildingData>): boolean {
    return templateCfg.getIsCustomizableBuilding()
        ? customBuildingData?.getIsVisionEnabledForAllPlayers() ?? false
        : templateCfg.getIsVisionEnabledForAllPlayers();
}

export function getHideUnitTypeArray({ templateCfg, customBuildingData, gameConfig }: {
    templateCfg         : TileTemplateCfg;
    customBuildingData  : Undefinable<TileCustomBuildingData>;
    gameConfig          : GcData;
}): Undefinable<number[]> {
    if (templateCfg.getIsCustomizableBuilding()) {
        return customBuildingData?.getHideUnitTypeArray();
    } else {
        const hideUnitCategory = templateCfg.getHideUnitCategoryId();
        return hideUnitCategory == null
            ? null
            : gameConfig.getUnitCategoryCfg(hideUnitCategory)?.getUnitTypeIds();
    }
}
export function checkCanHideUnitType({ templateCfg, customBuildingData, gameConfig, unitType }: {
    templateCfg         : TileTemplateCfg;
    customBuildingData  : Undefinable<TileCustomBuildingData>;
    gameConfig          : GcData;
    unitType            : number;
}): boolean {
    if (templateCfg.getIsCustomizableBuilding()) {
        return customBuildingData?.getHideUnitTypeArray().includes(unitType) ?? false;
    } else {
        const hideUnitCategory = templateCfg.getHideUnitCategoryId();
        return hideUnitCategory == null
            ? false
            : gameConfig.checkIsUnitTypeInCategory(unitType, hideUnitCategory);
    }
}

export function getGlobalAttackBonus(templateCfg: TileTemplateCfg, customBuildingData: Undefinable<TileCustomBuildingData>): number {
    return templateCfg.getIsCustomizableBuilding()
        ? customBuildingData?.getGlobalAttackBonus() ?? 0
        : templateCfg.getGlobalAttackBonus();
}

export function getGlobalDefenseBonus(templateCfg: TileTemplateCfg, customBuildingData: Undefinable<TileCustomBuildingData>): number {
    return templateCfg.getIsCustomizableBuilding()
        ? customBuildingData?.getGlobalDefenseBonus() ?? 0
        : templateCfg.getGlobalDefenseBonus();
}

export function checkCanCoBoard({ templateCfg, customBuildingData, gameConfig, unitType }: {
    templateCfg         : TileTemplateCfg;
    customBuildingData  : Undefinable<TileCustomBuildingData>;
    gameConfig          : GcData;
    unitType            : number;
}): boolean {
    if (templateCfg.getIsCustomizableBuilding()) {
        return customBuildingData?.getUnitTypeArrayForCoBoard().includes(unitType) ?? false;
    } else {
        const unitCategory = templateCfg.getCoBoardUnitCategoryId();
        return unitCategory == null
            ? false
            : gameConfig.checkIsUnitTypeInCategory(unitType, unitCategory);
    }
}
export function getCoBoardUnitTypeArray(templateCfg: TileTemplateCfg, customBuildingData: Undefinable<TileCustomBuildingData>, gameConfig: GcData): Undefinable<number[]> {
    if (templateCfg.getIsCustomizableBuilding()) {
        return customBuildingData?.getUnitTypeArrayForCoBoard();
    } else {
        const category = templateCfg.getCoBoardUnitCategoryId();
        return category == null
            ? null
            : gameConfig.getUnitCategoryCfg(category)?.getUnitTypeIds();
    }
}

export function checkCanBlockEnemyUnitType({ templateCfg, customBuildingData, gameConfig, unitType }: {
    templateCfg         : TileTemplateCfg;
    customBuildingData  : Undefinable<TileCustomBuildingData>;
    gameConfig          : GcData;
    unitType            : number;
}): boolean {
    if (templateCfg.getIsCustomizableBuilding()) {
        return customBuildingData?.getBlockEnemyUnitTypeArray().includes(unitType) ?? false;
    } else {
        const unitCategory = templateCfg.getBlockEnemyUnitCategoryId();
        return unitCategory == null
            ? false
            : gameConfig.checkIsUnitTypeInCategory(unitType, unitCategory);
    }
}
export function getBlockEnemyUnitTypeArray(templateCfg: TileTemplateCfg, customBuildingData: Undefinable<TileCustomBuildingData>, gameConfig: GcData): Undefinable<number[]> {
    if (templateCfg.getIsCustomizableBuilding()) {
        return customBuildingData?.getBlockEnemyUnitTypeArray();
    } else {
        const category = templateCfg.getBlockEnemyUnitCategoryId();
        return category == null
            ? null
            : gameConfig.getUnitCategoryCfg(category)?.getUnitTypeIds();
    }
}

export function getProducibleUnitTypeArray(templateCfg: TileTemplateCfg, customBuildingData: Undefinable<TileCustomBuildingData>, gameConfig: GcData): Undefinable<number[]> {
    if (templateCfg.getIsCustomizableBuilding()) {
        return customBuildingData?.getProduceUnitTypeArray();
    } else {
        const category = templateCfg.getProduceUnitCategoryId();
        return category == null
            ? null
            : gameConfig.getUnitCategoryCfg(category)?.getUnitTypeIds();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function checkIsValidCustomNameId(nameId: number): boolean {
    return (nameId >= CustomName.MinId)
        && (nameId <= CustomName.MaxId);
}

export function checkIsValidThemeId(tileTheme: number): boolean {
    return AllThemeTypeIdArray.includes(tileTheme);
}
export function getNextThemeId(tileTheme: Undefinable<number>): number | null {
    const arr = AllThemeTypeIdArray;
    if (tileTheme == null) {
        return arr[0];
    }

    const index = arr.indexOf(tileTheme);
    if (index == arr.length - 1) {
        return null;
    } else {
        return arr[index + 1];
    }
}
