import {
    Tiles_Utils_CustomLimits,
    Lang_Utils,
    Lang_Constants,
    type GameConfigs_GameConfig,
} from "../../internal.ts";
import type { TileCustomBuildingData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import type { TileCustomCannonData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomCannonData.ts";
import type { TileCustomCrystalData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomCrystalData.ts";
import type { TileCustomLaserTurretData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomLaserTurretData.ts";

export namespace Building {

    export function checkIsValid(data: TileCustomBuildingData, config: GameConfigs_GameConfig.GameConfig): boolean {
        return Building.getErrorTip(data, config) == null;
    }
    export function getErrorTip(data: TileCustomBuildingData, config: GameConfigs_GameConfig.GameConfig): string | null {
        {
            // defenseAmount
            if (!Tiles_Utils_CustomLimits.Building.DefenseAmount.checkIsValid(data.getDefenseAmount())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0352));
            }
        }

        {
            // defenseUnitTypeArray
            if (!config.checkIsValidUnitTypeSubset(data.getDefenseUnitTypeArray())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.DefensibleUnits));
            }
        }

        {
            // maxCapturePoint
            if (!Tiles_Utils_CustomLimits.Building.MaxCapturePoint.checkIsValid(data.getMaxCapturePoint())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.MaxCapturePoint));
            }
        }

        {
            // isDefeatedOnCapture no need to check
        }

        {
            // repairAmount
            if (!Tiles_Utils_CustomLimits.Building.RepairNormalizedHp.checkIsValid(data.getRepairNormalizedHp())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.RepairHpAmount));
            }
        }

        {
            // repairUnitTypeArray
            if (!config.checkIsValidUnitTypeSubset(data.getRepairUnitTypeArray())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.RepairableUnits));
            }
        }

        {
            // incomePerTurn
            if (!Tiles_Utils_CustomLimits.Building.IncomePerTurn.checkIsValid(data.getIncomePerTurn())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0157));
            }
        }

        {
            // visionRange
            if (!Tiles_Utils_CustomLimits.Building.VisionRange.checkIsValid(data.getVisionRange())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.VisionRange));
            }
        }

        {
            // isVisionEnabledForAllPlayers no need to check
        }

        {
            // hideUnitTypeArray
            if (!config.checkIsValidUnitTypeSubset(data.getHideUnitTypeArray())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.HidableUnits));
            }
        }

        {
            // produceUnitTypeArray
            if (!config.checkIsValidUnitTypeSubset(data.getProduceUnitTypeArray())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.ProducibleUnits));
            }
        }

        {
            // globalAttackBonus
            if (!Tiles_Utils_CustomLimits.Building.GlobalAttackBonus.checkIsValid(data.getGlobalAttackBonus())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.GlobalAtkBonus));
            }
        }

        {
            // globalDefenseBonus
            if (!Tiles_Utils_CustomLimits.Building.GlobalDefenseBonus.checkIsValid(data.getGlobalDefenseBonus())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.GlobalDefBonus));
            }
        }

        {
            // unitTypeArrayForCoBoard
            if (!config.checkIsValidUnitTypeSubset(data.getUnitTypeArrayForCoBoard())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.CoBoardableUnit));
            }
        }

        {
            // blockEnemyUnitTypeArray
            if (!config.checkIsValidUnitTypeSubset(data.getBlockEnemyUnitTypeArray())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.BlockableEnemyUnits));
            }
        }

        return null;
    }
}

export namespace Cannon {

