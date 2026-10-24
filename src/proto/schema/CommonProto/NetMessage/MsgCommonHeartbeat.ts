import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgCommonHeartbeat$C, type CJson as $Json$CommonProto$NetMessage$MsgCommonHeartbeat$C } from "./MsgCommonHeartbeat/C.js";
import { S as $Message$CommonProto$NetMessage$MsgCommonHeartbeat$S, type SJson as $Json$CommonProto$NetMessage$MsgCommonHeartbeat$S } from "./MsgCommonHeartbeat/S.js";

export interface MsgCommonHeartbeatJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgCommonHeartbeat$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgCommonHeartbeat$S | null | undefined;
}

export class MsgCommonHeartbeat extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgCommonHeartbeat$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgCommonHeartbeat$S | null | undefined;

    public static fromJson(obj: MsgCommonHeartbeatJson): MsgCommonHeartbeat {
        return new MsgCommonHeartbeat().loadJson(obj);
    }
    public override loadJson(obj: MsgCommonHeartbeatJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgCommonHeartbeat$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgCommonHeartbeat$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgCommonHeartbeatJson): MsgCommonHeartbeatJson {
        obj ??= ({} as MsgCommonHeartbeatJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgCommonHeartbeat {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgCommonHeartbeat();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgCommonHeartbeat$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgCommonHeartbeat$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgCommonHeartbeat {
        return MsgCommonHeartbeat.decode(this.encode());
    }

    public override getSchemaName(): "MsgCommonHeartbeat" {
        return "MsgCommonHeartbeat";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgCommonHeartbeat$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgCommonHeartbeat$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgCommonHeartbeat$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgCommonHeartbeat$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgCommonHeartbeat$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgCommonHeartbeat$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgCommonHeartbeat$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgCommonHeartbeat$S();
    }
}
