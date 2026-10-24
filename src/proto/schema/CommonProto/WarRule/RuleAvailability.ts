import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface RuleAvailabilityJson extends $ProtoSchemaJsonBase {
    canMcw?: boolean | null | undefined;
    canMrw?: boolean | null | undefined;
    canSrw?: boolean | null | undefined;
    canCcw?: boolean | null | undefined;
}

export class RuleAvailability extends $ProtoSchemaBase {
    private _canMcw?: boolean | null | undefined;
    private _canMrw?: boolean | null | undefined;
    private _canSrw?: boolean | null | undefined;
    private _canCcw?: boolean | null | undefined;

    public static fromJson(obj: RuleAvailabilityJson): RuleAvailability {
        return new RuleAvailability().loadJson(obj);
    }
    public override loadJson(obj: RuleAvailabilityJson): this {
        this.setCanMcw(obj.canMcw);
        this.setCanMrw(obj.canMrw);
        this.setCanSrw(obj.canSrw);
        this.setCanCcw(obj.canCcw);
        return this;
    }
    public override toJson(obj?: RuleAvailabilityJson): RuleAvailabilityJson {
        obj ??= ({} as RuleAvailabilityJson);

        {
            const value = this.getCanMcw();
            (value != null) && (obj.canMcw = value);
        }

        {
            const value = this.getCanMrw();
            (value != null) && (obj.canMrw = value);
        }

        {
            const value = this.getCanSrw();
            (value != null) && (obj.canSrw = value);
        }

        {
            const value = this.getCanCcw();
            (value != null) && (obj.canCcw = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCanMcw();
            if ((value != null) && (value != false)) {
                writer.uint32(8).bool(value);
            }
        }

        {
            const value = this.getCanMrw();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getCanSrw();
            if ((value != null) && (value != false)) {
                writer.uint32(24).bool(value);
            }
        }

        {
            const value = this.getCanCcw();
            if ((value != null) && (value != false)) {
                writer.uint32(32).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): RuleAvailability {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new RuleAvailability();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCanMcw(reader.bool());
                    break;

                case 2:
                    msg.setCanMrw(reader.bool());
                    break;

                case 3:
                    msg.setCanSrw(reader.bool());
                    break;

                case 4:
                    msg.setCanCcw(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): RuleAvailability {
        return RuleAvailability.decode(this.encode());
    }

    public override getSchemaName(): "RuleAvailability" {
        return "RuleAvailability";
    }

    public checkHasCanMcw(): boolean {
        return this._canMcw != null;
    }
    public getCanMcw(): boolean {
        return this._canMcw ?? false;
    }
    public setCanMcw(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canMcw = null;
        } else {
            this._canMcw = value;
        }
    }

    public checkHasCanMrw(): boolean {
        return this._canMrw != null;
    }
    public getCanMrw(): boolean {
        return this._canMrw ?? false;
    }
    public setCanMrw(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canMrw = null;
        } else {
            this._canMrw = value;
        }
    }

    public checkHasCanSrw(): boolean {
        return this._canSrw != null;
    }
    public getCanSrw(): boolean {
        return this._canSrw ?? false;
    }
    public setCanSrw(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canSrw = null;
        } else {
            this._canSrw = value;
        }
    }

    public checkHasCanCcw(): boolean {
        return this._canCcw != null;
    }
    public getCanCcw(): boolean {
        return this._canCcw ?? false;
    }
    public setCanCcw(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canCcw = null;
        } else {
            this._canCcw = value;
        }
    }
}
