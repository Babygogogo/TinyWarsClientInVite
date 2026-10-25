import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetWeatherSimpleJson extends $ProtoSchemaJsonBase {
    weatherType?: number | null | undefined;
    weatherTurnsCount?: number | null | undefined;
}

export class WeaSetWeatherSimple extends $ProtoSchemaBase {
    private _weatherType?: number | null | undefined;
    private _weatherTurnsCount?: number | null | undefined;

    public static fromJson(obj: WeaSetWeatherSimpleJson): WeaSetWeatherSimple {
        return new WeaSetWeatherSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaSetWeatherSimpleJson): this {
        this.setWeatherType(obj.weatherType);
        this.setWeatherTurnsCount(obj.weatherTurnsCount);
        return this;
    }
    public override toJson(obj?: WeaSetWeatherSimpleJson): WeaSetWeatherSimpleJson {
        obj ??= ({} as WeaSetWeatherSimpleJson);

        {
            const value = this.getWeatherType();
            (value != null) && (obj.weatherType = value);
        }

        {
            const value = this.getWeatherTurnsCount();
            (value != null) && (obj.weatherTurnsCount = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWeatherType();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getWeatherTurnsCount();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetWeatherSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetWeatherSimple();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWeatherType(reader.int32());
                    break;

                case 2:
                    msg.setWeatherTurnsCount(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetWeatherSimple {
        return WeaSetWeatherSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetWeatherSimple" {
        return "WeaSetWeatherSimple";
    }

    public checkHasWeatherType(): boolean {
        return this._weatherType != null;
    }
    public getWeatherType(): number {
        return this._weatherType ?? 0;
    }
    public setWeatherType(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._weatherType = null;
        } else {
            this._weatherType = value;
        }
    }

    public checkHasWeatherTurnsCount(): boolean {
        return this._weatherTurnsCount != null;
    }
    public getWeatherTurnsCount(): number {
        return this._weatherTurnsCount ?? 0;
    }
    public setWeatherTurnsCount(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._weatherTurnsCount = null;
        } else {
            this._weatherTurnsCount = value;
        }
    }
}
