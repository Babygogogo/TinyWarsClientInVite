import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ValueAndComparator as $Message$CommonProto$Structure$ValueAndComparator, type ValueAndComparatorJson as $Json$CommonProto$Structure$ValueAndComparator } from "../Structure/ValueAndComparator.js";

export interface WecManualActionStatisticsJson extends $ProtoSchemaJsonBase {
    playerIndexArray: number[];
    isPlayerInTurn?: boolean | null | undefined;
    recentTurnsCount?: number | null | undefined;
    totalActions?: $Json$CommonProto$Structure$ValueAndComparator | null | undefined;
}

export class WecManualActionStatistics extends $ProtoSchemaBase {
    private _playerIndexArray: number[] = [];
    private _isPlayerInTurn?: boolean | null | undefined;
    private _recentTurnsCount?: number | null | undefined;
    private _totalActions?: $Message$CommonProto$Structure$ValueAndComparator | null | undefined;

    public static fromJson(obj: WecManualActionStatisticsJson): WecManualActionStatistics {
        return new WecManualActionStatistics().loadJson(obj);
    }
    public override loadJson(obj: WecManualActionStatisticsJson): this {
        this.setPlayerIndexArray(obj.playerIndexArray?.concat() ?? []);
        this.setIsPlayerInTurn(obj.isPlayerInTurn);
        this.setRecentTurnsCount(obj.recentTurnsCount);
        this.setTotalActions(obj.totalActions != null ? $Message$CommonProto$Structure$ValueAndComparator.fromJson(obj.totalActions) : null);
        return this;
    }
    public override toJson(obj?: WecManualActionStatisticsJson): WecManualActionStatisticsJson {
        obj ??= ({} as WecManualActionStatisticsJson);

        {
            obj.playerIndexArray = this.getPlayerIndexArray().concat();
        }

        {
            const value = this.getIsPlayerInTurn();
            (value != null) && (obj.isPlayerInTurn = value);
        }

        {
            const value = this.getRecentTurnsCount();
            (value != null) && (obj.recentTurnsCount = value);
        }

        {
            const value = this.getTotalActions();
            (value != null) && (obj.totalActions = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getPlayerIndexArray();
            const length = value.length;
            if (length) {
                writer.uint32(10).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getIsPlayerInTurn();
            if (value != null) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getRecentTurnsCount();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getTotalActions();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WecManualActionStatistics {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WecManualActionStatistics();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._playerIndexArray;
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

                case 2:
                    msg.setIsPlayerInTurn(reader.bool());
                    break;

                case 3:
                    msg.setRecentTurnsCount(reader.int32());
                    break;

                case 4:
                    msg.setTotalActions($Message$CommonProto$Structure$ValueAndComparator.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WecManualActionStatistics {
        return WecManualActionStatistics.decode(this.encode());
    }

    public override getSchemaName(): "WecManualActionStatistics" {
        return "WecManualActionStatistics";
    }

    public getPlayerIndexArray(): number[] {
        return this._playerIndexArray;
    }
    public setPlayerIndexArray(value: number[]): void {
        this._playerIndexArray = value;
    }

    public checkHasIsPlayerInTurn(): boolean {
        return this._isPlayerInTurn != null;
    }
    public getIsPlayerInTurn(): boolean | null | undefined {
        return this._isPlayerInTurn;
    }
    public setIsPlayerInTurn(value: boolean | null | undefined): void {
        this._isPlayerInTurn = value;
    }

    public checkHasRecentTurnsCount(): boolean {
        return this._recentTurnsCount != null;
    }
    public getRecentTurnsCount(): number | null | undefined {
        return this._recentTurnsCount;
    }
    public setRecentTurnsCount(value: number | null | undefined): void {
        this._recentTurnsCount = value;
    }

    public checkHasTotalActions(): boolean {
        return this._totalActions != null;
    }
    public getTotalActions(): $Message$CommonProto$Structure$ValueAndComparator | null | undefined {
        return this._totalActions;
    }
    public setTotalActions(value: $Message$CommonProto$Structure$ValueAndComparator | null | undefined): void {
        this._totalActions = value;
    }
    public createIfNotExistsTotalActions(): $Message$CommonProto$Structure$ValueAndComparator {
        return this._totalActions ??= new $Message$CommonProto$Structure$ValueAndComparator();
    }
}
