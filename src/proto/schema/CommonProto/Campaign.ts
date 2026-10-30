import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

 
export interface CampaignJson extends $ProtoSchemaJsonBase {
}

export class Campaign extends $ProtoSchemaBase {
    // No member data.

     
    public static fromJson(obj: CampaignJson): Campaign {
        return new Campaign().loadJson(obj);
    }
    public override loadJson(_obj: CampaignJson): this {
        return this;
    }
    public override toJson(obj?: CampaignJson): CampaignJson {
        obj ??= ({} as CampaignJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Campaign {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Campaign();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): Campaign {
        return Campaign.decode(this.encode());
    }

    public override getSchemaName(): "Campaign" {
        return "Campaign";
    }

    // No member data accessors.
}
