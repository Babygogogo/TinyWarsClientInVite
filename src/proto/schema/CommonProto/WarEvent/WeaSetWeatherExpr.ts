import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetWeatherExprJson extends $ProtoSchemaJsonBase {
    weatherType?: string | null | undefined;
    weatherTurnsCount?: string | null | undefined;
}

export class WeaSetWeatherExpr extends $ProtoSchemaBase {
    private _weatherType?: string | null | undefined;
    private _weatherTurnsCount?: string | null | undefined;

    public static fromJson(obj: WeaSetWeatherExprJson): WeaSetWeatherExpr {
        return new WeaSetWeatherExpr().loadJson(obj);
    }
    public override loadJson(obj: WeaSetWeatherExprJson): this {
        this.setWeatherType(obj.weatherType);
        this.setWeatherTurnsCount(obj.weatherTurnsCount);
        return this;
    }
    public override toJson(obj?: WeaSetWeatherExprJson): WeaSetWeatherExprJson {
        obj ??= ({} as WeaSetWeatherExprJson);

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
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getWeatherTurnsCount();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetWeatherExpr {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetWeatherExpr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWeatherType(reader.string());
                    break;

                case 2:
                    msg.setWeatherTurnsCount(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetWeatherExpr {
        return WeaSetWeatherExpr.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetWeatherExpr" {
        return "WeaSetWeatherExpr";
    }

    public checkHasWeatherType(): boolean {
        return this._weatherType != null;
    }
    public getWeatherType(): string | null | undefined {
        return this._weatherType;
    }
    public setWeatherType(value: string | null | undefined): void {
        this._weatherType = value;
    }

    public checkHasWeatherTurnsCount(): boolean {
        return this._weatherTurnsCount != null;
    }
    public getWeatherTurnsCount(): string | null | undefined {
        return this._weatherTurnsCount;
    }
    public setWeatherTurnsCount(value: string | null | undefined): void {
        this._weatherTurnsCount = value;
    }
}
