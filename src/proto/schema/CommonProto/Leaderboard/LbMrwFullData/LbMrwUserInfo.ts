import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface LbMrwUserInfoJson extends $ProtoSchemaJsonBase {
    userId?: number | null | undefined;
    rankScore?: number | null | undefined;
    lastWarEndTimestamp?: number | null | undefined;
}

export class LbMrwUserInfo extends $ProtoSchemaBase {
    private _userId?: number | null | undefined;
    private _rankScore?: number | null | undefined;
    private _lastWarEndTimestamp?: number | null | undefined;

    public static fromJson(obj: LbMrwUserInfoJson): LbMrwUserInfo {
        return new LbMrwUserInfo().loadJson(obj);
    }
    public override loadJson(obj: LbMrwUserInfoJson): this {
        this.setUserId(obj.userId);
        this.setRankScore(obj.rankScore);
        this.setLastWarEndTimestamp(obj.lastWarEndTimestamp);
        return this;
    }
    public override toJson(obj?: LbMrwUserInfoJson): LbMrwUserInfoJson {
        obj ??= ({} as LbMrwUserInfoJson);

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getRankScore();
            (value != null) && (obj.rankScore = value);
        }

        {
            const value = this.getLastWarEndTimestamp();
            (value != null) && (obj.lastWarEndTimestamp = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUserId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getRankScore();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getLastWarEndTimestamp();
            if (value != null) {
                writer.uint32(24).uint32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): LbMrwUserInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new LbMrwUserInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUserId(reader.int32());
                    break;

                case 2:
                    msg.setRankScore(reader.int32());
                    break;

                case 3:
                    msg.setLastWarEndTimestamp(reader.uint32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): LbMrwUserInfo {
        return LbMrwUserInfo.decode(this.encode());
    }

    public override getSchemaName(): "LbMrwUserInfo" {
        return "LbMrwUserInfo";
    }

    public checkHasUserId(): boolean {
        return this._userId != null;
    }
    public getUserId(): number | null | undefined {
        return this._userId;
    }
    public setUserId(value: number | null | undefined): void {
        this._userId = value;
    }

    public checkHasRankScore(): boolean {
        return this._rankScore != null;
    }
    public getRankScore(): number | null | undefined {
        return this._rankScore;
    }
    public setRankScore(value: number | null | undefined): void {
        this._rankScore = value;
    }

    public checkHasLastWarEndTimestamp(): boolean {
        return this._lastWarEndTimestamp != null;
    }
    public getLastWarEndTimestamp(): number | null | undefined {
        return this._lastWarEndTimestamp;
    }
    public setLastWarEndTimestamp(value: number | null | undefined): void {
        this._lastWarEndTimestamp = value;
    }
}
