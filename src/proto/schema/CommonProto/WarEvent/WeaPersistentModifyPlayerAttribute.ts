import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaPersistentModifyPlayerAttributeJson extends $ProtoSchemaJsonBase {
    isEffectiveInMpw?: boolean | null | undefined;
    conPlayerFilter?: string | null | undefined;
    actBannedUnitTypeArray?: string | null | undefined;
    actCanActivateCoSkill?: string | null | undefined;
    actUnbannedUnitTypeArray?: string | null | undefined;
    actEnergyGrowthMultiplierModifier?: string | null | undefined;
    actCoZoneRadiusModifier?: string | null | undefined;
    actAiUnitProductionBonusScore?: string | null | undefined;
}

export class WeaPersistentModifyPlayerAttribute extends $ProtoSchemaBase {
    private _isEffectiveInMpw?: boolean | null | undefined;
    private _conPlayerFilter?: string | null | undefined;
    private _actBannedUnitTypeArray?: string | null | undefined;
    private _actCanActivateCoSkill?: string | null | undefined;
    private _actUnbannedUnitTypeArray?: string | null | undefined;
    private _actEnergyGrowthMultiplierModifier?: string | null | undefined;
    private _actCoZoneRadiusModifier?: string | null | undefined;
    private _actAiUnitProductionBonusScore?: string | null | undefined;

