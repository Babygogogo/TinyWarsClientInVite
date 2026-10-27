import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";
import { Conditions as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions, type ConditionsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions } from "./SelfUnitCommonAttributes/Conditions.js";
import { DefensePercentOffsetFrom as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsetFrom, type DefensePercentOffsetFromJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsetFrom } from "./SelfUnitCommonAttributes/DefensePercentOffsetFrom.js";
import { OffensePercentOffsetFrom as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsetFrom, type OffensePercentOffsetFromJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsetFrom } from "./SelfUnitCommonAttributes/OffensePercentOffsetFrom.js";

export interface SelfUnitCommonAttributesJson extends $ProtoSchemaJsonBase {
    conditions?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions | null | undefined;
    offensePercentOffsetFrom?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsetFrom | null | undefined;
    defensePercentOffsetFrom?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsetFrom | null | undefined;
}

export class SelfUnitCommonAttributes extends $ProtoSchemaBase {
    private _conditions?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions | null | undefined;
    private _offensePercentOffsetFrom?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsetFrom | null | undefined;
    private _defensePercentOffsetFrom?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsetFrom | null | undefined;

    public static fromJson(obj: SelfUnitCommonAttributesJson): SelfUnitCommonAttributes {
        return new SelfUnitCommonAttributes().loadJson(obj);
    }
    public override loadJson(obj: SelfUnitCommonAttributesJson): this {
        this.setConditions(obj.conditions != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$Conditions.fromJson(obj.conditions) : null);
        this.setOffensePercentOffsetFrom(obj.offensePercentOffsetFrom != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsetFrom.fromJson(obj.offensePercentOffsetFrom) : null);
        this.setDefensePercentOffsetFrom(obj.defensePercentOffsetFrom != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsetFrom.fromJson(obj.defensePercentOffsetFrom) : null);
        return this;
    }
    public override toJson(obj?: SelfUnitCommonAttributesJson): SelfUnitCommonAttributesJson {
        obj ??= ({} as SelfUnitCommonAttributesJson);

        {
            const value = this.getConditions();
            (value != null) && (obj.conditions = value.toJson());
        }

        {
            const value = this.getOffensePercentOffsetFrom();
            (value != null) && (obj.offensePercentOffsetFrom = value.toJson());
        }

        {
            const value = this.getDefensePercentOffsetFrom();
            (value != null) && (obj.defensePercentOffsetFrom = value.toJson());
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
            const value = this.getOffensePercentOffsetFrom();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getDefensePercentOffsetFrom();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
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
                    msg.setOffensePercentOffsetFrom($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsetFrom.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setDefensePercentOffsetFrom($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsetFrom.decode(reader, reader.uint32()));
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

    public checkHasOffensePercentOffsetFrom(): boolean {
        return this._offensePercentOffsetFrom != null;
    }
    public getOffensePercentOffsetFrom(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsetFrom | null | undefined {
        return this._offensePercentOffsetFrom;
    }
    public setOffensePercentOffsetFrom(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsetFrom | null | undefined): void {
        this._offensePercentOffsetFrom = value;
    }
    public createIfNotExistsOffensePercentOffsetFrom(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsetFrom {
        return this._offensePercentOffsetFrom ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$OffensePercentOffsetFrom();
    }

    public checkHasDefensePercentOffsetFrom(): boolean {
        return this._defensePercentOffsetFrom != null;
    }
    public getDefensePercentOffsetFrom(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsetFrom | null | undefined {
        return this._defensePercentOffsetFrom;
    }
    public setDefensePercentOffsetFrom(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsetFrom | null | undefined): void {
        this._defensePercentOffsetFrom = value;
    }
    public createIfNotExistsDefensePercentOffsetFrom(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsetFrom {
        return this._defensePercentOffsetFrom ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes$DefensePercentOffsetFrom();
    }
}
