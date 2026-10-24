import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$C, type CJson as $Json$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$C } from "./MsgMmrGetBannedNormalMapIdArray/C.js";
import { S as $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$S, type SJson as $Json$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$S } from "./MsgMmrGetBannedNormalMapIdArray/S.js";

export interface MsgMmrGetBannedNormalMapIdArrayJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$S | null | undefined;
}

export class MsgMmrGetBannedNormalMapIdArray extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$S | null | undefined;

    public static fromJson(obj: MsgMmrGetBannedNormalMapIdArrayJson): MsgMmrGetBannedNormalMapIdArray {
        return new MsgMmrGetBannedNormalMapIdArray().loadJson(obj);
    }
    public override loadJson(obj: MsgMmrGetBannedNormalMapIdArrayJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgMmrGetBannedNormalMapIdArrayJson): MsgMmrGetBannedNormalMapIdArrayJson {
        obj ??= ({} as MsgMmrGetBannedNormalMapIdArrayJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgMmrGetBannedNormalMapIdArray {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgMmrGetBannedNormalMapIdArray();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgMmrGetBannedNormalMapIdArray {
        return MsgMmrGetBannedNormalMapIdArray.decode(this.encode());
    }

    public override getSchemaName(): "MsgMmrGetBannedNormalMapIdArray" {
        return "MsgMmrGetBannedNormalMapIdArray";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgMmrGetBannedNormalMapIdArray$S();
    }
}
