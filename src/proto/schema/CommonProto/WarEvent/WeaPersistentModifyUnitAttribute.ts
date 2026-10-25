import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaPersistentModifyUnitAttributeJson extends $ProtoSchemaJsonBase {
    isEffectiveInMpw?: boolean | null | undefined;
    conUnitFilter?: string | null | undefined;
    actAttackPowerModifier?: string | null | undefined;
    actDefenseModifier?: string | null | undefined;
    actMoveRangeModifier?: string | null | undefined;
    actMaxAttackRangeModifier?: string | null | undefined;
    actVisionRangeModifier?: string | null | undefined;
    actLuckLowerLimitModifier?: string | null | undefined;
    actLuckUpperLimitModifier?: string | null | undefined;
    actFlareRangeModifier?: string | null | undefined;
    actFlareRadiusModifier?: string | null | undefined;
    actCanAttackAfterMoving?: string | null | undefined;
    actIsPenetratingVision?: string | null | undefined;
}

export class WeaPersistentModifyUnitAttribute extends $ProtoSchemaBase {
    private _isEffectiveInMpw?: boolean | null | undefined;
    private _conUnitFilter?: string | null | undefined;
    private _actAttackPowerModifier?: string | null | undefined;
    private _actDefenseModifier?: string | null | undefined;
    private _actMoveRangeModifier?: string | null | undefined;
    private _actMaxAttackRangeModifier?: string | null | undefined;
    private _actVisionRangeModifier?: string | null | undefined;
    private _actLuckLowerLimitModifier?: string | null | undefined;
    private _actLuckUpperLimitModifier?: string | null | undefined;
    private _actFlareRangeModifier?: string | null | undefined;
    private _actFlareRadiusModifier?: string | null | undefined;
    private _actCanAttackAfterMoving?: string | null | undefined;
    private _actIsPenetratingVision?: string | null | undefined;

