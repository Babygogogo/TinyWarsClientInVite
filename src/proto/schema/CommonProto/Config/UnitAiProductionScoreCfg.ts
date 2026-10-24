import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface UnitAiProductionScoreCfgJson extends $ProtoSchemaJsonBase {
    baseStd?: number | null | undefined;
    baseFog?: number | null | undefined;
    bonusForTooFewHp: number[];
}

export class UnitAiProductionScoreCfg extends $ProtoSchemaBase {
    private _baseStd?: number | null | undefined;
    private _baseFog?: number | null | undefined;
    private _bonusForTooFewHp: number[] = [];

    public static fromJson(obj: UnitAiProductionScoreCfgJson): UnitAiProductionScoreCfg {
        return new UnitAiProductionScoreCfg().loadJson(obj);
    }
    public override loadJson(obj: UnitAiProductionScoreCfgJson): this {
        this.setBaseStd(obj.baseStd);
        this.setBaseFog(obj.baseFog);
        this.setBonusForTooFewHp(obj.bonusForTooFewHp?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: UnitAiProductionScoreCfgJson): UnitAiProductionScoreCfgJson {
        obj ??= ({} as UnitAiProductionScoreCfgJson);

        {
            const value = this.getBaseStd();
            (value != null) && (obj.baseStd = value);
        }

        {
            const value = this.getBaseFog();
            (value != null) && (obj.baseFog = value);
        }

        {
            obj.bonusForTooFewHp = this.getBonusForTooFewHp().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getBaseStd();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getBaseFog();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getBonusForTooFewHp();
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UnitAiProductionScoreCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UnitAiProductionScoreCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setBaseStd(reader.int32());
                    break;

                case 2:
                    msg.setBaseFog(reader.int32());
                    break;

                case 3:
                    {
                        const arr = msg._bonusForTooFewHp;
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

    public override clone(): UnitAiProductionScoreCfg {
        return UnitAiProductionScoreCfg.decode(this.encode());
    }

    public override getSchemaName(): "UnitAiProductionScoreCfg" {
        return "UnitAiProductionScoreCfg";
    }

    public checkHasBaseStd(): boolean {
        return this._baseStd != null;
    }
    public getBaseStd(): number {
        return this._baseStd ?? 0;
    }
    public setBaseStd(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._baseStd = null;
        } else {
            this._baseStd = value;
        }
    }

    public checkHasBaseFog(): boolean {
        return this._baseFog != null;
    }
    public getBaseFog(): number {
        return this._baseFog ?? 0;
    }
    public setBaseFog(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._baseFog = null;
        } else {
            this._baseFog = value;
        }
    }

    public getBonusForTooFewHp(): number[] {
        return this._bonusForTooFewHp;
    }
    public setBonusForTooFewHp(value: number[]): void {
        this._bonusForTooFewHp = value;
    }
}
