import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface ImmuneToWeathersJson extends $ProtoSchemaJsonBase {
    isImmune?: boolean | null | undefined;
}

export class ImmuneToWeathers extends $ProtoSchemaBase {
    private _isImmune?: boolean | null | undefined;

    public static fromJson(obj: ImmuneToWeathersJson): ImmuneToWeathers {
        return new ImmuneToWeathers().loadJson(obj);
    }
    public override loadJson(obj: ImmuneToWeathersJson): this {
        this.setIsImmune(obj.isImmune);
        return this;
    }
    public override toJson(obj?: ImmuneToWeathersJson): ImmuneToWeathersJson {
        obj ??= ({} as ImmuneToWeathersJson);

        {
            const value = this.getIsImmune();
            (value != null) && (obj.isImmune = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getIsImmune();
            if ((value != null) && (value != false)) {
                writer.uint32(8).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ImmuneToWeathers {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ImmuneToWeathers();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setIsImmune(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ImmuneToWeathers {
        return ImmuneToWeathers.decode(this.encode());
    }

    public override getSchemaName(): "ImmuneToWeathers" {
        return "ImmuneToWeathers";
    }

    public checkHasIsImmune(): boolean {
        return this._isImmune != null;
    }
    public getIsImmune(): boolean {
        return this._isImmune ?? false;
    }
    public setIsImmune(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isImmune = null;
        } else {
            this._isImmune = value;
        }
    }
}
