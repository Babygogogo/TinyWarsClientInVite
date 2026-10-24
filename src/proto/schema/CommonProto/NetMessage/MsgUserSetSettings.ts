import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { C as $Message$CommonProto$NetMessage$MsgUserSetSettings$C, type CJson as $Json$CommonProto$NetMessage$MsgUserSetSettings$C } from "./MsgUserSetSettings/C.js";
import { S as $Message$CommonProto$NetMessage$MsgUserSetSettings$S, type SJson as $Json$CommonProto$NetMessage$MsgUserSetSettings$S } from "./MsgUserSetSettings/S.js";

export interface MsgUserSetSettingsJson extends $ProtoSchemaJsonBase {
    c?: $Json$CommonProto$NetMessage$MsgUserSetSettings$C | null | undefined;
    s?: $Json$CommonProto$NetMessage$MsgUserSetSettings$S | null | undefined;
}

export class MsgUserSetSettings extends $ProtoSchemaBase {
    private _c?: $Message$CommonProto$NetMessage$MsgUserSetSettings$C | null | undefined;
    private _s?: $Message$CommonProto$NetMessage$MsgUserSetSettings$S | null | undefined;

    public static fromJson(obj: MsgUserSetSettingsJson): MsgUserSetSettings {
        return new MsgUserSetSettings().loadJson(obj);
    }
    public override loadJson(obj: MsgUserSetSettingsJson): this {
        this.setC(obj.c != null ? $Message$CommonProto$NetMessage$MsgUserSetSettings$C.fromJson(obj.c) : null);
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgUserSetSettings$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgUserSetSettingsJson): MsgUserSetSettingsJson {
        obj ??= ({} as MsgUserSetSettingsJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgUserSetSettings {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgUserSetSettings();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setC($Message$CommonProto$NetMessage$MsgUserSetSettings$C.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgUserSetSettings$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgUserSetSettings {
        return MsgUserSetSettings.decode(this.encode());
    }

    public override getSchemaName(): "MsgUserSetSettings" {
        return "MsgUserSetSettings";
    }

    public checkHasC(): boolean {
        return this._c != null;
    }
    public getC(): $Message$CommonProto$NetMessage$MsgUserSetSettings$C | null | undefined {
        return this._c;
    }
    public setC(value: $Message$CommonProto$NetMessage$MsgUserSetSettings$C | null | undefined): void {
        this._c = value;
    }
    public createIfNotExistsC(): $Message$CommonProto$NetMessage$MsgUserSetSettings$C {
        return this._c ??= new $Message$CommonProto$NetMessage$MsgUserSetSettings$C();
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgUserSetSettings$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgUserSetSettings$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgUserSetSettings$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgUserSetSettings$S();
    }
}
