import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    verificationCode?: string | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _verificationCode?: string | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setVerificationCode(obj.verificationCode);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getVerificationCode();
            (value != null) && (obj.verificationCode = value);
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
}
