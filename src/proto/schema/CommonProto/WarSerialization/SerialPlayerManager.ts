import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { SerialPlayer as $Message$CommonProto$WarSerialization$SerialPlayer, type SerialPlayerJson as $Json$CommonProto$WarSerialization$SerialPlayer } from "./SerialPlayer.js";

export interface SerialPlayerManagerJson extends $ProtoSchemaJsonBase {
    players: $Json$CommonProto$WarSerialization$SerialPlayer[];
}

export class SerialPlayerManager extends $ProtoSchemaBase {
    private _players: $Message$CommonProto$WarSerialization$SerialPlayer[] = [];

    public static fromJson(obj: SerialPlayerManagerJson): SerialPlayerManager {
        return new SerialPlayerManager().loadJson(obj);
    }
    public override loadJson(obj: SerialPlayerManagerJson): this {
        this.setPlayers(obj.players?.map(v => $Message$CommonProto$WarSerialization$SerialPlayer.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: SerialPlayerManagerJson): SerialPlayerManagerJson {
        obj ??= ({} as SerialPlayerManagerJson);

        {
            obj.players = this.getPlayers().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getPlayers();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SerialPlayerManager {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SerialPlayerManager();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._players;
                        arr.push($Message$CommonProto$WarSerialization$SerialPlayer.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SerialPlayerManager {
        return SerialPlayerManager.decode(this.encode());
    }

    public override getSchemaName(): "SerialPlayerManager" {
        return "SerialPlayerManager";
    }

    public getPlayers(): $Message$CommonProto$WarSerialization$SerialPlayer[] {
        return this._players;
    }
    public setPlayers(value: $Message$CommonProto$WarSerialization$SerialPlayer[]): void {
        this._players = value;
    }
}
