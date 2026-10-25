import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface MailMrwBootJson extends $ProtoSchemaJsonBase {
    warId?: number | null | undefined;
}

export class MailMrwBoot extends $ProtoSchemaBase {
    private _warId?: number | null | undefined;

    public static fromJson(obj: MailMrwBootJson): MailMrwBoot {
        return new MailMrwBoot().loadJson(obj);
    }
    public override loadJson(obj: MailMrwBootJson): this {
        this.setWarId(obj.warId);
        return this;
    }
    public override toJson(obj?: MailMrwBootJson): MailMrwBootJson {
        obj ??= ({} as MailMrwBootJson);

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWarId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MailMrwBoot {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MailMrwBoot();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWarId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MailMrwBoot {
        return MailMrwBoot.decode(this.encode());
    }

    public override getSchemaName(): "MailMrwBoot" {
        return "MailMrwBoot";
    }

    public checkHasWarId(): boolean {
        return this._warId != null;
    }
    public getWarId(): number | null | undefined {
        return this._warId;
    }
    public setWarId(value: number | null | undefined): void {
        this._warId = value;
    }
}
