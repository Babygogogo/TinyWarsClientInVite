import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { SingleData as $Message$CommonProto$Leaderboard$LbSpmOverall$SingleData, type SingleDataJson as $Json$CommonProto$Leaderboard$LbSpmOverall$SingleData } from "./LbSpmOverall/SingleData.js";

export interface LbSpmOverallJson extends $ProtoSchemaJsonBase {
    configVersion?: string | null | undefined;
    dataArray: $Json$CommonProto$Leaderboard$LbSpmOverall$SingleData[];
}

export class LbSpmOverall extends $ProtoSchemaBase {
    private _configVersion?: string | null | undefined;
    private _dataArray: $Message$CommonProto$Leaderboard$LbSpmOverall$SingleData[] = [];

    public static fromJson(obj: LbSpmOverallJson): LbSpmOverall {
        return new LbSpmOverall().loadJson(obj);
    }
    public override loadJson(obj: LbSpmOverallJson): this {
        this.setConfigVersion(obj.configVersion);
        this.setDataArray(obj.dataArray?.map(v => $Message$CommonProto$Leaderboard$LbSpmOverall$SingleData.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: LbSpmOverallJson): LbSpmOverallJson {
        obj ??= ({} as LbSpmOverallJson);

        {
            const value = this.getConfigVersion();
            (value != null) && (obj.configVersion = value);
        }

        {
            obj.dataArray = this.getDataArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConfigVersion();
            if (value != null) {
                writer.uint32(10).string(value);
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): LbSpmOverall {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new LbSpmOverall();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConfigVersion(reader.string());
                    break;

                case 2:
                    {
                        const arr = msg._dataArray;
                        arr.push($Message$CommonProto$Leaderboard$LbSpmOverall$SingleData.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): LbSpmOverall {
        return LbSpmOverall.decode(this.encode());
    }

    public override getSchemaName(): "LbSpmOverall" {
        return "LbSpmOverall";
    }

    public checkHasConfigVersion(): boolean {
        return this._configVersion != null;
    }
    public getConfigVersion(): string | null | undefined {
        return this._configVersion;
    }
    public setConfigVersion(value: string | null | undefined): void {
        this._configVersion = value;
    }

    public getDataArray(): $Message$CommonProto$Leaderboard$LbSpmOverall$SingleData[] {
        return this._dataArray;
    }
    public setDataArray(value: $Message$CommonProto$Leaderboard$LbSpmOverall$SingleData[]): void {
        this._dataArray = value;
    }
}
