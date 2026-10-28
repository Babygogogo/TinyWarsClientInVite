import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { runBattleForAttackUnit } from "../../../damageCalculators/Utils.ts";
import { getMeWarClass, getMpwWarClass, getRwWarBaseClass, getSpwWarClass, getTwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type { WoUnitAttackUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitAttackUnit.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import { ShortSfxCode } from "../../../sounds/Constants.ts";
import { playShortSfx } from "../../../sounds/SoundPlayer.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ActionStateId } from "../../../units/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { getAllUnitsOnMapVisibleToTeams } from "../../../visibilities/Utils.ts";
import { handleCommonExtraData, handlePostOperationPlunder, handleViewForBattle } from "./Common.ts";

let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

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
        handleCommonExtraData({
            war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExeUnitAttackUnit_00),
            isFastExecute   : true,
        });

    } else {
        const path          = MovePath.create(getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        if (path.isBlocked) {
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(ActionStateId.Acted);

        } else {
            const maxAttackRange1       = focusUnit.getFinalMaxAttackRange();
            const canAttackAfterMoving1 = focusUnit.getFinalCanAttackAfterMoving();
            const gridIndex2            = getExisted(GridIndex.convertGridIndex(action.getTargetGridIndex()));
            const unit2                 = getExisted(unitMap.getUnitOnMap(gridIndex2));
            const maxAttackRange2       = unit2.getFinalMaxAttackRange() ?? null;
            const canAttackAfterMoving2 = unit2.getFinalCanAttackAfterMoving();

            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);

            const battleInfo = runBattleForAttackUnit({
                war                     : war,
                movePath1               : pathNodes,
                launchUnitId1           : launchUnitId,
                maxAttackRange1         : maxAttackRange1,
                canAttackAfterMoving1   : canAttackAfterMoving1,
                gridIndex2              : gridIndex2,
                maxAttackRange2         : maxAttackRange2,
                canAttackAfterMoving2   : canAttackAfterMoving2,
            });
            focusUnit.setActionState(ActionStateId.Acted);

            const unitMapView = unitMap.getView();
            for (const [, unit] of battleInfo.destroyedUnits) {
                unitMapView.removeUnit(unit.getView());
            }
        }

        handlePostOperationPlunder(focusUnit, true);
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
        const commonExtraData   = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackUnit_00);
        const targetGridIndex   = GridIndex.convertGridIndex(actionExtraData.getTargetGridIndex());
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        const movingUnitData    = movingUnitAndPath?.getUnit();
        const movingPath        = movingUnitAndPath?.getPath();
        await war.moveExtraUnit({
            movingUnitAndPath,
            aiming                  : targetGridIndex,
            deleteViewAfterMoving   : true,
        });

        const destroyedUnitIdArray  = commonExtraData.getDestroyedUnitIdArray();
        const isWarViewVibrated     = handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute       : false,
        });

        const movingUnitId  = movingUnitData ? movingUnitData.getUnitId() : null;
        const lastNode      = movingPath ? movingPath[movingPath.length - 1] : null;
        if ((movingUnitId != null)                                      &&
            ((destroyedUnitIdArray).indexOf(movingUnitId) >= 0)    &&
            (lastNode?.getIsVisible())
        ) {
            gridVisualEffect.showEffectExplosion(getExisted(GridIndex.convertGridIndex(lastNode.getGridIndex()), ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackUnit_01));
            if (!isWarViewVibrated) {
                warView.showVibration();
                playShortSfx(ShortSfxCode.Explode);
            }
        }

    } else {
        const path          = MovePath.create(getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        if (path.isBlocked) {
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(ActionStateId.Acted);

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : true,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const maxAttackRange1       = focusUnit.getFinalMaxAttackRange();
            const gridIndex2            = getExisted(GridIndex.convertGridIndex(action.getTargetGridIndex()), ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackUnit_02);
            const canAttackAfterMoving1 = focusUnit.getFinalCanAttackAfterMoving();
            const unit2                 = getExisted(unitMap.getUnitOnMap(gridIndex2), ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackUnit_03);
            const maxAttackRange2       = unit2.getFinalMaxAttackRange();
            const canAttackAfterMoving2 = unit2.getFinalCanAttackAfterMoving();

            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);

            const allVisibleUnits = getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : false,
                aiming              : allVisibleUnits.has(unit2) ? gridIndex2 : null,
                updateViewAfterMove : false,
            });

            const battleInfo = runBattleForAttackUnit({
                war                     : war,
                movePath1               : pathNodes,
                launchUnitId1           : launchUnitId,
                maxAttackRange1         : maxAttackRange1,
                canAttackAfterMoving1   : canAttackAfterMoving1,
                gridIndex2              : gridIndex2,
                maxAttackRange2         : maxAttackRange2,
                canAttackAfterMoving2   : canAttackAfterMoving2,
            });
            focusUnit.setActionState(ActionStateId.Acted);

            handleViewForBattle(battleInfo, war, allVisibleUnits);
        }

        handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitAttackUnit): Promise<string | null> {
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
        return `${getText(TextType.B0097)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
