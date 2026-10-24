import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ExtraDataForSystemHandleBootPlayer as $Message$CommonProto$WarOperation$WoSystemHandleBootPlayer$ExtraDataForSystemHandleBootPlayer, type ExtraDataForSystemHandleBootPlayerJson as $Json$CommonProto$WarOperation$WoSystemHandleBootPlayer$ExtraDataForSystemHandleBootPlayer } from "./WoSystemHandleBootPlayer/ExtraDataForSystemHandleBootPlayer.js";

export interface WoSystemHandleBootPlayerJson extends $ProtoSchemaJsonBase {
    extraData?: $Json$CommonProto$WarOperation$WoSystemHandleBootPlayer$ExtraDataForSystemHandleBootPlayer | null | undefined;
}

export class WoSystemHandleBootPlayer extends $ProtoSchemaBase {
    private _extraData?: $Message$CommonProto$WarOperation$WoSystemHandleBootPlayer$ExtraDataForSystemHandleBootPlayer | null | undefined;

    public static fromJson(obj: WoSystemHandleBootPlayerJson): WoSystemHandleBootPlayer {
        return new WoSystemHandleBootPlayer().loadJson(obj);
    }
    public override loadJson(obj: WoSystemHandleBootPlayerJson): this {
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoSystemHandleBootPlayer$ExtraDataForSystemHandleBootPlayer.fromJson(obj.extraData) : null);
        return this;
    }
    public override toJson(obj?: WoSystemHandleBootPlayerJson): WoSystemHandleBootPlayerJson {
        obj ??= ({} as WoSystemHandleBootPlayerJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoSystemHandleBootPlayer {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoSystemHandleBootPlayer();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setExtraData($Message$CommonProto$WarOperation$WoSystemHandleBootPlayer$ExtraDataForSystemHandleBootPlayer.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoSystemHandleBootPlayer {
        return WoSystemHandleBootPlayer.decode(this.encode());
    }

    public override getSchemaName(): "WoSystemHandleBootPlayer" {
        return "WoSystemHandleBootPlayer";
    }

    public checkHasExtraData(): boolean {
        return this._extraData != null;
    }
    public getExtraData(): $Message$CommonProto$WarOperation$WoSystemHandleBootPlayer$ExtraDataForSystemHandleBootPlayer | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoSystemHandleBootPlayer$ExtraDataForSystemHandleBootPlayer | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoSystemHandleBootPlayer$ExtraDataForSystemHandleBootPlayer {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoSystemHandleBootPlayer$ExtraDataForSystemHandleBootPlayer();
    }
}
