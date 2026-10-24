import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { WsPlayerStatistics as $Message$CommonProto$WarSerialization$WsPlayerStatistics, type WsPlayerStatisticsJson as $Json$CommonProto$WarSerialization$WsPlayerStatistics } from "./WsPlayerStatistics.js";
import { WsUnitStatistics as $Message$CommonProto$WarSerialization$WsUnitStatistics, type WsUnitStatisticsJson as $Json$CommonProto$WarSerialization$WsUnitStatistics } from "./WsUnitStatistics.js";

export interface SerialWarStatisticsManagerJson extends $ProtoSchemaJsonBase {
    playerStatisticsArray: $Json$CommonProto$WarSerialization$WsPlayerStatistics[];
    hasHandledPreDeployedUnits?: boolean | null | undefined;
    unitStatisticsArray: $Json$CommonProto$WarSerialization$WsUnitStatistics[];
}

export class SerialWarStatisticsManager extends $ProtoSchemaBase {
    private _playerStatisticsArray: $Message$CommonProto$WarSerialization$WsPlayerStatistics[] = [];
    private _hasHandledPreDeployedUnits?: boolean | null | undefined;
    private _unitStatisticsArray: $Message$CommonProto$WarSerialization$WsUnitStatistics[] = [];

    public static fromJson(obj: SerialWarStatisticsManagerJson): SerialWarStatisticsManager {
        return new SerialWarStatisticsManager().loadJson(obj);
    }
    public override loadJson(obj: SerialWarStatisticsManagerJson): this {
        this.setPlayerStatisticsArray(obj.playerStatisticsArray?.map(v => $Message$CommonProto$WarSerialization$WsPlayerStatistics.fromJson(v)) ?? []);
        this.setHasHandledPreDeployedUnits(obj.hasHandledPreDeployedUnits);
        this.setUnitStatisticsArray(obj.unitStatisticsArray?.map(v => $Message$CommonProto$WarSerialization$WsUnitStatistics.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: SerialWarStatisticsManagerJson): SerialWarStatisticsManagerJson {
        obj ??= ({} as SerialWarStatisticsManagerJson);

        {
            obj.playerStatisticsArray = this.getPlayerStatisticsArray().map(v => v.toJson());
        }

        {
            const value = this.getHasHandledPreDeployedUnits();
            (value != null) && (obj.hasHandledPreDeployedUnits = value);
        }

        {
            obj.unitStatisticsArray = this.getUnitStatisticsArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getPlayerStatisticsArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getHasHandledPreDeployedUnits();
            if (value != null) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getUnitStatisticsArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SerialWarStatisticsManager {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SerialWarStatisticsManager();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._playerStatisticsArray;
                        arr.push($Message$CommonProto$WarSerialization$WsPlayerStatistics.decode(reader, reader.uint32()));
                    }
                    break;

                case 2:
                    msg.setHasHandledPreDeployedUnits(reader.bool());
                    break;

                case 3:
                    {
                        const arr = msg._unitStatisticsArray;
                        arr.push($Message$CommonProto$WarSerialization$WsUnitStatistics.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SerialWarStatisticsManager {
        return SerialWarStatisticsManager.decode(this.encode());
    }

    public override getSchemaName(): "SerialWarStatisticsManager" {
        return "SerialWarStatisticsManager";
    }

    public getPlayerStatisticsArray(): $Message$CommonProto$WarSerialization$WsPlayerStatistics[] {
        return this._playerStatisticsArray;
    }
    public setPlayerStatisticsArray(value: $Message$CommonProto$WarSerialization$WsPlayerStatistics[]): void {
        this._playerStatisticsArray = value;
    }

    public checkHasHasHandledPreDeployedUnits(): boolean {
        return this._hasHandledPreDeployedUnits != null;
    }
    public getHasHandledPreDeployedUnits(): boolean | null | undefined {
        return this._hasHandledPreDeployedUnits;
    }
    public setHasHandledPreDeployedUnits(value: boolean | null | undefined): void {
        this._hasHandledPreDeployedUnits = value;
    }

    public getUnitStatisticsArray(): $Message$CommonProto$WarSerialization$WsUnitStatistics[] {
        return this._unitStatisticsArray;
    }
    public setUnitStatisticsArray(value: $Message$CommonProto$WarSerialization$WsUnitStatistics[]): void {
        this._unitStatisticsArray = value;
    }
}
