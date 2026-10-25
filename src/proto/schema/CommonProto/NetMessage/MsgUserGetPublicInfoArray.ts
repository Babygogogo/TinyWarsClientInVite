import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray$C, type CJson as $Json$CommonProto$NetMessage$MsgUserGetPublicInfoArray$C } from "./MsgUserGetPublicInfoArray/C.js";
import { S as $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray$S, type SJson as $Json$CommonProto$NetMessage$MsgUserGetPublicInfoArray$S } from "./MsgUserGetPublicInfoArray/S.js";

export interface MsgUserGetPublicInfoArrayJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgUserGetPublicInfoArray$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgUserGetPublicInfoArray$S | null | undefined;
}

export class MsgUserGetPublicInfoArray extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray$S | null | undefined;

    public static fromJson(obj: MsgUserGetPublicInfoArrayJson): MsgUserGetPublicInfoArray {
        return new MsgUserGetPublicInfoArray().loadJson(obj);
    }
    public override loadJson(obj: MsgUserGetPublicInfoArrayJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgUserGetPublicInfoArrayJson): MsgUserGetPublicInfoArrayJson {
        obj ??= ({} as MsgUserGetPublicInfoArrayJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgUserGetPublicInfoArray {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgUserGetPublicInfoArray();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgUserGetPublicInfoArray {
        return MsgUserGetPublicInfoArray.decode(this.encode());
    }

    public override getSchemaName(): "MsgUserGetPublicInfoArray" {
        return "MsgUserGetPublicInfoArray";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgUserGetPublicInfoArray$S();
    }
}
