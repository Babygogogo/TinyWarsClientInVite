import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { ChangeWeather as $Message$CommonProto$Config$CoSkillCfg$InstantManual$ChangeWeather, type ChangeWeatherJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$ChangeWeather } from "./InstantManual/ChangeWeather.js";
import { EnemyEnergy as $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyEnergy, type EnemyEnergyJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$EnemyEnergy } from "./InstantManual/EnemyEnergy.js";
import { EnemyFuelGain as $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyFuelGain, type EnemyFuelGainJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$EnemyFuelGain } from "./InstantManual/EnemyFuelGain.js";
import { EnemyMaterialGain as $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyMaterialGain, type EnemyMaterialGainJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$EnemyMaterialGain } from "./InstantManual/EnemyMaterialGain.js";
import { EnemyPrimaryAmmoGain as $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyPrimaryAmmoGain, type EnemyPrimaryAmmoGainJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$EnemyPrimaryAmmoGain } from "./InstantManual/EnemyPrimaryAmmoGain.js";
import { EnemyUnitBuffGain as $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitBuffGain, type EnemyUnitBuffGainJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitBuffGain } from "./InstantManual/EnemyUnitBuffGain.js";
import { EnemyUnitHp as $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitHp, type EnemyUnitHpJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitHp } from "./InstantManual/EnemyUnitHp.js";
import { FixedAreaDamage as $Message$CommonProto$Config$CoSkillCfg$InstantManual$FixedAreaDamage, type FixedAreaDamageJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$FixedAreaDamage } from "./InstantManual/FixedAreaDamage.js";
import { SelfAddUnit as $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfAddUnit, type SelfAddUnitJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfAddUnit } from "./InstantManual/SelfAddUnit.js";
import { SelfCoOnboard as $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfCoOnboard, type SelfCoOnboardJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfCoOnboard } from "./InstantManual/SelfCoOnboard.js";
import { SelfFlareAmmoGain as $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFlareAmmoGain, type SelfFlareAmmoGainJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfFlareAmmoGain } from "./InstantManual/SelfFlareAmmoGain.js";
import { SelfFuelGain as $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFuelGain, type SelfFuelGainJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfFuelGain } from "./InstantManual/SelfFuelGain.js";
import { SelfFund as $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFund, type SelfFundJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfFund } from "./InstantManual/SelfFund.js";
import { SelfMaterialGain as $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfMaterialGain, type SelfMaterialGainJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfMaterialGain } from "./InstantManual/SelfMaterialGain.js";
import { SelfPrimaryAmmoGain as $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfPrimaryAmmoGain, type SelfPrimaryAmmoGainJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfPrimaryAmmoGain } from "./InstantManual/SelfPrimaryAmmoGain.js";
import { SelfPromotionGain as $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfPromotionGain, type SelfPromotionGainJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfPromotionGain } from "./InstantManual/SelfPromotionGain.js";
import { SelfUnitActionState as $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitActionState, type SelfUnitActionStateJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitActionState } from "./InstantManual/SelfUnitActionState.js";
import { SelfUnitBuffGain as $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitBuffGain, type SelfUnitBuffGainJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitBuffGain } from "./InstantManual/SelfUnitBuffGain.js";
import { SelfUnitHp as $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitHp, type SelfUnitHpJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitHp } from "./InstantManual/SelfUnitHp.js";

export interface InstantManualJson extends $ProtoSchemaJsonBase {
    selfUnitHp?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitHp | null | undefined;
    enemyUnitHp?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitHp | null | undefined;
    selfPrimaryAmmoGain?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfPrimaryAmmoGain | null | undefined;
    enemyPrimaryAmmoGain?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$EnemyPrimaryAmmoGain | null | undefined;
    selfFuelGain?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfFuelGain | null | undefined;
    enemyFuelGain?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$EnemyFuelGain | null | undefined;
    selfFlareAmmoGain?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfFlareAmmoGain | null | undefined;
    selfMaterialGain?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfMaterialGain | null | undefined;
    enemyMaterialGain?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$EnemyMaterialGain | null | undefined;
    fixedAreaDamage?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$FixedAreaDamage | null | undefined;
    selfPromotionGain?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfPromotionGain | null | undefined;
    selfUnitActionState?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitActionState | null | undefined;
    selfFund?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfFund | null | undefined;
    enemyEnergy?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$EnemyEnergy | null | undefined;
    selfAddUnit?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfAddUnit | null | undefined;
    changeWeather?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$ChangeWeather | null | undefined;
    selfCoOnboard?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfCoOnboard | null | undefined;
    selfUnitBuffGain?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitBuffGain | null | undefined;
    enemyUnitBuffGain?: $Json$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitBuffGain | null | undefined;
}

