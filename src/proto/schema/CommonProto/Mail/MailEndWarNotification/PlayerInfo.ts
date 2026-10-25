import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface PlayerInfoJson extends $ProtoSchemaJsonBase {
    userId?: number | null | undefined;
    coId?: number | null | undefined;
    isAlive?: boolean | null | undefined;
    skinId?: number | null | undefined;
    teamIndex?: number | null | undefined;
}

export class PlayerInfo extends $ProtoSchemaBase {
    private _userId?: number | null | undefined;
    private _coId?: number | null | undefined;
    private _isAlive?: boolean | null | undefined;
    private _skinId?: number | null | undefined;
    private _teamIndex?: number | null | undefined;

    public static fromJson(obj: PlayerInfoJson): PlayerInfo {
        return new PlayerInfo().loadJson(obj);
    }
    public override loadJson(obj: PlayerInfoJson): this {
        this.setUserId(obj.userId);
        this.setCoId(obj.coId);
        this.setIsAlive(obj.isAlive);
        this.setSkinId(obj.skinId);
        this.setTeamIndex(obj.teamIndex);
        return this;
    }
    public override toJson(obj?: PlayerInfoJson): PlayerInfoJson {
        obj ??= ({} as PlayerInfoJson);

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getCoId();
            (value != null) && (obj.coId = value);
        }

        {
            const value = this.getIsAlive();
            (value != null) && (obj.isAlive = value);
        }

        {
            const value = this.getSkinId();
            (value != null) && (obj.skinId = value);
        }

        {
            const value = this.getTeamIndex();
            (value != null) && (obj.teamIndex = value);
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
            const value = this.getCoId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getIsAlive();
            if (value != null) {
                writer.uint32(24).bool(value);
            }
        }

        {
            const value = this.getSkinId();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getTeamIndex();
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
                    msg.setUserId(reader.int32());
                    break;

                case 2:
                    msg.setCoId(reader.int32());
                    break;

                case 3:
                    msg.setIsAlive(reader.bool());
                    break;

                case 4:
                    msg.setSkinId(reader.int32());
                    break;

                case 5:
                    msg.setTeamIndex(reader.int32());
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

    public checkHasIsAlive(): boolean {
        return this._isAlive != null;
    }
    public getIsAlive(): boolean | null | undefined {
        return this._isAlive;
    }
    public setIsAlive(value: boolean | null | undefined): void {
        this._isAlive = value;
    }

    public checkHasSkinId(): boolean {
        return this._skinId != null;
    }
    public getSkinId(): number | null | undefined {
        return this._skinId;
    }
    public setSkinId(value: number | null | undefined): void {
        this._skinId = value;
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
}
