import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { runBattleForAttackTile } from "../../../damageCalculators/Utils.ts";
import {
    getMeWarClass,
    getMpwWarClass,
    getRwWarBaseClass,
    getSpwWarClass,
    getTwWarClass,
} from "../../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type { WoUnitAttackTile } from "../../../proto/schema/CommonProto/WarOperation/WoUnitAttackTile.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ActionStateId } from "../../../units/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { getAllUnitsOnMapVisibleToTeams } from "../../../visibilities/Utils.ts";
import {
    handleCommonExtraData,
    handlePostOperationPlunder,
    handleViewForBattle,
} from "./Common.ts";

let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitAttackTile, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitAttackTile(war, action);
    } else {
        await normalExeUnitAttackTile(war, action);
    }
}

function fastExeUnitAttackTile(war: IBwWar, action: WoUnitAttackTile): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        handleCommonExtraData({
            war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExeUnitAttackTile_00),
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

            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);

            const battleInfo = runBattleForAttackTile({
                war                     : war,
                movePath1               : pathNodes,
                launchUnitId1           : launchUnitId,
                maxAttackRange1         : maxAttackRange1,
                canAttackAfterMoving1   : canAttackAfterMoving1,
                gridIndex2              : getExisted(GridIndex.convertGridIndex(action.getTargetGridIndex())),
                maxAttackRange2         : null,
                canAttackAfterMoving2   : false,
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
async function normalExeUnitAttackTile(war: IBwWar, action: WoUnitAttackTile): Promise<void> {
    // const desc = await war.getDescForExeUnitAttackTile(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackTile_00);
        const targetGridIndex = GridIndex.convertGridIndex(actionExtraData.getTargetGridIndex());
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : targetGridIndex,
            deleteViewAfterMoving   : true,
        });

        handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute                       : false,
        });

    } else {
        const path              = MovePath.create(getExisted(action.getPath()));
        const launchUnitId      = action.getLaunchUnitId();
        const pathNodes         = path.nodes;
        const unitMap           = war.getUnitMap();
        const focusUnit         = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
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
            const canAttackAfterMoving1 = focusUnit.getFinalCanAttackAfterMoving();

            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);

            const gridIndex2        = getExisted(GridIndex.convertGridIndex(action.getTargetGridIndex()), ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackTile_01);
            const allVisibleUnits   = getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : false,
                aiming              : gridIndex2,
                updateViewAfterMove : false,
            });

            const battleInfo = runBattleForAttackTile({
                war                     : war,
                movePath1               : pathNodes,
                launchUnitId1           : launchUnitId,
                maxAttackRange1         : maxAttackRange1,
                canAttackAfterMoving1   : canAttackAfterMoving1,
                gridIndex2              : gridIndex2,
                maxAttackRange2         : null,
                canAttackAfterMoving2   : false,
            });
            focusUnit.setActionState(ActionStateId.Acted);

            handleViewForBattle(battleInfo, war, allVisibleUnits);
        }

        handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitAttackTile): Promise<string | null> {
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
