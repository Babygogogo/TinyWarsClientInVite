import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface ChatReadProgressJson extends $ProtoSchemaJsonBase {
    toCategory?: number | null | undefined;
    toTarget?: number | null | undefined;
    timestamp?: number | null | undefined;
}

export class ChatReadProgress extends $ProtoSchemaBase {
    private _toCategory?: number | null | undefined;
    private _toTarget?: number | null | undefined;
    private _timestamp?: number | null | undefined;

    public static fromJson(obj: ChatReadProgressJson): ChatReadProgress {
        return new ChatReadProgress().loadJson(obj);
    }
    public override loadJson(obj: ChatReadProgressJson): this {
        this.setToCategory(obj.toCategory);
        this.setToTarget(obj.toTarget);
        this.setTimestamp(obj.timestamp);
        return this;
    }
    public override toJson(obj?: ChatReadProgressJson): ChatReadProgressJson {
        obj ??= ({} as ChatReadProgressJson);

        {
            const value = this.getToCategory();
            (value != null) && (obj.toCategory = value);
        }

        {
            const value = this.getToTarget();
            (value != null) && (obj.toTarget = value);
        }

        {
            const value = this.getTimestamp();
            (value != null) && (obj.timestamp = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getToCategory();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getToTarget();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getTimestamp();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).uint32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ChatReadProgress {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ChatReadProgress();
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
                    msg.setTimestamp(reader.uint32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ChatReadProgress {
        return ChatReadProgress.decode(this.encode());
    }

    public override getSchemaName(): "ChatReadProgress" {
        return "ChatReadProgress";
    }

    public checkHasToCategory(): boolean {
        return this._toCategory != null;
    }
    public getToCategory(): number {
        return this._toCategory ?? 0;
    }
    public setToCategory(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._toCategory = null;
        } else {
            this._toCategory = value;
        }
    }

    public checkHasToTarget(): boolean {
        return this._toTarget != null;
    }
    public getToTarget(): number {
        return this._toTarget ?? 0;
    }
    public setToTarget(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._toTarget = null;
        } else {
            this._toTarget = value;
        }
    }

    public checkHasTimestamp(): boolean {
        return this._timestamp != null;
    }
    public getTimestamp(): number {
        return this._timestamp ?? 0;
    }
    public setTimestamp(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._timestamp = null;
        } else {
            this._timestamp = value;
        }
    }
}
