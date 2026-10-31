import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { UnitAiProductionScoreCfg as $Message$CommonProto$Config$UnitAiProductionScoreCfg, type UnitAiProductionScoreCfgJson as $Json$CommonProto$Config$UnitAiProductionScoreCfg } from "./UnitAiProductionScoreCfg.js";
import { UnitDiveCfg as $Message$CommonProto$Config$UnitDiveCfg, type UnitDiveCfgJson as $Json$CommonProto$Config$UnitDiveCfg } from "./UnitDiveCfg.js";
import { UnitSelfDetonateCfg as $Message$CommonProto$Config$UnitSelfDetonateCfg, type UnitSelfDetonateCfgJson as $Json$CommonProto$Config$UnitSelfDetonateCfg } from "./UnitSelfDetonateCfg.js";

export interface UnitTemplateCfgJson extends $ProtoSchemaJsonBase {
    unitTypeId?: number | null | undefined;
    minAttackRange?: number | null | undefined;
    maxAttackRange?: number | null | undefined;
    canAttackAfterMove?: boolean | null | undefined;
    primaryWeaponMaxAmmo?: number | null | undefined;
    maxHp?: number | null | undefined;
    energyPerNormalizedHp?: number | null | undefined;
    armorTypeId?: number | null | undefined;
    isAffectedByLuck?: boolean | null | undefined;
    moveRange?: number | null | undefined;
    moveTypeId?: number | null | undefined;
    maxFuel?: number | null | undefined;
    fuelConsumptionPerTurn?: number | null | undefined;
    diveCfg?: $Json$CommonProto$Config$UnitDiveCfg | null | undefined;
    isDestroyedOnOutOfFuel?: boolean | null | undefined;
    maxLoadUnitsCount?: number | null | undefined;
    loadUnitCategoryId?: number | null | undefined;
    canLaunchLoadedUnits?: boolean | null | undefined;
    canDropLoadedUnits?: boolean | null | undefined;
    canSupplyLoadedUnits?: boolean | null | undefined;
    repairAmountForLoadedUnits?: number | null | undefined;
    loadableTileCategoryId?: number | null | undefined;
    canSupplyAdjacentUnits?: boolean | null | undefined;
    canRepairAdjacentTargetUnit?: boolean | null | undefined;
    canCrushAdjacentTargetUnit?: boolean | null | undefined;
    selfDetonateCfg?: $Json$CommonProto$Config$UnitSelfDetonateCfg | null | undefined;
    produceUnitTypeId?: number | null | undefined;
    maxProduceMaterial?: number | null | undefined;
    maxBuildMaterial?: number | null | undefined;
    canCaptureTile?: boolean | null | undefined;
    productionCost?: number | null | undefined;
    visionRange?: number | null | undefined;
    flareMaxAmmo?: number | null | undefined;
    flareMaxRange?: number | null | undefined;
    flareRadius?: number | null | undefined;
    nameTextId?: number | null | undefined;
    moveSfx?: number | null | undefined;
    layer?: number | null | undefined;
    aiProductionScore?: $Json$CommonProto$Config$UnitAiProductionScoreCfg | null | undefined;
}

export class UnitTemplateCfg extends $ProtoSchemaBase {
    private _unitTypeId?: number | null | undefined;
    private _minAttackRange?: number | null | undefined;
    private _maxAttackRange?: number | null | undefined;
    private _canAttackAfterMove?: boolean | null | undefined;
    private _primaryWeaponMaxAmmo?: number | null | undefined;
    private _maxHp?: number | null | undefined;
    private _energyPerNormalizedHp?: number | null | undefined;
    private _armorTypeId?: number | null | undefined;
    private _isAffectedByLuck?: boolean | null | undefined;
    private _moveRange?: number | null | undefined;
    private _moveTypeId?: number | null | undefined;
    private _maxFuel?: number | null | undefined;
    private _fuelConsumptionPerTurn?: number | null | undefined;
    private _diveCfg?: $Message$CommonProto$Config$UnitDiveCfg | null | undefined;
    private _isDestroyedOnOutOfFuel?: boolean | null | undefined;
    private _maxLoadUnitsCount?: number | null | undefined;
    private _loadUnitCategoryId?: number | null | undefined;
    private _canLaunchLoadedUnits?: boolean | null | undefined;
    private _canDropLoadedUnits?: boolean | null | undefined;
    private _canSupplyLoadedUnits?: boolean | null | undefined;
    private _repairAmountForLoadedUnits?: number | null | undefined;
    private _loadableTileCategoryId?: number | null | undefined;
    private _canSupplyAdjacentUnits?: boolean | null | undefined;
    private _canRepairAdjacentTargetUnit?: boolean | null | undefined;
    private _canCrushAdjacentTargetUnit?: boolean | null | undefined;
    private _selfDetonateCfg?: $Message$CommonProto$Config$UnitSelfDetonateCfg | null | undefined;
    private _produceUnitTypeId?: number | null | undefined;
    private _maxProduceMaterial?: number | null | undefined;
    private _maxBuildMaterial?: number | null | undefined;
    private _canCaptureTile?: boolean | null | undefined;
    private _productionCost?: number | null | undefined;
    private _visionRange?: number | null | undefined;
    private _flareMaxAmmo?: number | null | undefined;
    private _flareMaxRange?: number | null | undefined;
    private _flareRadius?: number | null | undefined;
    private _nameTextId?: number | null | undefined;
    private _moveSfx?: number | null | undefined;
    private _layer?: number | null | undefined;
    private _aiProductionScore?: $Message$CommonProto$Config$UnitAiProductionScoreCfg | null | undefined;

