import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ExtraDataForSystemVoteForDraw as $Message$CommonProto$WarOperation$WoSystemVoteForDraw$ExtraDataForSystemVoteForDraw, type ExtraDataForSystemVoteForDrawJson as $Json$CommonProto$WarOperation$WoSystemVoteForDraw$ExtraDataForSystemVoteForDraw } from "./WoSystemVoteForDraw/ExtraDataForSystemVoteForDraw.js";

export interface WoSystemVoteForDrawJson extends $ProtoSchemaJsonBase {
    isAgree?: boolean | null | undefined;
    extraData?: $Json$CommonProto$WarOperation$WoSystemVoteForDraw$ExtraDataForSystemVoteForDraw | null | undefined;
    playerIndex?: number | null | undefined;
}

export class WoSystemVoteForDraw extends $ProtoSchemaBase {
    private _isAgree?: boolean | null | undefined;
    private _extraData?: $Message$CommonProto$WarOperation$WoSystemVoteForDraw$ExtraDataForSystemVoteForDraw | null | undefined;
    private _playerIndex?: number | null | undefined;

    public static fromJson(obj: WoSystemVoteForDrawJson): WoSystemVoteForDraw {
        return new WoSystemVoteForDraw().loadJson(obj);
    }
    public override loadJson(obj: WoSystemVoteForDrawJson): this {
        this.setIsAgree(obj.isAgree);
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoSystemVoteForDraw$ExtraDataForSystemVoteForDraw.fromJson(obj.extraData) : null);
        this.setPlayerIndex(obj.playerIndex);
        return this;
    }
    public override toJson(obj?: WoSystemVoteForDrawJson): WoSystemVoteForDrawJson {
        obj ??= ({} as WoSystemVoteForDrawJson);

        {
            const value = this.getIsAgree();
            (value != null) && (obj.isAgree = value);
        }

        {
            const value = this.getExtraData();
            (value != null) && (obj.extraData = value.toJson());
        }

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getIsAgree();
            if (value != null) {
                writer.uint32(8).bool(value);
            }
        }

        {
            const value = this.getExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getPlayerIndex();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoSystemVoteForDraw {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoSystemVoteForDraw();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setIsAgree(reader.bool());
                    break;

                case 2:
                    msg.setExtraData($Message$CommonProto$WarOperation$WoSystemVoteForDraw$ExtraDataForSystemVoteForDraw.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setPlayerIndex(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoSystemVoteForDraw {
        return WoSystemVoteForDraw.decode(this.encode());
    }

    public override getSchemaName(): "WoSystemVoteForDraw" {
        return "WoSystemVoteForDraw";
    }

    public checkHasIsAgree(): boolean {
        return this._isAgree != null;
    }
    public getIsAgree(): boolean | null | undefined {
        return this._isAgree;
    }
    public setIsAgree(value: boolean | null | undefined): void {
        this._isAgree = value;
    }

    public checkHasExtraData(): boolean {
        return this._extraData != null;
    }
    public getExtraData(): $Message$CommonProto$WarOperation$WoSystemVoteForDraw$ExtraDataForSystemVoteForDraw | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoSystemVoteForDraw$ExtraDataForSystemVoteForDraw | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoSystemVoteForDraw$ExtraDataForSystemVoteForDraw {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoSystemVoteForDraw$ExtraDataForSystemVoteForDraw();
    }

    public checkHasPlayerIndex(): boolean {
        return this._playerIndex != null;
    }
    public getPlayerIndex(): number | null | undefined {
        return this._playerIndex;
    }
    public setPlayerIndex(value: number | null | undefined): void {
        this._playerIndex = value;
    }
}
