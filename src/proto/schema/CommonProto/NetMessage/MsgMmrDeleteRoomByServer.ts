import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { S as $Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer$S, type SJson as $Json$CommonProto$NetMessage$MsgMmrDeleteRoomByServer$S } from "./MsgMmrDeleteRoomByServer/S.js";

export interface MsgMmrDeleteRoomByServerJson extends $ProtoSchemaJsonBase {
    s?: $Json$CommonProto$NetMessage$MsgMmrDeleteRoomByServer$S | null | undefined;
}

export class MsgMmrDeleteRoomByServer extends $ProtoSchemaBase {
    private _s?: $Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer$S | null | undefined;

    public static fromJson(obj: MsgMmrDeleteRoomByServerJson): MsgMmrDeleteRoomByServer {
        return new MsgMmrDeleteRoomByServer().loadJson(obj);
    }
    public override loadJson(obj: MsgMmrDeleteRoomByServerJson): this {
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgMmrDeleteRoomByServerJson): MsgMmrDeleteRoomByServerJson {
        obj ??= ({} as MsgMmrDeleteRoomByServerJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgMmrDeleteRoomByServer {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgMmrDeleteRoomByServer();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgMmrDeleteRoomByServer {
        return MsgMmrDeleteRoomByServer.decode(this.encode());
    }

    public override getSchemaName(): "MsgMmrDeleteRoomByServer" {
        return "MsgMmrDeleteRoomByServer";
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgMmrDeleteRoomByServer$S();
    }
}
