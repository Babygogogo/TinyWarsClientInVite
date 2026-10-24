import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    designerUserId?: number | null | undefined;
    slotIndex?: number | null | undefined;
    dataTimestamp?: number | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _designerUserId?: number | null | undefined;
    private _slotIndex?: number | null | undefined;
    private _dataTimestamp?: number | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setDesignerUserId(obj.designerUserId);
        this.setSlotIndex(obj.slotIndex);
        this.setDataTimestamp(obj.dataTimestamp);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getDesignerUserId();
            (value != null) && (obj.designerUserId = value);
        }

        {
            const value = this.getSlotIndex();
            (value != null) && (obj.slotIndex = value);
        }

        {
            const value = this.getDataTimestamp();
            (value != null) && (obj.dataTimestamp = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getDesignerUserId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getSlotIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getDataTimestamp();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).uint32(value);
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
                    msg.setDesignerUserId(reader.int32());
                    break;

                case 2:
                    msg.setSlotIndex(reader.int32());
                    break;

                case 3:
                    msg.setDataTimestamp(reader.uint32());
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

    public checkHasDesignerUserId(): boolean {
        return this._designerUserId != null;
    }
    public getDesignerUserId(): number {
        return this._designerUserId ?? 0;
    }
    public setDesignerUserId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._designerUserId = null;
        } else {
            this._designerUserId = value;
        }
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
}
