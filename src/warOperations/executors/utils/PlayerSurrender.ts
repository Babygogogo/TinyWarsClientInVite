import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { show } from "../../../FloatText.ts";
import { getMeWarClass, getMpwWarClass, getRwWarBaseClass, getSpwWarClass, getTwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getFormattedText, getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import type { WoPlayerSurrender } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerSurrender.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { handleCommonExtraData } from "./Common.ts";

let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoPlayerSurrender, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExePlayerSurrender(war, action);
    } else {
        await normalExePlayerSurrender(war, action);
    }
}

function fastExePlayerSurrender(war: IBwWar, action: WoPlayerSurrender): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        handleCommonExtraData({
            war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExePlayerSurrender_00),
            isFastExecute   : true,
        });
    } else {
        war.getPlayer(action.getPlayerIndex() ?? war.getPlayerIndexInTurn()).setAliveState(AliveStateId.Dying);
    }
}

async function normalExePlayerSurrender(war: IBwWar, action: WoPlayerSurrender): Promise<void> {
    const desc = await getDesc(war, action);
    (desc) && (show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExePlayerSurrender_00);
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
        war.getPlayer(action.getPlayerIndex() ?? war.getPlayerIndexInTurn()).setAliveState(AliveStateId.Dying);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoPlayerSurrender): Promise<string | null> {
    _meWarClass     ??= getMeWarClass();
    _mpwWarClass    ??= getMpwWarClass();
    _rwWarBaseClass ??= getRwWarBaseClass();
    _spwWarClass    ??= getSpwWarClass();
    _twWarClass     ??= getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return getFormattedText(
            TextType.F0008,
            await war.getPlayer(action.getPlayerIndex() ?? war.getPlayerIndexInTurn()).getNickname()
        );
    } else if (war instanceof _rwWarBaseClass) {
        return `${await war.getPlayer(action.getPlayerIndex() ?? war.getPlayerIndexInTurn()).getNickname()} ${getText(TextType.B0055)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return getFormattedText(
            TextType.F0008,
            await war.getPlayer(action.getPlayerIndex() ?? war.getPlayerIndexInTurn()).getNickname()
        );
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
