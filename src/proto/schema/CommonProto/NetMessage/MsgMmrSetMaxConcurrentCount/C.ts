import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    maxCountForStd?: number | null | undefined;
    maxCountForFog?: number | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _maxCountForStd?: number | null | undefined;
    private _maxCountForFog?: number | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setMaxCountForStd(obj.maxCountForStd);
        this.setMaxCountForFog(obj.maxCountForFog);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getMaxCountForStd();
            (value != null) && (obj.maxCountForStd = value);
        }

        {
            const value = this.getMaxCountForFog();
            (value != null) && (obj.maxCountForFog = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMaxCountForStd();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getMaxCountForFog();
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
                    msg.setMaxCountForStd(reader.int32());
                    break;

                case 2:
                    msg.setMaxCountForFog(reader.int32());
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

    public checkHasMaxCountForStd(): boolean {
        return this._maxCountForStd != null;
    }
    public getMaxCountForStd(): number | null | undefined {
        return this._maxCountForStd;
    }
    public setMaxCountForStd(value: number | null | undefined): void {
        this._maxCountForStd = value;
    }

    public checkHasMaxCountForFog(): boolean {
        return this._maxCountForFog != null;
    }
    public getMaxCountForFog(): number | null | undefined {
        return this._maxCountForFog;
    }
    public setMaxCountForFog(value: number | null | undefined): void {
        this._maxCountForFog = value;
    }
}
