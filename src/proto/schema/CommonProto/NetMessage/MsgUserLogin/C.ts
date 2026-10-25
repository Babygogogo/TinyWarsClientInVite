import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    account?: string | null | undefined;
    password?: string | null | undefined;
    isAutoRelogin?: boolean | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _account?: string | null | undefined;
    private _password?: string | null | undefined;
    private _isAutoRelogin?: boolean | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setAccount(obj.account);
        this.setPassword(obj.password);
        this.setIsAutoRelogin(obj.isAutoRelogin);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getAccount();
            (value != null) && (obj.account = value);
        }

        {
            const value = this.getPassword();
            (value != null) && (obj.password = value);
        }

        {
            const value = this.getIsAutoRelogin();
            (value != null) && (obj.isAutoRelogin = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getAccount();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getPassword();
            if (value != null) {
                writer.uint32(18).string(value);
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
                    msg.setAccount(reader.string());
                    break;

                case 2:
                    msg.setPassword(reader.string());
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

    public override clone(): C {
        return C.decode(this.encode());
    }

    public override getSchemaName(): "C" {
        return "C";
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

    public checkHasPassword(): boolean {
        return this._password != null;
    }
    public getPassword(): string | null | undefined {
        return this._password;
    }
    public setPassword(value: string | null | undefined): void {
        this._password = value;
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
