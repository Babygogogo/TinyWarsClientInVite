import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SelfCanCoBoard as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCanCoBoard, type SelfCanCoBoardJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfCanCoBoard } from "./Persistent/SelfCanCoBoard.js";
import { SelfCannotBeCounterAttacked as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotBeCounterAttacked, type SelfCannotBeCounterAttackedJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotBeCounterAttacked } from "./Persistent/SelfCannotBeCounterAttacked.js";
import { SelfCannotCounterAttack as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotCounterAttack, type SelfCannotCounterAttackJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotCounterAttack } from "./Persistent/SelfCannotCounterAttack.js";
import { SelfCoBoardingCost as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCoBoardingCost, type SelfCoBoardingCostJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfCoBoardingCost } from "./Persistent/SelfCoBoardingCost.js";
import { SelfDefenseBonusByTileIgnoreHp as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfDefenseBonusByTileIgnoreHp, type SelfDefenseBonusByTileIgnoreHpJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfDefenseBonusByTileIgnoreHp } from "./Persistent/SelfDefenseBonusByTileIgnoreHp.js";
import { SelfInvisible as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfInvisible, type SelfInvisibleJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfInvisible } from "./Persistent/SelfInvisible.js";
import { SelfOffensePierce as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfOffensePierce, type SelfOffensePierceJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfOffensePierce } from "./Persistent/SelfOffensePierce.js";
import { SelfPromotionBonusByProduce as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfPromotionBonusByProduce, type SelfPromotionBonusByProduceJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfPromotionBonusByProduce } from "./Persistent/SelfPromotionBonusByProduce.js";
import { SelfRepairAmountBonus as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfRepairAmountBonus, type SelfRepairAmountBonusJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfRepairAmountBonus } from "./Persistent/SelfRepairAmountBonus.js";
import { SelfTileEnabledForUnitProduction as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileEnabledForUnitProduction, type SelfTileEnabledForUnitProductionJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileEnabledForUnitProduction } from "./Persistent/SelfTileEnabledForUnitProduction.js";
import { SelfTileIncome as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileIncome, type SelfTileIncomeJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileIncome } from "./Persistent/SelfTileIncome.js";
import { SelfUnitAttackRange as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitAttackRange, type SelfUnitAttackRangeJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitAttackRange } from "./Persistent/SelfUnitAttackRange.js";
import { SelfUnitCaptureAmount as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCaptureAmount, type SelfUnitCaptureAmountJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCaptureAmount } from "./Persistent/SelfUnitCaptureAmount.js";
import { SelfUnitCommonAttributes as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes, type SelfUnitCommonAttributesJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes } from "./Persistent/SelfUnitCommonAttributes.js";
import { SelfUnitCost as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost, type SelfUnitCostJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost } from "./Persistent/SelfUnitCost.js";
import { SelfUnitFuelConsumption as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitFuelConsumption, type SelfUnitFuelConsumptionJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitFuelConsumption } from "./Persistent/SelfUnitFuelConsumption.js";
import { SelfUnitIgnoreWeather as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitIgnoreWeather, type SelfUnitIgnoreWeatherJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitIgnoreWeather } from "./Persistent/SelfUnitIgnoreWeather.js";
import { SelfUnitLuckRange as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitLuckRange, type SelfUnitLuckRangeJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitLuckRange } from "./Persistent/SelfUnitLuckRange.js";
import { SelfUnitMoveCost as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitMoveCost, type SelfUnitMoveCostJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitMoveCost } from "./Persistent/SelfUnitMoveCost.js";
import { SelfUnitVision as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitVision, type SelfUnitVisionJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitVision } from "./Persistent/SelfUnitVision.js";

