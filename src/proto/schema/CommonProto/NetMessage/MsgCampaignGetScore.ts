import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { S as $Message$CommonProto$NetMessage$MsgCampaignGetScore$S, type SJson as $Json$CommonProto$NetMessage$MsgCampaignGetScore$S } from "./MsgCampaignGetScore/S.js";

export interface MsgCampaignGetScoreJson extends $ProtoSchemaJsonBase {
    s?: $Json$CommonProto$NetMessage$MsgCampaignGetScore$S | null | undefined;
}

export class MsgCampaignGetScore extends $ProtoSchemaBase {
    private _s?: $Message$CommonProto$NetMessage$MsgCampaignGetScore$S | null | undefined;

    public static fromJson(obj: MsgCampaignGetScoreJson): MsgCampaignGetScore {
        return new MsgCampaignGetScore().loadJson(obj);
    }
    public override loadJson(obj: MsgCampaignGetScoreJson): this {
        this.setS(obj.s != null ? $Message$CommonProto$NetMessage$MsgCampaignGetScore$S.fromJson(obj.s) : null);
        return this;
    }
    public override toJson(obj?: MsgCampaignGetScoreJson): MsgCampaignGetScoreJson {
        obj ??= ({} as MsgCampaignGetScoreJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MsgCampaignGetScore {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MsgCampaignGetScore();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    msg.setS($Message$CommonProto$NetMessage$MsgCampaignGetScore$S.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MsgCampaignGetScore {
        return MsgCampaignGetScore.decode(this.encode());
    }

    public override getSchemaName(): "MsgCampaignGetScore" {
        return "MsgCampaignGetScore";
    }

    public checkHasS(): boolean {
        return this._s != null;
    }
    public getS(): $Message$CommonProto$NetMessage$MsgCampaignGetScore$S | null | undefined {
        return this._s;
    }
    public setS(value: $Message$CommonProto$NetMessage$MsgCampaignGetScore$S | null | undefined): void {
        this._s = value;
    }
    public createIfNotExistsS(): $Message$CommonProto$NetMessage$MsgCampaignGetScore$S {
        return this._s ??= new $Message$CommonProto$NetMessage$MsgCampaignGetScore$S();
    }
}
