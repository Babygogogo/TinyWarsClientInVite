import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SelfFuelRecovery as $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfFuelRecovery, type SelfFuelRecoveryJson as $Json$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfFuelRecovery } from "./InstantPeriodic/SelfFuelRecovery.js";
import { SelfHpRecovery as $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfHpRecovery, type SelfHpRecoveryJson as $Json$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfHpRecovery } from "./InstantPeriodic/SelfHpRecovery.js";
import { SelfPrimaryAmmoRecovery as $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfPrimaryAmmoRecovery, type SelfPrimaryAmmoRecoveryJson as $Json$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfPrimaryAmmoRecovery } from "./InstantPeriodic/SelfPrimaryAmmoRecovery.js";

export interface InstantPeriodicJson extends $ProtoSchemaJsonBase {
    selfHpRecovery?: $Json$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfHpRecovery | null | undefined;
    selfPrimaryAmmoRecovery?: $Json$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfPrimaryAmmoRecovery | null | undefined;
    selfFuelRecovery?: $Json$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfFuelRecovery | null | undefined;
}

export class InstantPeriodic extends $ProtoSchemaBase {
    private _selfHpRecovery?: $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfHpRecovery | null | undefined;
    private _selfPrimaryAmmoRecovery?: $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfPrimaryAmmoRecovery | null | undefined;
    private _selfFuelRecovery?: $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfFuelRecovery | null | undefined;

    public static fromJson(obj: InstantPeriodicJson): InstantPeriodic {
        return new InstantPeriodic().loadJson(obj);
    }
    public override loadJson(obj: InstantPeriodicJson): this {
        this.setSelfHpRecovery(obj.selfHpRecovery != null ? $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfHpRecovery.fromJson(obj.selfHpRecovery) : null);
        this.setSelfPrimaryAmmoRecovery(obj.selfPrimaryAmmoRecovery != null ? $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfPrimaryAmmoRecovery.fromJson(obj.selfPrimaryAmmoRecovery) : null);
        this.setSelfFuelRecovery(obj.selfFuelRecovery != null ? $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfFuelRecovery.fromJson(obj.selfFuelRecovery) : null);
        return this;
    }
    public override toJson(obj?: InstantPeriodicJson): InstantPeriodicJson {
        obj ??= ({} as InstantPeriodicJson);

        {
            const value = this.getSelfHpRecovery();
            (value != null) && (obj.selfHpRecovery = value.toJson());
        }

        {
            const value = this.getSelfPrimaryAmmoRecovery();
            (value != null) && (obj.selfPrimaryAmmoRecovery = value.toJson());
        }

        {
            const value = this.getSelfFuelRecovery();
            (value != null) && (obj.selfFuelRecovery = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSelfHpRecovery();
            if (value != null) {
                value.toWriter(writer.uint32(562).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfPrimaryAmmoRecovery();
            if (value != null) {
                value.toWriter(writer.uint32(570).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfFuelRecovery();
            if (value != null) {
                value.toWriter(writer.uint32(578).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): InstantPeriodic {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new InstantPeriodic();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 70:
                    msg.setSelfHpRecovery($Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfHpRecovery.decode(reader, reader.uint32()));
                    break;

                case 71:
                    msg.setSelfPrimaryAmmoRecovery($Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfPrimaryAmmoRecovery.decode(reader, reader.uint32()));
                    break;

                case 72:
                    msg.setSelfFuelRecovery($Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfFuelRecovery.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): InstantPeriodic {
        return InstantPeriodic.decode(this.encode());
    }

    public override getSchemaName(): "InstantPeriodic" {
        return "InstantPeriodic";
    }

    public checkHasSelfHpRecovery(): boolean {
        return this._selfHpRecovery != null;
    }
    public getSelfHpRecovery(): $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfHpRecovery | null | undefined {
        return this._selfHpRecovery;
    }
    public setSelfHpRecovery(value: $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfHpRecovery | null | undefined): void {
        this._selfHpRecovery = value;
    }
    public createIfNotExistsSelfHpRecovery(): $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfHpRecovery {
        return this._selfHpRecovery ??= new $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfHpRecovery();
    }

    public checkHasSelfPrimaryAmmoRecovery(): boolean {
        return this._selfPrimaryAmmoRecovery != null;
    }
    public getSelfPrimaryAmmoRecovery(): $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfPrimaryAmmoRecovery | null | undefined {
        return this._selfPrimaryAmmoRecovery;
    }
    public setSelfPrimaryAmmoRecovery(value: $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfPrimaryAmmoRecovery | null | undefined): void {
        this._selfPrimaryAmmoRecovery = value;
    }
    public createIfNotExistsSelfPrimaryAmmoRecovery(): $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfPrimaryAmmoRecovery {
        return this._selfPrimaryAmmoRecovery ??= new $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfPrimaryAmmoRecovery();
    }

    public checkHasSelfFuelRecovery(): boolean {
        return this._selfFuelRecovery != null;
    }
    public getSelfFuelRecovery(): $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfFuelRecovery | null | undefined {
        return this._selfFuelRecovery;
    }
    public setSelfFuelRecovery(value: $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfFuelRecovery | null | undefined): void {
        this._selfFuelRecovery = value;
    }
    public createIfNotExistsSelfFuelRecovery(): $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfFuelRecovery {
        return this._selfFuelRecovery ??= new $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic$SelfFuelRecovery();
    }
}
