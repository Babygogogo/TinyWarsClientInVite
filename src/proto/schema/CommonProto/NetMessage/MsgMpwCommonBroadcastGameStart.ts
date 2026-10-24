import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { S as $Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart$S, type SJson as $Json$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart$S } from "./MsgMpwCommonBroadcastGameStart/S.js";

export interface MsgMpwCommonBroadcastGameStartJson extends $ProtoSchemaJsonBase {
    s?: $Json$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart$S | null | undefined;
}

export class MsgMpwCommonBroadcastGameStart extends $ProtoSchemaBase {
    private _s?: $Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart$S | null | undefined;

    public static fromJson(obj: MsgMpwCommonBroadcastGameStartJson): MsgMpwCommonBroadcastGameStart {
        return new MsgMpwCommonBroadcastGameStart().loadJson(obj);
    }
    public override loadJson(obj: MsgMpwCommonBroadcastGameStartJson): this {
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgMpwCommonBroadcastGameStartJson): MsgMpwCommonBroadcastGameStartJson {
        obj ??= ({} as MsgMpwCommonBroadcastGameStartJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgMpwCommonBroadcastGameStart {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgMpwCommonBroadcastGameStart();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgMpwCommonBroadcastGameStart {
        return MsgMpwCommonBroadcastGameStart.decode(this.encode());
    }

    public override getSchemaName(): "MsgMpwCommonBroadcastGameStart" {
        return "MsgMpwCommonBroadcastGameStart";
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgMpwCommonBroadcastGameStart$S();
    }
}
