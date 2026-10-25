import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfUnitActionStateJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    unitCategoryId?: number | null | undefined;
    conIsCoOnboard?: boolean | null | undefined;
    unitActionStateId?: number | null | undefined;
}

export class SelfUnitActionState extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _unitCategoryId?: number | null | undefined;
    private _conIsCoOnboard?: boolean | null | undefined;
    private _unitActionStateId?: number | null | undefined;

    public static fromJson(obj: SelfUnitActionStateJson): SelfUnitActionState {
        return new SelfUnitActionState().loadJson(obj);
    }
    public override loadJson(obj: SelfUnitActionStateJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setConIsCoOnboard(obj.conIsCoOnboard);
        this.setUnitActionStateId(obj.unitActionStateId);
        return this;
    }
    public override toJson(obj?: SelfUnitActionStateJson): SelfUnitActionStateJson {
        obj ??= ({} as SelfUnitActionStateJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getUnitCategoryId();
            (value != null) && (obj.unitCategoryId = value);
        }

        {
            const value = this.getConIsCoOnboard();
            (value != null) && (obj.conIsCoOnboard = value);
        }

        {
            const value = this.getUnitActionStateId();
            (value != null) && (obj.unitActionStateId = value);
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
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getConIsCoOnboard();
            if (value != null) {
                writer.uint32(24).bool(value);
            }
        }

        {
            const value = this.getUnitActionStateId();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfUnitActionState {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfUnitActionState();
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
                    msg.setConIsCoOnboard(reader.bool());
                    break;

                case 4:
                    msg.setUnitActionStateId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfUnitActionState {
        return SelfUnitActionState.decode(this.encode());
    }

    public override getSchemaName(): "SelfUnitActionState" {
        return "SelfUnitActionState";
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
    public getUnitCategoryId(): number {
        return this._unitCategoryId ?? 0;
    }
    public setUnitCategoryId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitCategoryId = null;
        } else {
            this._unitCategoryId = value;
        }
    }

    public checkHasConIsCoOnboard(): boolean {
        return this._conIsCoOnboard != null;
    }
    public getConIsCoOnboard(): boolean | null | undefined {
        return this._conIsCoOnboard;
    }
    public setConIsCoOnboard(value: boolean | null | undefined): void {
        this._conIsCoOnboard = value;
    }

    public checkHasUnitActionStateId(): boolean {
        return this._unitActionStateId != null;
    }
    public getUnitActionStateId(): number {
        return this._unitActionStateId ?? 0;
    }
    public setUnitActionStateId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitActionStateId = null;
        } else {
            this._unitActionStateId = value;
        }
    }
}
