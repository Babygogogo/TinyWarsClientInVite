import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { S as $Message$CommonProto$NetMessage$MsgCommonServerDisconnect$S, type SJson as $Json$CommonProto$NetMessage$MsgCommonServerDisconnect$S } from "./MsgCommonServerDisconnect/S.js";

export interface MsgCommonServerDisconnectJson extends $ProtoSchemaJsonBase {
    s?: $Json$CommonProto$NetMessage$MsgCommonServerDisconnect$S | null | undefined;
}

export class MsgCommonServerDisconnect extends $ProtoSchemaBase {
    private _s?: $Message$CommonProto$NetMessage$MsgCommonServerDisconnect$S | null | undefined;

    public static fromJson(obj: MsgCommonServerDisconnectJson): MsgCommonServerDisconnect {
        return new MsgCommonServerDisconnect().loadJson(obj);
    }
    public override loadJson(obj: MsgCommonServerDisconnectJson): this {
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgCommonServerDisconnect$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgCommonServerDisconnectJson): MsgCommonServerDisconnectJson {
        obj ??= ({} as MsgCommonServerDisconnectJson);

        {
            const value = this.getS();
            (value != null) && (obj.s = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getS();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgCommonServerDisconnect {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgCommonServerDisconnect();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgCommonServerDisconnect$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgCommonServerDisconnect {
        return MsgCommonServerDisconnect.decode(this.encode());
    }

    public override getSchemaName(): "MsgCommonServerDisconnect" {
        return "MsgCommonServerDisconnect";
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgCommonServerDisconnect$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgCommonServerDisconnect$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgCommonServerDisconnect$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgCommonServerDisconnect$S();
    }
}
