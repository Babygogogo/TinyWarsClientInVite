import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { MapWarStatisticsForRule as $Message$CommonProto$Map$MapWarStatisticsForRule, type MapWarStatisticsForRuleJson as $Json$CommonProto$Map$MapWarStatisticsForRule } from "./MapWarStatisticsForRule.js";

export interface MapWarStatisticsJson extends $ProtoSchemaJsonBase {
    statisticsForRuleArray: $Json$CommonProto$Map$MapWarStatisticsForRule[];
}

export class MapWarStatistics extends $ProtoSchemaBase {
    private _statisticsForRuleArray: $Message$CommonProto$Map$MapWarStatisticsForRule[] = [];

    public static fromJson(obj: MapWarStatisticsJson): MapWarStatistics {
        return new MapWarStatistics().loadJson(obj);
    }
    public override loadJson(obj: MapWarStatisticsJson): this {
        this.setStatisticsForRuleArray(obj.statisticsForRuleArray?.map(v => $Message$CommonProto$Map$MapWarStatisticsForRule.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: MapWarStatisticsJson): MapWarStatisticsJson {
        obj ??= ({} as MapWarStatisticsJson);

        {
            obj.statisticsForRuleArray = this.getStatisticsForRuleArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getStatisticsForRuleArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MapWarStatistics {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MapWarStatistics();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._statisticsForRuleArray;
                        arr.push($Message$CommonProto$Map$MapWarStatisticsForRule.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MapWarStatistics {
        return MapWarStatistics.decode(this.encode());
    }

    public override getSchemaName(): "MapWarStatistics" {
        return "MapWarStatistics";
    }

    public getStatisticsForRuleArray(): $Message$CommonProto$Map$MapWarStatisticsForRule[] {
        return this._statisticsForRuleArray;
    }
    public setStatisticsForRuleArray(value: $Message$CommonProto$Map$MapWarStatisticsForRule[]): void {
        this._statisticsForRuleArray = value;
    }
}
