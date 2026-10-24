import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SelfFundAfterBattle as $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfFundAfterBattle, type SelfFundAfterBattleJson as $Json$CommonProto$Config$CoSkillCfg$InstantMisc$SelfFundAfterBattle } from "./InstantMisc/SelfFundAfterBattle.js";
import { SelfPostOperationPlunder as $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfPostOperationPlunder, type SelfPostOperationPlunderJson as $Json$CommonProto$Config$CoSkillCfg$InstantMisc$SelfPostOperationPlunder } from "./InstantMisc/SelfPostOperationPlunder.js";
import { SelfUnitHpAfterWait as $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitHpAfterWait, type SelfUnitHpAfterWaitJson as $Json$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitHpAfterWait } from "./InstantMisc/SelfUnitHpAfterWait.js";
import { SelfUnitPromotionAfterBattle as $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitPromotionAfterBattle, type SelfUnitPromotionAfterBattleJson as $Json$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitPromotionAfterBattle } from "./InstantMisc/SelfUnitPromotionAfterBattle.js";
import { SelfUnitTeleportAfterProduction as $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitTeleportAfterProduction, type SelfUnitTeleportAfterProductionJson as $Json$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitTeleportAfterProduction } from "./InstantMisc/SelfUnitTeleportAfterProduction.js";

export interface InstantMiscJson extends $ProtoSchemaJsonBase {
    selfPostOperationPlunder?: $Json$CommonProto$Config$CoSkillCfg$InstantMisc$SelfPostOperationPlunder | null | undefined;
    selfUnitPromotionAfterBattle?: $Json$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitPromotionAfterBattle | null | undefined;
    selfFundAfterBattle?: $Json$CommonProto$Config$CoSkillCfg$InstantMisc$SelfFundAfterBattle | null | undefined;
    selfUnitHpAfterWait?: $Json$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitHpAfterWait | null | undefined;
    selfUnitTeleportAfterProduction?: $Json$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitTeleportAfterProduction | null | undefined;
}

export class InstantMisc extends $ProtoSchemaBase {
    private _selfPostOperationPlunder?: $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfPostOperationPlunder | null | undefined;
    private _selfUnitPromotionAfterBattle?: $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitPromotionAfterBattle | null | undefined;
    private _selfFundAfterBattle?: $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfFundAfterBattle | null | undefined;
    private _selfUnitHpAfterWait?: $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitHpAfterWait | null | undefined;
    private _selfUnitTeleportAfterProduction?: $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitTeleportAfterProduction | null | undefined;

