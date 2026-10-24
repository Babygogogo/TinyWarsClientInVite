import * as AuxiliaryTypesMovePath from "../../../auxiliaryTypes/MovePath.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitBoardedByCo from "../../../proto/schema/CommonProto/WarOperation/WoUnitBoardedByCo.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoUnitBoardedByCo  = ProtoSchemaCommonProtoWarOperationWoUnitBoardedByCo.WoUnitBoardedByCo;
type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

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
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitBoardedByCo_00),
            isFastExecute   : true,
        });
    } else {
        const path          = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);

        if (path.isBlocked) {
            focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);
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

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitBoardedByCo(war: IBwWar, action: WoUnitBoardedByCo): Promise<void> {
    // const desc = await war.getDescForExeUnitLoadCo(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitBoardedByCo_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute   : false,
        });

    } else {
        const path          = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);

        if (path.isBlocked) {
            focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);
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

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitBoardedByCo): Promise<string | null> {
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
        return `${LangUtils.getText(LangConstants.TextType.B0139)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
