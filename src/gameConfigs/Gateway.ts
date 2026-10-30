import { getExisted } from "../helpers/Misc.ts";
import {
    addListeners,
    send,
} from "../networks/Manager.ts";
import { MessageCodes } from "../networks/MessageCodes.ts";
import { dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import type { S as CommonLatestConfigVersionResponse } from "../proto/schema/CommonProto/NetMessage/MsgCommonLatestConfigVersion/S.ts";
import type { Event } from "../vendor/egret/Egret.ts";
import { setLatestConfigVersion } from "./Provider.ts";

export function init(): void {
    addListeners([
        { msgCode : MessageCodes.MsgCommonLatestConfigVersion,    callback : _onMsgCommonLatestConfigVersion },
    ], null);
}

export function reqCommonLatestConfigVersion(): void {
    send({
        MsgCommonLatestConfigVersion : { c : {} },
    });
}
function _onMsgCommonLatestConfigVersion(e: Event): void {
    const data = e.data as CommonLatestConfigVersionResponse;
    if (!data.getErrorCode()) {
        setLatestConfigVersion(getExisted(data.getVersion()));
        dispatch(TypeId.MsgCommonLatestConfigVersion, data);
    }
}
