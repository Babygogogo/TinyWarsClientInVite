import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { GameData as $Message$CommonProto$NetMessage$MsgCommonGetCoStatistics$GameData, type GameDataJson as $Json$CommonProto$NetMessage$MsgCommonGetCoStatistics$GameData } from "./GameData.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    configVersion?: string | null | undefined;
    gameDataArray: $Json$CommonProto$NetMessage$MsgCommonGetCoStatistics$GameData[];
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _configVersion?: string | null | undefined;
    private _gameDataArray: $Message$CommonProto$NetMessage$MsgCommonGetCoStatistics$GameData[] = [];

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setConfigVersion(obj.configVersion);
        this.setGameDataArray(obj.gameDataArray?.map(v => $Message$CommonProto$NetMessage$MsgCommonGetCoStatistics$GameData.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getConfigVersion();
            (value != null) && (obj.configVersion = value);
        }

        {
            obj.gameDataArray = this.getGameDataArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getErrorCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getConfigVersion();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getGameDataArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(50).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): S {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new S();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setErrorCode(reader.int32());
                    break;

                case 2:
                    msg.setConfigVersion(reader.string());
                    break;

                case 6:
                    {
                        const arr = msg._gameDataArray;
                        arr.push($Message$CommonProto$NetMessage$MsgCommonGetCoStatistics$GameData.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): S {
        return S.decode(this.encode());
    }

    public override getSchemaName(): "S" {
        return "S";
    }

    public checkHasErrorCode(): boolean {
        return this._errorCode != null;
    }
    public getErrorCode(): number | null | undefined {
        return this._errorCode;
    }
    public setErrorCode(value: number | null | undefined): void {
        this._errorCode = value;
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

    public getGameDataArray(): $Message$CommonProto$NetMessage$MsgCommonGetCoStatistics$GameData[] {
        return this._gameDataArray;
    }
    public setGameDataArray(value: $Message$CommonProto$NetMessage$MsgCommonGetCoStatistics$GameData[]): void {
        this._gameDataArray = value;
    }
}
