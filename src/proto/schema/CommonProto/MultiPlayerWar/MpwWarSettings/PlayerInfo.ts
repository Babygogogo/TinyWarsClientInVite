import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface PlayerInfoJson extends $ProtoSchemaJsonBase {
    playerIndex?: number | null | undefined;
    userId?: number | null | undefined;
    coId?: number | null | undefined;
    teamIndex?: number | null | undefined;
    unitAndTileSkinId?: number | null | undefined;
}

export class PlayerInfo extends $ProtoSchemaBase {
    private _playerIndex?: number | null | undefined;
    private _userId?: number | null | undefined;
    private _coId?: number | null | undefined;
    private _teamIndex?: number | null | undefined;
    private _unitAndTileSkinId?: number | null | undefined;

    public static fromJson(obj: PlayerInfoJson): PlayerInfo {
        return new PlayerInfo().loadJson(obj);
    }
    public override loadJson(obj: PlayerInfoJson): this {
        this.setPlayerIndex(obj.playerIndex);
        this.setUserId(obj.userId);
        this.setCoId(obj.coId);
        this.setTeamIndex(obj.teamIndex);
        this.setUnitAndTileSkinId(obj.unitAndTileSkinId);
        return this;
    }
    public override toJson(obj?: PlayerInfoJson): PlayerInfoJson {
        obj ??= ({} as PlayerInfoJson);

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
            const value = this.getUnitAndTileSkinId();
            (value != null) && (obj.unitAndTileSkinId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getPlayerIndex();
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
            const value = this.getCoId();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getTeamIndex();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getUnitAndTileSkinId();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): PlayerInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new PlayerInfo();
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
                    msg.setUnitAndTileSkinId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): PlayerInfo {
        return PlayerInfo.decode(this.encode());
    }

    public override getSchemaName(): "PlayerInfo" {
        return "PlayerInfo";
    }

    public checkHasPlayerIndex(): boolean {
        return this._playerIndex != null;
    }
    public getPlayerIndex(): number | null | undefined {
        return this._playerIndex;
    }
    public setPlayerIndex(value: number | null | undefined): void {
        this._playerIndex = value;
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
    public getCoId(): number | null | undefined {
        return this._coId;
    }
    public setCoId(value: number | null | undefined): void {
        this._coId = value;
    }

    public checkHasTeamIndex(): boolean {
        return this._teamIndex != null;
    }
    public getTeamIndex(): number | null | undefined {
        return this._teamIndex;
    }
    public setTeamIndex(value: number | null | undefined): void {
        this._teamIndex = value;
    }

    public checkHasUnitAndTileSkinId(): boolean {
        return this._unitAndTileSkinId != null;
    }
    public getUnitAndTileSkinId(): number | null | undefined {
        return this._unitAndTileSkinId;
    }
    public setUnitAndTileSkinId(value: number | null | undefined): void {
        this._unitAndTileSkinId = value;
    }
}
