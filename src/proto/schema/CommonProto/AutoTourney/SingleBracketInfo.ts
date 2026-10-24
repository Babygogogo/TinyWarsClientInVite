import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface SingleBracketInfoJson extends $ProtoSchemaJsonBase {
    bracketRoundId?: number | null | undefined;
    bracketGameId?: number | null | undefined;
    userIdArray: number[];
    warId?: number | null | undefined;
    replayId?: number | null | undefined;
    winnerUserId?: number | null | undefined;
}

export class SingleBracketInfo extends $ProtoSchemaBase {
    private _bracketRoundId?: number | null | undefined;
    private _bracketGameId?: number | null | undefined;
    private _userIdArray: number[] = [];
    private _warId?: number | null | undefined;
    private _replayId?: number | null | undefined;
    private _winnerUserId?: number | null | undefined;

    public static fromJson(obj: SingleBracketInfoJson): SingleBracketInfo {
        return new SingleBracketInfo().loadJson(obj);
    }
    public override loadJson(obj: SingleBracketInfoJson): this {
        this.setBracketRoundId(obj.bracketRoundId);
        this.setBracketGameId(obj.bracketGameId);
        this.setUserIdArray(obj.userIdArray?.concat() ?? []);
        this.setWarId(obj.warId);
        this.setReplayId(obj.replayId);
        this.setWinnerUserId(obj.winnerUserId);
        return this;
    }
    public override toJson(obj?: SingleBracketInfoJson): SingleBracketInfoJson {
        obj ??= ({} as SingleBracketInfoJson);

        {
            const value = this.getBracketRoundId();
            (value != null) && (obj.bracketRoundId = value);
        }

        {
            const value = this.getBracketGameId();
            (value != null) && (obj.bracketGameId = value);
        }

        {
            obj.userIdArray = this.getUserIdArray().concat();
        }

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            const value = this.getReplayId();
            (value != null) && (obj.replayId = value);
        }

        {
            const value = this.getWinnerUserId();
            (value != null) && (obj.winnerUserId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getBracketRoundId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getBracketGameId();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getUserIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(26).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getWarId();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getReplayId();
            if (value != null) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getWinnerUserId();
            if (value != null) {
                writer.uint32(56).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SingleBracketInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SingleBracketInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setBracketRoundId(reader.int32());
                    break;

                case 2:
                    msg.setBracketGameId(reader.int32());
                    break;

                case 3:
                    {
                        const arr = msg._userIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 5:
                    msg.setWarId(reader.int32());
                    break;

                case 6:
                    msg.setReplayId(reader.int32());
                    break;

                case 7:
                    msg.setWinnerUserId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SingleBracketInfo {
        return SingleBracketInfo.decode(this.encode());
    }

    public override getSchemaName(): "SingleBracketInfo" {
        return "SingleBracketInfo";
    }

    public checkHasBracketRoundId(): boolean {
        return this._bracketRoundId != null;
    }
    public getBracketRoundId(): number {
        return this._bracketRoundId ?? 0;
    }
    public setBracketRoundId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._bracketRoundId = null;
        } else {
            this._bracketRoundId = value;
        }
    }

    public checkHasBracketGameId(): boolean {
        return this._bracketGameId != null;
    }
    public getBracketGameId(): number {
        return this._bracketGameId ?? 0;
    }
    public setBracketGameId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._bracketGameId = null;
        } else {
            this._bracketGameId = value;
        }
    }

    public getUserIdArray(): number[] {
        return this._userIdArray;
    }
    public setUserIdArray(value: number[]): void {
        this._userIdArray = value;
    }

    public checkHasWarId(): boolean {
        return this._warId != null;
    }
    public getWarId(): number | null | undefined {
        return this._warId;
    }
    public setWarId(value: number | null | undefined): void {
        this._warId = value;
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

    public checkHasWinnerUserId(): boolean {
        return this._winnerUserId != null;
    }
    public getWinnerUserId(): number | null | undefined {
        return this._winnerUserId;
    }
    public setWinnerUserId(value: number | null | undefined): void {
        this._winnerUserId = value;
    }
}
