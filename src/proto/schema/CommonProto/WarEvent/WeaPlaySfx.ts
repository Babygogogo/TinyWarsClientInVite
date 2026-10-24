import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaPlaySfxJson extends $ProtoSchemaJsonBase {
    sfxCode?: number | null | undefined;
}

export class WeaPlaySfx extends $ProtoSchemaBase {
    private _sfxCode?: number | null | undefined;

    public static fromJson(obj: WeaPlaySfxJson): WeaPlaySfx {
        return new WeaPlaySfx().loadJson(obj);
    }
    public override loadJson(obj: WeaPlaySfxJson): this {
        this.setSfxCode(obj.sfxCode);
        return this;
    }
    public override toJson(obj?: WeaPlaySfxJson): WeaPlaySfxJson {
        obj ??= ({} as WeaPlaySfxJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaPlaySfx {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaPlaySfx();
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

    public override clone(): WeaPlaySfx {
        return WeaPlaySfx.decode(this.encode());
    }

    public override getSchemaName(): "WeaPlaySfx" {
        return "WeaPlaySfx";
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
