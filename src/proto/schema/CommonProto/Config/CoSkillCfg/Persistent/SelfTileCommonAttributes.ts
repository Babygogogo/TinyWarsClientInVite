import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";
import { Conditions as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Conditions, type ConditionsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Conditions } from "./SelfTileCommonAttributes/Conditions.js";
import { IncomeOffsets as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$IncomeOffsets, type IncomeOffsetsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$IncomeOffsets } from "./SelfTileCommonAttributes/IncomeOffsets.js";
import { RepairAmountOffsets as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmountOffsets, type RepairAmountOffsetsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmountOffsets } from "./SelfTileCommonAttributes/RepairAmountOffsets.js";
import { UnitProductionPermissions as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$UnitProductionPermissions, type UnitProductionPermissionsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$UnitProductionPermissions } from "./SelfTileCommonAttributes/UnitProductionPermissions.js";

export interface SelfTileCommonAttributesJson extends $ProtoSchemaJsonBase {
    conditions?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Conditions | null | undefined;
    incomeOffsets?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$IncomeOffsets | null | undefined;
    unitProductionPermissions?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$UnitProductionPermissions | null | undefined;
    repairAmountOffsets?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmountOffsets | null | undefined;
}

export class SelfTileCommonAttributes extends $ProtoSchemaBase {
    private _conditions?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Conditions | null | undefined;
    private _incomeOffsets?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$IncomeOffsets | null | undefined;
    private _unitProductionPermissions?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$UnitProductionPermissions | null | undefined;
    private _repairAmountOffsets?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmountOffsets | null | undefined;

    public static fromJson(obj: SelfTileCommonAttributesJson): SelfTileCommonAttributes {
        return new SelfTileCommonAttributes().loadJson(obj);
    }
    public override loadJson(obj: SelfTileCommonAttributesJson): this {
        this.setConditions(obj.conditions != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Conditions.fromJson(obj.conditions) : null);
        this.setIncomeOffsets(obj.incomeOffsets != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$IncomeOffsets.fromJson(obj.incomeOffsets) : null);
        this.setUnitProductionPermissions(obj.unitProductionPermissions != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$UnitProductionPermissions.fromJson(obj.unitProductionPermissions) : null);
        this.setRepairAmountOffsets(obj.repairAmountOffsets != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmountOffsets.fromJson(obj.repairAmountOffsets) : null);
        return this;
    }
    public override toJson(obj?: SelfTileCommonAttributesJson): SelfTileCommonAttributesJson {
        obj ??= ({} as SelfTileCommonAttributesJson);

        {
            const value = this.getConditions();
            (value != null) && (obj.conditions = value.toJson());
        }

        {
            const value = this.getIncomeOffsets();
            (value != null) && (obj.incomeOffsets = value.toJson());
        }

        {
            const value = this.getUnitProductionPermissions();
            (value != null) && (obj.unitProductionPermissions = value.toJson());
        }

        {
            const value = this.getRepairAmountOffsets();
            (value != null) && (obj.repairAmountOffsets = value.toJson());
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
            const value = this.getIncomeOffsets();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getUnitProductionPermissions();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getRepairAmountOffsets();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfTileCommonAttributes {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfTileCommonAttributes();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConditions($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Conditions.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setIncomeOffsets($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$IncomeOffsets.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setUnitProductionPermissions($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$UnitProductionPermissions.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setRepairAmountOffsets($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmountOffsets.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfTileCommonAttributes {
        return SelfTileCommonAttributes.decode(this.encode());
    }

    public override getSchemaName(): "SelfTileCommonAttributes" {
        return "SelfTileCommonAttributes";
    }

    public checkHasConditions(): boolean {
        return this._conditions != null;
    }
    public getConditions(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Conditions | null | undefined {
        return this._conditions;
    }
    public setConditions(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Conditions | null | undefined): void {
        this._conditions = value;
    }
    public createIfNotExistsConditions(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Conditions {
        return this._conditions ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Conditions();
    }

    public checkHasIncomeOffsets(): boolean {
        return this._incomeOffsets != null;
    }
    public getIncomeOffsets(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$IncomeOffsets | null | undefined {
        return this._incomeOffsets;
    }
    public setIncomeOffsets(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$IncomeOffsets | null | undefined): void {
        this._incomeOffsets = value;
    }
    public createIfNotExistsIncomeOffsets(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$IncomeOffsets {
        return this._incomeOffsets ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$IncomeOffsets();
    }

    public checkHasUnitProductionPermissions(): boolean {
        return this._unitProductionPermissions != null;
    }
    public getUnitProductionPermissions(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$UnitProductionPermissions | null | undefined {
        return this._unitProductionPermissions;
    }
    public setUnitProductionPermissions(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$UnitProductionPermissions | null | undefined): void {
        this._unitProductionPermissions = value;
    }
    public createIfNotExistsUnitProductionPermissions(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$UnitProductionPermissions {
        return this._unitProductionPermissions ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$UnitProductionPermissions();
    }

    public checkHasRepairAmountOffsets(): boolean {
        return this._repairAmountOffsets != null;
    }
    public getRepairAmountOffsets(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmountOffsets | null | undefined {
        return this._repairAmountOffsets;
    }
    public setRepairAmountOffsets(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmountOffsets | null | undefined): void {
        this._repairAmountOffsets = value;
    }
    public createIfNotExistsRepairAmountOffsets(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmountOffsets {
        return this._repairAmountOffsets ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmountOffsets();
    }
}
