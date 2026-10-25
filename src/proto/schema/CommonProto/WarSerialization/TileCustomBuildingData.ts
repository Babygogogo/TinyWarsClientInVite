import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface TileCustomBuildingDataJson extends $ProtoSchemaJsonBase {
    defenseAmount?: number | null | undefined;
    defenseUnitTypeArray: number[];
    maxCapturePoint?: number | null | undefined;
    isDefeatedOnCapture?: boolean | null | undefined;
    repairNormalizedHp?: number | null | undefined;
    repairUnitTypeArray: number[];
    incomePerTurn?: number | null | undefined;
    visionRange?: number | null | undefined;
    isVisionEnabledForAllPlayers?: boolean | null | undefined;
    hideUnitTypeArray: number[];
    produceUnitTypeArray: number[];
    globalAttackBonus?: number | null | undefined;
    globalDefenseBonus?: number | null | undefined;
    unitTypeArrayForCoBoard: number[];
    blockEnemyUnitTypeArray: number[];
}

export class TileCustomBuildingData extends $ProtoSchemaBase {
    private _defenseAmount?: number | null | undefined;
    private _defenseUnitTypeArray: number[] = [];
    private _maxCapturePoint?: number | null | undefined;
    private _isDefeatedOnCapture?: boolean | null | undefined;
    private _repairNormalizedHp?: number | null | undefined;
    private _repairUnitTypeArray: number[] = [];
    private _incomePerTurn?: number | null | undefined;
    private _visionRange?: number | null | undefined;
    private _isVisionEnabledForAllPlayers?: boolean | null | undefined;
    private _hideUnitTypeArray: number[] = [];
    private _produceUnitTypeArray: number[] = [];
    private _globalAttackBonus?: number | null | undefined;
    private _globalDefenseBonus?: number | null | undefined;
    private _unitTypeArrayForCoBoard: number[] = [];
    private _blockEnemyUnitTypeArray: number[] = [];

