import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface TaskObjectiveStateJson extends $ProtoSchemaJsonBase {
    objectiveId?: number | null | undefined;
    isHidden?: boolean | null | undefined;
    currentProgress?: number | null | undefined;
    isProgressUpdaterDisabled?: boolean | null | undefined;
}

export class TaskObjectiveState extends $ProtoSchemaBase {
    private _objectiveId?: number | null | undefined;
    private _isHidden?: boolean | null | undefined;
    private _currentProgress?: number | null | undefined;
    private _isProgressUpdaterDisabled?: boolean | null | undefined;

    public static fromJson(obj: TaskObjectiveStateJson): TaskObjectiveState {
        return new TaskObjectiveState().loadJson(obj);
    }
    public override loadJson(obj: TaskObjectiveStateJson): this {
        this.setObjectiveId(obj.objectiveId);
        this.setIsHidden(obj.isHidden);
        this.setCurrentProgress(obj.currentProgress);
        this.setIsProgressUpdaterDisabled(obj.isProgressUpdaterDisabled);
        return this;
    }
    public override toJson(obj?: TaskObjectiveStateJson): TaskObjectiveStateJson {
        obj ??= ({} as TaskObjectiveStateJson);

        {
            const value = this.getObjectiveId();
            (value != null) && (obj.objectiveId = value);
        }

        {
            const value = this.getIsHidden();
            (value != null) && (obj.isHidden = value);
        }

        {
            const value = this.getCurrentProgress();
            (value != null) && (obj.currentProgress = value);
        }

        {
            const value = this.getIsProgressUpdaterDisabled();
            (value != null) && (obj.isProgressUpdaterDisabled = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getObjectiveId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getIsHidden();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getCurrentProgress();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getIsProgressUpdaterDisabled();
            if ((value != null) && (value != false)) {
                writer.uint32(32).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): TaskObjectiveState {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new TaskObjectiveState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setObjectiveId(reader.int32());
                    break;

                case 2:
                    msg.setIsHidden(reader.bool());
                    break;

                case 3:
                    msg.setCurrentProgress(reader.int32());
                    break;

                case 4:
                    msg.setIsProgressUpdaterDisabled(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): TaskObjectiveState {
        return TaskObjectiveState.decode(this.encode());
    }

    public override getSchemaName(): "TaskObjectiveState" {
        return "TaskObjectiveState";
    }

    public checkHasObjectiveId(): boolean {
        return this._objectiveId != null;
    }
    public getObjectiveId(): number {
        return this._objectiveId ?? 0;
    }
    public setObjectiveId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._objectiveId = null;
        } else {
            this._objectiveId = value;
        }
    }

    public checkHasIsHidden(): boolean {
        return this._isHidden != null;
    }
    public getIsHidden(): boolean {
        return this._isHidden ?? false;
    }
    public setIsHidden(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isHidden = null;
        } else {
            this._isHidden = value;
        }
    }

    public checkHasCurrentProgress(): boolean {
        return this._currentProgress != null;
    }
    public getCurrentProgress(): number {
        return this._currentProgress ?? 0;
    }
    public setCurrentProgress(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._currentProgress = null;
        } else {
            this._currentProgress = value;
        }
    }

    public checkHasIsProgressUpdaterDisabled(): boolean {
        return this._isProgressUpdaterDisabled != null;
    }
    public getIsProgressUpdaterDisabled(): boolean {
        return this._isProgressUpdaterDisabled ?? false;
    }
    public setIsProgressUpdaterDisabled(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isProgressUpdaterDisabled = null;
        } else {
            this._isProgressUpdaterDisabled = value;
        }
    }
}
