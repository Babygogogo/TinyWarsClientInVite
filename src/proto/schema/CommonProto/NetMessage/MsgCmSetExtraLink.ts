import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgCmSetExtraLink$C, type CJson as $Json$CommonProto$NetMessage$MsgCmSetExtraLink$C } from "./MsgCmSetExtraLink/C.js";
import { S as $Message$CommonProto$NetMessage$MsgCmSetExtraLink$S, type SJson as $Json$CommonProto$NetMessage$MsgCmSetExtraLink$S } from "./MsgCmSetExtraLink/S.js";

export interface MsgCmSetExtraLinkJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgCmSetExtraLink$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgCmSetExtraLink$S | null | undefined;
}

export class MsgCmSetExtraLink extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgCmSetExtraLink$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgCmSetExtraLink$S | null | undefined;

    public static fromJson(obj: MsgCmSetExtraLinkJson): MsgCmSetExtraLink {
        return new MsgCmSetExtraLink().loadJson(obj);
    }
    public override loadJson(obj: MsgCmSetExtraLinkJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgCmSetExtraLink$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgCmSetExtraLink$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgCmSetExtraLinkJson): MsgCmSetExtraLinkJson {
        obj ??= ({} as MsgCmSetExtraLinkJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgCmSetExtraLink {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgCmSetExtraLink();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgCmSetExtraLink$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgCmSetExtraLink$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgCmSetExtraLink {
        return MsgCmSetExtraLink.decode(this.encode());
    }

    public override getSchemaName(): "MsgCmSetExtraLink" {
        return "MsgCmSetExtraLink";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgCmSetExtraLink$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgCmSetExtraLink$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgCmSetExtraLink$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgCmSetExtraLink$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgCmSetExtraLink$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgCmSetExtraLink$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgCmSetExtraLink$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgCmSetExtraLink$S();
    }
}