    public static fromJson(obj: UnitTemplateCfgJson): UnitTemplateCfg {
        return new UnitTemplateCfg().loadJson(obj);
    }
    public override loadJson(obj: UnitTemplateCfgJson): this {
        this.setUnitTypeId(obj.unitTypeId);
        this.setMinAttackRange(obj.minAttackRange);
        this.setMaxAttackRange(obj.maxAttackRange);
        this.setCanAttackAfterMove(obj.canAttackAfterMove);
        this.setPrimaryWeaponMaxAmmo(obj.primaryWeaponMaxAmmo);
        this.setMaxHp(obj.maxHp);
        this.setEnergyPerNormalizedHp(obj.energyPerNormalizedHp);
        this.setArmorTypeId(obj.armorTypeId);
        this.setIsAffectedByLuck(obj.isAffectedByLuck);
        this.setMoveRange(obj.moveRange);
        this.setMoveTypeId(obj.moveTypeId);
        this.setMaxFuel(obj.maxFuel);
        this.setFuelConsumptionPerTurn(obj.fuelConsumptionPerTurn);
        this.setDiveCfg(obj.diveCfg != null ? $Message$CommonProto$Config$UnitDiveCfg.fromJson(obj.diveCfg) : null);
        this.setIsDestroyedOnOutOfFuel(obj.isDestroyedOnOutOfFuel);
        this.setMaxLoadUnitsCount(obj.maxLoadUnitsCount);
        this.setLoadUnitCategoryId(obj.loadUnitCategoryId);
        this.setCanLaunchLoadedUnits(obj.canLaunchLoadedUnits);
        this.setCanDropLoadedUnits(obj.canDropLoadedUnits);
        this.setCanSupplyLoadedUnits(obj.canSupplyLoadedUnits);
        this.setRepairAmountForLoadedUnits(obj.repairAmountForLoadedUnits);
        this.setLoadableTileCategoryId(obj.loadableTileCategoryId);
        this.setCanSupplyAdjacentUnits(obj.canSupplyAdjacentUnits);
        this.setCanRepairAdjacentTargetUnit(obj.canRepairAdjacentTargetUnit);
        this.setCanCrushAdjacentTargetUnit(obj.canCrushAdjacentTargetUnit);
        this.setSelfDetonateCfg(obj.selfDetonateCfg != null ? $Message$CommonProto$Config$UnitSelfDetonateCfg.fromJson(obj.selfDetonateCfg) : null);
        this.setProduceUnitTypeId(obj.produceUnitTypeId);
        this.setMaxProduceMaterial(obj.maxProduceMaterial);
        this.setMaxBuildMaterial(obj.maxBuildMaterial);
        this.setCanCaptureTile(obj.canCaptureTile);
        this.setProductionCost(obj.productionCost);
        this.setVisionRange(obj.visionRange);
        this.setFlareMaxAmmo(obj.flareMaxAmmo);
        this.setFlareMaxRange(obj.flareMaxRange);
        this.setFlareRadius(obj.flareRadius);
        this.setNameTextId(obj.nameTextId);
        this.setMoveSfx(obj.moveSfx);
        this.setLayer(obj.layer);
        this.setAiProductionScore(obj.aiProductionScore != null ? $Message$CommonProto$Config$UnitAiProductionScoreCfg.fromJson(obj.aiProductionScore) : null);
        return this;
    }
    public override toJson(obj?: UnitTemplateCfgJson): UnitTemplateCfgJson {
        obj ??= ({} as UnitTemplateCfgJson);

        {
            const value = this.getUnitTypeId();
            (value != null) && (obj.unitTypeId = value);
        }

        {
            const value = this.getMinAttackRange();
            (value != null) && (obj.minAttackRange = value);
        }

        {
            const value = this.getMaxAttackRange();
            (value != null) && (obj.maxAttackRange = value);
        }

        {
            const value = this.getCanAttackAfterMove();
            (value != null) && (obj.canAttackAfterMove = value);
        }

        {
            const value = this.getPrimaryWeaponMaxAmmo();
            (value != null) && (obj.primaryWeaponMaxAmmo = value);
        }

        {
            const value = this.getMaxHp();
            (value != null) && (obj.maxHp = value);
        }

        {
            const value = this.getEnergyPerNormalizedHp();
            (value != null) && (obj.energyPerNormalizedHp = value);
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
            const value = this.getMoveRange();
            (value != null) && (obj.moveRange = value);
        }

        {
            const value = this.getMoveTypeId();
            (value != null) && (obj.moveTypeId = value);
        }

        {
            const value = this.getMaxFuel();
            (value != null) && (obj.maxFuel = value);
        }

        {
            const value = this.getFuelConsumptionPerTurn();
            (value != null) && (obj.fuelConsumptionPerTurn = value);
        }

        {
            const value = this.getDiveCfg();
            (value != null) && (obj.diveCfg = value.toJson());
        }

        {
            const value = this.getIsDestroyedOnOutOfFuel();
            (value != null) && (obj.isDestroyedOnOutOfFuel = value);
        }

        {
            const value = this.getMaxLoadUnitsCount();
            (value != null) && (obj.maxLoadUnitsCount = value);
        }

        {
            const value = this.getLoadUnitCategoryId();
            (value != null) && (obj.loadUnitCategoryId = value);
        }

        {
            const value = this.getCanLaunchLoadedUnits();
            (value != null) && (obj.canLaunchLoadedUnits = value);
        }

        {
            const value = this.getCanDropLoadedUnits();
            (value != null) && (obj.canDropLoadedUnits = value);
        }

        {
            const value = this.getCanSupplyLoadedUnits();
            (value != null) && (obj.canSupplyLoadedUnits = value);
        }

        {
            const value = this.getRepairAmountForLoadedUnits();
            (value != null) && (obj.repairAmountForLoadedUnits = value);
        }

        {
            const value = this.getLoadableTileCategoryId();
            (value != null) && (obj.loadableTileCategoryId = value);
        }

        {
            const value = this.getCanSupplyAdjacentUnits();
            (value != null) && (obj.canSupplyAdjacentUnits = value);
        }

        {
            const value = this.getCanRepairAdjacentTargetUnit();
            (value != null) && (obj.canRepairAdjacentTargetUnit = value);
        }

        {
            const value = this.getCanCrushAdjacentTargetUnit();
            (value != null) && (obj.canCrushAdjacentTargetUnit = value);
        }

        {
            const value = this.getSelfDetonateCfg();
            (value != null) && (obj.selfDetonateCfg = value.toJson());
        }

        {
            const value = this.getProduceUnitTypeId();
            (value != null) && (obj.produceUnitTypeId = value);
        }

        {
            const value = this.getMaxProduceMaterial();
            (value != null) && (obj.maxProduceMaterial = value);
        }

        {
            const value = this.getMaxBuildMaterial();
            (value != null) && (obj.maxBuildMaterial = value);
        }

        {
            const value = this.getCanCaptureTile();
            (value != null) && (obj.canCaptureTile = value);
        }

        {
            const value = this.getProductionCost();
            (value != null) && (obj.productionCost = value);
        }

        {
            const value = this.getVisionRange();
            (value != null) && (obj.visionRange = value);
        }

        {
            const value = this.getFlareMaxAmmo();
            (value != null) && (obj.flareMaxAmmo = value);
        }

        {
            const value = this.getFlareMaxRange();
            (value != null) && (obj.flareMaxRange = value);
        }

        {
            const value = this.getFlareRadius();
            (value != null) && (obj.flareRadius = value);
        }

        {
            const value = this.getNameTextId();
            (value != null) && (obj.nameTextId = value);
        }

        {
            const value = this.getMoveSfx();
            (value != null) && (obj.moveSfx = value);
        }

        {
            const value = this.getLayer();
            (value != null) && (obj.layer = value);
        }

        {
            const value = this.getAiProductionScore();
            (value != null) && (obj.aiProductionScore = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUnitTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getMinAttackRange();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getMaxAttackRange();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getCanAttackAfterMove();
            if ((value != null) && (value != false)) {
                writer.uint32(32).bool(value);
            }
        }

        {
            const value = this.getPrimaryWeaponMaxAmmo();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getMaxHp();
            if ((value != null) && (value != 0)) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getEnergyPerNormalizedHp();
            if ((value != null) && (value != 0)) {
                writer.uint32(56).int32(value);
            }
        }

        {
            const value = this.getArmorTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(64).int32(value);
            }
        }

        {
            const value = this.getIsAffectedByLuck();
            if ((value != null) && (value != false)) {
                writer.uint32(72).bool(value);
            }
        }

        {
            const value = this.getMoveRange();
            if ((value != null) && (value != 0)) {
                writer.uint32(80).int32(value);
            }
        }

        {
            const value = this.getMoveTypeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(88).int32(value);
            }
        }

