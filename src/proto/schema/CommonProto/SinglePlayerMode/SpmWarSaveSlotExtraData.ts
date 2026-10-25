import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridMarkData as $Message$CommonProto$Structure$GridMarkData, type GridMarkDataJson as $Json$CommonProto$Structure$GridMarkData } from "../Structure/GridMarkData.js";

export interface SpmWarSaveSlotExtraDataJson extends $ProtoSchemaJsonBase {
    slotComment?: string | null | undefined;
    timestamp?: number | null | undefined;
    mpwWarId?: number | null | undefined;
    overridingSkinIdArray: number[];
    gridMarkData?: $Json$CommonProto$Structure$GridMarkData | null | undefined;
}

export class SpmWarSaveSlotExtraData extends $ProtoSchemaBase {
    private _slotComment?: string | null | undefined;
    private _timestamp?: number | null | undefined;
    private _mpwWarId?: number | null | undefined;
    private _overridingSkinIdArray: number[] = [];
    private _gridMarkData?: $Message$CommonProto$Structure$GridMarkData | null | undefined;

    public static fromJson(obj: SpmWarSaveSlotExtraDataJson): SpmWarSaveSlotExtraData {
        return new SpmWarSaveSlotExtraData().loadJson(obj);
    }
    public override loadJson(obj: SpmWarSaveSlotExtraDataJson): this {
        this.setSlotComment(obj.slotComment);
        this.setTimestamp(obj.timestamp);
        this.setMpwWarId(obj.mpwWarId);
        this.setOverridingSkinIdArray(obj.overridingSkinIdArray?.concat() ?? []);
        this.setGridMarkData(obj.gridMarkData != null ? $Message$CommonProto$Structure$GridMarkData.fromJson(obj.gridMarkData) : null);
        return this;
    }
    public override toJson(obj?: SpmWarSaveSlotExtraDataJson): SpmWarSaveSlotExtraDataJson {
        obj ??= ({} as SpmWarSaveSlotExtraDataJson);

        {
            const value = this.getSlotComment();
            (value != null) && (obj.slotComment = value);
        }

        {
            const value = this.getTimestamp();
            (value != null) && (obj.timestamp = value);
        }

        {
            const value = this.getMpwWarId();
            (value != null) && (obj.mpwWarId = value);
        }

        {
            obj.overridingSkinIdArray = this.getOverridingSkinIdArray().concat();
        }

        {
            const value = this.getGridMarkData();
            (value != null) && (obj.gridMarkData = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSlotComment();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getTimestamp();
            if (value != null) {
                writer.uint32(16).uint32(value);
            }
        }

        {
            const value = this.getMpwWarId();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getOverridingSkinIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(34).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SpmWarSaveSlotExtraData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SpmWarSaveSlotExtraData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSlotComment(reader.string());
                    break;

                case 2:
                    msg.setTimestamp(reader.uint32());
                    break;

                case 3:
                    msg.setMpwWarId(reader.int32());
                    break;

                case 4:
                    {
                        const arr = msg._overridingSkinIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
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

    public override clone(): SpmWarSaveSlotExtraData {
        return SpmWarSaveSlotExtraData.decode(this.encode());
    }

    public override getSchemaName(): "SpmWarSaveSlotExtraData" {
        return "SpmWarSaveSlotExtraData";
    }

    public checkHasSlotComment(): boolean {
        return this._slotComment != null;
    }
    public getSlotComment(): string | null | undefined {
        return this._slotComment;
    }
    public setSlotComment(value: string | null | undefined): void {
        this._slotComment = value;
    }

    public checkHasTimestamp(): boolean {
        return this._timestamp != null;
    }
    public getTimestamp(): number | null | undefined {
        return this._timestamp;
    }
    public setTimestamp(value: number | null | undefined): void {
        this._timestamp = value;
    }

    public checkHasMpwWarId(): boolean {
        return this._mpwWarId != null;
    }
    public getMpwWarId(): number | null | undefined {
        return this._mpwWarId;
    }
    public setMpwWarId(value: number | null | undefined): void {
        this._mpwWarId = value;
    }

    public getOverridingSkinIdArray(): number[] {
        return this._overridingSkinIdArray;
    }
    public setOverridingSkinIdArray(value: number[]): void {
        this._overridingSkinIdArray = value;
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
