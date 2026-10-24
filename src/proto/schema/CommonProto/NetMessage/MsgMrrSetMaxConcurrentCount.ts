import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$C, type CJson as $Json$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$C } from "./MsgMrrSetMaxConcurrentCount/C.js";
import { S as $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$S, type SJson as $Json$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$S } from "./MsgMrrSetMaxConcurrentCount/S.js";

export interface MsgMrrSetMaxConcurrentCountJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$S | null | undefined;
}

export class MsgMrrSetMaxConcurrentCount extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$S | null | undefined;

    public static fromJson(obj: MsgMrrSetMaxConcurrentCountJson): MsgMrrSetMaxConcurrentCount {
        return new MsgMrrSetMaxConcurrentCount().loadJson(obj);
    }
    public override loadJson(obj: MsgMrrSetMaxConcurrentCountJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgMrrSetMaxConcurrentCountJson): MsgMrrSetMaxConcurrentCountJson {
        obj ??= ({} as MsgMrrSetMaxConcurrentCountJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgMrrSetMaxConcurrentCount {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgMrrSetMaxConcurrentCount();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgMrrSetMaxConcurrentCount {
        return MsgMrrSetMaxConcurrentCount.decode(this.encode());
    }

    public override getSchemaName(): "MsgMrrSetMaxConcurrentCount" {
        return "MsgMrrSetMaxConcurrentCount";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgMrrSetMaxConcurrentCount$S();
    }
}
