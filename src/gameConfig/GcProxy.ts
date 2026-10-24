import * as GameConfigGcModel from "./GcModel.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as NetworksManager from "../networks/Manager.ts";
import * as NetworksMessageCodes from "../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCommonLatestConfigVersionS from "../proto/schema/CommonProto/NetMessage/MsgCommonLatestConfigVersion/S.ts";
import type * as VendorEgretEgret from "../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCommonLatestConfigVersion,    callback: _onMsgCommonLatestConfigVersion },
    ], null);
}

export function reqCommonLatestConfigVersion(): void {
    NetworksManager.send({
        MsgCommonLatestConfigVersion: { c: {} },
    });
}
function _onMsgCommonLatestConfigVersion(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCommonLatestConfigVersionS.S;
    if (!data.getErrorCode()) {
        GameConfigGcModel.setLatestConfigVersion(HelpersMisc.getExisted(data.getVersion()));
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCommonLatestConfigVersion, data);
    }
}
