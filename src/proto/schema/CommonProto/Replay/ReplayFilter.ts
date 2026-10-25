import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface ReplayFilterJson extends $ProtoSchemaJsonBase {
    replayId?: number | null | undefined;
    normalMapId?: number | null | undefined;
    minMyRating?: number | null | undefined;
    minGlobalRating?: number | null | undefined;
    userId?: number | null | undefined;
    coCategoryId?: number | null | undefined;
    hasFog?: boolean | null | undefined;
    isRankedMatch?: boolean | null | undefined;
}

export class ReplayFilter extends $ProtoSchemaBase {
    private _replayId?: number | null | undefined;
    private _normalMapId?: number | null | undefined;
    private _minMyRating?: number | null | undefined;
    private _minGlobalRating?: number | null | undefined;
    private _userId?: number | null | undefined;
    private _coCategoryId?: number | null | undefined;
    private _hasFog?: boolean | null | undefined;
    private _isRankedMatch?: boolean | null | undefined;

    public static fromJson(obj: ReplayFilterJson): ReplayFilter {
        return new ReplayFilter().loadJson(obj);
    }
    public override loadJson(obj: ReplayFilterJson): this {
        this.setReplayId(obj.replayId);
        this.setNormalMapId(obj.normalMapId);
        this.setMinMyRating(obj.minMyRating);
        this.setMinGlobalRating(obj.minGlobalRating);
        this.setUserId(obj.userId);
        this.setCoCategoryId(obj.coCategoryId);
        this.setHasFog(obj.hasFog);
        this.setIsRankedMatch(obj.isRankedMatch);
        return this;
    }
    public override toJson(obj?: ReplayFilterJson): ReplayFilterJson {
        obj ??= ({} as ReplayFilterJson);

        {
            const value = this.getReplayId();
            (value != null) && (obj.replayId = value);
        }

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getMinMyRating();
            (value != null) && (obj.minMyRating = value);
        }

        {
            const value = this.getMinGlobalRating();
            (value != null) && (obj.minGlobalRating = value);
        }

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getCoCategoryId();
            (value != null) && (obj.coCategoryId = value);
        }

        {
            const value = this.getHasFog();
            (value != null) && (obj.hasFog = value);
        }

        {
            const value = this.getIsRankedMatch();
            (value != null) && (obj.isRankedMatch = value);
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
            const value = this.getNormalMapId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getMinMyRating();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getMinGlobalRating();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getUserId();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getCoCategoryId();
            if (value != null) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getHasFog();
            if (value != null) {
                writer.uint32(56).bool(value);
            }
        }

        {
            const value = this.getIsRankedMatch();
            if (value != null) {
                writer.uint32(64).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ReplayFilter {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ReplayFilter();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setReplayId(reader.int32());
                    break;

                case 2:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 3:
                    msg.setMinMyRating(reader.int32());
                    break;

                case 4:
                    msg.setMinGlobalRating(reader.int32());
                    break;

                case 5:
                    msg.setUserId(reader.int32());
                    break;

                case 6:
                    msg.setCoCategoryId(reader.int32());
                    break;

                case 7:
                    msg.setHasFog(reader.bool());
                    break;

                case 8:
                    msg.setIsRankedMatch(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ReplayFilter {
        return ReplayFilter.decode(this.encode());
    }

    public override getSchemaName(): "ReplayFilter" {
        return "ReplayFilter";
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

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number | null | undefined {
        return this._normalMapId;
    }
    public setNormalMapId(value: number | null | undefined): void {
        this._normalMapId = value;
    }

    public checkHasMinMyRating(): boolean {
        return this._minMyRating != null;
    }
    public getMinMyRating(): number | null | undefined {
        return this._minMyRating;
    }
    public setMinMyRating(value: number | null | undefined): void {
        this._minMyRating = value;
    }

    public checkHasMinGlobalRating(): boolean {
        return this._minGlobalRating != null;
    }
    public getMinGlobalRating(): number | null | undefined {
        return this._minGlobalRating;
    }
    public setMinGlobalRating(value: number | null | undefined): void {
        this._minGlobalRating = value;
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

    public checkHasCoCategoryId(): boolean {
        return this._coCategoryId != null;
    }
    public getCoCategoryId(): number | null | undefined {
        return this._coCategoryId;
    }
    public setCoCategoryId(value: number | null | undefined): void {
        this._coCategoryId = value;
    }

    public checkHasHasFog(): boolean {
        return this._hasFog != null;
    }
    public getHasFog(): boolean | null | undefined {
        return this._hasFog;
    }
    public setHasFog(value: boolean | null | undefined): void {
        this._hasFog = value;
    }

    public checkHasIsRankedMatch(): boolean {
        return this._isRankedMatch != null;
    }
    public getIsRankedMatch(): boolean | null | undefined {
        return this._isRankedMatch;
    }
    public setIsRankedMatch(value: boolean | null | undefined): void {
        this._isRankedMatch = value;
    }
}
