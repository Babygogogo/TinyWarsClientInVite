import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface MailAcceptSpectateJson extends $ProtoSchemaJsonBase {
    warId?: number | null | undefined;
    spectateTargetUserId?: number | null | undefined;
}

export class MailAcceptSpectate extends $ProtoSchemaBase {
    private _warId?: number | null | undefined;
    private _spectateTargetUserId?: number | null | undefined;

    public static fromJson(obj: MailAcceptSpectateJson): MailAcceptSpectate {
        return new MailAcceptSpectate().loadJson(obj);
    }
    public override loadJson(obj: MailAcceptSpectateJson): this {
        this.setWarId(obj.warId);
        this.setSpectateTargetUserId(obj.spectateTargetUserId);
        return this;
    }
    public override toJson(obj?: MailAcceptSpectateJson): MailAcceptSpectateJson {
        obj ??= ({} as MailAcceptSpectateJson);

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            const value = this.getSpectateTargetUserId();
            (value != null) && (obj.spectateTargetUserId = value);
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

        {
            const value = this.getSpectateTargetUserId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MailAcceptSpectate {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MailAcceptSpectate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWarId(reader.int32());
                    break;

                case 2:
                    msg.setSpectateTargetUserId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MailAcceptSpectate {
        return MailAcceptSpectate.decode(this.encode());
    }

    public override getSchemaName(): "MailAcceptSpectate" {
        return "MailAcceptSpectate";
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

    public checkHasSpectateTargetUserId(): boolean {
        return this._spectateTargetUserId != null;
    }
    public getSpectateTargetUserId(): number | null | undefined {
        return this._spectateTargetUserId;
    }
    public setSpectateTargetUserId(value: number | null | undefined): void {
        this._spectateTargetUserId = value;
    }
}
