import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$C, type CJson as $Json$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$C } from "./MsgMpwCommonGetJoinedMpwIdArray/C.js";
import { S as $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$S, type SJson as $Json$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$S } from "./MsgMpwCommonGetJoinedMpwIdArray/S.js";

export interface MsgMpwCommonGetJoinedMpwIdArrayJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$S | null | undefined;
}

export class MsgMpwCommonGetJoinedMpwIdArray extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$S | null | undefined;

    public static fromJson(obj: MsgMpwCommonGetJoinedMpwIdArrayJson): MsgMpwCommonGetJoinedMpwIdArray {
        return new MsgMpwCommonGetJoinedMpwIdArray().loadJson(obj);
    }
    public override loadJson(obj: MsgMpwCommonGetJoinedMpwIdArrayJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgMpwCommonGetJoinedMpwIdArrayJson): MsgMpwCommonGetJoinedMpwIdArrayJson {
        obj ??= ({} as MsgMpwCommonGetJoinedMpwIdArrayJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgMpwCommonGetJoinedMpwIdArray {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgMpwCommonGetJoinedMpwIdArray();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgMpwCommonGetJoinedMpwIdArray {
        return MsgMpwCommonGetJoinedMpwIdArray.decode(this.encode());
    }

    public override getSchemaName(): "MsgMpwCommonGetJoinedMpwIdArray" {
        return "MsgMpwCommonGetJoinedMpwIdArray";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgMpwCommonGetJoinedMpwIdArray$S();
    }
}
