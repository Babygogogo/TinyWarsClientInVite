import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { EnergyTypeId } from "../cos/Constants.ts";
import { SkillTypeId } from "../coSkills/Constants.ts";
import { ModeId } from "../gameModes/Constants.ts";
import type { SymmetryTypeId } from "../geometries/Constants.ts";
import { getExisted, newError } from "../helpers/Misc.ts";
import { LanguageType } from "../lang/Constants.ts";
import { PlayerIndex } from "../players/Constants.ts";
import type { BuildableTileCfg } from "../proto/schema/CommonProto/Config/BuildableTileCfg.ts";
import type { CoBasicCfg } from "../proto/schema/CommonProto/Config/CoBasicCfg.ts";
import type { CoCategoryCfg } from "../proto/schema/CommonProto/Config/CoCategoryCfg.ts";
import type { CoSkillCfg } from "../proto/schema/CommonProto/Config/CoSkillCfg.ts";
import type { CoSkillDescCfg } from "../proto/schema/CommonProto/Config/CoSkillDescCfg.ts";
import type { DamageChartCfg } from "../proto/schema/CommonProto/Config/DamageChartCfg.ts";
import type { FullConfig } from "../proto/schema/CommonProto/Config/FullConfig.ts";
import type { MoveCostCfg } from "../proto/schema/CommonProto/Config/MoveCostCfg.ts";
import type { MoveTypeCfg } from "../proto/schema/CommonProto/Config/MoveTypeCfg.ts";
import type { SystemCfg } from "../proto/schema/CommonProto/Config/SystemCfg.ts";
import type { TextCfg } from "../proto/schema/CommonProto/Config/TextCfg.ts";
import { TileCategoryCfg } from "../proto/schema/CommonProto/Config/TileCategoryCfg.ts";
import type { TileTemplateCfg } from "../proto/schema/CommonProto/Config/TileTemplateCfg.ts";
import type { TileTypeMappingCfg } from "../proto/schema/CommonProto/Config/TileTypeMappingCfg.ts";
import { UnitCategoryCfg } from "../proto/schema/CommonProto/Config/UnitCategoryCfg.ts";
import type { UnitPromotionCfg } from "../proto/schema/CommonProto/Config/UnitPromotionCfg.ts";
import type { UnitTemplateCfg } from "../proto/schema/CommonProto/Config/UnitTemplateCfg.ts";
import type { VisionBonusCfg } from "../proto/schema/CommonProto/Config/VisionBonusCfg.ts";
import { WeatherCategoryCfg } from "../proto/schema/CommonProto/Config/WeatherCategoryCfg.ts";
import type { WeatherCfg } from "../proto/schema/CommonProto/Config/WeatherCfg.ts";
import {
    BaseCfgDict,
    BaseSymmetryCfgDict,
    CategoryId,
    DecorationCfgDict,
    DecorationSymmetryCfgDict,
    ObjectCfgDict,
    ObjectSymmetryCfgDict,
} from "../tiles/constants/Common.ts";
import type { TileBaseCfg, TileDecorationCfg, TileObjectCfg } from "../tiles/Types.ts";
import { CategoryId as UnitsConstantsCategoryId, WeaponTypeId } from "../units/Constants.ts";
import type { WarTypeId } from "../warTypes/Constants.ts";
import { checkIsAtw, checkIsMrw } from "../warTypes/Utils.ts";
import { CategoryId as WeathersConstantsCategoryId } from "../weathers/Constants.ts";

