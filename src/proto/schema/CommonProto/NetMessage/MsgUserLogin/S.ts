import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { UserSelfInfo as $Message$CommonProto$User$UserSelfInfo, type UserSelfInfoJson as $Json$CommonProto$User$UserSelfInfo } from "../../User/UserSelfInfo.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    userSelfInfo?: $Json$CommonProto$User$UserSelfInfo | null | undefined;
    isAutoRelogin?: boolean | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _userSelfInfo?: $Message$CommonProto$User$UserSelfInfo | null | undefined;
    private _isAutoRelogin?: boolean | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setUserSelfInfo(obj.userSelfInfo != null ? $Message$CommonProto$User$UserSelfInfo.fromJson(obj.userSelfInfo) : null);
        this.setIsAutoRelogin(obj.isAutoRelogin);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getUserSelfInfo();
            (value != null) && (obj.userSelfInfo = value.toJson());
        }

        {
            const value = this.getIsAutoRelogin();
            (value != null) && (obj.isAutoRelogin = value);
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
            const value = this.getUserSelfInfo();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getIsAutoRelogin();
            if (value != null) {
                writer.uint32(24).bool(value);
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
                    msg.setUserSelfInfo($Message$CommonProto$User$UserSelfInfo.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setIsAutoRelogin(reader.bool());
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

    public checkHasUserSelfInfo(): boolean {
        return this._userSelfInfo != null;
    }
    public getUserSelfInfo(): $Message$CommonProto$User$UserSelfInfo | null | undefined {
        return this._userSelfInfo;
    }
    public setUserSelfInfo(value: $Message$CommonProto$User$UserSelfInfo | null | undefined): void {
        this._userSelfInfo = value;
    }
    public createIfNotExistsUserSelfInfo(): $Message$CommonProto$User$UserSelfInfo {
        return this._userSelfInfo ??= new $Message$CommonProto$User$UserSelfInfo();
    }

    public checkHasIsAutoRelogin(): boolean {
        return this._isAutoRelogin != null;
    }
    public getIsAutoRelogin(): boolean | null | undefined {
        return this._isAutoRelogin;
    }
    public setIsAutoRelogin(value: boolean | null | undefined): void {
        this._isAutoRelogin = value;
    }
}
