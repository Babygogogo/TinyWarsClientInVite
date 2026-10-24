import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { MailFullData as $Message$CommonProto$Mail$MailFullData, type MailFullDataJson as $Json$CommonProto$Mail$MailFullData } from "../../Mail/MailFullData.js";

export interface SJson extends $ProtoSchemaJsonBase {
    mailFullDataArray: $Json$CommonProto$Mail$MailFullData[];
}

export class S extends $ProtoSchemaBase {
    private _mailFullDataArray: $Message$CommonProto$Mail$MailFullData[] = [];

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setMailFullDataArray(obj.mailFullDataArray?.map(v => $Message$CommonProto$Mail$MailFullData.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            obj.mailFullDataArray = this.getMailFullDataArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMailFullDataArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
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
                    {
                        const arr = msg._mailFullDataArray;
                        arr.push($Message$CommonProto$Mail$MailFullData.decode(reader, reader.uint32()));
                    }
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

    public getMailFullDataArray(): $Message$CommonProto$Mail$MailFullData[] {
        return this._mailFullDataArray;
    }
    public setMailFullDataArray(value: $Message$CommonProto$Mail$MailFullData[]): void {
        this._mailFullDataArray = value;
    }
}
