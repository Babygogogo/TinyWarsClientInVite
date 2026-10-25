import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface MpwFilterJson extends $ProtoSchemaJsonBase {
    warId?: number | null | undefined;
    mapName?: string | null | undefined;
    userNickname?: string | null | undefined;
    coName?: string | null | undefined;
    userIdInWar?: number | null | undefined;
    watchBeRequestedUserId?: number | null | undefined;
    watchBeWatchedUserId?: number | null | undefined;
    watchOngoingSrcUserId?: number | null | undefined;
    watchRequestableSrcUserId?: number | null | undefined;
    playersCountUnneutral?: number | null | undefined;
}

export class MpwFilter extends $ProtoSchemaBase {
    private _warId?: number | null | undefined;
    private _mapName?: string | null | undefined;
    private _userNickname?: string | null | undefined;
    private _coName?: string | null | undefined;
    private _userIdInWar?: number | null | undefined;
    private _watchBeRequestedUserId?: number | null | undefined;
    private _watchBeWatchedUserId?: number | null | undefined;
    private _watchOngoingSrcUserId?: number | null | undefined;
    private _watchRequestableSrcUserId?: number | null | undefined;
    private _playersCountUnneutral?: number | null | undefined;

    public static fromJson(obj: MpwFilterJson): MpwFilter {
        return new MpwFilter().loadJson(obj);
    }
    public override loadJson(obj: MpwFilterJson): this {
        this.setWarId(obj.warId);
        this.setMapName(obj.mapName);
        this.setUserNickname(obj.userNickname);
        this.setCoName(obj.coName);
        this.setUserIdInWar(obj.userIdInWar);
        this.setWatchBeRequestedUserId(obj.watchBeRequestedUserId);
        this.setWatchBeWatchedUserId(obj.watchBeWatchedUserId);
        this.setWatchOngoingSrcUserId(obj.watchOngoingSrcUserId);
        this.setWatchRequestableSrcUserId(obj.watchRequestableSrcUserId);
        this.setPlayersCountUnneutral(obj.playersCountUnneutral);
        return this;
    }
    public override toJson(obj?: MpwFilterJson): MpwFilterJson {
        obj ??= ({} as MpwFilterJson);

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            const value = this.getMapName();
            (value != null) && (obj.mapName = value);
        }

        {
            const value = this.getUserNickname();
            (value != null) && (obj.userNickname = value);
        }

        {
            const value = this.getCoName();
            (value != null) && (obj.coName = value);
        }

        {
            const value = this.getUserIdInWar();
            (value != null) && (obj.userIdInWar = value);
        }

        {
            const value = this.getWatchBeRequestedUserId();
            (value != null) && (obj.watchBeRequestedUserId = value);
        }

        {
            const value = this.getWatchBeWatchedUserId();
            (value != null) && (obj.watchBeWatchedUserId = value);
        }

        {
            const value = this.getWatchOngoingSrcUserId();
            (value != null) && (obj.watchOngoingSrcUserId = value);
        }

        {
            const value = this.getWatchRequestableSrcUserId();
            (value != null) && (obj.watchRequestableSrcUserId = value);
        }

