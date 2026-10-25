import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$C, type CJson as $Json$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$C } from "./MsgLbSpmOverallGetRankInfo/C.js";
import { S as $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$S, type SJson as $Json$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$S } from "./MsgLbSpmOverallGetRankInfo/S.js";

export interface MsgLbSpmOverallGetRankInfoJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$S | null | undefined;
}

export class MsgLbSpmOverallGetRankInfo extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$S | null | undefined;

    public static fromJson(obj: MsgLbSpmOverallGetRankInfoJson): MsgLbSpmOverallGetRankInfo {
        return new MsgLbSpmOverallGetRankInfo().loadJson(obj);
    }
    public override loadJson(obj: MsgLbSpmOverallGetRankInfoJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgLbSpmOverallGetRankInfoJson): MsgLbSpmOverallGetRankInfoJson {
        obj ??= ({} as MsgLbSpmOverallGetRankInfoJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgLbSpmOverallGetRankInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgLbSpmOverallGetRankInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgLbSpmOverallGetRankInfo {
        return MsgLbSpmOverallGetRankInfo.decode(this.encode());
    }

    public override getSchemaName(): "MsgLbSpmOverallGetRankInfo" {
        return "MsgLbSpmOverallGetRankInfo";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgLbSpmOverallGetRankInfo$S();
    }
}
