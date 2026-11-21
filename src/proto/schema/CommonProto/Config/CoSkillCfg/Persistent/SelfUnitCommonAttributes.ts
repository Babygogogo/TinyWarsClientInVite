import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";
import { AttackRangeOffsets as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$AttackRangeOffsets, type AttackRangeOffsetsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$AttackRangeOffsets } from "./SelfUnitCommonAttributes/AttackRangeOffsets.js";
import { Conditions as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions, type ConditionsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions } from "./SelfUnitCommonAttributes/Conditions.js";
import { DefensePercentOffsets as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsets, type DefensePercentOffsetsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsets } from "./SelfUnitCommonAttributes/DefensePercentOffsets.js";
import { FuelConsumptions as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$FuelConsumptions, type FuelConsumptionsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$FuelConsumptions } from "./SelfUnitCommonAttributes/FuelConsumptions.js";
import { LuckRangeOffsets as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$LuckRangeOffsets, type LuckRangeOffsetsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$LuckRangeOffsets } from "./SelfUnitCommonAttributes/LuckRangeOffsets.js";
import { MoveRangeOffsets as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$MoveRangeOffsets, type MoveRangeOffsetsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$MoveRangeOffsets } from "./SelfUnitCommonAttributes/MoveRangeOffsets.js";
import { OffensePercentOffsets as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsets, type OffensePercentOffsetsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsets } from "./SelfUnitCommonAttributes/OffensePercentOffsets.js";
import { Visions as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Visions, type VisionsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Visions } from "./SelfUnitCommonAttributes/Visions.js";

export interface SelfUnitCommonAttributesJson extends $ProtoSchemaJsonBase {
    conditions?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions | null | undefined;
    offensePercentOffsets?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsets | null | undefined;
    defensePercentOffsets?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsets | null | undefined;
    moveRangeOffsets?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$MoveRangeOffsets | null | undefined;
    attackRangeOffsets?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$AttackRangeOffsets | null | undefined;
    visions?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Visions | null | undefined;
    fuelConsumptions?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$FuelConsumptions | null | undefined;
    luckRangeOffsets?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$LuckRangeOffsets | null | undefined;
}

export class SelfUnitCommonAttributes extends $ProtoSchemaBase {
    private _conditions?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions | null | undefined;
    private _offensePercentOffsets?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsets | null | undefined;
    private _defensePercentOffsets?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsets | null | undefined;
    private _moveRangeOffsets?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$MoveRangeOffsets | null | undefined;
    private _attackRangeOffsets?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$AttackRangeOffsets | null | undefined;
    private _visions?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Visions | null | undefined;
    private _fuelConsumptions?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$FuelConsumptions | null | undefined;
    private _luckRangeOffsets?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$LuckRangeOffsets | null | undefined;

