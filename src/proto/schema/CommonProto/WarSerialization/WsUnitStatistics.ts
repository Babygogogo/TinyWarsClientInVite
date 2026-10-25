import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WsUnitStatisticsJson extends $ProtoSchemaJsonBase {
    unitType?: number | null | undefined;
    dstPlayerIndex?: number | null | undefined;
    groupedObserverTeamIndexes?: number | null | undefined;
    unitGain?: number | null | undefined;
    unitLoss?: number | null | undefined;
    normalizedHpGain?: number | null | undefined;
    normalizedHpLoss?: number | null | undefined;
}

export class WsUnitStatistics extends $ProtoSchemaBase {
    private _unitType?: number | null | undefined;
    private _dstPlayerIndex?: number | null | undefined;
    private _groupedObserverTeamIndexes?: number | null | undefined;
    private _unitGain?: number | null | undefined;
    private _unitLoss?: number | null | undefined;
    private _normalizedHpGain?: number | null | undefined;
    private _normalizedHpLoss?: number | null | undefined;

    public static fromJson(obj: WsUnitStatisticsJson): WsUnitStatistics {
        return new WsUnitStatistics().loadJson(obj);
    }
    public override loadJson(obj: WsUnitStatisticsJson): this {
        this.setUnitType(obj.unitType);
        this.setDstPlayerIndex(obj.dstPlayerIndex);
        this.setGroupedObserverTeamIndexes(obj.groupedObserverTeamIndexes);
        this.setUnitGain(obj.unitGain);
        this.setUnitLoss(obj.unitLoss);
        this.setNormalizedHpGain(obj.normalizedHpGain);
        this.setNormalizedHpLoss(obj.normalizedHpLoss);
        return this;
    }
    public override toJson(obj?: WsUnitStatisticsJson): WsUnitStatisticsJson {
        obj ??= ({} as WsUnitStatisticsJson);

        {
            const value = this.getUnitType();
            (value != null) && (obj.unitType = value);
        }

        {
            const value = this.getDstPlayerIndex();
            (value != null) && (obj.dstPlayerIndex = value);
        }

        {
            const value = this.getGroupedObserverTeamIndexes();
            (value != null) && (obj.groupedObserverTeamIndexes = value);
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
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getDstPlayerIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getGroupedObserverTeamIndexes();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).uint32(value);
            }
        }

        {
            const value = this.getUnitGain();
            if ((value != null) && (value != 0)) {
                writer.uint32(48).uint32(value);
            }
        }

        {
            const value = this.getUnitLoss();
            if ((value != null) && (value != 0)) {
                writer.uint32(56).uint32(value);
            }
        }

        {
            const value = this.getNormalizedHpGain();
            if ((value != null) && (value != 0)) {
                writer.uint32(64).uint32(value);
            }
        }

        {
            const value = this.getNormalizedHpLoss();
            if ((value != null) && (value != 0)) {
                writer.uint32(72).uint32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WsUnitStatistics {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WsUnitStatistics();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUnitType(reader.int32());
                    break;

                case 4:
                    msg.setDstPlayerIndex(reader.int32());
                    break;

                case 5:
                    msg.setGroupedObserverTeamIndexes(reader.uint32());
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

    public override clone(): WsUnitStatistics {
        return WsUnitStatistics.decode(this.encode());
    }

    public override getSchemaName(): "WsUnitStatistics" {
        return "WsUnitStatistics";
    }

    public checkHasUnitType(): boolean {
        return this._unitType != null;
    }
    public getUnitType(): number {
        return this._unitType ?? 0;
    }
    public setUnitType(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitType = null;
        } else {
            this._unitType = value;
        }
    }

    public checkHasDstPlayerIndex(): boolean {
        return this._dstPlayerIndex != null;
    }
    public getDstPlayerIndex(): number {
        return this._dstPlayerIndex ?? 0;
    }
    public setDstPlayerIndex(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._dstPlayerIndex = null;
        } else {
            this._dstPlayerIndex = value;
        }
    }

    public checkHasGroupedObserverTeamIndexes(): boolean {
        return this._groupedObserverTeamIndexes != null;
    }
    public getGroupedObserverTeamIndexes(): number {
        return this._groupedObserverTeamIndexes ?? 0;
    }
    public setGroupedObserverTeamIndexes(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._groupedObserverTeamIndexes = null;
        } else {
            this._groupedObserverTeamIndexes = value;
        }
    }

    public checkHasUnitGain(): boolean {
        return this._unitGain != null;
    }
    public getUnitGain(): number {
        return this._unitGain ?? 0;
    }
    public setUnitGain(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitGain = null;
        } else {
            this._unitGain = value;
        }
    }

    public checkHasUnitLoss(): boolean {
        return this._unitLoss != null;
    }
    public getUnitLoss(): number {
        return this._unitLoss ?? 0;
    }
    public setUnitLoss(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitLoss = null;
        } else {
            this._unitLoss = value;
        }
    }

    public checkHasNormalizedHpGain(): boolean {
        return this._normalizedHpGain != null;
    }
    public getNormalizedHpGain(): number {
        return this._normalizedHpGain ?? 0;
    }
    public setNormalizedHpGain(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._normalizedHpGain = null;
        } else {
            this._normalizedHpGain = value;
        }
    }

    public checkHasNormalizedHpLoss(): boolean {
        return this._normalizedHpLoss != null;
    }
    public getNormalizedHpLoss(): number {
        return this._normalizedHpLoss ?? 0;
    }
    public setNormalizedHpLoss(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._normalizedHpLoss = null;
        } else {
            this._normalizedHpLoss = value;
        }
    }
}
