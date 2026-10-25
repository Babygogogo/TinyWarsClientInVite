import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    verificationCode?: string | null | undefined;
    account?: string | null | undefined;
    newPassword?: string | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _verificationCode?: string | null | undefined;
    private _account?: string | null | undefined;
    private _newPassword?: string | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setVerificationCode(obj.verificationCode);
        this.setAccount(obj.account);
        this.setNewPassword(obj.newPassword);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getVerificationCode();
            (value != null) && (obj.verificationCode = value);
        }

        {
            const value = this.getAccount();
            (value != null) && (obj.account = value);
        }

        {
            const value = this.getNewPassword();
            (value != null) && (obj.newPassword = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getVerificationCode();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getAccount();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getNewPassword();
            if (value != null) {
                writer.uint32(26).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): C {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new C();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setVerificationCode(reader.string());
                    break;

                case 2:
                    msg.setAccount(reader.string());
                    break;

                case 3:
                    msg.setNewPassword(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): C {
        return C.decode(this.encode());
    }

    public override getSchemaName(): "C" {
        return "C";
    }

    public checkHasVerificationCode(): boolean {
        return this._verificationCode != null;
    }
    public getVerificationCode(): string | null | undefined {
        return this._verificationCode;
    }
    public setVerificationCode(value: string | null | undefined): void {
        this._verificationCode = value;
    }

    public checkHasAccount(): boolean {
        return this._account != null;
    }
    public getAccount(): string | null | undefined {
        return this._account;
    }
    public setAccount(value: string | null | undefined): void {
        this._account = value;
    }

    public checkHasNewPassword(): boolean {
        return this._newPassword != null;
    }
    public getNewPassword(): string | null | undefined {
        return this._newPassword;
    }
    public setNewPassword(value: string | null | undefined): void {
        this._newPassword = value;
    }
}