export class InstantManual extends $ProtoSchemaBase {
    private _selfUnitHp?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitHp | null | undefined;
    private _enemyUnitHp?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitHp | null | undefined;
    private _selfPrimaryAmmoGain?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfPrimaryAmmoGain | null | undefined;
    private _enemyPrimaryAmmoGain?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyPrimaryAmmoGain | null | undefined;
    private _selfFuelGain?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFuelGain | null | undefined;
    private _enemyFuelGain?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyFuelGain | null | undefined;
    private _selfFlareAmmoGain?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFlareAmmoGain | null | undefined;
    private _selfMaterialGain?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfMaterialGain | null | undefined;
    private _enemyMaterialGain?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyMaterialGain | null | undefined;
    private _fixedAreaDamage?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$FixedAreaDamage | null | undefined;
    private _selfPromotionGain?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfPromotionGain | null | undefined;
    private _selfUnitActionState?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitActionState | null | undefined;
    private _selfFund?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFund | null | undefined;
    private _enemyEnergy?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyEnergy | null | undefined;
    private _selfAddUnit?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfAddUnit | null | undefined;
    private _changeWeather?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$ChangeWeather | null | undefined;
    private _selfCoOnboard?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfCoOnboard | null | undefined;
    private _selfUnitBuffGain?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitBuffGain | null | undefined;
    private _enemyUnitBuffGain?: $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitBuffGain | null | undefined;

