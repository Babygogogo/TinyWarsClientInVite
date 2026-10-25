import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface SelfUnitOffenseJson extends $ProtoSchemaJsonBase {
    coSkillAreaTypeId?: number | null | undefined;
    unitCategoryId?: number | null | undefined;
    tileCategoryId?: number | null | undefined;
    weatherCategoryId?: number | null | undefined;
    offsetPct?: number | null | undefined;
    fundConversion?: number | null | undefined;
    offsetPctOnCounter?: number | null | undefined;
    offsetPctFromHp: number[];
    offsetPctFromOwnTile: number[];
    offsetPctFromTileDefense: number[];
    offsetPctFromPromotion: number[];
    offsetPctFromCoUnit?: number | null | undefined;
}

export class SelfUnitOffense extends $ProtoSchemaBase {
    private _coSkillAreaTypeId?: number | null | undefined;
    private _unitCategoryId?: number | null | undefined;
    private _tileCategoryId?: number | null | undefined;
    private _weatherCategoryId?: number | null | undefined;
    private _offsetPct?: number | null | undefined;
    private _fundConversion?: number | null | undefined;
    private _offsetPctOnCounter?: number | null | undefined;
    private _offsetPctFromHp: number[] = [];
    private _offsetPctFromOwnTile: number[] = [];
    private _offsetPctFromTileDefense: number[] = [];
    private _offsetPctFromPromotion: number[] = [];
    private _offsetPctFromCoUnit?: number | null | undefined;

