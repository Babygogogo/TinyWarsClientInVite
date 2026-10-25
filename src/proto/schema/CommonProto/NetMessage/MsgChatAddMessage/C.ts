import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    toCategory?: number | null | undefined;
    toTarget?: number | null | undefined;
    content?: string | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _toCategory?: number | null | undefined;
    private _toTarget?: number | null | undefined;
    private _content?: string | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setToCategory(obj.toCategory);
        this.setToTarget(obj.toTarget);
        this.setContent(obj.content);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getToCategory();
            (value != null) && (obj.toCategory = value);
        }

        {
            const value = this.getToTarget();
            (value != null) && (obj.toTarget = value);
        }

        {
            const value = this.getContent();
            (value != null) && (obj.content = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getToCategory();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getToTarget();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getContent();
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
                    msg.setToCategory(reader.int32());
                    break;

                case 2:
                    msg.setToTarget(reader.int32());
                    break;

                case 3:
                    msg.setContent(reader.string());
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

    public checkHasToCategory(): boolean {
        return this._toCategory != null;
    }
    public getToCategory(): number | null | undefined {
        return this._toCategory;
    }
    public setToCategory(value: number | null | undefined): void {
        this._toCategory = value;
    }

    public checkHasToTarget(): boolean {
        return this._toTarget != null;
    }
    public getToTarget(): number | null | undefined {
        return this._toTarget;
    }
    public setToTarget(value: number | null | undefined): void {
        this._toTarget = value;
    }

    public checkHasContent(): boolean {
        return this._content != null;
    }
    public getContent(): string | null | undefined {
        return this._content;
    }
    public setContent(value: string | null | undefined): void {
        this._content = value;
    }
}
