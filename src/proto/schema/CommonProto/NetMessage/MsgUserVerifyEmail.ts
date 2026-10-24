import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgUserVerifyEmail$C, type CJson as $Json$CommonProto$NetMessage$MsgUserVerifyEmail$C } from "./MsgUserVerifyEmail/C.js";
import { S as $Message$CommonProto$NetMessage$MsgUserVerifyEmail$S, type SJson as $Json$CommonProto$NetMessage$MsgUserVerifyEmail$S } from "./MsgUserVerifyEmail/S.js";

export interface MsgUserVerifyEmailJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgUserVerifyEmail$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgUserVerifyEmail$S | null | undefined;
}

export class MsgUserVerifyEmail extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgUserVerifyEmail$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgUserVerifyEmail$S | null | undefined;

    public static fromJson(obj: MsgUserVerifyEmailJson): MsgUserVerifyEmail {
        return new MsgUserVerifyEmail().loadJson(obj);
    }
    public override loadJson(obj: MsgUserVerifyEmailJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgUserVerifyEmail$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgUserVerifyEmail$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgUserVerifyEmailJson): MsgUserVerifyEmailJson {
        obj ??= ({} as MsgUserVerifyEmailJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgUserVerifyEmail {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgUserVerifyEmail();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgUserVerifyEmail$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgUserVerifyEmail$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgUserVerifyEmail {
        return MsgUserVerifyEmail.decode(this.encode());
    }

    public override getSchemaName(): "MsgUserVerifyEmail" {
        return "MsgUserVerifyEmail";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgUserVerifyEmail$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgUserVerifyEmail$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgUserVerifyEmail$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgUserVerifyEmail$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgUserVerifyEmail$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgUserVerifyEmail$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgUserVerifyEmail$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgUserVerifyEmail$S();
    }
}