    public static fromJson(obj: SelfUnitOffenseJson): SelfUnitOffense {
        return new SelfUnitOffense().loadJson(obj);
    }
    public override loadJson(obj: SelfUnitOffenseJson): this {
        this.setCoSkillAreaTypeId(obj.coSkillAreaTypeId);
        this.setUnitCategoryId(obj.unitCategoryId);
        this.setTileCategoryId(obj.tileCategoryId);
        this.setWeatherCategoryId(obj.weatherCategoryId);
        this.setOffsetPct(obj.offsetPct);
        this.setFundConversion(obj.fundConversion);
        this.setOffsetPctOnCounter(obj.offsetPctOnCounter);
        this.setOffsetPctFromHp(obj.offsetPctFromHp?.concat() ?? []);
        this.setOffsetPctFromOwnTile(obj.offsetPctFromOwnTile?.concat() ?? []);
        this.setOffsetPctFromTileDefense(obj.offsetPctFromTileDefense?.concat() ?? []);
        this.setOffsetPctFromPromotion(obj.offsetPctFromPromotion?.concat() ?? []);
        this.setOffsetPctFromCoUnit(obj.offsetPctFromCoUnit);
        return this;
    }
    public override toJson(obj?: SelfUnitOffenseJson): SelfUnitOffenseJson {
        obj ??= ({} as SelfUnitOffenseJson);

        {
            const value = this.getCoSkillAreaTypeId();
            (value != null) && (obj.coSkillAreaTypeId = value);
        }

        {
            const value = this.getUnitCategoryId();
            (value != null) && (obj.unitCategoryId = value);
        }

        {
            const value = this.getTileCategoryId();
            (value != null) && (obj.tileCategoryId = value);
        }

        {
            const value = this.getWeatherCategoryId();
            (value != null) && (obj.weatherCategoryId = value);
        }

        {
            const value = this.getOffsetPct();
            (value != null) && (obj.offsetPct = value);
        }

        {
            const value = this.getFundConversion();
            (value != null) && (obj.fundConversion = value);
        }

        {
            const value = this.getOffsetPctOnCounter();
            (value != null) && (obj.offsetPctOnCounter = value);
        }

        {
            obj.offsetPctFromHp = this.getOffsetPctFromHp().concat();
        }

        {
            obj.offsetPctFromOwnTile = this.getOffsetPctFromOwnTile().concat();
        }

        {
            obj.offsetPctFromTileDefense = this.getOffsetPctFromTileDefense().concat();
        }

        {
            obj.offsetPctFromPromotion = this.getOffsetPctFromPromotion().concat();
        }

        {
            const value = this.getOffsetPctFromCoUnit();
            (value != null) && (obj.offsetPctFromCoUnit = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCoSkillAreaTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getUnitCategoryId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getTileCategoryId();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getWeatherCategoryId();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getOffsetPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getFundConversion();
            if ((value != null) && (value != 0)) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getOffsetPctOnCounter();
            if ((value != null) && (value != 0)) {
                writer.uint32(56).int32(value);
            }
        }

        {
            const value = this.getOffsetPctFromHp();
            const length = value.length;
            if (length) {
                writer.uint32(66).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getOffsetPctFromOwnTile();
            const length = value.length;
            if (length) {
                writer.uint32(74).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getOffsetPctFromTileDefense();
            const length = value.length;
            if (length) {
                writer.uint32(82).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getOffsetPctFromPromotion();
            const length = value.length;
            if (length) {
                writer.uint32(90).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getOffsetPctFromCoUnit();
            if ((value != null) && (value != 0)) {
                writer.uint32(96).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SelfUnitOffense {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SelfUnitOffense();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCoSkillAreaTypeId(reader.int32());
                    break;

                case 2:
                    msg.setUnitCategoryId(reader.int32());
                    break;

                case 3:
                    msg.setTileCategoryId(reader.int32());
                    break;

                case 4:
                    msg.setWeatherCategoryId(reader.int32());
                    break;

                case 5:
                    msg.setOffsetPct(reader.int32());
                    break;

                case 6:
                    msg.setFundConversion(reader.int32());
                    break;

                case 7:
                    msg.setOffsetPctOnCounter(reader.int32());
                    break;

                case 8:
                    {
                        const arr = msg._offsetPctFromHp;
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

                case 9:
                    {
                        const arr = msg._offsetPctFromOwnTile;
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

                case 10:
                    {
                        const arr = msg._offsetPctFromTileDefense;
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

                case 11:
                    {
                        const arr = msg._offsetPctFromPromotion;
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

                case 12:
                    msg.setOffsetPctFromCoUnit(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SelfUnitOffense {
        return SelfUnitOffense.decode(this.encode());
    }

    public override getSchemaName(): "SelfUnitOffense" {
        return "SelfUnitOffense";
    }

    public checkHasCoSkillAreaTypeId(): boolean {
        return this._coSkillAreaTypeId != null;
    }
    public getCoSkillAreaTypeId(): number {
        return this._coSkillAreaTypeId ?? 0;
    }
    public setCoSkillAreaTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._coSkillAreaTypeId = null;
        } else {
            this._coSkillAreaTypeId = value;
        }
    }

    public checkHasUnitCategoryId(): boolean {
        return this._unitCategoryId != null;
    }
    public getUnitCategoryId(): number | null | undefined {
        return this._unitCategoryId;
    }
    public setUnitCategoryId(value: number | null | undefined): void {
        this._unitCategoryId = value;
    }

    public checkHasTileCategoryId(): boolean {
        return this._tileCategoryId != null;
    }
    public getTileCategoryId(): number | null | undefined {
        return this._tileCategoryId;
    }
    public setTileCategoryId(value: number | null | undefined): void {
        this._tileCategoryId = value;
    }

    public checkHasWeatherCategoryId(): boolean {
        return this._weatherCategoryId != null;
    }
    public getWeatherCategoryId(): number | null | undefined {
        return this._weatherCategoryId;
    }
    public setWeatherCategoryId(value: number | null | undefined): void {
        this._weatherCategoryId = value;
    }

    public checkHasOffsetPct(): boolean {
        return this._offsetPct != null;
    }
    public getOffsetPct(): number {
        return this._offsetPct ?? 0;
    }
    public setOffsetPct(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._offsetPct = null;
        } else {
            this._offsetPct = value;
        }
    }

    public checkHasFundConversion(): boolean {
        return this._fundConversion != null;
    }
    public getFundConversion(): number {
        return this._fundConversion ?? 0;
    }
    public setFundConversion(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._fundConversion = null;
        } else {
            this._fundConversion = value;
        }
    }

    public checkHasOffsetPctOnCounter(): boolean {
        return this._offsetPctOnCounter != null;
    }
    public getOffsetPctOnCounter(): number {
        return this._offsetPctOnCounter ?? 0;
    }
    public setOffsetPctOnCounter(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._offsetPctOnCounter = null;
        } else {
            this._offsetPctOnCounter = value;
        }
    }

    public getOffsetPctFromHp(): number[] {
        return this._offsetPctFromHp;
    }
    public setOffsetPctFromHp(value: number[]): void {
        this._offsetPctFromHp = value;
    }

    public getOffsetPctFromOwnTile(): number[] {
        return this._offsetPctFromOwnTile;
    }
    public setOffsetPctFromOwnTile(value: number[]): void {
        this._offsetPctFromOwnTile = value;
    }

    public getOffsetPctFromTileDefense(): number[] {
        return this._offsetPctFromTileDefense;
    }
    public setOffsetPctFromTileDefense(value: number[]): void {
        this._offsetPctFromTileDefense = value;
    }

    public getOffsetPctFromPromotion(): number[] {
        return this._offsetPctFromPromotion;
    }
    public setOffsetPctFromPromotion(value: number[]): void {
        this._offsetPctFromPromotion = value;
    }

    public checkHasOffsetPctFromCoUnit(): boolean {
        return this._offsetPctFromCoUnit != null;
    }
    public getOffsetPctFromCoUnit(): number {
        return this._offsetPctFromCoUnit ?? 0;
    }
    public setOffsetPctFromCoUnit(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._offsetPctFromCoUnit = null;
        } else {
            this._offsetPctFromCoUnit = value;
        }
    }
}
