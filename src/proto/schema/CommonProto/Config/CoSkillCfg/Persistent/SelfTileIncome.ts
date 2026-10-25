import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfTileIncomeJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    tileCategoryId?: number | null | undefined;
    multiplierPct?: number | null | undefined;
}

export class SelfTileIncome extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _tileCategoryId?: number | null | undefined;
    private _multiplierPct?: number | null | undefined;

    public static fromJson(obj: SelfTileIncomeJson): SelfTileIncome {
        return new SelfTileIncome().loadJson(obj);
    }
    public override loadJson(obj: SelfTileIncomeJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setTileCategoryId(obj.tileCategoryId);
        this.setMultiplierPct(obj.multiplierPct);
        return this;
    }
    public override toJson(obj?: SelfTileIncomeJson): SelfTileIncomeJson {
        obj ??= ({} as SelfTileIncomeJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getTileCategoryId();
            (value != null) && (obj.tileCategoryId = value);
        }

        {
            const value = this.getMultiplierPct();
            (value != null) && (obj.multiplierPct = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCoSkillAreaTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTileCategoryId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getMultiplierPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfTileIncome {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfTileIncome();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCoSkillAreaTypeId(reader.int32());
                    break;

                case 2:
                    msg.setTileCategoryId(reader.int32());
                    break;

                case 3:
                    msg.setMultiplierPct(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfTileIncome {
        return SelfTileIncome.decode(this.encode());
    }

    public override getSchemaName(): "SelfTileIncome" {
        return "SelfTileIncome";
    }

    public checkHasCoSkillAreaTypeId(): boolean {
        return this._coSkillAreaTypeId != null;
    }
    public getCoSkillAreaTypeId(): number {
        return this._coSkillAreaTypeId ?? 0;
    }
    public setCoSkillAreaTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._coSkillAreaTypeId = null;
        } else {
            this._coSkillAreaTypeId = value;
        }
    }

    public checkHasTileCategoryId(): boolean {
        return this._tileCategoryId != null;
    }
    public getTileCategoryId(): number | null | undefined {
        return this._tileCategoryId;
    }
    public setTileCategoryId(value: number | null | undefined): void {
        this._tileCategoryId = value;
    }

    public checkHasMultiplierPct(): boolean {
        return this._multiplierPct != null;
    }
    public getMultiplierPct(): number {
        return this._multiplierPct ?? 0;
    }
    public setMultiplierPct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._multiplierPct = null;
        } else {
            this._multiplierPct = value;
        }
    }
}
