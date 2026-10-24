import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    mailId?: number | null | undefined;
    isNew?: boolean | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _mailId?: number | null | undefined;
    private _isNew?: boolean | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setMailId(obj.mailId);
        this.setIsNew(obj.isNew);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getMailId();
            (value != null) && (obj.mailId = value);
        }

        {
            const value = this.getIsNew();
            (value != null) && (obj.isNew = value);
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
            const value = this.getMailId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getIsNew();
            if (value != null) {
                writer.uint32(24).bool(value);
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
                    msg.setMailId(reader.int32());
                    break;

                case 3:
                    msg.setIsNew(reader.bool());
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

    public checkHasMailId(): boolean {
        return this._mailId != null;
    }
    public getMailId(): number | null | undefined {
        return this._mailId;
    }
    public setMailId(value: number | null | undefined): void {
        this._mailId = value;
    }

    public checkHasIsNew(): boolean {
        return this._isNew != null;
    }
    public getIsNew(): boolean | null | undefined {
        return this._isNew;
    }
    public setIsNew(value: boolean | null | undefined): void {
        this._isNew = value;
    }
}
