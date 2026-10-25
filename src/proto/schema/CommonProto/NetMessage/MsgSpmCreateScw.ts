import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgSpmCreateScw$C, type CJson as $Json$CommonProto$NetMessage$MsgSpmCreateScw$C } from "./MsgSpmCreateScw/C.js";
import { S as $Message$CommonProto$NetMessage$MsgSpmCreateScw$S, type SJson as $Json$CommonProto$NetMessage$MsgSpmCreateScw$S } from "./MsgSpmCreateScw/S.js";

export interface MsgSpmCreateScwJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgSpmCreateScw$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgSpmCreateScw$S | null | undefined;
}

export class MsgSpmCreateScw extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgSpmCreateScw$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgSpmCreateScw$S | null | undefined;

    public static fromJson(obj: MsgSpmCreateScwJson): MsgSpmCreateScw {
        return new MsgSpmCreateScw().loadJson(obj);
    }
    public override loadJson(obj: MsgSpmCreateScwJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgSpmCreateScw$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgSpmCreateScw$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgSpmCreateScwJson): MsgSpmCreateScwJson {
        obj ??= ({} as MsgSpmCreateScwJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgSpmCreateScw {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgSpmCreateScw();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgSpmCreateScw$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgSpmCreateScw$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgSpmCreateScw {
        return MsgSpmCreateScw.decode(this.encode());
    }

    public override getSchemaName(): "MsgSpmCreateScw" {
        return "MsgSpmCreateScw";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgSpmCreateScw$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgSpmCreateScw$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgSpmCreateScw$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgSpmCreateScw$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgSpmCreateScw$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgSpmCreateScw$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgSpmCreateScw$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgSpmCreateScw$S();
    }
}
