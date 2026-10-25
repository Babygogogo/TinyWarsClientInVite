import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { PlayerInfo as $Message$CommonProto$MultiPlayerWar$MpwWarProgressInfo$PlayerInfo, type PlayerInfoJson as $Json$CommonProto$MultiPlayerWar$MpwWarProgressInfo$PlayerInfo } from "./MpwWarProgressInfo/PlayerInfo.js";

export interface MpwWarProgressInfoJson extends $ProtoSchemaJsonBase {
    warId?: number | null | undefined;
    playerInfoList: $Json$CommonProto$MultiPlayerWar$MpwWarProgressInfo$PlayerInfo[];
    playerIndexInTurn?: number | null | undefined;
    turnIndex?: number | null | undefined;
    enterTurnTime?: number | null | undefined;
    isEnded?: boolean | null | undefined;
    modifiedTime?: number | null | undefined;
}

export class MpwWarProgressInfo extends $ProtoSchemaBase {
    private _warId?: number | null | undefined;
    private _playerInfoList: $Message$CommonProto$MultiPlayerWar$MpwWarProgressInfo$PlayerInfo[] = [];
    private _playerIndexInTurn?: number | null | undefined;
    private _turnIndex?: number | null | undefined;
    private _enterTurnTime?: number | null | undefined;
    private _isEnded?: boolean | null | undefined;
    private _modifiedTime?: number | null | undefined;

    public static fromJson(obj: MpwWarProgressInfoJson): MpwWarProgressInfo {
        return new MpwWarProgressInfo().loadJson(obj);
    }
    public override loadJson(obj: MpwWarProgressInfoJson): this {
        this.setWarId(obj.warId);
        this.setPlayerInfoList(obj.playerInfoList?.map(v => $Message$CommonProto$MultiPlayerWar$MpwWarProgressInfo$PlayerInfo.fromJson(v)) ?? []);
        this.setPlayerIndexInTurn(obj.playerIndexInTurn);
        this.setTurnIndex(obj.turnIndex);
        this.setEnterTurnTime(obj.enterTurnTime);
        this.setIsEnded(obj.isEnded);
        this.setModifiedTime(obj.modifiedTime);
        return this;
    }
    public override toJson(obj?: MpwWarProgressInfoJson): MpwWarProgressInfoJson {
        obj ??= ({} as MpwWarProgressInfoJson);

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            obj.playerInfoList = this.getPlayerInfoList().map(v => v.toJson());
        }

        {
            const value = this.getPlayerIndexInTurn();
            (value != null) && (obj.playerIndexInTurn = value);
        }

        {
            const value = this.getTurnIndex();
            (value != null) && (obj.turnIndex = value);
        }

        {
            const value = this.getEnterTurnTime();
            (value != null) && (obj.enterTurnTime = value);
        }

        {
            const value = this.getIsEnded();
            (value != null) && (obj.isEnded = value);
        }

        {
            const value = this.getModifiedTime();
            (value != null) && (obj.modifiedTime = value);
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
            const value = this.getPlayerInfoList();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getPlayerIndexInTurn();
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

        {
            const value = this.getEnterTurnTime();
            if (value != null) {
                writer.uint32(40).uint32(value);
            }
        }

        {
            const value = this.getIsEnded();
            if (value != null) {
                writer.uint32(48).bool(value);
            }
        }

        {
            const value = this.getModifiedTime();
            if (value != null) {
                writer.uint32(56).uint32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MpwWarProgressInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MpwWarProgressInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWarId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._playerInfoList;
                        arr.push($Message$CommonProto$MultiPlayerWar$MpwWarProgressInfo$PlayerInfo.decode(reader, reader.uint32()));
                    }
                    break;

                case 3:
                    msg.setPlayerIndexInTurn(reader.int32());
                    break;

                case 4:
                    msg.setTurnIndex(reader.int32());
                    break;

                case 5:
                    msg.setEnterTurnTime(reader.uint32());
                    break;

                case 6:
                    msg.setIsEnded(reader.bool());
                    break;

                case 7:
                    msg.setModifiedTime(reader.uint32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MpwWarProgressInfo {
        return MpwWarProgressInfo.decode(this.encode());
    }

    public override getSchemaName(): "MpwWarProgressInfo" {
        return "MpwWarProgressInfo";
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

    public getPlayerInfoList(): $Message$CommonProto$MultiPlayerWar$MpwWarProgressInfo$PlayerInfo[] {
        return this._playerInfoList;
    }
    public setPlayerInfoList(value: $Message$CommonProto$MultiPlayerWar$MpwWarProgressInfo$PlayerInfo[]): void {
        this._playerInfoList = value;
    }

    public checkHasPlayerIndexInTurn(): boolean {
        return this._playerIndexInTurn != null;
    }
    public getPlayerIndexInTurn(): number | null | undefined {
        return this._playerIndexInTurn;
    }
    public setPlayerIndexInTurn(value: number | null | undefined): void {
        this._playerIndexInTurn = value;
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

    public checkHasEnterTurnTime(): boolean {
        return this._enterTurnTime != null;
    }
    public getEnterTurnTime(): number | null | undefined {
        return this._enterTurnTime;
    }
    public setEnterTurnTime(value: number | null | undefined): void {
        this._enterTurnTime = value;
    }

    public checkHasIsEnded(): boolean {
        return this._isEnded != null;
    }
    public getIsEnded(): boolean | null | undefined {
        return this._isEnded;
    }
    public setIsEnded(value: boolean | null | undefined): void {
        this._isEnded = value;
    }

    public checkHasModifiedTime(): boolean {
        return this._modifiedTime != null;
    }
    public getModifiedTime(): number | null | undefined {
        return this._modifiedTime;
    }
    public setModifiedTime(value: number | null | undefined): void {
        this._modifiedTime = value;
    }
}
