import {
    Egret_Egret,
    Utils_ClientErrorCode,
    Notifications_Dispatcher,
    GameVersions_Utils,
    Lang_Utils,
    Logger,
    Networks_MessageCodes,
    Helpers_Misc,
    Utils_ServerErrorCode,
    FloatText,
    Lang_Constants,
    Networks_WebsocketConnection,
} from "../internal.ts";
import {
    type MessageContainerJson as ProtoMessageContainerJson,
    MessageContainer,
} from "../proto/schema/CommonProto/NetMessage/MessageContainer.ts";
import { MsgMpwCommonHandleBoot } from "../proto/schema/CommonProto/NetMessage/MsgMpwCommonHandleBoot.ts";

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
    return GameVersions_Utils.getCurrentGameEssentialConfig()?.serverUrl;
    // return "ws://localhost:4000";
}

////////////////////////////////////////////////////////////////////////////////
// Type definitions.
////////////////////////////////////////////////////////////////////////////////
export type ResponseMapping = {
    [M in NonNullable<ReturnType<MessageContainer["getMessageData"]>> as ReturnType<M["getSchemaName"]>]:
        NonNullable<ReturnType<M["getS"]>>;
};

export type MsgListener<K extends keyof ResponseMapping = keyof ResponseMapping> = {
    [P in K]: {
        msgCode     : (typeof Networks_MessageCodes.MessageCodes)[P];
        callback    : (e: Egret_Egret.Event<ResponseMapping[P]>) => void;
        thisObject? : unknown;
    };
}[K];

class NetMessageDispatcher extends Egret_Egret.EventDispatcher {
    public dispatchWithContainer(container: MessageContainer): void {
        const msgData = container.getMessageData();
        if (msgData == null) {
            throw Helpers_Misc.newError(`Empty messageData?!`, Utils_ClientErrorCode.ClientErrorCode.NetManager_NetMessageDispatcher_DispatchWithContainer_00);
        }

        const sData = msgData.getS();
        if (msgData instanceof MsgMpwCommonHandleBoot) {
            // Don't show the error text.
        } else {
            const errorCode = (sData?.toJson() as any)?.errorCode;
            if (errorCode) {
                if (errorCode === Utils_ServerErrorCode.ServerErrorCode.Common_RequestTooFrequent_0001) {
                    // Logger.warn(`Request too frequent: ${errorCode}`);
                } else {
                    FloatText.show(Lang_Utils.getErrorText(errorCode));
                }
            }
        }
        this.dispatchEventWith(msgData.getSchemaName(), false, sData);
    }
}

////////////////////////////////////////////////////////////////////////////////
// Local variables.
////////////////////////////////////////////////////////////////////////////////
let _webSocketConnection    : Networks_WebsocketConnection.WebsocketConnection | null = null;
// let _signalRConnection      : signalR.HubConnection | null = null;
let _canAutoReconnect       = true;

const dispatcher = new NetMessageDispatcher();

////////////////////////////////////////////////////////////////////////////////
// Exports.
////////////////////////////////////////////////////////////////////////////////
export function init(): void {
    resetConnection();
}

 
export function addListeners(listeners: MsgListener[], thisObject?: unknown): void {
    for (const one of listeners) {
        dispatcher.addEventListener(Networks_MessageCodes.MessageCodes[one.msgCode], one.callback as Egret_Egret.EventListener, one.thisObject || thisObject);
    }
}

 
export function removeListeners(listeners: MsgListener[], thisObject?: unknown): void {
    for (const one of listeners) {
        dispatcher.removeEventListener(Networks_MessageCodes.MessageCodes[one.msgCode], one.callback as Egret_Egret.EventListener, one.thisObject || thisObject);
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
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0014));
        } else {
            const messageName = getMessageName(containerJson);
            const encodedData = MessageContainer.fromJson(containerJson).encode();
            Logger.log("%cNetManager send: ", "background:#97FF4F;", messageName, ", length: ", encodedData.byteLength, "\n", containerJson[messageName]);
            connection.writeBytes(new Egret_Egret.ByteArray(encodedData));
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
            const connection = new Networks_WebsocketConnection.WebsocketConnection({
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

function _onConnectionOpened(connection: Networks_WebsocketConnection.WebsocketConnection): void {
    if (connection === _webSocketConnection) {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0007));

        Notifications_Dispatcher.dispatch("NetworkConnected");
    }
}
function _onConnectionClosed(connection: Networks_WebsocketConnection.WebsocketConnection): void {
    if (connection === _webSocketConnection) {
        Notifications_Dispatcher.dispatch("NetworkDisconnected");

        if (!checkCanAutoReconnect()) {
            // FloatText.show(Lang.getText(Lang.Type.A0013));
        } else {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0008));
            resetConnection();
        }
    }
}
function _onConnectionErrored(connection: Networks_WebsocketConnection.WebsocketConnection): void {
    if (connection === _webSocketConnection) {
        resetConnection();
    }
}
function _onConnectionData(connection: Networks_WebsocketConnection.WebsocketConnection, container: MessageContainer): void {
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
    throw Helpers_Misc.newError(`Invalid container.`, Utils_ClientErrorCode.ClientErrorCode.Helpers_GetMessageName_00);
}
