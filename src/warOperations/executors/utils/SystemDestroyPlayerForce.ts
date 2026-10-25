import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { destroyPlayerForce } from "../../../destructions/Utils.ts";
import {
    getHrwWarClass,
    getMeWarClass,
    getMpwWarClass,
    getRwWarClass,
    getSpwWarClass,
    getTwWarClass,
} from "../../../gameHelpers/GhFactory.ts";
import type { IHrwWar } from "../../../halfwayReplayWar/interface/IHrwWar.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type { WoSystemDestroyPlayerForce } from "../../../proto/schema/CommonProto/WarOperation/WoSystemDestroyPlayerForce.ts";
import type { IRwWar } from "../../../replayWar/interface/IRwWar.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { handleCommonExtraData } from "./Common.ts";

let _hrwWarClass    : new () => IHrwWar;
let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarClass     : new () => IRwWar;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

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
        handleCommonExtraData({
            war             : war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExeSystemDestroyPlayerForce_00),
            isFastExecute   : true,
        });
        war.getDrawVoteManager().handlePlayerForceDestruction();
    } else {
        destroyPlayerForce(war, getExisted(action.getTargetPlayerIndex()), false);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeSystemDestroyPlayerForce(war: IBwWar, action: WoSystemDestroyPlayerForce): Promise<void> {
    // const desc = await war.getDescForExeSystemDestroyPlayerForce(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExeSystemDestroyPlayerForce_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
        });
        war.getDrawVoteManager().handlePlayerForceDestruction();

    } else {
        destroyPlayerForce(war, getExisted(action.getTargetPlayerIndex()), true);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoSystemDestroyPlayerForce): Promise<string | null> {
    _hrwWarClass    ??= getHrwWarClass();
    _meWarClass     ??= getMeWarClass();
    _mpwWarClass    ??= getMpwWarClass();
    _rwWarClass     ??= getRwWarClass();
    _spwWarClass    ??= getSpwWarClass();
    _twWarClass     ??= getTwWarClass();

    if (war instanceof _hrwWarClass) {
        const playerIndex = getExisted(action.getExtraData()?.getTargetPlayerIndex());
        return `P${playerIndex} ${await war.getPlayer(playerIndex).getNickname()} ${getText(TextType.B0450)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        const playerIndex = getExisted(action.getExtraData()?.getTargetPlayerIndex());
        return `p${playerIndex} ${await war.getPlayer(playerIndex).getNickname()} ${getText(TextType.B0450)}`;
    } else if (war instanceof _rwWarClass) {
        const playerIndex = getExisted(action.getTargetPlayerIndex());
        return `P${playerIndex} ${await war.getPlayer(playerIndex).getNickname()} ${getText(TextType.B0450)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        const playerIndex = getExisted(action.getTargetPlayerIndex());
        return `p${playerIndex} ${await war.getPlayer(playerIndex).getNickname()} ${getText(TextType.B0450)}`;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
