import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { S as $Message$CommonProto$NetMessage$MsgMailGetAllMailArray$S, type SJson as $Json$CommonProto$NetMessage$MsgMailGetAllMailArray$S } from "./MsgMailGetAllMailArray/S.js";

export interface MsgMailGetAllMailArrayJson extends $ProtoSchemaJsonBase {
    s?: $Json$CommonProto$NetMessage$MsgMailGetAllMailArray$S | null | undefined;
}

export class MsgMailGetAllMailArray extends $ProtoSchemaBase {
    private _s?: $Message$CommonProto$NetMessage$MsgMailGetAllMailArray$S | null | undefined;

    public static fromJson(obj: MsgMailGetAllMailArrayJson): MsgMailGetAllMailArray {
        return new MsgMailGetAllMailArray().loadJson(obj);
    }
    public override loadJson(obj: MsgMailGetAllMailArrayJson): this {
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgMailGetAllMailArray$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgMailGetAllMailArrayJson): MsgMailGetAllMailArrayJson {
        obj ??= ({} as MsgMailGetAllMailArrayJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgMailGetAllMailArray {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgMailGetAllMailArray();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgMailGetAllMailArray$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgMailGetAllMailArray {
        return MsgMailGetAllMailArray.decode(this.encode());
    }

    public override getSchemaName(): "MsgMailGetAllMailArray" {
        return "MsgMailGetAllMailArray";
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgMailGetAllMailArray$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgMailGetAllMailArray$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgMailGetAllMailArray$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgMailGetAllMailArray$S();
    }
}
