import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfUnitTeleportAfterProductionJson extends $ProtoSchemaJsonBase {
    unitCategoryId?: number | null | undefined;
    conCoUnitActionStateId?: number | null | undefined;
    conMaxCountOfNoProductionBuilding?: number | null | undefined;
    unitActionStateId?: number | null | undefined;
}

export class SelfUnitTeleportAfterProduction extends $ProtoSchemaBase {
    private _unitCategoryId?: number | null | undefined;
    private _conCoUnitActionStateId?: number | null | undefined;
    private _conMaxCountOfNoProductionBuilding?: number | null | undefined;
    private _unitActionStateId?: number | null | undefined;

    public static fromJson(obj: SelfUnitTeleportAfterProductionJson): SelfUnitTeleportAfterProduction {
        return new SelfUnitTeleportAfterProduction().loadJson(obj);
    }
    public override loadJson(obj: SelfUnitTeleportAfterProductionJson): this {
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setConCoUnitActionStateId(obj.conCoUnitActionStateId);
        this.setConMaxCountOfNoProductionBuilding(obj.conMaxCountOfNoProductionBuilding);
        this.setUnitActionStateId(obj.unitActionStateId);
        return this;
    }
    public override toJson(obj?: SelfUnitTeleportAfterProductionJson): SelfUnitTeleportAfterProductionJson {
        obj ??= ({} as SelfUnitTeleportAfterProductionJson);

        {
            const value = this.getUnitCategoryId();
            (value != null) && (obj.unitCategoryId = value);
        }

        {
            const value = this.getConCoUnitActionStateId();
            (value != null) && (obj.conCoUnitActionStateId = value);
        }

        {
            const value = this.getConMaxCountOfNoProductionBuilding();
            (value != null) && (obj.conMaxCountOfNoProductionBuilding = value);
        }

        {
            const value = this.getUnitActionStateId();
            (value != null) && (obj.unitActionStateId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUnitCategoryId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getConCoUnitActionStateId();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getConMaxCountOfNoProductionBuilding();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getUnitActionStateId();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfUnitTeleportAfterProduction {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfUnitTeleportAfterProduction();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    msg.setUnitCategoryId(reader.int32());
                    break;

                case 3:
                    msg.setConCoUnitActionStateId(reader.int32());
                    break;

                case 4:
                    msg.setConMaxCountOfNoProductionBuilding(reader.int32());
                    break;

                case 5:
                    msg.setUnitActionStateId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfUnitTeleportAfterProduction {
        return SelfUnitTeleportAfterProduction.decode(this.encode());
    }

    public override getSchemaName(): "SelfUnitTeleportAfterProduction" {
        return "SelfUnitTeleportAfterProduction";
    }

    public checkHasUnitCategoryId(): boolean {
        return this._unitCategoryId != null;
    }
    public getUnitCategoryId(): number | null | undefined {
        return this._unitCategoryId;
    }
    public setUnitCategoryId(value: number | null | undefined): void {
        this._unitCategoryId = value;
    }

    public checkHasConCoUnitActionStateId(): boolean {
        return this._conCoUnitActionStateId != null;
    }
    public getConCoUnitActionStateId(): number | null | undefined {
        return this._conCoUnitActionStateId;
    }
    public setConCoUnitActionStateId(value: number | null | undefined): void {
        this._conCoUnitActionStateId = value;
    }

    public checkHasConMaxCountOfNoProductionBuilding(): boolean {
        return this._conMaxCountOfNoProductionBuilding != null;
    }
    public getConMaxCountOfNoProductionBuilding(): number | null | undefined {
        return this._conMaxCountOfNoProductionBuilding;
    }
    public setConMaxCountOfNoProductionBuilding(value: number | null | undefined): void {
        this._conMaxCountOfNoProductionBuilding = value;
    }

    public checkHasUnitActionStateId(): boolean {
        return this._unitActionStateId != null;
    }
    public getUnitActionStateId(): number | null | undefined {
        return this._unitActionStateId;
    }
    public setUnitActionStateId(value: number | null | undefined): void {
        this._unitActionStateId = value;
    }
}
