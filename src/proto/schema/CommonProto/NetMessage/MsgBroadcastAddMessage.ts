import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgBroadcastAddMessage$C, type CJson as $Json$CommonProto$NetMessage$MsgBroadcastAddMessage$C } from "./MsgBroadcastAddMessage/C.js";
import { S as $Message$CommonProto$NetMessage$MsgBroadcastAddMessage$S, type SJson as $Json$CommonProto$NetMessage$MsgBroadcastAddMessage$S } from "./MsgBroadcastAddMessage/S.js";

export interface MsgBroadcastAddMessageJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgBroadcastAddMessage$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgBroadcastAddMessage$S | null | undefined;
}

export class MsgBroadcastAddMessage extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgBroadcastAddMessage$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgBroadcastAddMessage$S | null | undefined;

    public static fromJson(obj: MsgBroadcastAddMessageJson): MsgBroadcastAddMessage {
        return new MsgBroadcastAddMessage().loadJson(obj);
    }
    public override loadJson(obj: MsgBroadcastAddMessageJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgBroadcastAddMessage$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgBroadcastAddMessage$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgBroadcastAddMessageJson): MsgBroadcastAddMessageJson {
        obj ??= ({} as MsgBroadcastAddMessageJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgBroadcastAddMessage {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgBroadcastAddMessage();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgBroadcastAddMessage$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgBroadcastAddMessage$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgBroadcastAddMessage {
        return MsgBroadcastAddMessage.decode(this.encode());
    }

    public override getSchemaName(): "MsgBroadcastAddMessage" {
        return "MsgBroadcastAddMessage";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgBroadcastAddMessage$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgBroadcastAddMessage$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgBroadcastAddMessage$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgBroadcastAddMessage$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgBroadcastAddMessage$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgBroadcastAddMessage$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgBroadcastAddMessage$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgBroadcastAddMessage$S();
    }
}
