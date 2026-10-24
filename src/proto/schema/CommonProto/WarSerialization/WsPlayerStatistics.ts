import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { WsPlayerTurnStatistics as $Message$CommonProto$WarSerialization$WsPlayerTurnStatistics, type WsPlayerTurnStatisticsJson as $Json$CommonProto$WarSerialization$WsPlayerTurnStatistics } from "./WsPlayerTurnStatistics.js";

export interface WsPlayerStatisticsJson extends $ProtoSchemaJsonBase {
    playerIndex?: number | null | undefined;
    playerTurnStatisticsArray: $Json$CommonProto$WarSerialization$WsPlayerTurnStatistics[];
}

export class WsPlayerStatistics extends $ProtoSchemaBase {
    private _playerIndex?: number | null | undefined;
    private _playerTurnStatisticsArray: $Message$CommonProto$WarSerialization$WsPlayerTurnStatistics[] = [];

    public static fromJson(obj: WsPlayerStatisticsJson): WsPlayerStatistics {
        return new WsPlayerStatistics().loadJson(obj);
    }
    public override loadJson(obj: WsPlayerStatisticsJson): this {
        this.setPlayerIndex(obj.playerIndex);
        this.setPlayerTurnStatisticsArray(obj.playerTurnStatisticsArray?.map(v => $Message$CommonProto$WarSerialization$WsPlayerTurnStatistics.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: WsPlayerStatisticsJson): WsPlayerStatisticsJson {
        obj ??= ({} as WsPlayerStatisticsJson);

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }

        {
            obj.playerTurnStatisticsArray = this.getPlayerTurnStatisticsArray().map(v => v.toJson());
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
            const value = this.getPlayerTurnStatisticsArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WsPlayerStatistics {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WsPlayerStatistics();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setPlayerIndex(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._playerTurnStatisticsArray;
                        arr.push($Message$CommonProto$WarSerialization$WsPlayerTurnStatistics.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WsPlayerStatistics {
        return WsPlayerStatistics.decode(this.encode());
    }

    public override getSchemaName(): "WsPlayerStatistics" {
        return "WsPlayerStatistics";
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

    public getPlayerTurnStatisticsArray(): $Message$CommonProto$WarSerialization$WsPlayerTurnStatistics[] {
        return this._playerTurnStatisticsArray;
    }
    public setPlayerTurnStatisticsArray(value: $Message$CommonProto$WarSerialization$WsPlayerTurnStatistics[]): void {
        this._playerTurnStatisticsArray = value;
    }
}
