import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    designerUserId?: number | null | undefined;
    slotIndex?: number | null | undefined;
    modifiedTime?: number | null | undefined;
    isAccept?: boolean | null | undefined;
    reviewComment?: string | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _designerUserId?: number | null | undefined;
    private _slotIndex?: number | null | undefined;
    private _modifiedTime?: number | null | undefined;
    private _isAccept?: boolean | null | undefined;
    private _reviewComment?: string | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setDesignerUserId(obj.designerUserId);
        this.setSlotIndex(obj.slotIndex);
        this.setModifiedTime(obj.modifiedTime);
        this.setIsAccept(obj.isAccept);
        this.setReviewComment(obj.reviewComment);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getDesignerUserId();
            (value != null) && (obj.designerUserId = value);
        }

        {
            const value = this.getSlotIndex();
            (value != null) && (obj.slotIndex = value);
        }

        {
            const value = this.getModifiedTime();
            (value != null) && (obj.modifiedTime = value);
        }

        {
            const value = this.getIsAccept();
            (value != null) && (obj.isAccept = value);
        }

        {
            const value = this.getReviewComment();
            (value != null) && (obj.reviewComment = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getDesignerUserId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getSlotIndex();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getModifiedTime();
            if (value != null) {
                writer.uint32(24).uint32(value);
            }
        }

        {
            const value = this.getIsAccept();
            if (value != null) {
                writer.uint32(32).bool(value);
            }
        }

        {
            const value = this.getReviewComment();
            if (value != null) {
                writer.uint32(42).string(value);
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
                    msg.setDesignerUserId(reader.int32());
                    break;

                case 2:
                    msg.setSlotIndex(reader.int32());
                    break;

                case 3:
                    msg.setModifiedTime(reader.uint32());
                    break;

                case 4:
                    msg.setIsAccept(reader.bool());
                    break;

                case 5:
                    msg.setReviewComment(reader.string());
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

    public checkHasDesignerUserId(): boolean {
        return this._designerUserId != null;
    }
    public getDesignerUserId(): number | null | undefined {
        return this._designerUserId;
    }
    public setDesignerUserId(value: number | null | undefined): void {
        this._designerUserId = value;
    }

    public checkHasSlotIndex(): boolean {
        return this._slotIndex != null;
    }
    public getSlotIndex(): number | null | undefined {
        return this._slotIndex;
    }
    public setSlotIndex(value: number | null | undefined): void {
        this._slotIndex = value;
    }

    public checkHasModifiedTime(): boolean {
        return this._modifiedTime != null;
    }
    public getModifiedTime(): number | null | undefined {
        return this._modifiedTime;
    }
    public setModifiedTime(value: number | null | undefined): void {
        this._modifiedTime = value;
    }

    public checkHasIsAccept(): boolean {
        return this._isAccept != null;
    }
    public getIsAccept(): boolean | null | undefined {
        return this._isAccept;
    }
    public setIsAccept(value: boolean | null | undefined): void {
        this._isAccept = value;
    }

    public checkHasReviewComment(): boolean {
        return this._reviewComment != null;
    }
    public getReviewComment(): string | null | undefined {
        return this._reviewComment;
    }
    public setReviewComment(value: string | null | undefined): void {
        this._reviewComment = value;
    }
}
