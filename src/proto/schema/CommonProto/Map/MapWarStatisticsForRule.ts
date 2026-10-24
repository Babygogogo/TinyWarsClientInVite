import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { MapWarStatisticsForTurn as $Message$CommonProto$Map$MapWarStatisticsForTurn, type MapWarStatisticsForTurnJson as $Json$CommonProto$Map$MapWarStatisticsForTurn } from "./MapWarStatisticsForTurn.js";

export interface MapWarStatisticsForRuleJson extends $ProtoSchemaJsonBase {
    ruleId?: number | null | undefined;
    warType?: number | null | undefined;
    statisticsForTurnArray: $Json$CommonProto$Map$MapWarStatisticsForTurn[];
}

export class MapWarStatisticsForRule extends $ProtoSchemaBase {
    private _ruleId?: number | null | undefined;
    private _warType?: number | null | undefined;
    private _statisticsForTurnArray: $Message$CommonProto$Map$MapWarStatisticsForTurn[] = [];

    public static fromJson(obj: MapWarStatisticsForRuleJson): MapWarStatisticsForRule {
        return new MapWarStatisticsForRule().loadJson(obj);
    }
    public override loadJson(obj: MapWarStatisticsForRuleJson): this {
        this.setRuleId(obj.ruleId);
        this.setWarType(obj.warType);
        this.setStatisticsForTurnArray(obj.statisticsForTurnArray?.map(v => $Message$CommonProto$Map$MapWarStatisticsForTurn.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: MapWarStatisticsForRuleJson): MapWarStatisticsForRuleJson {
        obj ??= ({} as MapWarStatisticsForRuleJson);

        {
            const value = this.getRuleId();
            (value != null) && (obj.ruleId = value);
        }

        {
            const value = this.getWarType();
            (value != null) && (obj.warType = value);
        }

        {
            obj.statisticsForTurnArray = this.getStatisticsForTurnArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getRuleId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getWarType();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getStatisticsForTurnArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MapWarStatisticsForRule {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MapWarStatisticsForRule();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setRuleId(reader.int32());
                    break;

                case 2:
                    msg.setWarType(reader.int32());
                    break;

                case 3:
                    {
                        const arr = msg._statisticsForTurnArray;
                        arr.push($Message$CommonProto$Map$MapWarStatisticsForTurn.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MapWarStatisticsForRule {
        return MapWarStatisticsForRule.decode(this.encode());
    }

    public override getSchemaName(): "MapWarStatisticsForRule" {
        return "MapWarStatisticsForRule";
    }

    public checkHasRuleId(): boolean {
        return this._ruleId != null;
    }
    public getRuleId(): number {
        return this._ruleId ?? 0;
    }
    public setRuleId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._ruleId = null;
        } else {
            this._ruleId = value;
        }
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

    public getStatisticsForTurnArray(): $Message$CommonProto$Map$MapWarStatisticsForTurn[] {
        return this._statisticsForTurnArray;
    }
    public setStatisticsForTurnArray(value: $Message$CommonProto$Map$MapWarStatisticsForTurn[]): void {
        this._statisticsForTurnArray = value;
    }
}
