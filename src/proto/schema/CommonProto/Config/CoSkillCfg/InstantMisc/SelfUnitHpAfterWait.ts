import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfUnitHpAfterWaitJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    realHpOffset?: number | null | undefined;
}

export class SelfUnitHpAfterWait extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _realHpOffset?: number | null | undefined;

    public static fromJson(obj: SelfUnitHpAfterWaitJson): SelfUnitHpAfterWait {
        return new SelfUnitHpAfterWait().loadJson(obj);
    }
    public override loadJson(obj: SelfUnitHpAfterWaitJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setRealHpOffset(obj.realHpOffset);
        return this;
    }
    public override toJson(obj?: SelfUnitHpAfterWaitJson): SelfUnitHpAfterWaitJson {
        obj ??= ({} as SelfUnitHpAfterWaitJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getRealHpOffset();
            (value != null) && (obj.realHpOffset = value);
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
            const value = this.getRealHpOffset();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfUnitHpAfterWait {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfUnitHpAfterWait();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCoSkillAreaTypeId(reader.int32());
                    break;

                case 2:
                    msg.setRealHpOffset(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfUnitHpAfterWait {
        return SelfUnitHpAfterWait.decode(this.encode());
    }

    public override getSchemaName(): "SelfUnitHpAfterWait" {
        return "SelfUnitHpAfterWait";
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

    public checkHasRealHpOffset(): boolean {
        return this._realHpOffset != null;
    }
    public getRealHpOffset(): number {
        return this._realHpOffset ?? 0;
    }
    public setRealHpOffset(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._realHpOffset = null;
        } else {
            this._realHpOffset = value;
        }
    }
}
