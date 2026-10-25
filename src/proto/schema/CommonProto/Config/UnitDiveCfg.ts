import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface UnitDiveCfgJson extends $ProtoSchemaJsonBase {
    divedFuelConsumption?: number | null | undefined;
    isDivedByDefault?: boolean | null | undefined;
    canBeAttackedByUnitTypeArray: number[];
}

export class UnitDiveCfg extends $ProtoSchemaBase {
    private _divedFuelConsumption?: number | null | undefined;
    private _isDivedByDefault?: boolean | null | undefined;
    private _canBeAttackedByUnitTypeArray: number[] = [];

    public static fromJson(obj: UnitDiveCfgJson): UnitDiveCfg {
        return new UnitDiveCfg().loadJson(obj);
    }
    public override loadJson(obj: UnitDiveCfgJson): this {
        this.setDivedFuelConsumption(obj.divedFuelConsumption);
        this.setIsDivedByDefault(obj.isDivedByDefault);
        this.setCanBeAttackedByUnitTypeArray(obj.canBeAttackedByUnitTypeArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: UnitDiveCfgJson): UnitDiveCfgJson {
        obj ??= ({} as UnitDiveCfgJson);

        {
            const value = this.getDivedFuelConsumption();
            (value != null) && (obj.divedFuelConsumption = value);
        }

        {
            const value = this.getIsDivedByDefault();
            (value != null) && (obj.isDivedByDefault = value);
        }

        {
            obj.canBeAttackedByUnitTypeArray = this.getCanBeAttackedByUnitTypeArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getDivedFuelConsumption();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getIsDivedByDefault();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getCanBeAttackedByUnitTypeArray();
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UnitDiveCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UnitDiveCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setDivedFuelConsumption(reader.int32());
                    break;

                case 2:
                    msg.setIsDivedByDefault(reader.bool());
                    break;

                case 3:
                    {
                        const arr = msg._canBeAttackedByUnitTypeArray;
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

    public override clone(): UnitDiveCfg {
        return UnitDiveCfg.decode(this.encode());
    }

    public override getSchemaName(): "UnitDiveCfg" {
        return "UnitDiveCfg";
    }

    public checkHasDivedFuelConsumption(): boolean {
        return this._divedFuelConsumption != null;
    }
    public getDivedFuelConsumption(): number {
        return this._divedFuelConsumption ?? 0;
    }
    public setDivedFuelConsumption(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._divedFuelConsumption = null;
        } else {
            this._divedFuelConsumption = value;
        }
    }

    public checkHasIsDivedByDefault(): boolean {
        return this._isDivedByDefault != null;
    }
    public getIsDivedByDefault(): boolean {
        return this._isDivedByDefault ?? false;
    }
    public setIsDivedByDefault(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isDivedByDefault = null;
        } else {
            this._isDivedByDefault = value;
        }
    }

    public getCanBeAttackedByUnitTypeArray(): number[] {
        return this._canBeAttackedByUnitTypeArray;
    }
    public setCanBeAttackedByUnitTypeArray(value: number[]): void {
        this._canBeAttackedByUnitTypeArray = value;
    }
}
