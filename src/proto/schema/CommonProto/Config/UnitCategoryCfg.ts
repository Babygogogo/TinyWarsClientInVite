import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface UnitCategoryCfgJson extends $ProtoSchemaJsonBase {
    unitCategoryId?: number | null | undefined;
    unitTypeIds: number[];
    nameTextId?: number | null | undefined;
}

export class UnitCategoryCfg extends $ProtoSchemaBase {
    private _unitCategoryId?: number | null | undefined;
    private _unitTypeIds: number[] = [];
    private _nameTextId?: number | null | undefined;

    public static fromJson(obj: UnitCategoryCfgJson): UnitCategoryCfg {
        return new UnitCategoryCfg().loadJson(obj);
    }
    public override loadJson(obj: UnitCategoryCfgJson): this {
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setUnitTypeIds(obj.unitTypeIds?.concat() ?? []);
        this.setNameTextId(obj.nameTextId);
        return this;
    }
    public override toJson(obj?: UnitCategoryCfgJson): UnitCategoryCfgJson {
        obj ??= ({} as UnitCategoryCfgJson);

        {
            const value = this.getUnitCategoryId();
            (value != null) && (obj.unitCategoryId = value);
        }

        {
            obj.unitTypeIds = this.getUnitTypeIds().concat();
        }

        {
            const value = this.getNameTextId();
            (value != null) && (obj.nameTextId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUnitCategoryId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getUnitTypeIds();
            const length = value.length;
            if (length) {
                writer.uint32(18).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getNameTextId();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UnitCategoryCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UnitCategoryCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUnitCategoryId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._unitTypeIds;
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

                case 3:
                    msg.setNameTextId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UnitCategoryCfg {
        return UnitCategoryCfg.decode(this.encode());
    }

    public override getSchemaName(): "UnitCategoryCfg" {
        return "UnitCategoryCfg";
    }

    public checkHasUnitCategoryId(): boolean {
        return this._unitCategoryId != null;
    }
    public getUnitCategoryId(): number {
        return this._unitCategoryId ?? 0;
    }
    public setUnitCategoryId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitCategoryId = null;
        } else {
            this._unitCategoryId = value;
        }
    }

    public getUnitTypeIds(): number[] {
        return this._unitTypeIds;
    }
    public setUnitTypeIds(value: number[]): void {
        this._unitTypeIds = value;
    }

    public checkHasNameTextId(): boolean {
        return this._nameTextId != null;
    }
    public getNameTextId(): number | null | undefined {
        return this._nameTextId;
    }
    public setNameTextId(value: number | null | undefined): void {
        this._nameTextId = value;
    }
}
