import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface UserMpwUnrankedHistoryJson extends $ProtoSchemaJsonBase {
    replayId?: number | null | undefined;
    endTimestamp?: number | null | undefined;
    normalMapId?: number | null | undefined;
    warType?: number | null | undefined;
}

export class UserMpwUnrankedHistory extends $ProtoSchemaBase {
    private _replayId?: number | null | undefined;
    private _endTimestamp?: number | null | undefined;
    private _normalMapId?: number | null | undefined;
    private _warType?: number | null | undefined;

    public static fromJson(obj: UserMpwUnrankedHistoryJson): UserMpwUnrankedHistory {
        return new UserMpwUnrankedHistory().loadJson(obj);
    }
    public override loadJson(obj: UserMpwUnrankedHistoryJson): this {
        this.setReplayId(obj.replayId);
        this.setEndTimestamp(obj.endTimestamp);
        this.setNormalMapId(obj.normalMapId);
        this.setWarType(obj.warType);
        return this;
    }
    public override toJson(obj?: UserMpwUnrankedHistoryJson): UserMpwUnrankedHistoryJson {
        obj ??= ({} as UserMpwUnrankedHistoryJson);

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
            const value = this.getWarType();
            (value != null) && (obj.warType = value);
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
            const value = this.getWarType();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserMpwUnrankedHistory {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserMpwUnrankedHistory();
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
                    msg.setWarType(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserMpwUnrankedHistory {
        return UserMpwUnrankedHistory.decode(this.encode());
    }

    public override getSchemaName(): "UserMpwUnrankedHistory" {
        return "UserMpwUnrankedHistory";
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

    public checkHasWarType(): boolean {
        return this._warType != null;
    }
    public getWarType(): number | null | undefined {
        return this._warType;
    }
    public setWarType(value: number | null | undefined): void {
        this._warType = value;
    }
}
