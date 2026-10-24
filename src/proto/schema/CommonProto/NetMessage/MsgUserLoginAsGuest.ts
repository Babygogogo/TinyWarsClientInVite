import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgUserLoginAsGuest$C, type CJson as $Json$CommonProto$NetMessage$MsgUserLoginAsGuest$C } from "./MsgUserLoginAsGuest/C.js";
import { S as $Message$CommonProto$NetMessage$MsgUserLoginAsGuest$S, type SJson as $Json$CommonProto$NetMessage$MsgUserLoginAsGuest$S } from "./MsgUserLoginAsGuest/S.js";

export interface MsgUserLoginAsGuestJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgUserLoginAsGuest$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgUserLoginAsGuest$S | null | undefined;
}

export class MsgUserLoginAsGuest extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgUserLoginAsGuest$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgUserLoginAsGuest$S | null | undefined;

    public static fromJson(obj: MsgUserLoginAsGuestJson): MsgUserLoginAsGuest {
        return new MsgUserLoginAsGuest().loadJson(obj);
    }
    public override loadJson(obj: MsgUserLoginAsGuestJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgUserLoginAsGuest$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgUserLoginAsGuest$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgUserLoginAsGuestJson): MsgUserLoginAsGuestJson {
        obj ??= ({} as MsgUserLoginAsGuestJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgUserLoginAsGuest {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgUserLoginAsGuest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgUserLoginAsGuest$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgUserLoginAsGuest$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgUserLoginAsGuest {
        return MsgUserLoginAsGuest.decode(this.encode());
    }

    public override getSchemaName(): "MsgUserLoginAsGuest" {
        return "MsgUserLoginAsGuest";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgUserLoginAsGuest$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgUserLoginAsGuest$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgUserLoginAsGuest$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgUserLoginAsGuest$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgUserLoginAsGuest$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgUserLoginAsGuest$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgUserLoginAsGuest$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgUserLoginAsGuest$S();
    }
}