    public static fromJson(obj: WeaPersistentModifyPlayerAttributeJson): WeaPersistentModifyPlayerAttribute {
        return new WeaPersistentModifyPlayerAttribute().loadJson(obj);
    }
    public override loadJson(obj: WeaPersistentModifyPlayerAttributeJson): this {
        this.setIsEffectiveInMpw(obj.isEffectiveInMpw);
        this.setConPlayerFilter(obj.conPlayerFilter);
        this.setActBannedUnitTypeArray(obj.actBannedUnitTypeArray);
        this.setActCanActivateCoSkill(obj.actCanActivateCoSkill);
        this.setActUnbannedUnitTypeArray(obj.actUnbannedUnitTypeArray);
        this.setActEnergyGrowthMultiplierModifier(obj.actEnergyGrowthMultiplierModifier);
        this.setActCoZoneRadiusModifier(obj.actCoZoneRadiusModifier);
        this.setActAiUnitProductionBonusScore(obj.actAiUnitProductionBonusScore);
        return this;
    }
    public override toJson(obj?: WeaPersistentModifyPlayerAttributeJson): WeaPersistentModifyPlayerAttributeJson {
        obj ??= ({} as WeaPersistentModifyPlayerAttributeJson);

        {
            const value = this.getIsEffectiveInMpw();
            (value != null) && (obj.isEffectiveInMpw = value);
        }

        {
            const value = this.getConPlayerFilter();
            (value != null) && (obj.conPlayerFilter = value);
        }

        {
            const value = this.getActBannedUnitTypeArray();
            (value != null) && (obj.actBannedUnitTypeArray = value);
        }

        {
            const value = this.getActCanActivateCoSkill();
            (value != null) && (obj.actCanActivateCoSkill = value);
        }

        {
            const value = this.getActUnbannedUnitTypeArray();
            (value != null) && (obj.actUnbannedUnitTypeArray = value);
        }

        {
            const value = this.getActEnergyGrowthMultiplierModifier();
            (value != null) && (obj.actEnergyGrowthMultiplierModifier = value);
        }

        {
            const value = this.getActCoZoneRadiusModifier();
            (value != null) && (obj.actCoZoneRadiusModifier = value);
        }

        {
            const value = this.getActAiUnitProductionBonusScore();
            (value != null) && (obj.actAiUnitProductionBonusScore = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getIsEffectiveInMpw();
            if ((value != null) && (value != false)) {
                writer.uint32(8).bool(value);
            }
        }

        {
            const value = this.getConPlayerFilter();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getActBannedUnitTypeArray();
            if (value != null) {
                writer.uint32(82).string(value);
            }
        }

        {
            const value = this.getActCanActivateCoSkill();
            if (value != null) {
                writer.uint32(90).string(value);
            }
        }

        {
            const value = this.getActUnbannedUnitTypeArray();
            if (value != null) {
                writer.uint32(98).string(value);
            }
        }

        {
            const value = this.getActEnergyGrowthMultiplierModifier();
            if (value != null) {
                writer.uint32(106).string(value);
            }
        }

        {
            const value = this.getActCoZoneRadiusModifier();
            if (value != null) {
                writer.uint32(114).string(value);
            }
        }

        {
            const value = this.getActAiUnitProductionBonusScore();
            if (value != null) {
                writer.uint32(122).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaPersistentModifyPlayerAttribute {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaPersistentModifyPlayerAttribute();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setIsEffectiveInMpw(reader.bool());
                    break;

                case 2:
                    msg.setConPlayerFilter(reader.string());
                    break;

                case 10:
                    msg.setActBannedUnitTypeArray(reader.string());
                    break;

                case 11:
                    msg.setActCanActivateCoSkill(reader.string());
                    break;

                case 12:
                    msg.setActUnbannedUnitTypeArray(reader.string());
                    break;

                case 13:
                    msg.setActEnergyGrowthMultiplierModifier(reader.string());
                    break;

                case 14:
                    msg.setActCoZoneRadiusModifier(reader.string());
                    break;

                case 15:
                    msg.setActAiUnitProductionBonusScore(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaPersistentModifyPlayerAttribute {
        return WeaPersistentModifyPlayerAttribute.decode(this.encode());
    }

    public override getSchemaName(): "WeaPersistentModifyPlayerAttribute" {
        return "WeaPersistentModifyPlayerAttribute";
    }

    public checkHasIsEffectiveInMpw(): boolean {
        return this._isEffectiveInMpw != null;
    }
    public getIsEffectiveInMpw(): boolean {
        return this._isEffectiveInMpw ?? false;
    }
    public setIsEffectiveInMpw(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isEffectiveInMpw = null;
        } else {
            this._isEffectiveInMpw = value;
        }
    }

    public checkHasConPlayerFilter(): boolean {
        return this._conPlayerFilter != null;
    }
    public getConPlayerFilter(): string | null | undefined {
        return this._conPlayerFilter;
    }
    public setConPlayerFilter(value: string | null | undefined): void {
        this._conPlayerFilter = value;
    }

    public checkHasActBannedUnitTypeArray(): boolean {
        return this._actBannedUnitTypeArray != null;
    }
    public getActBannedUnitTypeArray(): string | null | undefined {
        return this._actBannedUnitTypeArray;
    }
    public setActBannedUnitTypeArray(value: string | null | undefined): void {
        this._actBannedUnitTypeArray = value;
    }

    public checkHasActCanActivateCoSkill(): boolean {
        return this._actCanActivateCoSkill != null;
    }
    public getActCanActivateCoSkill(): string | null | undefined {
        return this._actCanActivateCoSkill;
    }
    public setActCanActivateCoSkill(value: string | null | undefined): void {
        this._actCanActivateCoSkill = value;
    }

    public checkHasActUnbannedUnitTypeArray(): boolean {
        return this._actUnbannedUnitTypeArray != null;
    }
    public getActUnbannedUnitTypeArray(): string | null | undefined {
        return this._actUnbannedUnitTypeArray;
    }
    public setActUnbannedUnitTypeArray(value: string | null | undefined): void {
        this._actUnbannedUnitTypeArray = value;
    }

    public checkHasActEnergyGrowthMultiplierModifier(): boolean {
        return this._actEnergyGrowthMultiplierModifier != null;
    }
    public getActEnergyGrowthMultiplierModifier(): string | null | undefined {
        return this._actEnergyGrowthMultiplierModifier;
    }
    public setActEnergyGrowthMultiplierModifier(value: string | null | undefined): void {
        this._actEnergyGrowthMultiplierModifier = value;
    }

    public checkHasActCoZoneRadiusModifier(): boolean {
        return this._actCoZoneRadiusModifier != null;
    }
    public getActCoZoneRadiusModifier(): string | null | undefined {
        return this._actCoZoneRadiusModifier;
    }
    public setActCoZoneRadiusModifier(value: string | null | undefined): void {
        this._actCoZoneRadiusModifier = value;
    }

    public checkHasActAiUnitProductionBonusScore(): boolean {
        return this._actAiUnitProductionBonusScore != null;
    }
    public getActAiUnitProductionBonusScore(): string | null | undefined {
        return this._actAiUnitProductionBonusScore;
    }
    public setActAiUnitProductionBonusScore(value: string | null | undefined): void {
        this._actAiUnitProductionBonusScore = value;
    }
}
