import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ExtraDataForSystemEndTurn as $Message$CommonProto$WarOperation$WoSystemEndTurn$ExtraDataForSystemEndTurn, type ExtraDataForSystemEndTurnJson as $Json$CommonProto$WarOperation$WoSystemEndTurn$ExtraDataForSystemEndTurn } from "./WoSystemEndTurn/ExtraDataForSystemEndTurn.js";

export interface WoSystemEndTurnJson extends $ProtoSchemaJsonBase {
    extraData?: $Json$CommonProto$WarOperation$WoSystemEndTurn$ExtraDataForSystemEndTurn | null | undefined;
}

export class WoSystemEndTurn extends $ProtoSchemaBase {
    private _extraData?: $Message$CommonProto$WarOperation$WoSystemEndTurn$ExtraDataForSystemEndTurn | null | undefined;

    public static fromJson(obj: WoSystemEndTurnJson): WoSystemEndTurn {
        return new WoSystemEndTurn().loadJson(obj);
    }
    public override loadJson(obj: WoSystemEndTurnJson): this {
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoSystemEndTurn$ExtraDataForSystemEndTurn.fromJson(obj.extraData) : null);
        return this;
    }
    public override toJson(obj?: WoSystemEndTurnJson): WoSystemEndTurnJson {
        obj ??= ({} as WoSystemEndTurnJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoSystemEndTurn {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoSystemEndTurn();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setExtraData($Message$CommonProto$WarOperation$WoSystemEndTurn$ExtraDataForSystemEndTurn.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoSystemEndTurn {
        return WoSystemEndTurn.decode(this.encode());
    }

    public override getSchemaName(): "WoSystemEndTurn" {
        return "WoSystemEndTurn";
    }

    public checkHasExtraData(): boolean {
        return this._extraData != null;
    }
    public getExtraData(): $Message$CommonProto$WarOperation$WoSystemEndTurn$ExtraDataForSystemEndTurn | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoSystemEndTurn$ExtraDataForSystemEndTurn | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoSystemEndTurn$ExtraDataForSystemEndTurn {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoSystemEndTurn$ExtraDataForSystemEndTurn();
    }
}
