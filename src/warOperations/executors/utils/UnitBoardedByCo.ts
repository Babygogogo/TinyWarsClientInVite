import { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getMeWarClass, getMpwWarClass, getRwWarBaseClass, getSpwWarClass, getTwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type { WoUnitBoardedByCo } from "../../../proto/schema/CommonProto/WarOperation/WoUnitBoardedByCo.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ActionStateId } from "../../../units/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { handleCommonExtraData, handlePostOperationPlunder } from "./Common.ts";

let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitBoardedByCo, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitBoardedByCo(war, action);
    } else {
        await normalExeUnitBoardedByCo(war, action);
    }
}

function fastExeUnitBoardedByCo(war: IBwWar, action: WoUnitBoardedByCo): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        handleCommonExtraData({
            war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExeUnitBoardedByCo_00),
            isFastExecute   : true,
        });
    } else {
        const path          = MovePath.create(getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);

        if (path.isBlocked) {
            focusUnit.setActionState(ActionStateId.Acted);
        } else {
            const playerIndex           = focusUnit.getPlayerIndex();
            const energyAddPctOnCoBoard = war.getCommonSettingManager().getPlayerRule(playerIndex).getEnergyAddPctOnCoBoard();
            focusUnit.setCurrentPromotion(focusUnit.getMaxPromotion());
            focusUnit.setIsCoOnboard(true);

            const player        = war.getPlayer(playerIndex);
            const coMaxEnergy   = player.getCoMaxEnergy();
            player.setFund(player.getFund() - focusUnit.getCoBoardCost());
            player.addAndValidateCoCurrentEnergy(coMaxEnergy * energyAddPctOnCoBoard / 100);
        }

        handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitBoardedByCo(war: IBwWar, action: WoUnitBoardedByCo): Promise<void> {
    // const desc = await war.getDescForExeUnitLoadCo(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExeUnitBoardedByCo_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute   : false,
        });

    } else {
        const path          = MovePath.create(getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);

        if (path.isBlocked) {
            focusUnit.setActionState(ActionStateId.Acted);
        } else {
            const playerIndex           = focusUnit.getPlayerIndex();
            const energyAddPctOnCoBoard = war.getCommonSettingManager().getPlayerRule(playerIndex).getEnergyAddPctOnCoBoard();
            focusUnit.setCurrentPromotion(focusUnit.getMaxPromotion());
            focusUnit.setIsCoOnboard(true);

            const player        = war.getPlayer(playerIndex);
            const coMaxEnergy   = player.getCoMaxEnergy();
            player.setFund(player.getFund() - focusUnit.getCoBoardCost());
            player.addAndValidateCoCurrentEnergy(coMaxEnergy * energyAddPctOnCoBoard / 100);
        }

        await focusUnit.moveViewAlongPath({
            pathNodes           : pathNodes,
            isDiving            : focusUnit.getIsDiving(),
            isBlocked           : path.isBlocked,
            aiming              : null,
            updateViewAfterMove : true,
        });

        handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitBoardedByCo): Promise<string | null> {
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
        return `${getText(TextType.B0139)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
