import {
    AuxiliaryTypes_GridIndex,
    MapEditor_Model_MeWar,
    AuxiliaryTypes_MovePath,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_UnitVisionInfo,
    Units_Constants,
    Utils_ClientErrorCode,
    Helpers_Misc,
    Lang_Utils,
    WarOperations_Executors_Utils_Common,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    type Units_IUnit,
} from "../../../internal.ts";

import type { WoUnitDropUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitDropUnit.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitDropUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitDropUnit(war, action);
    } else {
        await normalExeUnitDropUnit(war, action);
    }
}

function fastExeUnitDropUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitDropUnit): void {
    const fogMap            = war.getFogMap();
    const actionExtraData   = action.getExtraData();
    const unitMap           = war.getUnitMap();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitDropUnit_00),
            isFastExecute   : true,
        });

        {
            for (const data of actionExtraData.getDroppingUnitAndPathArray()) {
                const unitId = data.getUnit()?.getUnitId() ?? 0;
                if (unitMap.getUnitLoadedById(unitId) != null) {
                    unitMap.removeUnitLoaded(unitId).stopRunning();
                }
            }
        }

    } else {
        const path                              = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId                      = action.getLaunchUnitId();
        const pathNodes                         = path.nodes;
        const endingGridIndex                   = pathNodes[pathNodes.length - 1];
        const focusUnit                         = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        const shouldUpdateFogMap                = (war.getGcData().getSystemCfg().getIsPathVisionEnabled()) && (war.getPlayerManager().getWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex()));
        const canDroppedUnitGetVisionOnStart    = false;
        const visionInfoDictForDroppedUnits     = new Map<number, AuxiliaryTypes_UnitVisionInfo.UnitVisionInfo>();
        if ((shouldUpdateFogMap) && (canDroppedUnitGetVisionOnStart)) {
            for (const data of action.getDropDestinations()) {
                const unitId = data.getUnitId() ?? 0;
                visionInfoDictForDroppedUnits.set(unitId, Helpers_Misc.getExisted(unitMap.getUnitLoadedById(unitId)?.getVisionInfo()));
            }
        }
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        const unitsForDrop: Units_IUnit.IUnit[] = [];
        for (const data of action.getDropDestinations()) {
            const unitId        = data.getUnitId() ?? 0;
            const gridIndex     = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(data.getGridIndex()));
            const unitForDrop   = Helpers_Misc.getExisted(unitMap.getUnitLoadedById(unitId));
            if ((shouldUpdateFogMap) && (canDroppedUnitGetVisionOnStart)) {
                fogMap.updateMapFromPathsByUnitAndPath({
                    unit           : unitForDrop,
                    unitVisionInfo : Helpers_Misc.getExisted(visionInfoDictForDroppedUnits.get(unitId)),
                    path           : [endingGridIndex, gridIndex],
                });
            }

            unitMap.setUnitUnloaded(unitId, gridIndex);
            for (const unit of unitMap.getUnitsLoadedByLoader(unitForDrop, true)) {
                unit.setGridIndex(gridIndex);
            }

            unitForDrop.setLoaderUnitId(null);
            unitForDrop.setGridIndex(gridIndex);
            unitForDrop.setActionState(Units_Constants.ActionStateId.Acted);
            unitsForDrop.push(unitForDrop);
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitDropUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitDropUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitDropUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData   = action.getExtraData();
    const gridVisualEffect  = war.getGridVisualEffect();
    const unitMap           = war.getUnitMap();
    if (actionExtraData) {
        const commonExtraData   = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitDropUnit_00);
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        const extraUnit         = await war.moveExtraUnit({
            movingUnitAndPath,
            aiming                : null,
            deleteViewAfterMoving : false,
        });

        const movingPath    = movingUnitAndPath?.getPath();
        const lastNode      = movingPath ? movingPath[movingPath.length - 1] : null;
        const unitMapView   = unitMap.getView();
        if (lastNode) {
            if (lastNode.getIsVisible()) {
                if (actionExtraData.getIsDropBlocked()) {
                    gridVisualEffect.showEffectBlock(Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(lastNode.getGridIndex()), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitDropUnit_01));
                    Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Block);
                }
            } else {
                if (extraUnit) {
                    unitMapView.removeUnit(extraUnit.getView());
                    extraUnit.stopRunning();
                }
            }
        }

        const droppingUnitAndPathArray = actionExtraData.getDroppingUnitAndPathArray();
        await Promise.all((droppingUnitAndPathArray).map(v => war.moveExtraUnit({
            movingUnitAndPath     : v,
            aiming                : null,
            deleteViewAfterMoving : true,
        })));
        if (extraUnit) {
            unitMapView.removeUnit(extraUnit.getView());
            extraUnit.stopRunning();
        }

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute : false,
        });

        {
            const affectedLoaderUnits = new Set<Units_IUnit.IUnit | null>();
            for (const data of droppingUnitAndPathArray) {
                const unitId        = data.getUnit()?.getUnitId() ?? 0;
                const loadedUnit    = unitMap.getUnitLoadedById(unitId);
                if (loadedUnit != null) {
                    unitMap.removeUnitLoaded(unitId).stopRunning();
                    affectedLoaderUnits.add(unitMap.getUnitById(Helpers_Misc.getExisted(loadedUnit.getLoaderUnitId())));
                }
            }
            for (const unit of affectedLoaderUnits) {
                unit?.updateView();
            }
        }

    } else {
        const path                              = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId                      = action.getLaunchUnitId();
        const pathNodes                         = path.nodes;
        const endingGridIndex                   = pathNodes[pathNodes.length - 1];
        const focusUnit                         = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        const shouldUpdateFogMap                = (war.getGcData().getSystemCfg().getIsPathVisionEnabled()) && (war.getPlayerManager().getWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex()));
        const canDroppedUnitGetVisionOnStart    = false;
        const visionInfoDictForDroppedUnits     = new Map<number, AuxiliaryTypes_UnitVisionInfo.UnitVisionInfo>();
        if ((shouldUpdateFogMap) && (canDroppedUnitGetVisionOnStart)) {
            for (const data of action.getDropDestinations()) {
                const unitId = data.getUnitId() ?? 0;
                visionInfoDictForDroppedUnits.set(unitId, Helpers_Misc.getExisted(unitMap.getUnitLoadedById(unitId)?.getVisionInfo()));
            }
        }
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        const fogMap        = war.getFogMap();
        const unitsForDrop  : Units_IUnit.IUnit[] = [];
        for (const data of action.getDropDestinations()) {
            const unitId        = data.getUnitId() ?? 0;
            const gridIndex     = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(data.getGridIndex()));
            const unitForDrop   = Helpers_Misc.getExisted(unitMap.getUnitLoadedById(unitId));
            if ((shouldUpdateFogMap) && (canDroppedUnitGetVisionOnStart)) {
                fogMap.updateMapFromPathsByUnitAndPath({
                    unit           : unitForDrop,
                    unitVisionInfo : Helpers_Misc.getExisted(visionInfoDictForDroppedUnits.get(unitId)),
                    path           : [endingGridIndex, gridIndex],
                });
            }

            unitMap.setUnitUnloaded(unitId, gridIndex);
            for (const unit of unitMap.getUnitsLoadedByLoader(unitForDrop, true)) {
                unit.setGridIndex(gridIndex);
            }

            unitForDrop.setLoaderUnitId(null);
            unitForDrop.setGridIndex(gridIndex);
            unitForDrop.setActionState(Units_Constants.ActionStateId.Acted);
            unitsForDrop.push(unitForDrop);
        }

        await focusUnit.moveViewAlongPath({
            pathNodes           : pathNodes,
            isDiving            : focusUnit.getIsDiving(),
            isBlocked           : path.isBlocked,
            aiming              : null,
            updateViewAfterMove : true,
        });
        if (action.getIsDropBlocked()) {
            gridVisualEffect.showEffectBlock(endingGridIndex);
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Block);
        }

        const promises: Promise<void>[] = [];
        for (const unitForDrop of unitsForDrop) {
            promises.push((async () => {
                await unitForDrop.moveViewAlongPath({
                    pathNodes           : [endingGridIndex, unitForDrop.getGridIndex()],
                    isDiving            : unitForDrop.getIsDiving(),
                    isBlocked           : false,
                    aiming              : null,
                    updateViewAfterMove : true,
                });
            })());
        }
        await Promise.all(promises);

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitDropUnit): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0102)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
