import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface DefensePercentOffsetsJson extends $ProtoSchemaJsonBase {
    offsetPct?: number | null | undefined;
    fundConversion?: number | null | undefined;
    offsetPctFromHp: number[];
    offsetPctFromTileDefense: number[];
    offsetPctFromPromotion: number[];
    offsetPctAgainstSpecificEnemy: number[];
    offsetPctFromOwnTile: number[];
    offsetPctAgainstSameEnemy?: number | null | undefined;
}

export class DefensePercentOffsets extends $ProtoSchemaBase {
    private _offsetPct?: number | null | undefined;
    private _fundConversion?: number | null | undefined;
    private _offsetPctFromHp: number[] = [];
    private _offsetPctFromTileDefense: number[] = [];
    private _offsetPctFromPromotion: number[] = [];
    private _offsetPctAgainstSpecificEnemy: number[] = [];
    private _offsetPctFromOwnTile: number[] = [];
    private _offsetPctAgainstSameEnemy?: number | null | undefined;

    public static fromJson(obj: DefensePercentOffsetsJson): DefensePercentOffsets {
        return new DefensePercentOffsets().loadJson(obj);
    }
    public override loadJson(obj: DefensePercentOffsetsJson): this {
        this.setOffsetPct(obj.offsetPct);
        this.setFundConversion(obj.fundConversion);
        this.setOffsetPctFromHp(obj.offsetPctFromHp?.concat() ?? []);
        this.setOffsetPctFromTileDefense(obj.offsetPctFromTileDefense?.concat() ?? []);
        this.setOffsetPctFromPromotion(obj.offsetPctFromPromotion?.concat() ?? []);
        this.setOffsetPctAgainstSpecificEnemy(obj.offsetPctAgainstSpecificEnemy?.concat() ?? []);
        this.setOffsetPctFromOwnTile(obj.offsetPctFromOwnTile?.concat() ?? []);
        this.setOffsetPctAgainstSameEnemy(obj.offsetPctAgainstSameEnemy);
        return this;
    }
    public override toJson(obj?: DefensePercentOffsetsJson): DefensePercentOffsetsJson {
        obj ??= ({} as DefensePercentOffsetsJson);

        {
            const value = this.getOffsetPct();
            (value != null) && (obj.offsetPct = value);
        }

        {
            const value = this.getFundConversion();
            (value != null) && (obj.fundConversion = value);
        }

        {
            obj.offsetPctFromHp = this.getOffsetPctFromHp().concat();
        }

        {
            obj.offsetPctFromTileDefense = this.getOffsetPctFromTileDefense().concat();
        }

        {
            obj.offsetPctFromPromotion = this.getOffsetPctFromPromotion().concat();
        }

        {
            obj.offsetPctAgainstSpecificEnemy = this.getOffsetPctAgainstSpecificEnemy().concat();
        }

        {
            obj.offsetPctFromOwnTile = this.getOffsetPctFromOwnTile().concat();
        }

        {
            const value = this.getOffsetPctAgainstSameEnemy();
            (value != null) && (obj.offsetPctAgainstSameEnemy = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getOffsetPct();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getFundConversion();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getOffsetPctFromHp();
            const length = value.length;
            if (length) {
                writer.uint32(26).fork();
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
                writer.uint32(34).fork();
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
                writer.uint32(42).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getOffsetPctAgainstSpecificEnemy();
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
            const value = this.getOffsetPctFromOwnTile();
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
            const value = this.getOffsetPctAgainstSameEnemy();
            if ((value != null) && (value != 0)) {
                writer.uint32(64).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): DefensePercentOffsets {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new DefensePercentOffsets();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setOffsetPct(reader.int32());
                    break;

                case 2:
                    msg.setFundConversion(reader.int32());
                    break;

                case 3:
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

                case 4:
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

                case 5:
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

                case 6:
                    {
                        const arr = msg._offsetPctAgainstSpecificEnemy;
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

                case 8:
                    msg.setOffsetPctAgainstSameEnemy(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): DefensePercentOffsets {
        return DefensePercentOffsets.decode(this.encode());
    }

    public override getSchemaName(): "DefensePercentOffsets" {
        return "DefensePercentOffsets";
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

    public getOffsetPctFromHp(): number[] {
        return this._offsetPctFromHp;
    }
    public setOffsetPctFromHp(value: number[]): void {
        this._offsetPctFromHp = value;
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

    public getOffsetPctAgainstSpecificEnemy(): number[] {
        return this._offsetPctAgainstSpecificEnemy;
    }
    public setOffsetPctAgainstSpecificEnemy(value: number[]): void {
        this._offsetPctAgainstSpecificEnemy = value;
    }

    public getOffsetPctFromOwnTile(): number[] {
        return this._offsetPctFromOwnTile;
    }
    public setOffsetPctFromOwnTile(value: number[]): void {
        this._offsetPctFromOwnTile = value;
    }

    public checkHasOffsetPctAgainstSameEnemy(): boolean {
        return this._offsetPctAgainstSameEnemy != null;
    }
    public getOffsetPctAgainstSameEnemy(): number {
        return this._offsetPctAgainstSameEnemy ?? 0;
    }
    public setOffsetPctAgainstSameEnemy(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._offsetPctAgainstSameEnemy = null;
        } else {
            this._offsetPctAgainstSameEnemy = value;
        }
    }
}
