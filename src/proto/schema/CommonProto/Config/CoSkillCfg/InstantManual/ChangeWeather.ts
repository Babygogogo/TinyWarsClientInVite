import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface ChangeWeatherJson extends $ProtoSchemaJsonBase {
    turns?: number | null | undefined;
    keepVision?: boolean | null | undefined;
    weatherTypeIdArray: number[];
}

export class ChangeWeather extends $ProtoSchemaBase {
    private _turns?: number | null | undefined;
    private _keepVision?: boolean | null | undefined;
    private _weatherTypeIdArray: number[] = [];

    public static fromJson(obj: ChangeWeatherJson): ChangeWeather {
        return new ChangeWeather().loadJson(obj);
    }
    public override loadJson(obj: ChangeWeatherJson): this {
        this.setTurns(obj.turns);
        this.setKeepVision(obj.keepVision);
        this.setWeatherTypeIdArray(obj.weatherTypeIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: ChangeWeatherJson): ChangeWeatherJson {
        obj ??= ({} as ChangeWeatherJson);

        {
            const value = this.getTurns();
            (value != null) && (obj.turns = value);
        }

        {
            const value = this.getKeepVision();
            (value != null) && (obj.keepVision = value);
        }

        {
            obj.weatherTypeIdArray = this.getWeatherTypeIdArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTurns();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getKeepVision();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getWeatherTypeIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(26).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ChangeWeather {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ChangeWeather();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTurns(reader.int32());
                    break;

                case 2:
                    msg.setKeepVision(reader.bool());
                    break;

                case 3:
                    {
                        const arr = msg._weatherTypeIdArray;
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

    public override clone(): ChangeWeather {
        return ChangeWeather.decode(this.encode());
    }

    public override getSchemaName(): "ChangeWeather" {
        return "ChangeWeather";
    }

    public checkHasTurns(): boolean {
        return this._turns != null;
    }
    public getTurns(): number {
        return this._turns ?? 0;
    }
    public setTurns(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._turns = null;
        } else {
            this._turns = value;
        }
    }

    public checkHasKeepVision(): boolean {
        return this._keepVision != null;
    }
    public getKeepVision(): boolean {
        return this._keepVision ?? false;
    }
    public setKeepVision(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._keepVision = null;
        } else {
            this._keepVision = value;
        }
    }

    public getWeatherTypeIdArray(): number[] {
        return this._weatherTypeIdArray;
    }
    public setWeatherTypeIdArray(value: number[]): void {
        this._weatherTypeIdArray = value;
    }
}
