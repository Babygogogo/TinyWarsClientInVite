import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface VisionBonusCfgJson extends $ProtoSchemaJsonBase {
    unitTypeId?: number | null | undefined;
    tileTypeId?: number | null | undefined;
    visionBonus?: number | null | undefined;
}

export class VisionBonusCfg extends $ProtoSchemaBase {
    private _unitTypeId?: number | null | undefined;
    private _tileTypeId?: number | null | undefined;
    private _visionBonus?: number | null | undefined;

    public static fromJson(obj: VisionBonusCfgJson): VisionBonusCfg {
        return new VisionBonusCfg().loadJson(obj);
    }
    public override loadJson(obj: VisionBonusCfgJson): this {
        this.setUnitTypeId(obj.unitTypeId);
        this.setTileTypeId(obj.tileTypeId);
        this.setVisionBonus(obj.visionBonus);
        return this;
    }
    public override toJson(obj?: VisionBonusCfgJson): VisionBonusCfgJson {
        obj ??= ({} as VisionBonusCfgJson);

        {
            const value = this.getUnitTypeId();
            (value != null) && (obj.unitTypeId = value);
        }

        {
            const value = this.getTileTypeId();
            (value != null) && (obj.tileTypeId = value);
        }

        {
            const value = this.getVisionBonus();
            (value != null) && (obj.visionBonus = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUnitTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTileTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getVisionBonus();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): VisionBonusCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new VisionBonusCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUnitTypeId(reader.int32());
                    break;

                case 2:
                    msg.setTileTypeId(reader.int32());
                    break;

                case 3:
                    msg.setVisionBonus(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): VisionBonusCfg {
        return VisionBonusCfg.decode(this.encode());
    }

    public override getSchemaName(): "VisionBonusCfg" {
        return "VisionBonusCfg";
    }

    public checkHasUnitTypeId(): boolean {
        return this._unitTypeId != null;
    }
    public getUnitTypeId(): number {
        return this._unitTypeId ?? 0;
    }
    public setUnitTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitTypeId = null;
        } else {
            this._unitTypeId = value;
        }
    }

    public checkHasTileTypeId(): boolean {
        return this._tileTypeId != null;
    }
    public getTileTypeId(): number {
        return this._tileTypeId ?? 0;
    }
    public setTileTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._tileTypeId = null;
        } else {
            this._tileTypeId = value;
        }
    }

    public checkHasVisionBonus(): boolean {
        return this._visionBonus != null;
    }
    public getVisionBonus(): number {
        return this._visionBonus ?? 0;
    }
    public setVisionBonus(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._visionBonus = null;
        } else {
            this._visionBonus = value;
        }
    }
}