        {
            const value = this.getMaxFuel();
            if ((value != null) && (value != 0)) {
                writer.uint32(96).int32(value);
            }
        }

        {
            const value = this.getFuelConsumptionPerTurn();
            if ((value != null) && (value != 0)) {
                writer.uint32(104).int32(value);
            }
        }

        {
            const value = this.getDiveCfg();
            if (value != null) {
                value.toWriter(writer.uint32(114).fork()).ldelim();
            }
        }

        {
            const value = this.getIsDestroyedOnOutOfFuel();
            if ((value != null) && (value != false)) {
                writer.uint32(120).bool(value);
            }
        }

        {
            const value = this.getMaxLoadUnitsCount();
            if (value != null) {
                writer.uint32(128).int32(value);
            }
        }

        {
            const value = this.getLoadUnitCategoryId();
            if (value != null) {
                writer.uint32(136).int32(value);
            }
        }

        {
            const value = this.getCanLaunchLoadedUnits();
            if ((value != null) && (value != false)) {
                writer.uint32(144).bool(value);
            }
        }

        {
            const value = this.getCanDropLoadedUnits();
            if ((value != null) && (value != false)) {
                writer.uint32(152).bool(value);
            }
        }

        {
            const value = this.getCanSupplyLoadedUnits();
            if ((value != null) && (value != false)) {
                writer.uint32(160).bool(value);
            }
        }

