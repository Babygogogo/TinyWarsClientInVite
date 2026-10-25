import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { UnitVisionInfo } from "../../../auxiliaryTypes/UnitVisionInfo.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getMeWarClass, getMpwWarClass, getRwWarBaseClass, getSpwWarClass, getTwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type { WoUnitDropUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitDropUnit.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import { ShortSfxCode } from "../../../sounds/Constants.ts";
import { playShortSfx } from "../../../sounds/SoundPlayer.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ActionStateId } from "../../../units/Constants.ts";
import type { IUnit } from "../../../units/IUnit.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { handleCommonExtraData, handlePostOperationPlunder } from "./Common.ts";

type IBwUnit            = IUnit;
let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitDropUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitDropUnit(war, action);
    } else {
        await normalExeUnitDropUnit(war, action);
    }
}

function fastExeUnitDropUnit(war: IBwWar, action: WoUnitDropUnit): void {
    const fogMap            = war.getFogMap();
    const actionExtraData   = action.getExtraData();
    const unitMap           = war.getUnitMap();
    if (actionExtraData) {
        handleCommonExtraData({
            war             : war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExeUnitDropUnit_00),
            isFastExecute   : true,
        });

        {
            for (const data of actionExtraData.getDroppingUnitAndPathArray() ?? []) {
                const unitId = data.getUnit()?.getUnitId() ?? 0;
                if (unitMap.getUnitLoadedById(unitId) != null) {
                    unitMap.removeUnitLoaded(unitId).stopRunning();
                }
            }
        }

    } else {
        const path                              = MovePath.create(getExisted(action.getPath()));
        const launchUnitId                      = action.getLaunchUnitId();
        const pathNodes                         = path.nodes;
        const endingGridIndex                   = pathNodes[pathNodes.length - 1];
        const focusUnit                         = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        const shouldUpdateFogMap                = (war.getGcData().getSystemCfg().getIsPathVisionEnabled()) && (war.getPlayerManager().getWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex()));
        const canDroppedUnitGetVisionOnStart    = false;
        const visionInfoDictForDroppedUnits     = new Map<number, UnitVisionInfo>();
        if ((shouldUpdateFogMap) && (canDroppedUnitGetVisionOnStart)) {
            for (const data of action.getDropDestinations()) {
                const unitId = data.getUnitId() ?? 0;
                visionInfoDictForDroppedUnits.set(unitId, getExisted(unitMap.getUnitLoadedById(unitId)?.getVisionInfo()));
            }
        }
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);

        const unitsForDrop: IBwUnit[] = [];
        for (const data of action.getDropDestinations()) {
            const unitId        = data.getUnitId() ?? 0;
            const gridIndex     = getExisted(GridIndex.convertGridIndex(data.getGridIndex()));
            const unitForDrop   = getExisted(unitMap.getUnitLoadedById(unitId));
            if ((shouldUpdateFogMap) && (canDroppedUnitGetVisionOnStart)) {
                fogMap.updateMapFromPathsByUnitAndPath({
                    unit            : unitForDrop,
                    unitVisionInfo  : getExisted(visionInfoDictForDroppedUnits.get(unitId)),
                    path            : [endingGridIndex, gridIndex],
                });
            }

            unitMap.setUnitUnloaded(unitId, gridIndex);
            for (const unit of unitMap.getUnitsLoadedByLoader(unitForDrop, true)) {
                unit.setGridIndex(gridIndex);
            }

            unitForDrop.setLoaderUnitId(null);
            unitForDrop.setGridIndex(gridIndex);
            unitForDrop.setActionState(ActionStateId.Acted);
            unitsForDrop.push(unitForDrop);
        }

        handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitDropUnit(war: IBwWar, action: WoUnitDropUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitDropUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData   = action.getExtraData();
    const gridVisualEffect  = war.getGridVisualEffect();
    const unitMap           = war.getUnitMap();
    if (actionExtraData) {
        const commonExtraData   = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExeUnitDropUnit_00);
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        const extraUnit         = await war.moveExtraUnit({
            movingUnitAndPath,
            aiming                  : null,
            deleteViewAfterMoving   : false,
        });

        const movingPath    = movingUnitAndPath?.getPath();
        const lastNode      = movingPath ? movingPath[movingPath.length - 1] : null;
        const unitMapView   = unitMap.getView();
        if (lastNode) {
            if (lastNode.getIsVisible()) {
                if (actionExtraData.getIsDropBlocked()) {
                    gridVisualEffect.showEffectBlock(getExisted(GridIndex.convertGridIndex(lastNode.getGridIndex()), ClientErrorCode.WarOperationExecutor_NormalExeUnitDropUnit_01));
                    playShortSfx(ShortSfxCode.Block);
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
            movingUnitAndPath       : v,
            aiming                  : null,
            deleteViewAfterMoving   : true,
        })));
        if (extraUnit) {
            unitMapView.removeUnit(extraUnit.getView());
            extraUnit.stopRunning();
        }

        handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute       : false,
        });

        {
            const affectedLoaderUnits = new Set<IBwUnit | null>();
            for (const data of droppingUnitAndPathArray) {
                const unitId        = data.getUnit()?.getUnitId() ?? 0;
                const loadedUnit    = unitMap.getUnitLoadedById(unitId);
                if (loadedUnit != null) {
                    unitMap.removeUnitLoaded(unitId).stopRunning();
                    affectedLoaderUnits.add(unitMap.getUnitById(getExisted(loadedUnit.getLoaderUnitId())));
                }
            }
            for (const unit of affectedLoaderUnits) {
                unit?.updateView();
            }
        }

    } else {
        const path                              = MovePath.create(getExisted(action.getPath()));
        const launchUnitId                      = action.getLaunchUnitId();
        const pathNodes                         = path.nodes;
        const endingGridIndex                   = pathNodes[pathNodes.length - 1];
        const focusUnit                         = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        const shouldUpdateFogMap                = (war.getGcData().getSystemCfg().getIsPathVisionEnabled()) && (war.getPlayerManager().getWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex()));
        const canDroppedUnitGetVisionOnStart    = false;
        const visionInfoDictForDroppedUnits     = new Map<number, UnitVisionInfo>();
        if ((shouldUpdateFogMap) && (canDroppedUnitGetVisionOnStart)) {
            for (const data of action.getDropDestinations()) {
                const unitId = data.getUnitId() ?? 0;
                visionInfoDictForDroppedUnits.set(unitId, getExisted(unitMap.getUnitLoadedById(unitId)?.getVisionInfo()));
            }
        }
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);

        const fogMap        = war.getFogMap();
        const unitsForDrop  : IBwUnit[] = [];
        for (const data of action.getDropDestinations()) {
            const unitId        = data.getUnitId() ?? 0;
            const gridIndex     = getExisted(GridIndex.convertGridIndex(data.getGridIndex()));
            const unitForDrop   = getExisted(unitMap.getUnitLoadedById(unitId));
            if ((shouldUpdateFogMap) && (canDroppedUnitGetVisionOnStart)) {
                fogMap.updateMapFromPathsByUnitAndPath({
                    unit            : unitForDrop,
                    unitVisionInfo  : getExisted(visionInfoDictForDroppedUnits.get(unitId)),
                    path            : [endingGridIndex, gridIndex]
                });
            }

            unitMap.setUnitUnloaded(unitId, gridIndex);
            for (const unit of unitMap.getUnitsLoadedByLoader(unitForDrop, true)) {
                unit.setGridIndex(gridIndex);
            }

            unitForDrop.setLoaderUnitId(null);
            unitForDrop.setGridIndex(gridIndex);
            unitForDrop.setActionState(ActionStateId.Acted);
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
            playShortSfx(ShortSfxCode.Block);
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

        handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitDropUnit): Promise<string | null> {
    _meWarClass     ??= getMeWarClass();
    _mpwWarClass    ??= getMpwWarClass();
    _rwWarBaseClass ??= getRwWarBaseClass();
    _spwWarClass    ??= getSpwWarClass();
    _twWarClass     ??= getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return null;
    } else if (war instanceof _rwWarBaseClass) {
        return `${getText(TextType.B0102)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
