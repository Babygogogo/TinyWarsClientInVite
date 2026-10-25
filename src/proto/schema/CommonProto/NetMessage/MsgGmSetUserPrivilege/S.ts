import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { UserPrivilege as $Message$CommonProto$User$UserPrivilege, type UserPrivilegeJson as $Json$CommonProto$User$UserPrivilege } from "../../User/UserPrivilege.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    userId?: number | null | undefined;
    userPrivilege?: $Json$CommonProto$User$UserPrivilege | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _userId?: number | null | undefined;
    private _userPrivilege?: $Message$CommonProto$User$UserPrivilege | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setUserId(obj.userId);
        this.setUserPrivilege(obj.userPrivilege != null ? $Message$CommonProto$User$UserPrivilege.fromJson(obj.userPrivilege) : null);
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
            const value = this.getUserPrivilege();
            (value != null) && (obj.userPrivilege = value.toJson());
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
            const value = this.getUserPrivilege();
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
                    msg.setUserPrivilege($Message$CommonProto$User$UserPrivilege.decode(reader, reader.uint32()));
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

    public checkHasUserPrivilege(): boolean {
        return this._userPrivilege != null;
    }
    public getUserPrivilege(): $Message$CommonProto$User$UserPrivilege | null | undefined {
        return this._userPrivilege;
    }
    public setUserPrivilege(value: $Message$CommonProto$User$UserPrivilege | null | undefined): void {
        this._userPrivilege = value;
    }
    public createIfNotExistsUserPrivilege(): $Message$CommonProto$User$UserPrivilege {
        return this._userPrivilege ??= new $Message$CommonProto$User$UserPrivilege();
    }
}