        {
            const value = this.getRepairAmountForLoadedUnits();
            if (value != null) {
                writer.uint32(168).int32(value);
            }
        }

        {
            const value = this.getLoadableTileCategoryId();
            if (value != null) {
                writer.uint32(176).int32(value);
            }
        }

        {
            const value = this.getCanSupplyAdjacentUnits();
            if ((value != null) && (value != false)) {
                writer.uint32(184).bool(value);
            }
        }

        {
            const value = this.getCanRepairAdjacentTargetUnit();
            if ((value != null) && (value != false)) {
                writer.uint32(192).bool(value);
            }
        }

        {
            const value = this.getCanCrushAdjacentTargetUnit();
            if ((value != null) && (value != false)) {
                writer.uint32(200).bool(value);
            }
        }

        {
            const value = this.getSelfDetonateCfg();
            if (value != null) {
                value.toWriter(writer.uint32(210).fork()).ldelim();
            }
        }

        {
            const value = this.getProduceUnitTypeId();
            if (value != null) {
                writer.uint32(216).int32(value);
            }
        }

        {
            const value = this.getMaxProduceMaterial();
            if (value != null) {
                writer.uint32(224).int32(value);
            }
        }

        {
            const value = this.getMaxBuildMaterial();
            if (value != null) {
                writer.uint32(232).int32(value);
            }
        }

        {
            const value = this.getCanCaptureTile();
            if ((value != null) && (value != false)) {
                writer.uint32(240).bool(value);
            }
        }

        {
            const value = this.getProductionCost();
            if ((value != null) && (value != 0)) {
                writer.uint32(248).int32(value);
            }
        }

        {
            const value = this.getVisionRange();
            if ((value != null) && (value != 0)) {
                writer.uint32(256).int32(value);
            }
        }

        {
            const value = this.getFlareMaxAmmo();
            if (value != null) {
                writer.uint32(264).int32(value);
            }
        }

