import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$C, type CJson as $Json$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$C } from "./MsgMrrSetBannedCoIdArray/C.js";
import { S as $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$S, type SJson as $Json$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$S } from "./MsgMrrSetBannedCoIdArray/S.js";

export interface MsgMrrSetBannedCoIdArrayJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$S | null | undefined;
}

export class MsgMrrSetBannedCoIdArray extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$S | null | undefined;

    public static fromJson(obj: MsgMrrSetBannedCoIdArrayJson): MsgMrrSetBannedCoIdArray {
        return new MsgMrrSetBannedCoIdArray().loadJson(obj);
    }
    public override loadJson(obj: MsgMrrSetBannedCoIdArrayJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgMrrSetBannedCoIdArrayJson): MsgMrrSetBannedCoIdArrayJson {
        obj ??= ({} as MsgMrrSetBannedCoIdArrayJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgMrrSetBannedCoIdArray {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgMrrSetBannedCoIdArray();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgMrrSetBannedCoIdArray {
        return MsgMrrSetBannedCoIdArray.decode(this.encode());
    }

    public override getSchemaName(): "MsgMrrSetBannedCoIdArray" {
        return "MsgMrrSetBannedCoIdArray";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgMrrSetBannedCoIdArray$S();
    }
}
