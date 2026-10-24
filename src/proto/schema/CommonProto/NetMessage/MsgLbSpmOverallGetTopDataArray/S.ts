import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { LbSpmOverall as $Message$CommonProto$Leaderboard$LbSpmOverall, type LbSpmOverallJson as $Json$CommonProto$Leaderboard$LbSpmOverall } from "../../Leaderboard/LbSpmOverall.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    configVersion?: string | null | undefined;
    leaderboard?: $Json$CommonProto$Leaderboard$LbSpmOverall | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _configVersion?: string | null | undefined;
    private _leaderboard?: $Message$CommonProto$Leaderboard$LbSpmOverall | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setConfigVersion(obj.configVersion);
        this.setLeaderboard(obj.leaderboard != null ? $Message$CommonProto$Leaderboard$LbSpmOverall.fromJson(obj.leaderboard) : null);
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
            const value = this.getLeaderboard();
            (value != null) && (obj.leaderboard = value.toJson());
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
            const value = this.getLeaderboard();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
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

                case 3:
                    msg.setLeaderboard($Message$CommonProto$Leaderboard$LbSpmOverall.decode(reader, reader.uint32()));
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

    public checkHasLeaderboard(): boolean {
        return this._leaderboard != null;
    }
    public getLeaderboard(): $Message$CommonProto$Leaderboard$LbSpmOverall | null | undefined {
        return this._leaderboard;
    }
    public setLeaderboard(value: $Message$CommonProto$Leaderboard$LbSpmOverall | null | undefined): void {
        this._leaderboard = value;
    }
    public createIfNotExistsLeaderboard(): $Message$CommonProto$Leaderboard$LbSpmOverall {
        return this._leaderboard ??= new $Message$CommonProto$Leaderboard$LbSpmOverall();
    }
}
