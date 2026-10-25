import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface TileTemplateCfgJson extends $ProtoSchemaJsonBase {
    tileTypeId?: number | null | undefined;
    defenseAmount?: number | null | undefined;
    defenseUnitCategoryId?: number | null | undefined;
    maxBuildPoint?: number | null | undefined;
    maxCapturePoint?: number | null | undefined;
    isDefeatedOnCapture?: boolean | null | undefined;
    isAlwaysShowOwner?: boolean | null | undefined;
    repairAmount?: number | null | undefined;
    repairUnitCategoryId?: number | null | undefined;
    incomePerTurn?: number | null | undefined;
    visionRange?: number | null | undefined;
    isVisionEnabledForAllPlayers?: boolean | null | undefined;
    hideUnitCategoryId?: number | null | undefined;
    tileObjectTypeIdAfterOwnerChanged?: number | null | undefined;
    produceUnitCategoryId?: number | null | undefined;
    globalAttackBonus?: number | null | undefined;
    globalDefenseBonus?: number | null | undefined;
    maxHp?: number | null | undefined;
    armorTypeId?: number | null | undefined;
    isAffectedByLuck?: boolean | null | undefined;
    destroyConnectedTypeIdWhenDestroyed?: number | null | undefined;
    coBoardUnitCategoryId?: number | null | undefined;
    blockEnemyUnitCategoryId?: number | null | undefined;
    mapWeaponTypeId?: number | null | undefined;
    nameTextId?: number | null | undefined;
    canConnectRoad?: boolean | null | undefined;
    sortWeight?: number | null | undefined;
    sortWeightForTileChart?: number | null | undefined;
    sortWeightForDamageChart?: number | null | undefined;
    sortWeightForMapInfo?: number | null | undefined;
    toTileBaseTypeId?: number | null | undefined;
    toTileObjectTypeId?: number | null | undefined;
    aiScoreForCapture?: number | null | undefined;
    aiScoreForStay: number[];
    isCustomizableBuilding?: boolean | null | undefined;
    launchSiloParams: number[];
}

export class TileTemplateCfg extends $ProtoSchemaBase {
    private _tileTypeId?: number | null | undefined;
    private _defenseAmount?: number | null | undefined;
    private _defenseUnitCategoryId?: number | null | undefined;
    private _maxBuildPoint?: number | null | undefined;
    private _maxCapturePoint?: number | null | undefined;
    private _isDefeatedOnCapture?: boolean | null | undefined;
    private _isAlwaysShowOwner?: boolean | null | undefined;
    private _repairAmount?: number | null | undefined;
    private _repairUnitCategoryId?: number | null | undefined;
    private _incomePerTurn?: number | null | undefined;
    private _visionRange?: number | null | undefined;
    private _isVisionEnabledForAllPlayers?: boolean | null | undefined;
    private _hideUnitCategoryId?: number | null | undefined;
    private _tileObjectTypeIdAfterOwnerChanged?: number | null | undefined;
    private _produceUnitCategoryId?: number | null | undefined;
    private _globalAttackBonus?: number | null | undefined;
    private _globalDefenseBonus?: number | null | undefined;
    private _maxHp?: number | null | undefined;
    private _armorTypeId?: number | null | undefined;
    private _isAffectedByLuck?: boolean | null | undefined;
    private _destroyConnectedTypeIdWhenDestroyed?: number | null | undefined;
    private _coBoardUnitCategoryId?: number | null | undefined;
    private _blockEnemyUnitCategoryId?: number | null | undefined;
    private _mapWeaponTypeId?: number | null | undefined;
    private _nameTextId?: number | null | undefined;
    private _canConnectRoad?: boolean | null | undefined;
    private _sortWeight?: number | null | undefined;
    private _sortWeightForTileChart?: number | null | undefined;
    private _sortWeightForDamageChart?: number | null | undefined;
    private _sortWeightForMapInfo?: number | null | undefined;
    private _toTileBaseTypeId?: number | null | undefined;
    private _toTileObjectTypeId?: number | null | undefined;
    private _aiScoreForCapture?: number | null | undefined;
    private _aiScoreForStay: number[] = [];
    private _isCustomizableBuilding?: boolean | null | undefined;
    private _launchSiloParams: number[] = [];

