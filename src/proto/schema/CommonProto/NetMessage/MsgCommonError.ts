import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { S as $Message$CommonProto$NetMessage$MsgCommonError$S, type SJson as $Json$CommonProto$NetMessage$MsgCommonError$S } from "./MsgCommonError/S.js";

export interface MsgCommonErrorJson extends $ProtoSchemaJsonBase {
    s?: $Json$CommonProto$NetMessage$MsgCommonError$S | null | undefined;
}

export class MsgCommonError extends $ProtoSchemaBase {
    private _s?: $Message$CommonProto$NetMessage$MsgCommonError$S | null | undefined;

    public static fromJson(obj: MsgCommonErrorJson): MsgCommonError {
        return new MsgCommonError().loadJson(obj);
    }
    public override loadJson(obj: MsgCommonErrorJson): this {
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgCommonError$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgCommonErrorJson): MsgCommonErrorJson {
        obj ??= ({} as MsgCommonErrorJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgCommonError {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgCommonError();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgCommonError$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgCommonError {
        return MsgCommonError.decode(this.encode());
    }

    public override getSchemaName(): "MsgCommonError" {
        return "MsgCommonError";
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgCommonError$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgCommonError$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgCommonError$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgCommonError$S();
    }
}
