import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoStructureGridIndex from "../../proto/schema/CommonProto/Structure/GridIndex.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialUnit from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import * as UnitBuffsUtilsCommon from "../../unitBuffs/utils/Common.ts";
import * as UnitsConstants from "../Constants.ts";
import type * as UnitsIUnit from "../IUnit.ts";
import * as UnitsUtilsCommon from "./Common.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WeightedGridIndexesUtils from "../../weightedGridIndexes/Utils.ts";

type SerialUnitJson     = ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnitJson;
type GcData             = GameConfigGcData.GcData;

export function createNewUnitDataForChangeType(unit: UnitsIUnit.IUnit, newUnitTypeId: number): ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit {
    const unitTemplateCfg       = HelpersMisc.getExisted(unit.getGcData().getUnitTemplateCfg(newUnitTypeId));
    const maxBuildMaterial      = unitTemplateCfg.getMaxBuildMaterial() ?? 0;
    const maxPrimaryWeaponAmmo  = unitTemplateCfg.getPrimaryWeaponMaxAmmo() ?? 0;
    const maxFlareAmmo          = unitTemplateCfg.getFlareMaxAmmo() ?? 0;
    const maxProduceMaterial    = unitTemplateCfg.getMaxProduceMaterial() ?? 0;

    return create({
        unitType                        : newUnitTypeId,
        unitId                          : unit.getUnitId(),
        playerIndex                     : unit.getPlayerIndex(),
        gridIndex                       : unit.getGridIndex().toProto().toJson(),

        actionState                     : unit.getActionState(),
        currentHp                       : Math.min(unit.getCurrentHp(), unitTemplateCfg.getMaxHp()),
        aiMode                          : unit.getAiMode(),
        groupedTagId                    : unit.getGroupedTagId(),
        customNameId                    : unit.getCustomNameId() ?? null,

        currentPromotion                : unit.getCurrentPromotion(),
        isDiving                        : (unit.getIsDiving()) && (unitTemplateCfg.getDiveCfg() != null),
        isCoOnboard                     : unit.getIsCoOnboard(),
        currentBuildMaterial            : unit.getMaxBuildMaterial() == null
            ? maxBuildMaterial
            : Math.min(unit.getCurrentBuildMaterial(), maxBuildMaterial),

        aiWeightedDestination           : unit.getAiWeightedDestination()?.toProto().toJson() ?? null,
        forbiddenGroupedLocationIdArray : unit.getForbiddenGroupedLocationIdArray(),
        buffArray                       : unit.getBuffList().map(v => v.toJson()),

        primaryWeaponCurrentAmmo        : unit.getPrimaryWeaponMaxAmmo() == null
            ? maxPrimaryWeaponAmmo
            : Math.min(unit.getPrimaryWeaponCurrentAmmo(), maxPrimaryWeaponAmmo),
        flareCurrentAmmo                : unit.getFlareMaxAmmo() == null
            ? maxFlareAmmo
            : Math.min(unit.getFlareCurrentAmmo(), maxFlareAmmo),
        currentProduceMaterial          : unit.getMaxProduceMaterial() == null
            ? maxProduceMaterial
            : Math.min(unit.getCurrentProduceMaterial(), maxProduceMaterial),
        currentFuel                     : Math.min(unit.getCurrentFuel(), unitTemplateCfg.getMaxFuel()),
        loaderUnitId                    : unit.getLoaderUnitId() ?? null,
    });
}

