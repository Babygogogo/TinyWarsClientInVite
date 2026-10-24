import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetTaskObjectiveStateJson extends $ProtoSchemaJsonBase {
    conTaskObjectiveFilter?: string | null | undefined;
    actIsHidden?: string | null | undefined;
    actProgress?: string | null | undefined;
    actIsProgressUpdaterDisabled?: string | null | undefined;
}

export class WeaSetTaskObjectiveState extends $ProtoSchemaBase {
    private _conTaskObjectiveFilter?: string | null | undefined;
    private _actIsHidden?: string | null | undefined;
    private _actProgress?: string | null | undefined;
    private _actIsProgressUpdaterDisabled?: string | null | undefined;

    public static fromJson(obj: WeaSetTaskObjectiveStateJson): WeaSetTaskObjectiveState {
        return new WeaSetTaskObjectiveState().loadJson(obj);
    }
    public override loadJson(obj: WeaSetTaskObjectiveStateJson): this {
        this.setConTaskObjectiveFilter(obj.conTaskObjectiveFilter);
        this.setActIsHidden(obj.actIsHidden);
        this.setActProgress(obj.actProgress);
        this.setActIsProgressUpdaterDisabled(obj.actIsProgressUpdaterDisabled);
        return this;
    }
    public override toJson(obj?: WeaSetTaskObjectiveStateJson): WeaSetTaskObjectiveStateJson {
        obj ??= ({} as WeaSetTaskObjectiveStateJson);

        {
            const value = this.getConTaskObjectiveFilter();
            (value != null) && (obj.conTaskObjectiveFilter = value);
        }

        {
            const value = this.getActIsHidden();
            (value != null) && (obj.actIsHidden = value);
        }

        {
            const value = this.getActProgress();
            (value != null) && (obj.actProgress = value);
        }

        {
            const value = this.getActIsProgressUpdaterDisabled();
            (value != null) && (obj.actIsProgressUpdaterDisabled = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConTaskObjectiveFilter();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getActIsHidden();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getActProgress();
            if (value != null) {
                writer.uint32(26).string(value);
            }
        }

        {
            const value = this.getActIsProgressUpdaterDisabled();
            if (value != null) {
                writer.uint32(34).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetTaskObjectiveState {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetTaskObjectiveState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConTaskObjectiveFilter(reader.string());
                    break;

                case 2:
                    msg.setActIsHidden(reader.string());
                    break;

                case 3:
                    msg.setActProgress(reader.string());
                    break;

                case 4:
                    msg.setActIsProgressUpdaterDisabled(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetTaskObjectiveState {
        return WeaSetTaskObjectiveState.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetTaskObjectiveState" {
        return "WeaSetTaskObjectiveState";
    }

    public checkHasConTaskObjectiveFilter(): boolean {
        return this._conTaskObjectiveFilter != null;
    }
    public getConTaskObjectiveFilter(): string | null | undefined {
        return this._conTaskObjectiveFilter;
    }
    public setConTaskObjectiveFilter(value: string | null | undefined): void {
        this._conTaskObjectiveFilter = value;
    }

    public checkHasActIsHidden(): boolean {
        return this._actIsHidden != null;
    }
    public getActIsHidden(): string | null | undefined {
        return this._actIsHidden;
    }
    public setActIsHidden(value: string | null | undefined): void {
        this._actIsHidden = value;
    }

    public checkHasActProgress(): boolean {
        return this._actProgress != null;
    }
    public getActProgress(): string | null | undefined {
        return this._actProgress;
    }
    public setActProgress(value: string | null | undefined): void {
        this._actProgress = value;
    }

    public checkHasActIsProgressUpdaterDisabled(): boolean {
        return this._actIsProgressUpdaterDisabled != null;
    }
    public getActIsProgressUpdaterDisabled(): string | null | undefined {
        return this._actIsProgressUpdaterDisabled;
    }
    public setActIsProgressUpdaterDisabled(value: string | null | undefined): void {
        this._actIsProgressUpdaterDisabled = value;
    }
}
