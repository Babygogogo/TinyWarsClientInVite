import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom$C, type CJson as $Json$CommonProto$NetMessage$MsgGmDeleteMmrRoom$C } from "./MsgGmDeleteMmrRoom/C.js";
import { S as $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom$S, type SJson as $Json$CommonProto$NetMessage$MsgGmDeleteMmrRoom$S } from "./MsgGmDeleteMmrRoom/S.js";

export interface MsgGmDeleteMmrRoomJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgGmDeleteMmrRoom$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgGmDeleteMmrRoom$S | null | undefined;
}

export class MsgGmDeleteMmrRoom extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom$S | null | undefined;

    public static fromJson(obj: MsgGmDeleteMmrRoomJson): MsgGmDeleteMmrRoom {
        return new MsgGmDeleteMmrRoom().loadJson(obj);
    }
    public override loadJson(obj: MsgGmDeleteMmrRoomJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgGmDeleteMmrRoomJson): MsgGmDeleteMmrRoomJson {
        obj ??= ({} as MsgGmDeleteMmrRoomJson);

        {
            const value = this.getC();
            (value != null) && (obj.c = value.toJson());
        }

        {
            const value = this.getS();
            (value != null) && (obj.s = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getC();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getS();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgGmDeleteMmrRoom {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgGmDeleteMmrRoom();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgGmDeleteMmrRoom {
        return MsgGmDeleteMmrRoom.decode(this.encode());
    }

    public override getSchemaName(): "MsgGmDeleteMmrRoom" {
        return "MsgGmDeleteMmrRoom";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgGmDeleteMmrRoom$S();
    }
}
