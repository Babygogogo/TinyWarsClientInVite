import * as FloatText2 from "../FloatText.ts";
import * as GameVersionsUtils from "../gameVersions/Utils.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import * as Logger2 from "../Logger.ts";
import * as NetworksMessageCodes from "./MessageCodes.ts";
import * as NetworksWebsocketConnection from "./WebsocketConnection.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoNetMessageMessageContainer from "../proto/schema/CommonProto/NetMessage/MessageContainer.ts";
import * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonHandleBoot from "../proto/schema/CommonProto/NetMessage/MsgMpwCommonHandleBoot.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import * as UtilsServerErrorCode from "../utils/ServerErrorCode.ts";
import * as VendorEgretEgret from "../vendor/egret/Egret.ts";

type MessageContainerJson   = ProtoSchemaCommonProtoNetMessageMessageContainer.MessageContainerJson;

////////////////////////////////////////////////////////////////////////////////
// Constants.
////////////////////////////////////////////////////////////////////////////////
const USE_SIGNALR   = false;

// 此函数严格来说不应该放在这里，但目前放在这里比较方便
export function checkAndOverrideGameVersion(): void {
    if (window.CLIENT_VERSION === "DEVELOP") {
        // window.GAME_VERSION = GameVersions.Constants.GameVersionType.Test;
    }
}
function getFullUrl(): string {
    return GameVersionsUtils.getCurrentGameEssentialConfig()?.serverUrl;
    // return "ws://localhost:4000";
}

////////////////////////////////////////////////////////////////////////////////
// Type definitions.
////////////////////////////////////////////////////////////////////////////////
export type MsgListener = {
    msgCode     : NetworksMessageCodes.MessageCodes;
    callback    : (e: VendorEgretEgret.Event) => void;
    thisObject? : any;
};

class NetMessageDispatcher extends VendorEgretEgret.EventDispatcher {
    public dispatchWithContainer(container: ProtoSchemaCommonProtoNetMessageMessageContainer.MessageContainer): void {
        const msgData = container.getMessageData();
        if (msgData == null) {
            throw HelpersMisc.newError(`Empty messageData?!`, UtilsClientErrorCode.ClientErrorCode.NetManager_NetMessageDispatcher_DispatchWithContainer_00);
        }

        const sData = msgData.getS();
        if (msgData instanceof ProtoSchemaCommonProtoNetMessageMsgMpwCommonHandleBoot.MsgMpwCommonHandleBoot) {
            // Don't show the error text.
        } else {
            const errorCode = (sData?.toJson() as any)?.errorCode;
            if (errorCode) {
                if (errorCode === UtilsServerErrorCode.ServerErrorCode.Common_RequestTooFrequent_0001) {
                    // Logger.warn(`Request too frequent: ${errorCode}`);
                } else {
                    FloatText2.show(LangUtils.getErrorText(errorCode));
                }
            }
        }
        this.dispatchEventWith(msgData.getSchemaName(), false, sData);
    }
}

////////////////////////////////////////////////////////////////////////////////
// Local variables.
////////////////////////////////////////////////////////////////////////////////
let _webSocketConnection    : NetworksWebsocketConnection.WebsocketConnection | null = null;
// let _signalRConnection      : signalR.HubConnection | null = null;
let _canAutoReconnect       = true;

const dispatcher = new NetMessageDispatcher();

////////////////////////////////////////////////////////////////////////////////
// Exports.
////////////////////////////////////////////////////////////////////////////////
export function init(): void {
    resetConnection();
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function addListeners(listeners: MsgListener[], thisObject?: any): void {
    for (const one of listeners) {
        dispatcher.addEventListener(NetworksMessageCodes.MessageCodes[one.msgCode], one.callback, one.thisObject || thisObject);
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function removeListeners(listeners: MsgListener[], thisObject?: any): void {
    for (const one of listeners) {
        dispatcher.removeEventListener(NetworksMessageCodes.MessageCodes[one.msgCode], one.callback, one.thisObject || thisObject);
    }
}

export function send(containerJson: MessageContainerJson): void {
    if (USE_SIGNALR) {
        // const connection = _signalRConnection;
        // if ((!connection) || (connection.state !== signalR.HubConnectionState.Connected)) {
        //     FloatText.show(Lang.getText(LangTextType.A0014));
        // } else {
        //     const messageName = Helpers.getMessageName(container);
        //     const encodedData = ProtoManager.encodeAsMessageContainer(container);
        //     Logger.log("%cNetManager send: ", "background:#97FF4F;", messageName, ", length: ", encodedData.byteLength, "\n", container[messageName]);
        //     connection.send("C", encodedData);
        // }

    } else {
        const connection = _webSocketConnection;
        if ((!connection) || (!connection.connected)) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0014));
        } else {
            const messageName = getMessageName(containerJson);
            const encodedData = ProtoSchemaCommonProtoNetMessageMessageContainer.MessageContainer.fromJson(containerJson).encode();
            Logger2.log("%cNetManager send: ", "background:#97FF4F;", messageName, ", length: ", encodedData.byteLength, "\n", containerJson[messageName]);
            connection.writeBytes(new VendorEgretEgret.ByteArray(encodedData));
            connection.flush();
        }
    }
}

