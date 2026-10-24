import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$C, type CJson as $Json$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$C } from "./MsgMmAddIgnoredReviewingMap/C.js";
import { S as $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$S, type SJson as $Json$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$S } from "./MsgMmAddIgnoredReviewingMap/S.js";

export interface MsgMmAddIgnoredReviewingMapJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$S | null | undefined;
}

export class MsgMmAddIgnoredReviewingMap extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$S | null | undefined;

    public static fromJson(obj: MsgMmAddIgnoredReviewingMapJson): MsgMmAddIgnoredReviewingMap {
        return new MsgMmAddIgnoredReviewingMap().loadJson(obj);
    }
    public override loadJson(obj: MsgMmAddIgnoredReviewingMapJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgMmAddIgnoredReviewingMapJson): MsgMmAddIgnoredReviewingMapJson {
        obj ??= ({} as MsgMmAddIgnoredReviewingMapJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgMmAddIgnoredReviewingMap {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgMmAddIgnoredReviewingMap();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgMmAddIgnoredReviewingMap {
        return MsgMmAddIgnoredReviewingMap.decode(this.encode());
    }

    public override getSchemaName(): "MsgMmAddIgnoredReviewingMap" {
        return "MsgMmAddIgnoredReviewingMap";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgMmAddIgnoredReviewingMap$S();
    }
}
