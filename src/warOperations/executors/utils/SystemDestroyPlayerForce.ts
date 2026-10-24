import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as DestructionsUtils from "../../../destructions/Utils.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import type * as HalfwayReplayWarInterfaceIHrwWar from "../../../halfwayReplayWar/interface/IHrwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemDestroyPlayerForce from "../../../proto/schema/CommonProto/WarOperation/WoSystemDestroyPlayerForce.ts";
import type * as ReplayWarInterfaceIRwWar from "../../../replayWar/interface/IRwWar.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoSystemDestroyPlayerForce = ProtoSchemaCommonProtoWarOperationWoSystemDestroyPlayerForce.WoSystemDestroyPlayerForce;
type IBwWar                     = BaseWarInterfaceIBwWar.IBwWar;

let _hrwWarClass    : new () => HalfwayReplayWarInterfaceIHrwWar.IHrwWar;
let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarClass     : new () => ReplayWarInterfaceIRwWar.IRwWar;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoSystemDestroyPlayerForce, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemDestroyPlayerForce(war, action);
    } else {
        await normalExeSystemDestroyPlayerForce(war, action);
    }
}

function fastExeSystemDestroyPlayerForce(war: IBwWar, action: WoSystemDestroyPlayerForce): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war             : war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeSystemDestroyPlayerForce_00),
            isFastExecute   : true,
        });
        war.getDrawVoteManager().handlePlayerForceDestruction();
    } else {
        DestructionsUtils.destroyPlayerForce(war, HelpersMisc.getExisted(action.getTargetPlayerIndex()), false);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeSystemDestroyPlayerForce(war: IBwWar, action: WoSystemDestroyPlayerForce): Promise<void> {
    // const desc = await war.getDescForExeSystemDestroyPlayerForce(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeSystemDestroyPlayerForce_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
        });
        war.getDrawVoteManager().handlePlayerForceDestruction();

    } else {
        DestructionsUtils.destroyPlayerForce(war, HelpersMisc.getExisted(action.getTargetPlayerIndex()), true);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoSystemDestroyPlayerForce): Promise<string | null> {
    _hrwWarClass    ??= GameHelpersGhFactory.getHrwWarClass();
    _meWarClass     ??= GameHelpersGhFactory.getMeWarClass();
    _mpwWarClass    ??= GameHelpersGhFactory.getMpwWarClass();
    _rwWarClass     ??= GameHelpersGhFactory.getRwWarClass();
    _spwWarClass    ??= GameHelpersGhFactory.getSpwWarClass();
    _twWarClass     ??= GameHelpersGhFactory.getTwWarClass();

    if (war instanceof _hrwWarClass) {
        const playerIndex = HelpersMisc.getExisted(action.getExtraData()?.getTargetPlayerIndex());
        return `P${playerIndex} ${await war.getPlayer(playerIndex).getNickname()} ${LangUtils.getText(LangConstants.TextType.B0450)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        const playerIndex = HelpersMisc.getExisted(action.getExtraData()?.getTargetPlayerIndex());
        return `p${playerIndex} ${await war.getPlayer(playerIndex).getNickname()} ${LangUtils.getText(LangConstants.TextType.B0450)}`;
    } else if (war instanceof _rwWarClass) {
        const playerIndex = HelpersMisc.getExisted(action.getTargetPlayerIndex());
        return `P${playerIndex} ${await war.getPlayer(playerIndex).getNickname()} ${LangUtils.getText(LangConstants.TextType.B0450)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        const playerIndex = HelpersMisc.getExisted(action.getTargetPlayerIndex());
        return `p${playerIndex} ${await war.getPlayer(playerIndex).getNickname()} ${LangUtils.getText(LangConstants.TextType.B0450)}`;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
