import {
    Units_Constants,
    UnitBuffs_Utils_Common,
    Units_Utils_Common,
    Utils_ClientErrorCode,
    type GameConfigs_GameConfig,
    Helpers_Misc,
    AuxiliaryTypes_GridIndex,
    type Units_IUnit,
    type AuxiliaryTypes_MapSize,
    Players_Constants,
    WeightedGridIndexes_Utils,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { GridIndexJson } from "../../proto/schema/CommonProto/Structure/GridIndex.ts";
import {
    type SerialUnitJson as ProtoSerialUnitJson,
    SerialUnit,
} from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";

export function createNewUnitDataForChangeType(unit: Units_IUnit.IUnit, newUnitTypeId: number): SerialUnit {
    const unitTemplateCfg       = Helpers_Misc.getExisted(unit.getGcData().getUnitTemplateCfg(newUnitTypeId));
    const maxBuildMaterial      = unitTemplateCfg.getMaxBuildMaterial() ?? 0;
    const maxPrimaryWeaponAmmo  = unitTemplateCfg.getPrimaryWeaponMaxAmmo() ?? 0;
    const maxFlareAmmo          = unitTemplateCfg.getFlareMaxAmmo() ?? 0;
    const maxProduceMaterial    = unitTemplateCfg.getMaxProduceMaterial() ?? 0;

    return create({
        unitType    : newUnitTypeId,
        unitId      : unit.getUnitId(),
        playerIndex : unit.getPlayerIndex(),
        gridIndex   : unit.getGridIndex().toProto().toJson(),

        actionState  : unit.getActionState(),
        currentHp    : Math.min(unit.getCurrentHp(), unitTemplateCfg.getMaxHp()),
        aiMode       : unit.getAiMode(),
        groupedTagId : unit.getGroupedTagId(),
        customNameId : unit.getCustomNameId() ?? null,

        currentPromotion     : unit.getCurrentPromotion(),
        isDiving             : (unit.getIsDiving()) && (unitTemplateCfg.getDiveCfg() != null),
        isCoOnboard          : unit.getIsCoOnboard(),
        currentBuildMaterial : unit.getMaxBuildMaterial() == null
            ? maxBuildMaterial
            : Math.min(unit.getCurrentBuildMaterial(), maxBuildMaterial),

        aiWeightedDestination           : unit.getAiWeightedDestination()?.toProto().toJson() ?? null,
        forbiddenGroupedLocationIdArray : unit.getForbiddenGroupedLocationIdArray(),
        buffArray                       : unit.getBuffList().map(v => v.toJson()),

        primaryWeaponCurrentAmmo : unit.getPrimaryWeaponMaxAmmo() == null
            ? maxPrimaryWeaponAmmo
            : Math.min(unit.getPrimaryWeaponCurrentAmmo(), maxPrimaryWeaponAmmo),
        flareCurrentAmmo : unit.getFlareMaxAmmo() == null
            ? maxFlareAmmo
            : Math.min(unit.getFlareCurrentAmmo(), maxFlareAmmo),
        currentProduceMaterial : unit.getMaxProduceMaterial() == null
            ? maxProduceMaterial
            : Math.min(unit.getCurrentProduceMaterial(), maxProduceMaterial),
        currentFuel  : Math.min(unit.getCurrentFuel(), unitTemplateCfg.getMaxFuel()),
        loaderUnitId : unit.getLoaderUnitId() ?? null,
    });
}

export function getErrorCodeForUnitDataIgnoringUnitId({ unitData, mapSize, playersCountUnneutral, gameConfig }: {
    unitData                : SerialUnit;
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    mapSize                 : AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_MapSize.MapSize>;
    playersCountUnneutral   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
}): Utils_ClientErrorCode.ClientErrorCode {
    const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(unitData.getGridIndex());
    if (gridIndex == null) {
        return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_00;
    }
    if ((mapSize) && (!gridIndex.checkIsInsideMap(mapSize))) {
        return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_01;
    }

    const unitType      = unitData.getUnitType();
    const playerIndex   = unitData.getPlayerIndex();
    if ((playerIndex < Players_Constants.PlayerIndex.First) ||
        (playerIndex > Players_Constants.PlayerIndex.Max)
    ) {
        return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_03;
    }
    if ((playersCountUnneutral != null) && (playerIndex > playersCountUnneutral)) {
        return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_04;
    }

    const cfg = gameConfig.getUnitTemplateCfg(unitType);
    if (cfg == null) {
        return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_05;
    }

    if (unitData.getCurrentBuildMaterial() > (cfg.getMaxBuildMaterial() ?? 0)) {
        return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_06;
    }

    if (unitData.getCurrentFuel() > cfg.getMaxFuel()) {
        return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_07;
    }

    if (unitData.getCurrentHp() > cfg.getMaxHp()) {
        return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_08;
    }

    if (!Units_Utils_Common.checkIsValidProduceMaterial(unitData.getCurrentProduceMaterial())) {
        return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_09;
    }

    if (unitData.getCurrentPromotion() > gameConfig.getUnitMaxPromotion()) {
        return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_10;
    }

    if (unitData.getFlareCurrentAmmo() > (cfg.getFlareMaxAmmo() ?? 0)) {
        return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_11;
    }

    if ((unitData.getIsDiving()) && (cfg.getDiveCfg() == null)) {
        return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_12;
    }

    if (!Units_Utils_Common.checkIsValidPrimaryAmmo(unitData.getPrimaryWeaponCurrentAmmo())) {
        return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_13;
    }

    // if (unitData.getDeprecatedIsCapturingTile()) {
    //     return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_14;
    // }

    const actionState = unitData.getActionState();
    if ((actionState != null)                           &&
        (actionState !== Units_Constants.ActionStateId.Idle)    &&
        (actionState !== Units_Constants.ActionStateId.Acted)
    ) {
        return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_15;
    }

    const loaderUnitId = unitData.getLoaderUnitId();
    if ((loaderUnitId != null) && (loaderUnitId === unitData.getUnitId())) {
        return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_16;
    }

    const groupedTagId = unitData.getGroupedTagId();
    if (!Units_Utils_Common.checkIsValidEncodedTagId(groupedTagId)) {
        return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_17;
    }

    {
        const aiWeightedDestination = unitData.getAiWeightedDestination();
        if (aiWeightedDestination != null) {
            const gridIndexAndWeight = WeightedGridIndexes_Utils.toGridIndexAndWeight(aiWeightedDestination);
            if (gridIndexAndWeight == null) {
                return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_18;
            }
            if ((mapSize) && (!gridIndexAndWeight.gridIndex.checkIsInsideMap(mapSize))) {
                return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_19;
            }
        }
    }

    {
        const buffArray = unitData.getBuffArray();
        if (buffArray.some(v => !UnitBuffs_Utils_Common.checkIsValid(v))) {
            return Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_20;
        }
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}

export function fillNonTrivialDefaultValues(unitData: SerialUnit, gcData: GameConfigs_GameConfig.GameConfig): void {
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
    unitData.setCurrentFuel(cfg.getMaxFuel());
}

export function create(json: Required<ProtoSerialUnitJson>): SerialUnit {
    return SerialUnit.fromJson(json);
}

export function createDefault({ unitTypeId, unitId, playerIndex, gridIndex, gcData }: {
    unitTypeId  : number;
    unitId      : number;
    playerIndex : number;
    gridIndex   : Required<GridIndexJson>;
    gcData      : GameConfigs_GameConfig.GameConfig;
}): SerialUnit {
    const cfg = Helpers_Misc.getExisted(gcData.getUnitTemplateCfg(unitTypeId));
    return create({
        unitType    : unitTypeId,
        unitId      : unitId,
        playerIndex : playerIndex,
        gridIndex   : gridIndex,

        actionState  : null,
        currentHp    : cfg.getMaxHp(),
        aiMode       : null,
        groupedTagId : null,
        customNameId : null,

        currentPromotion     : null,
        isDiving             : cfg.getDiveCfg()?.getIsDivedByDefault() ?? null,
        isCoOnboard          : null,
        currentBuildMaterial : cfg.getMaxBuildMaterial() ?? null,

        aiWeightedDestination           : null,
        forbiddenGroupedLocationIdArray : [],
        buffArray                       : [],

        primaryWeaponCurrentAmmo : cfg.getPrimaryWeaponMaxAmmo() ?? null,
        flareCurrentAmmo         : cfg.getFlareMaxAmmo() ?? null,
        currentProduceMaterial   : cfg.getMaxProduceMaterial() ?? null,
        currentFuel              : cfg.getMaxFuel(),
        loaderUnitId             : null,
    });
}
