import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfFundAfterBattleJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    selfUnitCategoryId?: number | null | undefined;
    enemyUnitCategoryId?: number | null | undefined;
    conversionPctFromDamageDealt?: number | null | undefined;
}

export class SelfFundAfterBattle extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _selfUnitCategoryId?: number | null | undefined;
    private _enemyUnitCategoryId?: number | null | undefined;
    private _conversionPctFromDamageDealt?: number | null | undefined;

    public static fromJson(obj: SelfFundAfterBattleJson): SelfFundAfterBattle {
        return new SelfFundAfterBattle().loadJson(obj);
    }
    public override loadJson(obj: SelfFundAfterBattleJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setSelfUnitCategoryId(obj.selfUnitCategoryId);
        this.setEnemyUnitCategoryId(obj.enemyUnitCategoryId);
        this.setConversionPctFromDamageDealt(obj.conversionPctFromDamageDealt);
        return this;
    }
    public override toJson(obj?: SelfFundAfterBattleJson): SelfFundAfterBattleJson {
        obj ??= ({} as SelfFundAfterBattleJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getSelfUnitCategoryId();
            (value != null) && (obj.selfUnitCategoryId = value);
        }

        {
            const value = this.getEnemyUnitCategoryId();
            (value != null) && (obj.enemyUnitCategoryId = value);
        }

        {
            const value = this.getConversionPctFromDamageDealt();
            (value != null) && (obj.conversionPctFromDamageDealt = value);
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
            const value = this.getSelfUnitCategoryId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getEnemyUnitCategoryId();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getConversionPctFromDamageDealt();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfFundAfterBattle {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfFundAfterBattle();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCoSkillAreaTypeId(reader.int32());
                    break;

                case 2:
                    msg.setSelfUnitCategoryId(reader.int32());
                    break;

                case 3:
                    msg.setEnemyUnitCategoryId(reader.int32());
                    break;

                case 4:
                    msg.setConversionPctFromDamageDealt(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfFundAfterBattle {
        return SelfFundAfterBattle.decode(this.encode());
    }

    public override getSchemaName(): "SelfFundAfterBattle" {
        return "SelfFundAfterBattle";
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

    public checkHasSelfUnitCategoryId(): boolean {
        return this._selfUnitCategoryId != null;
    }
    public getSelfUnitCategoryId(): number | null | undefined {
        return this._selfUnitCategoryId;
    }
    public setSelfUnitCategoryId(value: number | null | undefined): void {
        this._selfUnitCategoryId = value;
    }

    public checkHasEnemyUnitCategoryId(): boolean {
        return this._enemyUnitCategoryId != null;
    }
    public getEnemyUnitCategoryId(): number | null | undefined {
        return this._enemyUnitCategoryId;
    }
    public setEnemyUnitCategoryId(value: number | null | undefined): void {
        this._enemyUnitCategoryId = value;
    }

    public checkHasConversionPctFromDamageDealt(): boolean {
        return this._conversionPctFromDamageDealt != null;
    }
    public getConversionPctFromDamageDealt(): number {
        return this._conversionPctFromDamageDealt ?? 0;
    }
    public setConversionPctFromDamageDealt(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._conversionPctFromDamageDealt = null;
        } else {
            this._conversionPctFromDamageDealt = value;
        }
    }
}
