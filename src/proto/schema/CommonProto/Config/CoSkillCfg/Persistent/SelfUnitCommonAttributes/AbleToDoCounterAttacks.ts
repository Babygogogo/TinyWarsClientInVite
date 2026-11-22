import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface AbleToDoCounterAttacksJson extends $ProtoSchemaJsonBase {
    isAble?: boolean | null | undefined;
}

export class AbleToDoCounterAttacks extends $ProtoSchemaBase {
    private _isAble?: boolean | null | undefined;

    public static fromJson(obj: AbleToDoCounterAttacksJson): AbleToDoCounterAttacks {
        return new AbleToDoCounterAttacks().loadJson(obj);
    }
    public override loadJson(obj: AbleToDoCounterAttacksJson): this {
        this.setIsAble(obj.isAble);
        return this;
    }
    public override toJson(obj?: AbleToDoCounterAttacksJson): AbleToDoCounterAttacksJson {
        obj ??= ({} as AbleToDoCounterAttacksJson);

        {
            const value = this.getIsAble();
            (value != null) && (obj.isAble = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getIsAble();
            if (value != null) {
                writer.uint32(8).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): AbleToDoCounterAttacks {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new AbleToDoCounterAttacks();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setIsAble(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): AbleToDoCounterAttacks {
        return AbleToDoCounterAttacks.decode(this.encode());
    }

    public override getSchemaName(): "AbleToDoCounterAttacks" {
        return "AbleToDoCounterAttacks";
    }

    public checkHasIsAble(): boolean {
        return this._isAble != null;
    }
    public getIsAble(): boolean | null | undefined {
        return this._isAble;
    }
    public setIsAble(value: boolean | null | undefined): void {
        this._isAble = value;
    }
}
