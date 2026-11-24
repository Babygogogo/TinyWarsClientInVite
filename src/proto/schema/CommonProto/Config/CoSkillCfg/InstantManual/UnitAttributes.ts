import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";
import { Conditions as $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$Conditions, type ConditionsJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$Conditions } from "./UnitAttributes/Conditions.js";
import { EnemyHp as $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$EnemyHp, type EnemyHpJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$EnemyHp } from "./UnitAttributes/EnemyHp.js";
import { SelfHp as $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfHp, type SelfHpJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfHp } from "./UnitAttributes/SelfHp.js";
import { SelfPrimaryAmmo as $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfPrimaryAmmo, type SelfPrimaryAmmoJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfPrimaryAmmo } from "./UnitAttributes/SelfPrimaryAmmo.js";

export interface UnitAttributesJson extends $ProtoSchemaJsonBase {
    conditions?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$Conditions | null | undefined;
    selfHp?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfHp | null | undefined;
    enemyHp?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$EnemyHp | null | undefined;
    selfPrimaryAmmo?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfPrimaryAmmo | null | undefined;
}

export class UnitAttributes extends $ProtoSchemaBase {
    private _conditions?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$Conditions | null | undefined;
    private _selfHp?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfHp | null | undefined;
    private _enemyHp?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$EnemyHp | null | undefined;
    private _selfPrimaryAmmo?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfPrimaryAmmo | null | undefined;

    public static fromJson(obj: UnitAttributesJson): UnitAttributes {
        return new UnitAttributes().loadJson(obj);
    }
    public override loadJson(obj: UnitAttributesJson): this {
        this.setConditions(obj.conditions != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$Conditions.fromJson(obj.conditions) : null);
        this.setSelfHp(obj.selfHp != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfHp.fromJson(obj.selfHp) : null);
        this.setEnemyHp(obj.enemyHp != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$EnemyHp.fromJson(obj.enemyHp) : null);
        this.setSelfPrimaryAmmo(obj.selfPrimaryAmmo != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfPrimaryAmmo.fromJson(obj.selfPrimaryAmmo) : null);
        return this;
    }
    public override toJson(obj?: UnitAttributesJson): UnitAttributesJson {
        obj ??= ({} as UnitAttributesJson);

        {
            const value = this.getConditions();
            (value != null) && (obj.conditions = value.toJson());
        }

        {
            const value = this.getSelfHp();
            (value != null) && (obj.selfHp = value.toJson());
        }

        {
            const value = this.getEnemyHp();
            (value != null) && (obj.enemyHp = value.toJson());
        }

        {
            const value = this.getSelfPrimaryAmmo();
            (value != null) && (obj.selfPrimaryAmmo = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConditions();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfHp();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getEnemyHp();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfPrimaryAmmo();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UnitAttributes {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UnitAttributes();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConditions($Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$Conditions.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setSelfHp($Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfHp.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setEnemyHp($Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$EnemyHp.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setSelfPrimaryAmmo($Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfPrimaryAmmo.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UnitAttributes {
        return UnitAttributes.decode(this.encode());
    }

    public override getSchemaName(): "UnitAttributes" {
        return "UnitAttributes";
    }

    public checkHasConditions(): boolean {
        return this._conditions != null;
    }
    public getConditions(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$Conditions | null | undefined {
        return this._conditions;
    }
    public setConditions(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$Conditions | null | undefined): void {
        this._conditions = value;
    }
    public createIfNotExistsConditions(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$Conditions {
        return this._conditions ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$Conditions();
    }

    public checkHasSelfHp(): boolean {
        return this._selfHp != null;
    }
    public getSelfHp(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfHp | null | undefined {
        return this._selfHp;
    }
    public setSelfHp(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfHp | null | undefined): void {
        this._selfHp = value;
    }
    public createIfNotExistsSelfHp(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfHp {
        return this._selfHp ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfHp();
    }

    public checkHasEnemyHp(): boolean {
        return this._enemyHp != null;
    }
    public getEnemyHp(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$EnemyHp | null | undefined {
        return this._enemyHp;
    }
    public setEnemyHp(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$EnemyHp | null | undefined): void {
        this._enemyHp = value;
    }
    public createIfNotExistsEnemyHp(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$EnemyHp {
        return this._enemyHp ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$EnemyHp();
    }

    public checkHasSelfPrimaryAmmo(): boolean {
        return this._selfPrimaryAmmo != null;
    }
    public getSelfPrimaryAmmo(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfPrimaryAmmo | null | undefined {
        return this._selfPrimaryAmmo;
    }
    public setSelfPrimaryAmmo(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfPrimaryAmmo | null | undefined): void {
        this._selfPrimaryAmmo = value;
    }
    public createIfNotExistsSelfPrimaryAmmo(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfPrimaryAmmo {
        return this._selfPrimaryAmmo ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$UnitAttributes$SelfPrimaryAmmo();
    }
}
