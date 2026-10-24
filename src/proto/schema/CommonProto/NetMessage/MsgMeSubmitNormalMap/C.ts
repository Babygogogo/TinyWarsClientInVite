import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { MapRawData as $Message$CommonProto$Map$MapRawData, type MapRawDataJson as $Json$CommonProto$Map$MapRawData } from "../../Map/MapRawData.js";
import { GridMarkData as $Message$CommonProto$Structure$GridMarkData, type GridMarkDataJson as $Json$CommonProto$Structure$GridMarkData } from "../../Structure/GridMarkData.js";

export interface CJson extends $ProtoSchemaJsonBase {
    slotIndex?: number | null | undefined;
    mapRawData?: $Json$CommonProto$Map$MapRawData | null | undefined;
    needReview?: boolean | null | undefined;
    srcNormalMapIdForAddEvent?: number | null | undefined;
    gridMarkData?: $Json$CommonProto$Structure$GridMarkData | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _slotIndex?: number | null | undefined;
    private _mapRawData?: $Message$CommonProto$Map$MapRawData | null | undefined;
    private _needReview?: boolean | null | undefined;
    private _srcNormalMapIdForAddEvent?: number | null | undefined;
    private _gridMarkData?: $Message$CommonProto$Structure$GridMarkData | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setSlotIndex(obj.slotIndex);
        this.setMapRawData(obj.mapRawData != null ? $Message$CommonProto$Map$MapRawData.fromJson(obj.mapRawData) : null);
        this.setNeedReview(obj.needReview);
        this.setSrcNormalMapIdForAddEvent(obj.srcNormalMapIdForAddEvent);
        this.setGridMarkData(obj.gridMarkData != null ? $Message$CommonProto$Structure$GridMarkData.fromJson(obj.gridMarkData) : null);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getSlotIndex();
            (value != null) && (obj.slotIndex = value);
        }

        {
            const value = this.getMapRawData();
            (value != null) && (obj.mapRawData = value.toJson());
        }

        {
            const value = this.getNeedReview();
            (value != null) && (obj.needReview = value);
        }

        {
            const value = this.getSrcNormalMapIdForAddEvent();
            (value != null) && (obj.srcNormalMapIdForAddEvent = value);
        }

        {
            const value = this.getGridMarkData();
            (value != null) && (obj.gridMarkData = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSlotIndex();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getMapRawData();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getNeedReview();
            if (value != null) {
                writer.uint32(24).bool(value);
            }
        }

        {
            const value = this.getSrcNormalMapIdForAddEvent();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getGridMarkData();
            if (value != null) {
                value.toWriter(writer.uint32(42).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): C {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new C();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSlotIndex(reader.int32());
                    break;

                case 2:
                    msg.setMapRawData($Message$CommonProto$Map$MapRawData.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setNeedReview(reader.bool());
                    break;

                case 4:
                    msg.setSrcNormalMapIdForAddEvent(reader.int32());
                    break;

                case 5:
                    msg.setGridMarkData($Message$CommonProto$Structure$GridMarkData.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): C {
        return C.decode(this.encode());
    }

    public override getSchemaName(): "C" {
        return "C";
    }

    public checkHasSlotIndex(): boolean {
        return this._slotIndex != null;
    }
    public getSlotIndex(): number | null | undefined {
        return this._slotIndex;
    }
    public setSlotIndex(value: number | null | undefined): void {
        this._slotIndex = value;
    }

    public checkHasMapRawData(): boolean {
        return this._mapRawData != null;
    }
    public getMapRawData(): $Message$CommonProto$Map$MapRawData | null | undefined {
        return this._mapRawData;
    }
    public setMapRawData(value: $Message$CommonProto$Map$MapRawData | null | undefined): void {
        this._mapRawData = value;
    }
    public createIfNotExistsMapRawData(): $Message$CommonProto$Map$MapRawData {
        return this._mapRawData ??= new $Message$CommonProto$Map$MapRawData();
    }

    public checkHasNeedReview(): boolean {
        return this._needReview != null;
    }
    public getNeedReview(): boolean | null | undefined {
        return this._needReview;
    }
    public setNeedReview(value: boolean | null | undefined): void {
        this._needReview = value;
    }

    public checkHasSrcNormalMapIdForAddEvent(): boolean {
        return this._srcNormalMapIdForAddEvent != null;
    }
    public getSrcNormalMapIdForAddEvent(): number | null | undefined {
        return this._srcNormalMapIdForAddEvent;
    }
    public setSrcNormalMapIdForAddEvent(value: number | null | undefined): void {
        this._srcNormalMapIdForAddEvent = value;
    }

    public checkHasGridMarkData(): boolean {
        return this._gridMarkData != null;
    }
    public getGridMarkData(): $Message$CommonProto$Structure$GridMarkData | null | undefined {
        return this._gridMarkData;
    }
    public setGridMarkData(value: $Message$CommonProto$Structure$GridMarkData | null | undefined): void {
        this._gridMarkData = value;
    }
    public createIfNotExistsGridMarkData(): $Message$CommonProto$Structure$GridMarkData {
        return this._gridMarkData ??= new $Message$CommonProto$Structure$GridMarkData();
    }
}
