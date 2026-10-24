import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { LbMrwDataForWarType as $Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwDataForWarType, type LbMrwDataForWarTypeJson as $Json$CommonProto$Leaderboard$LbMrwFullData$LbMrwDataForWarType } from "./LbMrwFullData/LbMrwDataForWarType.js";

export interface LbMrwFullDataJson extends $ProtoSchemaJsonBase {
    dataArray: $Json$CommonProto$Leaderboard$LbMrwFullData$LbMrwDataForWarType[];
}

export class LbMrwFullData extends $ProtoSchemaBase {
    private _dataArray: $Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwDataForWarType[] = [];

    public static fromJson(obj: LbMrwFullDataJson): LbMrwFullData {
        return new LbMrwFullData().loadJson(obj);
    }
    public override loadJson(obj: LbMrwFullDataJson): this {
        this.setDataArray(obj.dataArray?.map(v => $Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwDataForWarType.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: LbMrwFullDataJson): LbMrwFullDataJson {
        obj ??= ({} as LbMrwFullDataJson);

        {
            obj.dataArray = this.getDataArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getDataArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): LbMrwFullData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new LbMrwFullData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._dataArray;
                        arr.push($Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwDataForWarType.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): LbMrwFullData {
        return LbMrwFullData.decode(this.encode());
    }

    public override getSchemaName(): "LbMrwFullData" {
        return "LbMrwFullData";
    }

    public getDataArray(): $Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwDataForWarType[] {
        return this._dataArray;
    }
    public setDataArray(value: $Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwDataForWarType[]): void {
        this._dataArray = value;
    }
}