    public static fromJson(obj: TileTemplateCfgJson): TileTemplateCfg {
        return new TileTemplateCfg().loadJson(obj);
    }
    public override loadJson(obj: TileTemplateCfgJson): this {
        this.setTileTypeId(obj.tileTypeId);
        this.setDefenseAmount(obj.defenseAmount);
        this.setDefenseUnitCategoryId(obj.defenseUnitCategoryId);
        this.setMaxBuildPoint(obj.maxBuildPoint);
        this.setMaxCapturePoint(obj.maxCapturePoint);
        this.setIsDefeatedOnCapture(obj.isDefeatedOnCapture);
        this.setIsAlwaysShowOwner(obj.isAlwaysShowOwner);
        this.setRepairAmount(obj.repairAmount);
        this.setRepairUnitCategoryId(obj.repairUnitCategoryId);
        this.setIncomePerTurn(obj.incomePerTurn);
        this.setVisionRange(obj.visionRange);
        this.setIsVisionEnabledForAllPlayers(obj.isVisionEnabledForAllPlayers);
        this.setHideUnitCategoryId(obj.hideUnitCategoryId);
        this.setTileObjectTypeIdAfterOwnerChanged(obj.tileObjectTypeIdAfterOwnerChanged);
        this.setProduceUnitCategoryId(obj.produceUnitCategoryId);
        this.setGlobalAttackBonus(obj.globalAttackBonus);
        this.setGlobalDefenseBonus(obj.globalDefenseBonus);
        this.setMaxHp(obj.maxHp);
        this.setArmorTypeId(obj.armorTypeId);
        this.setIsAffectedByLuck(obj.isAffectedByLuck);
        this.setDestroyConnectedTypeIdWhenDestroyed(obj.destroyConnectedTypeIdWhenDestroyed);
        this.setCoBoardUnitCategoryId(obj.coBoardUnitCategoryId);
        this.setBlockEnemyUnitCategoryId(obj.blockEnemyUnitCategoryId);
        this.setMapWeaponTypeId(obj.mapWeaponTypeId);
        this.setNameTextId(obj.nameTextId);
        this.setCanConnectRoad(obj.canConnectRoad);
        this.setSortWeight(obj.sortWeight);
        this.setSortWeightForTileChart(obj.sortWeightForTileChart);
        this.setSortWeightForDamageChart(obj.sortWeightForDamageChart);
        this.setSortWeightForMapInfo(obj.sortWeightForMapInfo);
        this.setToTileBaseTypeId(obj.toTileBaseTypeId);
        this.setToTileObjectTypeId(obj.toTileObjectTypeId);
        this.setAiScoreForCapture(obj.aiScoreForCapture);
        this.setAiScoreForStay(obj.aiScoreForStay?.concat() ?? []);
        this.setIsCustomizableBuilding(obj.isCustomizableBuilding);
        this.setLaunchSiloParams(obj.launchSiloParams?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: TileTemplateCfgJson): TileTemplateCfgJson {
        obj ??= ({} as TileTemplateCfgJson);

        {
            const value = this.getTileTypeId();
            (value != null) && (obj.tileTypeId = value);
        }

        {
            const value = this.getDefenseAmount();
            (value != null) && (obj.defenseAmount = value);
        }

        {
            const value = this.getDefenseUnitCategoryId();
            (value != null) && (obj.defenseUnitCategoryId = value);
        }

        {
            const value = this.getMaxBuildPoint();
            (value != null) && (obj.maxBuildPoint = value);
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
            const value = this.getIsAlwaysShowOwner();
            (value != null) && (obj.isAlwaysShowOwner = value);
        }

        {
            const value = this.getRepairAmount();
            (value != null) && (obj.repairAmount = value);
        }

        {
            const value = this.getRepairUnitCategoryId();
            (value != null) && (obj.repairUnitCategoryId = value);
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
            const value = this.getHideUnitCategoryId();
            (value != null) && (obj.hideUnitCategoryId = value);
        }

        {
            const value = this.getTileObjectTypeIdAfterOwnerChanged();
            (value != null) && (obj.tileObjectTypeIdAfterOwnerChanged = value);
        }

        {
            const value = this.getProduceUnitCategoryId();
            (value != null) && (obj.produceUnitCategoryId = value);
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
            const value = this.getMaxHp();
            (value != null) && (obj.maxHp = value);
        }

        {
            const value = this.getArmorTypeId();
            (value != null) && (obj.armorTypeId = value);
        }

        {
            const value = this.getIsAffectedByLuck();
            (value != null) && (obj.isAffectedByLuck = value);
        }

        {
            const value = this.getDestroyConnectedTypeIdWhenDestroyed();
            (value != null) && (obj.destroyConnectedTypeIdWhenDestroyed = value);
        }

        {
            const value = this.getCoBoardUnitCategoryId();
            (value != null) && (obj.coBoardUnitCategoryId = value);
        }

        {
            const value = this.getBlockEnemyUnitCategoryId();
            (value != null) && (obj.blockEnemyUnitCategoryId = value);
        }

        {
            const value = this.getMapWeaponTypeId();
            (value != null) && (obj.mapWeaponTypeId = value);
        }

        {
            const value = this.getNameTextId();
            (value != null) && (obj.nameTextId = value);
        }

        {
            const value = this.getCanConnectRoad();
            (value != null) && (obj.canConnectRoad = value);
        }

        {
            const value = this.getSortWeight();
            (value != null) && (obj.sortWeight = value);
        }

        {
            const value = this.getSortWeightForTileChart();
            (value != null) && (obj.sortWeightForTileChart = value);
        }

        {
            const value = this.getSortWeightForDamageChart();
            (value != null) && (obj.sortWeightForDamageChart = value);
        }

        {
            const value = this.getSortWeightForMapInfo();
            (value != null) && (obj.sortWeightForMapInfo = value);
        }

        {
            const value = this.getToTileBaseTypeId();
            (value != null) && (obj.toTileBaseTypeId = value);
        }

        {
            const value = this.getToTileObjectTypeId();
            (value != null) && (obj.toTileObjectTypeId = value);
        }

        {
            const value = this.getAiScoreForCapture();
            (value != null) && (obj.aiScoreForCapture = value);
        }

        {
            obj.aiScoreForStay = this.getAiScoreForStay().concat();
        }

        {
            const value = this.getIsCustomizableBuilding();
            (value != null) && (obj.isCustomizableBuilding = value);
        }

        {
            obj.launchSiloParams = this.getLaunchSiloParams().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTileTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getDefenseAmount();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getDefenseUnitCategoryId();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getMaxBuildPoint();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getMaxCapturePoint();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getIsDefeatedOnCapture();
            if ((value != null) && (value != false)) {
                writer.uint32(48).bool(value);
            }
        }

        {
            const value = this.getIsAlwaysShowOwner();
            if ((value != null) && (value != false)) {
                writer.uint32(56).bool(value);
            }
        }

        {
            const value = this.getRepairAmount();
            if (value != null) {
                writer.uint32(64).int32(value);
            }
        }

        {
            const value = this.getRepairUnitCategoryId();
            if (value != null) {
                writer.uint32(72).int32(value);
            }
        }

        {
            const value = this.getIncomePerTurn();
            if ((value != null) && (value != 0)) {
                writer.uint32(80).int32(value);
            }
        }

        {
            const value = this.getVisionRange();
            if ((value != null) && (value != 0)) {
                writer.uint32(88).int32(value);
            }
        }

        {
            const value = this.getIsVisionEnabledForAllPlayers();
            if ((value != null) && (value != false)) {
                writer.uint32(96).bool(value);
            }
        }

        {
            const value = this.getHideUnitCategoryId();
            if (value != null) {
                writer.uint32(104).int32(value);
            }
        }

        {
            const value = this.getTileObjectTypeIdAfterOwnerChanged();
            if (value != null) {
                writer.uint32(112).int32(value);
            }
        }

        {
            const value = this.getProduceUnitCategoryId();
            if (value != null) {
                writer.uint32(120).int32(value);
            }
        }

        {
            const value = this.getGlobalAttackBonus();
            if ((value != null) && (value != 0)) {
                writer.uint32(128).int32(value);
            }
        }

        {
            const value = this.getGlobalDefenseBonus();
            if ((value != null) && (value != 0)) {
                writer.uint32(136).int32(value);
            }
        }

        {
            const value = this.getMaxHp();
            if (value != null) {
                writer.uint32(144).int32(value);
            }
        }

        {
            const value = this.getArmorTypeId();
            if (value != null) {
                writer.uint32(152).int32(value);
            }
        }

        {
            const value = this.getIsAffectedByLuck();
            if ((value != null) && (value != false)) {
                writer.uint32(160).bool(value);
            }
        }

        {
            const value = this.getDestroyConnectedTypeIdWhenDestroyed();
            if (value != null) {
                writer.uint32(168).int32(value);
            }
        }

        {
            const value = this.getCoBoardUnitCategoryId();
            if (value != null) {
                writer.uint32(176).int32(value);
            }
        }

        {
            const value = this.getBlockEnemyUnitCategoryId();
            if (value != null) {
                writer.uint32(184).int32(value);
            }
        }

        {
            const value = this.getMapWeaponTypeId();
            if (value != null) {
                writer.uint32(192).int32(value);
            }
        }

        {
            const value = this.getNameTextId();
            if ((value != null) && (value != 0)) {
                writer.uint32(200).int32(value);
            }
        }

        {
            const value = this.getCanConnectRoad();
            if ((value != null) && (value != false)) {
                writer.uint32(208).bool(value);
            }
        }

        {
            const value = this.getSortWeight();
            if ((value != null) && (value != 0)) {
                writer.uint32(216).int32(value);
            }
        }

        {
            const value = this.getSortWeightForTileChart();
            if (value != null) {
                writer.uint32(224).int32(value);
            }
        }

        {
            const value = this.getSortWeightForDamageChart();
            if (value != null) {
                writer.uint32(232).int32(value);
            }
        }

        {
            const value = this.getSortWeightForMapInfo();
            if (value != null) {
                writer.uint32(240).int32(value);
            }
        }

        {
            const value = this.getToTileBaseTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(248).int32(value);
            }
        }

        {
            const value = this.getToTileObjectTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(256).int32(value);
            }
        }

