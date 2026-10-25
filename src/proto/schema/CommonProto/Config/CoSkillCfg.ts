import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { InstantManual as $Message$CommonProto$Config$CoSkillCfg$InstantManual, type InstantManualJson as $Json$CommonProto$Config$CoSkillCfg$InstantManual } from "./CoSkillCfg/InstantManual.js";
import { InstantMisc as $Message$CommonProto$Config$CoSkillCfg$InstantMisc, type InstantMiscJson as $Json$CommonProto$Config$CoSkillCfg$InstantMisc } from "./CoSkillCfg/InstantMisc.js";
import { InstantPeriodic as $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic, type InstantPeriodicJson as $Json$CommonProto$Config$CoSkillCfg$InstantPeriodic } from "./CoSkillCfg/InstantPeriodic.js";
import { Persistent as $Message$CommonProto$Config$CoSkillCfg$Persistent, type PersistentJson as $Json$CommonProto$Config$CoSkillCfg$Persistent } from "./CoSkillCfg/Persistent.js";

export interface CoSkillCfgJson extends $ProtoSchemaJsonBase {
    skillId?: number | null | undefined;
    showZone?: boolean | null | undefined;
    persistent?: $Json$CommonProto$Config$CoSkillCfg$Persistent | null | undefined;
    instantManual?: $Json$CommonProto$Config$CoSkillCfg$InstantManual | null | undefined;
    instantPeriodic?: $Json$CommonProto$Config$CoSkillCfg$InstantPeriodic | null | undefined;
    instantMisc?: $Json$CommonProto$Config$CoSkillCfg$InstantMisc | null | undefined;
}

export class CoSkillCfg extends $ProtoSchemaBase {
    private _skillId?: number | null | undefined;
    private _showZone?: boolean | null | undefined;
    private _persistent?: $Message$CommonProto$Config$CoSkillCfg$Persistent | null | undefined;
    private _instantManual?: $Message$CommonProto$Config$CoSkillCfg$InstantManual | null | undefined;
    private _instantPeriodic?: $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic | null | undefined;
    private _instantMisc?: $Message$CommonProto$Config$CoSkillCfg$InstantMisc | null | undefined;