export interface PersistentJson extends $ProtoSchemaJsonBase {
    selfUnitCommonAttributes?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes | null | undefined;
    selfUnitAttackRange?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitAttackRange | null | undefined;
    selfUnitVision?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitVision | null | undefined;
    selfUnitFuelConsumption?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitFuelConsumption | null | undefined;
    selfUnitLuckRange?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitLuckRange | null | undefined;
    selfUnitCost?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost | null | undefined;
    selfUnitCaptureAmount?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCaptureAmount | null | undefined;
    selfTileIncome?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileIncome | null | undefined;
    selfTileEnabledForUnitProduction?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileEnabledForUnitProduction | null | undefined;
    selfUnitIgnoreWeather?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitIgnoreWeather | null | undefined;
    selfUnitMoveCost?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitMoveCost | null | undefined;
    selfRepairAmountBonus?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfRepairAmountBonus | null | undefined;
    selfPromotionBonusByProduce?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfPromotionBonusByProduce | null | undefined;
    selfOffensePierce?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfOffensePierce | null | undefined;
    selfDefenseBonusByTileIgnoreHp?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfDefenseBonusByTileIgnoreHp | null | undefined;
    selfInvisible?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfInvisible | null | undefined;
    selfCannotBeCounterAttacked?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotBeCounterAttacked | null | undefined;
    selfCannotCounterAttack?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotCounterAttack | null | undefined;
    selfCoBoardingCost?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfCoBoardingCost | null | undefined;
    selfCanCoBoard?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfCanCoBoard | null | undefined;
}

export class Persistent extends $ProtoSchemaBase {
    private _selfUnitCommonAttributes?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes | null | undefined;
    private _selfUnitAttackRange?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitAttackRange | null | undefined;
    private _selfUnitVision?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitVision | null | undefined;
    private _selfUnitFuelConsumption?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitFuelConsumption | null | undefined;
    private _selfUnitLuckRange?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitLuckRange | null | undefined;
    private _selfUnitCost?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost | null | undefined;
    private _selfUnitCaptureAmount?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCaptureAmount | null | undefined;
    private _selfTileIncome?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileIncome | null | undefined;
    private _selfTileEnabledForUnitProduction?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileEnabledForUnitProduction | null | undefined;
    private _selfUnitIgnoreWeather?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitIgnoreWeather | null | undefined;
    private _selfUnitMoveCost?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitMoveCost | null | undefined;
    private _selfRepairAmountBonus?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfRepairAmountBonus | null | undefined;
    private _selfPromotionBonusByProduce?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfPromotionBonusByProduce | null | undefined;
    private _selfOffensePierce?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfOffensePierce | null | undefined;
    private _selfDefenseBonusByTileIgnoreHp?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfDefenseBonusByTileIgnoreHp | null | undefined;
    private _selfInvisible?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfInvisible | null | undefined;
    private _selfCannotBeCounterAttacked?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotBeCounterAttacked | null | undefined;
    private _selfCannotCounterAttack?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotCounterAttack | null | undefined;
    private _selfCoBoardingCost?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCoBoardingCost | null | undefined;
    private _selfCanCoBoard?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCanCoBoard | null | undefined;

