import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { UserDiscordInfo as $Message$CommonProto$User$UserDiscordInfo, type UserDiscordInfoJson as $Json$CommonProto$User$UserDiscordInfo } from "../../User/UserDiscordInfo.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    discordInfo?: $Json$CommonProto$User$UserDiscordInfo | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _discordInfo?: $Message$CommonProto$User$UserDiscordInfo | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setDiscordInfo(obj.discordInfo != null ? $Message$CommonProto$User$UserDiscordInfo.fromJson(obj.discordInfo) : null);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getDiscordInfo();
            (value != null) && (obj.discordInfo = value.toJson());
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
            const value = this.getDiscordInfo();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
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
                    msg.setDiscordInfo($Message$CommonProto$User$UserDiscordInfo.decode(reader, reader.uint32()));
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

    public checkHasDiscordInfo(): boolean {
        return this._discordInfo != null;
    }
    public getDiscordInfo(): $Message$CommonProto$User$UserDiscordInfo | null | undefined {
        return this._discordInfo;
    }
    public setDiscordInfo(value: $Message$CommonProto$User$UserDiscordInfo | null | undefined): void {
        this._discordInfo = value;
    }
    public createIfNotExistsDiscordInfo(): $Message$CommonProto$User$UserDiscordInfo {
        return this._discordInfo ??= new $Message$CommonProto$User$UserDiscordInfo();
    }
}
