import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { S as $Message$CommonProto$NetMessage$MsgMailGetMail$S, type SJson as $Json$CommonProto$NetMessage$MsgMailGetMail$S } from "./MsgMailGetMail/S.js";

export interface MsgMailGetMailJson extends $ProtoSchemaJsonBase {
    s?: $Json$CommonProto$NetMessage$MsgMailGetMail$S | null | undefined;
}

export class MsgMailGetMail extends $ProtoSchemaBase {
    private _s?: $Message$CommonProto$NetMessage$MsgMailGetMail$S | null | undefined;

    public static fromJson(obj: MsgMailGetMailJson): MsgMailGetMail {
        return new MsgMailGetMail().loadJson(obj);
    }
    public override loadJson(obj: MsgMailGetMailJson): this {
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgMailGetMail$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgMailGetMailJson): MsgMailGetMailJson {
        obj ??= ({} as MsgMailGetMailJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgMailGetMail {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgMailGetMail();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgMailGetMail$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgMailGetMail {
        return MsgMailGetMail.decode(this.encode());
    }

    public override getSchemaName(): "MsgMailGetMail" {
        return "MsgMailGetMail";
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgMailGetMail$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgMailGetMail$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgMailGetMail$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgMailGetMail$S();
    }
}