        {
            const value = this.getFlareMaxRange();
            if (value != null) {
                writer.uint32(272).int32(value);
            }
        }

        {
            const value = this.getFlareRadius();
            if (value != null) {
                writer.uint32(280).int32(value);
            }
        }

        {
            const value = this.getNameTextId();
            if ((value != null) && (value != 0)) {
                writer.uint32(288).int32(value);
            }
        }

        {
            const value = this.getMoveSfx();
            if ((value != null) && (value != 0)) {
                writer.uint32(296).int32(value);
            }
        }

        {
            const value = this.getLayer();
            if ((value != null) && (value != 0)) {
                writer.uint32(304).int32(value);
            }
        }

        {
            const value = this.getAiProductionScore();
            if (value != null) {
                value.toWriter(writer.uint32(314).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UnitTemplateCfg {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UnitTemplateCfg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUnitTypeId(reader.int32());
                    break;

                case 2:
                    msg.setMinAttackRange(reader.int32());
                    break;

                case 3:
                    msg.setMaxAttackRange(reader.int32());
                    break;

                case 4:
                    msg.setCanAttackAfterMove(reader.bool());
                    break;

                case 5:
                    msg.setPrimaryWeaponMaxAmmo(reader.int32());
                    break;

                case 6:
                    msg.setMaxHp(reader.int32());
                    break;

                case 7:
                    msg.setEnergyPerNormalizedHp(reader.int32());
                    break;

                case 8:
                    msg.setArmorTypeId(reader.int32());
                    break;

                case 9:
                    msg.setIsAffectedByLuck(reader.bool());
                    break;

                case 10:
                    msg.setMoveRange(reader.int32());
                    break;

                case 11:
                    msg.setMoveTypeId(reader.int32());
                    break;

                case 12:
                    msg.setMaxFuel(reader.int32());
                    break;

                case 13:
                    msg.setFuelConsumptionPerTurn(reader.int32());
                    break;

                case 14:
                    msg.setDiveCfg($Message$CommonProto$Config$UnitDiveCfg.decode(reader, reader.uint32()));
                    break;

                case 15:
                    msg.setIsDestroyedOnOutOfFuel(reader.bool());
                    break;

                case 16:
                    msg.setMaxLoadUnitsCount(reader.int32());
                    break;

                case 17:
                    msg.setLoadUnitCategoryId(reader.int32());
                    break;

                case 18:
                    msg.setCanLaunchLoadedUnits(reader.bool());
                    break;

                case 19:
                    msg.setCanDropLoadedUnits(reader.bool());
                    break;

                case 20:
                    msg.setCanSupplyLoadedUnits(reader.bool());
                    break;

                case 21:
                    msg.setRepairAmountForLoadedUnits(reader.int32());
                    break;

                case 22:
                    msg.setLoadableTileCategoryId(reader.int32());
                    break;

                case 23:
                    msg.setCanSupplyAdjacentUnits(reader.bool());
                    break;

                case 24:
                    msg.setCanRepairAdjacentTargetUnit(reader.bool());
                    break;

                case 25:
                    msg.setCanCrushAdjacentTargetUnit(reader.bool());
                    break;

                case 26:
                    msg.setSelfDetonateCfg($Message$CommonProto$Config$UnitSelfDetonateCfg.decode(reader, reader.uint32()));
                    break;

                case 27:
                    msg.setProduceUnitTypeId(reader.int32());
                    break;

                case 28:
                    msg.setMaxProduceMaterial(reader.int32());
                    break;

                case 29:
                    msg.setMaxBuildMaterial(reader.int32());
                    break;

                case 30:
                    msg.setCanCaptureTile(reader.bool());
                    break;

                case 31:
                    msg.setProductionCost(reader.int32());
                    break;

                case 32:
                    msg.setVisionRange(reader.int32());
                    break;

                case 33:
                    msg.setFlareMaxAmmo(reader.int32());
                    break;

                case 34:
                    msg.setFlareMaxRange(reader.int32());
                    break;

                case 35:
                    msg.setFlareRadius(reader.int32());
                    break;

                case 36:
                    msg.setNameTextId(reader.int32());
                    break;

                case 37:
                    msg.setMoveSfx(reader.int32());
                    break;

                case 38:
                    msg.setLayer(reader.int32());
                    break;

                case 39:
                    msg.setAiProductionScore($Message$CommonProto$Config$UnitAiProductionScoreCfg.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UnitTemplateCfg {
        return UnitTemplateCfg.decode(this.encode());
    }

    public override getSchemaName(): "UnitTemplateCfg" {
        return "UnitTemplateCfg";
    }

    public checkHasUnitTypeId(): boolean {
        return this._unitTypeId != null;
    }
    public getUnitTypeId(): number {
        return this._unitTypeId ?? 0;
    }
    public setUnitTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitTypeId = null;
        } else {
            this._unitTypeId = value;
        }
    }

    public checkHasMinAttackRange(): boolean {
        return this._minAttackRange != null;
    }
    public getMinAttackRange(): number | null | undefined {
        return this._minAttackRange;
    }
    public setMinAttackRange(value: number | null | undefined): void {
        this._minAttackRange = value;
    }

    public checkHasMaxAttackRange(): boolean {
        return this._maxAttackRange != null;
    }
    public getMaxAttackRange(): number | null | undefined {
        return this._maxAttackRange;
    }
    public setMaxAttackRange(value: number | null | undefined): void {
        this._maxAttackRange = value;
    }

    public checkHasCanAttackAfterMove(): boolean {
        return this._canAttackAfterMove != null;
    }
    public getCanAttackAfterMove(): boolean {
        return this._canAttackAfterMove ?? false;
    }
    public setCanAttackAfterMove(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canAttackAfterMove = null;
        } else {
            this._canAttackAfterMove = value;
        }
    }

    public checkHasPrimaryWeaponMaxAmmo(): boolean {
        return this._primaryWeaponMaxAmmo != null;
    }
    public getPrimaryWeaponMaxAmmo(): number | null | undefined {
        return this._primaryWeaponMaxAmmo;
    }
    public setPrimaryWeaponMaxAmmo(value: number | null | undefined): void {
        this._primaryWeaponMaxAmmo = value;
    }

    public checkHasMaxHp(): boolean {
        return this._maxHp != null;
    }
    public getMaxHp(): number {
        return this._maxHp ?? 0;
    }
    public setMaxHp(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._maxHp = null;
        } else {
            this._maxHp = value;
        }
    }

    public checkHasEnergyPerNormalizedHp(): boolean {
        return this._energyPerNormalizedHp != null;
    }
    public getEnergyPerNormalizedHp(): number {
        return this._energyPerNormalizedHp ?? 0;
    }
    public setEnergyPerNormalizedHp(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._energyPerNormalizedHp = null;
        } else {
            this._energyPerNormalizedHp = value;
        }
    }

