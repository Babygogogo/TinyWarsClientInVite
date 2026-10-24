import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$C, type CJson as $Json$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$C } from "./MsgMpwWatchGetRequestedWarIdArray/C.js";
import { S as $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$S, type SJson as $Json$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$S } from "./MsgMpwWatchGetRequestedWarIdArray/S.js";

export interface MsgMpwWatchGetRequestedWarIdArrayJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$S | null | undefined;
}

export class MsgMpwWatchGetRequestedWarIdArray extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$S | null | undefined;

    public static fromJson(obj: MsgMpwWatchGetRequestedWarIdArrayJson): MsgMpwWatchGetRequestedWarIdArray {
        return new MsgMpwWatchGetRequestedWarIdArray().loadJson(obj);
    }
    public override loadJson(obj: MsgMpwWatchGetRequestedWarIdArrayJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgMpwWatchGetRequestedWarIdArrayJson): MsgMpwWatchGetRequestedWarIdArrayJson {
        obj ??= ({} as MsgMpwWatchGetRequestedWarIdArrayJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgMpwWatchGetRequestedWarIdArray {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgMpwWatchGetRequestedWarIdArray();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgMpwWatchGetRequestedWarIdArray {
        return MsgMpwWatchGetRequestedWarIdArray.decode(this.encode());
    }

    public override getSchemaName(): "MsgMpwWatchGetRequestedWarIdArray" {
        return "MsgMpwWatchGetRequestedWarIdArray";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgMpwWatchGetRequestedWarIdArray$S();
    }
}
