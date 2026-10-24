import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    roomId?: number | null | undefined;
    playerIndex?: number | null | undefined;
    isReady?: boolean | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _roomId?: number | null | undefined;
    private _playerIndex?: number | null | undefined;
    private _isReady?: boolean | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setRoomId(obj.roomId);
        this.setPlayerIndex(obj.playerIndex);
        this.setIsReady(obj.isReady);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getRoomId();
            (value != null) && (obj.roomId = value);
        }

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }

        {
            const value = this.getIsReady();
            (value != null) && (obj.isReady = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getErrorCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getRoomId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getPlayerIndex();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getIsReady();
            if (value != null) {
                writer.uint32(32).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): S {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new S();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setErrorCode(reader.int32());
                    break;

                case 2:
                    msg.setRoomId(reader.int32());
                    break;

                case 3:
                    msg.setPlayerIndex(reader.int32());
                    break;

                case 4:
                    msg.setIsReady(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): S {
        return S.decode(this.encode());
    }

    public override getSchemaName(): "S" {
        return "S";
    }

    public checkHasErrorCode(): boolean {
        return this._errorCode != null;
    }
    public getErrorCode(): number | null | undefined {
        return this._errorCode;
    }
    public setErrorCode(value: number | null | undefined): void {
        this._errorCode = value;
    }

    public checkHasRoomId(): boolean {
        return this._roomId != null;
    }
    public getRoomId(): number | null | undefined {
        return this._roomId;
    }
    public setRoomId(value: number | null | undefined): void {
        this._roomId = value;
    }

    public checkHasPlayerIndex(): boolean {
        return this._playerIndex != null;
    }
    public getPlayerIndex(): number | null | undefined {
        return this._playerIndex;
    }
    public setPlayerIndex(value: number | null | undefined): void {
        this._playerIndex = value;
    }

    public checkHasIsReady(): boolean {
        return this._isReady != null;
    }
    public getIsReady(): boolean | null | undefined {
        return this._isReady;
    }
    public setIsReady(value: boolean | null | undefined): void {
        this._isReady = value;
    }
}