    public static fromJson(obj: InstantMiscJson): InstantMisc {
        return new InstantMisc().loadJson(obj);
    }
    public override loadJson(obj: InstantMiscJson): this {
        this.setSelfPostOperationPlunder(obj.selfPostOperationPlunder != null ? $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfPostOperationPlunder.fromJson(obj.selfPostOperationPlunder) : null);
        this.setSelfUnitPromotionAfterBattle(obj.selfUnitPromotionAfterBattle != null ? $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitPromotionAfterBattle.fromJson(obj.selfUnitPromotionAfterBattle) : null);
        this.setSelfFundAfterBattle(obj.selfFundAfterBattle != null ? $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfFundAfterBattle.fromJson(obj.selfFundAfterBattle) : null);
        this.setSelfUnitHpAfterWait(obj.selfUnitHpAfterWait != null ? $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitHpAfterWait.fromJson(obj.selfUnitHpAfterWait) : null);
        this.setSelfUnitTeleportAfterProduction(obj.selfUnitTeleportAfterProduction != null ? $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitTeleportAfterProduction.fromJson(obj.selfUnitTeleportAfterProduction) : null);
        return this;
    }
    public override toJson(obj?: InstantMiscJson): InstantMiscJson {
        obj ??= ({} as InstantMiscJson);

        {
            const value = this.getSelfPostOperationPlunder();
            (value != null) && (obj.selfPostOperationPlunder = value.toJson());
        }

        {
            const value = this.getSelfUnitPromotionAfterBattle();
            (value != null) && (obj.selfUnitPromotionAfterBattle = value.toJson());
        }

        {
            const value = this.getSelfFundAfterBattle();
            (value != null) && (obj.selfFundAfterBattle = value.toJson());
        }

        {
            const value = this.getSelfUnitHpAfterWait();
            (value != null) && (obj.selfUnitHpAfterWait = value.toJson());
        }

        {
            const value = this.getSelfUnitTeleportAfterProduction();
            (value != null) && (obj.selfUnitTeleportAfterProduction = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSelfPostOperationPlunder();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfUnitPromotionAfterBattle();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfFundAfterBattle();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfUnitHpAfterWait();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfUnitTeleportAfterProduction();
            if (value != null) {
                value.toWriter(writer.uint32(42).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): InstantMisc {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new InstantMisc();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSelfPostOperationPlunder($Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfPostOperationPlunder.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setSelfUnitPromotionAfterBattle($Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitPromotionAfterBattle.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setSelfFundAfterBattle($Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfFundAfterBattle.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setSelfUnitHpAfterWait($Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitHpAfterWait.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setSelfUnitTeleportAfterProduction($Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitTeleportAfterProduction.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): InstantMisc {
        return InstantMisc.decode(this.encode());
    }

    public override getSchemaName(): "InstantMisc" {
        return "InstantMisc";
    }

    public checkHasSelfPostOperationPlunder(): boolean {
        return this._selfPostOperationPlunder != null;
    }
    public getSelfPostOperationPlunder(): $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfPostOperationPlunder | null | undefined {
        return this._selfPostOperationPlunder;
    }
    public setSelfPostOperationPlunder(value: $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfPostOperationPlunder | null | undefined): void {
        this._selfPostOperationPlunder = value;
    }
    public createIfNotExistsSelfPostOperationPlunder(): $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfPostOperationPlunder {
        return this._selfPostOperationPlunder ??= new $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfPostOperationPlunder();
    }

    public checkHasSelfUnitPromotionAfterBattle(): boolean {
        return this._selfUnitPromotionAfterBattle != null;
    }
    public getSelfUnitPromotionAfterBattle(): $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitPromotionAfterBattle | null | undefined {
        return this._selfUnitPromotionAfterBattle;
    }
    public setSelfUnitPromotionAfterBattle(value: $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitPromotionAfterBattle | null | undefined): void {
        this._selfUnitPromotionAfterBattle = value;
    }
    public createIfNotExistsSelfUnitPromotionAfterBattle(): $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitPromotionAfterBattle {
        return this._selfUnitPromotionAfterBattle ??= new $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitPromotionAfterBattle();
    }

    public checkHasSelfFundAfterBattle(): boolean {
        return this._selfFundAfterBattle != null;
    }
    public getSelfFundAfterBattle(): $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfFundAfterBattle | null | undefined {
        return this._selfFundAfterBattle;
    }
    public setSelfFundAfterBattle(value: $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfFundAfterBattle | null | undefined): void {
        this._selfFundAfterBattle = value;
    }
    public createIfNotExistsSelfFundAfterBattle(): $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfFundAfterBattle {
        return this._selfFundAfterBattle ??= new $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfFundAfterBattle();
    }

    public checkHasSelfUnitHpAfterWait(): boolean {
        return this._selfUnitHpAfterWait != null;
    }
    public getSelfUnitHpAfterWait(): $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitHpAfterWait | null | undefined {
        return this._selfUnitHpAfterWait;
    }
    public setSelfUnitHpAfterWait(value: $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitHpAfterWait | null | undefined): void {
        this._selfUnitHpAfterWait = value;
    }
    public createIfNotExistsSelfUnitHpAfterWait(): $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitHpAfterWait {
        return this._selfUnitHpAfterWait ??= new $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitHpAfterWait();
    }

    public checkHasSelfUnitTeleportAfterProduction(): boolean {
        return this._selfUnitTeleportAfterProduction != null;
    }
    public getSelfUnitTeleportAfterProduction(): $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitTeleportAfterProduction | null | undefined {
        return this._selfUnitTeleportAfterProduction;
    }
    public setSelfUnitTeleportAfterProduction(value: $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitTeleportAfterProduction | null | undefined): void {
        this._selfUnitTeleportAfterProduction = value;
    }
    public createIfNotExistsSelfUnitTeleportAfterProduction(): $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitTeleportAfterProduction {
        return this._selfUnitTeleportAfterProduction ??= new $Message$CommonProto$Config$CoSkillCfg$InstantMisc$SelfUnitTeleportAfterProduction();
    }
}
