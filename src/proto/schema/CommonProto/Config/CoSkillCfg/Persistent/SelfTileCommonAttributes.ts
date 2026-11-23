import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";
import { Conditions as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Conditions, type ConditionsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Conditions } from "./SelfTileCommonAttributes/Conditions.js";
import { Incomes as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Incomes, type IncomesJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Incomes } from "./SelfTileCommonAttributes/Incomes.js";
import { RepairAmounts as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmounts, type RepairAmountsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmounts } from "./SelfTileCommonAttributes/RepairAmounts.js";
import { RepairCosts as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairCosts, type RepairCostsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairCosts } from "./SelfTileCommonAttributes/RepairCosts.js";
import { UnitProductionPermissions as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$UnitProductionPermissions, type UnitProductionPermissionsJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$UnitProductionPermissions } from "./SelfTileCommonAttributes/UnitProductionPermissions.js";

export interface SelfTileCommonAttributesJson extends $ProtoSchemaJsonBase {
    conditions?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Conditions | null | undefined;
    incomes?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Incomes | null | undefined;
    unitProductionPermissions?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$UnitProductionPermissions | null | undefined;
    repairAmounts?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmounts | null | undefined;
    repairCosts?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairCosts | null | undefined;
}

export class SelfTileCommonAttributes extends $ProtoSchemaBase {
    private _conditions?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Conditions | null | undefined;
    private _incomes?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Incomes | null | undefined;
    private _unitProductionPermissions?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$UnitProductionPermissions | null | undefined;
    private _repairAmounts?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmounts | null | undefined;
    private _repairCosts?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairCosts | null | undefined;

    public static fromJson(obj: SelfTileCommonAttributesJson): SelfTileCommonAttributes {
        return new SelfTileCommonAttributes().loadJson(obj);
    }
    public override loadJson(obj: SelfTileCommonAttributesJson): this {
        this.setConditions(obj.conditions != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Conditions.fromJson(obj.conditions) : null);
        this.setIncomes(obj.incomes != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Incomes.fromJson(obj.incomes) : null);
        this.setUnitProductionPermissions(obj.unitProductionPermissions != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$UnitProductionPermissions.fromJson(obj.unitProductionPermissions) : null);
        this.setRepairAmounts(obj.repairAmounts != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmounts.fromJson(obj.repairAmounts) : null);
        this.setRepairCosts(obj.repairCosts != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairCosts.fromJson(obj.repairCosts) : null);
        return this;
    }
    public override toJson(obj?: SelfTileCommonAttributesJson): SelfTileCommonAttributesJson {
        obj ??= ({} as SelfTileCommonAttributesJson);

        {
            const value = this.getConditions();
            (value != null) && (obj.conditions = value.toJson());
        }

        {
            const value = this.getIncomes();
            (value != null) && (obj.incomes = value.toJson());
        }

        {
            const value = this.getUnitProductionPermissions();
            (value != null) && (obj.unitProductionPermissions = value.toJson());
        }

        {
            const value = this.getRepairAmounts();
            (value != null) && (obj.repairAmounts = value.toJson());
        }

        {
            const value = this.getRepairCosts();
            (value != null) && (obj.repairCosts = value.toJson());
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
            const value = this.getIncomes();
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
            const value = this.getRepairAmounts();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getRepairCosts();
            if (value != null) {
                value.toWriter(writer.uint32(42).fork()).ldelim();
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
                    msg.setIncomes($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Incomes.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setUnitProductionPermissions($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$UnitProductionPermissions.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setRepairAmounts($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmounts.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setRepairCosts($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairCosts.decode(reader, reader.uint32()));
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

    public checkHasIncomes(): boolean {
        return this._incomes != null;
    }
    public getIncomes(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Incomes | null | undefined {
        return this._incomes;
    }
    public setIncomes(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Incomes | null | undefined): void {
        this._incomes = value;
    }
    public createIfNotExistsIncomes(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Incomes {
        return this._incomes ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$Incomes();
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

    public checkHasRepairAmounts(): boolean {
        return this._repairAmounts != null;
    }
    public getRepairAmounts(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmounts | null | undefined {
        return this._repairAmounts;
    }
    public setRepairAmounts(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmounts | null | undefined): void {
        this._repairAmounts = value;
    }
    public createIfNotExistsRepairAmounts(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmounts {
        return this._repairAmounts ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairAmounts();
    }

    public checkHasRepairCosts(): boolean {
        return this._repairCosts != null;
    }
    public getRepairCosts(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairCosts | null | undefined {
        return this._repairCosts;
    }
    public setRepairCosts(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairCosts | null | undefined): void {
        this._repairCosts = value;
    }
    public createIfNotExistsRepairCosts(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairCosts {
        return this._repairCosts ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes$RepairCosts();
    }
}
