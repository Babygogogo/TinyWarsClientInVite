import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { BuildableTileCfg as $Message$CommonProto$Config$BuildableTileCfg, type BuildableTileCfgJson as $Json$CommonProto$Config$BuildableTileCfg } from "./BuildableTileCfg.js";
import { CoBasicCfg as $Message$CommonProto$Config$CoBasicCfg, type CoBasicCfgJson as $Json$CommonProto$Config$CoBasicCfg } from "./CoBasicCfg.js";
import { CoCategoryCfg as $Message$CommonProto$Config$CoCategoryCfg, type CoCategoryCfgJson as $Json$CommonProto$Config$CoCategoryCfg } from "./CoCategoryCfg.js";
import { CoSkillCfg as $Message$CommonProto$Config$CoSkillCfg, type CoSkillCfgJson as $Json$CommonProto$Config$CoSkillCfg } from "./CoSkillCfg.js";
import { CoSkillDescCfg as $Message$CommonProto$Config$CoSkillDescCfg, type CoSkillDescCfgJson as $Json$CommonProto$Config$CoSkillDescCfg } from "./CoSkillDescCfg.js";
import { DamageChartCfg as $Message$CommonProto$Config$DamageChartCfg, type DamageChartCfgJson as $Json$CommonProto$Config$DamageChartCfg } from "./DamageChartCfg.js";
import { MoveCostCfg as $Message$CommonProto$Config$MoveCostCfg, type MoveCostCfgJson as $Json$CommonProto$Config$MoveCostCfg } from "./MoveCostCfg.js";
import { MoveTypeCfg as $Message$CommonProto$Config$MoveTypeCfg, type MoveTypeCfgJson as $Json$CommonProto$Config$MoveTypeCfg } from "./MoveTypeCfg.js";
import { SystemCfg as $Message$CommonProto$Config$SystemCfg, type SystemCfgJson as $Json$CommonProto$Config$SystemCfg } from "./SystemCfg.js";
import { TextCfg as $Message$CommonProto$Config$TextCfg, type TextCfgJson as $Json$CommonProto$Config$TextCfg } from "./TextCfg.js";
import { TileCategoryCfg as $Message$CommonProto$Config$TileCategoryCfg, type TileCategoryCfgJson as $Json$CommonProto$Config$TileCategoryCfg } from "./TileCategoryCfg.js";
import { TileTemplateCfg as $Message$CommonProto$Config$TileTemplateCfg, type TileTemplateCfgJson as $Json$CommonProto$Config$TileTemplateCfg } from "./TileTemplateCfg.js";
import { TileTypeMappingCfg as $Message$CommonProto$Config$TileTypeMappingCfg, type TileTypeMappingCfgJson as $Json$CommonProto$Config$TileTypeMappingCfg } from "./TileTypeMappingCfg.js";
import { UnitCategoryCfg as $Message$CommonProto$Config$UnitCategoryCfg, type UnitCategoryCfgJson as $Json$CommonProto$Config$UnitCategoryCfg } from "./UnitCategoryCfg.js";
import { UnitPromotionCfg as $Message$CommonProto$Config$UnitPromotionCfg, type UnitPromotionCfgJson as $Json$CommonProto$Config$UnitPromotionCfg } from "./UnitPromotionCfg.js";
import { UnitTemplateCfg as $Message$CommonProto$Config$UnitTemplateCfg, type UnitTemplateCfgJson as $Json$CommonProto$Config$UnitTemplateCfg } from "./UnitTemplateCfg.js";
import { VisionBonusCfg as $Message$CommonProto$Config$VisionBonusCfg, type VisionBonusCfgJson as $Json$CommonProto$Config$VisionBonusCfg } from "./VisionBonusCfg.js";
import { WeatherCategoryCfg as $Message$CommonProto$Config$WeatherCategoryCfg, type WeatherCategoryCfgJson as $Json$CommonProto$Config$WeatherCategoryCfg } from "./WeatherCategoryCfg.js";
import { WeatherCfg as $Message$CommonProto$Config$WeatherCfg, type WeatherCfgJson as $Json$CommonProto$Config$WeatherCfg } from "./WeatherCfg.js";

