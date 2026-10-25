import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface InfoJson extends $ProtoSchemaJsonBase {
    unitType?: number | null | undefined;
    playerIndex?: number | null | undefined;
    unitGain?: number | null | undefined;
    unitLoss?: number | null | undefined;
    normalizedHpGain?: number | null | undefined;
    normalizedHpLoss?: number | null | undefined;
}

export class Info extends $ProtoSchemaBase {
    private _unitType?: number | null | undefined;
    private _playerIndex?: number | null | undefined;
    private _unitGain?: number | null | undefined;
    private _unitLoss?: number | null | undefined;
    private _normalizedHpGain?: number | null | undefined;
    private _normalizedHpLoss?: number | null | undefined;

    public static fromJson(obj: InfoJson): Info {
        return new Info().loadJson(obj);
    }
    public override loadJson(obj: InfoJson): this {
        this.setUnitType(obj.unitType);
        this.setPlayerIndex(obj.playerIndex);
        this.setUnitGain(obj.unitGain);
        this.setUnitLoss(obj.unitLoss);
        this.setNormalizedHpGain(obj.normalizedHpGain);
        this.setNormalizedHpLoss(obj.normalizedHpLoss);
        return this;
    }
    public override toJson(obj?: InfoJson): InfoJson {
        obj ??= ({} as InfoJson);

        {
            const value = this.getUnitType();
            (value != null) && (obj.unitType = value);
        }

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }

        {
            const value = this.getUnitGain();
            (value != null) && (obj.unitGain = value);
        }

        {
            const value = this.getUnitLoss();
            (value != null) && (obj.unitLoss = value);
        }

        {
            const value = this.getNormalizedHpGain();
            (value != null) && (obj.normalizedHpGain = value);
        }

        {
            const value = this.getNormalizedHpLoss();
            (value != null) && (obj.normalizedHpLoss = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUnitType();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getPlayerIndex();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getUnitGain();
            if (value != null) {
                writer.uint32(48).uint32(value);
            }
        }

        {
            const value = this.getUnitLoss();
            if (value != null) {
                writer.uint32(56).uint32(value);
            }
        }

        {
            const value = this.getNormalizedHpGain();
            if (value != null) {
                writer.uint32(64).uint32(value);
            }
        }

        {
            const value = this.getNormalizedHpLoss();
            if (value != null) {
                writer.uint32(72).uint32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Info {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Info();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUnitType(reader.int32());
                    break;

                case 4:
                    msg.setPlayerIndex(reader.int32());
                    break;

                case 6:
                    msg.setUnitGain(reader.uint32());
                    break;

                case 7:
                    msg.setUnitLoss(reader.uint32());
                    break;

                case 8:
                    msg.setNormalizedHpGain(reader.uint32());
                    break;

                case 9:
                    msg.setNormalizedHpLoss(reader.uint32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): Info {
        return Info.decode(this.encode());
    }

    public override getSchemaName(): "Info" {
        return "Info";
    }

    public checkHasUnitType(): boolean {
        return this._unitType != null;
    }
    public getUnitType(): number | null | undefined {
        return this._unitType;
    }
    public setUnitType(value: number | null | undefined): void {
        this._unitType = value;
    }

    public checkHasPlayerIndex(): boolean {
        return this._playerIndex != null;
    }
    public getPlayerIndex(): number | null | undefined {
        return this._playerIndex;
    }
    public setPlayerIndex(value: number | null | undefined): void {
        this._playerIndex = value;
    }

    public checkHasUnitGain(): boolean {
        return this._unitGain != null;
    }
    public getUnitGain(): number | null | undefined {
        return this._unitGain;
    }
    public setUnitGain(value: number | null | undefined): void {
        this._unitGain = value;
    }

    public checkHasUnitLoss(): boolean {
        return this._unitLoss != null;
    }
    public getUnitLoss(): number | null | undefined {
        return this._unitLoss;
    }
    public setUnitLoss(value: number | null | undefined): void {
        this._unitLoss = value;
    }

    public checkHasNormalizedHpGain(): boolean {
        return this._normalizedHpGain != null;
    }
    public getNormalizedHpGain(): number | null | undefined {
        return this._normalizedHpGain;
    }
    public setNormalizedHpGain(value: number | null | undefined): void {
        this._normalizedHpGain = value;
    }

    public checkHasNormalizedHpLoss(): boolean {
        return this._normalizedHpLoss != null;
    }
    public getNormalizedHpLoss(): number | null | undefined {
        return this._normalizedHpLoss;
    }
    public setNormalizedHpLoss(value: number | null | undefined): void {
        this._normalizedHpLoss = value;
    }
}
