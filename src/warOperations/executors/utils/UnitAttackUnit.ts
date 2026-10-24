import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMovePath from "../../../auxiliaryTypes/MovePath.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as DamageCalculatorsUtils from "../../../damageCalculators/Utils.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitAttackUnit from "../../../proto/schema/CommonProto/WarOperation/WoUnitAttackUnit.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import * as SoundsConstants from "../../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../../sounds/SoundPlayer.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoUnitAttackUnit   = ProtoSchemaCommonProtoWarOperationWoUnitAttackUnit.WoUnitAttackUnit;
type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitAttackUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitAttackUnit(war, action);
    } else {
        await normalExeUnitAttackUnit(war, action);
    }
}

function fastExeUnitAttackUnit(war: IBwWar, action: WoUnitAttackUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitAttackUnit_00),
            isFastExecute   : true,
        });

    } else {
        const path          = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        if (path.isBlocked) {
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

        } else {
            const maxAttackRange1       = focusUnit.getFinalMaxAttackRange();
            const canAttackAfterMoving1 = focusUnit.getFinalCanAttackAfterMoving();
            const gridIndex2            = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()));
            const unit2                 = HelpersMisc.getExisted(unitMap.getUnitOnMap(gridIndex2));
            const maxAttackRange2       = unit2.getFinalMaxAttackRange() ?? null;
            const canAttackAfterMoving2 = unit2.getFinalCanAttackAfterMoving();

            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);

            const battleInfo = DamageCalculatorsUtils.runBattleForAttackUnit({
                war                     : war,
                movePath1               : pathNodes,
                launchUnitId1           : launchUnitId,
                maxAttackRange1         : maxAttackRange1,
                canAttackAfterMoving1   : canAttackAfterMoving1,
                gridIndex2              : gridIndex2,
                maxAttackRange2         : maxAttackRange2,
                canAttackAfterMoving2   : canAttackAfterMoving2,
            });
            focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

            const unitMapView = unitMap.getView();
            for (const [, unit] of battleInfo.destroyedUnits) {
                unitMapView.removeUnit(unit.getView());
            }
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitAttackUnit(war: IBwWar, action: WoUnitAttackUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitAttackUnit(action);
    // (desc) && (FloatText.show(desc));

    const warView           = war.getView();
    const gridVisualEffect  = war.getGridVisualEffect();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackUnit_00);
        const targetGridIndex   = AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(actionExtraData.getTargetGridIndex());
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        const movingUnitData    = movingUnitAndPath?.getUnit();
        const movingPath        = movingUnitAndPath?.getPath();
        await war.moveExtraUnit({
            movingUnitAndPath,
            aiming                  : targetGridIndex,
            deleteViewAfterMoving   : true,
        });

        const destroyedUnitIdArray  = commonExtraData.getDestroyedUnitIdArray();
        const isWarViewVibrated     = WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute       : false,
        });

        const movingUnitId  = movingUnitData ? movingUnitData.getUnitId() ?? 0 : null;
        const lastNode      = movingPath ? movingPath[movingPath.length - 1] : null;
        if ((movingUnitId != null)                                      &&
            ((destroyedUnitIdArray?? []).indexOf(movingUnitId) >= 0)    &&
            (lastNode?.getIsVisible())
        ) {
            gridVisualEffect.showEffectExplosion(HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(lastNode.getGridIndex()), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackUnit_01));
            if (!isWarViewVibrated) {
                warView.showVibration();
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.Explode);
            }
        }

    } else {
        const path          = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        if (path.isBlocked) {
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : true,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const maxAttackRange1       = focusUnit.getFinalMaxAttackRange();
            const gridIndex2            = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackUnit_02);
            const canAttackAfterMoving1 = focusUnit.getFinalCanAttackAfterMoving();
            const unit2                 = HelpersMisc.getExisted(unitMap.getUnitOnMap(gridIndex2), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackUnit_03);
            const maxAttackRange2       = unit2.getFinalMaxAttackRange();
            const canAttackAfterMoving2 = unit2.getFinalCanAttackAfterMoving();

            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);

            const allVisibleUnits = VisibilitiesUtils.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : false,
                aiming              : allVisibleUnits.has(unit2) ? gridIndex2 : null,
                updateViewAfterMove : false,
            });

            const battleInfo = DamageCalculatorsUtils.runBattleForAttackUnit({
                war                     : war,
                movePath1               : pathNodes,
                launchUnitId1           : launchUnitId,
                maxAttackRange1         : maxAttackRange1,
                canAttackAfterMoving1   : canAttackAfterMoving1,
                gridIndex2              : gridIndex2,
                maxAttackRange2         : maxAttackRange2,
                canAttackAfterMoving2   : canAttackAfterMoving2,
            });
            focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

            WarOperationsExecutorsUtilsCommon.handleViewForBattle(battleInfo, war, allVisibleUnits);
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitAttackUnit): Promise<string | null> {
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
        return `${LangUtils.getText(LangConstants.TextType.B0097)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