export function checkCanAutoReconnect(): boolean {
    return _canAutoReconnect;
}
function setCanAutoReconnect(can: boolean): void {
    _canAutoReconnect = can;
}

function resetConnection(): void {
    destroyConnection();
    initConnection();
}
function initConnection(): void {
    if (USE_SIGNALR) {
        // if (_signalRConnection == null) {
        //     const connection = new signalR.HubConnectionBuilder()
        //         .withUrl(`${FULL_URL}/hub`, {
        //             skipNegotiation : true,
        //             transport       : signalR.HttpTransportType.WebSockets,
        //         })
        //         .withHubProtocol(new signalR.protocols.msgpack.MessagePackHubProtocol())
        //         .build();
        //     connection.onclose(() => onSignalRConnectionClosed(connection));
        //     connection.on("S", (data) => onSignalRData(connection, data));

        //     setCanAutoReconnect(true);
        //     connection.start().then(
        //         () => onSignalRConnectionOpened(connection),
        //         () => onSignalRConnectionClosed(connection),
        //     );

        //     _signalRConnection = connection;
        // }

    } else {
        if (_webSocketConnection == null) {
            const connection = new NetworksWebsocketConnection.WebsocketConnection({
                callbackOnConnectionOpened  : c => _onConnectionOpened(c),
                callbackOnConnectionClosed  : c => _onConnectionClosed(c),
                callbackOnConnectionErrored : c => _onConnectionErrored(c),
                callbackOnConnectionData    : (c, container) => _onConnectionData(c, container),
            });

            setCanAutoReconnect(true);
            connection.connectByUrl(getFullUrl());

            _webSocketConnection = connection;
        }
    }
}
function destroyConnection(): void {
    if (_webSocketConnection) {
        _webSocketConnection.destroy();
        _webSocketConnection = null;
    }
    // if (_signalRConnection) {
    //     _signalRConnection.off("S");
    //     _signalRConnection.stop();

    //     _signalRConnection = null;
    // }
}

function _onConnectionOpened(connection: NetworksWebsocketConnection.WebsocketConnection): void {
    if (connection === _webSocketConnection) {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0007));

        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.NetworkConnected);
    }
}
function _onConnectionClosed(connection: NetworksWebsocketConnection.WebsocketConnection): void {
    if (connection === _webSocketConnection) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.NetworkDisconnected);

        if (!checkCanAutoReconnect()) {
            // FloatText.show(Lang.getText(Lang.Type.A0013));
        } else {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0008));
            resetConnection();
        }
    }
}
function _onConnectionErrored(connection: NetworksWebsocketConnection.WebsocketConnection): void {
    if (connection === _webSocketConnection) {
        resetConnection();
    }
}
function _onConnectionData(connection: NetworksWebsocketConnection.WebsocketConnection, container: ProtoSchemaCommonProtoNetMessageMessageContainer.MessageContainer): void {
    if (connection !== _webSocketConnection) {
        return;
    }

    // const messageName = Helpers.getMessageName(container);
    // Logger.log("%cNetManager receive: ", "background:#FFD777", messageName, ", length: ", dataLength, "\n", container[messageName]);

    if (container.getMsgCommonServerDisconnect()) {
        setCanAutoReconnect(false);
    }

    dispatcher.dispatchWithContainer(container);
}

// function onSignalRConnectionOpened(connection: signalR.HubConnection): void {
//     if (connection === _signalRConnection) {
//         FloatText.show(Lang.getText(LangTextType.A0007));

//         Notify.Dispatcher.dispatch(NotifyType.NetworkConnected);
//     } else {
//         connection.off("S");
//         connection.stop();
//     }
// }
// function onSignalRConnectionClosed(connection: signalR.HubConnection): void {
//     if (connection === _signalRConnection) {
//         Notify.Dispatcher.dispatch(NotifyType.NetworkDisconnected);
//         if (!checkCanAutoReconnect()) {
//             // FloatText.show(Lang.getText(Lang.Type.A0013));
//         } else {
//             FloatText.show(Lang.getText(LangTextType.A0008));

//             connection.start().then(
//                 () => onSignalRConnectionOpened(connection),
//                 () => onSignalRConnectionClosed(connection),
//             );
//         }
//     }
// }
// function onSignalRData(connection: signalR.HubConnection, data: Uint8Array): void {
//     if (connection === _signalRConnection) {
//         const container     = ProtoManager.decodeAsMessageContainer(data);
//         const messageName   = Helpers.getMessageName(container);
//         Logger.log("%cNetManager receive: ", "background:#FFD777", messageName, ", length: ", data.length, "\n", container[messageName]);

//         if (container.MsgCommonServerDisconnect) {
//             setCanAutoReconnect(false);
//         }

//         dispatcher.dispatchWithContainer(container);
//     }
// }

function getMessageName(container: MessageContainerJson): keyof MessageContainerJson {
    for (const k in container) {
        return k as keyof MessageContainerJson;
    }
    throw HelpersMisc.newError(`Invalid container.`, UtilsClientErrorCode.ClientErrorCode.Helpers_GetMessageName_00);
}
