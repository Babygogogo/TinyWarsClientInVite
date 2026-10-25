import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getMeWarClass, getMpwWarClass, getRwWarBaseClass, getSpwWarClass, getTwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type { WoUnitDive } from "../../../proto/schema/CommonProto/WarOperation/WoUnitDive.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ActionStateId } from "../../../units/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { checkIsUnitOnMapVisibleToTeams } from "../../../visibilities/Utils.ts";
import { handleCommonExtraData, handlePostOperationPlunder } from "./Common.ts";

let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitDive, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitDive(war, action);
    } else {
        await normalExeUnitDive(war, action);
    }
}

function fastExeUnitDive(war: IBwWar, action: WoUnitDive): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        handleCommonExtraData({
            war             : war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExeUnitDive_00),
            isFastExecute   : true,
        });
    } else {
        const path          = MovePath.create(getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        const isSuccessful  = !path.isBlocked;
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);
        (isSuccessful) && (focusUnit.setIsDiving(true));

        handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitDive(war: IBwWar, action: WoUnitDive): Promise<void> {
    // const desc = await war.getDescForExeUnitDive(action);
    // (desc) && (FloatText.show(desc));

    const gridVisualEffect  = war.getGridVisualEffect();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExeUnitDive_00);
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        await war.moveExtraUnit({
            movingUnitAndPath,
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        const movingPath    = movingUnitAndPath?.getPath();
        const lastNode      = movingPath ? movingPath[movingPath?.length - 1] : null;
        if ((lastNode?.getIsVisible()) && (!lastNode.getIsBlocked())) {
            gridVisualEffect.showEffectDive(getExisted(GridIndex.convertGridIndex(lastNode.getGridIndex()), ClientErrorCode.WarOperationExecutor_NormalExeUnitDive_01));
        }

        handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute       : false,
        });

    } else {
        const path          = MovePath.create(getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        const isSuccessful  = !path.isBlocked;
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);
        (isSuccessful) && (focusUnit.setIsDiving(true));

        await focusUnit.moveViewAlongPath({
            pathNodes           : pathNodes,
            isDiving            : false,
            isBlocked           : path.isBlocked,
            aiming              : null,
            updateViewAfterMove : true,
        });
        if (isSuccessful) {
            const endingGridIndex = pathNodes[pathNodes.length - 1];
            if (checkIsUnitOnMapVisibleToTeams({
                war                 : war,
                unitType            : focusUnit.getUnitType(),
                unitPlayerIndex     : focusUnit.getPlayerIndex(),
                gridIndex           : endingGridIndex,
                observerTeamIndexes : war.getPlayerManager().getWatcherTeamIndexesForSelf(),
                isDiving            : false,
                isInvisible         : focusUnit.checkIsInvisible(endingGridIndex),
            })) {
                gridVisualEffect.showEffectDive(endingGridIndex);
            }
        }

        handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitDive): Promise<string | null> {
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
        return `${getText(TextType.B0101)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
