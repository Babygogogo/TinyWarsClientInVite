import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface ConditionIdAndFlagsJson extends $ProtoSchemaJsonBase {
    conditionId?: number | null | undefined;
    isNegated?: boolean | null | undefined;
}

export class ConditionIdAndFlags extends $ProtoSchemaBase {
    private _conditionId?: number | null | undefined;
    private _isNegated?: boolean | null | undefined;

    public static fromJson(obj: ConditionIdAndFlagsJson): ConditionIdAndFlags {
        return new ConditionIdAndFlags().loadJson(obj);
    }
    public override loadJson(obj: ConditionIdAndFlagsJson): this {
        this.setConditionId(obj.conditionId);
        this.setIsNegated(obj.isNegated);
        return this;
    }
    public override toJson(obj?: ConditionIdAndFlagsJson): ConditionIdAndFlagsJson {
        obj ??= ({} as ConditionIdAndFlagsJson);

        {
            const value = this.getConditionId();
            (value != null) && (obj.conditionId = value);
        }

        {
            const value = this.getIsNegated();
            (value != null) && (obj.isNegated = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConditionId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getIsNegated();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ConditionIdAndFlags {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ConditionIdAndFlags();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConditionId(reader.int32());
                    break;

                case 2:
                    msg.setIsNegated(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ConditionIdAndFlags {
        return ConditionIdAndFlags.decode(this.encode());
    }

    public override getSchemaName(): "ConditionIdAndFlags" {
        return "ConditionIdAndFlags";
    }

    public checkHasConditionId(): boolean {
        return this._conditionId != null;
    }
    public getConditionId(): number {
        return this._conditionId ?? 0;
    }
    public setConditionId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._conditionId = null;
        } else {
            this._conditionId = value;
        }
    }

    public checkHasIsNegated(): boolean {
        return this._isNegated != null;
    }
    public getIsNegated(): boolean {
        return this._isNegated ?? false;
    }
    public setIsNegated(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isNegated = null;
        } else {
            this._isNegated = value;
        }
    }
}
