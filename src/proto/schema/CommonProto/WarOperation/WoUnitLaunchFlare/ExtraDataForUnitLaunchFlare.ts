import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { CommonExtraDataForWarOperation as $Message$CommonProto$Structure$CommonExtraDataForWarOperation, type CommonExtraDataForWarOperationJson as $Json$CommonProto$Structure$CommonExtraDataForWarOperation } from "../../Structure/CommonExtraDataForWarOperation.js";
import { GridIndex as $Message$CommonProto$Structure$GridIndex, type GridIndexJson as $Json$CommonProto$Structure$GridIndex } from "../../Structure/GridIndex.js";

export interface ExtraDataForUnitLaunchFlareJson extends $ProtoSchemaJsonBase {
    commonExtraData?: $Json$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined;
    targetGridIndex?: $Json$CommonProto$Structure$GridIndex | null | undefined;
    flareRadius?: number | null | undefined;
}

export class ExtraDataForUnitLaunchFlare extends $ProtoSchemaBase {
    private _commonExtraData?: $Message$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined;
    private _targetGridIndex?: $Message$CommonProto$Structure$GridIndex | null | undefined;
    private _flareRadius?: number | null | undefined;

    public static fromJson(obj: ExtraDataForUnitLaunchFlareJson): ExtraDataForUnitLaunchFlare {
        return new ExtraDataForUnitLaunchFlare().loadJson(obj);
    }
    public override loadJson(obj: ExtraDataForUnitLaunchFlareJson): this {
        this.setCommonExtraData(obj.commonExtraData != null ? $Message$CommonProto$Structure$CommonExtraDataForWarOperation.fromJson(obj.commonExtraData) : null);
        this.setTargetGridIndex(obj.targetGridIndex != null ? $Message$CommonProto$Structure$GridIndex.fromJson(obj.targetGridIndex) : null);
        this.setFlareRadius(obj.flareRadius);
        return this;
    }
    public override toJson(obj?: ExtraDataForUnitLaunchFlareJson): ExtraDataForUnitLaunchFlareJson {
        obj ??= ({} as ExtraDataForUnitLaunchFlareJson);

        {
            const value = this.getCommonExtraData();
            (value != null) && (obj.commonExtraData = value.toJson());
        }

        {
            const value = this.getTargetGridIndex();
            (value != null) && (obj.targetGridIndex = value.toJson());
        }

        {
            const value = this.getFlareRadius();
            (value != null) && (obj.flareRadius = value);
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
            const value = this.getTargetGridIndex();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getFlareRadius();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ExtraDataForUnitLaunchFlare {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ExtraDataForUnitLaunchFlare();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCommonExtraData($Message$CommonProto$Structure$CommonExtraDataForWarOperation.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setTargetGridIndex($Message$CommonProto$Structure$GridIndex.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setFlareRadius(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ExtraDataForUnitLaunchFlare {
        return ExtraDataForUnitLaunchFlare.decode(this.encode());
    }

    public override getSchemaName(): "ExtraDataForUnitLaunchFlare" {
        return "ExtraDataForUnitLaunchFlare";
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

    public checkHasTargetGridIndex(): boolean {
        return this._targetGridIndex != null;
    }
    public getTargetGridIndex(): $Message$CommonProto$Structure$GridIndex | null | undefined {
        return this._targetGridIndex;
    }
    public setTargetGridIndex(value: $Message$CommonProto$Structure$GridIndex | null | undefined): void {
        this._targetGridIndex = value;
    }
    public createIfNotExistsTargetGridIndex(): $Message$CommonProto$Structure$GridIndex {
        return this._targetGridIndex ??= new $Message$CommonProto$Structure$GridIndex();
    }

    public checkHasFlareRadius(): boolean {
        return this._flareRadius != null;
    }
    public getFlareRadius(): number | null | undefined {
        return this._flareRadius;
    }
    public setFlareRadius(value: number | null | undefined): void {
        this._flareRadius = value;
    }
}
