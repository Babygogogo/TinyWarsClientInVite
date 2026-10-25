import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaPlayBgmJson extends $ProtoSchemaJsonBase {
    bgmCode?: number | null | undefined;
    useCoBgm?: boolean | null | undefined;
}

export class WeaPlayBgm extends $ProtoSchemaBase {
    private _bgmCode?: number | null | undefined;
    private _useCoBgm?: boolean | null | undefined;

    public static fromJson(obj: WeaPlayBgmJson): WeaPlayBgm {
        return new WeaPlayBgm().loadJson(obj);
    }
    public override loadJson(obj: WeaPlayBgmJson): this {
        this.setBgmCode(obj.bgmCode);
        this.setUseCoBgm(obj.useCoBgm);
        return this;
    }
    public override toJson(obj?: WeaPlayBgmJson): WeaPlayBgmJson {
        obj ??= ({} as WeaPlayBgmJson);

        {
            const value = this.getBgmCode();
            (value != null) && (obj.bgmCode = value);
        }

        {
            const value = this.getUseCoBgm();
            (value != null) && (obj.useCoBgm = value);
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

        {
            const value = this.getUseCoBgm();
            if (value != null) {
                writer.uint32(16).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaPlayBgm {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaPlayBgm();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setBgmCode(reader.int32());
                    break;

                case 2:
                    msg.setUseCoBgm(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaPlayBgm {
        return WeaPlayBgm.decode(this.encode());
    }

    public override getSchemaName(): "WeaPlayBgm" {
        return "WeaPlayBgm";
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

    public checkHasUseCoBgm(): boolean {
        return this._useCoBgm != null;
    }
    public getUseCoBgm(): boolean | null | undefined {
        return this._useCoBgm;
    }
    public setUseCoBgm(value: boolean | null | undefined): void {
        this._useCoBgm = value;
    }
}
