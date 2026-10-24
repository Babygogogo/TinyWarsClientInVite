import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { S as $Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer$S, type SJson as $Json$CommonProto$NetMessage$MsgAtrDeleteRoomByServer$S } from "./MsgAtrDeleteRoomByServer/S.js";

export interface MsgAtrDeleteRoomByServerJson extends $ProtoSchemaJsonBase {
    s?: $Json$CommonProto$NetMessage$MsgAtrDeleteRoomByServer$S | null | undefined;
}

export class MsgAtrDeleteRoomByServer extends $ProtoSchemaBase {
    private _s?: $Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer$S | null | undefined;

    public static fromJson(obj: MsgAtrDeleteRoomByServerJson): MsgAtrDeleteRoomByServer {
        return new MsgAtrDeleteRoomByServer().loadJson(obj);
    }
    public override loadJson(obj: MsgAtrDeleteRoomByServerJson): this {
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgAtrDeleteRoomByServerJson): MsgAtrDeleteRoomByServerJson {
        obj ??= ({} as MsgAtrDeleteRoomByServerJson);

        {
            const value = this.getS();
            (value != null) && (obj.s = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getS();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgAtrDeleteRoomByServer {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgAtrDeleteRoomByServer();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgAtrDeleteRoomByServer {
        return MsgAtrDeleteRoomByServer.decode(this.encode());
    }

    public override getSchemaName(): "MsgAtrDeleteRoomByServer" {
        return "MsgAtrDeleteRoomByServer";
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgAtrDeleteRoomByServer$S();
    }
}
