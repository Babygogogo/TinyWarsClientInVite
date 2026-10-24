import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface SerialWeatherManagerJson extends $ProtoSchemaJsonBase {
    forceWeatherType?: number | null | undefined;
    expireTurnIndex?: number | null | undefined;
    expirePlayerIndex?: number | null | undefined;
}

export class SerialWeatherManager extends $ProtoSchemaBase {
    private _forceWeatherType?: number | null | undefined;
    private _expireTurnIndex?: number | null | undefined;
    private _expirePlayerIndex?: number | null | undefined;

    public static fromJson(obj: SerialWeatherManagerJson): SerialWeatherManager {
        return new SerialWeatherManager().loadJson(obj);
    }
    public override loadJson(obj: SerialWeatherManagerJson): this {
        this.setForceWeatherType(obj.forceWeatherType);
        this.setExpireTurnIndex(obj.expireTurnIndex);
        this.setExpirePlayerIndex(obj.expirePlayerIndex);
        return this;
    }
    public override toJson(obj?: SerialWeatherManagerJson): SerialWeatherManagerJson {
        obj ??= ({} as SerialWeatherManagerJson);

        {
            const value = this.getForceWeatherType();
            (value != null) && (obj.forceWeatherType = value);
        }

        {
            const value = this.getExpireTurnIndex();
            (value != null) && (obj.expireTurnIndex = value);
        }

        {
            const value = this.getExpirePlayerIndex();
            (value != null) && (obj.expirePlayerIndex = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getForceWeatherType();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getExpireTurnIndex();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getExpirePlayerIndex();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SerialWeatherManager {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SerialWeatherManager();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setForceWeatherType(reader.int32());
                    break;

                case 2:
                    msg.setExpireTurnIndex(reader.int32());
                    break;

                case 3:
                    msg.setExpirePlayerIndex(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SerialWeatherManager {
        return SerialWeatherManager.decode(this.encode());
    }

    public override getSchemaName(): "SerialWeatherManager" {
        return "SerialWeatherManager";
    }

    public checkHasForceWeatherType(): boolean {
        return this._forceWeatherType != null;
    }
    public getForceWeatherType(): number | null | undefined {
        return this._forceWeatherType;
    }
    public setForceWeatherType(value: number | null | undefined): void {
        this._forceWeatherType = value;
    }

    public checkHasExpireTurnIndex(): boolean {
        return this._expireTurnIndex != null;
    }
    public getExpireTurnIndex(): number | null | undefined {
        return this._expireTurnIndex;
    }
    public setExpireTurnIndex(value: number | null | undefined): void {
        this._expireTurnIndex = value;
    }

    public checkHasExpirePlayerIndex(): boolean {
        return this._expirePlayerIndex != null;
    }
    public getExpirePlayerIndex(): number | null | undefined {
        return this._expirePlayerIndex;
    }
    public setExpirePlayerIndex(value: number | null | undefined): void {
        this._expirePlayerIndex = value;
    }
}
