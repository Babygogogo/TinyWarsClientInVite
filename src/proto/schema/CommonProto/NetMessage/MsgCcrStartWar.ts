import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgCcrStartWar$C, type CJson as $Json$CommonProto$NetMessage$MsgCcrStartWar$C } from "./MsgCcrStartWar/C.js";
import { S as $Message$CommonProto$NetMessage$MsgCcrStartWar$S, type SJson as $Json$CommonProto$NetMessage$MsgCcrStartWar$S } from "./MsgCcrStartWar/S.js";

export interface MsgCcrStartWarJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgCcrStartWar$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgCcrStartWar$S | null | undefined;
}

export class MsgCcrStartWar extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgCcrStartWar$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgCcrStartWar$S | null | undefined;

    public static fromJson(obj: MsgCcrStartWarJson): MsgCcrStartWar {
        return new MsgCcrStartWar().loadJson(obj);
    }
    public override loadJson(obj: MsgCcrStartWarJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgCcrStartWar$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgCcrStartWar$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgCcrStartWarJson): MsgCcrStartWarJson {
        obj ??= ({} as MsgCcrStartWarJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgCcrStartWar {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgCcrStartWar();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgCcrStartWar$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgCcrStartWar$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgCcrStartWar {
        return MsgCcrStartWar.decode(this.encode());
    }

    public override getSchemaName(): "MsgCcrStartWar" {
        return "MsgCcrStartWar";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgCcrStartWar$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgCcrStartWar$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgCcrStartWar$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgCcrStartWar$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgCcrStartWar$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgCcrStartWar$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgCcrStartWar$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgCcrStartWar$S();
    }
}
