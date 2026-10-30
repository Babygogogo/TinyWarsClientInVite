import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

 
export interface AutoTourneyJson extends $ProtoSchemaJsonBase {
}

export class AutoTourney extends $ProtoSchemaBase {
    // No member data.

     
    public static fromJson(obj: AutoTourneyJson): AutoTourney {
        return new AutoTourney().loadJson(obj);
    }
    public override loadJson(_obj: AutoTourneyJson): this {
        return this;
    }
    public override toJson(obj?: AutoTourneyJson): AutoTourneyJson {
        obj ??= ({} as AutoTourneyJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): AutoTourney {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new AutoTourney();
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

    public override clone(): AutoTourney {
        return AutoTourney.decode(this.encode());
    }

    public override getSchemaName(): "AutoTourney" {
        return "AutoTourney";
    }

    // No member data accessors.
}
