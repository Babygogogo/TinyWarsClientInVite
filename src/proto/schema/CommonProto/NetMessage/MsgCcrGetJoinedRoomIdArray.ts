import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$C, type CJson as $Json$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$C } from "./MsgCcrGetJoinedRoomIdArray/C.js";
import { S as $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$S, type SJson as $Json$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$S } from "./MsgCcrGetJoinedRoomIdArray/S.js";

export interface MsgCcrGetJoinedRoomIdArrayJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$S | null | undefined;
}

export class MsgCcrGetJoinedRoomIdArray extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$S | null | undefined;

    public static fromJson(obj: MsgCcrGetJoinedRoomIdArrayJson): MsgCcrGetJoinedRoomIdArray {
        return new MsgCcrGetJoinedRoomIdArray().loadJson(obj);
    }
    public override loadJson(obj: MsgCcrGetJoinedRoomIdArrayJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgCcrGetJoinedRoomIdArrayJson): MsgCcrGetJoinedRoomIdArrayJson {
        obj ??= ({} as MsgCcrGetJoinedRoomIdArrayJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgCcrGetJoinedRoomIdArray {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgCcrGetJoinedRoomIdArray();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgCcrGetJoinedRoomIdArray {
        return MsgCcrGetJoinedRoomIdArray.decode(this.encode());
    }

    public override getSchemaName(): "MsgCcrGetJoinedRoomIdArray" {
        return "MsgCcrGetJoinedRoomIdArray";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgCcrGetJoinedRoomIdArray$S();
    }
}
