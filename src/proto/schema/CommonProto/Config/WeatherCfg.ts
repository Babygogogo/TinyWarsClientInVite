import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeatherCfgJson extends $ProtoSchemaJsonBase {
    weatherTypeId?: number | null | undefined;
    isDefault?: boolean | null | undefined;
    fog?: number | null | undefined;
    offenseBonus: number[];
    movementBonus: number[];
    unitVisionFixed: number[];
    tileVisionFixed: number[];
    icon?: string | null | undefined;
    nameTextId?: number | null | undefined;
    descTextId?: number | null | undefined;
    anim?: number | null | undefined;
    tileTheme?: number | null | undefined;
}

export class WeatherCfg extends $ProtoSchemaBase {
    private _weatherTypeId?: number | null | undefined;
    private _isDefault?: boolean | null | undefined;
    private _fog?: number | null | undefined;
    private _offenseBonus: number[] = [];
    private _movementBonus: number[] = [];
    private _unitVisionFixed: number[] = [];
    private _tileVisionFixed: number[] = [];
    private _icon?: string | null | undefined;
    private _nameTextId?: number | null | undefined;
    private _descTextId?: number | null | undefined;
    private _anim?: number | null | undefined;
    private _tileTheme?: number | null | undefined;

    public static fromJson(obj: WeatherCfgJson): WeatherCfg {
        return new WeatherCfg().loadJson(obj);
    }
    public override loadJson(obj: WeatherCfgJson): this {
        this.setWeatherTypeId(obj.weatherTypeId);
        this.setIsDefault(obj.isDefault);
        this.setFog(obj.fog);
        this.setOffenseBonus(obj.offenseBonus?.concat() ?? []);
        this.setMovementBonus(obj.movementBonus?.concat() ?? []);
        this.setUnitVisionFixed(obj.unitVisionFixed?.concat() ?? []);
        this.setTileVisionFixed(obj.tileVisionFixed?.concat() ?? []);
        this.setIcon(obj.icon);
        this.setNameTextId(obj.nameTextId);
        this.setDescTextId(obj.descTextId);
        this.setAnim(obj.anim);
        this.setTileTheme(obj.tileTheme);
        return this;
    }
    public override toJson(obj?: WeatherCfgJson): WeatherCfgJson {
        obj ??= ({} as WeatherCfgJson);

        {
            const value = this.getWeatherTypeId();
            (value != null) && (obj.weatherTypeId = value);
        }

        {
            const value = this.getIsDefault();
            (value != null) && (obj.isDefault = value);
        }

        {
            const value = this.getFog();
            (value != null) && (obj.fog = value);
        }

        {
            obj.offenseBonus = this.getOffenseBonus().concat();
        }

        {
            obj.movementBonus = this.getMovementBonus().concat();
        }

        {
            obj.unitVisionFixed = this.getUnitVisionFixed().concat();
        }

        {
            obj.tileVisionFixed = this.getTileVisionFixed().concat();
        }

        {
            const value = this.getIcon();
            (value != null) && (obj.icon = value);
        }

        {
            const value = this.getNameTextId();
            (value != null) && (obj.nameTextId = value);
        }

        {
            const value = this.getDescTextId();
            (value != null) && (obj.descTextId = value);
        }

        {
            const value = this.getAnim();
            (value != null) && (obj.anim = value);
        }

        {
            const value = this.getTileTheme();
            (value != null) && (obj.tileTheme = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWeatherTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getIsDefault();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getFog();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getOffenseBonus();
            const length = value.length;
            if (length) {
                writer.uint32(34).fork();
                for (let i = 0; i < length; ++i) {
                    writer.sint32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getMovementBonus();
            const length = value.length;
            if (length) {
                writer.uint32(42).fork();
                for (let i = 0; i < length; ++i) {
                    writer.sint32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getUnitVisionFixed();
            const length = value.length;
            if (length) {
                writer.uint32(50).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getTileVisionFixed();
            const length = value.length;
            if (length) {
                writer.uint32(58).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getIcon();
            if (value != null) {
                writer.uint32(66).string(value);
            }
        }

        {
            const value = this.getNameTextId();
            if ((value != null) && (value != 0)) {
                writer.uint32(72).int32(value);
            }
        }

        {
            const value = this.getDescTextId();
            if ((value != null) && (value != 0)) {
                writer.uint32(80).int32(value);
            }
        }

        {
            const value = this.getAnim();
            if (value != null) {
                writer.uint32(88).int32(value);
            }
        }

        {
            const value = this.getTileTheme();
            if ((value != null) && (value != 0)) {
                writer.uint32(96).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeatherCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeatherCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWeatherTypeId(reader.int32());
                    break;

                case 2:
                    msg.setIsDefault(reader.bool());
                    break;

                case 3:
                    msg.setFog(reader.int32());
                    break;

                case 4:
                    {
                        const arr = msg._offenseBonus;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.sint32());
                            }
                        } else {
                            arr.push(reader.sint32());
                        }
                    }
                    break;

                case 5:
                    {
                        const arr = msg._movementBonus;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.sint32());
                            }
                        } else {
                            arr.push(reader.sint32());
                        }
                    }
                    break;

                case 6:
                    {
                        const arr = msg._unitVisionFixed;
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

                case 7:
                    {
                        const arr = msg._tileVisionFixed;
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

                case 8:
                    msg.setIcon(reader.string());
                    break;

                case 9:
                    msg.setNameTextId(reader.int32());
                    break;

                case 10:
                    msg.setDescTextId(reader.int32());
                    break;

                case 11:
                    msg.setAnim(reader.int32());
                    break;

                case 12:
                    msg.setTileTheme(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeatherCfg {
        return WeatherCfg.decode(this.encode());
    }

    public override getSchemaName(): "WeatherCfg" {
        return "WeatherCfg";
    }

    public checkHasWeatherTypeId(): boolean {
        return this._weatherTypeId != null;
    }
    public getWeatherTypeId(): number {
        return this._weatherTypeId ?? 0;
    }
    public setWeatherTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._weatherTypeId = null;
        } else {
            this._weatherTypeId = value;
        }
    }

    public checkHasIsDefault(): boolean {
        return this._isDefault != null;
    }
    public getIsDefault(): boolean {
        return this._isDefault ?? false;
    }
    public setIsDefault(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isDefault = null;
        } else {
            this._isDefault = value;
        }
    }

    public checkHasFog(): boolean {
        return this._fog != null;
    }
    public getFog(): number {
        return this._fog ?? 0;
    }
    public setFog(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._fog = null;
        } else {
            this._fog = value;
        }
    }

    public getOffenseBonus(): number[] {
        return this._offenseBonus;
    }
    public setOffenseBonus(value: number[]): void {
        this._offenseBonus = value;
    }

    public getMovementBonus(): number[] {
        return this._movementBonus;
    }
    public setMovementBonus(value: number[]): void {
        this._movementBonus = value;
    }

    public getUnitVisionFixed(): number[] {
        return this._unitVisionFixed;
    }
    public setUnitVisionFixed(value: number[]): void {
        this._unitVisionFixed = value;
    }

    public getTileVisionFixed(): number[] {
        return this._tileVisionFixed;
    }
    public setTileVisionFixed(value: number[]): void {
        this._tileVisionFixed = value;
    }

    public checkHasIcon(): boolean {
        return this._icon != null;
    }
    public getIcon(): string | null | undefined {
        return this._icon;
    }
    public setIcon(value: string | null | undefined): void {
        this._icon = value;
    }

    public checkHasNameTextId(): boolean {
        return this._nameTextId != null;
    }
    public getNameTextId(): number {
        return this._nameTextId ?? 0;
    }
    public setNameTextId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._nameTextId = null;
        } else {
            this._nameTextId = value;
        }
    }

    public checkHasDescTextId(): boolean {
        return this._descTextId != null;
    }
    public getDescTextId(): number {
        return this._descTextId ?? 0;
    }
    public setDescTextId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._descTextId = null;
        } else {
            this._descTextId = value;
        }
    }

    public checkHasAnim(): boolean {
        return this._anim != null;
    }
    public getAnim(): number | null | undefined {
        return this._anim;
    }
    public setAnim(value: number | null | undefined): void {
        this._anim = value;
    }

    public checkHasTileTheme(): boolean {
        return this._tileTheme != null;
    }
    public getTileTheme(): number {
        return this._tileTheme ?? 0;
    }
    public setTileTheme(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._tileTheme = null;
        } else {
            this._tileTheme = value;
        }
    }
}