export class GcData {
    private readonly _version                       : string;
    private readonly _systemCfg                     : SystemCfg;
    private readonly _unitMaxPromotion              : number;
    private readonly _tileCategoryCfgDict           : Map<number, TileCategoryCfg>;
    private readonly _unitCategoryCfgDict           : Map<number, UnitCategoryCfg>;
    private readonly _tileTemplateCfgDict           : Map<number, TileTemplateCfg>;
    private readonly _tileTypeMappingCfgDict        : Map<number, Map<number, TileTypeMappingCfg>>;
    private readonly _unitTemplateCfgDict           : Map<number, UnitTemplateCfg>;
    private readonly _moveCostCfgDict               : Map<number, { [moveType: number]: MoveCostCfg }>;
    private readonly _visionBonusCfgDict            : Map<number, { [tileType: number]: VisionBonusCfg }>;
    private readonly _buildableTileCfgDict          : Map<number, { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } }>;
    private readonly _coCategoryCfgDict             : Map<number, CoCategoryCfg>;
    private readonly _coBasicCfgDict                : Map<number, CoBasicCfg>;
    private readonly _coSkillCfgDict                : Map<number, CoSkillCfg>;
    private readonly _coSkillDescCfgDict            : Map<number, CoSkillDescCfg>;
    private readonly _weatherCfgDict                : Map<number, WeatherCfg>;
    private readonly _weatherCategoryCfgDict        : Map<number, WeatherCategoryCfg>;
    private readonly _damageChartCfgDict            : Map<number, { [armorType: number]: { [weaponType: number]: DamageChartCfg } }>;
    private readonly _unitPromotionCfgDict          : Map<number, UnitPromotionCfg>;
    private readonly _secondaryWeaponFlagDict       : Map<number, boolean>;
    private readonly _moveTypeCfgDict               : Map<number, MoveTypeCfg>;
    private readonly _textCfgDict                   : Map<number, TextCfg>;

    private _allEnabledCoCfgArray                   : CoBasicCfg[] | null = null;
    private _enabledCoCfgArrayForMrwAndAtw          : CoBasicCfg[] | null = null;
    private _enabledCoCfgArrayForAi                 : CoBasicCfg[] | null = null;
    private _allEnabledCoCategoryIdArray            : number[] | null = null;
    private _enabledCoCategoryIdArrayForMrwAndAtw   : number[] | null = null;

    private _allUnitTypeArray               : number[] | null = null;

    public constructor(version: string, rawConfig: FullConfig) {
        const unitPromotionCfg              = _destructUnitPromotionCfg(rawConfig.getUnitPromotion());
        const damageChartCfg                = _destructDamageChartCfg(rawConfig.getDamageChart());

        this._version                       = version;
        this._systemCfg                     = _destructSystemCfg(rawConfig.getSystem());
        this._tileCategoryCfgDict           = _destructTileCategoryCfg(rawConfig.getTileCategory(), rawConfig.getTileTemplate());
        this._unitCategoryCfgDict           = _destructUnitCategoryCfg(rawConfig.getUnitCategory(), rawConfig.getUnitTemplate());
        this._tileTemplateCfgDict           = _destructTileTemplateCfg(rawConfig.getTileTemplate());
        this._tileTypeMappingCfgDict        = _destructTileTypeMappingCfg(rawConfig.getTileTypeMapping());
        this._unitTemplateCfgDict           = _destructUnitTemplateCfg(rawConfig.getUnitTemplate());
        this._moveCostCfgDict               = _destructMoveCostCfg(rawConfig.getMoveCost());
        this._visionBonusCfgDict            = _destructVisionBonusCfg(rawConfig.getVisionBonus());
        this._buildableTileCfgDict          = _destructBuildableTileCfg(rawConfig.getBuildableTile());
        this._coCategoryCfgDict             = _destructCoCategoryCfg(rawConfig.getCoCategory());
        this._coBasicCfgDict                = _destructCoBasicCfg(rawConfig.getCoBasic());
        this._coSkillCfgDict                = _destructCoSkillCfg(rawConfig.getCoSkill());
        this._coSkillDescCfgDict            = _destructCoSkillDescCfg(rawConfig.getCoSkillDesc());
        this._weatherCfgDict                = _destructWeatherCfg(rawConfig.getWeather());
        this._weatherCategoryCfgDict        = _destructWeatherCategoryCfg(rawConfig.getWeatherCategory(), rawConfig.getWeather());
        this._moveTypeCfgDict               = _destructMoveTypeCfg(rawConfig.getMoveType());
        this._textCfgDict                   = _destructTextCfg(rawConfig.getText());
        this._damageChartCfgDict            = damageChartCfg;
        this._unitPromotionCfgDict          = unitPromotionCfg;
        this._unitMaxPromotion              = _getUnitMaxPromotion(unitPromotionCfg);
        this._secondaryWeaponFlagDict       = _getSecondaryWeaponFlags(damageChartCfg);
    }

    public getVersion(): string {
        return this._version;
    }

    public getSystemCfg(): SystemCfg {
        return this._systemCfg;
    }
    public getDorEnergyGainRateForAttacker(): number {
        return this.getSystemCfg().getDorEnergyGainRates()[0] ?? 0;
    }
    public getDorEnergyGainRateForDefender(): number {
        return this.getSystemCfg().getDorEnergyGainRates()[1] ?? 0;
    }
    public getTrilogyEnergyGainRateForAttacker(): number {
        return this.getSystemCfg().getTrilogyEnergyGainRates()[0] ?? 0;
    }
    public getTrilogyEnergyGainRateForDefender(): number {
        return this.getSystemCfg().getTrilogyEnergyGainRates()[1] ?? 0;
    }

    public getTileTemplateCfg(tileType: number): TileTemplateCfg | null {
        return this._tileTemplateCfgDict.get(tileType) ?? null;
    }
    public getTileTemplateCfgDict(): Map<number, TileTemplateCfg> {
        return this._tileTemplateCfgDict;
    }
    public getTileTemplateCfgByBaseTypeAndObjectType(tileBaseType: number, tileObjectType: number): TileTemplateCfg | null {
        const tileType = this.getTileType(tileBaseType, tileObjectType);
        return tileType == null ? null : this.getTileTemplateCfg(tileType);
    }
    public getTileBaseTypeByTileType(tileType: number): number | null {
        return this.getTileTemplateCfg(tileType)?.getToTileBaseTypeId() ?? null;
    }
    public getTileObjectTypeByTileType(tileType: number): number | null {
        return this.getTileTemplateCfg(tileType)?.getToTileObjectTypeId() ?? null;
    }
    public checkIsValidTileType(tileType: number): boolean {
        return this._tileTemplateCfgDict.has(tileType);
    }
    public checkIsValidTileTypeSubset(tileTypeArray: number[]): boolean {
        if ((new Set(tileTypeArray)).size !== tileTypeArray.length) {
            return false;
        }

        return tileTypeArray.every(v => this.checkIsValidTileType(v));
    }
    public getAllTileTypeArray(): number[] {
        return [...this._tileTemplateCfgDict.keys()].sort((v1, v2) => v1 - v2);
    }
    public getAllTileTypeArraySortedByWeight(): number[] {
        return [...this._tileTemplateCfgDict]
            .sort((v1, v2) => getExisted(v1[1].getSortWeight()) - getExisted(v2[1].getSortWeight()))
            .map(v => v[0]);
    }
    public getTileTypeArrayForTileChart(): number[] {
        return [...this._tileTemplateCfgDict]
            .filter(v => v[1].getSortWeightForTileChart() != null)
            .sort((v1, v2) => getExisted(v1[1].getSortWeightForTileChart()) - getExisted(v2[1].getSortWeightForTileChart()))
            .map(v => v[0]);
    }
    public getTileTypeArrayForDamageChart(): number[] {
        return [...this._tileTemplateCfgDict]
            .filter(v => v[1].getSortWeightForDamageChart() != null)
            .sort((v1, v2) => getExisted(v1[1].getSortWeightForDamageChart()) - getExisted(v2[1].getSortWeightForDamageChart()))
            .map(v => v[0]);
    }
    public getTileTypeArrayForMapInfo(): number[] {
        return [...this._tileTemplateCfgDict]
            .filter(v => v[1].getSortWeightForMapInfo() != null)
            .sort((v1, v2) => getExisted(v1[1].getSortWeightForMapInfo()) - getExisted(v2[1].getSortWeightForMapInfo()))
            .map(v => v[0]);
    }
    public getTileTypeArrayForUnattackable(): number[] {
        return [...this._tileTemplateCfgDict]
            .filter(v => v[1].getMaxHp() == null)
            .sort((v1, v2) => getExisted(v1[1].getSortWeightForTileChart()) - getExisted(v2[1].getSortWeightForTileChart()))
            .map(v => v[0]);
    }

    public static getTileBaseCfg(tileBaseType: number): TileBaseCfg | null {
        return BaseCfgDict.get(tileBaseType) ?? null;
    }
    public static checkIsUsableTileBaseType(tileBaseType: number): boolean {
        return !!BaseCfgDict.get(tileBaseType)?.isEnabled;
    }
    public static getAllEnabledTileBaseCfgArray(): TileBaseCfg[] {
        return [...BaseCfgDict].filter(v => v[1].isEnabled).map(v => v[1]).sort((v1, v2) => v1.tileBaseTypeId - v2.tileBaseTypeId);
    }
    public static getDefaultTileBaseType(): number {
        for (const [tileBaseType, cfg] of BaseCfgDict) {
            if (cfg.isDefault) {
                return tileBaseType;
            }
        }
        throw newError(`No default tile base type.`);
    }
    public static checkIsValidTileBaseShapeId(tileBaseType: number, shapeId: Undefinable<number>): boolean {
        const cfg = GcData.getTileBaseCfg(tileBaseType);
        return (!!cfg?.isEnabled)
            && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public static getSymmetricalTileBaseShapeId(tileBaseType: number, shapeId: number, symmetryType: SymmetryTypeId): number | null {
        const shapeIdList = BaseSymmetryCfgDict.get(tileBaseType)?.get(shapeId)?.symmetryShapeIds;
        return shapeIdList ? shapeIdList[symmetryType] : null;
    }
    public static checkIsTileBaseSymmetrical({ baseType, shapeId1, shapeId2, symmetryType }: {
        baseType    : number;
        shapeId1    : number;
        shapeId2    : number;
        symmetryType: SymmetryTypeId;
    }): boolean {
        return GcData.getSymmetricalTileBaseShapeId(baseType, shapeId1, symmetryType) === (shapeId2 || 0);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public static getTileObjectCfg(tileObjectType: number): TileObjectCfg | null {
        return ObjectCfgDict.get(tileObjectType) ?? null;
    }
    public static checkIsValidTileObjectType(tileObjectType: number): boolean {
        return ObjectCfgDict.has(tileObjectType);
    }
    public static getAllTileObjectCfgArray(): TileObjectCfg[] {
        return [...ObjectCfgDict]
            .sort((v1, v2) => v1[1].sortWeight - v2[1].sortWeight)
            .map(v => v[1]);
    }
    public static checkIsValidPlayerIndexForTileObject({ playerIndex, tileObjectType }: {
        playerIndex     : number;
        tileObjectType  : number;
    }): boolean {
        const cfg = GcData.getTileObjectCfg(tileObjectType);
        return (cfg != null)
            && (playerIndex >= PlayerIndex.Neutral)
            && (playerIndex <= PlayerIndex.Max)
            && ((!cfg.isNeutralOnly) || (playerIndex === PlayerIndex.Neutral));
    }
    public static checkIsValidTileObjectShapeId(tileObjectType: number, shapeId: Undefinable<number>): boolean {
        const shapesCount = GcData.getTileObjectCfg(tileObjectType)?.shapesCount;
        return (shapesCount != null)
            && ((shapeId == null) || ((shapeId >= 0) && (shapeId < shapesCount)));
    }
    public static getSymmetricalTileObjectType(tileObjectType: number, symmetryType: SymmetryTypeId): number {
        return getExisted(GcData.getTileObjectCfg(tileObjectType)?.symmetryTypes)[symmetryType];
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public static getSymmetricalTileObjectShapeId(tileObjectType: number, shapeId: number, symmetryType: SymmetryTypeId): number | null {
        const shapeIdArray = ObjectSymmetryCfgDict.get(tileObjectType)?.get(shapeId)?.symmetryShapeIds;
        return shapeIdArray ? shapeIdArray[symmetryType] : null;
    }
    public static checkIsTileObjectSymmetrical({ objectType, shapeId1, shapeId2, symmetryType }: {
        objectType      : number;
        shapeId1        : number;
        shapeId2        : number;
        symmetryType    : SymmetryTypeId;
    }): boolean {
        return GcData.getSymmetricalTileObjectShapeId(objectType, shapeId1, symmetryType) === (shapeId2 || 0);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public static getTileDecorationCfg(tileDecorationType: number): TileDecorationCfg | null {
        return DecorationCfgDict.get(tileDecorationType) ?? null;
    }
    public static checkIsValidTileDecorationType(tileDecorationType: number): boolean {
        return DecorationCfgDict.has(tileDecorationType);
    }
    public static getAllTileDecorationCfgArray(): TileDecorationCfg[] {
        return [...DecorationCfgDict].sort((v1, v2) => v1[0] - v2[0]).map(v => v[1]);
    }
    public static checkIsValidTileDecorationShapeId(tileDecorationType: Undefinable<number>, shapeId: Undefinable<number>): boolean {
        if (tileDecorationType == null) {
            return shapeId == null;
        }

        const cfg = GcData.getTileDecorationCfg(tileDecorationType);
        return (cfg != null)
            && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public static getSymmetricalTileDecorationShapeId(tileDecorationType: number, shapeId: number, symmetryType: SymmetryTypeId): number | null {
        const shapeIdArray = DecorationSymmetryCfgDict.get(tileDecorationType)?.get(shapeId)?.symmetryShapeIds;
        return shapeIdArray ? shapeIdArray[symmetryType] : null;
    }
    public static checkIsTileDecorationSymmetrical({ tileDecorationType, shapeId1, shapeId2, symmetryType }: {
        tileDecorationType  : number | null;
        shapeId1            : Undefinable<number>;
        shapeId2            : Undefinable<number>;
        symmetryType        : SymmetryTypeId;
    }): boolean {
        if (tileDecorationType == null) {
            return (shapeId1 == null) && (shapeId2 == null);
        }

        if (shapeId1 == null) {
            return shapeId2 == null;
        } else if (shapeId2 == null) {
            return shapeId1 == null;
        } else {
            return GcData.getSymmetricalTileDecorationShapeId(tileDecorationType, shapeId1, symmetryType) === shapeId2;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getTileType(tileBaseType: number, tileObjectType: number): number | null {
        return this._tileTypeMappingCfgDict.get(tileBaseType)?.get(tileObjectType)?.getTileTypeId() ?? null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getTileCategoryCfg(tileCategory: number): TileCategoryCfg | null {
        return this._tileCategoryCfgDict.get(tileCategory) ?? null;
    }
    private _getTileTypeIdsByCategory(tileCategory: number): number[] | null {
        const cfg = this.getTileCategoryCfg(tileCategory);
        return cfg ? cfg.getTileTypeIds() ?? [] : null;
    }
    public checkIsTileTypeInCategory(tileType: number, tileCategory: number): boolean {
        if (tileCategory === CategoryId.All) {
            return true;
        } else if (tileCategory === CategoryId.None) {
            return false;
        } else {
            const typeArray = this._getTileTypeIdsByCategory(tileCategory);
            return typeArray ? typeArray.indexOf(tileType) >= 0 : false;
        }
    }

    public getUnitTemplateCfg(unitType: number): UnitTemplateCfg | null {
        return this._unitTemplateCfgDict.get(unitType) ?? null;
    }
    public checkIsValidUnitType(unitType: number): boolean {
        return this._unitTemplateCfgDict.has(unitType);
    }
    public getFirstUnitType(): number {
        return this.getAllUnitTypeArray()[0];
    }
    public getAllUnitTypeArray(): number[] {
        if (this._allUnitTypeArray == null) {
            this._allUnitTypeArray = [...this._unitTemplateCfgDict].map(v => v[0]).sort((v1, v2) => v1 - v2);
        }
        return this._allUnitTypeArray;
    }

    public getUnitCategoryCfg(unitCategory: number): UnitCategoryCfg | null {
        return this._unitCategoryCfgDict.get(unitCategory) ?? null;
    }
    public getUnitTypesByCategory(unitCategory: number): number[] | null {
        const cfg = this.getUnitCategoryCfg(unitCategory);
        return cfg ? cfg.getUnitTypeIds() ?? [] : null;
    }
    public checkIsUnitTypeInCategory(unitType: number, unitCategory: number): boolean {
        if (unitCategory === UnitsConstantsCategoryId.All) {
            return true;
        } else if (unitCategory === UnitsConstantsCategoryId.None) {
            return false;
        } else {
            const typeArray = this.getUnitTypesByCategory(unitCategory);
            return typeArray ? typeArray.indexOf(unitType) >= 0 : false;
        }
    }
    public checkIsValidUnitTypeSubset(unitTypeArray: number[]): boolean {
        if ((new Set(unitTypeArray)).size !== unitTypeArray.length) {
            return false;
        }

        return unitTypeArray.every(v => this.checkIsValidUnitType(v));
    }

    public getUnitMaxPromotion(): number {
        return this._unitMaxPromotion;
    }
    public getUnitPromotionAttackBonus(promotion: number): number {
        return this._unitPromotionCfgDict.get(promotion)?.getAttackBonus() ?? 0;
    }
    public getUnitPromotionDefenseBonus(promotion: number): number {
        return this._unitPromotionCfgDict.get(promotion)?.getDefenseBonus() ?? 0;
    }

    public getDamageChartCfgs(attackerType: number): { [armorType: number]: { [weaponType: number]: DamageChartCfg } } | null {
        return this._damageChartCfgDict.get(attackerType) ?? null;
    }
    public checkHasSecondaryWeapon(unitType: number): boolean {
        return this._secondaryWeaponFlagDict.get(unitType) ?? false;
    }

    public checkIsValidWeatherType(weatherType: number): boolean {
        return this._weatherCfgDict.has(weatherType);
    }
    public getWeatherCfg(weatherType: number): WeatherCfg | null {
        return this._weatherCfgDict.get(weatherType) ?? null;
    }
    public getDefaultWeatherType(): number {
        for (const [weatherType, cfg] of this._weatherCfgDict) {
            if (cfg.getIsDefault()) {
                return weatherType;
            }
        }
        throw newError(`No default weather type.`);
    }
    public getNextWeatherType(weatherType: Undefinable<number>): number {
        const weatherTypeArray = this.getAllWeatherTypeArray();
        return weatherType == null
            ? weatherTypeArray[0]
            : weatherTypeArray[(weatherTypeArray.indexOf(weatherType) + 1) % weatherTypeArray.length];
    }
    public getAllWeatherTypeArray(): number[] {
        const typeArray: number[] = [];
        for (const [weatherType] of this._weatherCfgDict) {
            typeArray.push(weatherType);
        }
        return typeArray.sort((v1, v2) => v1 - v2);
    }

    public getWeatherCategoryCfg(category: number): WeatherCategoryCfg | null {
        return this._weatherCategoryCfgDict.get(category) ?? null;
    }
    public getWeatherTypeIdsByCategory(category: number): number[] | null {
        const cfg = this.getWeatherCategoryCfg(category);
        return cfg ? cfg.getWeatherTypeIds() ?? [] : null;
    }
    public checkIsWeatherTypeInCategory(weatherType: number, category: number): boolean {
        if (category === WeathersConstantsCategoryId.All) {
            return true;
        } else if (category === WeathersConstantsCategoryId.None) {
            return false;
        } else {
            const typeArray = this.getWeatherTypeIdsByCategory(category);
            return typeArray ? typeArray.indexOf(weatherType) >= 0 : false;
        }
    }

    public getBuildableTileCfgs(unitType: number): { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } | null {
        return this._buildableTileCfgDict.get(unitType) ?? null;
    }

    public getVisionBonusCfg(unitType: number): { [tileType: number]: VisionBonusCfg } | null {
        return this._visionBonusCfgDict.get(unitType) ?? null;
    }

    public getMoveCostCfg(tileType: number): { [moveType: number]: MoveCostCfg } | null {
        return this._moveCostCfgDict.get(tileType) ?? null;
    }

    public getCoCategoryCfg(categoryId: number): CoCategoryCfg | null {
        return this._coCategoryCfgDict.get(categoryId) ?? null;
    }
    public getCoCategoryCfgByCoId(coId: number): CoCategoryCfg | null {
        const coCategoryId = this.getCoBasicCfg(coId)?.getCoCategoryId();
        return coCategoryId == null ? null : this.getCoCategoryCfg(coCategoryId);
    }
    public getEnabledCoCategoryIdArray(warType: WarTypeId): number[] {
        if ((checkIsAtw(warType)) || (checkIsMrw(warType))) {
            return this._enabledCoCategoryIdArrayForMrwAndAtw ??= [...new Set([...this._coBasicCfgDict.values()]
                .filter(v => (v.getCoCategoryId() != null) && (v.getIsEnabled()) && (v.getIsEnabledForMrwAndAtw()))
                .map(v => v.getCoCategoryId() ?? 0))]
                .sort((v1, v2) => (this.getCoCategoryCfg(v1)?.getSort() ?? 0) - (this.getCoCategoryCfg(v2)?.getSort() ?? 0));
        } else {
            return this.getAllEnabledCoCategoryIdArray();
        }
    }
    public getEnabledCoCategoryIdArrayByGameModeId(gameModeId: ModeId): number[] {
        if ((gameModeId === ModeId.AutoTourney) || (gameModeId === ModeId.RankedMatch)) {
            return this._enabledCoCategoryIdArrayForMrwAndAtw ??= [...new Set([...this._coBasicCfgDict.values()]
                .filter(v => (v.getCoCategoryId() != null) && (v.getIsEnabled()) && (v.getIsEnabledForMrwAndAtw()))
                .map(v => v.getCoCategoryId() ?? 0))]
                .sort((v1, v2) => (this.getCoCategoryCfg(v1)?.getSort() ?? 0) - (this.getCoCategoryCfg(v2)?.getSort() ?? 0));
        } else {
            return this.getAllEnabledCoCategoryIdArray();
        }
    }
    public getAllEnabledCoCategoryIdArray(): number[] {
        return this._allEnabledCoCategoryIdArray ??= [...new Set([...this._coBasicCfgDict.values()]
            .filter(v => (v.getCoCategoryId() != null) && (v.getIsEnabled()))
            .map(v => v.getCoCategoryId() ?? 0))]
            .sort((v1, v2) => (this.getCoCategoryCfg(v1)?.getSort() ?? 0) - (this.getCoCategoryCfg(v2)?.getSort() ?? 0));
    }
    public checkIsValidCoCategoryIdSubset(coCategoryIdArray: number[]): boolean {
        return (coCategoryIdArray.length === new Set(coCategoryIdArray).size)
            && (coCategoryIdArray.every(v => this.getCoCategoryCfg(v) != null));
    }

    public checkHasCo(coId: number): boolean {
        return this._coBasicCfgDict.has(coId);
    }
    public getCoBasicCfg(coId: number): CoBasicCfg | null {
        return this._coBasicCfgDict.get(coId) ?? null;
    }
    public checkIsValidCoIdSubset(arr: number[]): boolean {
        return (arr.length === new Set(arr).size)
            && (arr.every(v => this.checkHasCo(v)));
    }
    public getCoIdArrayByCategoryIdSet(coCategoryIdSet: Set<number>): number[] {
        const coIdArray: number[] = [];
        for (const [coId, cfg] of this._coBasicCfgDict) {
            const categoryId = cfg.getCoCategoryId();
            if ((categoryId != null) && (coCategoryIdSet.has(categoryId))) {
                coIdArray.push(coId);
            }
        }
        return coIdArray;
    }
    public getEnabledCoIdByCategoryId(coCategoryId: number): number | null {
        for (const [coId, cfg] of this._coBasicCfgDict) {
            if ((cfg.getCoCategoryId() == coCategoryId) && (cfg.getIsEnabled())) {
                return coId;
            }
        }
        return null;
    }
    public getCoIdByCategoryId(coCategoryId: number): number {
        for (const [coId, cfg] of this._coBasicCfgDict) {
            const categoryId = cfg.getCoCategoryId();
            if (categoryId == coCategoryId) {
                return coId;
            }
        }
        throw newError(`No available CO ID for coCategoryId: ${coCategoryId}.`);
    }
    public getCoNameAndTierText(coId: number): string | null {
        return this.getCoBasicCfg(coId)?.getName() ?? null;
    }
    public getCoEnergyType(coId: number): EnergyTypeId | null {
        return this.getCoBasicCfg(coId)?.getCoEnergyTypeId() ?? null;
    }
    public checkIsOriginCo(coId: number): boolean {
        return this.getCoBasicCfg(coId)?.getDataDesigner() === `Intelligent Systems`;
    }

    public getEnabledCoArray(warType: WarTypeId): CoBasicCfg[] {
        if ((checkIsAtw(warType)) || (checkIsMrw(warType))) {
            return this._enabledCoCfgArrayForMrwAndAtw ??= [...this._coBasicCfgDict.values()].filter(v => (v.getIsEnabled()) && (v.getIsEnabledForMrwAndAtw())).sort(sorterForCoBasicCfgArray);
        } else {
            return this.getAllEnabledCoArray();
        }
    }
    public getEnabledCoArrayByGameModeId(gameModeId: ModeId): CoBasicCfg[] {
        if ((gameModeId === ModeId.AutoTourney) || (gameModeId === ModeId.RankedMatch)) {
            return this._enabledCoCfgArrayForMrwAndAtw ??= [...this._coBasicCfgDict.values()].filter(v => (v.getIsEnabled()) && (v.getIsEnabledForMrwAndAtw())).sort(sorterForCoBasicCfgArray);
        } else {
            return this.getAllEnabledCoArray();
        }
    }
    public getAllEnabledCoArray(): CoBasicCfg[] {
        return this._allEnabledCoCfgArray ??= [...this._coBasicCfgDict.values()].filter(v => v.getIsEnabled()).sort(sorterForCoBasicCfgArray);
    }
    public getEnabledCoArrayForAi(): CoBasicCfg[] {
        return this._enabledCoCfgArrayForAi ??= [...this._coBasicCfgDict.values()].filter(v => v.getIsEnabledForAi()).sort(sorterForCoBasicCfgArray);
    }
    public getCoIdArrayForDialogue(): number[] {
        const coCfgArray: CoBasicCfg[] = [];
        for (const [, cfg] of this._coBasicCfgDict) {
            if (cfg.getIsEnabledForDialogue()) {
                coCfgArray.push(cfg);
            }
        }

        coCfgArray.sort((c1, c2) => {
            const name1 = c1.getName();
            const name2 = c2.getName();
            if (name1 !== name2) {
                return name1.localeCompare(name2, "zh");
            } else {
                return 0;
            }
        });

        return coCfgArray.map(v => v.getCoId());
    }

    public getCoSkillCfg(skillId: number): CoSkillCfg | null {
        return this._coSkillCfgDict.get(skillId) ?? null;
    }
    public getCoSkillArray(coId: number, skillType: SkillTypeId): number[] | null {
        const coConfig = this.getCoBasicCfg(coId);
        if (coConfig == null) {
            return null;
        }

        switch (skillType) {
            case SkillTypeId.Passive    : return coConfig.getPassiveSkillIds() ?? [];
            case SkillTypeId.Power      : return coConfig.getPowerSkillIds() ?? [];
            case SkillTypeId.SuperPower : return coConfig.getSuperPowerSkillIds() ?? [];
            default                     : return null;
        }
    }
    public getCoSkillDescCfg(coId: number): CoSkillDescCfg | null {
        return this._coSkillDescCfgDict.get(coId) ?? null;
    }

    public getMoveTypeCfg(moveType: number): MoveTypeCfg | null {
        return this._moveTypeCfgDict.get(moveType) ?? null;
    }
    public getAllMoveTypeIdArray(): number[] {
        return [...this._moveTypeCfgDict].map(v => v[0]);
    }



    public getTextCfg(textId: number): TextCfg | null {
        return this._textCfgDict.get(textId) ?? null;
    }
    public getTextArray(textId: number, languageType: LanguageType): string[] | null {
        const cfg = this.getTextCfg(textId);
        if (cfg == null) {
            return null;
        }

        switch (languageType) {
            case LanguageType.Chinese   : return cfg.getTextArray0() ?? null;
            case LanguageType.English   : return cfg.getTextArray1() ?? null;
            case LanguageType.Spanish   : return cfg.getTextArray2() ?? null;
            default                                                 : return null;
        }
    }
}

function _destructSystemCfg(data: SystemCfg[]): SystemCfg {
    return data[0];
}
function _destructTileCategoryCfg(data: TileCategoryCfg[], tileTemplateCfgs: TileTemplateCfg[]): Map<number, TileCategoryCfg> {
    const dst = new Map<number, TileCategoryCfg>();
    for (const d of data) {
        const category = d.getTileCategoryId();
        dst.set(category, d);
    }

    {
        const categoryId = CategoryId.None;
        if (dst.has(categoryId)) {
            (getExisted(dst.get(categoryId)).getTileTypeIds()).length = 0;
        } else {
            dst.set(categoryId, TileCategoryCfg.fromJson({
                tileCategoryId : categoryId,
                tileTypeIds    : [],
            }));
        }
    }

    {
        const categoryId        = CategoryId.All;
        const allTileTypeIds    = tileTemplateCfgs.map(v => v.getTileTypeId());
        if (dst.has(categoryId)) {
            getExisted(dst.get(categoryId)).setTileTypeIds(allTileTypeIds);
        } else {
            dst.set(categoryId, TileCategoryCfg.fromJson({
                tileCategoryId : categoryId,
                tileTypeIds    : allTileTypeIds,
            }));
        }
    }

    return dst;
}
function _destructUnitCategoryCfg(data: UnitCategoryCfg[], unitTemplateCfgs: UnitTemplateCfg[]): Map<number, UnitCategoryCfg> {
    const dst = new Map<number, UnitCategoryCfg>();
    for (const d of data) {
        dst.set(d.getUnitCategoryId(), d);
    }

    {
        const categoryId = UnitsConstantsCategoryId.None;
        if (dst.has(categoryId)) {
            (getExisted(dst.get(categoryId)).getUnitTypeIds()).length = 0;
        } else {
            dst.set(categoryId, UnitCategoryCfg.fromJson({
                unitCategoryId : categoryId,
                unitTypeIds    : [],
            }));
        }
    }

    {
        const categoryType      = UnitsConstantsCategoryId.All;
        const allUnitTypeArray  = unitTemplateCfgs.map(v => v.getUnitTypeId());
        if (dst.has(categoryType)) {
            getExisted(dst.get(categoryType)).setUnitTypeIds(allUnitTypeArray);
        } else {
            dst.set(categoryType, UnitCategoryCfg.fromJson({
                unitCategoryId : categoryType,
                unitTypeIds    : allUnitTypeArray,
            }));
        }
    }

    return dst;
}
function _destructTileTemplateCfg(data: TileTemplateCfg[]): Map<number, TileTemplateCfg> {
    const dst = new Map<number, TileTemplateCfg>();
    for (const d of data) {
        dst.set(d.getTileTypeId(), d);
    }
    return dst;
}
function _destructTileTypeMappingCfg(data: TileTypeMappingCfg[]): Map<number, Map<number, TileTypeMappingCfg>> {
    const dst = new Map<number, Map<number, TileTypeMappingCfg>>();
    for (const d of data) {
        const tileBaseType          = d.getTileBaseTypeId();
        const subData               = dst.get(tileBaseType) ?? new Map<number, TileTypeMappingCfg>();
        subData.set(d.getTileObjectTypeId(), d);
        dst.set(tileBaseType, subData);
    }
    return dst;
}
function _destructUnitTemplateCfg(data: UnitTemplateCfg[]): Map<number, UnitTemplateCfg> {
    const dst = new Map<number, UnitTemplateCfg>();
    for (const d of data) {
        dst.set(d.getUnitTypeId(), d);
    }
    return dst;
}
function _destructDamageChartCfg(data: DamageChartCfg[]): Map<number, { [armorType: number]: { [weaponType: number]: DamageChartCfg } }> {
    const dst = new Map<number, { [armorType: number]: { [weaponType: number]: DamageChartCfg } }>();
    for (const d of data) {
        const attackerType                  = d.getAttackerUnitTypeId();
        const armorType                     = d.getArmorTypeId();
        const subData                       = dst.get(attackerType) ?? {};
        subData[armorType]                  = subData[armorType] || {};
        subData[armorType][d.getUnitWeaponTypeId()]    = d;
        dst.set(attackerType, subData);
    }
    return dst;
}
function _destructMoveCostCfg(data: MoveCostCfg[]): Map<number, { [moveType: number]: MoveCostCfg }> {
    const dst = new Map<number, { [moveType: number]: MoveCostCfg }>();
    for (const d of data) {
        const tileType      = d.getTileTypeId();
        const subData       = dst.get(tileType) ?? {};
        subData[d.getMoveTypeId()] = d;
        dst.set(tileType, subData);
    }
    return dst;
}
function _destructUnitPromotionCfg(data: UnitPromotionCfg[]): Map<number, UnitPromotionCfg> {
    const dst = new Map<number, UnitPromotionCfg>();
    for (const d of data) {
        dst.set(d.getPromotion(), d);
    }
    return dst;
}
function _destructVisionBonusCfg(data: VisionBonusCfg[]): Map<number, { [tileType: number]: VisionBonusCfg }> {
    const dst = new Map<number, { [tileType: number]: VisionBonusCfg }>();
    for (const d of data) {
        const unitType      = d.getUnitTypeId();
        const subData       = dst.get(unitType) ?? {};
        subData[d.getTileTypeId()] = d;
        dst.set(unitType, subData);
    }
    return dst;
}
function _destructBuildableTileCfg(data: BuildableTileCfg[]): Map<number, { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } }> {
    const dst = new Map<number, { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } }>();
    for (const d of data) {
        const unitType                          = d.getUnitTypeId();
        const srcBaseType                       = d.getSrcTileBaseTypeId();
        const subData                           = dst.get(unitType) ?? {};
        subData[srcBaseType]                    = subData[srcBaseType] || {};
        subData[srcBaseType][d.getSrcTileObjectTypeId()]   = d;
        dst.set(unitType, subData);
    }
    return dst;
}
function _destructCoCategoryCfg(data: CoCategoryCfg[]): Map<number, CoCategoryCfg> {
    const dst = new Map<number, CoCategoryCfg>();
    for (const d of data) {
        dst.set(d.getCoCategoryId(), d);
    }
    return dst;
}
function _destructCoBasicCfg(data: CoBasicCfg[]): Map<number, CoBasicCfg> {
    const dst = new Map<number, CoBasicCfg>();
    for (const d of data) {
        dst.set(d.getCoId(), d);
    }
    return dst;
}
function _destructCoSkillCfg(data: CoSkillCfg[]): Map<number, CoSkillCfg> {
    const dst = new Map<number, CoSkillCfg>();
    for (const d of data) {
        dst.set(d.getSkillId(), d);
    }
    return dst;
}
function _destructCoSkillDescCfg(data: CoSkillDescCfg[]): Map<number, CoSkillDescCfg> {
    const dst = new Map<number, CoSkillDescCfg>();
    for (const d of data) {
        dst.set(d.getCoId(), d);
    }
    return dst;
}
function _destructWeatherCfg(data: WeatherCfg[]): Map<number, WeatherCfg> {
    const dst = new Map<number, WeatherCfg>();
    for (const d of data) {
        dst.set(d.getWeatherTypeId(), d);
    }
    return dst;
}
function _destructWeatherCategoryCfg(data: WeatherCategoryCfg[], weatherCfgs: WeatherCfg[]): Map<number, WeatherCategoryCfg> {
    const dst = new Map<number, WeatherCategoryCfg>();
    for (const d of data) {
        dst.set(d.getWeatherCategoryId(), d);
    }

    {
        const categoryId = WeathersConstantsCategoryId.None;
        if (dst.has(categoryId)) {
            getExisted(dst.get(categoryId)).getWeatherTypeIds().length = 0;
        } else {
            dst.set(categoryId, WeatherCategoryCfg.fromJson({
                weatherCategoryId : categoryId,
                weatherTypeIds    : [],
            }));
        }
    }

    {
        const categoryId        = WeathersConstantsCategoryId.All;
        const allWeatherTypeIds = weatherCfgs.map(v => v.getWeatherTypeId());
        if (dst.has(categoryId)) {
            getExisted(dst.get(categoryId)).setWeatherTypeIds(allWeatherTypeIds);
        } else {
            dst.set(categoryId, WeatherCategoryCfg.fromJson({
                weatherCategoryId : categoryId,
                weatherTypeIds    : allWeatherTypeIds,
            }));
        }
    }

    return dst;
}
function _destructMoveTypeCfg(data: MoveTypeCfg[]): Map<number, MoveTypeCfg> {
    const dst = new Map<number, MoveTypeCfg>();
    for (const d of data) {
        dst.set(d.getMoveTypeId(), d);
    }
    return dst;
}
function _destructTextCfg(data: TextCfg[]): Map<number, TextCfg> {
    const dst = new Map<number, TextCfg>();
    for (const d of data) {
        dst.set(d.getTextId(), d);
    }
    return dst;
}
function _getUnitMaxPromotion(cfg: Map<number, UnitPromotionCfg>): number {
    let maxPromotion = 0;
    for (const [promotion] of cfg) {
        maxPromotion = Math.max(maxPromotion, promotion);
    }
    return maxPromotion;
}
function _getSecondaryWeaponFlags(chartCfgs: Map<number, { [armorType: number]: { [weaponType: number]: DamageChartCfg } }>): Map<number, boolean> {
    const flags = new Map<number, boolean>();
    for (const [attackerType, cfgs] of chartCfgs) {
        let hasWeapon = false;
        for (const armorType in cfgs) {
            const cfg = cfgs[armorType][WeaponTypeId.Secondary];
            if ((cfg) && (cfg.getDamage() != null)) {
                hasWeapon = true;
                break;
            }
        }

        flags.set(attackerType, hasWeapon);
    }

    return flags;
}

const sorterForCoBasicCfgArray = (c1: CoBasicCfg, c2: CoBasicCfg): number => {
    const name1 = c1.getName();
    const name2 = c2.getName();
    if (name1 !== name2) {
        return name1.localeCompare(name2, "zh");
    } else {
        return 0;
    }
};
