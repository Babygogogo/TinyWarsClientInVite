import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface UserMrwRankInfoJson extends $ProtoSchemaJsonBase {
    warType?: number | null | undefined;
    playersCountUnneutral?: number | null | undefined;
    currentScore?: number | null | undefined;
    lastWarEndTime?: number | null | undefined;
}

export class UserMrwRankInfo extends $ProtoSchemaBase {
    private _warType?: number | null | undefined;
    private _playersCountUnneutral?: number | null | undefined;
    private _currentScore?: number | null | undefined;
    private _lastWarEndTime?: number | null | undefined;

    public static fromJson(obj: UserMrwRankInfoJson): UserMrwRankInfo {
        return new UserMrwRankInfo().loadJson(obj);
    }
    public override loadJson(obj: UserMrwRankInfoJson): this {
        this.setWarType(obj.warType);
        this.setPlayersCountUnneutral(obj.playersCountUnneutral);
        this.setCurrentScore(obj.currentScore);
        this.setLastWarEndTime(obj.lastWarEndTime);
        return this;
    }
    public override toJson(obj?: UserMrwRankInfoJson): UserMrwRankInfoJson {
        obj ??= ({} as UserMrwRankInfoJson);

        {
            const value = this.getWarType();
            (value != null) && (obj.warType = value);
        }

        {
            const value = this.getPlayersCountUnneutral();
            (value != null) && (obj.playersCountUnneutral = value);
        }

        {
            const value = this.getCurrentScore();
            (value != null) && (obj.currentScore = value);
        }

        {
            const value = this.getLastWarEndTime();
            (value != null) && (obj.lastWarEndTime = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWarType();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getPlayersCountUnneutral();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getCurrentScore();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getLastWarEndTime();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).uint32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserMrwRankInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserMrwRankInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWarType(reader.int32());
                    break;

                case 2:
                    msg.setPlayersCountUnneutral(reader.int32());
                    break;

                case 3:
                    msg.setCurrentScore(reader.int32());
                    break;

                case 4:
                    msg.setLastWarEndTime(reader.uint32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserMrwRankInfo {
        return UserMrwRankInfo.decode(this.encode());
    }

    public override getSchemaName(): "UserMrwRankInfo" {
        return "UserMrwRankInfo";
    }

    public checkHasWarType(): boolean {
        return this._warType != null;
    }
    public getWarType(): number {
        return this._warType ?? 0;
    }
    public setWarType(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._warType = null;
        } else {
            this._warType = value;
        }
    }

    public checkHasPlayersCountUnneutral(): boolean {
        return this._playersCountUnneutral != null;
    }
    public getPlayersCountUnneutral(): number {
        return this._playersCountUnneutral ?? 0;
    }
    public setPlayersCountUnneutral(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._playersCountUnneutral = null;
        } else {
            this._playersCountUnneutral = value;
        }
    }

    public checkHasCurrentScore(): boolean {
        return this._currentScore != null;
    }
    public getCurrentScore(): number | null | undefined {
        return this._currentScore;
    }
    public setCurrentScore(value: number | null | undefined): void {
        this._currentScore = value;
    }

    public checkHasLastWarEndTime(): boolean {
        return this._lastWarEndTime != null;
    }
    public getLastWarEndTime(): number {
        return this._lastWarEndTime ?? 0;
    }
    public setLastWarEndTime(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._lastWarEndTime = null;
        } else {
            this._lastWarEndTime = value;
        }
    }
}
