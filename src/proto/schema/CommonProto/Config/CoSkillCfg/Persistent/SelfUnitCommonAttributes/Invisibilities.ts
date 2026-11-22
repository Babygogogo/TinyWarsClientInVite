import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface InvisibilitiesJson extends $ProtoSchemaJsonBase {
    isInvisible?: boolean | null | undefined;
}

export class Invisibilities extends $ProtoSchemaBase {
    private _isInvisible?: boolean | null | undefined;

    public static fromJson(obj: InvisibilitiesJson): Invisibilities {
        return new Invisibilities().loadJson(obj);
    }
    public override loadJson(obj: InvisibilitiesJson): this {
        this.setIsInvisible(obj.isInvisible);
        return this;
    }
    public override toJson(obj?: InvisibilitiesJson): InvisibilitiesJson {
        obj ??= ({} as InvisibilitiesJson);

        {
            const value = this.getIsInvisible();
            (value != null) && (obj.isInvisible = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getIsInvisible();
            if ((value != null) && (value != false)) {
                writer.uint32(8).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Invisibilities {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Invisibilities();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setIsInvisible(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): Invisibilities {
        return Invisibilities.decode(this.encode());
    }

    public override getSchemaName(): "Invisibilities" {
        return "Invisibilities";
    }

    public checkHasIsInvisible(): boolean {
        return this._isInvisible != null;
    }
    public getIsInvisible(): boolean {
        return this._isInvisible ?? false;
    }
    public setIsInvisible(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isInvisible = null;
        } else {
            this._isInvisible = value;
        }
    }
}
