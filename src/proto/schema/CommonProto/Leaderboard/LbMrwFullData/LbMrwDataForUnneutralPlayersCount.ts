import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { LbMrwUserInfo as $Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwUserInfo, type LbMrwUserInfoJson as $Json$CommonProto$Leaderboard$LbMrwFullData$LbMrwUserInfo } from "./LbMrwUserInfo.js";

export interface LbMrwDataForUnneutralPlayersCountJson extends $ProtoSchemaJsonBase {
    playersCountUnneutral?: number | null | undefined;
    sortedUserInfoArray: $Json$CommonProto$Leaderboard$LbMrwFullData$LbMrwUserInfo[];
}

export class LbMrwDataForUnneutralPlayersCount extends $ProtoSchemaBase {
    private _playersCountUnneutral?: number | null | undefined;
    private _sortedUserInfoArray: $Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwUserInfo[] = [];

    public static fromJson(obj: LbMrwDataForUnneutralPlayersCountJson): LbMrwDataForUnneutralPlayersCount {
        return new LbMrwDataForUnneutralPlayersCount().loadJson(obj);
    }
    public override loadJson(obj: LbMrwDataForUnneutralPlayersCountJson): this {
        this.setPlayersCountUnneutral(obj.playersCountUnneutral);
        this.setSortedUserInfoArray(obj.sortedUserInfoArray?.map(v => $Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwUserInfo.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: LbMrwDataForUnneutralPlayersCountJson): LbMrwDataForUnneutralPlayersCountJson {
        obj ??= ({} as LbMrwDataForUnneutralPlayersCountJson);

        {
            const value = this.getPlayersCountUnneutral();
            (value != null) && (obj.playersCountUnneutral = value);
        }

        {
            obj.sortedUserInfoArray = this.getSortedUserInfoArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getPlayersCountUnneutral();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getSortedUserInfoArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): LbMrwDataForUnneutralPlayersCount {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new LbMrwDataForUnneutralPlayersCount();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setPlayersCountUnneutral(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._sortedUserInfoArray;
                        arr.push($Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwUserInfo.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): LbMrwDataForUnneutralPlayersCount {
        return LbMrwDataForUnneutralPlayersCount.decode(this.encode());
    }

    public override getSchemaName(): "LbMrwDataForUnneutralPlayersCount" {
        return "LbMrwDataForUnneutralPlayersCount";
    }

    public checkHasPlayersCountUnneutral(): boolean {
        return this._playersCountUnneutral != null;
    }
    public getPlayersCountUnneutral(): number | null | undefined {
        return this._playersCountUnneutral;
    }
    public setPlayersCountUnneutral(value: number | null | undefined): void {
        this._playersCountUnneutral = value;
    }

    public getSortedUserInfoArray(): $Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwUserInfo[] {
        return this._sortedUserInfoArray;
    }
    public setSortedUserInfoArray(value: $Message$CommonProto$Leaderboard$LbMrwFullData$LbMrwUserInfo[]): void {
        this._sortedUserInfoArray = value;
    }
}
