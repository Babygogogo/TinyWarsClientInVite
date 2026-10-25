import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { MapSize as $Message$CommonProto$Structure$MapSize, type MapSizeJson as $Json$CommonProto$Structure$MapSize } from "../Structure/MapSize.js";
import { WarPlayerInfo as $Message$CommonProto$Structure$WarPlayerInfo, type WarPlayerInfoJson as $Json$CommonProto$Structure$WarPlayerInfo } from "../Structure/WarPlayerInfo.js";

export interface ReplayInfoJson extends $ProtoSchemaJsonBase {
    replayId?: number | null | undefined;
    configVersion?: string | null | undefined;
    warType?: number | null | undefined;
    normalMapId?: number | null | undefined;
    hasFog?: boolean | null | undefined;
    turnIndex?: number | null | undefined;
    executedActionsCount?: number | null | undefined;
    warEndTime?: number | null | undefined;
    totalRating?: number | null | undefined;
    totalRaters?: number | null | undefined;
    isDraw?: boolean | null | undefined;
    infoVersion?: number | null | undefined;
    mapSize?: $Json$CommonProto$Structure$MapSize | null | undefined;
    bannedCoIdArray: number[];
    playerInfoList: $Json$CommonProto$Structure$WarPlayerInfo[];
}

export class ReplayInfo extends $ProtoSchemaBase {
    private _replayId?: number | null | undefined;
    private _configVersion?: string | null | undefined;
    private _warType?: number | null | undefined;
    private _normalMapId?: number | null | undefined;
    private _hasFog?: boolean | null | undefined;
    private _turnIndex?: number | null | undefined;
    private _executedActionsCount?: number | null | undefined;
    private _warEndTime?: number | null | undefined;
    private _totalRating?: number | null | undefined;
    private _totalRaters?: number | null | undefined;
    private _isDraw?: boolean | null | undefined;
    private _infoVersion?: number | null | undefined;
    private _mapSize?: $Message$CommonProto$Structure$MapSize | null | undefined;
    private _bannedCoIdArray: number[] = [];
    private _playerInfoList: $Message$CommonProto$Structure$WarPlayerInfo[] = [];