        {
            const value = this.getAiScoreForCapture();
            if ((value != null) && (value != 0)) {
                writer.uint32(264).int32(value);
            }
        }

        {
            const value = this.getAiScoreForStay();
            const length = value.length;
            if (length) {
                writer.uint32(274).fork();
                for (let i = 0; i < length; ++i) {
                    writer.sint32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getIsCustomizableBuilding();
            if ((value != null) && (value != false)) {
                writer.uint32(280).bool(value);
            }
        }

        {
            const value = this.getLaunchSiloParams();
            const length = value.length;
            if (length) {
                writer.uint32(290).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): TileTemplateCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new TileTemplateCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTileTypeId(reader.int32());
                    break;

                case 2:
                    msg.setDefenseAmount(reader.int32());
                    break;

                case 3:
                    msg.setDefenseUnitCategoryId(reader.int32());
                    break;

                case 4:
                    msg.setMaxBuildPoint(reader.int32());
                    break;

                case 5:
                    msg.setMaxCapturePoint(reader.int32());
                    break;

                case 6:
                    msg.setIsDefeatedOnCapture(reader.bool());
                    break;

                case 7:
                    msg.setIsAlwaysShowOwner(reader.bool());
                    break;

                case 8:
                    msg.setRepairAmount(reader.int32());
                    break;

                case 9:
                    msg.setRepairUnitCategoryId(reader.int32());
                    break;

                case 10:
                    msg.setIncomePerTurn(reader.int32());
                    break;

                case 11:
                    msg.setVisionRange(reader.int32());
                    break;

                case 12:
                    msg.setIsVisionEnabledForAllPlayers(reader.bool());
                    break;

                case 13:
                    msg.setHideUnitCategoryId(reader.int32());
                    break;

                case 14:
                    msg.setTileObjectTypeIdAfterOwnerChanged(reader.int32());
                    break;

                case 15:
                    msg.setProduceUnitCategoryId(reader.int32());
                    break;

                case 16:
                    msg.setGlobalAttackBonus(reader.int32());
                    break;

                case 17:
                    msg.setGlobalDefenseBonus(reader.int32());
                    break;

                case 18:
                    msg.setMaxHp(reader.int32());
                    break;

                case 19:
                    msg.setArmorTypeId(reader.int32());
                    break;

                case 20:
                    msg.setIsAffectedByLuck(reader.bool());
                    break;

                case 21:
                    msg.setDestroyConnectedTypeIdWhenDestroyed(reader.int32());
                    break;

                case 22:
                    msg.setCoBoardUnitCategoryId(reader.int32());
                    break;

                case 23:
                    msg.setBlockEnemyUnitCategoryId(reader.int32());
                    break;

                case 24:
                    msg.setMapWeaponTypeId(reader.int32());
                    break;

                case 25:
                    msg.setNameTextId(reader.int32());
                    break;

                case 26:
                    msg.setCanConnectRoad(reader.bool());
                    break;

                case 27:
                    msg.setSortWeight(reader.int32());
                    break;

                case 28:
                    msg.setSortWeightForTileChart(reader.int32());
                    break;

                case 29:
                    msg.setSortWeightForDamageChart(reader.int32());
                    break;

                case 30:
                    msg.setSortWeightForMapInfo(reader.int32());
                    break;

                case 31:
                    msg.setToTileBaseTypeId(reader.int32());
                    break;

                case 32:
                    msg.setToTileObjectTypeId(reader.int32());
                    break;

                case 33:
                    msg.setAiScoreForCapture(reader.int32());
                    break;

                case 34:
                    {
                        const arr = msg._aiScoreForStay;
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

                case 35:
                    msg.setIsCustomizableBuilding(reader.bool());
                    break;

                case 36:
                    {
                        const arr = msg._launchSiloParams;
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

    public override clone(): TileTemplateCfg {
        return TileTemplateCfg.decode(this.encode());
    }

    public override getSchemaName(): "TileTemplateCfg" {
        return "TileTemplateCfg";
    }

    public checkHasTileTypeId(): boolean {
        return this._tileTypeId != null;
    }
    public getTileTypeId(): number {
        return this._tileTypeId ?? 0;
    }
    public setTileTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._tileTypeId = null;
        } else {
            this._tileTypeId = value;
        }
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

    public checkHasDefenseUnitCategoryId(): boolean {
        return this._defenseUnitCategoryId != null;
    }
    public getDefenseUnitCategoryId(): number {
        return this._defenseUnitCategoryId ?? 0;
    }
    public setDefenseUnitCategoryId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._defenseUnitCategoryId = null;
        } else {
            this._defenseUnitCategoryId = value;
        }
    }

    public checkHasMaxBuildPoint(): boolean {
        return this._maxBuildPoint != null;
    }
    public getMaxBuildPoint(): number | null | undefined {
        return this._maxBuildPoint;
    }
    public setMaxBuildPoint(value: number | null | undefined): void {
        this._maxBuildPoint = value;
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

    public checkHasIsAlwaysShowOwner(): boolean {
        return this._isAlwaysShowOwner != null;
    }
    public getIsAlwaysShowOwner(): boolean {
        return this._isAlwaysShowOwner ?? false;
    }
    public setIsAlwaysShowOwner(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isAlwaysShowOwner = null;
        } else {
            this._isAlwaysShowOwner = value;
        }
    }

    public checkHasRepairAmount(): boolean {
        return this._repairAmount != null;
    }
    public getRepairAmount(): number | null | undefined {
        return this._repairAmount;
    }
    public setRepairAmount(value: number | null | undefined): void {
        this._repairAmount = value;
    }

    public checkHasRepairUnitCategoryId(): boolean {
        return this._repairUnitCategoryId != null;
    }
    public getRepairUnitCategoryId(): number | null | undefined {
        return this._repairUnitCategoryId;
    }
    public setRepairUnitCategoryId(value: number | null | undefined): void {
        this._repairUnitCategoryId = value;
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

    public checkHasHideUnitCategoryId(): boolean {
        return this._hideUnitCategoryId != null;
    }
    public getHideUnitCategoryId(): number | null | undefined {
        return this._hideUnitCategoryId;
    }
    public setHideUnitCategoryId(value: number | null | undefined): void {
        this._hideUnitCategoryId = value;
    }

    public checkHasTileObjectTypeIdAfterOwnerChanged(): boolean {
        return this._tileObjectTypeIdAfterOwnerChanged != null;
    }
    public getTileObjectTypeIdAfterOwnerChanged(): number | null | undefined {
        return this._tileObjectTypeIdAfterOwnerChanged;
    }
    public setTileObjectTypeIdAfterOwnerChanged(value: number | null | undefined): void {
        this._tileObjectTypeIdAfterOwnerChanged = value;
    }

    public checkHasProduceUnitCategoryId(): boolean {
        return this._produceUnitCategoryId != null;
    }
    public getProduceUnitCategoryId(): number | null | undefined {
        return this._produceUnitCategoryId;
    }
    public setProduceUnitCategoryId(value: number | null | undefined): void {
        this._produceUnitCategoryId = value;
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

    public checkHasMaxHp(): boolean {
        return this._maxHp != null;
    }
    public getMaxHp(): number | null | undefined {
        return this._maxHp;
    }
    public setMaxHp(value: number | null | undefined): void {
        this._maxHp = value;
    }

    public checkHasArmorTypeId(): boolean {
        return this._armorTypeId != null;
    }
    public getArmorTypeId(): number | null | undefined {
        return this._armorTypeId;
    }
    public setArmorTypeId(value: number | null | undefined): void {
        this._armorTypeId = value;
    }

    public checkHasIsAffectedByLuck(): boolean {
        return this._isAffectedByLuck != null;
    }
    public getIsAffectedByLuck(): boolean {
        return this._isAffectedByLuck ?? false;
    }
    public setIsAffectedByLuck(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isAffectedByLuck = null;
        } else {
            this._isAffectedByLuck = value;
        }
    }

    public checkHasDestroyConnectedTypeIdWhenDestroyed(): boolean {
        return this._destroyConnectedTypeIdWhenDestroyed != null;
    }
    public getDestroyConnectedTypeIdWhenDestroyed(): number | null | undefined {
        return this._destroyConnectedTypeIdWhenDestroyed;
    }
    public setDestroyConnectedTypeIdWhenDestroyed(value: number | null | undefined): void {
        this._destroyConnectedTypeIdWhenDestroyed = value;
    }

    public checkHasCoBoardUnitCategoryId(): boolean {
        return this._coBoardUnitCategoryId != null;
    }
    public getCoBoardUnitCategoryId(): number | null | undefined {
        return this._coBoardUnitCategoryId;
    }
    public setCoBoardUnitCategoryId(value: number | null | undefined): void {
        this._coBoardUnitCategoryId = value;
    }

    public checkHasBlockEnemyUnitCategoryId(): boolean {
        return this._blockEnemyUnitCategoryId != null;
    }
    public getBlockEnemyUnitCategoryId(): number | null | undefined {
        return this._blockEnemyUnitCategoryId;
    }
    public setBlockEnemyUnitCategoryId(value: number | null | undefined): void {
        this._blockEnemyUnitCategoryId = value;
    }

    public checkHasMapWeaponTypeId(): boolean {
        return this._mapWeaponTypeId != null;
    }
    public getMapWeaponTypeId(): number | null | undefined {
        return this._mapWeaponTypeId;
    }
    public setMapWeaponTypeId(value: number | null | undefined): void {
        this._mapWeaponTypeId = value;
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

    public checkHasCanConnectRoad(): boolean {
        return this._canConnectRoad != null;
    }
    public getCanConnectRoad(): boolean {
        return this._canConnectRoad ?? false;
    }
    public setCanConnectRoad(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canConnectRoad = null;
        } else {
            this._canConnectRoad = value;
        }
    }

    public checkHasSortWeight(): boolean {
        return this._sortWeight != null;
    }
    public getSortWeight(): number {
        return this._sortWeight ?? 0;
    }
    public setSortWeight(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._sortWeight = null;
        } else {
            this._sortWeight = value;
        }
    }

    public checkHasSortWeightForTileChart(): boolean {
        return this._sortWeightForTileChart != null;
    }
    public getSortWeightForTileChart(): number | null | undefined {
        return this._sortWeightForTileChart;
    }
    public setSortWeightForTileChart(value: number | null | undefined): void {
        this._sortWeightForTileChart = value;
    }

    public checkHasSortWeightForDamageChart(): boolean {
        return this._sortWeightForDamageChart != null;
    }
    public getSortWeightForDamageChart(): number | null | undefined {
        return this._sortWeightForDamageChart;
    }
    public setSortWeightForDamageChart(value: number | null | undefined): void {
        this._sortWeightForDamageChart = value;
    }

    public checkHasSortWeightForMapInfo(): boolean {
        return this._sortWeightForMapInfo != null;
    }
    public getSortWeightForMapInfo(): number | null | undefined {
        return this._sortWeightForMapInfo;
    }
    public setSortWeightForMapInfo(value: number | null | undefined): void {
        this._sortWeightForMapInfo = value;
    }

    public checkHasToTileBaseTypeId(): boolean {
        return this._toTileBaseTypeId != null;
    }
    public getToTileBaseTypeId(): number {
        return this._toTileBaseTypeId ?? 0;
    }
    public setToTileBaseTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._toTileBaseTypeId = null;
        } else {
            this._toTileBaseTypeId = value;
        }
    }

