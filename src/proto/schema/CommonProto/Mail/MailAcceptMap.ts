import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface MailAcceptMapJson extends $ProtoSchemaJsonBase {
    normalMapId?: number | null | undefined;
    reviewerUserId?: number | null | undefined;
}

export class MailAcceptMap extends $ProtoSchemaBase {
    private _normalMapId?: number | null | undefined;
    private _reviewerUserId?: number | null | undefined;

    public static fromJson(obj: MailAcceptMapJson): MailAcceptMap {
        return new MailAcceptMap().loadJson(obj);
    }
    public override loadJson(obj: MailAcceptMapJson): this {
        this.setNormalMapId(obj.normalMapId);
        this.setReviewerUserId(obj.reviewerUserId);
        return this;
    }
    public override toJson(obj?: MailAcceptMapJson): MailAcceptMapJson {
        obj ??= ({} as MailAcceptMapJson);

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getReviewerUserId();
            (value != null) && (obj.reviewerUserId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNormalMapId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getReviewerUserId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MailAcceptMap {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MailAcceptMap();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 2:
                    msg.setReviewerUserId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MailAcceptMap {
        return MailAcceptMap.decode(this.encode());
    }

    public override getSchemaName(): "MailAcceptMap" {
        return "MailAcceptMap";
    }

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number | null | undefined {
        return this._normalMapId;
    }
    public setNormalMapId(value: number | null | undefined): void {
        this._normalMapId = value;
    }

    public checkHasReviewerUserId(): boolean {
        return this._reviewerUserId != null;
    }
    public getReviewerUserId(): number | null | undefined {
        return this._reviewerUserId;
    }
    public setReviewerUserId(value: number | null | undefined): void {
        this._reviewerUserId = value;
    }
}