    public checkHasArmorTypeId(): boolean {
        return this._armorTypeId != null;
    }
    public getArmorTypeId(): number {
        return this._armorTypeId ?? 0;
    }
    public setArmorTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._armorTypeId = null;
        } else {
            this._armorTypeId = value;
        }
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

    public checkHasMoveRange(): boolean {
        return this._moveRange != null;
    }
    public getMoveRange(): number {
        return this._moveRange ?? 0;
    }
    public setMoveRange(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._moveRange = null;
        } else {
            this._moveRange = value;
        }
    }

    public checkHasMoveTypeId(): boolean {
        return this._moveTypeId != null;
    }
    public getMoveTypeId(): number {
        return this._moveTypeId ?? 0;
    }
    public setMoveTypeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._moveTypeId = null;
        } else {
            this._moveTypeId = value;
        }
    }

    public checkHasMaxFuel(): boolean {
        return this._maxFuel != null;
    }
    public getMaxFuel(): number {
        return this._maxFuel ?? 0;
    }
    public setMaxFuel(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._maxFuel = null;
        } else {
            this._maxFuel = value;
        }
    }

    public checkHasFuelConsumptionPerTurn(): boolean {
        return this._fuelConsumptionPerTurn != null;
    }
    public getFuelConsumptionPerTurn(): number {
        return this._fuelConsumptionPerTurn ?? 0;
    }
    public setFuelConsumptionPerTurn(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._fuelConsumptionPerTurn = null;
        } else {
            this._fuelConsumptionPerTurn = value;
        }
    }

    public checkHasDiveCfg(): boolean {
        return this._diveCfg != null;
    }
    public getDiveCfg(): $Message$CommonProto$Config$UnitDiveCfg | null | undefined {
        return this._diveCfg;
    }
    public setDiveCfg(value: $Message$CommonProto$Config$UnitDiveCfg | null | undefined): void {
        this._diveCfg = value;
    }
    public createIfNotExistsDiveCfg(): $Message$CommonProto$Config$UnitDiveCfg {
        return this._diveCfg ??= new $Message$CommonProto$Config$UnitDiveCfg();
    }

    public checkHasIsDestroyedOnOutOfFuel(): boolean {
        return this._isDestroyedOnOutOfFuel != null;
    }
    public getIsDestroyedOnOutOfFuel(): boolean {
        return this._isDestroyedOnOutOfFuel ?? false;
    }
    public setIsDestroyedOnOutOfFuel(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isDestroyedOnOutOfFuel = null;
        } else {
            this._isDestroyedOnOutOfFuel = value;
        }
    }

    public checkHasMaxLoadUnitsCount(): boolean {
        return this._maxLoadUnitsCount != null;
    }
    public getMaxLoadUnitsCount(): number | null | undefined {
        return this._maxLoadUnitsCount;
    }
    public setMaxLoadUnitsCount(value: number | null | undefined): void {
        this._maxLoadUnitsCount = value;
    }

    public checkHasLoadUnitCategoryId(): boolean {
        return this._loadUnitCategoryId != null;
    }
    public getLoadUnitCategoryId(): number | null | undefined {
        return this._loadUnitCategoryId;
    }
    public setLoadUnitCategoryId(value: number | null | undefined): void {
        this._loadUnitCategoryId = value;
    }

    public checkHasCanLaunchLoadedUnits(): boolean {
        return this._canLaunchLoadedUnits != null;
    }
    public getCanLaunchLoadedUnits(): boolean {
        return this._canLaunchLoadedUnits ?? false;
    }
    public setCanLaunchLoadedUnits(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canLaunchLoadedUnits = null;
        } else {
            this._canLaunchLoadedUnits = value;
        }
    }

    public checkHasCanDropLoadedUnits(): boolean {
        return this._canDropLoadedUnits != null;
    }
    public getCanDropLoadedUnits(): boolean {
        return this._canDropLoadedUnits ?? false;
    }
    public setCanDropLoadedUnits(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canDropLoadedUnits = null;
        } else {
            this._canDropLoadedUnits = value;
        }
    }

    public checkHasCanSupplyLoadedUnits(): boolean {
        return this._canSupplyLoadedUnits != null;
    }
    public getCanSupplyLoadedUnits(): boolean {
        return this._canSupplyLoadedUnits ?? false;
    }
    public setCanSupplyLoadedUnits(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canSupplyLoadedUnits = null;
        } else {
            this._canSupplyLoadedUnits = value;
        }
    }

    public checkHasRepairAmountForLoadedUnits(): boolean {
        return this._repairAmountForLoadedUnits != null;
    }
    public getRepairAmountForLoadedUnits(): number | null | undefined {
        return this._repairAmountForLoadedUnits;
    }
    public setRepairAmountForLoadedUnits(value: number | null | undefined): void {
        this._repairAmountForLoadedUnits = value;
    }

    public checkHasLoadableTileCategoryId(): boolean {
        return this._loadableTileCategoryId != null;
    }
    public getLoadableTileCategoryId(): number | null | undefined {
        return this._loadableTileCategoryId;
    }
    public setLoadableTileCategoryId(value: number | null | undefined): void {
        this._loadableTileCategoryId = value;
    }

    public checkHasCanSupplyAdjacentUnits(): boolean {
        return this._canSupplyAdjacentUnits != null;
    }
    public getCanSupplyAdjacentUnits(): boolean {
        return this._canSupplyAdjacentUnits ?? false;
    }
    public setCanSupplyAdjacentUnits(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canSupplyAdjacentUnits = null;
        } else {
            this._canSupplyAdjacentUnits = value;
        }
    }

    public checkHasCanRepairAdjacentTargetUnit(): boolean {
        return this._canRepairAdjacentTargetUnit != null;
    }
    public getCanRepairAdjacentTargetUnit(): boolean {
        return this._canRepairAdjacentTargetUnit ?? false;
    }
    public setCanRepairAdjacentTargetUnit(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canRepairAdjacentTargetUnit = null;
        } else {
            this._canRepairAdjacentTargetUnit = value;
        }
    }

    public checkHasCanCrushAdjacentTargetUnit(): boolean {
        return this._canCrushAdjacentTargetUnit != null;
    }
    public getCanCrushAdjacentTargetUnit(): boolean {
        return this._canCrushAdjacentTargetUnit ?? false;
    }
    public setCanCrushAdjacentTargetUnit(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canCrushAdjacentTargetUnit = null;
        } else {
            this._canCrushAdjacentTargetUnit = value;
        }
    }

    public checkHasSelfDetonateCfg(): boolean {
        return this._selfDetonateCfg != null;
    }
    public getSelfDetonateCfg(): $Message$CommonProto$Config$UnitSelfDetonateCfg | null | undefined {
        return this._selfDetonateCfg;
    }
    public setSelfDetonateCfg(value: $Message$CommonProto$Config$UnitSelfDetonateCfg | null | undefined): void {
        this._selfDetonateCfg = value;
    }
    public createIfNotExistsSelfDetonateCfg(): $Message$CommonProto$Config$UnitSelfDetonateCfg {
        return this._selfDetonateCfg ??= new $Message$CommonProto$Config$UnitSelfDetonateCfg();
    }

    public checkHasProduceUnitTypeId(): boolean {
        return this._produceUnitTypeId != null;
    }
    public getProduceUnitTypeId(): number | null | undefined {
        return this._produceUnitTypeId;
    }
    public setProduceUnitTypeId(value: number | null | undefined): void {
        this._produceUnitTypeId = value;
    }

    public checkHasMaxProduceMaterial(): boolean {
        return this._maxProduceMaterial != null;
    }
    public getMaxProduceMaterial(): number | null | undefined {
        return this._maxProduceMaterial;
    }
    public setMaxProduceMaterial(value: number | null | undefined): void {
        this._maxProduceMaterial = value;
    }

    public checkHasMaxBuildMaterial(): boolean {
        return this._maxBuildMaterial != null;
    }
    public getMaxBuildMaterial(): number | null | undefined {
        return this._maxBuildMaterial;
    }
    public setMaxBuildMaterial(value: number | null | undefined): void {
        this._maxBuildMaterial = value;
    }

    public checkHasCanCaptureTile(): boolean {
        return this._canCaptureTile != null;
    }
    public getCanCaptureTile(): boolean {
        return this._canCaptureTile ?? false;
    }
    public setCanCaptureTile(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canCaptureTile = null;
        } else {
            this._canCaptureTile = value;
        }
    }

    public checkHasProductionCost(): boolean {
        return this._productionCost != null;
    }
    public getProductionCost(): number {
        return this._productionCost ?? 0;
    }
    public setProductionCost(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._productionCost = null;
        } else {
            this._productionCost = value;
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

    public checkHasFlareMaxAmmo(): boolean {
        return this._flareMaxAmmo != null;
    }
    public getFlareMaxAmmo(): number | null | undefined {
        return this._flareMaxAmmo;
    }
    public setFlareMaxAmmo(value: number | null | undefined): void {
        this._flareMaxAmmo = value;
    }

    public checkHasFlareMaxRange(): boolean {
        return this._flareMaxRange != null;
    }
    public getFlareMaxRange(): number | null | undefined {
        return this._flareMaxRange;
    }
    public setFlareMaxRange(value: number | null | undefined): void {
        this._flareMaxRange = value;
    }

    public checkHasFlareRadius(): boolean {
        return this._flareRadius != null;
    }
    public getFlareRadius(): number | null | undefined {
        return this._flareRadius;
    }
    public setFlareRadius(value: number | null | undefined): void {
        this._flareRadius = value;
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

    public checkHasMoveSfx(): boolean {
        return this._moveSfx != null;
    }
    public getMoveSfx(): number {
        return this._moveSfx ?? 0;
    }
    public setMoveSfx(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._moveSfx = null;
        } else {
            this._moveSfx = value;
        }
    }

    public checkHasLayer(): boolean {
        return this._layer != null;
    }
    public getLayer(): number {
        return this._layer ?? 0;
    }
    public setLayer(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._layer = null;
        } else {
            this._layer = value;
        }
    }

    public checkHasAiProductionScore(): boolean {
        return this._aiProductionScore != null;
    }
    public getAiProductionScore(): $Message$CommonProto$Config$UnitAiProductionScoreCfg | null | undefined {
        return this._aiProductionScore;
    }
    public setAiProductionScore(value: $Message$CommonProto$Config$UnitAiProductionScoreCfg | null | undefined): void {
        this._aiProductionScore = value;
    }
    public createIfNotExistsAiProductionScore(): $Message$CommonProto$Config$UnitAiProductionScoreCfg {
        return this._aiProductionScore ??= new $Message$CommonProto$Config$UnitAiProductionScoreCfg();
    }
}
