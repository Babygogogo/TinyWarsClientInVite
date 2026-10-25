import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface UserMpwRankedHistoryJson extends $ProtoSchemaJsonBase {
    replayId?: number | null | undefined;
    endTimestamp?: number | null | undefined;
    normalMapId?: number | null | undefined;
    deltaScore?: number | null | undefined;
    newScore?: number | null | undefined;
}

export class UserMpwRankedHistory extends $ProtoSchemaBase {
    private _replayId?: number | null | undefined;
    private _endTimestamp?: number | null | undefined;
    private _normalMapId?: number | null | undefined;
    private _deltaScore?: number | null | undefined;
    private _newScore?: number | null | undefined;

    public static fromJson(obj: UserMpwRankedHistoryJson): UserMpwRankedHistory {
        return new UserMpwRankedHistory().loadJson(obj);
    }
    public override loadJson(obj: UserMpwRankedHistoryJson): this {
        this.setReplayId(obj.replayId);
        this.setEndTimestamp(obj.endTimestamp);
        this.setNormalMapId(obj.normalMapId);
        this.setDeltaScore(obj.deltaScore);
        this.setNewScore(obj.newScore);
        return this;
    }
    public override toJson(obj?: UserMpwRankedHistoryJson): UserMpwRankedHistoryJson {
        obj ??= ({} as UserMpwRankedHistoryJson);

        {
            const value = this.getReplayId();
            (value != null) && (obj.replayId = value);
        }

        {
            const value = this.getEndTimestamp();
            (value != null) && (obj.endTimestamp = value);
        }

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getDeltaScore();
            (value != null) && (obj.deltaScore = value);
        }

        {
            const value = this.getNewScore();
            (value != null) && (obj.newScore = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getReplayId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getEndTimestamp();
            if (value != null) {
                writer.uint32(16).uint32(value);
            }
        }

        {
            const value = this.getNormalMapId();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getDeltaScore();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getNewScore();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserMpwRankedHistory {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserMpwRankedHistory();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setReplayId(reader.int32());
                    break;

                case 2:
                    msg.setEndTimestamp(reader.uint32());
                    break;

                case 3:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 4:
                    msg.setDeltaScore(reader.int32());
                    break;

                case 5:
                    msg.setNewScore(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserMpwRankedHistory {
        return UserMpwRankedHistory.decode(this.encode());
    }

    public override getSchemaName(): "UserMpwRankedHistory" {
        return "UserMpwRankedHistory";
    }

    public checkHasReplayId(): boolean {
        return this._replayId != null;
    }
    public getReplayId(): number | null | undefined {
        return this._replayId;
    }
    public setReplayId(value: number | null | undefined): void {
        this._replayId = value;
    }

    public checkHasEndTimestamp(): boolean {
        return this._endTimestamp != null;
    }
    public getEndTimestamp(): number | null | undefined {
        return this._endTimestamp;
    }
    public setEndTimestamp(value: number | null | undefined): void {
        this._endTimestamp = value;
    }

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number | null | undefined {
        return this._normalMapId;
    }
    public setNormalMapId(value: number | null | undefined): void {
        this._normalMapId = value;
    }

    public checkHasDeltaScore(): boolean {
        return this._deltaScore != null;
    }
    public getDeltaScore(): number | null | undefined {
        return this._deltaScore;
    }
    public setDeltaScore(value: number | null | undefined): void {
        this._deltaScore = value;
    }

    public checkHasNewScore(): boolean {
        return this._newScore != null;
    }
    public getNewScore(): number | null | undefined {
        return this._newScore;
    }
    public setNewScore(value: number | null | undefined): void {
        this._newScore = value;
    }
}
