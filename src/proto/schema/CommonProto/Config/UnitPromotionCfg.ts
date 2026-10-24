import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface UnitPromotionCfgJson extends $ProtoSchemaJsonBase {
    promotion?: number | null | undefined;
    attackBonus?: number | null | undefined;
    defenseBonus?: number | null | undefined;
}

export class UnitPromotionCfg extends $ProtoSchemaBase {
    private _promotion?: number | null | undefined;
    private _attackBonus?: number | null | undefined;
    private _defenseBonus?: number | null | undefined;

    public static fromJson(obj: UnitPromotionCfgJson): UnitPromotionCfg {
        return new UnitPromotionCfg().loadJson(obj);
    }
    public override loadJson(obj: UnitPromotionCfgJson): this {
        this.setPromotion(obj.promotion);
        this.setAttackBonus(obj.attackBonus);
        this.setDefenseBonus(obj.defenseBonus);
        return this;
    }
    public override toJson(obj?: UnitPromotionCfgJson): UnitPromotionCfgJson {
        obj ??= ({} as UnitPromotionCfgJson);

        {
            const value = this.getPromotion();
            (value != null) && (obj.promotion = value);
        }

        {
            const value = this.getAttackBonus();
            (value != null) && (obj.attackBonus = value);
        }

        {
            const value = this.getDefenseBonus();
            (value != null) && (obj.defenseBonus = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getPromotion();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getAttackBonus();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getDefenseBonus();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UnitPromotionCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UnitPromotionCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setPromotion(reader.int32());
                    break;

                case 2:
                    msg.setAttackBonus(reader.int32());
                    break;

                case 3:
                    msg.setDefenseBonus(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UnitPromotionCfg {
        return UnitPromotionCfg.decode(this.encode());
    }

    public override getSchemaName(): "UnitPromotionCfg" {
        return "UnitPromotionCfg";
    }

    public checkHasPromotion(): boolean {
        return this._promotion != null;
    }
    public getPromotion(): number {
        return this._promotion ?? 0;
    }
    public setPromotion(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._promotion = null;
        } else {
            this._promotion = value;
        }
    }

    public checkHasAttackBonus(): boolean {
        return this._attackBonus != null;
    }
    public getAttackBonus(): number {
        return this._attackBonus ?? 0;
    }
    public setAttackBonus(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._attackBonus = null;
        } else {
            this._attackBonus = value;
        }
    }

    public checkHasDefenseBonus(): boolean {
        return this._defenseBonus != null;
    }
    public getDefenseBonus(): number {
        return this._defenseBonus ?? 0;
    }
    public setDefenseBonus(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._defenseBonus = null;
        } else {
            this._defenseBonus = value;
        }
    }
}