export interface FullConfigJson extends $ProtoSchemaJsonBase {
    System: $Json$CommonProto$Config$SystemCfg[];
    TileCategory: $Json$CommonProto$Config$TileCategoryCfg[];
    TileTypeMapping: $Json$CommonProto$Config$TileTypeMappingCfg[];
    UnitCategory: $Json$CommonProto$Config$UnitCategoryCfg[];
    TileTemplate: $Json$CommonProto$Config$TileTemplateCfg[];
    UnitTemplate: $Json$CommonProto$Config$UnitTemplateCfg[];
    DamageChart: $Json$CommonProto$Config$DamageChartCfg[];
    MoveCost: $Json$CommonProto$Config$MoveCostCfg[];
    UnitPromotion: $Json$CommonProto$Config$UnitPromotionCfg[];
    VisionBonus: $Json$CommonProto$Config$VisionBonusCfg[];
    BuildableTile: $Json$CommonProto$Config$BuildableTileCfg[];
    CoCategory: $Json$CommonProto$Config$CoCategoryCfg[];
    CoBasic: $Json$CommonProto$Config$CoBasicCfg[];
    CoSkill: $Json$CommonProto$Config$CoSkillCfg[];
    CoSkillDesc: $Json$CommonProto$Config$CoSkillDescCfg[];
    Weather: $Json$CommonProto$Config$WeatherCfg[];
    WeatherCategory: $Json$CommonProto$Config$WeatherCategoryCfg[];
    MoveType: $Json$CommonProto$Config$MoveTypeCfg[];
    Text: $Json$CommonProto$Config$TextCfg[];
}

export class FullConfig extends $ProtoSchemaBase {
    private _System: $Message$CommonProto$Config$SystemCfg[] = [];
    private _TileCategory: $Message$CommonProto$Config$TileCategoryCfg[] = [];
    private _TileTypeMapping: $Message$CommonProto$Config$TileTypeMappingCfg[] = [];
    private _UnitCategory: $Message$CommonProto$Config$UnitCategoryCfg[] = [];
    private _TileTemplate: $Message$CommonProto$Config$TileTemplateCfg[] = [];
    private _UnitTemplate: $Message$CommonProto$Config$UnitTemplateCfg[] = [];
    private _DamageChart: $Message$CommonProto$Config$DamageChartCfg[] = [];
    private _MoveCost: $Message$CommonProto$Config$MoveCostCfg[] = [];
    private _UnitPromotion: $Message$CommonProto$Config$UnitPromotionCfg[] = [];
    private _VisionBonus: $Message$CommonProto$Config$VisionBonusCfg[] = [];
    private _BuildableTile: $Message$CommonProto$Config$BuildableTileCfg[] = [];
    private _CoCategory: $Message$CommonProto$Config$CoCategoryCfg[] = [];
    private _CoBasic: $Message$CommonProto$Config$CoBasicCfg[] = [];
    private _CoSkill: $Message$CommonProto$Config$CoSkillCfg[] = [];
    private _CoSkillDesc: $Message$CommonProto$Config$CoSkillDescCfg[] = [];
    private _Weather: $Message$CommonProto$Config$WeatherCfg[] = [];
    private _WeatherCategory: $Message$CommonProto$Config$WeatherCategoryCfg[] = [];
    private _MoveType: $Message$CommonProto$Config$MoveTypeCfg[] = [];
    private _Text: $Message$CommonProto$Config$TextCfg[] = [];