        {
            const value = this.getPlayersCountUnneutral();
            (value != null) && (obj.playersCountUnneutral = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWarId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getMapName();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getUserNickname();
            if (value != null) {
                writer.uint32(26).string(value);
            }
        }

        {
            const value = this.getCoName();
            if (value != null) {
                writer.uint32(34).string(value);
            }
        }

        {
            const value = this.getUserIdInWar();
            if (value != null) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getWatchBeRequestedUserId();
            if (value != null) {
                writer.uint32(72).int32(value);
            }
        }

        {
            const value = this.getWatchBeWatchedUserId();
            if (value != null) {
                writer.uint32(80).int32(value);
            }
        }

        {
            const value = this.getWatchOngoingSrcUserId();
            if (value != null) {
                writer.uint32(88).int32(value);
            }
        }

        {
            const value = this.getWatchRequestableSrcUserId();
            if (value != null) {
                writer.uint32(96).int32(value);
            }
        }

        {
            const value = this.getPlayersCountUnneutral();
            if (value != null) {
                writer.uint32(104).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MpwFilter {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MpwFilter();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWarId(reader.int32());
                    break;

                case 2:
                    msg.setMapName(reader.string());
                    break;

                case 3:
                    msg.setUserNickname(reader.string());
                    break;

                case 4:
                    msg.setCoName(reader.string());
                    break;

                case 6:
                    msg.setUserIdInWar(reader.int32());
                    break;

                case 9:
                    msg.setWatchBeRequestedUserId(reader.int32());
                    break;

                case 10:
                    msg.setWatchBeWatchedUserId(reader.int32());
                    break;

                case 11:
                    msg.setWatchOngoingSrcUserId(reader.int32());
                    break;

                case 12:
                    msg.setWatchRequestableSrcUserId(reader.int32());
                    break;

                case 13:
                    msg.setPlayersCountUnneutral(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MpwFilter {
        return MpwFilter.decode(this.encode());
    }

    public override getSchemaName(): "MpwFilter" {
        return "MpwFilter";
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

    public checkHasMapName(): boolean {
        return this._mapName != null;
    }
    public getMapName(): string | null | undefined {
        return this._mapName;
    }
    public setMapName(value: string | null | undefined): void {
        this._mapName = value;
    }

    public checkHasUserNickname(): boolean {
        return this._userNickname != null;
    }
    public getUserNickname(): string | null | undefined {
        return this._userNickname;
    }
    public setUserNickname(value: string | null | undefined): void {
        this._userNickname = value;
    }

    public checkHasCoName(): boolean {
        return this._coName != null;
    }
    public getCoName(): string | null | undefined {
        return this._coName;
    }
    public setCoName(value: string | null | undefined): void {
        this._coName = value;
    }

    public checkHasUserIdInWar(): boolean {
        return this._userIdInWar != null;
    }
    public getUserIdInWar(): number | null | undefined {
        return this._userIdInWar;
    }
    public setUserIdInWar(value: number | null | undefined): void {
        this._userIdInWar = value;
    }

    public checkHasWatchBeRequestedUserId(): boolean {
        return this._watchBeRequestedUserId != null;
    }
    public getWatchBeRequestedUserId(): number | null | undefined {
        return this._watchBeRequestedUserId;
    }
    public setWatchBeRequestedUserId(value: number | null | undefined): void {
        this._watchBeRequestedUserId = value;
    }

    public checkHasWatchBeWatchedUserId(): boolean {
        return this._watchBeWatchedUserId != null;
    }
    public getWatchBeWatchedUserId(): number | null | undefined {
        return this._watchBeWatchedUserId;
    }
    public setWatchBeWatchedUserId(value: number | null | undefined): void {
        this._watchBeWatchedUserId = value;
    }

    public checkHasWatchOngoingSrcUserId(): boolean {
        return this._watchOngoingSrcUserId != null;
    }
    public getWatchOngoingSrcUserId(): number | null | undefined {
        return this._watchOngoingSrcUserId;
    }
    public setWatchOngoingSrcUserId(value: number | null | undefined): void {
        this._watchOngoingSrcUserId = value;
    }

    public checkHasWatchRequestableSrcUserId(): boolean {
        return this._watchRequestableSrcUserId != null;
    }
    public getWatchRequestableSrcUserId(): number | null | undefined {
        return this._watchRequestableSrcUserId;
    }
    public setWatchRequestableSrcUserId(value: number | null | undefined): void {
        this._watchRequestableSrcUserId = value;
    }

    public checkHasPlayersCountUnneutral(): boolean {
        return this._playersCountUnneutral != null;
    }
    public getPlayersCountUnneutral(): number | null | undefined {
        return this._playersCountUnneutral;
    }
    public setPlayersCountUnneutral(value: number | null | undefined): void {
        this._playersCountUnneutral = value;
    }
}
