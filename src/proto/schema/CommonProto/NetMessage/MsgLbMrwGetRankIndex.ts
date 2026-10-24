import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex$C, type CJson as $Json$CommonProto$NetMessage$MsgLbMrwGetRankIndex$C } from "./MsgLbMrwGetRankIndex/C.js";
import { S as $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex$S, type SJson as $Json$CommonProto$NetMessage$MsgLbMrwGetRankIndex$S } from "./MsgLbMrwGetRankIndex/S.js";

export interface MsgLbMrwGetRankIndexJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgLbMrwGetRankIndex$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgLbMrwGetRankIndex$S | null | undefined;
}

export class MsgLbMrwGetRankIndex extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex$S | null | undefined;

    public static fromJson(obj: MsgLbMrwGetRankIndexJson): MsgLbMrwGetRankIndex {
        return new MsgLbMrwGetRankIndex().loadJson(obj);
    }
    public override loadJson(obj: MsgLbMrwGetRankIndexJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgLbMrwGetRankIndexJson): MsgLbMrwGetRankIndexJson {
        obj ??= ({} as MsgLbMrwGetRankIndexJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgLbMrwGetRankIndex {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgLbMrwGetRankIndex();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgLbMrwGetRankIndex {
        return MsgLbMrwGetRankIndex.decode(this.encode());
    }

    public override getSchemaName(): "MsgLbMrwGetRankIndex" {
        return "MsgLbMrwGetRankIndex";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgLbMrwGetRankIndex$S();
    }
}
