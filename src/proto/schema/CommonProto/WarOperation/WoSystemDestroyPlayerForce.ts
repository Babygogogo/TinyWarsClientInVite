import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ExtraDataForSystemDestroyPlayerForce as $Message$CommonProto$WarOperation$WoSystemDestroyPlayerForce$ExtraDataForSystemDestroyPlayerForce, type ExtraDataForSystemDestroyPlayerForceJson as $Json$CommonProto$WarOperation$WoSystemDestroyPlayerForce$ExtraDataForSystemDestroyPlayerForce } from "./WoSystemDestroyPlayerForce/ExtraDataForSystemDestroyPlayerForce.js";

export interface WoSystemDestroyPlayerForceJson extends $ProtoSchemaJsonBase {
    targetPlayerIndex?: number | null | undefined;
    extraData?: $Json$CommonProto$WarOperation$WoSystemDestroyPlayerForce$ExtraDataForSystemDestroyPlayerForce | null | undefined;
}

export class WoSystemDestroyPlayerForce extends $ProtoSchemaBase {
    private _targetPlayerIndex?: number | null | undefined;
    private _extraData?: $Message$CommonProto$WarOperation$WoSystemDestroyPlayerForce$ExtraDataForSystemDestroyPlayerForce | null | undefined;

    public static fromJson(obj: WoSystemDestroyPlayerForceJson): WoSystemDestroyPlayerForce {
        return new WoSystemDestroyPlayerForce().loadJson(obj);
    }
    public override loadJson(obj: WoSystemDestroyPlayerForceJson): this {
        this.setTargetPlayerIndex(obj.targetPlayerIndex);
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoSystemDestroyPlayerForce$ExtraDataForSystemDestroyPlayerForce.fromJson(obj.extraData) : null);
        return this;
    }
    public override toJson(obj?: WoSystemDestroyPlayerForceJson): WoSystemDestroyPlayerForceJson {
        obj ??= ({} as WoSystemDestroyPlayerForceJson);

        {
            const value = this.getTargetPlayerIndex();
            (value != null) && (obj.targetPlayerIndex = value);
        }

        {
            const value = this.getExtraData();
            (value != null) && (obj.extraData = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTargetPlayerIndex();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoSystemDestroyPlayerForce {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoSystemDestroyPlayerForce();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTargetPlayerIndex(reader.int32());
                    break;

                case 2:
                    msg.setExtraData($Message$CommonProto$WarOperation$WoSystemDestroyPlayerForce$ExtraDataForSystemDestroyPlayerForce.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoSystemDestroyPlayerForce {
        return WoSystemDestroyPlayerForce.decode(this.encode());
    }

    public override getSchemaName(): "WoSystemDestroyPlayerForce" {
        return "WoSystemDestroyPlayerForce";
    }

    public checkHasTargetPlayerIndex(): boolean {
        return this._targetPlayerIndex != null;
    }
    public getTargetPlayerIndex(): number | null | undefined {
        return this._targetPlayerIndex;
    }
    public setTargetPlayerIndex(value: number | null | undefined): void {
        this._targetPlayerIndex = value;
    }

    public checkHasExtraData(): boolean {
        return this._extraData != null;
    }
    public getExtraData(): $Message$CommonProto$WarOperation$WoSystemDestroyPlayerForce$ExtraDataForSystemDestroyPlayerForce | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoSystemDestroyPlayerForce$ExtraDataForSystemDestroyPlayerForce | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoSystemDestroyPlayerForce$ExtraDataForSystemDestroyPlayerForce {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoSystemDestroyPlayerForce$ExtraDataForSystemDestroyPlayerForce();
    }
}