    public static fromJson(obj: InstantManualJson): InstantManual {
        return new InstantManual().loadJson(obj);
    }
    public override loadJson(obj: InstantManualJson): this {
        this.setSelfUnitHp(obj.selfUnitHp != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitHp.fromJson(obj.selfUnitHp) : null);
        this.setEnemyUnitHp(obj.enemyUnitHp != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitHp.fromJson(obj.enemyUnitHp) : null);
        this.setSelfPrimaryAmmoGain(obj.selfPrimaryAmmoGain != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfPrimaryAmmoGain.fromJson(obj.selfPrimaryAmmoGain) : null);
        this.setEnemyPrimaryAmmoGain(obj.enemyPrimaryAmmoGain != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyPrimaryAmmoGain.fromJson(obj.enemyPrimaryAmmoGain) : null);
        this.setSelfFuelGain(obj.selfFuelGain != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFuelGain.fromJson(obj.selfFuelGain) : null);
        this.setEnemyFuelGain(obj.enemyFuelGain != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyFuelGain.fromJson(obj.enemyFuelGain) : null);
        this.setSelfFlareAmmoGain(obj.selfFlareAmmoGain != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFlareAmmoGain.fromJson(obj.selfFlareAmmoGain) : null);
        this.setSelfMaterialGain(obj.selfMaterialGain != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfMaterialGain.fromJson(obj.selfMaterialGain) : null);
        this.setEnemyMaterialGain(obj.enemyMaterialGain != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyMaterialGain.fromJson(obj.enemyMaterialGain) : null);
        this.setFixedAreaDamage(obj.fixedAreaDamage != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$FixedAreaDamage.fromJson(obj.fixedAreaDamage) : null);
        this.setSelfPromotionGain(obj.selfPromotionGain != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfPromotionGain.fromJson(obj.selfPromotionGain) : null);
        this.setSelfUnitActionState(obj.selfUnitActionState != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitActionState.fromJson(obj.selfUnitActionState) : null);
        this.setSelfFund(obj.selfFund != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFund.fromJson(obj.selfFund) : null);
        this.setEnemyEnergy(obj.enemyEnergy != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyEnergy.fromJson(obj.enemyEnergy) : null);
        this.setSelfAddUnit(obj.selfAddUnit != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfAddUnit.fromJson(obj.selfAddUnit) : null);
        this.setChangeWeather(obj.changeWeather != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$ChangeWeather.fromJson(obj.changeWeather) : null);
        this.setSelfCoOnboard(obj.selfCoOnboard != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfCoOnboard.fromJson(obj.selfCoOnboard) : null);
        this.setSelfUnitBuffGain(obj.selfUnitBuffGain != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitBuffGain.fromJson(obj.selfUnitBuffGain) : null);
        this.setEnemyUnitBuffGain(obj.enemyUnitBuffGain != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitBuffGain.fromJson(obj.enemyUnitBuffGain) : null);
        return this;
    }
    public override toJson(obj?: InstantManualJson): InstantManualJson {
        obj ??= ({} as InstantManualJson);

        {
            const value = this.getSelfUnitHp();
            (value != null) && (obj.selfUnitHp = value.toJson());
        }

        {
            const value = this.getEnemyUnitHp();
            (value != null) && (obj.enemyUnitHp = value.toJson());
        }

        {
            const value = this.getSelfPrimaryAmmoGain();
            (value != null) && (obj.selfPrimaryAmmoGain = value.toJson());
        }

        {
            const value = this.getEnemyPrimaryAmmoGain();
            (value != null) && (obj.enemyPrimaryAmmoGain = value.toJson());
        }

        {
            const value = this.getSelfFuelGain();
            (value != null) && (obj.selfFuelGain = value.toJson());
        }

        {
            const value = this.getEnemyFuelGain();
            (value != null) && (obj.enemyFuelGain = value.toJson());
        }

        {
            const value = this.getSelfFlareAmmoGain();
            (value != null) && (obj.selfFlareAmmoGain = value.toJson());
        }

        {
            const value = this.getSelfMaterialGain();
            (value != null) && (obj.selfMaterialGain = value.toJson());
        }

        {
            const value = this.getEnemyMaterialGain();
            (value != null) && (obj.enemyMaterialGain = value.toJson());
        }

        {
            const value = this.getFixedAreaDamage();
            (value != null) && (obj.fixedAreaDamage = value.toJson());
        }

        {
            const value = this.getSelfPromotionGain();
            (value != null) && (obj.selfPromotionGain = value.toJson());
        }

        {
            const value = this.getSelfUnitActionState();
            (value != null) && (obj.selfUnitActionState = value.toJson());
        }

        {
            const value = this.getSelfFund();
            (value != null) && (obj.selfFund = value.toJson());
        }

        {
            const value = this.getEnemyEnergy();
            (value != null) && (obj.enemyEnergy = value.toJson());
        }

        {
            const value = this.getSelfAddUnit();
            (value != null) && (obj.selfAddUnit = value.toJson());
        }

        {
            const value = this.getChangeWeather();
            (value != null) && (obj.changeWeather = value.toJson());
        }

        {
            const value = this.getSelfCoOnboard();
            (value != null) && (obj.selfCoOnboard = value.toJson());
        }

        {
            const value = this.getSelfUnitBuffGain();
            (value != null) && (obj.selfUnitBuffGain = value.toJson());
        }

        {
            const value = this.getEnemyUnitBuffGain();
            (value != null) && (obj.enemyUnitBuffGain = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSelfUnitHp();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getEnemyUnitHp();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfPrimaryAmmoGain();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getEnemyPrimaryAmmoGain();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfFuelGain();
            if (value != null) {
                value.toWriter(writer.uint32(42).fork()).ldelim();
            }
        }

        {
            const value = this.getEnemyFuelGain();
            if (value != null) {
                value.toWriter(writer.uint32(50).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfFlareAmmoGain();
            if (value != null) {
                value.toWriter(writer.uint32(58).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfMaterialGain();
            if (value != null) {
                value.toWriter(writer.uint32(66).fork()).ldelim();
            }
        }

        {
            const value = this.getEnemyMaterialGain();
            if (value != null) {
                value.toWriter(writer.uint32(74).fork()).ldelim();
            }
        }

        {
            const value = this.getFixedAreaDamage();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfPromotionGain();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfUnitActionState();
            if (value != null) {
                value.toWriter(writer.uint32(98).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfFund();
            if (value != null) {
                value.toWriter(writer.uint32(106).fork()).ldelim();
            }
        }

        {
            const value = this.getEnemyEnergy();
            if (value != null) {
                value.toWriter(writer.uint32(114).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfAddUnit();
            if (value != null) {
                value.toWriter(writer.uint32(122).fork()).ldelim();
            }
        }

        {
            const value = this.getChangeWeather();
            if (value != null) {
                value.toWriter(writer.uint32(130).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfCoOnboard();
            if (value != null) {
                value.toWriter(writer.uint32(138).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfUnitBuffGain();
            if (value != null) {
                value.toWriter(writer.uint32(146).fork()).ldelim();
            }
        }

        {
            const value = this.getEnemyUnitBuffGain();
            if (value != null) {
                value.toWriter(writer.uint32(154).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): InstantManual {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new InstantManual();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSelfUnitHp($Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitHp.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setEnemyUnitHp($Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitHp.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setSelfPrimaryAmmoGain($Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfPrimaryAmmoGain.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setEnemyPrimaryAmmoGain($Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyPrimaryAmmoGain.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setSelfFuelGain($Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFuelGain.decode(reader, reader.uint32()));
                    break;

                case 6:
                    msg.setEnemyFuelGain($Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyFuelGain.decode(reader, reader.uint32()));
                    break;

                case 7:
                    msg.setSelfFlareAmmoGain($Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFlareAmmoGain.decode(reader, reader.uint32()));
                    break;

                case 8:
                    msg.setSelfMaterialGain($Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfMaterialGain.decode(reader, reader.uint32()));
                    break;

                case 9:
                    msg.setEnemyMaterialGain($Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyMaterialGain.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setFixedAreaDamage($Message$CommonProto$Config$CoSkillCfg$InstantManual$FixedAreaDamage.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setSelfPromotionGain($Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfPromotionGain.decode(reader, reader.uint32()));
                    break;

                case 12:
                    msg.setSelfUnitActionState($Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitActionState.decode(reader, reader.uint32()));
                    break;

                case 13:
                    msg.setSelfFund($Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFund.decode(reader, reader.uint32()));
                    break;

                case 14:
                    msg.setEnemyEnergy($Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyEnergy.decode(reader, reader.uint32()));
                    break;

                case 15:
                    msg.setSelfAddUnit($Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfAddUnit.decode(reader, reader.uint32()));
                    break;

                case 16:
                    msg.setChangeWeather($Message$CommonProto$Config$CoSkillCfg$InstantManual$ChangeWeather.decode(reader, reader.uint32()));
                    break;

                case 17:
                    msg.setSelfCoOnboard($Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfCoOnboard.decode(reader, reader.uint32()));
                    break;

                case 18:
                    msg.setSelfUnitBuffGain($Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitBuffGain.decode(reader, reader.uint32()));
                    break;

                case 19:
                    msg.setEnemyUnitBuffGain($Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitBuffGain.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): InstantManual {
        return InstantManual.decode(this.encode());
    }

    public override getSchemaName(): "InstantManual" {
        return "InstantManual";
    }

    public checkHasSelfUnitHp(): boolean {
        return this._selfUnitHp != null;
    }
    public getSelfUnitHp(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitHp | null | undefined {
        return this._selfUnitHp;
    }
    public setSelfUnitHp(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitHp | null | undefined): void {
        this._selfUnitHp = value;
    }
    public createIfNotExistsSelfUnitHp(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitHp {
        return this._selfUnitHp ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitHp();
    }

    public checkHasEnemyUnitHp(): boolean {
        return this._enemyUnitHp != null;
    }
    public getEnemyUnitHp(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitHp | null | undefined {
        return this._enemyUnitHp;
    }
    public setEnemyUnitHp(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitHp | null | undefined): void {
        this._enemyUnitHp = value;
    }
    public createIfNotExistsEnemyUnitHp(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitHp {
        return this._enemyUnitHp ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitHp();
    }

    public checkHasSelfPrimaryAmmoGain(): boolean {
        return this._selfPrimaryAmmoGain != null;
    }
    public getSelfPrimaryAmmoGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfPrimaryAmmoGain | null | undefined {
        return this._selfPrimaryAmmoGain;
    }
    public setSelfPrimaryAmmoGain(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfPrimaryAmmoGain | null | undefined): void {
        this._selfPrimaryAmmoGain = value;
    }
    public createIfNotExistsSelfPrimaryAmmoGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfPrimaryAmmoGain {
        return this._selfPrimaryAmmoGain ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfPrimaryAmmoGain();
    }

    public checkHasEnemyPrimaryAmmoGain(): boolean {
        return this._enemyPrimaryAmmoGain != null;
    }
    public getEnemyPrimaryAmmoGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyPrimaryAmmoGain | null | undefined {
        return this._enemyPrimaryAmmoGain;
    }
    public setEnemyPrimaryAmmoGain(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyPrimaryAmmoGain | null | undefined): void {
        this._enemyPrimaryAmmoGain = value;
    }
    public createIfNotExistsEnemyPrimaryAmmoGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyPrimaryAmmoGain {
        return this._enemyPrimaryAmmoGain ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyPrimaryAmmoGain();
    }

    public checkHasSelfFuelGain(): boolean {
        return this._selfFuelGain != null;
    }
    public getSelfFuelGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFuelGain | null | undefined {
        return this._selfFuelGain;
    }
    public setSelfFuelGain(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFuelGain | null | undefined): void {
        this._selfFuelGain = value;
    }
    public createIfNotExistsSelfFuelGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFuelGain {
        return this._selfFuelGain ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFuelGain();
    }

    public checkHasEnemyFuelGain(): boolean {
        return this._enemyFuelGain != null;
    }
    public getEnemyFuelGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyFuelGain | null | undefined {
        return this._enemyFuelGain;
    }
    public setEnemyFuelGain(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyFuelGain | null | undefined): void {
        this._enemyFuelGain = value;
    }
    public createIfNotExistsEnemyFuelGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyFuelGain {
        return this._enemyFuelGain ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyFuelGain();
    }

    public checkHasSelfFlareAmmoGain(): boolean {
        return this._selfFlareAmmoGain != null;
    }
    public getSelfFlareAmmoGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFlareAmmoGain | null | undefined {
        return this._selfFlareAmmoGain;
    }
    public setSelfFlareAmmoGain(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFlareAmmoGain | null | undefined): void {
        this._selfFlareAmmoGain = value;
    }
    public createIfNotExistsSelfFlareAmmoGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFlareAmmoGain {
        return this._selfFlareAmmoGain ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFlareAmmoGain();
    }

    public checkHasSelfMaterialGain(): boolean {
        return this._selfMaterialGain != null;
    }
    public getSelfMaterialGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfMaterialGain | null | undefined {
        return this._selfMaterialGain;
    }
    public setSelfMaterialGain(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfMaterialGain | null | undefined): void {
        this._selfMaterialGain = value;
    }
    public createIfNotExistsSelfMaterialGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfMaterialGain {
        return this._selfMaterialGain ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfMaterialGain();
    }

    public checkHasEnemyMaterialGain(): boolean {
        return this._enemyMaterialGain != null;
    }
    public getEnemyMaterialGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyMaterialGain | null | undefined {
        return this._enemyMaterialGain;
    }
    public setEnemyMaterialGain(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyMaterialGain | null | undefined): void {
        this._enemyMaterialGain = value;
    }
    public createIfNotExistsEnemyMaterialGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyMaterialGain {
        return this._enemyMaterialGain ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyMaterialGain();
    }

    public checkHasFixedAreaDamage(): boolean {
        return this._fixedAreaDamage != null;
    }
    public getFixedAreaDamage(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$FixedAreaDamage | null | undefined {
        return this._fixedAreaDamage;
    }
    public setFixedAreaDamage(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$FixedAreaDamage | null | undefined): void {
        this._fixedAreaDamage = value;
    }
    public createIfNotExistsFixedAreaDamage(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$FixedAreaDamage {
        return this._fixedAreaDamage ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$FixedAreaDamage();
    }

    public checkHasSelfPromotionGain(): boolean {
        return this._selfPromotionGain != null;
    }
    public getSelfPromotionGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfPromotionGain | null | undefined {
        return this._selfPromotionGain;
    }
    public setSelfPromotionGain(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfPromotionGain | null | undefined): void {
        this._selfPromotionGain = value;
    }
    public createIfNotExistsSelfPromotionGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfPromotionGain {
        return this._selfPromotionGain ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfPromotionGain();
    }

    public checkHasSelfUnitActionState(): boolean {
        return this._selfUnitActionState != null;
    }
    public getSelfUnitActionState(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitActionState | null | undefined {
        return this._selfUnitActionState;
    }
    public setSelfUnitActionState(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitActionState | null | undefined): void {
        this._selfUnitActionState = value;
    }
    public createIfNotExistsSelfUnitActionState(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitActionState {
        return this._selfUnitActionState ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitActionState();
    }

    public checkHasSelfFund(): boolean {
        return this._selfFund != null;
    }
    public getSelfFund(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFund | null | undefined {
        return this._selfFund;
    }
    public setSelfFund(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFund | null | undefined): void {
        this._selfFund = value;
    }
    public createIfNotExistsSelfFund(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFund {
        return this._selfFund ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfFund();
    }

    public checkHasEnemyEnergy(): boolean {
        return this._enemyEnergy != null;
    }
    public getEnemyEnergy(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyEnergy | null | undefined {
        return this._enemyEnergy;
    }
    public setEnemyEnergy(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyEnergy | null | undefined): void {
        this._enemyEnergy = value;
    }
    public createIfNotExistsEnemyEnergy(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyEnergy {
        return this._enemyEnergy ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyEnergy();
    }

    public checkHasSelfAddUnit(): boolean {
        return this._selfAddUnit != null;
    }
    public getSelfAddUnit(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfAddUnit | null | undefined {
        return this._selfAddUnit;
    }
    public setSelfAddUnit(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfAddUnit | null | undefined): void {
        this._selfAddUnit = value;
    }
    public createIfNotExistsSelfAddUnit(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfAddUnit {
        return this._selfAddUnit ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfAddUnit();
    }

    public checkHasChangeWeather(): boolean {
        return this._changeWeather != null;
    }
    public getChangeWeather(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$ChangeWeather | null | undefined {
        return this._changeWeather;
    }
    public setChangeWeather(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$ChangeWeather | null | undefined): void {
        this._changeWeather = value;
    }
    public createIfNotExistsChangeWeather(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$ChangeWeather {
        return this._changeWeather ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$ChangeWeather();
    }

    public checkHasSelfCoOnboard(): boolean {
        return this._selfCoOnboard != null;
    }
    public getSelfCoOnboard(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfCoOnboard | null | undefined {
        return this._selfCoOnboard;
    }
    public setSelfCoOnboard(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfCoOnboard | null | undefined): void {
        this._selfCoOnboard = value;
    }
    public createIfNotExistsSelfCoOnboard(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfCoOnboard {
        return this._selfCoOnboard ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfCoOnboard();
    }

    public checkHasSelfUnitBuffGain(): boolean {
        return this._selfUnitBuffGain != null;
    }
    public getSelfUnitBuffGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitBuffGain | null | undefined {
        return this._selfUnitBuffGain;
    }
    public setSelfUnitBuffGain(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitBuffGain | null | undefined): void {
        this._selfUnitBuffGain = value;
    }
    public createIfNotExistsSelfUnitBuffGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitBuffGain {
        return this._selfUnitBuffGain ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$SelfUnitBuffGain();
    }

    public checkHasEnemyUnitBuffGain(): boolean {
        return this._enemyUnitBuffGain != null;
    }
    public getEnemyUnitBuffGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitBuffGain | null | undefined {
        return this._enemyUnitBuffGain;
    }
    public setEnemyUnitBuffGain(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitBuffGain | null | undefined): void {
        this._enemyUnitBuffGain = value;
    }
    public createIfNotExistsEnemyUnitBuffGain(): $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitBuffGain {
        return this._enemyUnitBuffGain ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual$EnemyUnitBuffGain();
    }
}
