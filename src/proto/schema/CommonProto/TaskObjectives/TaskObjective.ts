import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../Structure/LanguageText.js";

export interface TaskObjectiveJson extends $ProtoSchemaJsonBase {
    objectiveId?: number | null | undefined;
    desc: $Json$CommonProto$Structure$LanguageText[];
    isMain?: boolean | null | undefined;
    maxProgress?: number | null | undefined;
    scoreForCompletion?: number | null | undefined;
    scoreForProgress?: number | null | undefined;
    updaterForCurrentProgress?: string | null | undefined;
}

export class TaskObjective extends $ProtoSchemaBase {
    private _objectiveId?: number | null | undefined;
    private _desc: $Message$CommonProto$Structure$LanguageText[] = [];
    private _isMain?: boolean | null | undefined;
    private _maxProgress?: number | null | undefined;
    private _scoreForCompletion?: number | null | undefined;
    private _scoreForProgress?: number | null | undefined;
    private _updaterForCurrentProgress?: string | null | undefined;

    public static fromJson(obj: TaskObjectiveJson): TaskObjective {
        return new TaskObjective().loadJson(obj);
    }
    public override loadJson(obj: TaskObjectiveJson): this {
        this.setObjectiveId(obj.objectiveId);
        this.setDesc(obj.desc?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        this.setIsMain(obj.isMain);
        this.setMaxProgress(obj.maxProgress);
        this.setScoreForCompletion(obj.scoreForCompletion);
        this.setScoreForProgress(obj.scoreForProgress);
        this.setUpdaterForCurrentProgress(obj.updaterForCurrentProgress);
        return this;
    }
    public override toJson(obj?: TaskObjectiveJson): TaskObjectiveJson {
        obj ??= ({} as TaskObjectiveJson);

        {
            const value = this.getObjectiveId();
            (value != null) && (obj.objectiveId = value);
        }

        {
            obj.desc = this.getDesc().map(v => v.toJson());
        }

        {
            const value = this.getIsMain();
            (value != null) && (obj.isMain = value);
        }

        {
            const value = this.getMaxProgress();
            (value != null) && (obj.maxProgress = value);
        }

        {
            const value = this.getScoreForCompletion();
            (value != null) && (obj.scoreForCompletion = value);
        }

        {
            const value = this.getScoreForProgress();
            (value != null) && (obj.scoreForProgress = value);
        }

        {
            const value = this.getUpdaterForCurrentProgress();
            (value != null) && (obj.updaterForCurrentProgress = value);
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
            const value = this.getDesc();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getIsMain();
            if ((value != null) && (value != false)) {
                writer.uint32(24).bool(value);
            }
        }

        {
            const value = this.getMaxProgress();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getScoreForCompletion();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getScoreForProgress();
            if ((value != null) && (value != 0)) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getUpdaterForCurrentProgress();
            if (value != null) {
                writer.uint32(58).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): TaskObjective {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new TaskObjective();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setObjectiveId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._desc;
                        arr.push($Message$CommonProto$Structure$LanguageText.decode(reader, reader.uint32()));
                    }
                    break;

                case 3:
                    msg.setIsMain(reader.bool());
                    break;

                case 4:
                    msg.setMaxProgress(reader.int32());
                    break;

                case 5:
                    msg.setScoreForCompletion(reader.int32());
                    break;

                case 6:
                    msg.setScoreForProgress(reader.int32());
                    break;

                case 7:
                    msg.setUpdaterForCurrentProgress(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): TaskObjective {
        return TaskObjective.decode(this.encode());
    }

    public override getSchemaName(): "TaskObjective" {
        return "TaskObjective";
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

    public getDesc(): $Message$CommonProto$Structure$LanguageText[] {
        return this._desc;
    }
    public setDesc(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._desc = value;
    }

    public checkHasIsMain(): boolean {
        return this._isMain != null;
    }
    public getIsMain(): boolean {
        return this._isMain ?? false;
    }
    public setIsMain(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isMain = null;
        } else {
            this._isMain = value;
        }
    }

    public checkHasMaxProgress(): boolean {
        return this._maxProgress != null;
    }
    public getMaxProgress(): number | null | undefined {
        return this._maxProgress;
    }
    public setMaxProgress(value: number | null | undefined): void {
        this._maxProgress = value;
    }

    public checkHasScoreForCompletion(): boolean {
        return this._scoreForCompletion != null;
    }
    public getScoreForCompletion(): number {
        return this._scoreForCompletion ?? 0;
    }
    public setScoreForCompletion(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._scoreForCompletion = null;
        } else {
            this._scoreForCompletion = value;
        }
    }

    public checkHasScoreForProgress(): boolean {
        return this._scoreForProgress != null;
    }
    public getScoreForProgress(): number {
        return this._scoreForProgress ?? 0;
    }
    public setScoreForProgress(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._scoreForProgress = null;
        } else {
            this._scoreForProgress = value;
        }
    }

    public checkHasUpdaterForCurrentProgress(): boolean {
        return this._updaterForCurrentProgress != null;
    }
    public getUpdaterForCurrentProgress(): string | null | undefined {
        return this._updaterForCurrentProgress;
    }
    public setUpdaterForCurrentProgress(value: string | null | undefined): void {
        this._updaterForCurrentProgress = value;
    }
}
