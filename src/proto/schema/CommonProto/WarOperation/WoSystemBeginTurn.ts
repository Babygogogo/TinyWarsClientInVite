import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ExtraDataForSystemBeginTurn as $Message$CommonProto$WarOperation$WoSystemBeginTurn$ExtraDataForSystemBeginTurn, type ExtraDataForSystemBeginTurnJson as $Json$CommonProto$WarOperation$WoSystemBeginTurn$ExtraDataForSystemBeginTurn } from "./WoSystemBeginTurn/ExtraDataForSystemBeginTurn.js";

export interface WoSystemBeginTurnJson extends $ProtoSchemaJsonBase {
    extraData?: $Json$CommonProto$WarOperation$WoSystemBeginTurn$ExtraDataForSystemBeginTurn | null | undefined;
}

export class WoSystemBeginTurn extends $ProtoSchemaBase {
    private _extraData?: $Message$CommonProto$WarOperation$WoSystemBeginTurn$ExtraDataForSystemBeginTurn | null | undefined;

    public static fromJson(obj: WoSystemBeginTurnJson): WoSystemBeginTurn {
        return new WoSystemBeginTurn().loadJson(obj);
    }
    public override loadJson(obj: WoSystemBeginTurnJson): this {
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoSystemBeginTurn$ExtraDataForSystemBeginTurn.fromJson(obj.extraData) : null);
        return this;
    }
    public override toJson(obj?: WoSystemBeginTurnJson): WoSystemBeginTurnJson {
        obj ??= ({} as WoSystemBeginTurnJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoSystemBeginTurn {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoSystemBeginTurn();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setExtraData($Message$CommonProto$WarOperation$WoSystemBeginTurn$ExtraDataForSystemBeginTurn.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoSystemBeginTurn {
        return WoSystemBeginTurn.decode(this.encode());
    }

    public override getSchemaName(): "WoSystemBeginTurn" {
        return "WoSystemBeginTurn";
    }

    public checkHasExtraData(): boolean {
        return this._extraData != null;
    }
    public getExtraData(): $Message$CommonProto$WarOperation$WoSystemBeginTurn$ExtraDataForSystemBeginTurn | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoSystemBeginTurn$ExtraDataForSystemBeginTurn | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoSystemBeginTurn$ExtraDataForSystemBeginTurn {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoSystemBeginTurn$ExtraDataForSystemBeginTurn();
    }
}
