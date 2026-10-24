import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetCustomBuildingStateExprJson extends $ProtoSchemaJsonBase {
    conTileFilter?: string | null | undefined;
    actDefenseAmount?: string | null | undefined;
    actDefenseUnitTypeArray?: string | null | undefined;
    actMaxCapturePoint?: string | null | undefined;
    actIsDefeatedOnCapture?: string | null | undefined;
    actRepairNormalizedHp?: string | null | undefined;
    actRepairUnitTypeArray?: string | null | undefined;
    actIncomePerTurn?: string | null | undefined;
    actVisionRange?: string | null | undefined;
    actIsVisionEnabledForAllPlayers?: string | null | undefined;
    actHideUnitTypeArray?: string | null | undefined;
    actProduceUnitTypeArray?: string | null | undefined;
    actGlobalAttackBonus?: string | null | undefined;
    actGlobalDefenseBonus?: string | null | undefined;
    actUnitTypeArrayForCoBoard?: string | null | undefined;
    actBlockEnemyUnitTypeArray?: string | null | undefined;
}

export class WeaSetCustomBuildingStateExpr extends $ProtoSchemaBase {
    private _conTileFilter?: string | null | undefined;
    private _actDefenseAmount?: string | null | undefined;
    private _actDefenseUnitTypeArray?: string | null | undefined;
    private _actMaxCapturePoint?: string | null | undefined;
    private _actIsDefeatedOnCapture?: string | null | undefined;
    private _actRepairNormalizedHp?: string | null | undefined;
    private _actRepairUnitTypeArray?: string | null | undefined;
    private _actIncomePerTurn?: string | null | undefined;
    private _actVisionRange?: string | null | undefined;
    private _actIsVisionEnabledForAllPlayers?: string | null | undefined;
    private _actHideUnitTypeArray?: string | null | undefined;
    private _actProduceUnitTypeArray?: string | null | undefined;
    private _actGlobalAttackBonus?: string | null | undefined;
    private _actGlobalDefenseBonus?: string | null | undefined;
    private _actUnitTypeArrayForCoBoard?: string | null | undefined;
    private _actBlockEnemyUnitTypeArray?: string | null | undefined;

