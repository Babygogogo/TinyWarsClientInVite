import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

 
export interface AutoTourneyRoomJson extends $ProtoSchemaJsonBase {
}

export class AutoTourneyRoom extends $ProtoSchemaBase {
    // No member data.

     
    public static fromJson(obj: AutoTourneyRoomJson): AutoTourneyRoom {
        return new AutoTourneyRoom().loadJson(obj);
    }
    public override loadJson(_obj: AutoTourneyRoomJson): this {
        return this;
    }
    public override toJson(obj?: AutoTourneyRoomJson): AutoTourneyRoomJson {
        obj ??= ({} as AutoTourneyRoomJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): AutoTourneyRoom {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new AutoTourneyRoom();
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

    public override clone(): AutoTourneyRoom {
        return AutoTourneyRoom.decode(this.encode());
    }

    public override getSchemaName(): "AutoTourneyRoom" {
        return "AutoTourneyRoom";
    }

    // No member data accessors.
}
