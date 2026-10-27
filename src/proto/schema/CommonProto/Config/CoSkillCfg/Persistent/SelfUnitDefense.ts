import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";
import { Conditions as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$Conditions, type ConditionsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$Conditions } from "./SelfUnitDefense/Conditions.js";
import { DefensePercentOffsetFrom as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$DefensePercentOffsetFrom, type DefensePercentOffsetFromJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$DefensePercentOffsetFrom } from "./SelfUnitDefense/DefensePercentOffsetFrom.js";

export interface SelfUnitDefenseJson extends $ProtoSchemaJsonBase {
    conditions?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$Conditions | null | undefined;
    defensePercentOffsetFrom?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$DefensePercentOffsetFrom | null | undefined;
}

export class SelfUnitDefense extends $ProtoSchemaBase {
    private _conditions?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$Conditions | null | undefined;
    private _defensePercentOffsetFrom?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$DefensePercentOffsetFrom | null | undefined;

    public static fromJson(obj: SelfUnitDefenseJson): SelfUnitDefense {
        return new SelfUnitDefense().loadJson(obj);
    }
    public override loadJson(obj: SelfUnitDefenseJson): this {
        this.setConditions(obj.conditions != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$Conditions.fromJson(obj.conditions) : null);
        this.setDefensePercentOffsetFrom(obj.defensePercentOffsetFrom != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$DefensePercentOffsetFrom.fromJson(obj.defensePercentOffsetFrom) : null);
        return this;
    }
    public override toJson(obj?: SelfUnitDefenseJson): SelfUnitDefenseJson {
        obj ??= ({} as SelfUnitDefenseJson);

        {
            const value = this.getConditions();
            (value != null) && (obj.conditions = value.toJson());
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
            const value = this.getDefensePercentOffsetFrom();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfUnitDefense {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfUnitDefense();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConditions($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$Conditions.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setDefensePercentOffsetFrom($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$DefensePercentOffsetFrom.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfUnitDefense {
        return SelfUnitDefense.decode(this.encode());
    }

    public override getSchemaName(): "SelfUnitDefense" {
        return "SelfUnitDefense";
    }

    public checkHasConditions(): boolean {
        return this._conditions != null;
    }
    public getConditions(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$Conditions | null | undefined {
        return this._conditions;
    }
    public setConditions(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$Conditions | null | undefined): void {
        this._conditions = value;
    }
    public createIfNotExistsConditions(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$Conditions {
        return this._conditions ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$Conditions();
    }

    public checkHasDefensePercentOffsetFrom(): boolean {
        return this._defensePercentOffsetFrom != null;
    }
    public getDefensePercentOffsetFrom(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$DefensePercentOffsetFrom | null | undefined {
        return this._defensePercentOffsetFrom;
    }
    public setDefensePercentOffsetFrom(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$DefensePercentOffsetFrom | null | undefined): void {
        this._defensePercentOffsetFrom = value;
    }
    public createIfNotExistsDefensePercentOffsetFrom(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$DefensePercentOffsetFrom {
        return this._defensePercentOffsetFrom ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitDefense$DefensePercentOffsetFrom();
    }
}