    public static fromJson(obj: TileCustomBuildingDataJson): TileCustomBuildingData {
        return new TileCustomBuildingData().loadJson(obj);
    }
    public override loadJson(obj: TileCustomBuildingDataJson): this {
        this.setDefenseAmount(obj.defenseAmount);
        this.setDefenseUnitTypeArray(obj.defenseUnitTypeArray?.concat() ?? []);
        this.setMaxCapturePoint(obj.maxCapturePoint);
        this.setIsDefeatedOnCapture(obj.isDefeatedOnCapture);
        this.setRepairNormalizedHp(obj.repairNormalizedHp);
        this.setRepairUnitTypeArray(obj.repairUnitTypeArray?.concat() ?? []);
        this.setIncomePerTurn(obj.incomePerTurn);
        this.setVisionRange(obj.visionRange);
        this.setIsVisionEnabledForAllPlayers(obj.isVisionEnabledForAllPlayers);
        this.setHideUnitTypeArray(obj.hideUnitTypeArray?.concat() ?? []);
        this.setProduceUnitTypeArray(obj.produceUnitTypeArray?.concat() ?? []);
        this.setGlobalAttackBonus(obj.globalAttackBonus);
        this.setGlobalDefenseBonus(obj.globalDefenseBonus);
        this.setUnitTypeArrayForCoBoard(obj.unitTypeArrayForCoBoard?.concat() ?? []);
        this.setBlockEnemyUnitTypeArray(obj.blockEnemyUnitTypeArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: TileCustomBuildingDataJson): TileCustomBuildingDataJson {
        obj ??= ({} as TileCustomBuildingDataJson);

        {
            const value = this.getDefenseAmount();
            (value != null) && (obj.defenseAmount = value);
        }

        {
            obj.defenseUnitTypeArray = this.getDefenseUnitTypeArray().concat();
        }

        {
            const value = this.getMaxCapturePoint();
            (value != null) && (obj.maxCapturePoint = value);
        }

        {
            const value = this.getIsDefeatedOnCapture();
            (value != null) && (obj.isDefeatedOnCapture = value);
        }

        {
            const value = this.getRepairNormalizedHp();
            (value != null) && (obj.repairNormalizedHp = value);
        }

        {
            obj.repairUnitTypeArray = this.getRepairUnitTypeArray().concat();
        }

        {
            const value = this.getIncomePerTurn();
            (value != null) && (obj.incomePerTurn = value);
        }

        {
            const value = this.getVisionRange();
            (value != null) && (obj.visionRange = value);
        }

        {
            const value = this.getIsVisionEnabledForAllPlayers();
            (value != null) && (obj.isVisionEnabledForAllPlayers = value);
        }

        {
            obj.hideUnitTypeArray = this.getHideUnitTypeArray().concat();
        }

        {
            obj.produceUnitTypeArray = this.getProduceUnitTypeArray().concat();
        }

        {
            const value = this.getGlobalAttackBonus();
            (value != null) && (obj.globalAttackBonus = value);
        }

        {
            const value = this.getGlobalDefenseBonus();
            (value != null) && (obj.globalDefenseBonus = value);
        }

        {
            obj.unitTypeArrayForCoBoard = this.getUnitTypeArrayForCoBoard().concat();
        }

        {
            obj.blockEnemyUnitTypeArray = this.getBlockEnemyUnitTypeArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getDefenseAmount();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getDefenseUnitTypeArray();
            const length = value.length;
            if (length) {
                writer.uint32(18).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getMaxCapturePoint();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getIsDefeatedOnCapture();
            if ((value != null) && (value != false)) {
                writer.uint32(32).bool(value);
            }
        }

        {
            const value = this.getRepairNormalizedHp();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getRepairUnitTypeArray();
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
            const value = this.getIncomePerTurn();
            if ((value != null) && (value != 0)) {
                writer.uint32(56).int32(value);
            }
        }

        {
            const value = this.getVisionRange();
            if ((value != null) && (value != 0)) {
                writer.uint32(64).int32(value);
            }
        }

        {
            const value = this.getIsVisionEnabledForAllPlayers();
            if ((value != null) && (value != false)) {
                writer.uint32(72).bool(value);
            }
        }

        {
            const value = this.getHideUnitTypeArray();
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
            const value = this.getProduceUnitTypeArray();
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
            const value = this.getGlobalAttackBonus();
            if ((value != null) && (value != 0)) {
                writer.uint32(96).int32(value);
            }
        }

        {
            const value = this.getGlobalDefenseBonus();
            if ((value != null) && (value != 0)) {
                writer.uint32(104).int32(value);
            }
        }

        {
            const value = this.getUnitTypeArrayForCoBoard();
            const length = value.length;
            if (length) {
                writer.uint32(114).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getBlockEnemyUnitTypeArray();
            const length = value.length;
            if (length) {
                writer.uint32(122).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): TileCustomBuildingData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new TileCustomBuildingData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setDefenseAmount(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._defenseUnitTypeArray;
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

                case 3:
                    msg.setMaxCapturePoint(reader.int32());
                    break;

                case 4:
                    msg.setIsDefeatedOnCapture(reader.bool());
                    break;

                case 5:
                    msg.setRepairNormalizedHp(reader.int32());
                    break;

                case 6:
                    {
                        const arr = msg._repairUnitTypeArray;
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
                    msg.setIncomePerTurn(reader.int32());
                    break;

                case 8:
                    msg.setVisionRange(reader.int32());
                    break;

                case 9:
                    msg.setIsVisionEnabledForAllPlayers(reader.bool());
                    break;

                case 10:
                    {
                        const arr = msg._hideUnitTypeArray;
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
                        const arr = msg._produceUnitTypeArray;
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
                    msg.setGlobalAttackBonus(reader.int32());
                    break;

                case 13:
                    msg.setGlobalDefenseBonus(reader.int32());
                    break;

                case 14:
                    {
                        const arr = msg._unitTypeArrayForCoBoard;
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

                case 15:
                    {
                        const arr = msg._blockEnemyUnitTypeArray;
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

    public override clone(): TileCustomBuildingData {
        return TileCustomBuildingData.decode(this.encode());
    }

    public override getSchemaName(): "TileCustomBuildingData" {
        return "TileCustomBuildingData";
    }

    public checkHasDefenseAmount(): boolean {
        return this._defenseAmount != null;
    }
    public getDefenseAmount(): number {
        return this._defenseAmount ?? 0;
    }
    public setDefenseAmount(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._defenseAmount = null;
        } else {
            this._defenseAmount = value;
        }
    }

    public getDefenseUnitTypeArray(): number[] {
        return this._defenseUnitTypeArray;
    }
    public setDefenseUnitTypeArray(value: number[]): void {
        this._defenseUnitTypeArray = value;
    }

    public checkHasMaxCapturePoint(): boolean {
        return this._maxCapturePoint != null;
    }
    public getMaxCapturePoint(): number | null | undefined {
        return this._maxCapturePoint;
    }
    public setMaxCapturePoint(value: number | null | undefined): void {
        this._maxCapturePoint = value;
    }

    public checkHasIsDefeatedOnCapture(): boolean {
        return this._isDefeatedOnCapture != null;
    }
    public getIsDefeatedOnCapture(): boolean {
        return this._isDefeatedOnCapture ?? false;
    }
    public setIsDefeatedOnCapture(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isDefeatedOnCapture = null;
        } else {
            this._isDefeatedOnCapture = value;
        }
    }

    public checkHasRepairNormalizedHp(): boolean {
        return this._repairNormalizedHp != null;
    }
    public getRepairNormalizedHp(): number | null | undefined {
        return this._repairNormalizedHp;
    }
    public setRepairNormalizedHp(value: number | null | undefined): void {
        this._repairNormalizedHp = value;
    }

    public getRepairUnitTypeArray(): number[] {
        return this._repairUnitTypeArray;
    }
    public setRepairUnitTypeArray(value: number[]): void {
        this._repairUnitTypeArray = value;
    }

    public checkHasIncomePerTurn(): boolean {
        return this._incomePerTurn != null;
    }
    public getIncomePerTurn(): number {
        return this._incomePerTurn ?? 0;
    }
    public setIncomePerTurn(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._incomePerTurn = null;
        } else {
            this._incomePerTurn = value;
        }
    }

    public checkHasVisionRange(): boolean {
        return this._visionRange != null;
    }
    public getVisionRange(): number {
        return this._visionRange ?? 0;
    }
    public setVisionRange(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._visionRange = null;
        } else {
            this._visionRange = value;
        }
    }

    public checkHasIsVisionEnabledForAllPlayers(): boolean {
        return this._isVisionEnabledForAllPlayers != null;
    }
    public getIsVisionEnabledForAllPlayers(): boolean {
        return this._isVisionEnabledForAllPlayers ?? false;
    }
    public setIsVisionEnabledForAllPlayers(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isVisionEnabledForAllPlayers = null;
        } else {
            this._isVisionEnabledForAllPlayers = value;
        }
    }

    public getHideUnitTypeArray(): number[] {
        return this._hideUnitTypeArray;
    }
    public setHideUnitTypeArray(value: number[]): void {
        this._hideUnitTypeArray = value;
    }

    public getProduceUnitTypeArray(): number[] {
        return this._produceUnitTypeArray;
    }
    public setProduceUnitTypeArray(value: number[]): void {
        this._produceUnitTypeArray = value;
    }

    public checkHasGlobalAttackBonus(): boolean {
        return this._globalAttackBonus != null;
    }
    public getGlobalAttackBonus(): number {
        return this._globalAttackBonus ?? 0;
    }
    public setGlobalAttackBonus(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._globalAttackBonus = null;
        } else {
            this._globalAttackBonus = value;
        }
    }

    public checkHasGlobalDefenseBonus(): boolean {
        return this._globalDefenseBonus != null;
    }
    public getGlobalDefenseBonus(): number {
        return this._globalDefenseBonus ?? 0;
    }
    public setGlobalDefenseBonus(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._globalDefenseBonus = null;
        } else {
            this._globalDefenseBonus = value;
        }
    }

    public getUnitTypeArrayForCoBoard(): number[] {
        return this._unitTypeArrayForCoBoard;
    }
    public setUnitTypeArrayForCoBoard(value: number[]): void {
        this._unitTypeArrayForCoBoard = value;
    }

    public getBlockEnemyUnitTypeArray(): number[] {
        return this._blockEnemyUnitTypeArray;
    }
    public setBlockEnemyUnitTypeArray(value: number[]): void {
        this._blockEnemyUnitTypeArray = value;
    }
}