    public static fromJson(obj: FullConfigJson): FullConfig {
        return new FullConfig().loadJson(obj);
    }
    public override loadJson(obj: FullConfigJson): this {
        this.setSystem(obj.System?.map(v => $Message$CommonProto$Config$SystemCfg.fromJson(v)) ?? []);
        this.setTileCategory(obj.TileCategory?.map(v => $Message$CommonProto$Config$TileCategoryCfg.fromJson(v)) ?? []);
        this.setTileTypeMapping(obj.TileTypeMapping?.map(v => $Message$CommonProto$Config$TileTypeMappingCfg.fromJson(v)) ?? []);
        this.setUnitCategory(obj.UnitCategory?.map(v => $Message$CommonProto$Config$UnitCategoryCfg.fromJson(v)) ?? []);
        this.setTileTemplate(obj.TileTemplate?.map(v => $Message$CommonProto$Config$TileTemplateCfg.fromJson(v)) ?? []);
        this.setUnitTemplate(obj.UnitTemplate?.map(v => $Message$CommonProto$Config$UnitTemplateCfg.fromJson(v)) ?? []);
        this.setDamageChart(obj.DamageChart?.map(v => $Message$CommonProto$Config$DamageChartCfg.fromJson(v)) ?? []);
        this.setMoveCost(obj.MoveCost?.map(v => $Message$CommonProto$Config$MoveCostCfg.fromJson(v)) ?? []);
        this.setUnitPromotion(obj.UnitPromotion?.map(v => $Message$CommonProto$Config$UnitPromotionCfg.fromJson(v)) ?? []);
        this.setVisionBonus(obj.VisionBonus?.map(v => $Message$CommonProto$Config$VisionBonusCfg.fromJson(v)) ?? []);
        this.setBuildableTile(obj.BuildableTile?.map(v => $Message$CommonProto$Config$BuildableTileCfg.fromJson(v)) ?? []);
        this.setCoCategory(obj.CoCategory?.map(v => $Message$CommonProto$Config$CoCategoryCfg.fromJson(v)) ?? []);
        this.setCoBasic(obj.CoBasic?.map(v => $Message$CommonProto$Config$CoBasicCfg.fromJson(v)) ?? []);
        this.setCoSkill(obj.CoSkill?.map(v => $Message$CommonProto$Config$CoSkillCfg.fromJson(v)) ?? []);
        this.setCoSkillDesc(obj.CoSkillDesc?.map(v => $Message$CommonProto$Config$CoSkillDescCfg.fromJson(v)) ?? []);
        this.setWeather(obj.Weather?.map(v => $Message$CommonProto$Config$WeatherCfg.fromJson(v)) ?? []);
        this.setWeatherCategory(obj.WeatherCategory?.map(v => $Message$CommonProto$Config$WeatherCategoryCfg.fromJson(v)) ?? []);
        this.setMoveType(obj.MoveType?.map(v => $Message$CommonProto$Config$MoveTypeCfg.fromJson(v)) ?? []);
        this.setText(obj.Text?.map(v => $Message$CommonProto$Config$TextCfg.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: FullConfigJson): FullConfigJson {
        obj ??= ({} as FullConfigJson);

        {
            obj.System = this.getSystem().map(v => v.toJson());
        }

        {
            obj.TileCategory = this.getTileCategory().map(v => v.toJson());
        }

        {
            obj.TileTypeMapping = this.getTileTypeMapping().map(v => v.toJson());
        }

        {
            obj.UnitCategory = this.getUnitCategory().map(v => v.toJson());
        }

        {
            obj.TileTemplate = this.getTileTemplate().map(v => v.toJson());
        }

        {
            obj.UnitTemplate = this.getUnitTemplate().map(v => v.toJson());
        }

        {
            obj.DamageChart = this.getDamageChart().map(v => v.toJson());
        }

        {
            obj.MoveCost = this.getMoveCost().map(v => v.toJson());
        }

        {
            obj.UnitPromotion = this.getUnitPromotion().map(v => v.toJson());
        }

        {
            obj.VisionBonus = this.getVisionBonus().map(v => v.toJson());
        }

        {
            obj.BuildableTile = this.getBuildableTile().map(v => v.toJson());
        }

        {
            obj.CoCategory = this.getCoCategory().map(v => v.toJson());
        }

        {
            obj.CoBasic = this.getCoBasic().map(v => v.toJson());
        }

        {
            obj.CoSkill = this.getCoSkill().map(v => v.toJson());
        }

        {
            obj.CoSkillDesc = this.getCoSkillDesc().map(v => v.toJson());
        }

        {
            obj.Weather = this.getWeather().map(v => v.toJson());
        }

        {
            obj.WeatherCategory = this.getWeatherCategory().map(v => v.toJson());
        }

        {
            obj.MoveType = this.getMoveType().map(v => v.toJson());
        }

        {
            obj.Text = this.getText().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSystem();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getTileCategory();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getTileTypeMapping();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(74).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getUnitCategory();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(82).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getTileTemplate();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(90).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getUnitTemplate();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(98).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getDamageChart();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(106).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getMoveCost();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(114).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getUnitPromotion();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(122).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getVisionBonus();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(130).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getBuildableTile();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(138).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getCoCategory();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(154).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getCoBasic();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(162).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getCoSkill();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(170).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getCoSkillDesc();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(178).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getWeather();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(186).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getWeatherCategory();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(194).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getMoveType();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(218).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getText();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(234).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): FullConfig {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new FullConfig();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._System;
                        arr.push($Message$CommonProto$Config$SystemCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 2:
                    {
                        const arr = msg._TileCategory;
                        arr.push($Message$CommonProto$Config$TileCategoryCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 9:
                    {
                        const arr = msg._TileTypeMapping;
                        arr.push($Message$CommonProto$Config$TileTypeMappingCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 10:
                    {
                        const arr = msg._UnitCategory;
                        arr.push($Message$CommonProto$Config$UnitCategoryCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 11:
                    {
                        const arr = msg._TileTemplate;
                        arr.push($Message$CommonProto$Config$TileTemplateCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 12:
                    {
                        const arr = msg._UnitTemplate;
                        arr.push($Message$CommonProto$Config$UnitTemplateCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 13:
                    {
                        const arr = msg._DamageChart;
                        arr.push($Message$CommonProto$Config$DamageChartCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 14:
                    {
                        const arr = msg._MoveCost;
                        arr.push($Message$CommonProto$Config$MoveCostCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 15:
                    {
                        const arr = msg._UnitPromotion;
                        arr.push($Message$CommonProto$Config$UnitPromotionCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 16:
                    {
                        const arr = msg._VisionBonus;
                        arr.push($Message$CommonProto$Config$VisionBonusCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 17:
                    {
                        const arr = msg._BuildableTile;
                        arr.push($Message$CommonProto$Config$BuildableTileCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 19:
                    {
                        const arr = msg._CoCategory;
                        arr.push($Message$CommonProto$Config$CoCategoryCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 20:
                    {
                        const arr = msg._CoBasic;
                        arr.push($Message$CommonProto$Config$CoBasicCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 21:
                    {
                        const arr = msg._CoSkill;
                        arr.push($Message$CommonProto$Config$CoSkillCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 22:
                    {
                        const arr = msg._CoSkillDesc;
                        arr.push($Message$CommonProto$Config$CoSkillDescCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 23:
                    {
                        const arr = msg._Weather;
                        arr.push($Message$CommonProto$Config$WeatherCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 24:
                    {
                        const arr = msg._WeatherCategory;
                        arr.push($Message$CommonProto$Config$WeatherCategoryCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 27:
                    {
                        const arr = msg._MoveType;
                        arr.push($Message$CommonProto$Config$MoveTypeCfg.decode(reader, reader.uint32()));
                    }
                    break;

                case 29:
                    {
                        const arr = msg._Text;
                        arr.push($Message$CommonProto$Config$TextCfg.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): FullConfig {
        return FullConfig.decode(this.encode());
    }

    public override getSchemaName(): "FullConfig" {
        return "FullConfig";
    }

    public getSystem(): $Message$CommonProto$Config$SystemCfg[] {
        return this._System;
    }
    public setSystem(value: $Message$CommonProto$Config$SystemCfg[]): void {
        this._System = value;
    }

    public getTileCategory(): $Message$CommonProto$Config$TileCategoryCfg[] {
        return this._TileCategory;
    }
    public setTileCategory(value: $Message$CommonProto$Config$TileCategoryCfg[]): void {
        this._TileCategory = value;
    }

    public getTileTypeMapping(): $Message$CommonProto$Config$TileTypeMappingCfg[] {
        return this._TileTypeMapping;
    }
    public setTileTypeMapping(value: $Message$CommonProto$Config$TileTypeMappingCfg[]): void {
        this._TileTypeMapping = value;
    }

    public getUnitCategory(): $Message$CommonProto$Config$UnitCategoryCfg[] {
        return this._UnitCategory;
    }
    public setUnitCategory(value: $Message$CommonProto$Config$UnitCategoryCfg[]): void {
        this._UnitCategory = value;
    }

    public getTileTemplate(): $Message$CommonProto$Config$TileTemplateCfg[] {
        return this._TileTemplate;
    }
    public setTileTemplate(value: $Message$CommonProto$Config$TileTemplateCfg[]): void {
        this._TileTemplate = value;
    }

    public getUnitTemplate(): $Message$CommonProto$Config$UnitTemplateCfg[] {
        return this._UnitTemplate;
    }
    public setUnitTemplate(value: $Message$CommonProto$Config$UnitTemplateCfg[]): void {
        this._UnitTemplate = value;
    }

    public getDamageChart(): $Message$CommonProto$Config$DamageChartCfg[] {
        return this._DamageChart;
    }
    public setDamageChart(value: $Message$CommonProto$Config$DamageChartCfg[]): void {
        this._DamageChart = value;
    }

    public getMoveCost(): $Message$CommonProto$Config$MoveCostCfg[] {
        return this._MoveCost;
    }
    public setMoveCost(value: $Message$CommonProto$Config$MoveCostCfg[]): void {
        this._MoveCost = value;
    }

    public getUnitPromotion(): $Message$CommonProto$Config$UnitPromotionCfg[] {
        return this._UnitPromotion;
    }
    public setUnitPromotion(value: $Message$CommonProto$Config$UnitPromotionCfg[]): void {
        this._UnitPromotion = value;
    }

    public getVisionBonus(): $Message$CommonProto$Config$VisionBonusCfg[] {
        return this._VisionBonus;
    }
    public setVisionBonus(value: $Message$CommonProto$Config$VisionBonusCfg[]): void {
        this._VisionBonus = value;
    }

    public getBuildableTile(): $Message$CommonProto$Config$BuildableTileCfg[] {
        return this._BuildableTile;
    }
    public setBuildableTile(value: $Message$CommonProto$Config$BuildableTileCfg[]): void {
        this._BuildableTile = value;
    }

    public getCoCategory(): $Message$CommonProto$Config$CoCategoryCfg[] {
        return this._CoCategory;
    }
    public setCoCategory(value: $Message$CommonProto$Config$CoCategoryCfg[]): void {
        this._CoCategory = value;
    }

    public getCoBasic(): $Message$CommonProto$Config$CoBasicCfg[] {
        return this._CoBasic;
    }
    public setCoBasic(value: $Message$CommonProto$Config$CoBasicCfg[]): void {
        this._CoBasic = value;
    }

    public getCoSkill(): $Message$CommonProto$Config$CoSkillCfg[] {
        return this._CoSkill;
    }
    public setCoSkill(value: $Message$CommonProto$Config$CoSkillCfg[]): void {
        this._CoSkill = value;
    }

    public getCoSkillDesc(): $Message$CommonProto$Config$CoSkillDescCfg[] {
        return this._CoSkillDesc;
    }
    public setCoSkillDesc(value: $Message$CommonProto$Config$CoSkillDescCfg[]): void {
        this._CoSkillDesc = value;
    }

    public getWeather(): $Message$CommonProto$Config$WeatherCfg[] {
        return this._Weather;
    }
    public setWeather(value: $Message$CommonProto$Config$WeatherCfg[]): void {
        this._Weather = value;
    }

    public getWeatherCategory(): $Message$CommonProto$Config$WeatherCategoryCfg[] {
        return this._WeatherCategory;
    }
    public setWeatherCategory(value: $Message$CommonProto$Config$WeatherCategoryCfg[]): void {
        this._WeatherCategory = value;
    }

    public getMoveType(): $Message$CommonProto$Config$MoveTypeCfg[] {
        return this._MoveType;
    }
    public setMoveType(value: $Message$CommonProto$Config$MoveTypeCfg[]): void {
        this._MoveType = value;
    }

    public getText(): $Message$CommonProto$Config$TextCfg[] {
        return this._Text;
    }
    public setText(value: $Message$CommonProto$Config$TextCfg[]): void {
        this._Text = value;
    }
}
