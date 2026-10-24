import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface GameDataJson extends $ProtoSchemaJsonBase {
    warType?: number | null | undefined;
    normalMapId?: number | null | undefined;
    turnIndex?: number | null | undefined;
    executedActionsCount?: number | null | undefined;
    winnerPlayerIndex?: number | null | undefined;
    rankScoreArray: number[];
    pickedCoIdArray: number[];
    bannedCoIdArray: number[];
}

export class GameData extends $ProtoSchemaBase {
    private _warType?: number | null | undefined;
    private _normalMapId?: number | null | undefined;
    private _turnIndex?: number | null | undefined;
    private _executedActionsCount?: number | null | undefined;
    private _winnerPlayerIndex?: number | null | undefined;
    private _rankScoreArray: number[] = [];
    private _pickedCoIdArray: number[] = [];
    private _bannedCoIdArray: number[] = [];

    public static fromJson(obj: GameDataJson): GameData {
        return new GameData().loadJson(obj);
    }
    public override loadJson(obj: GameDataJson): this {
        this.setWarType(obj.warType);
        this.setNormalMapId(obj.normalMapId);
        this.setTurnIndex(obj.turnIndex);
        this.setExecutedActionsCount(obj.executedActionsCount);
        this.setWinnerPlayerIndex(obj.winnerPlayerIndex);
        this.setRankScoreArray(obj.rankScoreArray?.concat() ?? []);
        this.setPickedCoIdArray(obj.pickedCoIdArray?.concat() ?? []);
        this.setBannedCoIdArray(obj.bannedCoIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: GameDataJson): GameDataJson {
        obj ??= ({} as GameDataJson);

        {
            const value = this.getWarType();
            (value != null) && (obj.warType = value);
        }

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
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
            const value = this.getWinnerPlayerIndex();
            (value != null) && (obj.winnerPlayerIndex = value);
        }

        {
            obj.rankScoreArray = this.getRankScoreArray().concat();
        }

        {
            obj.pickedCoIdArray = this.getPickedCoIdArray().concat();
        }

        {
            obj.bannedCoIdArray = this.getBannedCoIdArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWarType();
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
            const value = this.getTurnIndex();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getExecutedActionsCount();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getWinnerPlayerIndex();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getRankScoreArray();
            const length = value.length;
            if (length) {
                writer.uint32(58).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getPickedCoIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(66).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getBannedCoIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(74).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): GameData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new GameData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWarType(reader.int32());
                    break;

                case 2:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 3:
                    msg.setTurnIndex(reader.int32());
                    break;

                case 4:
                    msg.setExecutedActionsCount(reader.int32());
                    break;

                case 5:
                    msg.setWinnerPlayerIndex(reader.int32());
                    break;

                case 7:
                    {
                        const arr = msg._rankScoreArray;
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

                case 8:
                    {
                        const arr = msg._pickedCoIdArray;
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

                case 9:
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

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): GameData {
        return GameData.decode(this.encode());
    }

    public override getSchemaName(): "GameData" {
        return "GameData";
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

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number | null | undefined {
        return this._normalMapId;
    }
    public setNormalMapId(value: number | null | undefined): void {
        this._normalMapId = value;
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

    public checkHasExecutedActionsCount(): boolean {
        return this._executedActionsCount != null;
    }
    public getExecutedActionsCount(): number | null | undefined {
        return this._executedActionsCount;
    }
    public setExecutedActionsCount(value: number | null | undefined): void {
        this._executedActionsCount = value;
    }

    public checkHasWinnerPlayerIndex(): boolean {
        return this._winnerPlayerIndex != null;
    }
    public getWinnerPlayerIndex(): number | null | undefined {
        return this._winnerPlayerIndex;
    }
    public setWinnerPlayerIndex(value: number | null | undefined): void {
        this._winnerPlayerIndex = value;
    }

    public getRankScoreArray(): number[] {
        return this._rankScoreArray;
    }
    public setRankScoreArray(value: number[]): void {
        this._rankScoreArray = value;
    }

    public getPickedCoIdArray(): number[] {
        return this._pickedCoIdArray;
    }
    public setPickedCoIdArray(value: number[]): void {
        this._pickedCoIdArray = value;
    }

    public getBannedCoIdArray(): number[] {
        return this._bannedCoIdArray;
    }
    public setBannedCoIdArray(value: number[]): void {
        this._bannedCoIdArray = value;
    }
}
