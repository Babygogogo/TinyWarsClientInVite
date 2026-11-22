import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface ReceiveFullTileDefenseWhenDamagedJson extends $ProtoSchemaJsonBase {
    isEnabled?: boolean | null | undefined;
}

export class ReceiveFullTileDefenseWhenDamaged extends $ProtoSchemaBase {
    private _isEnabled?: boolean | null | undefined;

    public static fromJson(obj: ReceiveFullTileDefenseWhenDamagedJson): ReceiveFullTileDefenseWhenDamaged {
        return new ReceiveFullTileDefenseWhenDamaged().loadJson(obj);
    }
    public override loadJson(obj: ReceiveFullTileDefenseWhenDamagedJson): this {
        this.setIsEnabled(obj.isEnabled);
        return this;
    }
    public override toJson(obj?: ReceiveFullTileDefenseWhenDamagedJson): ReceiveFullTileDefenseWhenDamagedJson {
        obj ??= ({} as ReceiveFullTileDefenseWhenDamagedJson);

        {
            const value = this.getIsEnabled();
            (value != null) && (obj.isEnabled = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getIsEnabled();
            if ((value != null) && (value != false)) {
                writer.uint32(8).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ReceiveFullTileDefenseWhenDamaged {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ReceiveFullTileDefenseWhenDamaged();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setIsEnabled(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ReceiveFullTileDefenseWhenDamaged {
        return ReceiveFullTileDefenseWhenDamaged.decode(this.encode());
    }

    public override getSchemaName(): "ReceiveFullTileDefenseWhenDamaged" {
        return "ReceiveFullTileDefenseWhenDamaged";
    }

    public checkHasIsEnabled(): boolean {
        return this._isEnabled != null;
    }
    public getIsEnabled(): boolean {
        return this._isEnabled ?? false;
    }
    public setIsEnabled(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isEnabled = null;
        } else {
            this._isEnabled = value;
        }
    }
}
