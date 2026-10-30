import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

 
export interface MapJson extends $ProtoSchemaJsonBase {
}

export class Map extends $ProtoSchemaBase {
    // No member data.

     
    public static fromJson(obj: MapJson): Map {
        return new Map().loadJson(obj);
    }
    public override loadJson(_obj: MapJson): this {
        return this;
    }
    public override toJson(obj?: MapJson): MapJson {
        obj ??= ({} as MapJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Map {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Map();
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

    public override clone(): Map {
        return Map.decode(this.encode());
    }

    public override getSchemaName(): "Map" {
        return "Map";
    }

    // No member data accessors.
}
