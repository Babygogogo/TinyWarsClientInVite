import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgCcrAddDummy$C, type CJson as $Json$CommonProto$NetMessage$MsgCcrAddDummy$C } from "./MsgCcrAddDummy/C.js";
import { S as $Message$CommonProto$NetMessage$MsgCcrAddDummy$S, type SJson as $Json$CommonProto$NetMessage$MsgCcrAddDummy$S } from "./MsgCcrAddDummy/S.js";

export interface MsgCcrAddDummyJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgCcrAddDummy$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgCcrAddDummy$S | null | undefined;
}

export class MsgCcrAddDummy extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgCcrAddDummy$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgCcrAddDummy$S | null | undefined;

    public static fromJson(obj: MsgCcrAddDummyJson): MsgCcrAddDummy {
        return new MsgCcrAddDummy().loadJson(obj);
    }
    public override loadJson(obj: MsgCcrAddDummyJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgCcrAddDummy$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgCcrAddDummy$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgCcrAddDummyJson): MsgCcrAddDummyJson {
        obj ??= ({} as MsgCcrAddDummyJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgCcrAddDummy {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgCcrAddDummy();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgCcrAddDummy$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgCcrAddDummy$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgCcrAddDummy {
        return MsgCcrAddDummy.decode(this.encode());
    }

    public override getSchemaName(): "MsgCcrAddDummy" {
        return "MsgCcrAddDummy";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgCcrAddDummy$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgCcrAddDummy$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgCcrAddDummy$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgCcrAddDummy$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgCcrAddDummy$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgCcrAddDummy$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgCcrAddDummy$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgCcrAddDummy$S();
    }
}
