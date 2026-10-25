import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ExtraDataForPlayerSurrender as $Message$CommonProto$WarOperation$WoPlayerSurrender$ExtraDataForPlayerSurrender, type ExtraDataForPlayerSurrenderJson as $Json$CommonProto$WarOperation$WoPlayerSurrender$ExtraDataForPlayerSurrender } from "./WoPlayerSurrender/ExtraDataForPlayerSurrender.js";

export interface WoPlayerSurrenderJson extends $ProtoSchemaJsonBase {
    extraData?: $Json$CommonProto$WarOperation$WoPlayerSurrender$ExtraDataForPlayerSurrender | null | undefined;
    playerIndex?: number | null | undefined;
}

export class WoPlayerSurrender extends $ProtoSchemaBase {
    private _extraData?: $Message$CommonProto$WarOperation$WoPlayerSurrender$ExtraDataForPlayerSurrender | null | undefined;
    private _playerIndex?: number | null | undefined;

    public static fromJson(obj: WoPlayerSurrenderJson): WoPlayerSurrender {
        return new WoPlayerSurrender().loadJson(obj);
    }
    public override loadJson(obj: WoPlayerSurrenderJson): this {
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoPlayerSurrender$ExtraDataForPlayerSurrender.fromJson(obj.extraData) : null);
        this.setPlayerIndex(obj.playerIndex);
        return this;
    }
    public override toJson(obj?: WoPlayerSurrenderJson): WoPlayerSurrenderJson {
        obj ??= ({} as WoPlayerSurrenderJson);

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
            const value = this.getExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getPlayerIndex();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoPlayerSurrender {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoPlayerSurrender();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setExtraData($Message$CommonProto$WarOperation$WoPlayerSurrender$ExtraDataForPlayerSurrender.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setPlayerIndex(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoPlayerSurrender {
        return WoPlayerSurrender.decode(this.encode());
    }

    public override getSchemaName(): "WoPlayerSurrender" {
        return "WoPlayerSurrender";
    }

    public checkHasExtraData(): boolean {
        return this._extraData != null;
    }
    public getExtraData(): $Message$CommonProto$WarOperation$WoPlayerSurrender$ExtraDataForPlayerSurrender | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoPlayerSurrender$ExtraDataForPlayerSurrender | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoPlayerSurrender$ExtraDataForPlayerSurrender {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoPlayerSurrender$ExtraDataForPlayerSurrender();
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