export function getErrorCodeForUnitDataIgnoringUnitId({ unitData, mapSize, playersCountUnneutral, gameConfig }: {
    unitData                : ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit;
    gameConfig              : GameConfigGcData.GcData;
    mapSize                 : AuxiliaryTypesAuxiliaryTypes.Undefinable<AuxiliaryTypesMapSize.MapSize>;
    playersCountUnneutral   : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
}): UtilsClientErrorCode.ClientErrorCode {
    const gridIndex = AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(unitData.getGridIndex());
    if (gridIndex == null) {
        return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_00;
    }
    if ((mapSize) && (!gridIndex.checkIsInsideMap(mapSize))) {
        return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_01;
    }

    const unitType      = unitData.getUnitType();
    const playerIndex   = unitData.getPlayerIndex();
    if ((playerIndex < PlayersConstants.PlayerIndex.First) ||
        (playerIndex > PlayersConstants.PlayerIndex.Max)
    ) {
        return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_03;
    }
    if ((playersCountUnneutral != null) && (playerIndex > playersCountUnneutral)) {
        return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_04;
    }

    const cfg = gameConfig.getUnitTemplateCfg(unitType);
    if (cfg == null) {
        return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_05;
    }

    if (unitData.getCurrentBuildMaterial() > (cfg.getMaxBuildMaterial() ?? 0)) {
        return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_06;
    }

    if (unitData.getCurrentFuel() > cfg.getMaxFuel()) {
        return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_07;
    }

    if (unitData.getCurrentHp() > cfg.getMaxHp()) {
        return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_08;
    }

    if (!UnitsUtilsCommon.checkIsValidProduceMaterial(unitData.getCurrentProduceMaterial())) {
        return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_09;
    }

    if (unitData.getCurrentPromotion() > gameConfig.getUnitMaxPromotion()) {
        return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_10;
    }

    if (unitData.getFlareCurrentAmmo() > (cfg.getFlareMaxAmmo() ?? 0)) {
        return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_11;
    }

    if ((unitData.getIsDiving()) && (cfg.getDiveCfg() == null)) {
        return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_12;
    }

    if (!UnitsUtilsCommon.checkIsValidPrimaryAmmo(unitData.getPrimaryWeaponCurrentAmmo())) {
        return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_13;
    }

    // if (unitData.getDeprecatedIsCapturingTile()) {
    //     return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_14;
    // }

    const actionState = unitData.getActionState();
    if ((actionState != null)                           &&
        (actionState !== UnitsConstants.ActionStateId.Idle)    &&
        (actionState !== UnitsConstants.ActionStateId.Acted)
    ) {
        return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_15;
    }

    const loaderUnitId = unitData.getLoaderUnitId();
    if ((loaderUnitId != null) && (loaderUnitId === unitData.getUnitId())) {
        return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_16;
    }

    const groupedTagId = unitData.getGroupedTagId() ?? 0;
    if (!UnitsUtilsCommon.checkIsValidEncodedTagId(groupedTagId)) {
        return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_17;
    }

    {
        const aiWeightedDestination = unitData.getAiWeightedDestination();
        if (aiWeightedDestination != null) {
            const gridIndexAndWeight = WeightedGridIndexesUtils.toGridIndexAndWeight(aiWeightedDestination);
            if (gridIndexAndWeight == null) {
                return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_18;
            }
            if ((mapSize) && (!gridIndexAndWeight.gridIndex.checkIsInsideMap(mapSize))) {
                return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_19;
            }
        }
    }

    {
        const buffArray = unitData.getBuffArray();
        if (buffArray.some(v => !UnitBuffsUtilsCommon.checkIsValid(v))) {
            return UtilsClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_20;
        }
    }

    return UtilsClientErrorCode.ClientErrorCode.NoError;
}

export function fillNonTrivialDefaultValues(unitData: ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit, gcData: GcData): void {
    const cfg = gcData.getUnitTemplateCfg(unitData.getUnitType());
    if (!cfg) {
        return;
    }

    unitData.setCurrentHp(cfg.getMaxHp());
    unitData.setIsDiving(cfg.getDiveCfg()?.getIsDivedByDefault() ?? null);
    unitData.setCurrentBuildMaterial(cfg.getMaxBuildMaterial() ?? null);
    unitData.setPrimaryWeaponCurrentAmmo(cfg.getPrimaryWeaponMaxAmmo() ?? null);
    unitData.setFlareCurrentAmmo(cfg.getFlareMaxAmmo() ?? null);
    unitData.setCurrentProduceMaterial(cfg.getMaxProduceMaterial() ?? null);
    unitData.setCurrentFuel(cfg.getMaxFuel() ?? null);
}

export function create(json: Required<SerialUnitJson>): ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit {
    return ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit.fromJson(json);
}

export function createDefault({ unitTypeId, unitId, playerIndex, gridIndex, gcData }: {
    unitTypeId  : number;
    unitId      : number;
    playerIndex : number;
    gridIndex   : Required<ProtoSchemaCommonProtoStructureGridIndex.GridIndexJson>;
    gcData      : GcData;
}): ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit {
    const cfg = HelpersMisc.getExisted(gcData.getUnitTemplateCfg(unitTypeId));
    return create({
        unitType                        : unitTypeId,
        unitId                          : unitId,
        playerIndex                     : playerIndex,
        gridIndex                       : gridIndex,

        actionState                     : null,
        currentHp                       : cfg.getMaxHp(),
        aiMode                          : null,
        groupedTagId                    : null,
        customNameId                    : null,

        currentPromotion                : null,
        isDiving                        : cfg.getDiveCfg()?.getIsDivedByDefault() ?? null,
        isCoOnboard                     : null,
        currentBuildMaterial            : cfg.getMaxBuildMaterial() ?? null,

        aiWeightedDestination           : null,
        forbiddenGroupedLocationIdArray : [],
        buffArray                       : [],

        primaryWeaponCurrentAmmo        : cfg.getPrimaryWeaponMaxAmmo() ?? null,
        flareCurrentAmmo                : cfg.getFlareMaxAmmo() ?? null,
        currentProduceMaterial          : cfg.getMaxProduceMaterial() ?? null,
        currentFuel                     : cfg.getMaxFuel(),
        loaderUnitId                    : null,
    });
}
