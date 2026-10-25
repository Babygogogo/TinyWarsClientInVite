import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface EnemyUnitBuffGainJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    unitCategoryId?: number | null | undefined;
    unitLoadedStateId?: number | null | undefined;
    unitBuffTypeId?: number | null | undefined;
    turns?: number | null | undefined;
}

export class EnemyUnitBuffGain extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _unitCategoryId?: number | null | undefined;
    private _unitLoadedStateId?: number | null | undefined;
    private _unitBuffTypeId?: number | null | undefined;
    private _turns?: number | null | undefined;

    public static fromJson(obj: EnemyUnitBuffGainJson): EnemyUnitBuffGain {
        return new EnemyUnitBuffGain().loadJson(obj);
    }
    public override loadJson(obj: EnemyUnitBuffGainJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setUnitLoadedStateId(obj.unitLoadedStateId);
        this.setUnitBuffTypeId(obj.unitBuffTypeId);
        this.setTurns(obj.turns);
        return this;
    }
    public override toJson(obj?: EnemyUnitBuffGainJson): EnemyUnitBuffGainJson {
        obj ??= ({} as EnemyUnitBuffGainJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getUnitCategoryId();
            (value != null) && (obj.unitCategoryId = value);
        }

        {
            const value = this.getUnitLoadedStateId();
            (value != null) && (obj.unitLoadedStateId = value);
        }

        {
            const value = this.getUnitBuffTypeId();
            (value != null) && (obj.unitBuffTypeId = value);
        }

        {
            const value = this.getTurns();
            (value != null) && (obj.turns = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCoSkillAreaTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getUnitCategoryId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getUnitLoadedStateId();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getUnitBuffTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getTurns();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): EnemyUnitBuffGain {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new EnemyUnitBuffGain();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCoSkillAreaTypeId(reader.int32());
                    break;

                case 2:
                    msg.setUnitCategoryId(reader.int32());
                    break;

                case 3:
                    msg.setUnitLoadedStateId(reader.int32());
                    break;

                case 4:
                    msg.setUnitBuffTypeId(reader.int32());
                    break;

                case 5:
                    msg.setTurns(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): EnemyUnitBuffGain {
        return EnemyUnitBuffGain.decode(this.encode());
    }

    public override getSchemaName(): "EnemyUnitBuffGain" {
        return "EnemyUnitBuffGain";
    }

    public checkHasCoSkillAreaTypeId(): boolean {
        return this._coSkillAreaTypeId != null;
    }
    public getCoSkillAreaTypeId(): number {
        return this._coSkillAreaTypeId ?? 0;
    }
    public setCoSkillAreaTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._coSkillAreaTypeId = null;
        } else {
            this._coSkillAreaTypeId = value;
        }
    }

    public checkHasUnitCategoryId(): boolean {
        return this._unitCategoryId != null;
    }
    public getUnitCategoryId(): number | null | undefined {
        return this._unitCategoryId;
    }
    public setUnitCategoryId(value: number | null | undefined): void {
        this._unitCategoryId = value;
    }

    public checkHasUnitLoadedStateId(): boolean {
        return this._unitLoadedStateId != null;
    }
    public getUnitLoadedStateId(): number {
        return this._unitLoadedStateId ?? 0;
    }
    public setUnitLoadedStateId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitLoadedStateId = null;
        } else {
            this._unitLoadedStateId = value;
        }
    }

    public checkHasUnitBuffTypeId(): boolean {
        return this._unitBuffTypeId != null;
    }
    public getUnitBuffTypeId(): number {
        return this._unitBuffTypeId ?? 0;
    }
    public setUnitBuffTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitBuffTypeId = null;
        } else {
            this._unitBuffTypeId = value;
        }
    }

    public checkHasTurns(): boolean {
        return this._turns != null;
    }
    public getTurns(): number {
        return this._turns ?? 0;
    }
    public setTurns(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._turns = null;
        } else {
            this._turns = value;
        }
    }
}
