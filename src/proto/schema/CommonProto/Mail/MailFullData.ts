import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface MailFullDataJson extends $ProtoSchemaJsonBase {
    mailId?: number | null | undefined;
    createTimestamp?: number | null | undefined;
    isNew?: boolean | null | undefined;
    encodedContainer?: Uint8Array | null | undefined;
}

export class MailFullData extends $ProtoSchemaBase {
    private _mailId?: number | null | undefined;
    private _createTimestamp?: number | null | undefined;
    private _isNew?: boolean | null | undefined;
    private _encodedContainer?: Uint8Array | null | undefined;

    public static fromJson(obj: MailFullDataJson): MailFullData {
        return new MailFullData().loadJson(obj);
    }
    public override loadJson(obj: MailFullDataJson): this {
        this.setMailId(obj.mailId);
        this.setCreateTimestamp(obj.createTimestamp);
        this.setIsNew(obj.isNew);
        this.setEncodedContainer(obj.encodedContainer);
        return this;
    }
    public override toJson(obj?: MailFullDataJson): MailFullDataJson {
        obj ??= ({} as MailFullDataJson);

        {
            const value = this.getMailId();
            (value != null) && (obj.mailId = value);
        }

        {
            const value = this.getCreateTimestamp();
            (value != null) && (obj.createTimestamp = value);
        }

        {
            const value = this.getIsNew();
            (value != null) && (obj.isNew = value);
        }

        {
            const value = this.getEncodedContainer();
            (value != null) && (obj.encodedContainer = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMailId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getCreateTimestamp();
            if (value != null) {
                writer.uint32(16).uint32(value);
            }
        }

        {
            const value = this.getIsNew();
            if (value != null) {
                writer.uint32(24).bool(value);
            }
        }

        {
            const value = this.getEncodedContainer();
            if (value != null) {
                writer.uint32(34).bytes(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MailFullData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MailFullData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setMailId(reader.int32());
                    break;

                case 2:
                    msg.setCreateTimestamp(reader.uint32());
                    break;

                case 3:
                    msg.setIsNew(reader.bool());
                    break;

                case 4:
                    msg.setEncodedContainer(reader.bytes());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MailFullData {
        return MailFullData.decode(this.encode());
    }

    public override getSchemaName(): "MailFullData" {
        return "MailFullData";
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

    public checkHasCreateTimestamp(): boolean {
        return this._createTimestamp != null;
    }
    public getCreateTimestamp(): number | null | undefined {
        return this._createTimestamp;
    }
    public setCreateTimestamp(value: number | null | undefined): void {
        this._createTimestamp = value;
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

    public checkHasEncodedContainer(): boolean {
        return this._encodedContainer != null;
    }
    public getEncodedContainer(): Uint8Array | null | undefined {
        return this._encodedContainer;
    }
    public setEncodedContainer(value: Uint8Array | null | undefined): void {
        this._encodedContainer = value;
    }
}
