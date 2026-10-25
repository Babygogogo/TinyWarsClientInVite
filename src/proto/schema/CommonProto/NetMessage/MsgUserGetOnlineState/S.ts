import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    userId?: number | null | undefined;
    isOnline?: boolean | null | undefined;
    lastActivityTime?: number | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _userId?: number | null | undefined;
    private _isOnline?: boolean | null | undefined;
    private _lastActivityTime?: number | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setUserId(obj.userId);
        this.setIsOnline(obj.isOnline);
        this.setLastActivityTime(obj.lastActivityTime);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getIsOnline();
            (value != null) && (obj.isOnline = value);
        }

        {
            const value = this.getLastActivityTime();
            (value != null) && (obj.lastActivityTime = value);
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
            const value = this.getUserId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getIsOnline();
            if (value != null) {
                writer.uint32(24).bool(value);
            }
        }

        {
            const value = this.getLastActivityTime();
            if (value != null) {
                writer.uint32(32).uint32(value);
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
                    msg.setUserId(reader.int32());
                    break;

                case 3:
                    msg.setIsOnline(reader.bool());
                    break;

                case 4:
                    msg.setLastActivityTime(reader.uint32());
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

    public checkHasUserId(): boolean {
        return this._userId != null;
    }
    public getUserId(): number | null | undefined {
        return this._userId;
    }
    public setUserId(value: number | null | undefined): void {
        this._userId = value;
    }

    public checkHasIsOnline(): boolean {
        return this._isOnline != null;
    }
    public getIsOnline(): boolean | null | undefined {
        return this._isOnline;
    }
    public setIsOnline(value: boolean | null | undefined): void {
        this._isOnline = value;
    }

    public checkHasLastActivityTime(): boolean {
        return this._lastActivityTime != null;
    }
    public getLastActivityTime(): number | null | undefined {
        return this._lastActivityTime;
    }
    public setLastActivityTime(value: number | null | undefined): void {
        this._lastActivityTime = value;
    }
}
