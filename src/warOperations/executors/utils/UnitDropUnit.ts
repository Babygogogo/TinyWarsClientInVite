import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMovePath from "../../../auxiliaryTypes/MovePath.ts";
import type * as AuxiliaryTypesUnitVisionInfo from "../../../auxiliaryTypes/UnitVisionInfo.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitDropUnit from "../../../proto/schema/CommonProto/WarOperation/WoUnitDropUnit.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import * as SoundsConstants from "../../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../../sounds/SoundPlayer.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoUnitDropUnit     = ProtoSchemaCommonProtoWarOperationWoUnitDropUnit.WoUnitDropUnit;
type IBwUnit            = UnitsIUnit.IUnit;
type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

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
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war             : war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitDropUnit_00),
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
        const path                              = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const launchUnitId                      = action.getLaunchUnitId();
        const pathNodes                         = path.nodes;
        const endingGridIndex                   = pathNodes[pathNodes.length - 1];
        const focusUnit                         = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        const shouldUpdateFogMap                = (war.getGcData().getSystemCfg().getIsPathVisionEnabled()) && (war.getPlayerManager().getWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex()));
        const canDroppedUnitGetVisionOnStart    = false;
        const visionInfoDictForDroppedUnits     = new Map<number, AuxiliaryTypesUnitVisionInfo.UnitVisionInfo>();
        if ((shouldUpdateFogMap) && (canDroppedUnitGetVisionOnStart)) {
            for (const data of action.getDropDestinations()) {
                const unitId = data.getUnitId() ?? 0;
                visionInfoDictForDroppedUnits.set(unitId, HelpersMisc.getExisted(unitMap.getUnitLoadedById(unitId)?.getVisionInfo()));
            }
        }
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

        const unitsForDrop: IBwUnit[] = [];
        for (const data of action.getDropDestinations()) {
            const unitId        = data.getUnitId() ?? 0;
            const gridIndex     = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(data.getGridIndex()));
            const unitForDrop   = HelpersMisc.getExisted(unitMap.getUnitLoadedById(unitId));
            if ((shouldUpdateFogMap) && (canDroppedUnitGetVisionOnStart)) {
                fogMap.updateMapFromPathsByUnitAndPath({
                    unit            : unitForDrop,
                    unitVisionInfo  : HelpersMisc.getExisted(visionInfoDictForDroppedUnits.get(unitId)),
                    path            : [endingGridIndex, gridIndex],
                });
            }

            unitMap.setUnitUnloaded(unitId, gridIndex);
            for (const unit of unitMap.getUnitsLoadedByLoader(unitForDrop, true)) {
                unit.setGridIndex(gridIndex);
            }

            unitForDrop.setLoaderUnitId(null);
            unitForDrop.setGridIndex(gridIndex);
            unitForDrop.setActionState(UnitsConstants.ActionStateId.Acted);
            unitsForDrop.push(unitForDrop);
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, true);
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
        const commonExtraData   = HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitDropUnit_00);
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
                    gridVisualEffect.showEffectBlock(HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(lastNode.getGridIndex()), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitDropUnit_01));
                    SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.Block);
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

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
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
                    affectedLoaderUnits.add(unitMap.getUnitById(HelpersMisc.getExisted(loadedUnit.getLoaderUnitId())));
                }
            }
            for (const unit of affectedLoaderUnits) {
                unit?.updateView();
            }
        }

    } else {
        const path                              = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const launchUnitId                      = action.getLaunchUnitId();
        const pathNodes                         = path.nodes;
        const endingGridIndex                   = pathNodes[pathNodes.length - 1];
        const focusUnit                         = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        const shouldUpdateFogMap                = (war.getGcData().getSystemCfg().getIsPathVisionEnabled()) && (war.getPlayerManager().getWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex()));
        const canDroppedUnitGetVisionOnStart    = false;
        const visionInfoDictForDroppedUnits     = new Map<number, AuxiliaryTypesUnitVisionInfo.UnitVisionInfo>();
        if ((shouldUpdateFogMap) && (canDroppedUnitGetVisionOnStart)) {
            for (const data of action.getDropDestinations()) {
                const unitId = data.getUnitId() ?? 0;
                visionInfoDictForDroppedUnits.set(unitId, HelpersMisc.getExisted(unitMap.getUnitLoadedById(unitId)?.getVisionInfo()));
            }
        }
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

        const fogMap        = war.getFogMap();
        const unitsForDrop  : IBwUnit[] = [];
        for (const data of action.getDropDestinations()) {
            const unitId        = data.getUnitId() ?? 0;
            const gridIndex     = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(data.getGridIndex()));
            const unitForDrop   = HelpersMisc.getExisted(unitMap.getUnitLoadedById(unitId));
            if ((shouldUpdateFogMap) && (canDroppedUnitGetVisionOnStart)) {
                fogMap.updateMapFromPathsByUnitAndPath({
                    unit            : unitForDrop,
                    unitVisionInfo  : HelpersMisc.getExisted(visionInfoDictForDroppedUnits.get(unitId)),
                    path            : [endingGridIndex, gridIndex]
                });
            }

            unitMap.setUnitUnloaded(unitId, gridIndex);
            for (const unit of unitMap.getUnitsLoadedByLoader(unitForDrop, true)) {
                unit.setGridIndex(gridIndex);
            }

            unitForDrop.setLoaderUnitId(null);
            unitForDrop.setGridIndex(gridIndex);
            unitForDrop.setActionState(UnitsConstants.ActionStateId.Acted);
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
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.Block);
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

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitDropUnit): Promise<string | null> {
    _meWarClass     ??= GameHelpersGhFactory.getMeWarClass();
    _mpwWarClass    ??= GameHelpersGhFactory.getMpwWarClass();
    _rwWarBaseClass ??= GameHelpersGhFactory.getRwWarBaseClass();
    _spwWarClass    ??= GameHelpersGhFactory.getSpwWarClass();
    _twWarClass     ??= GameHelpersGhFactory.getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return null;
    } else if (war instanceof _rwWarBaseClass) {
        return `${LangUtils.getText(LangConstants.TextType.B0102)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