    public static fromJson(obj: PersistentJson): Persistent {
        return new Persistent().loadJson(obj);
    }
    public override loadJson(obj: PersistentJson): this {
        this.setSelfUnitCommonAttributes(obj.selfUnitCommonAttributes != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes.fromJson(obj.selfUnitCommonAttributes) : null);
        this.setSelfUnitAttackRange(obj.selfUnitAttackRange != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitAttackRange.fromJson(obj.selfUnitAttackRange) : null);
        this.setSelfUnitVision(obj.selfUnitVision != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitVision.fromJson(obj.selfUnitVision) : null);
        this.setSelfUnitFuelConsumption(obj.selfUnitFuelConsumption != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitFuelConsumption.fromJson(obj.selfUnitFuelConsumption) : null);
        this.setSelfUnitLuckRange(obj.selfUnitLuckRange != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitLuckRange.fromJson(obj.selfUnitLuckRange) : null);
        this.setSelfUnitCost(obj.selfUnitCost != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost.fromJson(obj.selfUnitCost) : null);
        this.setSelfUnitCaptureAmount(obj.selfUnitCaptureAmount != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCaptureAmount.fromJson(obj.selfUnitCaptureAmount) : null);
        this.setSelfTileIncome(obj.selfTileIncome != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileIncome.fromJson(obj.selfTileIncome) : null);
        this.setSelfTileEnabledForUnitProduction(obj.selfTileEnabledForUnitProduction != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileEnabledForUnitProduction.fromJson(obj.selfTileEnabledForUnitProduction) : null);
        this.setSelfUnitIgnoreWeather(obj.selfUnitIgnoreWeather != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitIgnoreWeather.fromJson(obj.selfUnitIgnoreWeather) : null);
        this.setSelfUnitMoveCost(obj.selfUnitMoveCost != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitMoveCost.fromJson(obj.selfUnitMoveCost) : null);
        this.setSelfRepairAmountBonus(obj.selfRepairAmountBonus != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfRepairAmountBonus.fromJson(obj.selfRepairAmountBonus) : null);
        this.setSelfPromotionBonusByProduce(obj.selfPromotionBonusByProduce != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfPromotionBonusByProduce.fromJson(obj.selfPromotionBonusByProduce) : null);
        this.setSelfOffensePierce(obj.selfOffensePierce != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfOffensePierce.fromJson(obj.selfOffensePierce) : null);
        this.setSelfDefenseBonusByTileIgnoreHp(obj.selfDefenseBonusByTileIgnoreHp != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfDefenseBonusByTileIgnoreHp.fromJson(obj.selfDefenseBonusByTileIgnoreHp) : null);
        this.setSelfInvisible(obj.selfInvisible != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfInvisible.fromJson(obj.selfInvisible) : null);
        this.setSelfCannotBeCounterAttacked(obj.selfCannotBeCounterAttacked != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotBeCounterAttacked.fromJson(obj.selfCannotBeCounterAttacked) : null);
        this.setSelfCannotCounterAttack(obj.selfCannotCounterAttack != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotCounterAttack.fromJson(obj.selfCannotCounterAttack) : null);
        this.setSelfCoBoardingCost(obj.selfCoBoardingCost != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCoBoardingCost.fromJson(obj.selfCoBoardingCost) : null);
        this.setSelfCanCoBoard(obj.selfCanCoBoard != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCanCoBoard.fromJson(obj.selfCanCoBoard) : null);
        return this;
    }
    public override toJson(obj?: PersistentJson): PersistentJson {
        obj ??= ({} as PersistentJson);

        {
            const value = this.getSelfUnitCommonAttributes();
            (value != null) && (obj.selfUnitCommonAttributes = value.toJson());
        }

        {
            const value = this.getSelfUnitAttackRange();
            (value != null) && (obj.selfUnitAttackRange = value.toJson());
        }

        {
            const value = this.getSelfUnitVision();
            (value != null) && (obj.selfUnitVision = value.toJson());
        }

        {
            const value = this.getSelfUnitFuelConsumption();
            (value != null) && (obj.selfUnitFuelConsumption = value.toJson());
        }

        {
            const value = this.getSelfUnitLuckRange();
            (value != null) && (obj.selfUnitLuckRange = value.toJson());
        }

        {
            const value = this.getSelfUnitCost();
            (value != null) && (obj.selfUnitCost = value.toJson());
        }

        {
            const value = this.getSelfUnitCaptureAmount();
            (value != null) && (obj.selfUnitCaptureAmount = value.toJson());
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
            const value = this.getSelfUnitIgnoreWeather();
            (value != null) && (obj.selfUnitIgnoreWeather = value.toJson());
        }

        {
            const value = this.getSelfUnitMoveCost();
            (value != null) && (obj.selfUnitMoveCost = value.toJson());
        }

        {
            const value = this.getSelfRepairAmountBonus();
            (value != null) && (obj.selfRepairAmountBonus = value.toJson());
        }

        {
            const value = this.getSelfPromotionBonusByProduce();
            (value != null) && (obj.selfPromotionBonusByProduce = value.toJson());
        }

        {
            const value = this.getSelfOffensePierce();
            (value != null) && (obj.selfOffensePierce = value.toJson());
        }

        {
            const value = this.getSelfDefenseBonusByTileIgnoreHp();
            (value != null) && (obj.selfDefenseBonusByTileIgnoreHp = value.toJson());
        }

        {
            const value = this.getSelfInvisible();
            (value != null) && (obj.selfInvisible = value.toJson());
        }

        {
            const value = this.getSelfCannotBeCounterAttacked();
            (value != null) && (obj.selfCannotBeCounterAttacked = value.toJson());
        }

        {
            const value = this.getSelfCannotCounterAttack();
            (value != null) && (obj.selfCannotCounterAttack = value.toJson());
        }

        {
            const value = this.getSelfCoBoardingCost();
            (value != null) && (obj.selfCoBoardingCost = value.toJson());
        }

        {
            const value = this.getSelfCanCoBoard();
            (value != null) && (obj.selfCanCoBoard = value.toJson());
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
            const value = this.getSelfUnitAttackRange();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfUnitVision();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfUnitFuelConsumption();
            if (value != null) {
                value.toWriter(writer.uint32(42).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfUnitLuckRange();
            if (value != null) {
                value.toWriter(writer.uint32(50).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfUnitCost();
            if (value != null) {
                value.toWriter(writer.uint32(58).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfUnitCaptureAmount();
            if (value != null) {
                value.toWriter(writer.uint32(66).fork()).ldelim();
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
            const value = this.getSelfUnitIgnoreWeather();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfUnitMoveCost();
            if (value != null) {
                value.toWriter(writer.uint32(98).fork()).ldelim();
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

        {
            const value = this.getSelfOffensePierce();
            if (value != null) {
                value.toWriter(writer.uint32(122).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfDefenseBonusByTileIgnoreHp();
            if (value != null) {
                value.toWriter(writer.uint32(130).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfInvisible();
            if (value != null) {
                value.toWriter(writer.uint32(138).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfCannotBeCounterAttacked();
            if (value != null) {
                value.toWriter(writer.uint32(146).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfCannotCounterAttack();
            if (value != null) {
                value.toWriter(writer.uint32(154).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfCoBoardingCost();
            if (value != null) {
                value.toWriter(writer.uint32(162).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfCanCoBoard();
            if (value != null) {
                value.toWriter(writer.uint32(170).fork()).ldelim();
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

                case 3:
                    msg.setSelfUnitAttackRange($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitAttackRange.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setSelfUnitVision($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitVision.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setSelfUnitFuelConsumption($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitFuelConsumption.decode(reader, reader.uint32()));
                    break;

                case 6:
                    msg.setSelfUnitLuckRange($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitLuckRange.decode(reader, reader.uint32()));
                    break;

                case 7:
                    msg.setSelfUnitCost($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost.decode(reader, reader.uint32()));
                    break;

                case 8:
                    msg.setSelfUnitCaptureAmount($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCaptureAmount.decode(reader, reader.uint32()));
                    break;

                case 9:
                    msg.setSelfTileIncome($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileIncome.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setSelfTileEnabledForUnitProduction($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileEnabledForUnitProduction.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setSelfUnitIgnoreWeather($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitIgnoreWeather.decode(reader, reader.uint32()));
                    break;

                case 12:
                    msg.setSelfUnitMoveCost($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitMoveCost.decode(reader, reader.uint32()));
                    break;

                case 13:
                    msg.setSelfRepairAmountBonus($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfRepairAmountBonus.decode(reader, reader.uint32()));
                    break;

                case 14:
                    msg.setSelfPromotionBonusByProduce($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfPromotionBonusByProduce.decode(reader, reader.uint32()));
                    break;

                case 15:
                    msg.setSelfOffensePierce($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfOffensePierce.decode(reader, reader.uint32()));
                    break;

                case 16:
                    msg.setSelfDefenseBonusByTileIgnoreHp($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfDefenseBonusByTileIgnoreHp.decode(reader, reader.uint32()));
                    break;

                case 17:
                    msg.setSelfInvisible($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfInvisible.decode(reader, reader.uint32()));
                    break;

                case 18:
                    msg.setSelfCannotBeCounterAttacked($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotBeCounterAttacked.decode(reader, reader.uint32()));
                    break;

                case 19:
                    msg.setSelfCannotCounterAttack($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotCounterAttack.decode(reader, reader.uint32()));
                    break;

                case 20:
                    msg.setSelfCoBoardingCost($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCoBoardingCost.decode(reader, reader.uint32()));
                    break;

                case 21:
                    msg.setSelfCanCoBoard($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCanCoBoard.decode(reader, reader.uint32()));
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

    public checkHasSelfUnitAttackRange(): boolean {
        return this._selfUnitAttackRange != null;
    }
    public getSelfUnitAttackRange(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitAttackRange | null | undefined {
        return this._selfUnitAttackRange;
    }
    public setSelfUnitAttackRange(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitAttackRange | null | undefined): void {
        this._selfUnitAttackRange = value;
    }
    public createIfNotExistsSelfUnitAttackRange(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitAttackRange {
        return this._selfUnitAttackRange ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitAttackRange();
    }

    public checkHasSelfUnitVision(): boolean {
        return this._selfUnitVision != null;
    }
    public getSelfUnitVision(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitVision | null | undefined {
        return this._selfUnitVision;
    }
    public setSelfUnitVision(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitVision | null | undefined): void {
        this._selfUnitVision = value;
    }
    public createIfNotExistsSelfUnitVision(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitVision {
        return this._selfUnitVision ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitVision();
    }

    public checkHasSelfUnitFuelConsumption(): boolean {
        return this._selfUnitFuelConsumption != null;
    }
    public getSelfUnitFuelConsumption(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitFuelConsumption | null | undefined {
        return this._selfUnitFuelConsumption;
    }
    public setSelfUnitFuelConsumption(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitFuelConsumption | null | undefined): void {
        this._selfUnitFuelConsumption = value;
    }
    public createIfNotExistsSelfUnitFuelConsumption(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitFuelConsumption {
        return this._selfUnitFuelConsumption ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitFuelConsumption();
    }

    public checkHasSelfUnitLuckRange(): boolean {
        return this._selfUnitLuckRange != null;
    }
    public getSelfUnitLuckRange(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitLuckRange | null | undefined {
        return this._selfUnitLuckRange;
    }
    public setSelfUnitLuckRange(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitLuckRange | null | undefined): void {
        this._selfUnitLuckRange = value;
    }
    public createIfNotExistsSelfUnitLuckRange(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitLuckRange {
        return this._selfUnitLuckRange ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitLuckRange();
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

    public checkHasSelfUnitCaptureAmount(): boolean {
        return this._selfUnitCaptureAmount != null;
    }
    public getSelfUnitCaptureAmount(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCaptureAmount | null | undefined {
        return this._selfUnitCaptureAmount;
    }
    public setSelfUnitCaptureAmount(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCaptureAmount | null | undefined): void {
        this._selfUnitCaptureAmount = value;
    }
    public createIfNotExistsSelfUnitCaptureAmount(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCaptureAmount {
        return this._selfUnitCaptureAmount ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCaptureAmount();
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

    public checkHasSelfUnitIgnoreWeather(): boolean {
        return this._selfUnitIgnoreWeather != null;
    }
    public getSelfUnitIgnoreWeather(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitIgnoreWeather | null | undefined {
        return this._selfUnitIgnoreWeather;
    }
    public setSelfUnitIgnoreWeather(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitIgnoreWeather | null | undefined): void {
        this._selfUnitIgnoreWeather = value;
    }
    public createIfNotExistsSelfUnitIgnoreWeather(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitIgnoreWeather {
        return this._selfUnitIgnoreWeather ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitIgnoreWeather();
    }

    public checkHasSelfUnitMoveCost(): boolean {
        return this._selfUnitMoveCost != null;
    }
    public getSelfUnitMoveCost(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitMoveCost | null | undefined {
        return this._selfUnitMoveCost;
    }
    public setSelfUnitMoveCost(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitMoveCost | null | undefined): void {
        this._selfUnitMoveCost = value;
    }
    public createIfNotExistsSelfUnitMoveCost(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitMoveCost {
        return this._selfUnitMoveCost ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitMoveCost();
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

    public checkHasSelfOffensePierce(): boolean {
        return this._selfOffensePierce != null;
    }
    public getSelfOffensePierce(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfOffensePierce | null | undefined {
        return this._selfOffensePierce;
    }
    public setSelfOffensePierce(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfOffensePierce | null | undefined): void {
        this._selfOffensePierce = value;
    }
    public createIfNotExistsSelfOffensePierce(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfOffensePierce {
        return this._selfOffensePierce ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfOffensePierce();
    }

    public checkHasSelfDefenseBonusByTileIgnoreHp(): boolean {
        return this._selfDefenseBonusByTileIgnoreHp != null;
    }
    public getSelfDefenseBonusByTileIgnoreHp(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfDefenseBonusByTileIgnoreHp | null | undefined {
        return this._selfDefenseBonusByTileIgnoreHp;
    }
    public setSelfDefenseBonusByTileIgnoreHp(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfDefenseBonusByTileIgnoreHp | null | undefined): void {
        this._selfDefenseBonusByTileIgnoreHp = value;
    }
    public createIfNotExistsSelfDefenseBonusByTileIgnoreHp(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfDefenseBonusByTileIgnoreHp {
        return this._selfDefenseBonusByTileIgnoreHp ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfDefenseBonusByTileIgnoreHp();
    }

    public checkHasSelfInvisible(): boolean {
        return this._selfInvisible != null;
    }
    public getSelfInvisible(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfInvisible | null | undefined {
        return this._selfInvisible;
    }
    public setSelfInvisible(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfInvisible | null | undefined): void {
        this._selfInvisible = value;
    }
    public createIfNotExistsSelfInvisible(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfInvisible {
        return this._selfInvisible ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfInvisible();
    }

    public checkHasSelfCannotBeCounterAttacked(): boolean {
        return this._selfCannotBeCounterAttacked != null;
    }
    public getSelfCannotBeCounterAttacked(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotBeCounterAttacked | null | undefined {
        return this._selfCannotBeCounterAttacked;
    }
    public setSelfCannotBeCounterAttacked(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotBeCounterAttacked | null | undefined): void {
        this._selfCannotBeCounterAttacked = value;
    }
    public createIfNotExistsSelfCannotBeCounterAttacked(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotBeCounterAttacked {
        return this._selfCannotBeCounterAttacked ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotBeCounterAttacked();
    }

    public checkHasSelfCannotCounterAttack(): boolean {
        return this._selfCannotCounterAttack != null;
    }
    public getSelfCannotCounterAttack(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotCounterAttack | null | undefined {
        return this._selfCannotCounterAttack;
    }
    public setSelfCannotCounterAttack(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotCounterAttack | null | undefined): void {
        this._selfCannotCounterAttack = value;
    }
    public createIfNotExistsSelfCannotCounterAttack(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotCounterAttack {
        return this._selfCannotCounterAttack ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCannotCounterAttack();
    }

    public checkHasSelfCoBoardingCost(): boolean {
        return this._selfCoBoardingCost != null;
    }
    public getSelfCoBoardingCost(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCoBoardingCost | null | undefined {
        return this._selfCoBoardingCost;
    }
    public setSelfCoBoardingCost(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCoBoardingCost | null | undefined): void {
        this._selfCoBoardingCost = value;
    }
    public createIfNotExistsSelfCoBoardingCost(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCoBoardingCost {
        return this._selfCoBoardingCost ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCoBoardingCost();
    }

    public checkHasSelfCanCoBoard(): boolean {
        return this._selfCanCoBoard != null;
    }
    public getSelfCanCoBoard(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCanCoBoard | null | undefined {
        return this._selfCanCoBoard;
    }
    public setSelfCanCoBoard(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCanCoBoard | null | undefined): void {
        this._selfCanCoBoard = value;
    }
    public createIfNotExistsSelfCanCoBoard(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCanCoBoard {
        return this._selfCanCoBoard ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfCanCoBoard();
    }
}
