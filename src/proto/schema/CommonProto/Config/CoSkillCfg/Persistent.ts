import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SelfPromotionBonusByProduce as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfPromotionBonusByProduce, type SelfPromotionBonusByProduceJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfPromotionBonusByProduce } from "./Persistent/SelfPromotionBonusByProduce.js";
import { SelfRepairAmountBonus as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfRepairAmountBonus, type SelfRepairAmountBonusJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfRepairAmountBonus } from "./Persistent/SelfRepairAmountBonus.js";
import { SelfTileEnabledForUnitProduction as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileEnabledForUnitProduction, type SelfTileEnabledForUnitProductionJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileEnabledForUnitProduction } from "./Persistent/SelfTileEnabledForUnitProduction.js";
import { SelfTileIncome as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileIncome, type SelfTileIncomeJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileIncome } from "./Persistent/SelfTileIncome.js";
import { SelfUnitCommonAttributes as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes, type SelfUnitCommonAttributesJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes } from "./Persistent/SelfUnitCommonAttributes.js";
import { SelfUnitCost as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost, type SelfUnitCostJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost } from "./Persistent/SelfUnitCost.js";

export interface PersistentJson extends $ProtoSchemaJsonBase {
    selfUnitCommonAttributes?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes | null | undefined;
    selfUnitCost?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost | null | undefined;
    selfTileIncome?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileIncome | null | undefined;
    selfTileEnabledForUnitProduction?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileEnabledForUnitProduction | null | undefined;
    selfRepairAmountBonus?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfRepairAmountBonus | null | undefined;
    selfPromotionBonusByProduce?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfPromotionBonusByProduce | null | undefined;
}

export class Persistent extends $ProtoSchemaBase {
    private _selfUnitCommonAttributes?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes | null | undefined;
    private _selfUnitCost?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost | null | undefined;
    private _selfTileIncome?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileIncome | null | undefined;
    private _selfTileEnabledForUnitProduction?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileEnabledForUnitProduction | null | undefined;
    private _selfRepairAmountBonus?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfRepairAmountBonus | null | undefined;
    private _selfPromotionBonusByProduce?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfPromotionBonusByProduce | null | undefined;

