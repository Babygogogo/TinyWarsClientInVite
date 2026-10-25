import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridMarkData as $Message$CommonProto$Structure$GridMarkData, type GridMarkDataJson as $Json$CommonProto$Structure$GridMarkData } from "../Structure/GridMarkData.js";

export interface MapEditorDataJson extends $ProtoSchemaJsonBase {
    slotIndex?: number | null | undefined;
    encodedMapRawData?: Uint8Array | null | undefined;
    reviewStatus?: number | null | undefined;
    reviewComment?: string | null | undefined;
    srcNormalMapIdForAddEvent?: number | null | undefined;
    dataTimestamp?: number | null | undefined;
    gridMarkData?: $Json$CommonProto$Structure$GridMarkData | null | undefined;
}

export class MapEditorData extends $ProtoSchemaBase {
    private _slotIndex?: number | null | undefined;
    private _encodedMapRawData?: Uint8Array | null | undefined;
    private _reviewStatus?: number | null | undefined;
    private _reviewComment?: string | null | undefined;
    private _srcNormalMapIdForAddEvent?: number | null | undefined;
    private _dataTimestamp?: number | null | undefined;
    private _gridMarkData?: $Message$CommonProto$Structure$GridMarkData | null | undefined;

    public static fromJson(obj: MapEditorDataJson): MapEditorData {
        return new MapEditorData().loadJson(obj);
    }
    public override loadJson(obj: MapEditorDataJson): this {
        this.setSlotIndex(obj.slotIndex);
        this.setEncodedMapRawData(obj.encodedMapRawData);
        this.setReviewStatus(obj.reviewStatus);
        this.setReviewComment(obj.reviewComment);
        this.setSrcNormalMapIdForAddEvent(obj.srcNormalMapIdForAddEvent);
        this.setDataTimestamp(obj.dataTimestamp);
        this.setGridMarkData(obj.gridMarkData != null ? $Message$CommonProto$Structure$GridMarkData.fromJson(obj.gridMarkData) : null);
        return this;
    }
    public override toJson(obj?: MapEditorDataJson): MapEditorDataJson {
        obj ??= ({} as MapEditorDataJson);

        {
            const value = this.getSlotIndex();
            (value != null) && (obj.slotIndex = value);
        }

        {
            const value = this.getEncodedMapRawData();
            (value != null) && (obj.encodedMapRawData = value);
        }

        {
            const value = this.getReviewStatus();
            (value != null) && (obj.reviewStatus = value);
        }

        {
            const value = this.getReviewComment();
            (value != null) && (obj.reviewComment = value);
        }

        {
            const value = this.getSrcNormalMapIdForAddEvent();
            (value != null) && (obj.srcNormalMapIdForAddEvent = value);
        }

        {
            const value = this.getDataTimestamp();
            (value != null) && (obj.dataTimestamp = value);
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
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getEncodedMapRawData();
            if (value != null) {
                writer.uint32(18).bytes(value);
            }
        }

        {
            const value = this.getReviewStatus();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getReviewComment();
            if (value != null) {
                writer.uint32(34).string(value);
            }
        }

        {
            const value = this.getSrcNormalMapIdForAddEvent();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getDataTimestamp();
            if ((value != null) && (value != 0)) {
                writer.uint32(48).uint32(value);
            }
        }

        {
            const value = this.getGridMarkData();
            if (value != null) {
                value.toWriter(writer.uint32(58).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MapEditorData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MapEditorData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSlotIndex(reader.int32());
                    break;

                case 2:
                    msg.setEncodedMapRawData(reader.bytes());
                    break;

                case 3:
                    msg.setReviewStatus(reader.int32());
                    break;

                case 4:
                    msg.setReviewComment(reader.string());
                    break;

                case 5:
                    msg.setSrcNormalMapIdForAddEvent(reader.int32());
                    break;

                case 6:
                    msg.setDataTimestamp(reader.uint32());
                    break;

                case 7:
                    msg.setGridMarkData($Message$CommonProto$Structure$GridMarkData.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MapEditorData {
        return MapEditorData.decode(this.encode());
    }

    public override getSchemaName(): "MapEditorData" {
        return "MapEditorData";
    }

    public checkHasSlotIndex(): boolean {
        return this._slotIndex != null;
    }
    public getSlotIndex(): number {
        return this._slotIndex ?? 0;
    }
    public setSlotIndex(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._slotIndex = null;
        } else {
            this._slotIndex = value;
        }
    }

    public checkHasEncodedMapRawData(): boolean {
        return this._encodedMapRawData != null;
    }
    public getEncodedMapRawData(): Uint8Array | null | undefined {
        return this._encodedMapRawData;
    }
    public setEncodedMapRawData(value: Uint8Array | null | undefined): void {
        this._encodedMapRawData = value;
    }

    public checkHasReviewStatus(): boolean {
        return this._reviewStatus != null;
    }
    public getReviewStatus(): number {
        return this._reviewStatus ?? 0;
    }
    public setReviewStatus(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._reviewStatus = null;
        } else {
            this._reviewStatus = value;
        }
    }

    public checkHasReviewComment(): boolean {
        return this._reviewComment != null;
    }
    public getReviewComment(): string | null | undefined {
        return this._reviewComment;
    }
    public setReviewComment(value: string | null | undefined): void {
        this._reviewComment = value;
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

    public checkHasDataTimestamp(): boolean {
        return this._dataTimestamp != null;
    }
    public getDataTimestamp(): number {
        return this._dataTimestamp ?? 0;
    }
    public setDataTimestamp(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._dataTimestamp = null;
        } else {
            this._dataTimestamp = value;
        }
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
