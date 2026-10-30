import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

 
export interface CoopCustomRoomJson extends $ProtoSchemaJsonBase {
}

export class CoopCustomRoom extends $ProtoSchemaBase {
    // No member data.

     
    public static fromJson(obj: CoopCustomRoomJson): CoopCustomRoom {
        return new CoopCustomRoom().loadJson(obj);
    }
    public override loadJson(_obj: CoopCustomRoomJson): this {
        return this;
    }
    public override toJson(obj?: CoopCustomRoomJson): CoopCustomRoomJson {
        obj ??= ({} as CoopCustomRoomJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): CoopCustomRoom {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new CoopCustomRoom();
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

    public override clone(): CoopCustomRoom {
        return CoopCustomRoom.decode(this.encode());
    }

    public override getSchemaName(): "CoopCustomRoom" {
        return "CoopCustomRoom";
    }

    // No member data accessors.
}
