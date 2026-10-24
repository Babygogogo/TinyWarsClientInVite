import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar$C, type CJson as $Json$CommonProto$NetMessage$MsgMpwCommonSyncWar$C } from "./MsgMpwCommonSyncWar/C.js";
import { S as $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar$S, type SJson as $Json$CommonProto$NetMessage$MsgMpwCommonSyncWar$S } from "./MsgMpwCommonSyncWar/S.js";

export interface MsgMpwCommonSyncWarJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgMpwCommonSyncWar$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgMpwCommonSyncWar$S | null | undefined;
}

export class MsgMpwCommonSyncWar extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar$S | null | undefined;

    public static fromJson(obj: MsgMpwCommonSyncWarJson): MsgMpwCommonSyncWar {
        return new MsgMpwCommonSyncWar().loadJson(obj);
    }
    public override loadJson(obj: MsgMpwCommonSyncWarJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgMpwCommonSyncWarJson): MsgMpwCommonSyncWarJson {
        obj ??= ({} as MsgMpwCommonSyncWarJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgMpwCommonSyncWar {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgMpwCommonSyncWar();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgMpwCommonSyncWar$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgMpwCommonSyncWar$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgMpwCommonSyncWar {
        return MsgMpwCommonSyncWar.decode(this.encode());
    }

    public override getSchemaName(): "MsgMpwCommonSyncWar" {
        return "MsgMpwCommonSyncWar";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgMpwCommonSyncWar$S();
    }
}
