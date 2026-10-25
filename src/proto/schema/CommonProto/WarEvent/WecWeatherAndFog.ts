import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WecWeatherAndFogJson extends $ProtoSchemaJsonBase {
    weatherTypeArray: number[];
    hasFogCurrently?: boolean | null | undefined;
}

export class WecWeatherAndFog extends $ProtoSchemaBase {
    private _weatherTypeArray: number[] = [];
    private _hasFogCurrently?: boolean | null | undefined;

    public static fromJson(obj: WecWeatherAndFogJson): WecWeatherAndFog {
        return new WecWeatherAndFog().loadJson(obj);
    }
    public override loadJson(obj: WecWeatherAndFogJson): this {
        this.setWeatherTypeArray(obj.weatherTypeArray?.concat() ?? []);
        this.setHasFogCurrently(obj.hasFogCurrently);
        return this;
    }
    public override toJson(obj?: WecWeatherAndFogJson): WecWeatherAndFogJson {
        obj ??= ({} as WecWeatherAndFogJson);

        {
            obj.weatherTypeArray = this.getWeatherTypeArray().concat();
        }

        {
            const value = this.getHasFogCurrently();
            (value != null) && (obj.hasFogCurrently = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWeatherTypeArray();
            const length = value.length;
            if (length) {
                writer.uint32(10).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getHasFogCurrently();
            if (value != null) {
                writer.uint32(16).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WecWeatherAndFog {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WecWeatherAndFog();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._weatherTypeArray;
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

                case 2:
                    msg.setHasFogCurrently(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WecWeatherAndFog {
        return WecWeatherAndFog.decode(this.encode());
    }

    public override getSchemaName(): "WecWeatherAndFog" {
        return "WecWeatherAndFog";
    }

    public getWeatherTypeArray(): number[] {
        return this._weatherTypeArray;
    }
    public setWeatherTypeArray(value: number[]): void {
        this._weatherTypeArray = value;
    }

    public checkHasHasFogCurrently(): boolean {
        return this._hasFogCurrently != null;
    }
    public getHasFogCurrently(): boolean | null | undefined {
        return this._hasFogCurrently;
    }
    public setHasFogCurrently(value: boolean | null | undefined): void {
        this._hasFogCurrently = value;
    }
}
