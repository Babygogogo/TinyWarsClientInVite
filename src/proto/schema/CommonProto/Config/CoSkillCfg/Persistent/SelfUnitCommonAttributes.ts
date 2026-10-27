import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";
import { Conditions as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions, type ConditionsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions } from "./SelfUnitCommonAttributes/Conditions.js";
import { DefensePercentOffsets as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsets, type DefensePercentOffsetsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsets } from "./SelfUnitCommonAttributes/DefensePercentOffsets.js";
import { MoveRangeOffsets as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$MoveRangeOffsets, type MoveRangeOffsetsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$MoveRangeOffsets } from "./SelfUnitCommonAttributes/MoveRangeOffsets.js";
import { OffensePercentOffsets as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsets, type OffensePercentOffsetsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsets } from "./SelfUnitCommonAttributes/OffensePercentOffsets.js";

export interface SelfUnitCommonAttributesJson extends $ProtoSchemaJsonBase {
    conditions?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions | null | undefined;
    offensePercentOffsets?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsets | null | undefined;
    defensePercentOffsets?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsets | null | undefined;
    moveRangeOffsets?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$MoveRangeOffsets | null | undefined;
}

export class SelfUnitCommonAttributes extends $ProtoSchemaBase {
    private _conditions?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions | null | undefined;
    private _offensePercentOffsets?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsets | null | undefined;
    private _defensePercentOffsets?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsets | null | undefined;
    private _moveRangeOffsets?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$MoveRangeOffsets | null | undefined;

    public static fromJson(obj: SelfUnitCommonAttributesJson): SelfUnitCommonAttributes {
        return new SelfUnitCommonAttributes().loadJson(obj);
    }
    public override loadJson(obj: SelfUnitCommonAttributesJson): this {
        this.setConditions(obj.conditions != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions.fromJson(obj.conditions) : null);
        this.setOffensePercentOffsets(obj.offensePercentOffsets != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsets.fromJson(obj.offensePercentOffsets) : null);
        this.setDefensePercentOffsets(obj.defensePercentOffsets != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsets.fromJson(obj.defensePercentOffsets) : null);
        this.setMoveRangeOffsets(obj.moveRangeOffsets != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$MoveRangeOffsets.fromJson(obj.moveRangeOffsets) : null);
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
}
