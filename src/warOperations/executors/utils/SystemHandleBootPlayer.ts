import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as FloatText2 from "../../../FloatText.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemHandleBootPlayer from "../../../proto/schema/CommonProto/WarOperation/WoSystemHandleBootPlayer.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoSystemHandleBootPlayer   = ProtoSchemaCommonProtoWarOperationWoSystemHandleBootPlayer.WoSystemHandleBootPlayer;
type IBwWar                     = BaseWarInterfaceIBwWar.IBwWar;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoSystemHandleBootPlayer, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemHandleBootPlayer(war, action);
    } else {
        await normalExeSystemHandleBootPlayer(war, action);
    }
}

function fastExeSystemHandleBootPlayer(war: IBwWar, action: WoSystemHandleBootPlayer): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeSystemHandleBootPlayer_00),
            isFastExecute   : true,
        });
    } else {
        war.getPlayerInTurn().setAliveState(PlayersConstants.AliveStateId.Dying);
    }
}

async function normalExeSystemHandleBootPlayer(war: IBwWar, action: WoSystemHandleBootPlayer): Promise<void> {
    const desc = await getDesc(war, action);
    (desc) && (FloatText2.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeSystemHandleBootPlayer_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute                       : false,
        });

    } else {
        war.getPlayerInTurn().setAliveState(PlayersConstants.AliveStateId.Dying);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoSystemHandleBootPlayer): Promise<string | null> {
    _meWarClass     ??= GameHelpersGhFactory.getMeWarClass();
    _mpwWarClass    ??= GameHelpersGhFactory.getMpwWarClass();
    _rwWarBaseClass ??= GameHelpersGhFactory.getRwWarBaseClass();
    _spwWarClass    ??= GameHelpersGhFactory.getSpwWarClass();
    _twWarClass     ??= GameHelpersGhFactory.getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0028, await war.getPlayerInTurn().getNickname());
    } else if (war instanceof _rwWarBaseClass) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0028, await war.getPlayerInTurn().getNickname());
    } else if (war instanceof _spwWarClass) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0028, await war.getPlayerInTurn().getNickname());
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
