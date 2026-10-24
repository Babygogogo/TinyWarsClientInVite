import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    minReplayId?: number | null | undefined;
    maxReplayId?: number | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _minReplayId?: number | null | undefined;
    private _maxReplayId?: number | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setMinReplayId(obj.minReplayId);
        this.setMaxReplayId(obj.maxReplayId);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getMinReplayId();
            (value != null) && (obj.minReplayId = value);
        }

        {
            const value = this.getMaxReplayId();
            (value != null) && (obj.maxReplayId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMinReplayId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getMaxReplayId();
            if (value != null) {
                writer.uint32(16).int32(value);
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
                    msg.setMinReplayId(reader.int32());
                    break;

                case 2:
                    msg.setMaxReplayId(reader.int32());
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

    public checkHasMinReplayId(): boolean {
        return this._minReplayId != null;
    }
    public getMinReplayId(): number | null | undefined {
        return this._minReplayId;
    }
    public setMinReplayId(value: number | null | undefined): void {
        this._minReplayId = value;
    }

    public checkHasMaxReplayId(): boolean {
        return this._maxReplayId != null;
    }
    public getMaxReplayId(): number | null | undefined {
        return this._maxReplayId;
    }
    public setMaxReplayId(value: number | null | undefined): void {
        this._maxReplayId = value;
    }
}
