import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { UserBriefInfo as $Message$CommonProto$User$UserBriefInfo, type UserBriefInfoJson as $Json$CommonProto$User$UserBriefInfo } from "../../User/UserBriefInfo.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    userId?: number | null | undefined;
    userBriefInfo?: $Json$CommonProto$User$UserBriefInfo | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _userId?: number | null | undefined;
    private _userBriefInfo?: $Message$CommonProto$User$UserBriefInfo | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setUserId(obj.userId);
        this.setUserBriefInfo(obj.userBriefInfo != null ? $Message$CommonProto$User$UserBriefInfo.fromJson(obj.userBriefInfo) : null);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getUserBriefInfo();
            (value != null) && (obj.userBriefInfo = value.toJson());
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
            const value = this.getUserId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getUserBriefInfo();
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
                    msg.setUserId(reader.int32());
                    break;

                case 3:
                    msg.setUserBriefInfo($Message$CommonProto$User$UserBriefInfo.decode(reader, reader.uint32()));
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

    public checkHasUserId(): boolean {
        return this._userId != null;
    }
    public getUserId(): number | null | undefined {
        return this._userId;
    }
    public setUserId(value: number | null | undefined): void {
        this._userId = value;
    }

    public checkHasUserBriefInfo(): boolean {
        return this._userBriefInfo != null;
    }
    public getUserBriefInfo(): $Message$CommonProto$User$UserBriefInfo | null | undefined {
        return this._userBriefInfo;
    }
    public setUserBriefInfo(value: $Message$CommonProto$User$UserBriefInfo | null | undefined): void {
        this._userBriefInfo = value;
    }
    public createIfNotExistsUserBriefInfo(): $Message$CommonProto$User$UserBriefInfo {
        return this._userBriefInfo ??= new $Message$CommonProto$User$UserBriefInfo();
    }
}
