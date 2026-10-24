import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface DataForPlaySfxJson extends $ProtoSchemaJsonBase {
    sfxCode?: number | null | undefined;
}

export class DataForPlaySfx extends $ProtoSchemaBase {
    private _sfxCode?: number | null | undefined;

    public static fromJson(obj: DataForPlaySfxJson): DataForPlaySfx {
        return new DataForPlaySfx().loadJson(obj);
    }
    public override loadJson(obj: DataForPlaySfxJson): this {
        this.setSfxCode(obj.sfxCode);
        return this;
    }
    public override toJson(obj?: DataForPlaySfxJson): DataForPlaySfxJson {
        obj ??= ({} as DataForPlaySfxJson);

        {
            const value = this.getSfxCode();
            (value != null) && (obj.sfxCode = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSfxCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): DataForPlaySfx {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new DataForPlaySfx();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSfxCode(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): DataForPlaySfx {
        return DataForPlaySfx.decode(this.encode());
    }

    public override getSchemaName(): "DataForPlaySfx" {
        return "DataForPlaySfx";
    }

    public checkHasSfxCode(): boolean {
        return this._sfxCode != null;
    }
    public getSfxCode(): number | null | undefined {
        return this._sfxCode;
    }
    public setSfxCode(value: number | null | undefined): void {
        this._sfxCode = value;
    }
}
