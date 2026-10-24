import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgUserGetOnlineState$C, type CJson as $Json$CommonProto$NetMessage$MsgUserGetOnlineState$C } from "./MsgUserGetOnlineState/C.js";
import { S as $Message$CommonProto$NetMessage$MsgUserGetOnlineState$S, type SJson as $Json$CommonProto$NetMessage$MsgUserGetOnlineState$S } from "./MsgUserGetOnlineState/S.js";

export interface MsgUserGetOnlineStateJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgUserGetOnlineState$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgUserGetOnlineState$S | null | undefined;
}

export class MsgUserGetOnlineState extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgUserGetOnlineState$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgUserGetOnlineState$S | null | undefined;

    public static fromJson(obj: MsgUserGetOnlineStateJson): MsgUserGetOnlineState {
        return new MsgUserGetOnlineState().loadJson(obj);
    }
    public override loadJson(obj: MsgUserGetOnlineStateJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgUserGetOnlineState$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgUserGetOnlineState$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgUserGetOnlineStateJson): MsgUserGetOnlineStateJson {
        obj ??= ({} as MsgUserGetOnlineStateJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgUserGetOnlineState {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgUserGetOnlineState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgUserGetOnlineState$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgUserGetOnlineState$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgUserGetOnlineState {
        return MsgUserGetOnlineState.decode(this.encode());
    }

    public override getSchemaName(): "MsgUserGetOnlineState" {
        return "MsgUserGetOnlineState";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgUserGetOnlineState$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgUserGetOnlineState$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgUserGetOnlineState$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgUserGetOnlineState$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgUserGetOnlineState$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgUserGetOnlineState$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgUserGetOnlineState$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgUserGetOnlineState$S();
    }
}
