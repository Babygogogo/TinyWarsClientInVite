import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ExtraDataForSystemEndWar as $Message$CommonProto$WarOperation$WoSystemEndWar$ExtraDataForSystemEndWar, type ExtraDataForSystemEndWarJson as $Json$CommonProto$WarOperation$WoSystemEndWar$ExtraDataForSystemEndWar } from "./WoSystemEndWar/ExtraDataForSystemEndWar.js";

export interface WoSystemEndWarJson extends $ProtoSchemaJsonBase {
    extraData?: $Json$CommonProto$WarOperation$WoSystemEndWar$ExtraDataForSystemEndWar | null | undefined;
}

export class WoSystemEndWar extends $ProtoSchemaBase {
    private _extraData?: $Message$CommonProto$WarOperation$WoSystemEndWar$ExtraDataForSystemEndWar | null | undefined;

    public static fromJson(obj: WoSystemEndWarJson): WoSystemEndWar {
        return new WoSystemEndWar().loadJson(obj);
    }
    public override loadJson(obj: WoSystemEndWarJson): this {
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoSystemEndWar$ExtraDataForSystemEndWar.fromJson(obj.extraData) : null);
        return this;
    }
    public override toJson(obj?: WoSystemEndWarJson): WoSystemEndWarJson {
        obj ??= ({} as WoSystemEndWarJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoSystemEndWar {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoSystemEndWar();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setExtraData($Message$CommonProto$WarOperation$WoSystemEndWar$ExtraDataForSystemEndWar.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoSystemEndWar {
        return WoSystemEndWar.decode(this.encode());
    }

    public override getSchemaName(): "WoSystemEndWar" {
        return "WoSystemEndWar";
    }

    public checkHasExtraData(): boolean {
        return this._extraData != null;
    }
    public getExtraData(): $Message$CommonProto$WarOperation$WoSystemEndWar$ExtraDataForSystemEndWar | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoSystemEndWar$ExtraDataForSystemEndWar | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoSystemEndWar$ExtraDataForSystemEndWar {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoSystemEndWar$ExtraDataForSystemEndWar();
    }
}