    export function checkIsValid(data: TileCustomCannonData): boolean {
        return Cannon.getErrorTip(data) == null;
    }
    export function getErrorTip(data: TileCustomCannonData): string | null {
        if (!Tiles_Utils_CustomLimits.Cannon.Priority.checkIsValid(data.getPriority())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Priority));
        }

        if (!Tiles_Utils_CustomLimits.Cannon.MaxTargetCount.checkIsValid(data.getMaxTargetCount())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.MaxTargets));
        }

        if (!Tiles_Utils_CustomLimits.Cannon.RangeForUp.checkIsValid(data.getRangeForUp())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.RangeUp));
        }

        if (!Tiles_Utils_CustomLimits.Cannon.RangeForDown.checkIsValid(data.getRangeForDown())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.RangeDown));
        }

        if (!Tiles_Utils_CustomLimits.Cannon.RangeForLeft.checkIsValid(data.getRangeForLeft())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.RangeLeft));
        }

        if (!Tiles_Utils_CustomLimits.Cannon.RangeForRight.checkIsValid(data.getRangeForRight())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.RangeRight));
        }

        if (!Tiles_Utils_CustomLimits.Cannon.OffsetHp.checkIsValid(data.getOffsetHp())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitsHpOffset));
        }

        {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const canBeFatal = data.getCanBeFatal();
        }

        if (!Tiles_Utils_CustomLimits.Cannon.OffsetFuelPercentage.checkIsValid(data.getOffsetFuelPercentage())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitsFuelOffset$));
        }

        if (!Tiles_Utils_CustomLimits.Cannon.OffsetPrimaryAmmoPercentage.checkIsValid(data.getOffsetPrimaryAmmoPercentage())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitsPriAmmoOffset$));
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

    export function checkIsValid(data: TileCustomCrystalData): boolean {
        return Crystal.getErrorTip(data) == null;
    }
    export function getErrorTip(data: TileCustomCrystalData): string | null {
        if (!Tiles_Utils_CustomLimits.Crystal.Priority.checkIsValid(data.getPriority())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Priority));
        }

        if (!Tiles_Utils_CustomLimits.Crystal.Radius.checkIsValid(data.getRadius())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.EffectiveRadius));
        }

        if (!Tiles_Utils_CustomLimits.Crystal.OffsetFund.checkIsValid(data.getOffsetFund())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.FundOffset));
        }

        if (!Tiles_Utils_CustomLimits.Crystal.OffsetEnergyPercentage.checkIsValid(data.getOffsetEnergyPercentage())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.CoEnergyOffset$));
        }

        if (!Tiles_Utils_CustomLimits.Crystal.OffsetHp.checkIsValid(data.getOffsetHp())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitsHpOffset));
        }

        {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const canBeFatal = data.getCanBeFatal();
        }

        if (!Tiles_Utils_CustomLimits.Crystal.OffsetFuelPercentage.checkIsValid(data.getOffsetFuelPercentage())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitsFuelOffset$));
        }

        if (!Tiles_Utils_CustomLimits.Crystal.OffsetPrimaryAmmoPercentage.checkIsValid(data.getOffsetPrimaryAmmoPercentage())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitsPriAmmoOffset$));
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

    export function checkIsValid(data: TileCustomLaserTurretData): boolean {
        return LaserTurret.getErrorTip(data) == null;
    }
    export function getErrorTip(data: TileCustomLaserTurretData): string | null {
        if (!Tiles_Utils_CustomLimits.LaserTurret.Priority.checkIsValid(data.getPriority())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Priority));
        }

        if (!Tiles_Utils_CustomLimits.LaserTurret.RangeForDown.checkIsValid(data.getRangeForDown())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.RangeDown));
        }

        if (!Tiles_Utils_CustomLimits.LaserTurret.RangeForUp.checkIsValid(data.getRangeForUp())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.RangeUp));
        }

        if (!Tiles_Utils_CustomLimits.LaserTurret.RangeForLeft.checkIsValid(data.getRangeForLeft())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.RangeLeft));
        }

        if (!Tiles_Utils_CustomLimits.LaserTurret.RangeForRight.checkIsValid(data.getRangeForRight())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.RangeRight));
        }

        if (!Tiles_Utils_CustomLimits.LaserTurret.OffsetHp.checkIsValid(data.getOffsetHp())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitsHpOffset));
        }

        if (!Tiles_Utils_CustomLimits.LaserTurret.OffsetFuelPercentage.checkIsValid(data.getOffsetFuelPercentage())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitsFuelOffset$));
        }

        if (!Tiles_Utils_CustomLimits.LaserTurret.OffsetPrimaryAmmoPercentage.checkIsValid(data.getOffsetPrimaryAmmoPercentage())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitsPriAmmoOffset$));
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
