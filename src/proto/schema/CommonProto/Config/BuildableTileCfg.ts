import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface BuildableTileCfgJson extends $ProtoSchemaJsonBase {
    unitTypeId?: number | null | undefined;
    srcTileBaseTypeId?: number | null | undefined;
    srcTileObjectTypeId?: number | null | undefined;
    dstTileBaseTypeId?: number | null | undefined;
    dstTileObjectTypeId?: number | null | undefined;
    isDstNeutral?: boolean | null | undefined;
}

export class BuildableTileCfg extends $ProtoSchemaBase {
    private _unitTypeId?: number | null | undefined;
    private _srcTileBaseTypeId?: number | null | undefined;
    private _srcTileObjectTypeId?: number | null | undefined;
    private _dstTileBaseTypeId?: number | null | undefined;
    private _dstTileObjectTypeId?: number | null | undefined;
    private _isDstNeutral?: boolean | null | undefined;

    public static fromJson(obj: BuildableTileCfgJson): BuildableTileCfg {
        return new BuildableTileCfg().loadJson(obj);
    }
    public override loadJson(obj: BuildableTileCfgJson): this {
        this.setUnitTypeId(obj.unitTypeId);
        this.setSrcTileBaseTypeId(obj.srcTileBaseTypeId);
        this.setSrcTileObjectTypeId(obj.srcTileObjectTypeId);
        this.setDstTileBaseTypeId(obj.dstTileBaseTypeId);
        this.setDstTileObjectTypeId(obj.dstTileObjectTypeId);
        this.setIsDstNeutral(obj.isDstNeutral);
        return this;
    }
    public override toJson(obj?: BuildableTileCfgJson): BuildableTileCfgJson {
        obj ??= ({} as BuildableTileCfgJson);

        {
            const value = this.getUnitTypeId();
            (value != null) && (obj.unitTypeId = value);
        }

        {
            const value = this.getSrcTileBaseTypeId();
            (value != null) && (obj.srcTileBaseTypeId = value);
        }

        {
            const value = this.getSrcTileObjectTypeId();
            (value != null) && (obj.srcTileObjectTypeId = value);
        }

        {
            const value = this.getDstTileBaseTypeId();
            (value != null) && (obj.dstTileBaseTypeId = value);
        }

        {
            const value = this.getDstTileObjectTypeId();
            (value != null) && (obj.dstTileObjectTypeId = value);
        }

        {
            const value = this.getIsDstNeutral();
            (value != null) && (obj.isDstNeutral = value);
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
            const value = this.getSrcTileBaseTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getSrcTileObjectTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getDstTileBaseTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getDstTileObjectTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getIsDstNeutral();
            if ((value != null) && (value != false)) {
                writer.uint32(48).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): BuildableTileCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new BuildableTileCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUnitTypeId(reader.int32());
                    break;

                case 2:
                    msg.setSrcTileBaseTypeId(reader.int32());
                    break;

                case 3:
                    msg.setSrcTileObjectTypeId(reader.int32());
                    break;

                case 4:
                    msg.setDstTileBaseTypeId(reader.int32());
                    break;

                case 5:
                    msg.setDstTileObjectTypeId(reader.int32());
                    break;

                case 6:
                    msg.setIsDstNeutral(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): BuildableTileCfg {
        return BuildableTileCfg.decode(this.encode());
    }

    public override getSchemaName(): "BuildableTileCfg" {
        return "BuildableTileCfg";
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

    public checkHasSrcTileBaseTypeId(): boolean {
        return this._srcTileBaseTypeId != null;
    }
    public getSrcTileBaseTypeId(): number {
        return this._srcTileBaseTypeId ?? 0;
    }
    public setSrcTileBaseTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._srcTileBaseTypeId = null;
        } else {
            this._srcTileBaseTypeId = value;
        }
    }

    public checkHasSrcTileObjectTypeId(): boolean {
        return this._srcTileObjectTypeId != null;
    }
    public getSrcTileObjectTypeId(): number {
        return this._srcTileObjectTypeId ?? 0;
    }
    public setSrcTileObjectTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._srcTileObjectTypeId = null;
        } else {
            this._srcTileObjectTypeId = value;
        }
    }

    public checkHasDstTileBaseTypeId(): boolean {
        return this._dstTileBaseTypeId != null;
    }
    public getDstTileBaseTypeId(): number {
        return this._dstTileBaseTypeId ?? 0;
    }
    public setDstTileBaseTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._dstTileBaseTypeId = null;
        } else {
            this._dstTileBaseTypeId = value;
        }
    }

    public checkHasDstTileObjectTypeId(): boolean {
        return this._dstTileObjectTypeId != null;
    }
    public getDstTileObjectTypeId(): number {
        return this._dstTileObjectTypeId ?? 0;
    }
    public setDstTileObjectTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._dstTileObjectTypeId = null;
        } else {
            this._dstTileObjectTypeId = value;
        }
    }

    public checkHasIsDstNeutral(): boolean {
        return this._isDstNeutral != null;
    }
    public getIsDstNeutral(): boolean {
        return this._isDstNeutral ?? false;
    }
    public setIsDstNeutral(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isDstNeutral = null;
        } else {
            this._isDstNeutral = value;
        }
    }
}
