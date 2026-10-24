import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$C, type CJson as $Json$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$C } from "./MsgNormalMapGetAllEnabledBriefDataVersions/C.js";
import { S as $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$S, type SJson as $Json$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$S } from "./MsgNormalMapGetAllEnabledBriefDataVersions/S.js";

export interface MsgNormalMapGetAllEnabledBriefDataVersionsJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$S | null | undefined;
}

export class MsgNormalMapGetAllEnabledBriefDataVersions extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$S | null | undefined;

    public static fromJson(obj: MsgNormalMapGetAllEnabledBriefDataVersionsJson): MsgNormalMapGetAllEnabledBriefDataVersions {
        return new MsgNormalMapGetAllEnabledBriefDataVersions().loadJson(obj);
    }
    public override loadJson(obj: MsgNormalMapGetAllEnabledBriefDataVersionsJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgNormalMapGetAllEnabledBriefDataVersionsJson): MsgNormalMapGetAllEnabledBriefDataVersionsJson {
        obj ??= ({} as MsgNormalMapGetAllEnabledBriefDataVersionsJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgNormalMapGetAllEnabledBriefDataVersions {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgNormalMapGetAllEnabledBriefDataVersions();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgNormalMapGetAllEnabledBriefDataVersions {
        return MsgNormalMapGetAllEnabledBriefDataVersions.decode(this.encode());
    }

    public override getSchemaName(): "MsgNormalMapGetAllEnabledBriefDataVersions" {
        return "MsgNormalMapGetAllEnabledBriefDataVersions";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgNormalMapGetAllEnabledBriefDataVersions$S();
    }
}
