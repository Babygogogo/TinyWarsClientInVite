import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

 
export interface MultiRankRoomJson extends $ProtoSchemaJsonBase {
}

export class MultiRankRoom extends $ProtoSchemaBase {
    // No member data.

     
    public static fromJson(obj: MultiRankRoomJson): MultiRankRoom {
        return new MultiRankRoom().loadJson(obj);
    }
    public override loadJson(_obj: MultiRankRoomJson): this {
        return this;
    }
    public override toJson(obj?: MultiRankRoomJson): MultiRankRoomJson {
        obj ??= ({} as MultiRankRoomJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MultiRankRoom {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MultiRankRoom();
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

    public override clone(): MultiRankRoom {
        return MultiRankRoom.decode(this.encode());
    }

    public override getSchemaName(): "MultiRankRoom" {
        return "MultiRankRoom";
    }

    // No member data accessors.
}
