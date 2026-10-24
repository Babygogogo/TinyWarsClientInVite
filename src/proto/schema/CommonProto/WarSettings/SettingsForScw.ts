import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface SettingsForScwJson extends $ProtoSchemaJsonBase {
    normalMapId?: number | null | undefined;
    isCheating?: boolean | null | undefined;
}

export class SettingsForScw extends $ProtoSchemaBase {
    private _normalMapId?: number | null | undefined;
    private _isCheating?: boolean | null | undefined;

    public static fromJson(obj: SettingsForScwJson): SettingsForScw {
        return new SettingsForScw().loadJson(obj);
    }
    public override loadJson(obj: SettingsForScwJson): this {
        this.setNormalMapId(obj.normalMapId);
        this.setIsCheating(obj.isCheating);
        return this;
    }
    public override toJson(obj?: SettingsForScwJson): SettingsForScwJson {
        obj ??= ({} as SettingsForScwJson);

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getIsCheating();
            (value != null) && (obj.isCheating = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNormalMapId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getIsCheating();
            if (value != null) {
                writer.uint32(16).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SettingsForScw {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SettingsForScw();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 2:
                    msg.setIsCheating(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SettingsForScw {
        return SettingsForScw.decode(this.encode());
    }

    public override getSchemaName(): "SettingsForScw" {
        return "SettingsForScw";
    }

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number {
        return this._normalMapId ?? 0;
    }
    public setNormalMapId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._normalMapId = null;
        } else {
            this._normalMapId = value;
        }
    }

    public checkHasIsCheating(): boolean {
        return this._isCheating != null;
    }
    public getIsCheating(): boolean | null | undefined {
        return this._isCheating;
    }
    public setIsCheating(value: boolean | null | undefined): void {
        this._isCheating = value;
    }
}
