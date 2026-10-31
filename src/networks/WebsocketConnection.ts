import {
    Egret_Egret,
    Logger,
} from "../internal.ts";
import { MessageContainer } from "../proto/schema/CommonProto/NetMessage/MessageContainer.ts";

export class WebsocketConnection extends Egret_Egret.WebSocket {
    private readonly _callbackOnConnectionOpened     : (connection: WebsocketConnection) => void;
    private readonly _callbackOnConnectionClosed     : (connection: WebsocketConnection) => void;
    private readonly _callbackOnConnectionErrored    : (connection: WebsocketConnection) => void;
    private readonly _callbackOnConnectionData       : (connection: WebsocketConnection, container: MessageContainer) => void;

    public constructor({ callbackOnConnectionOpened, callbackOnConnectionClosed, callbackOnConnectionErrored, callbackOnConnectionData }: {
        callbackOnConnectionOpened  : (connection: WebsocketConnection) => void;
        callbackOnConnectionClosed  : (connection: WebsocketConnection) => void;
        callbackOnConnectionErrored : (connection: WebsocketConnection) => void;
        callbackOnConnectionData    : (connection: WebsocketConnection, container: MessageContainer) => void;
    }) {
        super();

        this.type = Egret_Egret.WebSocket.TYPE_BINARY;
        this.addEventListener(Egret_Egret.Event.CONNECT,              this._onWebSocketConnectionOpened,  this);
        this.addEventListener(Egret_Egret.Event.CLOSE,                this._onWebSocketConnectionClosed,  this);
        this.addEventListener(Egret_Egret.IOErrorEvent.IO_ERROR,      this._onWebSocketConnectionError,   this);
        this.addEventListener(Egret_Egret.ProgressEvent.SOCKET_DATA,  this._onWebSocketConnectionData,    this);

        this._callbackOnConnectionOpened    = callbackOnConnectionOpened;
        this._callbackOnConnectionClosed    = callbackOnConnectionClosed;
        this._callbackOnConnectionErrored   = callbackOnConnectionErrored;
        this._callbackOnConnectionData      = callbackOnConnectionData;
    }

    public destroy(): void {
        this.removeEventListener(Egret_Egret.Event.CONNECT,               this._onWebSocketConnectionOpened,  this);
        this.removeEventListener(Egret_Egret.Event.CLOSE,                 this._onWebSocketConnectionClosed,  this);
        this.removeEventListener(Egret_Egret.IOErrorEvent.IO_ERROR,       this._onWebSocketConnectionError,   this);
        this.removeEventListener(Egret_Egret.ProgressEvent.SOCKET_DATA,   this._onWebSocketConnectionData,    this);

        this.close();
    }

    private _onWebSocketConnectionOpened(): void {
        this._callbackOnConnectionOpened(this);
    }
    private _onWebSocketConnectionClosed(): void {
        this._callbackOnConnectionClosed(this);
    }
    private _onWebSocketConnectionError(): void {
        this._callbackOnConnectionErrored(this);
    }
    private _onWebSocketConnectionData(): void {
        const data = new Egret_Egret.ByteArray();
        this.readBytes(data);

        const msgContainer  = MessageContainer.decode(new Uint8Array(data.rawBuffer));
        const msgData       = msgContainer.getMessageData();
        Logger.log(
            "%cNetManager receive: ",
            "background:#FFD777",
            msgData?.getSchemaName(),
            ", length: ",
            data.length + 4,
            "\n",
            msgData?.toJson(),
        );

        this._callbackOnConnectionData(this, msgContainer);

        // let incomingBuffer: Uint8Array | null = new Uint8Array(data.rawBuffer);
        // for (;;) {
        //     const { dataBuffer, unhandledBuffer }   = mergeBuffers(this._unhandledBuffer, incomingBuffer);
        //     this._unhandledBuffer                   = unhandledBuffer;
        //     incomingBuffer                          = null;

        //     if (dataBuffer == null) {
        //         break;
        //     } else {
        //         const container     = Proto.ProtoManager.decodeAsMessageContainer(dataBuffer);
        //         const messageName   = Helpers.getMessageName(container);
        //         const messageData   = container[messageName];
        //         if (messageData?.s == null) {
        //             // throw Helpers.newError(`Empty messageData: ${messageName}`, ClientErrorCode.NetManager_NetMessageDispatcher_DispatchWithContainer_00);
        //             Logger.error("%cNetManager receive error: ", "background:#FFD777", messageName, ", length: ", data.length + 4, "\n", messageData);
        //             this._callbackOnConnectionErrored(this);
        //         } else {
        //             Logger.log("%cNetManager receive: ", "background:#FFD777", messageName, ", length: ", data.length + 4, "\n", messageData);
        //             this._callbackOnConnectionData(this, container);
        //         }
        //     }
        // }
    }
}

// type MergeBufferResult = {
//     dataBuffer      : Uint8Array | null;
//     unhandledBuffer : Uint8Array;
// };
// function mergeBuffers(buffer1: Uint8Array | null, buffer2: Uint8Array | null): MergeBufferResult {
//     const bufferLength1     = buffer1?.byteLength ?? 0;
//     const bufferLength2     = buffer2?.byteLength ?? 0;
//     const bufferTotalLength = bufferLength1 + bufferLength2;
//     const dataLength        = getDataLength(buffer1, buffer2);
//     if ((dataLength == null) || (bufferTotalLength < dataLength + 4)) {
//         const newUnhandledBuffer = new Uint8Array(bufferTotalLength);
//         if (buffer1) {
//             newUnhandledBuffer.set(buffer1);
//         }
//         if (buffer2) {
//             newUnhandledBuffer.set(buffer2, bufferLength1);
//         }
//         return {
//             dataBuffer      : null,
//             unhandledBuffer : newUnhandledBuffer,
//         };
//     }

//     // 偷懒，导致buffer多拷贝了一次
//     const fullBuffer = new Uint8Array(bufferTotalLength);
//     if (buffer1) {
//         fullBuffer.set(buffer1);
//     }
//     if (buffer2) {
//         fullBuffer.set(buffer2, bufferLength1);
//     }
//     return {
//         dataBuffer      : new Uint8Array(fullBuffer.subarray(4, dataLength + 4)),
//         unhandledBuffer : new Uint8Array(fullBuffer.subarray(dataLength + 4)),
//     };
// }
// function getDataLength(buffer1: Uint8Array | null, buffer2: Uint8Array | null): number | null {
//     const bufferLength1 = buffer1?.byteLength ?? 0;
//     const bufferLength2 = buffer2?.byteLength ?? 0;
//     if (bufferLength1 + bufferLength2 < 4) {
//         return null;
//     }

//     const bytes = new Uint8Array(4);
//     if (bufferLength1 >= 4) {
//         bytes.set(Helpers.Misc.getExisted(buffer1).subarray(0, 4));
//     } else {
//         if (buffer1) {
//             bytes.set(buffer1);
//         }
//         if (buffer2) {
//             bytes.set(buffer2.subarray(0, 4 - bufferLength1), bufferLength1);
//         }
//     }

//     return new DataView(bytes.buffer).getInt32(0);
// }