    public static fromJson(obj: CoSkillCfgJson): CoSkillCfg {
        return new CoSkillCfg().loadJson(obj);
    }
    public override loadJson(obj: CoSkillCfgJson): this {
        this.setSkillId(obj.skillId);
        this.setShowZone(obj.showZone);
        this.setPersistent(obj.persistent != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent.fromJson(obj.persistent) : null);
        this.setInstantManual(obj.instantManual != null ? $Message$CommonProto$Config$CoSkillCfg$InstantManual.fromJson(obj.instantManual) : null);
        this.setInstantPeriodic(obj.instantPeriodic != null ? $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic.fromJson(obj.instantPeriodic) : null);
        this.setInstantMisc(obj.instantMisc != null ? $Message$CommonProto$Config$CoSkillCfg$InstantMisc.fromJson(obj.instantMisc) : null);
        return this;
    }
    public override toJson(obj?: CoSkillCfgJson): CoSkillCfgJson {
        obj ??= ({} as CoSkillCfgJson);

        {
            const value = this.getSkillId();
            (value != null) && (obj.skillId = value);
        }

        {
            const value = this.getShowZone();
            (value != null) && (obj.showZone = value);
        }

        {
            const value = this.getPersistent();
            (value != null) && (obj.persistent = value.toJson());
        }

        {
            const value = this.getInstantManual();
            (value != null) && (obj.instantManual = value.toJson());
        }

        {
            const value = this.getInstantPeriodic();
            (value != null) && (obj.instantPeriodic = value.toJson());
        }

        {
            const value = this.getInstantMisc();
            (value != null) && (obj.instantMisc = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSkillId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getShowZone();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getPersistent();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getInstantManual();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getInstantPeriodic();
            if (value != null) {
                value.toWriter(writer.uint32(98).fork()).ldelim();
            }
        }

        {
            const value = this.getInstantMisc();
            if (value != null) {
                value.toWriter(writer.uint32(106).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): CoSkillCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new CoSkillCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSkillId(reader.int32());
                    break;

                case 2:
                    msg.setShowZone(reader.bool());
                    break;

                case 10:
                    msg.setPersistent($Message$CommonProto$Config$CoSkillCfg$Persistent.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setInstantManual($Message$CommonProto$Config$CoSkillCfg$InstantManual.decode(reader, reader.uint32()));
                    break;

                case 12:
                    msg.setInstantPeriodic($Message$CommonProto$Config$CoSkillCfg$InstantPeriodic.decode(reader, reader.uint32()));
                    break;

                case 13:
                    msg.setInstantMisc($Message$CommonProto$Config$CoSkillCfg$InstantMisc.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): CoSkillCfg {
        return CoSkillCfg.decode(this.encode());
    }

    public override getSchemaName(): "CoSkillCfg" {
        return "CoSkillCfg";
    }

    public checkHasSkillId(): boolean {
        return this._skillId != null;
    }
    public getSkillId(): number {
        return this._skillId ?? 0;
    }
    public setSkillId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._skillId = null;
        } else {
            this._skillId = value;
        }
    }

    public checkHasShowZone(): boolean {
        return this._showZone != null;
    }
    public getShowZone(): boolean {
        return this._showZone ?? false;
    }
    public setShowZone(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._showZone = null;
        } else {
            this._showZone = value;
        }
    }

    public checkHasPersistent(): boolean {
        return this._persistent != null;
    }
    public getPersistent(): $Message$CommonProto$Config$CoSkillCfg$Persistent | null | undefined {
        return this._persistent;
    }
    public setPersistent(value: $Message$CommonProto$Config$CoSkillCfg$Persistent | null | undefined): void {
        this._persistent = value;
    }
    public createIfNotExistsPersistent(): $Message$CommonProto$Config$CoSkillCfg$Persistent {
        return this._persistent ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent();
    }

    public checkHasInstantManual(): boolean {
        return this._instantManual != null;
    }
    public getInstantManual(): $Message$CommonProto$Config$CoSkillCfg$InstantManual | null | undefined {
        return this._instantManual;
    }
    public setInstantManual(value: $Message$CommonProto$Config$CoSkillCfg$InstantManual | null | undefined): void {
        this._instantManual = value;
    }
    public createIfNotExistsInstantManual(): $Message$CommonProto$Config$CoSkillCfg$InstantManual {
        return this._instantManual ??= new $Message$CommonProto$Config$CoSkillCfg$InstantManual();
    }

    public checkHasInstantPeriodic(): boolean {
        return this._instantPeriodic != null;
    }
    public getInstantPeriodic(): $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic | null | undefined {
        return this._instantPeriodic;
    }
    public setInstantPeriodic(value: $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic | null | undefined): void {
        this._instantPeriodic = value;
    }
    public createIfNotExistsInstantPeriodic(): $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic {
        return this._instantPeriodic ??= new $Message$CommonProto$Config$CoSkillCfg$InstantPeriodic();
    }

    public checkHasInstantMisc(): boolean {
        return this._instantMisc != null;
    }
    public getInstantMisc(): $Message$CommonProto$Config$CoSkillCfg$InstantMisc | null | undefined {
        return this._instantMisc;
    }
    public setInstantMisc(value: $Message$CommonProto$Config$CoSkillCfg$InstantMisc | null | undefined): void {
        this._instantMisc = value;
    }
    public createIfNotExistsInstantMisc(): $Message$CommonProto$Config$CoSkillCfg$InstantMisc {
        return this._instantMisc ??= new $Message$CommonProto$Config$CoSkillCfg$InstantMisc();
    }
}
