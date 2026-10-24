import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { S as $Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer$S, type SJson as $Json$CommonProto$NetMessage$MsgMrrDeleteRoomByServer$S } from "./MsgMrrDeleteRoomByServer/S.js";

export interface MsgMrrDeleteRoomByServerJson extends $ProtoSchemaJsonBase {
    s?: $Json$CommonProto$NetMessage$MsgMrrDeleteRoomByServer$S | null | undefined;
}

export class MsgMrrDeleteRoomByServer extends $ProtoSchemaBase {
    private _s?: $Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer$S | null | undefined;

    public static fromJson(obj: MsgMrrDeleteRoomByServerJson): MsgMrrDeleteRoomByServer {
        return new MsgMrrDeleteRoomByServer().loadJson(obj);
    }
    public override loadJson(obj: MsgMrrDeleteRoomByServerJson): this {
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgMrrDeleteRoomByServerJson): MsgMrrDeleteRoomByServerJson {
        obj ??= ({} as MsgMrrDeleteRoomByServerJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgMrrDeleteRoomByServer {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgMrrDeleteRoomByServer();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgMrrDeleteRoomByServer {
        return MsgMrrDeleteRoomByServer.decode(this.encode());
    }

    public override getSchemaName(): "MsgMrrDeleteRoomByServer" {
        return "MsgMrrDeleteRoomByServer";
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgMrrDeleteRoomByServer$S();
    }
}
