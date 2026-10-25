import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ExtraDataForPlayerEndTurn as $Message$CommonProto$WarOperation$WoPlayerEndTurn$ExtraDataForPlayerEndTurn, type ExtraDataForPlayerEndTurnJson as $Json$CommonProto$WarOperation$WoPlayerEndTurn$ExtraDataForPlayerEndTurn } from "./WoPlayerEndTurn/ExtraDataForPlayerEndTurn.js";

export interface WoPlayerEndTurnJson extends $ProtoSchemaJsonBase {
    extraData?: $Json$CommonProto$WarOperation$WoPlayerEndTurn$ExtraDataForPlayerEndTurn | null | undefined;
}

export class WoPlayerEndTurn extends $ProtoSchemaBase {
    private _extraData?: $Message$CommonProto$WarOperation$WoPlayerEndTurn$ExtraDataForPlayerEndTurn | null | undefined;

    public static fromJson(obj: WoPlayerEndTurnJson): WoPlayerEndTurn {
        return new WoPlayerEndTurn().loadJson(obj);
    }
    public override loadJson(obj: WoPlayerEndTurnJson): this {
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoPlayerEndTurn$ExtraDataForPlayerEndTurn.fromJson(obj.extraData) : null);
        return this;
    }
    public override toJson(obj?: WoPlayerEndTurnJson): WoPlayerEndTurnJson {
        obj ??= ({} as WoPlayerEndTurnJson);

        {
            const value = this.getExtraData();
            (value != null) && (obj.extraData = value.toJson());
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

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoPlayerEndTurn {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoPlayerEndTurn();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setExtraData($Message$CommonProto$WarOperation$WoPlayerEndTurn$ExtraDataForPlayerEndTurn.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoPlayerEndTurn {
        return WoPlayerEndTurn.decode(this.encode());
    }

    public override getSchemaName(): "WoPlayerEndTurn" {
        return "WoPlayerEndTurn";
    }

    public checkHasExtraData(): boolean {
        return this._extraData != null;
    }
    public getExtraData(): $Message$CommonProto$WarOperation$WoPlayerEndTurn$ExtraDataForPlayerEndTurn | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoPlayerEndTurn$ExtraDataForPlayerEndTurn | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoPlayerEndTurn$ExtraDataForPlayerEndTurn {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoPlayerEndTurn$ExtraDataForPlayerEndTurn();
    }
}
