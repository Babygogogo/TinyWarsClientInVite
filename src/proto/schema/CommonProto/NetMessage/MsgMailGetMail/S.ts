import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { MailFullData as $Message$CommonProto$Mail$MailFullData, type MailFullDataJson as $Json$CommonProto$Mail$MailFullData } from "../../Mail/MailFullData.js";

export interface SJson extends $ProtoSchemaJsonBase {
    mailFullData?: $Json$CommonProto$Mail$MailFullData | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _mailFullData?: $Message$CommonProto$Mail$MailFullData | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setMailFullData(obj.mailFullData != null ? $Message$CommonProto$Mail$MailFullData.fromJson(obj.mailFullData) : null);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getMailFullData();
            (value != null) && (obj.mailFullData = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMailFullData();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
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
                    msg.setMailFullData($Message$CommonProto$Mail$MailFullData.decode(reader, reader.uint32()));
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

    public checkHasMailFullData(): boolean {
        return this._mailFullData != null;
    }
    public getMailFullData(): $Message$CommonProto$Mail$MailFullData | null | undefined {
        return this._mailFullData;
    }
    public setMailFullData(value: $Message$CommonProto$Mail$MailFullData | null | undefined): void {
        this._mailFullData = value;
    }
    public createIfNotExistsMailFullData(): $Message$CommonProto$Mail$MailFullData {
        return this._mailFullData ??= new $Message$CommonProto$Mail$MailFullData();
    }
}
