import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface SingleDataJson extends $ProtoSchemaJsonBase {
    userId?: number | null | undefined;
    score?: number | null | undefined;
}

export class SingleData extends $ProtoSchemaBase {
    private _userId?: number | null | undefined;
    private _score?: number | null | undefined;

    public static fromJson(obj: SingleDataJson): SingleData {
        return new SingleData().loadJson(obj);
    }
    public override loadJson(obj: SingleDataJson): this {
        this.setUserId(obj.userId);
        this.setScore(obj.score);
        return this;
    }
    public override toJson(obj?: SingleDataJson): SingleDataJson {
        obj ??= ({} as SingleDataJson);

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getScore();
            (value != null) && (obj.score = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUserId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getScore();
            if (value != null) {
                writer.uint32(17).double(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SingleData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SingleData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUserId(reader.int32());
                    break;

                case 2:
                    msg.setScore(reader.double());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SingleData {
        return SingleData.decode(this.encode());
    }

    public override getSchemaName(): "SingleData" {
        return "SingleData";
    }

    public checkHasUserId(): boolean {
        return this._userId != null;
    }
    public getUserId(): number | null | undefined {
        return this._userId;
    }
    public setUserId(value: number | null | undefined): void {
        this._userId = value;
    }

    public checkHasScore(): boolean {
        return this._score != null;
    }
    public getScore(): number | null | undefined {
        return this._score;
    }
    public setScore(value: number | null | undefined): void {
        this._score = value;
    }
}
