import type { IBwWar as BaseWarInterfaceIBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { show } from "../../../FloatText.ts";
import { getMeWarClass, getMpwWarClass, getRwWarBaseClass, getSpwWarClass, getTwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import type {
    WoSystemHandleBootPlayer as ProtoSchemaCommonProtoWarOperationWoSystemHandleBootPlayer,
} from "../../../proto/schema/CommonProto/WarOperation/WoSystemHandleBootPlayer.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { handleCommonExtraData } from "./Common.ts";

type WoSystemHandleBootPlayer   = ProtoSchemaCommonProtoWarOperationWoSystemHandleBootPlayer;
type IBwWar                     = BaseWarInterfaceIBwWar;

let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

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
        handleCommonExtraData({
            war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExeSystemHandleBootPlayer_00),
            isFastExecute   : true,
        });
    } else {
        war.getPlayerInTurn().setAliveState(AliveStateId.Dying);
    }
}

async function normalExeSystemHandleBootPlayer(war: IBwWar, action: WoSystemHandleBootPlayer): Promise<void> {
    const desc = await getDesc(war, action);
    (desc) && (show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExeSystemHandleBootPlayer_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute                       : false,
        });

    } else {
        war.getPlayerInTurn().setAliveState(AliveStateId.Dying);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoSystemHandleBootPlayer): Promise<string | null> {
    _meWarClass     ??= getMeWarClass();
    _mpwWarClass    ??= getMpwWarClass();
    _rwWarBaseClass ??= getRwWarBaseClass();
    _spwWarClass    ??= getSpwWarClass();
    _twWarClass     ??= getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return getFormattedText(TextType.F0028, await war.getPlayerInTurn().getNickname());
    } else if (war instanceof _rwWarBaseClass) {
        return getFormattedText(TextType.F0028, await war.getPlayerInTurn().getNickname());
    } else if (war instanceof _spwWarClass) {
        return getFormattedText(TextType.F0028, await war.getPlayerInTurn().getNickname());
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
