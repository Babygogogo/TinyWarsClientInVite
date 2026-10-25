import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfRepairAmountBonusJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    repairOffsetFromUnit?: number | null | undefined;
    repairOffsetFromTile?: number | null | undefined;
    costMultiplierPct?: number | null | undefined;
}

export class SelfRepairAmountBonus extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _repairOffsetFromUnit?: number | null | undefined;
    private _repairOffsetFromTile?: number | null | undefined;
    private _costMultiplierPct?: number | null | undefined;

    public static fromJson(obj: SelfRepairAmountBonusJson): SelfRepairAmountBonus {
        return new SelfRepairAmountBonus().loadJson(obj);
    }
    public override loadJson(obj: SelfRepairAmountBonusJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setRepairOffsetFromUnit(obj.repairOffsetFromUnit);
        this.setRepairOffsetFromTile(obj.repairOffsetFromTile);
        this.setCostMultiplierPct(obj.costMultiplierPct);
        return this;
    }
    public override toJson(obj?: SelfRepairAmountBonusJson): SelfRepairAmountBonusJson {
        obj ??= ({} as SelfRepairAmountBonusJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getRepairOffsetFromUnit();
            (value != null) && (obj.repairOffsetFromUnit = value);
        }

        {
            const value = this.getRepairOffsetFromTile();
            (value != null) && (obj.repairOffsetFromTile = value);
        }

        {
            const value = this.getCostMultiplierPct();
            (value != null) && (obj.costMultiplierPct = value);
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
            const value = this.getRepairOffsetFromUnit();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getRepairOffsetFromTile();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getCostMultiplierPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfRepairAmountBonus {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfRepairAmountBonus();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCoSkillAreaTypeId(reader.int32());
                    break;

                case 2:
                    msg.setRepairOffsetFromUnit(reader.int32());
                    break;

                case 3:
                    msg.setRepairOffsetFromTile(reader.int32());
                    break;

                case 4:
                    msg.setCostMultiplierPct(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfRepairAmountBonus {
        return SelfRepairAmountBonus.decode(this.encode());
    }

    public override getSchemaName(): "SelfRepairAmountBonus" {
        return "SelfRepairAmountBonus";
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

    public checkHasRepairOffsetFromUnit(): boolean {
        return this._repairOffsetFromUnit != null;
    }
    public getRepairOffsetFromUnit(): number {
        return this._repairOffsetFromUnit ?? 0;
    }
    public setRepairOffsetFromUnit(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._repairOffsetFromUnit = null;
        } else {
            this._repairOffsetFromUnit = value;
        }
    }

    public checkHasRepairOffsetFromTile(): boolean {
        return this._repairOffsetFromTile != null;
    }
    public getRepairOffsetFromTile(): number {
        return this._repairOffsetFromTile ?? 0;
    }
    public setRepairOffsetFromTile(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._repairOffsetFromTile = null;
        } else {
            this._repairOffsetFromTile = value;
        }
    }

    public checkHasCostMultiplierPct(): boolean {
        return this._costMultiplierPct != null;
    }
    public getCostMultiplierPct(): number {
        return this._costMultiplierPct ?? 0;
    }
    public setCostMultiplierPct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._costMultiplierPct = null;
        } else {
            this._costMultiplierPct = value;
        }
    }
}