    public static fromJson(obj: ReplayInfoJson): ReplayInfo {
        return new ReplayInfo().loadJson(obj);
    }
    public override loadJson(obj: ReplayInfoJson): this {
        this.setReplayId(obj.replayId);
        this.setConfigVersion(obj.configVersion);
        this.setWarType(obj.warType);
        this.setNormalMapId(obj.normalMapId);
        this.setHasFog(obj.hasFog);
        this.setTurnIndex(obj.turnIndex);
        this.setExecutedActionsCount(obj.executedActionsCount);
        this.setWarEndTime(obj.warEndTime);
        this.setTotalRating(obj.totalRating);
        this.setTotalRaters(obj.totalRaters);
        this.setIsDraw(obj.isDraw);
        this.setInfoVersion(obj.infoVersion);
        this.setMapSize(obj.mapSize != null ? $Message$CommonProto$Structure$MapSize.fromJson(obj.mapSize) : null);
        this.setBannedCoIdArray(obj.bannedCoIdArray?.concat() ?? []);
        this.setPlayerInfoList(obj.playerInfoList?.map(v => $Message$CommonProto$Structure$WarPlayerInfo.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: ReplayInfoJson): ReplayInfoJson {
        obj ??= ({} as ReplayInfoJson);

        {
            const value = this.getReplayId();
            (value != null) && (obj.replayId = value);
        }

        {
            const value = this.getConfigVersion();
            (value != null) && (obj.configVersion = value);
        }

        {
            const value = this.getWarType();
            (value != null) && (obj.warType = value);
        }

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getHasFog();
            (value != null) && (obj.hasFog = value);
        }

        {
            const value = this.getTurnIndex();
            (value != null) && (obj.turnIndex = value);
        }

        {
            const value = this.getExecutedActionsCount();
            (value != null) && (obj.executedActionsCount = value);
        }

        {
            const value = this.getWarEndTime();
            (value != null) && (obj.warEndTime = value);
        }

        {
            const value = this.getTotalRating();
            (value != null) && (obj.totalRating = value);
        }

        {
            const value = this.getTotalRaters();
            (value != null) && (obj.totalRaters = value);
        }

        {
            const value = this.getIsDraw();
            (value != null) && (obj.isDraw = value);
        }

        {
            const value = this.getInfoVersion();
            (value != null) && (obj.infoVersion = value);
        }

        {
            const value = this.getMapSize();
            (value != null) && (obj.mapSize = value.toJson());
        }

        {
            obj.bannedCoIdArray = this.getBannedCoIdArray().concat();
        }

        {
            obj.playerInfoList = this.getPlayerInfoList().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getReplayId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getConfigVersion();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getWarType();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getNormalMapId();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getHasFog();
            if ((value != null) && (value != false)) {
                writer.uint32(40).bool(value);
            }
        }

        {
            const value = this.getTurnIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getExecutedActionsCount();
            if ((value != null) && (value != 0)) {
                writer.uint32(56).int32(value);
            }
        }

        {
            const value = this.getWarEndTime();
            if ((value != null) && (value != 0)) {
                writer.uint32(64).uint32(value);
            }
        }

        {
            const value = this.getTotalRating();
            if (value != null) {
                writer.uint32(72).int32(value);
            }
        }

        {
            const value = this.getTotalRaters();
            if (value != null) {
                writer.uint32(80).int32(value);
            }
        }

        {
            const value = this.getIsDraw();
            if ((value != null) && (value != false)) {
                writer.uint32(88).bool(value);
            }
        }

        {
            const value = this.getInfoVersion();
            if ((value != null) && (value != 0)) {
                writer.uint32(96).uint32(value);
            }
        }

        {
            const value = this.getMapSize();
            if (value != null) {
                value.toWriter(writer.uint32(106).fork()).ldelim();
            }
        }

        {
            const value = this.getBannedCoIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(114).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getPlayerInfoList();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(162).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ReplayInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ReplayInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setReplayId(reader.int32());
                    break;

                case 2:
                    msg.setConfigVersion(reader.string());
                    break;

                case 3:
                    msg.setWarType(reader.int32());
                    break;

                case 4:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 5:
                    msg.setHasFog(reader.bool());
                    break;

                case 6:
                    msg.setTurnIndex(reader.int32());
                    break;

                case 7:
                    msg.setExecutedActionsCount(reader.int32());
                    break;

                case 8:
                    msg.setWarEndTime(reader.uint32());
                    break;

                case 9:
                    msg.setTotalRating(reader.int32());
                    break;

                case 10:
                    msg.setTotalRaters(reader.int32());
                    break;

                case 11:
                    msg.setIsDraw(reader.bool());
                    break;

                case 12:
                    msg.setInfoVersion(reader.uint32());
                    break;

                case 13:
                    msg.setMapSize($Message$CommonProto$Structure$MapSize.decode(reader, reader.uint32()));
                    break;

                case 14:
                    {
                        const arr = msg._bannedCoIdArray;
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

                case 20:
                    {
                        const arr = msg._playerInfoList;
                        arr.push($Message$CommonProto$Structure$WarPlayerInfo.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ReplayInfo {
        return ReplayInfo.decode(this.encode());
    }

    public override getSchemaName(): "ReplayInfo" {
        return "ReplayInfo";
    }

    public checkHasReplayId(): boolean {
        return this._replayId != null;
    }
    public getReplayId(): number {
        return this._replayId ?? 0;
    }
    public setReplayId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._replayId = null;
        } else {
            this._replayId = value;
        }
    }

    public checkHasConfigVersion(): boolean {
        return this._configVersion != null;
    }
    public getConfigVersion(): string | null | undefined {
        return this._configVersion;
    }
    public setConfigVersion(value: string | null | undefined): void {
        this._configVersion = value;
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

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number | null | undefined {
        return this._normalMapId;
    }
    public setNormalMapId(value: number | null | undefined): void {
        this._normalMapId = value;
    }

    public checkHasHasFog(): boolean {
        return this._hasFog != null;
    }
    public getHasFog(): boolean {
        return this._hasFog ?? false;
    }
    public setHasFog(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._hasFog = null;
        } else {
            this._hasFog = value;
        }
    }

    public checkHasTurnIndex(): boolean {
        return this._turnIndex != null;
    }
    public getTurnIndex(): number {
        return this._turnIndex ?? 0;
    }
    public setTurnIndex(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._turnIndex = null;
        } else {
            this._turnIndex = value;
        }
    }

    public checkHasExecutedActionsCount(): boolean {
        return this._executedActionsCount != null;
    }
    public getExecutedActionsCount(): number {
        return this._executedActionsCount ?? 0;
    }
    public setExecutedActionsCount(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._executedActionsCount = null;
        } else {
            this._executedActionsCount = value;
        }
    }

    public checkHasWarEndTime(): boolean {
        return this._warEndTime != null;
    }
    public getWarEndTime(): number {
        return this._warEndTime ?? 0;
    }
    public setWarEndTime(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._warEndTime = null;
        } else {
            this._warEndTime = value;
        }
    }

    public checkHasTotalRating(): boolean {
        return this._totalRating != null;
    }
    public getTotalRating(): number | null | undefined {
        return this._totalRating;
    }
    public setTotalRating(value: number | null | undefined): void {
        this._totalRating = value;
    }

    public checkHasTotalRaters(): boolean {
        return this._totalRaters != null;
    }
    public getTotalRaters(): number | null | undefined {
        return this._totalRaters;
    }
    public setTotalRaters(value: number | null | undefined): void {
        this._totalRaters = value;
    }

    public checkHasIsDraw(): boolean {
        return this._isDraw != null;
    }
    public getIsDraw(): boolean {
        return this._isDraw ?? false;
    }
    public setIsDraw(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isDraw = null;
        } else {
            this._isDraw = value;
        }
    }

    public checkHasInfoVersion(): boolean {
        return this._infoVersion != null;
    }
    public getInfoVersion(): number {
        return this._infoVersion ?? 0;
    }
    public setInfoVersion(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._infoVersion = null;
        } else {
            this._infoVersion = value;
        }
    }

    public checkHasMapSize(): boolean {
        return this._mapSize != null;
    }
    public getMapSize(): $Message$CommonProto$Structure$MapSize | null | undefined {
        return this._mapSize;
    }
    public setMapSize(value: $Message$CommonProto$Structure$MapSize | null | undefined): void {
        this._mapSize = value;
    }
    public createIfNotExistsMapSize(): $Message$CommonProto$Structure$MapSize {
        return this._mapSize ??= new $Message$CommonProto$Structure$MapSize();
    }

    public getBannedCoIdArray(): number[] {
        return this._bannedCoIdArray;
    }
    public setBannedCoIdArray(value: number[]): void {
        this._bannedCoIdArray = value;
    }

    public getPlayerInfoList(): $Message$CommonProto$Structure$WarPlayerInfo[] {
        return this._playerInfoList;
    }
    public setPlayerInfoList(value: $Message$CommonProto$Structure$WarPlayerInfo[]): void {
        this._playerInfoList = value;
    }
}