    public static fromJson(obj: WeaPersistentModifyUnitAttributeJson): WeaPersistentModifyUnitAttribute {
        return new WeaPersistentModifyUnitAttribute().loadJson(obj);
    }
    public override loadJson(obj: WeaPersistentModifyUnitAttributeJson): this {
        this.setIsEffectiveInMpw(obj.isEffectiveInMpw);
        this.setConUnitFilter(obj.conUnitFilter);
        this.setActAttackPowerModifier(obj.actAttackPowerModifier);
        this.setActDefenseModifier(obj.actDefenseModifier);
        this.setActMoveRangeModifier(obj.actMoveRangeModifier);
        this.setActMaxAttackRangeModifier(obj.actMaxAttackRangeModifier);
        this.setActVisionRangeModifier(obj.actVisionRangeModifier);
        this.setActLuckLowerLimitModifier(obj.actLuckLowerLimitModifier);
        this.setActLuckUpperLimitModifier(obj.actLuckUpperLimitModifier);
        this.setActFlareRangeModifier(obj.actFlareRangeModifier);
        this.setActFlareRadiusModifier(obj.actFlareRadiusModifier);
        this.setActCanAttackAfterMoving(obj.actCanAttackAfterMoving);
        this.setActIsPenetratingVision(obj.actIsPenetratingVision);
        return this;
    }
    public override toJson(obj?: WeaPersistentModifyUnitAttributeJson): WeaPersistentModifyUnitAttributeJson {
        obj ??= ({} as WeaPersistentModifyUnitAttributeJson);

        {
            const value = this.getIsEffectiveInMpw();
            (value != null) && (obj.isEffectiveInMpw = value);
        }

        {
            const value = this.getConUnitFilter();
            (value != null) && (obj.conUnitFilter = value);
        }

        {
            const value = this.getActAttackPowerModifier();
            (value != null) && (obj.actAttackPowerModifier = value);
        }

        {
            const value = this.getActDefenseModifier();
            (value != null) && (obj.actDefenseModifier = value);
        }

        {
            const value = this.getActMoveRangeModifier();
            (value != null) && (obj.actMoveRangeModifier = value);
        }

        {
            const value = this.getActMaxAttackRangeModifier();
            (value != null) && (obj.actMaxAttackRangeModifier = value);
        }

        {
            const value = this.getActVisionRangeModifier();
            (value != null) && (obj.actVisionRangeModifier = value);
        }

        {
            const value = this.getActLuckLowerLimitModifier();
            (value != null) && (obj.actLuckLowerLimitModifier = value);
        }

        {
            const value = this.getActLuckUpperLimitModifier();
            (value != null) && (obj.actLuckUpperLimitModifier = value);
        }

        {
            const value = this.getActFlareRangeModifier();
            (value != null) && (obj.actFlareRangeModifier = value);
        }

        {
            const value = this.getActFlareRadiusModifier();
            (value != null) && (obj.actFlareRadiusModifier = value);
        }

        {
            const value = this.getActCanAttackAfterMoving();
            (value != null) && (obj.actCanAttackAfterMoving = value);
        }

        {
            const value = this.getActIsPenetratingVision();
            (value != null) && (obj.actIsPenetratingVision = value);
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
            const value = this.getConUnitFilter();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getActAttackPowerModifier();
            if (value != null) {
                writer.uint32(82).string(value);
            }
        }

        {
            const value = this.getActDefenseModifier();
            if (value != null) {
                writer.uint32(90).string(value);
            }
        }

        {
            const value = this.getActMoveRangeModifier();
            if (value != null) {
                writer.uint32(98).string(value);
            }
        }

        {
            const value = this.getActMaxAttackRangeModifier();
            if (value != null) {
                writer.uint32(106).string(value);
            }
        }

        {
            const value = this.getActVisionRangeModifier();
            if (value != null) {
                writer.uint32(114).string(value);
            }
        }

        {
            const value = this.getActLuckLowerLimitModifier();
            if (value != null) {
                writer.uint32(122).string(value);
            }
        }

        {
            const value = this.getActLuckUpperLimitModifier();
            if (value != null) {
                writer.uint32(130).string(value);
            }
        }

        {
            const value = this.getActFlareRangeModifier();
            if (value != null) {
                writer.uint32(138).string(value);
            }
        }

        {
            const value = this.getActFlareRadiusModifier();
            if (value != null) {
                writer.uint32(146).string(value);
            }
        }

        {
            const value = this.getActCanAttackAfterMoving();
            if (value != null) {
                writer.uint32(154).string(value);
            }
        }

        {
            const value = this.getActIsPenetratingVision();
            if (value != null) {
                writer.uint32(162).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaPersistentModifyUnitAttribute {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaPersistentModifyUnitAttribute();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setIsEffectiveInMpw(reader.bool());
                    break;

                case 2:
                    msg.setConUnitFilter(reader.string());
                    break;

                case 10:
                    msg.setActAttackPowerModifier(reader.string());
                    break;

                case 11:
                    msg.setActDefenseModifier(reader.string());
                    break;

                case 12:
                    msg.setActMoveRangeModifier(reader.string());
                    break;

                case 13:
                    msg.setActMaxAttackRangeModifier(reader.string());
                    break;

                case 14:
                    msg.setActVisionRangeModifier(reader.string());
                    break;

                case 15:
                    msg.setActLuckLowerLimitModifier(reader.string());
                    break;

                case 16:
                    msg.setActLuckUpperLimitModifier(reader.string());
                    break;

                case 17:
                    msg.setActFlareRangeModifier(reader.string());
                    break;

                case 18:
                    msg.setActFlareRadiusModifier(reader.string());
                    break;

                case 19:
                    msg.setActCanAttackAfterMoving(reader.string());
                    break;

                case 20:
                    msg.setActIsPenetratingVision(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaPersistentModifyUnitAttribute {
        return WeaPersistentModifyUnitAttribute.decode(this.encode());
    }

    public override getSchemaName(): "WeaPersistentModifyUnitAttribute" {
        return "WeaPersistentModifyUnitAttribute";
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

    public checkHasConUnitFilter(): boolean {
        return this._conUnitFilter != null;
    }
    public getConUnitFilter(): string | null | undefined {
        return this._conUnitFilter;
    }
    public setConUnitFilter(value: string | null | undefined): void {
        this._conUnitFilter = value;
    }

    public checkHasActAttackPowerModifier(): boolean {
        return this._actAttackPowerModifier != null;
    }
    public getActAttackPowerModifier(): string | null | undefined {
        return this._actAttackPowerModifier;
    }
    public setActAttackPowerModifier(value: string | null | undefined): void {
        this._actAttackPowerModifier = value;
    }

    public checkHasActDefenseModifier(): boolean {
        return this._actDefenseModifier != null;
    }
    public getActDefenseModifier(): string | null | undefined {
        return this._actDefenseModifier;
    }
    public setActDefenseModifier(value: string | null | undefined): void {
        this._actDefenseModifier = value;
    }

    public checkHasActMoveRangeModifier(): boolean {
        return this._actMoveRangeModifier != null;
    }
    public getActMoveRangeModifier(): string | null | undefined {
        return this._actMoveRangeModifier;
    }
    public setActMoveRangeModifier(value: string | null | undefined): void {
        this._actMoveRangeModifier = value;
    }

    public checkHasActMaxAttackRangeModifier(): boolean {
        return this._actMaxAttackRangeModifier != null;
    }
    public getActMaxAttackRangeModifier(): string | null | undefined {
        return this._actMaxAttackRangeModifier;
    }
    public setActMaxAttackRangeModifier(value: string | null | undefined): void {
        this._actMaxAttackRangeModifier = value;
    }

    public checkHasActVisionRangeModifier(): boolean {
        return this._actVisionRangeModifier != null;
    }
    public getActVisionRangeModifier(): string | null | undefined {
        return this._actVisionRangeModifier;
    }
    public setActVisionRangeModifier(value: string | null | undefined): void {
        this._actVisionRangeModifier = value;
    }

    public checkHasActLuckLowerLimitModifier(): boolean {
        return this._actLuckLowerLimitModifier != null;
    }
    public getActLuckLowerLimitModifier(): string | null | undefined {
        return this._actLuckLowerLimitModifier;
    }
    public setActLuckLowerLimitModifier(value: string | null | undefined): void {
        this._actLuckLowerLimitModifier = value;
    }

    public checkHasActLuckUpperLimitModifier(): boolean {
        return this._actLuckUpperLimitModifier != null;
    }
    public getActLuckUpperLimitModifier(): string | null | undefined {
        return this._actLuckUpperLimitModifier;
    }
    public setActLuckUpperLimitModifier(value: string | null | undefined): void {
        this._actLuckUpperLimitModifier = value;
    }

    public checkHasActFlareRangeModifier(): boolean {
        return this._actFlareRangeModifier != null;
    }
    public getActFlareRangeModifier(): string | null | undefined {
        return this._actFlareRangeModifier;
    }
    public setActFlareRangeModifier(value: string | null | undefined): void {
        this._actFlareRangeModifier = value;
    }

    public checkHasActFlareRadiusModifier(): boolean {
        return this._actFlareRadiusModifier != null;
    }
    public getActFlareRadiusModifier(): string | null | undefined {
        return this._actFlareRadiusModifier;
    }
    public setActFlareRadiusModifier(value: string | null | undefined): void {
        this._actFlareRadiusModifier = value;
    }

    public checkHasActCanAttackAfterMoving(): boolean {
        return this._actCanAttackAfterMoving != null;
    }
    public getActCanAttackAfterMoving(): string | null | undefined {
        return this._actCanAttackAfterMoving;
    }
    public setActCanAttackAfterMoving(value: string | null | undefined): void {
        this._actCanAttackAfterMoving = value;
    }

    public checkHasActIsPenetratingVision(): boolean {
        return this._actIsPenetratingVision != null;
    }
    public getActIsPenetratingVision(): string | null | undefined {
        return this._actIsPenetratingVision;
    }
    public setActIsPenetratingVision(value: string | null | undefined): void {
        this._actIsPenetratingVision = value;
    }
}
