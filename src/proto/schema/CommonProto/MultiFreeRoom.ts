import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MultiFreeRoomJson extends $ProtoSchemaJsonBase {
}

export class MultiFreeRoom extends $ProtoSchemaBase {
    // No member data.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static fromJson(obj: MultiFreeRoomJson): MultiFreeRoom {
        return new MultiFreeRoom().loadJson(obj);
    }
    public override loadJson(_obj: MultiFreeRoomJson): this {
        return this;
    }
    public override toJson(obj?: MultiFreeRoomJson): MultiFreeRoomJson {
        obj ??= ({} as MultiFreeRoomJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MultiFreeRoom {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MultiFreeRoom();
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

    public override clone(): MultiFreeRoom {
        return MultiFreeRoom.decode(this.encode());
    }

    public override getSchemaName(): "MultiFreeRoom" {
        return "MultiFreeRoom";
    }

    // No member data accessors.
}
