import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SpmWarSaveSlotFullData as $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotFullData, type SpmWarSaveSlotFullDataJson as $Json$CommonProto$SinglePlayerMode$SpmWarSaveSlotFullData } from "../../SinglePlayerMode/SpmWarSaveSlotFullData.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    slotIndex?: number | null | undefined;
    slotData?: $Json$CommonProto$SinglePlayerMode$SpmWarSaveSlotFullData | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _slotIndex?: number | null | undefined;
    private _slotData?: $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotFullData | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setSlotIndex(obj.slotIndex);
        this.setSlotData(obj.slotData != null ? $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotFullData.fromJson(obj.slotData) : null);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getSlotIndex();
            (value != null) && (obj.slotIndex = value);
        }

        {
            const value = this.getSlotData();
            (value != null) && (obj.slotData = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getErrorCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getSlotIndex();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getSlotData();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): S {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new S();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setErrorCode(reader.int32());
                    break;

                case 2:
                    msg.setSlotIndex(reader.int32());
                    break;

                case 3:
                    msg.setSlotData($Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotFullData.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): S {
        return S.decode(this.encode());
    }

    public override getSchemaName(): "S" {
        return "S";
    }

    public checkHasErrorCode(): boolean {
        return this._errorCode != null;
    }
    public getErrorCode(): number | null | undefined {
        return this._errorCode;
    }
    public setErrorCode(value: number | null | undefined): void {
        this._errorCode = value;
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

    public checkHasSlotData(): boolean {
        return this._slotData != null;
    }
    public getSlotData(): $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotFullData | null | undefined {
        return this._slotData;
    }
    public setSlotData(value: $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotFullData | null | undefined): void {
        this._slotData = value;
    }
    public createIfNotExistsSlotData(): $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotFullData {
        return this._slotData ??= new $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotFullData();
    }
}
