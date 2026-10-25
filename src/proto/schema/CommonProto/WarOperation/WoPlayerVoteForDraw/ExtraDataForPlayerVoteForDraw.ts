import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { CommonExtraDataForWarOperation as $Message$CommonProto$Structure$CommonExtraDataForWarOperation, type CommonExtraDataForWarOperationJson as $Json$CommonProto$Structure$CommonExtraDataForWarOperation } from "../../Structure/CommonExtraDataForWarOperation.js";

export interface ExtraDataForPlayerVoteForDrawJson extends $ProtoSchemaJsonBase {
    commonExtraData?: $Json$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined;
    isAgree?: boolean | null | undefined;
    playerIndex?: number | null | undefined;
}

export class ExtraDataForPlayerVoteForDraw extends $ProtoSchemaBase {
    private _commonExtraData?: $Message$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined;
    private _isAgree?: boolean | null | undefined;
    private _playerIndex?: number | null | undefined;

    public static fromJson(obj: ExtraDataForPlayerVoteForDrawJson): ExtraDataForPlayerVoteForDraw {
        return new ExtraDataForPlayerVoteForDraw().loadJson(obj);
    }
    public override loadJson(obj: ExtraDataForPlayerVoteForDrawJson): this {
        this.setCommonExtraData(obj.commonExtraData != null ? $Message$CommonProto$Structure$CommonExtraDataForWarOperation.fromJson(obj.commonExtraData) : null);
        this.setIsAgree(obj.isAgree);
        this.setPlayerIndex(obj.playerIndex);
        return this;
    }
    public override toJson(obj?: ExtraDataForPlayerVoteForDrawJson): ExtraDataForPlayerVoteForDrawJson {
        obj ??= ({} as ExtraDataForPlayerVoteForDrawJson);

        {
            const value = this.getCommonExtraData();
            (value != null) && (obj.commonExtraData = value.toJson());
        }

        {
            const value = this.getIsAgree();
            (value != null) && (obj.isAgree = value);
        }

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCommonExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getIsAgree();
            if (value != null) {
                writer.uint32(16).bool(value);
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ExtraDataForPlayerVoteForDraw {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ExtraDataForPlayerVoteForDraw();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCommonExtraData($Message$CommonProto$Structure$CommonExtraDataForWarOperation.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setIsAgree(reader.bool());
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

    public override clone(): ExtraDataForPlayerVoteForDraw {
        return ExtraDataForPlayerVoteForDraw.decode(this.encode());
    }

    public override getSchemaName(): "ExtraDataForPlayerVoteForDraw" {
        return "ExtraDataForPlayerVoteForDraw";
    }

    public checkHasCommonExtraData(): boolean {
        return this._commonExtraData != null;
    }
    public getCommonExtraData(): $Message$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined {
        return this._commonExtraData;
    }
    public setCommonExtraData(value: $Message$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined): void {
        this._commonExtraData = value;
    }
    public createIfNotExistsCommonExtraData(): $Message$CommonProto$Structure$CommonExtraDataForWarOperation {
        return this._commonExtraData ??= new $Message$CommonProto$Structure$CommonExtraDataForWarOperation();
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
