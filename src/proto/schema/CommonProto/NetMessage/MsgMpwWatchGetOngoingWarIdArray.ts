import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$C, type CJson as $Json$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$C } from "./MsgMpwWatchGetOngoingWarIdArray/C.js";
import { S as $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$S, type SJson as $Json$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$S } from "./MsgMpwWatchGetOngoingWarIdArray/S.js";

export interface MsgMpwWatchGetOngoingWarIdArrayJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$S | null | undefined;
}

export class MsgMpwWatchGetOngoingWarIdArray extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$S | null | undefined;

    public static fromJson(obj: MsgMpwWatchGetOngoingWarIdArrayJson): MsgMpwWatchGetOngoingWarIdArray {
        return new MsgMpwWatchGetOngoingWarIdArray().loadJson(obj);
    }
    public override loadJson(obj: MsgMpwWatchGetOngoingWarIdArrayJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgMpwWatchGetOngoingWarIdArrayJson): MsgMpwWatchGetOngoingWarIdArrayJson {
        obj ??= ({} as MsgMpwWatchGetOngoingWarIdArrayJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgMpwWatchGetOngoingWarIdArray {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgMpwWatchGetOngoingWarIdArray();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgMpwWatchGetOngoingWarIdArray {
        return MsgMpwWatchGetOngoingWarIdArray.decode(this.encode());
    }

    public override getSchemaName(): "MsgMpwWatchGetOngoingWarIdArray" {
        return "MsgMpwWatchGetOngoingWarIdArray";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgMpwWatchGetOngoingWarIdArray$S();
    }
}
