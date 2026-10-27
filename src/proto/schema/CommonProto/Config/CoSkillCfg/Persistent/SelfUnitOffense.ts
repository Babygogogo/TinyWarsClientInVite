import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";
import { Conditions as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$Conditions, type ConditionsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$Conditions } from "./SelfUnitOffense/Conditions.js";
import { OffensePercentOffsetFrom as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$OffensePercentOffsetFrom, type OffensePercentOffsetFromJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$OffensePercentOffsetFrom } from "./SelfUnitOffense/OffensePercentOffsetFrom.js";

export interface SelfUnitOffenseJson extends $ProtoSchemaJsonBase {
    conditions?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$Conditions | null | undefined;
    offensePercentOffsetFrom?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$OffensePercentOffsetFrom | null | undefined;
}

export class SelfUnitOffense extends $ProtoSchemaBase {
    private _conditions?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$Conditions | null | undefined;
    private _offensePercentOffsetFrom?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$OffensePercentOffsetFrom | null | undefined;

    public static fromJson(obj: SelfUnitOffenseJson): SelfUnitOffense {
        return new SelfUnitOffense().loadJson(obj);
    }
    public override loadJson(obj: SelfUnitOffenseJson): this {
        this.setConditions(obj.conditions != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$Conditions.fromJson(obj.conditions) : null);
        this.setOffensePercentOffsetFrom(obj.offensePercentOffsetFrom != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$OffensePercentOffsetFrom.fromJson(obj.offensePercentOffsetFrom) : null);
        return this;
    }
    public override toJson(obj?: SelfUnitOffenseJson): SelfUnitOffenseJson {
        obj ??= ({} as SelfUnitOffenseJson);

        {
            const value = this.getConditions();
            (value != null) && (obj.conditions = value.toJson());
        }

        {
            const value = this.getOffensePercentOffsetFrom();
            (value != null) && (obj.offensePercentOffsetFrom = value.toJson());
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

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfUnitOffense {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfUnitOffense();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConditions($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$Conditions.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setOffensePercentOffsetFrom($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$OffensePercentOffsetFrom.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfUnitOffense {
        return SelfUnitOffense.decode(this.encode());
    }

    public override getSchemaName(): "SelfUnitOffense" {
        return "SelfUnitOffense";
    }

    public checkHasConditions(): boolean {
        return this._conditions != null;
    }
    public getConditions(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$Conditions | null | undefined {
        return this._conditions;
    }
    public setConditions(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$Conditions | null | undefined): void {
        this._conditions = value;
    }
    public createIfNotExistsConditions(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$Conditions {
        return this._conditions ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$Conditions();
    }

    public checkHasOffensePercentOffsetFrom(): boolean {
        return this._offensePercentOffsetFrom != null;
    }
    public getOffensePercentOffsetFrom(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$OffensePercentOffsetFrom | null | undefined {
        return this._offensePercentOffsetFrom;
    }
    public setOffensePercentOffsetFrom(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$OffensePercentOffsetFrom | null | undefined): void {
        this._offensePercentOffsetFrom = value;
    }
    public createIfNotExistsOffensePercentOffsetFrom(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$OffensePercentOffsetFrom {
        return this._offensePercentOffsetFrom ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitOffense$OffensePercentOffsetFrom();
    }
}
