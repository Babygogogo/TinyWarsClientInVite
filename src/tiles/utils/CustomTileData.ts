import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData from "../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationTileCustomCannonData from "../../proto/schema/CommonProto/WarSerialization/TileCustomCannonData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData from "../../proto/schema/CommonProto/WarSerialization/TileCustomCrystalData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData from "../../proto/schema/CommonProto/WarSerialization/TileCustomLaserTurretData.ts";
import * as TilesUtilsCustomLimits from "./CustomLimits.ts";

export namespace Building {
    
    type TileCustomBuildingData = ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData;

    export function checkIsValid(data: TileCustomBuildingData, config: GameConfigGcData.GcData): boolean {
        return Building.getErrorTip(data, config) == null;
    }
    export function getErrorTip(data: TileCustomBuildingData, config: GameConfigGcData.GcData): string | null {
        {
            // defenseAmount
            if (!TilesUtilsCustomLimits.Building.DefenseAmount.checkIsValid(data.getDefenseAmount())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0352));
            }
        }

        {
            // defenseUnitTypeArray
            if (!config.checkIsValidUnitTypeSubset(data.getDefenseUnitTypeArray())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.DefensibleUnits));
            }
        }

        {
            // maxCapturePoint
            if (!TilesUtilsCustomLimits.Building.MaxCapturePoint.checkIsValid(data.getMaxCapturePoint())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.MaxCapturePoint));
            }
        }

        {
            // isDefeatedOnCapture no need to check
        }

        {
            // repairAmount
            if (!TilesUtilsCustomLimits.Building.RepairNormalizedHp.checkIsValid(data.getRepairNormalizedHp())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.RepairHpAmount));
            }
        }

        {
            // repairUnitTypeArray
            if (!config.checkIsValidUnitTypeSubset(data.getRepairUnitTypeArray())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.RepairableUnits));
            }
        }

        {
            // incomePerTurn
            if (!TilesUtilsCustomLimits.Building.IncomePerTurn.checkIsValid(data.getIncomePerTurn())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0157));
            }
        }

        {
            // visionRange
            if (!TilesUtilsCustomLimits.Building.VisionRange.checkIsValid(data.getVisionRange())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.VisionRange));
            }
        }

        {
            // isVisionEnabledForAllPlayers no need to check
        }

        {
            // hideUnitTypeArray
            if (!config.checkIsValidUnitTypeSubset(data.getHideUnitTypeArray())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.HidableUnits));
            }
        }

        {
            // produceUnitTypeArray
            if (!config.checkIsValidUnitTypeSubset(data.getProduceUnitTypeArray())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.ProducibleUnits));
            }
        }

        {
            // globalAttackBonus
            if (!TilesUtilsCustomLimits.Building.GlobalAttackBonus.checkIsValid(data.getGlobalAttackBonus())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.GlobalAtkBonus));
            }
        }

        {
            // globalDefenseBonus
            if (!TilesUtilsCustomLimits.Building.GlobalDefenseBonus.checkIsValid(data.getGlobalDefenseBonus())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.GlobalDefBonus));
            }
        }

        {
            // unitTypeArrayForCoBoard
            if (!config.checkIsValidUnitTypeSubset(data.getUnitTypeArrayForCoBoard())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.CoBoardableUnit));
            }
        }

        {
            // blockEnemyUnitTypeArray
            if (!config.checkIsValidUnitTypeSubset(data.getBlockEnemyUnitTypeArray())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.BlockableEnemyUnits));
            }
        }

        return null;
    }
}

export namespace Cannon {
    
    type TileCustomCannonData   = ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData;

    export function checkIsValid(data: TileCustomCannonData): boolean {
        return Cannon.getErrorTip(data) == null;
    }
    export function getErrorTip(data: TileCustomCannonData): string | null {
        if (!TilesUtilsCustomLimits.Cannon.Priority.checkIsValid(data.getPriority())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Priority));
        }

        if (!TilesUtilsCustomLimits.Cannon.MaxTargetCount.checkIsValid(data.getMaxTargetCount())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.MaxTargets));
        }

        if (!TilesUtilsCustomLimits.Cannon.RangeForUp.checkIsValid(data.getRangeForUp())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.RangeUp));
        }

        if (!TilesUtilsCustomLimits.Cannon.RangeForDown.checkIsValid(data.getRangeForDown())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.RangeDown));
        }

        if (!TilesUtilsCustomLimits.Cannon.RangeForLeft.checkIsValid(data.getRangeForLeft())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.RangeLeft));
        }

        if (!TilesUtilsCustomLimits.Cannon.RangeForRight.checkIsValid(data.getRangeForRight())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.RangeRight));
        }

        if (!TilesUtilsCustomLimits.Cannon.OffsetHp.checkIsValid(data.getOffsetHp())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitsHpOffset));
        }

        {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const canBeFatal = data.getCanBeFatal();
        }

        if (!TilesUtilsCustomLimits.Cannon.OffsetFuelPercentage.checkIsValid(data.getOffsetFuelPercentage())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitsFuelOffset$));
        }

        if (!TilesUtilsCustomLimits.Cannon.OffsetPrimaryAmmoPercentage.checkIsValid(data.getOffsetPrimaryAmmoPercentage())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitsPriAmmoOffset$));
        }

        return null;
    }

    export function merge(dst: TileCustomCannonData, src: TileCustomCannonData): void {
        dst.setPriority(src.getPriority());
        dst.setCanAffectAlly(src.getCanAffectAlly());
        dst.setCanAffectEnemy(src.getCanAffectEnemy());
        dst.setCanAffectSelf(src.getCanAffectSelf());
        dst.setOffsetHp(src.getOffsetHp());
        dst.setCanBeFatal(src.getCanBeFatal());
        dst.setOffsetFuelPercentage(src.getOffsetFuelPercentage());
        dst.setOffsetPrimaryAmmoPercentage(src.getOffsetPrimaryAmmoPercentage());
        dst.setMaxTargetCount(src.getMaxTargetCount());
        dst.setRangeForDown(src.getRangeForDown());
        dst.setRangeForUp(src.getRangeForUp());
        dst.setRangeForLeft(src.getRangeForLeft());
        dst.setRangeForRight(src.getRangeForRight());
    }
}

