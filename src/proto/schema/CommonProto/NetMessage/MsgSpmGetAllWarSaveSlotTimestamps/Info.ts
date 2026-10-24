import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface InfoJson extends $ProtoSchemaJsonBase {
    slotIndex?: number | null | undefined;
    timestamp?: number | null | undefined;
}

export class Info extends $ProtoSchemaBase {
    private _slotIndex?: number | null | undefined;
    private _timestamp?: number | null | undefined;

    public static fromJson(obj: InfoJson): Info {
        return new Info().loadJson(obj);
    }
    public override loadJson(obj: InfoJson): this {
        this.setSlotIndex(obj.slotIndex);
        this.setTimestamp(obj.timestamp);
        return this;
    }
    public override toJson(obj?: InfoJson): InfoJson {
        obj ??= ({} as InfoJson);

        {
            const value = this.getSlotIndex();
            (value != null) && (obj.slotIndex = value);
        }

        {
            const value = this.getTimestamp();
            (value != null) && (obj.timestamp = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSlotIndex();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTimestamp();
            if (value != null) {
                writer.uint32(16).uint32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Info {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Info();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSlotIndex(reader.int32());
                    break;

                case 2:
                    msg.setTimestamp(reader.uint32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): Info {
        return Info.decode(this.encode());
    }

    public override getSchemaName(): "Info" {
        return "Info";
    }

    public checkHasSlotIndex(): boolean {
        return this._slotIndex != null;
    }
    public getSlotIndex(): number | null | undefined {
        return this._slotIndex;
    }
    public setSlotIndex(value: number | null | undefined): void {
        this._slotIndex = value;
    }

    public checkHasTimestamp(): boolean {
        return this._timestamp != null;
    }
    public getTimestamp(): number | null | undefined {
        return this._timestamp;
    }
    public setTimestamp(value: number | null | undefined): void {
        this._timestamp = value;
    }
}
