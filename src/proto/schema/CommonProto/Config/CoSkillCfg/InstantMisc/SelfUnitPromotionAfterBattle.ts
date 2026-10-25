import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfUnitPromotionAfterBattleJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    unitCategoryId?: number | null | undefined;
    offsetFromDamageDealt: number[];
    offsetFromKill?: number | null | undefined;
}

export class SelfUnitPromotionAfterBattle extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _unitCategoryId?: number | null | undefined;
    private _offsetFromDamageDealt: number[] = [];
    private _offsetFromKill?: number | null | undefined;

    public static fromJson(obj: SelfUnitPromotionAfterBattleJson): SelfUnitPromotionAfterBattle {
        return new SelfUnitPromotionAfterBattle().loadJson(obj);
    }
    public override loadJson(obj: SelfUnitPromotionAfterBattleJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setOffsetFromDamageDealt(obj.offsetFromDamageDealt?.concat() ?? []);
        this.setOffsetFromKill(obj.offsetFromKill);
        return this;
    }
    public override toJson(obj?: SelfUnitPromotionAfterBattleJson): SelfUnitPromotionAfterBattleJson {
        obj ??= ({} as SelfUnitPromotionAfterBattleJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getUnitCategoryId();
            (value != null) && (obj.unitCategoryId = value);
        }

        {
            obj.offsetFromDamageDealt = this.getOffsetFromDamageDealt().concat();
        }

        {
            const value = this.getOffsetFromKill();
            (value != null) && (obj.offsetFromKill = value);
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
            const value = this.getUnitCategoryId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getOffsetFromDamageDealt();
            const length = value.length;
            if (length) {
                writer.uint32(26).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getOffsetFromKill();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfUnitPromotionAfterBattle {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfUnitPromotionAfterBattle();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCoSkillAreaTypeId(reader.int32());
                    break;

                case 2:
                    msg.setUnitCategoryId(reader.int32());
                    break;

                case 3:
                    {
                        const arr = msg._offsetFromDamageDealt;
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

                case 4:
                    msg.setOffsetFromKill(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfUnitPromotionAfterBattle {
        return SelfUnitPromotionAfterBattle.decode(this.encode());
    }

    public override getSchemaName(): "SelfUnitPromotionAfterBattle" {
        return "SelfUnitPromotionAfterBattle";
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

    public checkHasUnitCategoryId(): boolean {
        return this._unitCategoryId != null;
    }
    public getUnitCategoryId(): number | null | undefined {
        return this._unitCategoryId;
    }
    public setUnitCategoryId(value: number | null | undefined): void {
        this._unitCategoryId = value;
    }

    public getOffsetFromDamageDealt(): number[] {
        return this._offsetFromDamageDealt;
    }
    public setOffsetFromDamageDealt(value: number[]): void {
        this._offsetFromDamageDealt = value;
    }

    public checkHasOffsetFromKill(): boolean {
        return this._offsetFromKill != null;
    }
    public getOffsetFromKill(): number {
        return this._offsetFromKill ?? 0;
    }
    public setOffsetFromKill(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._offsetFromKill = null;
        } else {
            this._offsetFromKill = value;
        }
    }
}