export namespace Crystal {
    
    type TileCustomCrystalData  = ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData;

    export function checkIsValid(data: TileCustomCrystalData): boolean {
        return Crystal.getErrorTip(data) == null;
    }
    export function getErrorTip(data: TileCustomCrystalData): string | null {
        if (!TilesUtilsCustomLimits.Crystal.Priority.checkIsValid(data.getPriority())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Priority));
        }

        if (!TilesUtilsCustomLimits.Crystal.Radius.checkIsValid(data.getRadius())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.EffectiveRadius));
        }

        if (!TilesUtilsCustomLimits.Crystal.OffsetFund.checkIsValid(data.getOffsetFund())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.FundOffset));
        }

        if (!TilesUtilsCustomLimits.Crystal.OffsetEnergyPercentage.checkIsValid(data.getOffsetEnergyPercentage())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.CoEnergyOffset$));
        }

        if (!TilesUtilsCustomLimits.Crystal.OffsetHp.checkIsValid(data.getOffsetHp())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitsHpOffset));
        }

        {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const canBeFatal = data.getCanBeFatal();
        }

        if (!TilesUtilsCustomLimits.Crystal.OffsetFuelPercentage.checkIsValid(data.getOffsetFuelPercentage())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitsFuelOffset$));
        }

        if (!TilesUtilsCustomLimits.Crystal.OffsetPrimaryAmmoPercentage.checkIsValid(data.getOffsetPrimaryAmmoPercentage())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitsPriAmmoOffset$));
        }

        return null;
    }

    export function merge(dst: TileCustomCrystalData, src: TileCustomCrystalData): void {
        dst.setPriority(src.getPriority());
        dst.setCanAffectAlly(src.getCanAffectAlly());
        dst.setCanAffectEnemy(src.getCanAffectEnemy());
        dst.setCanAffectSelf(src.getCanAffectSelf());
        dst.setOffsetFund(src.getOffsetFund());
        dst.setOffsetEnergyPercentage(src.getOffsetEnergyPercentage());
        dst.setOffsetHp(src.getOffsetHp());
        dst.setCanBeFatal(src.getCanBeFatal());
        dst.setOffsetFuelPercentage(src.getOffsetFuelPercentage());
        dst.setOffsetPrimaryAmmoPercentage(src.getOffsetPrimaryAmmoPercentage());
        dst.setRadius(src.getRadius());
    }
}

export namespace LaserTurret {
    
    type TileCustomLaserTurretData  = ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData;

    export function checkIsValid(data: TileCustomLaserTurretData): boolean {
        return LaserTurret.getErrorTip(data) == null;
    }
    export function getErrorTip(data: TileCustomLaserTurretData): string | null {
        if (!TilesUtilsCustomLimits.LaserTurret.Priority.checkIsValid(data.getPriority())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Priority));
        }

        if (!TilesUtilsCustomLimits.LaserTurret.RangeForDown.checkIsValid(data.getRangeForDown())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.RangeDown));
        }

        if (!TilesUtilsCustomLimits.LaserTurret.RangeForUp.checkIsValid(data.getRangeForUp())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.RangeUp));
        }

        if (!TilesUtilsCustomLimits.LaserTurret.RangeForLeft.checkIsValid(data.getRangeForLeft())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.RangeLeft));
        }

        if (!TilesUtilsCustomLimits.LaserTurret.RangeForRight.checkIsValid(data.getRangeForRight())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.RangeRight));
        }

        if (!TilesUtilsCustomLimits.LaserTurret.OffsetHp.checkIsValid(data.getOffsetHp())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitsHpOffset));
        }

        if (!TilesUtilsCustomLimits.LaserTurret.OffsetFuelPercentage.checkIsValid(data.getOffsetFuelPercentage())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitsFuelOffset$));
        }

        if (!TilesUtilsCustomLimits.LaserTurret.OffsetPrimaryAmmoPercentage.checkIsValid(data.getOffsetPrimaryAmmoPercentage())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitsPriAmmoOffset$));
        }

        {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const canBeFatal = data.getCanBeFatal();
        }

        return null;
    }

    export function merge(dst: TileCustomLaserTurretData, src: TileCustomLaserTurretData): void {
        dst.setPriority(src.getPriority());
        dst.setCanAffectAlly(src.getCanAffectAlly());
        dst.setCanAffectEnemy(src.getCanAffectEnemy());
        dst.setCanAffectSelf(src.getCanAffectSelf());
        dst.setOffsetHp(src.getOffsetHp());
        dst.setCanBeFatal(src.getCanBeFatal());
        dst.setOffsetFuelPercentage(src.getOffsetFuelPercentage());
        dst.setOffsetPrimaryAmmoPercentage(src.getOffsetPrimaryAmmoPercentage());
        dst.setRangeForDown(src.getRangeForDown());
        dst.setRangeForUp(src.getRangeForUp());
        dst.setRangeForLeft(src.getRangeForLeft());
        dst.setRangeForRight(src.getRangeForRight());
    }
}
