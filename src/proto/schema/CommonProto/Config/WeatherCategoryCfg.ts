import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeatherCategoryCfgJson extends $ProtoSchemaJsonBase {
    weatherCategoryId?: number | null | undefined;
    weatherTypeIds: number[];
}

export class WeatherCategoryCfg extends $ProtoSchemaBase {
    private _weatherCategoryId?: number | null | undefined;
    private _weatherTypeIds: number[] = [];

    public static fromJson(obj: WeatherCategoryCfgJson): WeatherCategoryCfg {
        return new WeatherCategoryCfg().loadJson(obj);
    }
    public override loadJson(obj: WeatherCategoryCfgJson): this {
        this.setWeatherCategoryId(obj.weatherCategoryId);
        this.setWeatherTypeIds(obj.weatherTypeIds?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: WeatherCategoryCfgJson): WeatherCategoryCfgJson {
        obj ??= ({} as WeatherCategoryCfgJson);

        {
            const value = this.getWeatherCategoryId();
            (value != null) && (obj.weatherCategoryId = value);
        }

        {
            obj.weatherTypeIds = this.getWeatherTypeIds().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWeatherCategoryId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getWeatherTypeIds();
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeatherCategoryCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeatherCategoryCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWeatherCategoryId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._weatherTypeIds;
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

    public override clone(): WeatherCategoryCfg {
        return WeatherCategoryCfg.decode(this.encode());
    }

    public override getSchemaName(): "WeatherCategoryCfg" {
        return "WeatherCategoryCfg";
    }

    public checkHasWeatherCategoryId(): boolean {
        return this._weatherCategoryId != null;
    }
    public getWeatherCategoryId(): number {
        return this._weatherCategoryId ?? 0;
    }
    public setWeatherCategoryId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._weatherCategoryId = null;
        } else {
            this._weatherCategoryId = value;
        }
    }

    public getWeatherTypeIds(): number[] {
        return this._weatherTypeIds;
    }
    public setWeatherTypeIds(value: number[]): void {
        this._weatherTypeIds = value;
    }
}