    public static fromJson(obj: PersistentJson): Persistent {
        return new Persistent().loadJson(obj);
    }
    public override loadJson(obj: PersistentJson): this {
        this.setSelfUnitCommonAttributes(obj.selfUnitCommonAttributes != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes.fromJson(obj.selfUnitCommonAttributes) : null);
        this.setSelfUnitCost(obj.selfUnitCost != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost.fromJson(obj.selfUnitCost) : null);
        this.setSelfTileIncome(obj.selfTileIncome != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileIncome.fromJson(obj.selfTileIncome) : null);
        this.setSelfTileEnabledForUnitProduction(obj.selfTileEnabledForUnitProduction != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileEnabledForUnitProduction.fromJson(obj.selfTileEnabledForUnitProduction) : null);
        this.setSelfRepairAmountBonus(obj.selfRepairAmountBonus != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfRepairAmountBonus.fromJson(obj.selfRepairAmountBonus) : null);
        this.setSelfPromotionBonusByProduce(obj.selfPromotionBonusByProduce != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfPromotionBonusByProduce.fromJson(obj.selfPromotionBonusByProduce) : null);
        return this;
    }
    public override toJson(obj?: PersistentJson): PersistentJson {
        obj ??= ({} as PersistentJson);

        {
            const value = this.getSelfUnitCommonAttributes();
            (value != null) && (obj.selfUnitCommonAttributes = value.toJson());
        }

        {
            const value = this.getSelfUnitCost();
            (value != null) && (obj.selfUnitCost = value.toJson());
        }

        {
            const value = this.getSelfTileIncome();
            (value != null) && (obj.selfTileIncome = value.toJson());
        }

        {
            const value = this.getSelfTileEnabledForUnitProduction();
            (value != null) && (obj.selfTileEnabledForUnitProduction = value.toJson());
        }

        {
            const value = this.getSelfRepairAmountBonus();
            (value != null) && (obj.selfRepairAmountBonus = value.toJson());
        }

        {
            const value = this.getSelfPromotionBonusByProduce();
            (value != null) && (obj.selfPromotionBonusByProduce = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSelfUnitCommonAttributes();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfUnitCost();
            if (value != null) {
                value.toWriter(writer.uint32(58).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfTileIncome();
            if (value != null) {
                value.toWriter(writer.uint32(74).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfTileEnabledForUnitProduction();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfRepairAmountBonus();
            if (value != null) {
                value.toWriter(writer.uint32(106).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfPromotionBonusByProduce();
            if (value != null) {
                value.toWriter(writer.uint32(114).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Persistent {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Persistent();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSelfUnitCommonAttributes($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes.decode(reader, reader.uint32()));
                    break;

                case 7:
                    msg.setSelfUnitCost($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost.decode(reader, reader.uint32()));
                    break;

                case 9:
                    msg.setSelfTileIncome($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileIncome.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setSelfTileEnabledForUnitProduction($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileEnabledForUnitProduction.decode(reader, reader.uint32()));
                    break;

                case 13:
                    msg.setSelfRepairAmountBonus($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfRepairAmountBonus.decode(reader, reader.uint32()));
                    break;

                case 14:
                    msg.setSelfPromotionBonusByProduce($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfPromotionBonusByProduce.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): Persistent {
        return Persistent.decode(this.encode());
    }

    public override getSchemaName(): "Persistent" {
        return "Persistent";
    }

    public checkHasSelfUnitCommonAttributes(): boolean {
        return this._selfUnitCommonAttributes != null;
    }
    public getSelfUnitCommonAttributes(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes | null | undefined {
        return this._selfUnitCommonAttributes;
    }
    public setSelfUnitCommonAttributes(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes | null | undefined): void {
        this._selfUnitCommonAttributes = value;
    }
    public createIfNotExistsSelfUnitCommonAttributes(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes {
        return this._selfUnitCommonAttributes ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes();
    }

    public checkHasSelfUnitCost(): boolean {
        return this._selfUnitCost != null;
    }
    public getSelfUnitCost(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost | null | undefined {
        return this._selfUnitCost;
    }
    public setSelfUnitCost(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost | null | undefined): void {
        this._selfUnitCost = value;
    }
    public createIfNotExistsSelfUnitCost(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost {
        return this._selfUnitCost ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost();
    }

    public checkHasSelfTileIncome(): boolean {
        return this._selfTileIncome != null;
    }
    public getSelfTileIncome(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileIncome | null | undefined {
        return this._selfTileIncome;
    }
    public setSelfTileIncome(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileIncome | null | undefined): void {
        this._selfTileIncome = value;
    }
    public createIfNotExistsSelfTileIncome(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileIncome {
        return this._selfTileIncome ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileIncome();
    }

    public checkHasSelfTileEnabledForUnitProduction(): boolean {
        return this._selfTileEnabledForUnitProduction != null;
    }
    public getSelfTileEnabledForUnitProduction(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileEnabledForUnitProduction | null | undefined {
        return this._selfTileEnabledForUnitProduction;
    }
    public setSelfTileEnabledForUnitProduction(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileEnabledForUnitProduction | null | undefined): void {
        this._selfTileEnabledForUnitProduction = value;
    }
    public createIfNotExistsSelfTileEnabledForUnitProduction(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileEnabledForUnitProduction {
        return this._selfTileEnabledForUnitProduction ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileEnabledForUnitProduction();
    }

    public checkHasSelfRepairAmountBonus(): boolean {
        return this._selfRepairAmountBonus != null;
    }
    public getSelfRepairAmountBonus(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfRepairAmountBonus | null | undefined {
        return this._selfRepairAmountBonus;
    }
    public setSelfRepairAmountBonus(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfRepairAmountBonus | null | undefined): void {
        this._selfRepairAmountBonus = value;
    }
    public createIfNotExistsSelfRepairAmountBonus(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfRepairAmountBonus {
        return this._selfRepairAmountBonus ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfRepairAmountBonus();
    }

    public checkHasSelfPromotionBonusByProduce(): boolean {
        return this._selfPromotionBonusByProduce != null;
    }
    public getSelfPromotionBonusByProduce(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfPromotionBonusByProduce | null | undefined {
        return this._selfPromotionBonusByProduce;
    }
    public setSelfPromotionBonusByProduce(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfPromotionBonusByProduce | null | undefined): void {
        this._selfPromotionBonusByProduce = value;
    }
    public createIfNotExistsSelfPromotionBonusByProduce(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfPromotionBonusByProduce {
        return this._selfPromotionBonusByProduce ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfPromotionBonusByProduce();
    }
}
