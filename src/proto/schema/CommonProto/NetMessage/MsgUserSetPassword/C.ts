import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    oldPassword?: string | null | undefined;
    newPassword?: string | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _oldPassword?: string | null | undefined;
    private _newPassword?: string | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setOldPassword(obj.oldPassword);
        this.setNewPassword(obj.newPassword);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getOldPassword();
            (value != null) && (obj.oldPassword = value);
        }

        {
            const value = this.getNewPassword();
            (value != null) && (obj.newPassword = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getOldPassword();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getNewPassword();
            if (value != null) {
                writer.uint32(18).string(value);
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
                    msg.setOldPassword(reader.string());
                    break;

                case 2:
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

    public checkHasOldPassword(): boolean {
        return this._oldPassword != null;
    }
    public getOldPassword(): string | null | undefined {
        return this._oldPassword;
    }
    public setOldPassword(value: string | null | undefined): void {
        this._oldPassword = value;
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
