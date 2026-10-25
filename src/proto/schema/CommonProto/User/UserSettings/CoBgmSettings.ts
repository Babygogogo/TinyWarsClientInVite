import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CoBgmSettingsJson extends $ProtoSchemaJsonBase {
    coCategoryId?: number | null | undefined;
    bgmCodeArray: number[];
}

export class CoBgmSettings extends $ProtoSchemaBase {
    private _coCategoryId?: number | null | undefined;
    private _bgmCodeArray: number[] = [];

    public static fromJson(obj: CoBgmSettingsJson): CoBgmSettings {
        return new CoBgmSettings().loadJson(obj);
    }
    public override loadJson(obj: CoBgmSettingsJson): this {
        this.setCoCategoryId(obj.coCategoryId);
        this.setBgmCodeArray(obj.bgmCodeArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: CoBgmSettingsJson): CoBgmSettingsJson {
        obj ??= ({} as CoBgmSettingsJson);

        {
            const value = this.getCoCategoryId();
            (value != null) && (obj.coCategoryId = value);
        }

        {
            obj.bgmCodeArray = this.getBgmCodeArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCoCategoryId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getBgmCodeArray();
            const length = value.length;
            if (length) {
                writer.uint32(18).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): CoBgmSettings {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new CoBgmSettings();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCoCategoryId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._bgmCodeArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): CoBgmSettings {
        return CoBgmSettings.decode(this.encode());
    }

    public override getSchemaName(): "CoBgmSettings" {
        return "CoBgmSettings";
    }

    public checkHasCoCategoryId(): boolean {
        return this._coCategoryId != null;
    }
    public getCoCategoryId(): number | null | undefined {
        return this._coCategoryId;
    }
    public setCoCategoryId(value: number | null | undefined): void {
        this._coCategoryId = value;
    }

    public getBgmCodeArray(): number[] {
        return this._bgmCodeArray;
    }
    public setBgmCodeArray(value: number[]): void {
        this._bgmCodeArray = value;
    }
}
