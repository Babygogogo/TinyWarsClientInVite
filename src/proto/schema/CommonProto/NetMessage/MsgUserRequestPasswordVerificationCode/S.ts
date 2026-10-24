import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    emailAddress?: string | null | undefined;
    endTimestamp?: number | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _emailAddress?: string | null | undefined;
    private _endTimestamp?: number | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setEmailAddress(obj.emailAddress);
        this.setEndTimestamp(obj.endTimestamp);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getEmailAddress();
            (value != null) && (obj.emailAddress = value);
        }

        {
            const value = this.getEndTimestamp();
            (value != null) && (obj.endTimestamp = value);
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
            const value = this.getEmailAddress();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getEndTimestamp();
            if (value != null) {
                writer.uint32(24).uint32(value);
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
                    msg.setEmailAddress(reader.string());
                    break;

                case 3:
                    msg.setEndTimestamp(reader.uint32());
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

    public checkHasEmailAddress(): boolean {
        return this._emailAddress != null;
    }
    public getEmailAddress(): string | null | undefined {
        return this._emailAddress;
    }
    public setEmailAddress(value: string | null | undefined): void {
        this._emailAddress = value;
    }

    public checkHasEndTimestamp(): boolean {
        return this._endTimestamp != null;
    }
    public getEndTimestamp(): number | null | undefined {
        return this._endTimestamp;
    }
    public setEndTimestamp(value: number | null | undefined): void {
        this._endTimestamp = value;
    }
}
