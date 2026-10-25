import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgCcrExitRoom$C, type CJson as $Json$CommonProto$NetMessage$MsgCcrExitRoom$C } from "./MsgCcrExitRoom/C.js";
import { S as $Message$CommonProto$NetMessage$MsgCcrExitRoom$S, type SJson as $Json$CommonProto$NetMessage$MsgCcrExitRoom$S } from "./MsgCcrExitRoom/S.js";

export interface MsgCcrExitRoomJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgCcrExitRoom$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgCcrExitRoom$S | null | undefined;
}

export class MsgCcrExitRoom extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgCcrExitRoom$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgCcrExitRoom$S | null | undefined;

    public static fromJson(obj: MsgCcrExitRoomJson): MsgCcrExitRoom {
        return new MsgCcrExitRoom().loadJson(obj);
    }
    public override loadJson(obj: MsgCcrExitRoomJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgCcrExitRoom$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgCcrExitRoom$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgCcrExitRoomJson): MsgCcrExitRoomJson {
        obj ??= ({} as MsgCcrExitRoomJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgCcrExitRoom {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgCcrExitRoom();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgCcrExitRoom$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgCcrExitRoom$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgCcrExitRoom {
        return MsgCcrExitRoom.decode(this.encode());
    }

    public override getSchemaName(): "MsgCcrExitRoom" {
        return "MsgCcrExitRoom";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgCcrExitRoom$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgCcrExitRoom$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgCcrExitRoom$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgCcrExitRoom$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgCcrExitRoom$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgCcrExitRoom$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgCcrExitRoom$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgCcrExitRoom$S();
    }
}
