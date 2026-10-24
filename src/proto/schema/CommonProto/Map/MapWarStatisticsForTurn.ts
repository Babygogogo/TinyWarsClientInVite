import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface MapWarStatisticsForTurnJson extends $ProtoSchemaJsonBase {
    turnIndex?: number | null | undefined;
    totalGames?: number | null | undefined;
    gameResultArray: number[];
}

export class MapWarStatisticsForTurn extends $ProtoSchemaBase {
    private _turnIndex?: number | null | undefined;
    private _totalGames?: number | null | undefined;
    private _gameResultArray: number[] = [];

    public static fromJson(obj: MapWarStatisticsForTurnJson): MapWarStatisticsForTurn {
        return new MapWarStatisticsForTurn().loadJson(obj);
    }
    public override loadJson(obj: MapWarStatisticsForTurnJson): this {
        this.setTurnIndex(obj.turnIndex);
        this.setTotalGames(obj.totalGames);
        this.setGameResultArray(obj.gameResultArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: MapWarStatisticsForTurnJson): MapWarStatisticsForTurnJson {
        obj ??= ({} as MapWarStatisticsForTurnJson);

        {
            const value = this.getTurnIndex();
            (value != null) && (obj.turnIndex = value);
        }

        {
            const value = this.getTotalGames();
            (value != null) && (obj.totalGames = value);
        }

        {
            obj.gameResultArray = this.getGameResultArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTurnIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTotalGames();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getGameResultArray();
            const length = value.length;
            if (length) {
                writer.uint32(26).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MapWarStatisticsForTurn {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MapWarStatisticsForTurn();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTurnIndex(reader.int32());
                    break;

                case 2:
                    msg.setTotalGames(reader.int32());
                    break;

                case 3:
                    {
                        const arr = msg._gameResultArray;
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

    public override clone(): MapWarStatisticsForTurn {
        return MapWarStatisticsForTurn.decode(this.encode());
    }

    public override getSchemaName(): "MapWarStatisticsForTurn" {
        return "MapWarStatisticsForTurn";
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

    public checkHasTotalGames(): boolean {
        return this._totalGames != null;
    }
    public getTotalGames(): number {
        return this._totalGames ?? 0;
    }
    public setTotalGames(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._totalGames = null;
        } else {
            this._totalGames = value;
        }
    }

    public getGameResultArray(): number[] {
        return this._gameResultArray;
    }
    public setGameResultArray(value: number[]): void {
        this._gameResultArray = value;
    }
}