    public checkHasToTileObjectTypeId(): boolean {
        return this._toTileObjectTypeId != null;
    }
    public getToTileObjectTypeId(): number {
        return this._toTileObjectTypeId ?? 0;
    }
    public setToTileObjectTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._toTileObjectTypeId = null;
        } else {
            this._toTileObjectTypeId = value;
        }
    }

    public checkHasAiScoreForCapture(): boolean {
        return this._aiScoreForCapture != null;
    }
    public getAiScoreForCapture(): number {
        return this._aiScoreForCapture ?? 0;
    }
    public setAiScoreForCapture(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._aiScoreForCapture = null;
        } else {
            this._aiScoreForCapture = value;
        }
    }

    public getAiScoreForStay(): number[] {
        return this._aiScoreForStay;
    }
    public setAiScoreForStay(value: number[]): void {
        this._aiScoreForStay = value;
    }

    public checkHasIsCustomizableBuilding(): boolean {
        return this._isCustomizableBuilding != null;
    }
    public getIsCustomizableBuilding(): boolean {
        return this._isCustomizableBuilding ?? false;
    }
    public setIsCustomizableBuilding(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isCustomizableBuilding = null;
        } else {
            this._isCustomizableBuilding = value;
        }
    }

    public getLaunchSiloParams(): number[] {
        return this._launchSiloParams;
    }
    public setLaunchSiloParams(value: number[]): void {
        this._launchSiloParams = value;
    }
}
