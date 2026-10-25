import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { GridIndexJson } from "../../proto/schema/CommonProto/Structure/GridIndex.ts";
import {
    type SerialUnitJson as ProtoSchemaCommonProtoWarSerializationSerialUnitSerialUnitJson,
    SerialUnit,
} from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { checkIsValid } from "../../unitBuffs/utils/Common.ts";
import { ActionStateId } from "../Constants.ts";
import type { IUnit } from "../IUnit.ts";
import { checkIsValidProduceMaterial, checkIsValidPrimaryAmmo, checkIsValidEncodedTagId } from "./Common.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { toGridIndexAndWeight } from "../../weightedGridIndexes/Utils.ts";

type SerialUnitJson     = ProtoSchemaCommonProtoWarSerializationSerialUnitSerialUnitJson;
export function createNewUnitDataForChangeType(unit: IUnit, newUnitTypeId: number): SerialUnit {
    const unitTemplateCfg       = getExisted(unit.getGcData().getUnitTemplateCfg(newUnitTypeId));
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
    unitData                : SerialUnit;
    gameConfig              : GcData;
    mapSize                 : Undefinable<MapSize>;
    playersCountUnneutral   : Undefinable<number>;
}): ClientErrorCode {
    const gridIndex = GridIndex.convertGridIndex(unitData.getGridIndex());
    if (gridIndex == null) {
        return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_00;
    }
    if ((mapSize) && (!gridIndex.checkIsInsideMap(mapSize))) {
        return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_01;
    }

    const unitType      = unitData.getUnitType();
    const playerIndex   = unitData.getPlayerIndex();
    if ((playerIndex < PlayerIndex.First) ||
        (playerIndex > PlayerIndex.Max)
    ) {
        return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_03;
    }
    if ((playersCountUnneutral != null) && (playerIndex > playersCountUnneutral)) {
        return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_04;
    }

    const cfg = gameConfig.getUnitTemplateCfg(unitType);
    if (cfg == null) {
        return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_05;
    }

    if (unitData.getCurrentBuildMaterial() > (cfg.getMaxBuildMaterial() ?? 0)) {
        return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_06;
    }

    if (unitData.getCurrentFuel() > cfg.getMaxFuel()) {
        return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_07;
    }

    if (unitData.getCurrentHp() > cfg.getMaxHp()) {
        return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_08;
    }

    if (!checkIsValidProduceMaterial(unitData.getCurrentProduceMaterial())) {
        return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_09;
    }

    if (unitData.getCurrentPromotion() > gameConfig.getUnitMaxPromotion()) {
        return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_10;
    }

    if (unitData.getFlareCurrentAmmo() > (cfg.getFlareMaxAmmo() ?? 0)) {
        return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_11;
    }

    if ((unitData.getIsDiving()) && (cfg.getDiveCfg() == null)) {
        return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_12;
    }

    if (!checkIsValidPrimaryAmmo(unitData.getPrimaryWeaponCurrentAmmo())) {
        return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_13;
    }

    // if (unitData.getDeprecatedIsCapturingTile()) {
    //     return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_14;
    // }

    const actionState = unitData.getActionState();
    if ((actionState != null)                           &&
        (actionState !== ActionStateId.Idle)    &&
        (actionState !== ActionStateId.Acted)
    ) {
        return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_15;
    }

    const loaderUnitId = unitData.getLoaderUnitId();
    if ((loaderUnitId != null) && (loaderUnitId === unitData.getUnitId())) {
        return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_16;
    }

    const groupedTagId = unitData.getGroupedTagId() ?? 0;
    if (!checkIsValidEncodedTagId(groupedTagId)) {
        return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_17;
    }

    {
        const aiWeightedDestination = unitData.getAiWeightedDestination();
        if (aiWeightedDestination != null) {
            const gridIndexAndWeight = toGridIndexAndWeight(aiWeightedDestination);
            if (gridIndexAndWeight == null) {
                return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_18;
            }
            if ((mapSize) && (!gridIndexAndWeight.gridIndex.checkIsInsideMap(mapSize))) {
                return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_19;
            }
        }
    }

    {
        const buffArray = unitData.getBuffArray();
        if (buffArray.some(v => !checkIsValid(v))) {
            return ClientErrorCode.WarCommonHelpers_GetErrorCodeForUnitDataIgnoringUnitId_20;
        }
    }

    return ClientErrorCode.NoError;
}

export function fillNonTrivialDefaultValues(unitData: SerialUnit, gcData: GcData): void {
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

export function create(json: Required<SerialUnitJson>): SerialUnit {
    return SerialUnit.fromJson(json);
}

export function createDefault({ unitTypeId, unitId, playerIndex, gridIndex, gcData }: {
    unitTypeId  : number;
    unitId      : number;
    playerIndex : number;
    gridIndex   : Required<GridIndexJson>;
    gcData      : GcData;
}): SerialUnit {
    const cfg = getExisted(gcData.getUnitTemplateCfg(unitTypeId));
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
