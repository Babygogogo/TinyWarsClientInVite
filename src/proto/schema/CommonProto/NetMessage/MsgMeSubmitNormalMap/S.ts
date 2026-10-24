import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    slotIndex?: number | null | undefined;
    mapRawDataErrorCode?: number | null | undefined;
    needReview?: boolean | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _slotIndex?: number | null | undefined;
    private _mapRawDataErrorCode?: number | null | undefined;
    private _needReview?: boolean | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setSlotIndex(obj.slotIndex);
        this.setMapRawDataErrorCode(obj.mapRawDataErrorCode);
        this.setNeedReview(obj.needReview);
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
            const value = this.getMapRawDataErrorCode();
            (value != null) && (obj.mapRawDataErrorCode = value);
        }

        {
            const value = this.getNeedReview();
            (value != null) && (obj.needReview = value);
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
            const value = this.getMapRawDataErrorCode();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getNeedReview();
            if (value != null) {
                writer.uint32(32).bool(value);
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
                    msg.setMapRawDataErrorCode(reader.int32());
                    break;

                case 4:
                    msg.setNeedReview(reader.bool());
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

    public checkHasMapRawDataErrorCode(): boolean {
        return this._mapRawDataErrorCode != null;
    }
    public getMapRawDataErrorCode(): number | null | undefined {
        return this._mapRawDataErrorCode;
    }
    public setMapRawDataErrorCode(value: number | null | undefined): void {
        this._mapRawDataErrorCode = value;
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
}
