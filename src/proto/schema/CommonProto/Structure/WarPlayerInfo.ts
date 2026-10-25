import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WarPlayerInfoJson extends $ProtoSchemaJsonBase {
    playerIndex?: number | null | undefined;
    userId?: number | null | undefined;
    coId?: number | null | undefined;
    teamIndex?: number | null | undefined;
    isAlive?: boolean | null | undefined;
    restTimeToBoot?: number | null | undefined;
    unitAndTileSkinId?: number | null | undefined;
    rankScore?: number | null | undefined;
}

export class WarPlayerInfo extends $ProtoSchemaBase {
    private _playerIndex?: number | null | undefined;
    private _userId?: number | null | undefined;
    private _coId?: number | null | undefined;
    private _teamIndex?: number | null | undefined;
    private _isAlive?: boolean | null | undefined;
    private _restTimeToBoot?: number | null | undefined;
    private _unitAndTileSkinId?: number | null | undefined;
    private _rankScore?: number | null | undefined;

    public static fromJson(obj: WarPlayerInfoJson): WarPlayerInfo {
        return new WarPlayerInfo().loadJson(obj);
    }
    public override loadJson(obj: WarPlayerInfoJson): this {
        this.setPlayerIndex(obj.playerIndex);
        this.setUserId(obj.userId);
        this.setCoId(obj.coId);
        this.setTeamIndex(obj.teamIndex);
        this.setIsAlive(obj.isAlive);
        this.setRestTimeToBoot(obj.restTimeToBoot);
        this.setUnitAndTileSkinId(obj.unitAndTileSkinId);
        this.setRankScore(obj.rankScore);
        return this;
    }
    public override toJson(obj?: WarPlayerInfoJson): WarPlayerInfoJson {
        obj ??= ({} as WarPlayerInfoJson);

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getCoId();
            (value != null) && (obj.coId = value);
        }

        {
            const value = this.getTeamIndex();
            (value != null) && (obj.teamIndex = value);
        }

        {
            const value = this.getIsAlive();
            (value != null) && (obj.isAlive = value);
        }

        {
            const value = this.getRestTimeToBoot();
            (value != null) && (obj.restTimeToBoot = value);
        }

        {
            const value = this.getUnitAndTileSkinId();
            (value != null) && (obj.unitAndTileSkinId = value);
        }

        {
            const value = this.getRankScore();
            (value != null) && (obj.rankScore = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getPlayerIndex();
            if ((value != null) && (value != 0)) {
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
            const value = this.getCoId();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getTeamIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getIsAlive();
            if ((value != null) && (value != false)) {
                writer.uint32(40).bool(value);
            }
        }

        {
            const value = this.getRestTimeToBoot();
            if ((value != null) && (value != 0)) {
                writer.uint32(48).sint32(value);
            }
        }

        {
            const value = this.getUnitAndTileSkinId();
            if ((value != null) && (value != 0)) {
                writer.uint32(56).int32(value);
            }
        }

        {
            const value = this.getRankScore();
            if (value != null) {
                writer.uint32(64).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WarPlayerInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WarPlayerInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setPlayerIndex(reader.int32());
                    break;

                case 2:
                    msg.setUserId(reader.int32());
                    break;

                case 3:
                    msg.setCoId(reader.int32());
                    break;

                case 4:
                    msg.setTeamIndex(reader.int32());
                    break;

                case 5:
                    msg.setIsAlive(reader.bool());
                    break;

                case 6:
                    msg.setRestTimeToBoot(reader.sint32());
                    break;

                case 7:
                    msg.setUnitAndTileSkinId(reader.int32());
                    break;

                case 8:
                    msg.setRankScore(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WarPlayerInfo {
        return WarPlayerInfo.decode(this.encode());
    }

    public override getSchemaName(): "WarPlayerInfo" {
        return "WarPlayerInfo";
    }

    public checkHasPlayerIndex(): boolean {
        return this._playerIndex != null;
    }
    public getPlayerIndex(): number {
        return this._playerIndex ?? 0;
    }
    public setPlayerIndex(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._playerIndex = null;
        } else {
            this._playerIndex = value;
        }
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

    public checkHasCoId(): boolean {
        return this._coId != null;
    }
    public getCoId(): number {
        return this._coId ?? 0;
    }
    public setCoId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._coId = null;
        } else {
            this._coId = value;
        }
    }

    public checkHasTeamIndex(): boolean {
        return this._teamIndex != null;
    }
    public getTeamIndex(): number {
        return this._teamIndex ?? 0;
    }
    public setTeamIndex(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._teamIndex = null;
        } else {
            this._teamIndex = value;
        }
    }

    public checkHasIsAlive(): boolean {
        return this._isAlive != null;
    }
    public getIsAlive(): boolean {
        return this._isAlive ?? false;
    }
    public setIsAlive(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isAlive = null;
        } else {
            this._isAlive = value;
        }
    }

    public checkHasRestTimeToBoot(): boolean {
        return this._restTimeToBoot != null;
    }
    public getRestTimeToBoot(): number {
        return this._restTimeToBoot ?? 0;
    }
    public setRestTimeToBoot(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._restTimeToBoot = null;
        } else {
            this._restTimeToBoot = value;
        }
    }

    public checkHasUnitAndTileSkinId(): boolean {
        return this._unitAndTileSkinId != null;
    }
    public getUnitAndTileSkinId(): number {
        return this._unitAndTileSkinId ?? 0;
    }
    public setUnitAndTileSkinId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitAndTileSkinId = null;
        } else {
            this._unitAndTileSkinId = value;
        }
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
}
