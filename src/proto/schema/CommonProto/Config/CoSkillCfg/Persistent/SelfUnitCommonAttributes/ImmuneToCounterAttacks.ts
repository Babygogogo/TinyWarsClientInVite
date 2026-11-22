import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface ImmuneToCounterAttacksJson extends $ProtoSchemaJsonBase {
    isImmune?: boolean | null | undefined;
}

export class ImmuneToCounterAttacks extends $ProtoSchemaBase {
    private _isImmune?: boolean | null | undefined;

    public static fromJson(obj: ImmuneToCounterAttacksJson): ImmuneToCounterAttacks {
        return new ImmuneToCounterAttacks().loadJson(obj);
    }
    public override loadJson(obj: ImmuneToCounterAttacksJson): this {
        this.setIsImmune(obj.isImmune);
        return this;
    }
    public override toJson(obj?: ImmuneToCounterAttacksJson): ImmuneToCounterAttacksJson {
        obj ??= ({} as ImmuneToCounterAttacksJson);

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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ImmuneToCounterAttacks {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ImmuneToCounterAttacks();
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

    public override clone(): ImmuneToCounterAttacks {
        return ImmuneToCounterAttacks.decode(this.encode());
    }

    public override getSchemaName(): "ImmuneToCounterAttacks" {
        return "ImmuneToCounterAttacks";
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
