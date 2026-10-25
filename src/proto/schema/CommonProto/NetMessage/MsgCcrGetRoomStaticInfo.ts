import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$C, type CJson as $Json$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$C } from "./MsgCcrGetRoomStaticInfo/C.js";
import { S as $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$S, type SJson as $Json$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$S } from "./MsgCcrGetRoomStaticInfo/S.js";

export interface MsgCcrGetRoomStaticInfoJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$S | null | undefined;
}

export class MsgCcrGetRoomStaticInfo extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$S | null | undefined;

    public static fromJson(obj: MsgCcrGetRoomStaticInfoJson): MsgCcrGetRoomStaticInfo {
        return new MsgCcrGetRoomStaticInfo().loadJson(obj);
    }
    public override loadJson(obj: MsgCcrGetRoomStaticInfoJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgCcrGetRoomStaticInfoJson): MsgCcrGetRoomStaticInfoJson {
        obj ??= ({} as MsgCcrGetRoomStaticInfoJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgCcrGetRoomStaticInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgCcrGetRoomStaticInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgCcrGetRoomStaticInfo {
        return MsgCcrGetRoomStaticInfo.decode(this.encode());
    }

    public override getSchemaName(): "MsgCcrGetRoomStaticInfo" {
        return "MsgCcrGetRoomStaticInfo";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgCcrGetRoomStaticInfo$S();
    }
}