    public static fromJson(obj: SelfUnitCommonAttributesJson): SelfUnitCommonAttributes {
        return new SelfUnitCommonAttributes().loadJson(obj);
    }
    public override loadJson(obj: SelfUnitCommonAttributesJson): this {
        this.setConditions(obj.conditions != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions.fromJson(obj.conditions) : null);
        this.setOffensePercentOffsets(obj.offensePercentOffsets != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsets.fromJson(obj.offensePercentOffsets) : null);
        this.setDefensePercentOffsets(obj.defensePercentOffsets != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsets.fromJson(obj.defensePercentOffsets) : null);
        this.setMoveRangeOffsets(obj.moveRangeOffsets != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$MoveRangeOffsets.fromJson(obj.moveRangeOffsets) : null);
        this.setAttackRangeOffsets(obj.attackRangeOffsets != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$AttackRangeOffsets.fromJson(obj.attackRangeOffsets) : null);
        this.setVisions(obj.visions != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Visions.fromJson(obj.visions) : null);
        this.setFuelConsumptions(obj.fuelConsumptions != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$FuelConsumptions.fromJson(obj.fuelConsumptions) : null);
        this.setLuckRangeOffsets(obj.luckRangeOffsets != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$LuckRangeOffsets.fromJson(obj.luckRangeOffsets) : null);
        return this;
    }
    public override toJson(obj?: SelfUnitCommonAttributesJson): SelfUnitCommonAttributesJson {
        obj ??= ({} as SelfUnitCommonAttributesJson);

        {
            const value = this.getConditions();
            (value != null) && (obj.conditions = value.toJson());
        }

        {
            const value = this.getOffensePercentOffsets();
            (value != null) && (obj.offensePercentOffsets = value.toJson());
        }

        {
            const value = this.getDefensePercentOffsets();
            (value != null) && (obj.defensePercentOffsets = value.toJson());
        }

        {
            const value = this.getMoveRangeOffsets();
            (value != null) && (obj.moveRangeOffsets = value.toJson());
        }

        {
            const value = this.getAttackRangeOffsets();
            (value != null) && (obj.attackRangeOffsets = value.toJson());
        }

        {
            const value = this.getVisions();
            (value != null) && (obj.visions = value.toJson());
        }

        {
            const value = this.getFuelConsumptions();
            (value != null) && (obj.fuelConsumptions = value.toJson());
        }

        {
            const value = this.getLuckRangeOffsets();
            (value != null) && (obj.luckRangeOffsets = value.toJson());
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
            const value = this.getOffensePercentOffsets();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getDefensePercentOffsets();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getMoveRangeOffsets();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getAttackRangeOffsets();
            if (value != null) {
                value.toWriter(writer.uint32(42).fork()).ldelim();
            }
        }

        {
            const value = this.getVisions();
            if (value != null) {
                value.toWriter(writer.uint32(50).fork()).ldelim();
            }
        }

        {
            const value = this.getFuelConsumptions();
            if (value != null) {
                value.toWriter(writer.uint32(58).fork()).ldelim();
            }
        }

        {
            const value = this.getLuckRangeOffsets();
            if (value != null) {
                value.toWriter(writer.uint32(66).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfUnitCommonAttributes {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfUnitCommonAttributes();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConditions($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setOffensePercentOffsets($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsets.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setDefensePercentOffsets($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsets.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setMoveRangeOffsets($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$MoveRangeOffsets.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setAttackRangeOffsets($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$AttackRangeOffsets.decode(reader, reader.uint32()));
                    break;

                case 6:
                    msg.setVisions($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Visions.decode(reader, reader.uint32()));
                    break;

                case 7:
                    msg.setFuelConsumptions($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$FuelConsumptions.decode(reader, reader.uint32()));
                    break;

                case 8:
                    msg.setLuckRangeOffsets($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$LuckRangeOffsets.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfUnitCommonAttributes {
        return SelfUnitCommonAttributes.decode(this.encode());
    }

    public override getSchemaName(): "SelfUnitCommonAttributes" {
        return "SelfUnitCommonAttributes";
    }

    public checkHasConditions(): boolean {
        return this._conditions != null;
    }
    public getConditions(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions | null | undefined {
        return this._conditions;
    }
    public setConditions(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions | null | undefined): void {
        this._conditions = value;
    }
    public createIfNotExistsConditions(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions {
        return this._conditions ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions();
    }

    public checkHasOffensePercentOffsets(): boolean {
        return this._offensePercentOffsets != null;
    }
    public getOffensePercentOffsets(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsets | null | undefined {
        return this._offensePercentOffsets;
    }
    public setOffensePercentOffsets(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsets | null | undefined): void {
        this._offensePercentOffsets = value;
    }
    public createIfNotExistsOffensePercentOffsets(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsets {
        return this._offensePercentOffsets ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsets();
    }

    public checkHasDefensePercentOffsets(): boolean {
        return this._defensePercentOffsets != null;
    }
    public getDefensePercentOffsets(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsets | null | undefined {
        return this._defensePercentOffsets;
    }
    public setDefensePercentOffsets(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsets | null | undefined): void {
        this._defensePercentOffsets = value;
    }
    public createIfNotExistsDefensePercentOffsets(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsets {
        return this._defensePercentOffsets ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsets();
    }

    public checkHasMoveRangeOffsets(): boolean {
        return this._moveRangeOffsets != null;
    }
    public getMoveRangeOffsets(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$MoveRangeOffsets | null | undefined {
        return this._moveRangeOffsets;
    }
    public setMoveRangeOffsets(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$MoveRangeOffsets | null | undefined): void {
        this._moveRangeOffsets = value;
    }
    public createIfNotExistsMoveRangeOffsets(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$MoveRangeOffsets {
        return this._moveRangeOffsets ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$MoveRangeOffsets();
    }

    public checkHasAttackRangeOffsets(): boolean {
        return this._attackRangeOffsets != null;
    }
    public getAttackRangeOffsets(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$AttackRangeOffsets | null | undefined {
        return this._attackRangeOffsets;
    }
    public setAttackRangeOffsets(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$AttackRangeOffsets | null | undefined): void {
        this._attackRangeOffsets = value;
    }
    public createIfNotExistsAttackRangeOffsets(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$AttackRangeOffsets {
        return this._attackRangeOffsets ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$AttackRangeOffsets();
    }

    public checkHasVisions(): boolean {
        return this._visions != null;
    }
    public getVisions(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Visions | null | undefined {
        return this._visions;
    }
    public setVisions(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Visions | null | undefined): void {
        this._visions = value;
    }
    public createIfNotExistsVisions(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Visions {
        return this._visions ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Visions();
    }

    public checkHasFuelConsumptions(): boolean {
        return this._fuelConsumptions != null;
    }
    public getFuelConsumptions(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$FuelConsumptions | null | undefined {
        return this._fuelConsumptions;
    }
    public setFuelConsumptions(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$FuelConsumptions | null | undefined): void {
        this._fuelConsumptions = value;
    }
    public createIfNotExistsFuelConsumptions(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$FuelConsumptions {
        return this._fuelConsumptions ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$FuelConsumptions();
    }

    public checkHasLuckRangeOffsets(): boolean {
        return this._luckRangeOffsets != null;
    }
    public getLuckRangeOffsets(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$LuckRangeOffsets | null | undefined {
        return this._luckRangeOffsets;
    }
    public setLuckRangeOffsets(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$LuckRangeOffsets | null | undefined): void {
        this._luckRangeOffsets = value;
    }
    public createIfNotExistsLuckRangeOffsets(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$LuckRangeOffsets {
        return this._luckRangeOffsets ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$LuckRangeOffsets();
    }
}
