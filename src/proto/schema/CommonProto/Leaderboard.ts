import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../$runtime.js";

 
export interface LeaderboardJson extends $ProtoSchemaJsonBase {
}

export class Leaderboard extends $ProtoSchemaBase {
    // No member data.

     
    public static fromJson(obj: LeaderboardJson): Leaderboard {
        return new Leaderboard().loadJson(obj);
    }
    public override loadJson(_obj: LeaderboardJson): this {
        return this;
    }
    public override toJson(obj?: LeaderboardJson): LeaderboardJson {
        obj ??= ({} as LeaderboardJson);
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Leaderboard {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Leaderboard();
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

    public override clone(): Leaderboard {
        return Leaderboard.decode(this.encode());
    }

    public override getSchemaName(): "Leaderboard" {
        return "Leaderboard";
    }

    // No member data accessors.
}
