import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { MapWarStatistics as $Message$CommonProto$Map$MapWarStatistics, type MapWarStatisticsJson as $Json$CommonProto$Map$MapWarStatistics } from "./MapWarStatistics.js";

export interface NormalMapExtraDataJson extends $ProtoSchemaJsonBase {
    normalMapId?: number | null | undefined;
    isEnabled?: boolean | null | undefined;
    totalRating?: number | null | undefined;
    totalRaters?: number | null | undefined;
    mapWarStatistics?: $Json$CommonProto$Map$MapWarStatistics | null | undefined;
}

export class NormalMapExtraData extends $ProtoSchemaBase {
    private _normalMapId?: number | null | undefined;
    private _isEnabled?: boolean | null | undefined;
    private _totalRating?: number | null | undefined;
    private _totalRaters?: number | null | undefined;
    private _mapWarStatistics?: $Message$CommonProto$Map$MapWarStatistics | null | undefined;

    public static fromJson(obj: NormalMapExtraDataJson): NormalMapExtraData {
        return new NormalMapExtraData().loadJson(obj);
    }
    public override loadJson(obj: NormalMapExtraDataJson): this {
        this.setNormalMapId(obj.normalMapId);
        this.setIsEnabled(obj.isEnabled);
        this.setTotalRating(obj.totalRating);
        this.setTotalRaters(obj.totalRaters);
        this.setMapWarStatistics(obj.mapWarStatistics != null ? $Message$CommonProto$Map$MapWarStatistics.fromJson(obj.mapWarStatistics) : null);
        return this;
    }
    public override toJson(obj?: NormalMapExtraDataJson): NormalMapExtraDataJson {
        obj ??= ({} as NormalMapExtraDataJson);

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getIsEnabled();
            (value != null) && (obj.isEnabled = value);
        }

        {
            const value = this.getTotalRating();
            (value != null) && (obj.totalRating = value);
        }

        {
            const value = this.getTotalRaters();
            (value != null) && (obj.totalRaters = value);
        }

        {
            const value = this.getMapWarStatistics();
            (value != null) && (obj.mapWarStatistics = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNormalMapId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getIsEnabled();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getTotalRating();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getTotalRaters();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getMapWarStatistics();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): NormalMapExtraData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new NormalMapExtraData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 2:
                    msg.setIsEnabled(reader.bool());
                    break;

                case 3:
                    msg.setTotalRating(reader.int32());
                    break;

                case 4:
                    msg.setTotalRaters(reader.int32());
                    break;

                case 10:
                    msg.setMapWarStatistics($Message$CommonProto$Map$MapWarStatistics.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): NormalMapExtraData {
        return NormalMapExtraData.decode(this.encode());
    }

    public override getSchemaName(): "NormalMapExtraData" {
        return "NormalMapExtraData";
    }

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number {
        return this._normalMapId ?? 0;
    }
    public setNormalMapId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._normalMapId = null;
        } else {
            this._normalMapId = value;
        }
    }

    public checkHasIsEnabled(): boolean {
        return this._isEnabled != null;
    }
    public getIsEnabled(): boolean {
        return this._isEnabled ?? false;
    }
    public setIsEnabled(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isEnabled = null;
        } else {
            this._isEnabled = value;
        }
    }

    public checkHasTotalRating(): boolean {
        return this._totalRating != null;
    }
    public getTotalRating(): number {
        return this._totalRating ?? 0;
    }
    public setTotalRating(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._totalRating = null;
        } else {
            this._totalRating = value;
        }
    }

    public checkHasTotalRaters(): boolean {
        return this._totalRaters != null;
    }
    public getTotalRaters(): number {
        return this._totalRaters ?? 0;
    }
    public setTotalRaters(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._totalRaters = null;
        } else {
            this._totalRaters = value;
        }
    }

    public checkHasMapWarStatistics(): boolean {
        return this._mapWarStatistics != null;
    }
    public getMapWarStatistics(): $Message$CommonProto$Map$MapWarStatistics | null | undefined {
        return this._mapWarStatistics;
    }
    public setMapWarStatistics(value: $Message$CommonProto$Map$MapWarStatistics | null | undefined): void {
        this._mapWarStatistics = value;
    }
    public createIfNotExistsMapWarStatistics(): $Message$CommonProto$Map$MapWarStatistics {
        return this._mapWarStatistics ??= new $Message$CommonProto$Map$MapWarStatistics();
    }
}
