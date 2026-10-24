import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface UnitBuffJson extends $ProtoSchemaJsonBase {
    buffTypeId?: number | null | undefined;
    expiringTurnIndex?: number | null | undefined;
    expiringPlayerIndex?: number | null | undefined;
    extraParamArray: number[];
}

export class UnitBuff extends $ProtoSchemaBase {
    private _buffTypeId?: number | null | undefined;
    private _expiringTurnIndex?: number | null | undefined;
    private _expiringPlayerIndex?: number | null | undefined;
    private _extraParamArray: number[] = [];

    public static fromJson(obj: UnitBuffJson): UnitBuff {
        return new UnitBuff().loadJson(obj);
    }
    public override loadJson(obj: UnitBuffJson): this {
        this.setBuffTypeId(obj.buffTypeId);
        this.setExpiringTurnIndex(obj.expiringTurnIndex);
        this.setExpiringPlayerIndex(obj.expiringPlayerIndex);
        this.setExtraParamArray(obj.extraParamArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: UnitBuffJson): UnitBuffJson {
        obj ??= ({} as UnitBuffJson);

        {
            const value = this.getBuffTypeId();
            (value != null) && (obj.buffTypeId = value);
        }

        {
            const value = this.getExpiringTurnIndex();
            (value != null) && (obj.expiringTurnIndex = value);
        }

        {
            const value = this.getExpiringPlayerIndex();
            (value != null) && (obj.expiringPlayerIndex = value);
        }

        {
            obj.extraParamArray = this.getExtraParamArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getBuffTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getExpiringTurnIndex();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getExpiringPlayerIndex();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getExtraParamArray();
            const length = value.length;
            if (length) {
                writer.uint32(34).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UnitBuff {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UnitBuff();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setBuffTypeId(reader.int32());
                    break;

                case 2:
                    msg.setExpiringTurnIndex(reader.int32());
                    break;

                case 3:
                    msg.setExpiringPlayerIndex(reader.int32());
                    break;

                case 4:
                    {
                        const arr = msg._extraParamArray;
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

    public override clone(): UnitBuff {
        return UnitBuff.decode(this.encode());
    }

    public override getSchemaName(): "UnitBuff" {
        return "UnitBuff";
    }

    public checkHasBuffTypeId(): boolean {
        return this._buffTypeId != null;
    }
    public getBuffTypeId(): number {
        return this._buffTypeId ?? 0;
    }
    public setBuffTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._buffTypeId = null;
        } else {
            this._buffTypeId = value;
        }
    }

    public checkHasExpiringTurnIndex(): boolean {
        return this._expiringTurnIndex != null;
    }
    public getExpiringTurnIndex(): number | null | undefined {
        return this._expiringTurnIndex;
    }
    public setExpiringTurnIndex(value: number | null | undefined): void {
        this._expiringTurnIndex = value;
    }

    public checkHasExpiringPlayerIndex(): boolean {
        return this._expiringPlayerIndex != null;
    }
    public getExpiringPlayerIndex(): number | null | undefined {
        return this._expiringPlayerIndex;
    }
    public setExpiringPlayerIndex(value: number | null | undefined): void {
        this._expiringPlayerIndex = value;
    }

    public getExtraParamArray(): number[] {
        return this._extraParamArray;
    }
    public setExtraParamArray(value: number[]): void {
        this._extraParamArray = value;
    }
}
