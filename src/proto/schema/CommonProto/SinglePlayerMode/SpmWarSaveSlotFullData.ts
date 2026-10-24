import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface SpmWarSaveSlotFullDataJson extends $ProtoSchemaJsonBase {
    slotIndex?: number | null | undefined;
    encodedExtraData?: Uint8Array | null | undefined;
    compressedWarData?: Uint8Array | null | undefined;
}

export class SpmWarSaveSlotFullData extends $ProtoSchemaBase {
    private _slotIndex?: number | null | undefined;
    private _encodedExtraData?: Uint8Array | null | undefined;
    private _compressedWarData?: Uint8Array | null | undefined;

    public static fromJson(obj: SpmWarSaveSlotFullDataJson): SpmWarSaveSlotFullData {
        return new SpmWarSaveSlotFullData().loadJson(obj);
    }
    public override loadJson(obj: SpmWarSaveSlotFullDataJson): this {
        this.setSlotIndex(obj.slotIndex);
        this.setEncodedExtraData(obj.encodedExtraData);
        this.setCompressedWarData(obj.compressedWarData);
        return this;
    }
    public override toJson(obj?: SpmWarSaveSlotFullDataJson): SpmWarSaveSlotFullDataJson {
        obj ??= ({} as SpmWarSaveSlotFullDataJson);

        {
            const value = this.getSlotIndex();
            (value != null) && (obj.slotIndex = value);
        }

        {
            const value = this.getEncodedExtraData();
            (value != null) && (obj.encodedExtraData = value);
        }

        {
            const value = this.getCompressedWarData();
            (value != null) && (obj.compressedWarData = value);
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
            const value = this.getEncodedExtraData();
            if (value != null) {
                writer.uint32(18).bytes(value);
            }
        }

        {
            const value = this.getCompressedWarData();
            if (value != null) {
                writer.uint32(26).bytes(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SpmWarSaveSlotFullData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SpmWarSaveSlotFullData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSlotIndex(reader.int32());
                    break;

                case 2:
                    msg.setEncodedExtraData(reader.bytes());
                    break;

                case 3:
                    msg.setCompressedWarData(reader.bytes());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SpmWarSaveSlotFullData {
        return SpmWarSaveSlotFullData.decode(this.encode());
    }

    public override getSchemaName(): "SpmWarSaveSlotFullData" {
        return "SpmWarSaveSlotFullData";
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

    public checkHasEncodedExtraData(): boolean {
        return this._encodedExtraData != null;
    }
    public getEncodedExtraData(): Uint8Array | null | undefined {
        return this._encodedExtraData;
    }
    public setEncodedExtraData(value: Uint8Array | null | undefined): void {
        this._encodedExtraData = value;
    }

    public checkHasCompressedWarData(): boolean {
        return this._compressedWarData != null;
    }
    public getCompressedWarData(): Uint8Array | null | undefined {
        return this._compressedWarData;
    }
    public setCompressedWarData(value: Uint8Array | null | undefined): void {
        this._compressedWarData = value;
    }
}
