import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface SpmRankSingleInfoJson extends $ProtoSchemaJsonBase {
    rankId?: number | null | undefined;
    userId?: number | null | undefined;
    score?: number | null | undefined;
    turnIndex?: number | null | undefined;
}

export class SpmRankSingleInfo extends $ProtoSchemaBase {
    private _rankId?: number | null | undefined;
    private _userId?: number | null | undefined;
    private _score?: number | null | undefined;
    private _turnIndex?: number | null | undefined;

    public static fromJson(obj: SpmRankSingleInfoJson): SpmRankSingleInfo {
        return new SpmRankSingleInfo().loadJson(obj);
    }
    public override loadJson(obj: SpmRankSingleInfoJson): this {
        this.setRankId(obj.rankId);
        this.setUserId(obj.userId);
        this.setScore(obj.score);
        this.setTurnIndex(obj.turnIndex);
        return this;
    }
    public override toJson(obj?: SpmRankSingleInfoJson): SpmRankSingleInfoJson {
        obj ??= ({} as SpmRankSingleInfoJson);

        {
            const value = this.getRankId();
            (value != null) && (obj.rankId = value);
        }

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getScore();
            (value != null) && (obj.score = value);
        }

        {
            const value = this.getTurnIndex();
            (value != null) && (obj.turnIndex = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getRankId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getUserId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getScore();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getTurnIndex();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SpmRankSingleInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SpmRankSingleInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setRankId(reader.int32());
                    break;

                case 2:
                    msg.setUserId(reader.int32());
                    break;

                case 3:
                    msg.setScore(reader.int32());
                    break;

                case 4:
                    msg.setTurnIndex(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SpmRankSingleInfo {
        return SpmRankSingleInfo.decode(this.encode());
    }

    public override getSchemaName(): "SpmRankSingleInfo" {
        return "SpmRankSingleInfo";
    }

    public checkHasRankId(): boolean {
        return this._rankId != null;
    }
    public getRankId(): number | null | undefined {
        return this._rankId;
    }
    public setRankId(value: number | null | undefined): void {
        this._rankId = value;
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

    public checkHasScore(): boolean {
        return this._score != null;
    }
    public getScore(): number | null | undefined {
        return this._score;
    }
    public setScore(value: number | null | undefined): void {
        this._score = value;
    }

    public checkHasTurnIndex(): boolean {
        return this._turnIndex != null;
    }
    public getTurnIndex(): number | null | undefined {
        return this._turnIndex;
    }
    public setTurnIndex(value: number | null | undefined): void {
        this._turnIndex = value;
    }
}