    public static fromJson(obj: WeaSetCustomBuildingStateExprJson): WeaSetCustomBuildingStateExpr {
        return new WeaSetCustomBuildingStateExpr().loadJson(obj);
    }
    public override loadJson(obj: WeaSetCustomBuildingStateExprJson): this {
        this.setConTileFilter(obj.conTileFilter);
        this.setActDefenseAmount(obj.actDefenseAmount);
        this.setActDefenseUnitTypeArray(obj.actDefenseUnitTypeArray);
        this.setActMaxCapturePoint(obj.actMaxCapturePoint);
        this.setActIsDefeatedOnCapture(obj.actIsDefeatedOnCapture);
        this.setActRepairNormalizedHp(obj.actRepairNormalizedHp);
        this.setActRepairUnitTypeArray(obj.actRepairUnitTypeArray);
        this.setActIncomePerTurn(obj.actIncomePerTurn);
        this.setActVisionRange(obj.actVisionRange);
        this.setActIsVisionEnabledForAllPlayers(obj.actIsVisionEnabledForAllPlayers);
        this.setActHideUnitTypeArray(obj.actHideUnitTypeArray);
        this.setActProduceUnitTypeArray(obj.actProduceUnitTypeArray);
        this.setActGlobalAttackBonus(obj.actGlobalAttackBonus);
        this.setActGlobalDefenseBonus(obj.actGlobalDefenseBonus);
        this.setActUnitTypeArrayForCoBoard(obj.actUnitTypeArrayForCoBoard);
        this.setActBlockEnemyUnitTypeArray(obj.actBlockEnemyUnitTypeArray);
        return this;
    }
    public override toJson(obj?: WeaSetCustomBuildingStateExprJson): WeaSetCustomBuildingStateExprJson {
        obj ??= ({} as WeaSetCustomBuildingStateExprJson);

        {
            const value = this.getConTileFilter();
            (value != null) && (obj.conTileFilter = value);
        }

        {
            const value = this.getActDefenseAmount();
            (value != null) && (obj.actDefenseAmount = value);
        }

        {
            const value = this.getActDefenseUnitTypeArray();
            (value != null) && (obj.actDefenseUnitTypeArray = value);
        }

        {
            const value = this.getActMaxCapturePoint();
            (value != null) && (obj.actMaxCapturePoint = value);
        }

        {
            const value = this.getActIsDefeatedOnCapture();
            (value != null) && (obj.actIsDefeatedOnCapture = value);
        }

        {
            const value = this.getActRepairNormalizedHp();
            (value != null) && (obj.actRepairNormalizedHp = value);
        }

        {
            const value = this.getActRepairUnitTypeArray();
            (value != null) && (obj.actRepairUnitTypeArray = value);
        }

        {
            const value = this.getActIncomePerTurn();
            (value != null) && (obj.actIncomePerTurn = value);
        }

        {
            const value = this.getActVisionRange();
            (value != null) && (obj.actVisionRange = value);
        }

        {
            const value = this.getActIsVisionEnabledForAllPlayers();
            (value != null) && (obj.actIsVisionEnabledForAllPlayers = value);
        }

        {
            const value = this.getActHideUnitTypeArray();
            (value != null) && (obj.actHideUnitTypeArray = value);
        }

        {
            const value = this.getActProduceUnitTypeArray();
            (value != null) && (obj.actProduceUnitTypeArray = value);
        }

        {
            const value = this.getActGlobalAttackBonus();
            (value != null) && (obj.actGlobalAttackBonus = value);
        }

        {
            const value = this.getActGlobalDefenseBonus();
            (value != null) && (obj.actGlobalDefenseBonus = value);
        }

        {
            const value = this.getActUnitTypeArrayForCoBoard();
            (value != null) && (obj.actUnitTypeArrayForCoBoard = value);
        }

        {
            const value = this.getActBlockEnemyUnitTypeArray();
            (value != null) && (obj.actBlockEnemyUnitTypeArray = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConTileFilter();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getActDefenseAmount();
            if (value != null) {
                writer.uint32(90).string(value);
            }
        }

        {
            const value = this.getActDefenseUnitTypeArray();
            if (value != null) {
                writer.uint32(98).string(value);
            }
        }

        {
            const value = this.getActMaxCapturePoint();
            if (value != null) {
                writer.uint32(106).string(value);
            }
        }

        {
            const value = this.getActIsDefeatedOnCapture();
            if (value != null) {
                writer.uint32(114).string(value);
            }
        }

        {
            const value = this.getActRepairNormalizedHp();
            if (value != null) {
                writer.uint32(122).string(value);
            }
        }

        {
            const value = this.getActRepairUnitTypeArray();
            if (value != null) {
                writer.uint32(130).string(value);
            }
        }

        {
            const value = this.getActIncomePerTurn();
            if (value != null) {
                writer.uint32(138).string(value);
            }
        }

        {
            const value = this.getActVisionRange();
            if (value != null) {
                writer.uint32(146).string(value);
            }
        }

        {
            const value = this.getActIsVisionEnabledForAllPlayers();
            if (value != null) {
                writer.uint32(154).string(value);
            }
        }

        {
            const value = this.getActHideUnitTypeArray();
            if (value != null) {
                writer.uint32(162).string(value);
            }
        }

        {
            const value = this.getActProduceUnitTypeArray();
            if (value != null) {
                writer.uint32(170).string(value);
            }
        }

        {
            const value = this.getActGlobalAttackBonus();
            if (value != null) {
                writer.uint32(178).string(value);
            }
        }

        {
            const value = this.getActGlobalDefenseBonus();
            if (value != null) {
                writer.uint32(186).string(value);
            }
        }

        {
            const value = this.getActUnitTypeArrayForCoBoard();
            if (value != null) {
                writer.uint32(194).string(value);
            }
        }

        {
            const value = this.getActBlockEnemyUnitTypeArray();
            if (value != null) {
                writer.uint32(202).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetCustomBuildingStateExpr {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetCustomBuildingStateExpr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConTileFilter(reader.string());
                    break;

                case 11:
                    msg.setActDefenseAmount(reader.string());
                    break;

                case 12:
                    msg.setActDefenseUnitTypeArray(reader.string());
                    break;

                case 13:
                    msg.setActMaxCapturePoint(reader.string());
                    break;

                case 14:
                    msg.setActIsDefeatedOnCapture(reader.string());
                    break;

                case 15:
                    msg.setActRepairNormalizedHp(reader.string());
                    break;

                case 16:
                    msg.setActRepairUnitTypeArray(reader.string());
                    break;

                case 17:
                    msg.setActIncomePerTurn(reader.string());
                    break;

                case 18:
                    msg.setActVisionRange(reader.string());
                    break;

                case 19:
                    msg.setActIsVisionEnabledForAllPlayers(reader.string());
                    break;

                case 20:
                    msg.setActHideUnitTypeArray(reader.string());
                    break;

                case 21:
                    msg.setActProduceUnitTypeArray(reader.string());
                    break;

                case 22:
                    msg.setActGlobalAttackBonus(reader.string());
                    break;

                case 23:
                    msg.setActGlobalDefenseBonus(reader.string());
                    break;

                case 24:
                    msg.setActUnitTypeArrayForCoBoard(reader.string());
                    break;

                case 25:
                    msg.setActBlockEnemyUnitTypeArray(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetCustomBuildingStateExpr {
        return WeaSetCustomBuildingStateExpr.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetCustomBuildingStateExpr" {
        return "WeaSetCustomBuildingStateExpr";
    }

    public checkHasConTileFilter(): boolean {
        return this._conTileFilter != null;
    }
    public getConTileFilter(): string | null | undefined {
        return this._conTileFilter;
    }
    public setConTileFilter(value: string | null | undefined): void {
        this._conTileFilter = value;
    }

    public checkHasActDefenseAmount(): boolean {
        return this._actDefenseAmount != null;
    }
    public getActDefenseAmount(): string | null | undefined {
        return this._actDefenseAmount;
    }
    public setActDefenseAmount(value: string | null | undefined): void {
        this._actDefenseAmount = value;
    }

    public checkHasActDefenseUnitTypeArray(): boolean {
        return this._actDefenseUnitTypeArray != null;
    }
    public getActDefenseUnitTypeArray(): string | null | undefined {
        return this._actDefenseUnitTypeArray;
    }
    public setActDefenseUnitTypeArray(value: string | null | undefined): void {
        this._actDefenseUnitTypeArray = value;
    }

    public checkHasActMaxCapturePoint(): boolean {
        return this._actMaxCapturePoint != null;
    }
    public getActMaxCapturePoint(): string | null | undefined {
        return this._actMaxCapturePoint;
    }
    public setActMaxCapturePoint(value: string | null | undefined): void {
        this._actMaxCapturePoint = value;
    }

    public checkHasActIsDefeatedOnCapture(): boolean {
        return this._actIsDefeatedOnCapture != null;
    }
    public getActIsDefeatedOnCapture(): string | null | undefined {
        return this._actIsDefeatedOnCapture;
    }
    public setActIsDefeatedOnCapture(value: string | null | undefined): void {
        this._actIsDefeatedOnCapture = value;
    }

    public checkHasActRepairNormalizedHp(): boolean {
        return this._actRepairNormalizedHp != null;
    }
    public getActRepairNormalizedHp(): string | null | undefined {
        return this._actRepairNormalizedHp;
    }
    public setActRepairNormalizedHp(value: string | null | undefined): void {
        this._actRepairNormalizedHp = value;
    }

    public checkHasActRepairUnitTypeArray(): boolean {
        return this._actRepairUnitTypeArray != null;
    }
    public getActRepairUnitTypeArray(): string | null | undefined {
        return this._actRepairUnitTypeArray;
    }
    public setActRepairUnitTypeArray(value: string | null | undefined): void {
        this._actRepairUnitTypeArray = value;
    }

    public checkHasActIncomePerTurn(): boolean {
        return this._actIncomePerTurn != null;
    }
    public getActIncomePerTurn(): string | null | undefined {
        return this._actIncomePerTurn;
    }
    public setActIncomePerTurn(value: string | null | undefined): void {
        this._actIncomePerTurn = value;
    }

    public checkHasActVisionRange(): boolean {
        return this._actVisionRange != null;
    }
    public getActVisionRange(): string | null | undefined {
        return this._actVisionRange;
    }
    public setActVisionRange(value: string | null | undefined): void {
        this._actVisionRange = value;
    }

    public checkHasActIsVisionEnabledForAllPlayers(): boolean {
        return this._actIsVisionEnabledForAllPlayers != null;
    }
    public getActIsVisionEnabledForAllPlayers(): string | null | undefined {
        return this._actIsVisionEnabledForAllPlayers;
    }
    public setActIsVisionEnabledForAllPlayers(value: string | null | undefined): void {
        this._actIsVisionEnabledForAllPlayers = value;
    }

    public checkHasActHideUnitTypeArray(): boolean {
        return this._actHideUnitTypeArray != null;
    }
    public getActHideUnitTypeArray(): string | null | undefined {
        return this._actHideUnitTypeArray;
    }
    public setActHideUnitTypeArray(value: string | null | undefined): void {
        this._actHideUnitTypeArray = value;
    }

    public checkHasActProduceUnitTypeArray(): boolean {
        return this._actProduceUnitTypeArray != null;
    }
    public getActProduceUnitTypeArray(): string | null | undefined {
        return this._actProduceUnitTypeArray;
    }
    public setActProduceUnitTypeArray(value: string | null | undefined): void {
        this._actProduceUnitTypeArray = value;
    }

    public checkHasActGlobalAttackBonus(): boolean {
        return this._actGlobalAttackBonus != null;
    }
    public getActGlobalAttackBonus(): string | null | undefined {
        return this._actGlobalAttackBonus;
    }
    public setActGlobalAttackBonus(value: string | null | undefined): void {
        this._actGlobalAttackBonus = value;
    }

    public checkHasActGlobalDefenseBonus(): boolean {
        return this._actGlobalDefenseBonus != null;
    }
    public getActGlobalDefenseBonus(): string | null | undefined {
        return this._actGlobalDefenseBonus;
    }
    public setActGlobalDefenseBonus(value: string | null | undefined): void {
        this._actGlobalDefenseBonus = value;
    }

    public checkHasActUnitTypeArrayForCoBoard(): boolean {
        return this._actUnitTypeArrayForCoBoard != null;
    }
    public getActUnitTypeArrayForCoBoard(): string | null | undefined {
        return this._actUnitTypeArrayForCoBoard;
    }
    public setActUnitTypeArrayForCoBoard(value: string | null | undefined): void {
        this._actUnitTypeArrayForCoBoard = value;
    }

    public checkHasActBlockEnemyUnitTypeArray(): boolean {
        return this._actBlockEnemyUnitTypeArray != null;
    }
    public getActBlockEnemyUnitTypeArray(): string | null | undefined {
        return this._actBlockEnemyUnitTypeArray;
    }
    public setActBlockEnemyUnitTypeArray(value: string | null | undefined): void {
        this._actBlockEnemyUnitTypeArray = value;
    }
}
