import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { UserMpwRankedHistory as $Message$CommonProto$User$UserWarHistory$UserMpwRankedHistory, type UserMpwRankedHistoryJson as $Json$CommonProto$User$UserWarHistory$UserMpwRankedHistory } from "./UserWarHistory/UserMpwRankedHistory.js";
import { UserMpwUnrankedHistory as $Message$CommonProto$User$UserWarHistory$UserMpwUnrankedHistory, type UserMpwUnrankedHistoryJson as $Json$CommonProto$User$UserWarHistory$UserMpwUnrankedHistory } from "./UserWarHistory/UserMpwUnrankedHistory.js";

export interface UserWarHistoryJson extends $ProtoSchemaJsonBase {
    mpwRankedStdHistoryArray: $Json$CommonProto$User$UserWarHistory$UserMpwRankedHistory[];
    mpwRankedFowHistoryArray: $Json$CommonProto$User$UserWarHistory$UserMpwRankedHistory[];
    mpwUnrankedHistoryArray: $Json$CommonProto$User$UserWarHistory$UserMpwUnrankedHistory[];
}

export class UserWarHistory extends $ProtoSchemaBase {
    private _mpwRankedStdHistoryArray: $Message$CommonProto$User$UserWarHistory$UserMpwRankedHistory[] = [];
    private _mpwRankedFowHistoryArray: $Message$CommonProto$User$UserWarHistory$UserMpwRankedHistory[] = [];
    private _mpwUnrankedHistoryArray: $Message$CommonProto$User$UserWarHistory$UserMpwUnrankedHistory[] = [];

    public static fromJson(obj: UserWarHistoryJson): UserWarHistory {
        return new UserWarHistory().loadJson(obj);
    }
    public override loadJson(obj: UserWarHistoryJson): this {
        this.setMpwRankedStdHistoryArray(obj.mpwRankedStdHistoryArray?.map(v => $Message$CommonProto$User$UserWarHistory$UserMpwRankedHistory.fromJson(v)) ?? []);
        this.setMpwRankedFowHistoryArray(obj.mpwRankedFowHistoryArray?.map(v => $Message$CommonProto$User$UserWarHistory$UserMpwRankedHistory.fromJson(v)) ?? []);
        this.setMpwUnrankedHistoryArray(obj.mpwUnrankedHistoryArray?.map(v => $Message$CommonProto$User$UserWarHistory$UserMpwUnrankedHistory.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: UserWarHistoryJson): UserWarHistoryJson {
        obj ??= ({} as UserWarHistoryJson);

        {
            obj.mpwRankedStdHistoryArray = this.getMpwRankedStdHistoryArray().map(v => v.toJson());
        }

        {
            obj.mpwRankedFowHistoryArray = this.getMpwRankedFowHistoryArray().map(v => v.toJson());
        }

        {
            obj.mpwUnrankedHistoryArray = this.getMpwUnrankedHistoryArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMpwRankedStdHistoryArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getMpwRankedFowHistoryArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getMpwUnrankedHistoryArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserWarHistory {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserWarHistory();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._mpwRankedStdHistoryArray;
                        arr.push($Message$CommonProto$User$UserWarHistory$UserMpwRankedHistory.decode(reader, reader.uint32()));
                    }
                    break;

                case 2:
                    {
                        const arr = msg._mpwRankedFowHistoryArray;
                        arr.push($Message$CommonProto$User$UserWarHistory$UserMpwRankedHistory.decode(reader, reader.uint32()));
                    }
                    break;

                case 3:
                    {
                        const arr = msg._mpwUnrankedHistoryArray;
                        arr.push($Message$CommonProto$User$UserWarHistory$UserMpwUnrankedHistory.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserWarHistory {
        return UserWarHistory.decode(this.encode());
    }

    public override getSchemaName(): "UserWarHistory" {
        return "UserWarHistory";
    }

    public getMpwRankedStdHistoryArray(): $Message$CommonProto$User$UserWarHistory$UserMpwRankedHistory[] {
        return this._mpwRankedStdHistoryArray;
    }
    public setMpwRankedStdHistoryArray(value: $Message$CommonProto$User$UserWarHistory$UserMpwRankedHistory[]): void {
        this._mpwRankedStdHistoryArray = value;
    }

    public getMpwRankedFowHistoryArray(): $Message$CommonProto$User$UserWarHistory$UserMpwRankedHistory[] {
        return this._mpwRankedFowHistoryArray;
    }
    public setMpwRankedFowHistoryArray(value: $Message$CommonProto$User$UserWarHistory$UserMpwRankedHistory[]): void {
        this._mpwRankedFowHistoryArray = value;
    }

    public getMpwUnrankedHistoryArray(): $Message$CommonProto$User$UserWarHistory$UserMpwUnrankedHistory[] {
        return this._mpwUnrankedHistoryArray;
    }
    public setMpwUnrankedHistoryArray(value: $Message$CommonProto$User$UserWarHistory$UserMpwUnrankedHistory[]): void {
        this._mpwUnrankedHistoryArray = value;
    }
}
