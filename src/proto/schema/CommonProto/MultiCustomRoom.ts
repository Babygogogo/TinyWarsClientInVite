import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

 
export interface MultiCustomRoomJson extends $ProtoSchemaJsonBase {
}

export class MultiCustomRoom extends $ProtoSchemaBase {
    // No member data.

     
    public static fromJson(obj: MultiCustomRoomJson): MultiCustomRoom {
        return new MultiCustomRoom().loadJson(obj);
    }
    public override loadJson(_obj: MultiCustomRoomJson): this {
        return this;
    }
    public override toJson(obj?: MultiCustomRoomJson): MultiCustomRoomJson {
        obj ??= ({} as MultiCustomRoomJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MultiCustomRoom {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MultiCustomRoom();
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

    public override clone(): MultiCustomRoom {
        return MultiCustomRoom.decode(this.encode());
    }

    public override getSchemaName(): "MultiCustomRoom" {
        return "MultiCustomRoom";
    }

    // No member data accessors.
}
