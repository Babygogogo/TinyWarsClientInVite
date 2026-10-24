import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { LbMrwDataForUnneutralPlayersCount as $Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwDataForUnneutralPlayersCount, type LbMrwDataForUnneutralPlayersCountJson as $Json$CommonProto$Leaderboard$LbMrwFullData$LbMrwDataForUnneutralPlayersCount } from "./LbMrwDataForUnneutralPlayersCount.js";

export interface LbMrwDataForWarTypeJson extends $ProtoSchemaJsonBase {
    warType?: number | null | undefined;
    dataArray: $Json$CommonProto$Leaderboard$LbMrwFullData$LbMrwDataForUnneutralPlayersCount[];
}

export class LbMrwDataForWarType extends $ProtoSchemaBase {
    private _warType?: number | null | undefined;
    private _dataArray: $Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwDataForUnneutralPlayersCount[] = [];

    public static fromJson(obj: LbMrwDataForWarTypeJson): LbMrwDataForWarType {
        return new LbMrwDataForWarType().loadJson(obj);
    }
    public override loadJson(obj: LbMrwDataForWarTypeJson): this {
        this.setWarType(obj.warType);
        this.setDataArray(obj.dataArray?.map(v => $Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwDataForUnneutralPlayersCount.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: LbMrwDataForWarTypeJson): LbMrwDataForWarTypeJson {
        obj ??= ({} as LbMrwDataForWarTypeJson);

        {
            const value = this.getWarType();
            (value != null) && (obj.warType = value);
        }

        {
            obj.dataArray = this.getDataArray().map(v => v.toJson());
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
            const value = this.getDataArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): LbMrwDataForWarType {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new LbMrwDataForWarType();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWarType(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._dataArray;
                        arr.push($Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwDataForUnneutralPlayersCount.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): LbMrwDataForWarType {
        return LbMrwDataForWarType.decode(this.encode());
    }

    public override getSchemaName(): "LbMrwDataForWarType" {
        return "LbMrwDataForWarType";
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

    public getDataArray(): $Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwDataForUnneutralPlayersCount[] {
        return this._dataArray;
    }
    public setDataArray(value: $Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwDataForUnneutralPlayersCount[]): void {
        this._dataArray = value;
    }
}
