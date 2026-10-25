import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaPersistentPlayBgmJson extends $ProtoSchemaJsonBase {
    bgmCode?: number | null | undefined;
}

export class WeaPersistentPlayBgm extends $ProtoSchemaBase {
    private _bgmCode?: number | null | undefined;

    public static fromJson(obj: WeaPersistentPlayBgmJson): WeaPersistentPlayBgm {
        return new WeaPersistentPlayBgm().loadJson(obj);
    }
    public override loadJson(obj: WeaPersistentPlayBgmJson): this {
        this.setBgmCode(obj.bgmCode);
        return this;
    }
    public override toJson(obj?: WeaPersistentPlayBgmJson): WeaPersistentPlayBgmJson {
        obj ??= ({} as WeaPersistentPlayBgmJson);

        {
            const value = this.getBgmCode();
            (value != null) && (obj.bgmCode = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getBgmCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaPersistentPlayBgm {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaPersistentPlayBgm();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setBgmCode(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaPersistentPlayBgm {
        return WeaPersistentPlayBgm.decode(this.encode());
    }

    public override getSchemaName(): "WeaPersistentPlayBgm" {
        return "WeaPersistentPlayBgm";
    }

    public checkHasBgmCode(): boolean {
        return this._bgmCode != null;
    }
    public getBgmCode(): number | null | undefined {
        return this._bgmCode;
    }
    public setBgmCode(value: number | null | undefined): void {
        this._bgmCode = value;
    }
}
