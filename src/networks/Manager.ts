import { show } from "../FloatText.ts";
import { getCurrentGameEssentialConfig } from "../gameVersions/Utils.ts";
import { newError } from "../helpers/Misc.ts";
import { TextType } from "../lang/Constants.ts";
import {
    getErrorText,
    getText,
} from "../lang/Utils.ts";
import { log } from "../Logger.ts";
import { MessageCodes } from "./MessageCodes.ts";
import { WebsocketConnection } from "./WebsocketConnection.ts";
import { dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import {
    type MessageContainerJson as ProtoMessageContainerJson,
    MessageContainer,
} from "../proto/schema/CommonProto/NetMessage/MessageContainer.ts";
import { MsgMpwCommonHandleBoot } from "../proto/schema/CommonProto/NetMessage/MsgMpwCommonHandleBoot.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import { ServerErrorCode } from "../utils/ServerErrorCode.ts";
import {
    Event,
    EventDispatcher,
    ByteArray,
} from "../egret/Egret.ts";

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
    return getCurrentGameEssentialConfig()?.serverUrl;
    // return "ws://localhost:4000";
}

////////////////////////////////////////////////////////////////////////////////
// Type definitions.
////////////////////////////////////////////////////////////////////////////////
export type MsgListener = {
    msgCode     : MessageCodes;
    callback    : (e: Event) => void;
    thisObject? : unknown;
};

class NetMessageDispatcher extends EventDispatcher {
    public dispatchWithContainer(container: MessageContainer): void {
        const msgData = container.getMessageData();
        if (msgData == null) {
            throw newError(`Empty messageData?!`, ClientErrorCode.NetManager_NetMessageDispatcher_DispatchWithContainer_00);
        }

        const sData = msgData.getS();
        if (msgData instanceof MsgMpwCommonHandleBoot) {
            // Don't show the error text.
        } else {
            const errorCode = (sData?.toJson() as any)?.errorCode;
            if (errorCode) {
                if (errorCode === ServerErrorCode.Common_RequestTooFrequent_0001) {
                    // Logger.warn(`Request too frequent: ${errorCode}`);
                } else {
                    show(getErrorText(errorCode));
                }
            }
        }
        this.dispatchEventWith(msgData.getSchemaName(), false, sData);
    }
}

////////////////////////////////////////////////////////////////////////////////
// Local variables.
////////////////////////////////////////////////////////////////////////////////
let _webSocketConnection    : WebsocketConnection | null = null;
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
export function addListeners(listeners: MsgListener[], thisObject?: unknown): void {
    for (const one of listeners) {
        dispatcher.addEventListener(MessageCodes[one.msgCode], one.callback, one.thisObject || thisObject);
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function removeListeners(listeners: MsgListener[], thisObject?: unknown): void {
    for (const one of listeners) {
        dispatcher.removeEventListener(MessageCodes[one.msgCode], one.callback, one.thisObject || thisObject);
    }
}

export function send(containerJson: ProtoMessageContainerJson): void {
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
            show(getText(TextType.A0014));
        } else {
            const messageName = getMessageName(containerJson);
            const encodedData = MessageContainer.fromJson(containerJson).encode();
            log("%cNetManager send: ", "background:#97FF4F;", messageName, ", length: ", encodedData.byteLength, "\n", containerJson[messageName]);
            connection.writeBytes(new ByteArray(encodedData));
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
            const connection = new WebsocketConnection({
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

function _onConnectionOpened(connection: WebsocketConnection): void {
    if (connection === _webSocketConnection) {
        show(getText(TextType.A0007));

        dispatch(TypeId.NetworkConnected);
    }
}
function _onConnectionClosed(connection: WebsocketConnection): void {
    if (connection === _webSocketConnection) {
        dispatch(TypeId.NetworkDisconnected);

        if (!checkCanAutoReconnect()) {
            // FloatText.show(Lang.getText(Lang.Type.A0013));
        } else {
            show(getText(TextType.A0008));
            resetConnection();
        }
    }
}
function _onConnectionErrored(connection: WebsocketConnection): void {
    if (connection === _webSocketConnection) {
        resetConnection();
    }
}
function _onConnectionData(connection: WebsocketConnection, container: MessageContainer): void {
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

function getMessageName(container: ProtoMessageContainerJson): keyof ProtoMessageContainerJson {
    for (const k in container) {
        return k as keyof ProtoMessageContainerJson;
    }
    throw newError(`Invalid container.`, ClientErrorCode.Helpers_GetMessageName_00);
}
