import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MultiMatchRoomJson extends $ProtoSchemaJsonBase {
}

export class MultiMatchRoom extends $ProtoSchemaBase {
    // No member data.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static fromJson(obj: MultiMatchRoomJson): MultiMatchRoom {
        return new MultiMatchRoom().loadJson(obj);
    }
    public override loadJson(_obj: MultiMatchRoomJson): this {
        return this;
    }
    public override toJson(obj?: MultiMatchRoomJson): MultiMatchRoomJson {
        obj ??= ({} as MultiMatchRoomJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MultiMatchRoom {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MultiMatchRoom();
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

    public override clone(): MultiMatchRoom {
        return MultiMatchRoom.decode(this.encode());
    }

    public override getSchemaName(): "MultiMatchRoom" {
        return "MultiMatchRoom";
    }

    // No member data accessors.
}
