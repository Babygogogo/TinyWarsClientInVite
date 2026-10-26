import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { TextType } from "../../lang/Constants.ts";
import { getFormattedText, getText } from "../../lang/Utils.ts";
import type { TileCustomBuildingData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import type { TileCustomCannonData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomCannonData.ts";
import type { TileCustomCrystalData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomCrystalData.ts";
import type { TileCustomLaserTurretData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomLaserTurretData.ts";
import {
    Building as TilesUtilsCustomLimitsBuilding,
    Cannon as TilesUtilsCustomLimitsCannon,
    Crystal as TilesUtilsCustomLimitsCrystal,
    LaserTurret as TilesUtilsCustomLimitsLaserTurret,
} from "./CustomLimits.ts";

export namespace Building {

    export function checkIsValid(data: TileCustomBuildingData, config: GameConfig): boolean {
        return Building.getErrorTip(data, config) == null;
    }
    export function getErrorTip(data: TileCustomBuildingData, config: GameConfig): string | null {
        {
            // defenseAmount
            if (!TilesUtilsCustomLimitsBuilding.DefenseAmount.checkIsValid(data.getDefenseAmount())) {
                return getFormattedText(TextType.F0091, getText(TextType.B0352));
            }
        }

        {
            // defenseUnitTypeArray
            if (!config.checkIsValidUnitTypeSubset(data.getDefenseUnitTypeArray())) {
                return getFormattedText(TextType.F0091, getText(TextType.DefensibleUnits));
            }
        }

        {
            // maxCapturePoint
            if (!TilesUtilsCustomLimitsBuilding.MaxCapturePoint.checkIsValid(data.getMaxCapturePoint())) {
                return getFormattedText(TextType.F0091, getText(TextType.MaxCapturePoint));
            }
        }

        {
            // isDefeatedOnCapture no need to check
        }

        {
            // repairAmount
            if (!TilesUtilsCustomLimitsBuilding.RepairNormalizedHp.checkIsValid(data.getRepairNormalizedHp())) {
                return getFormattedText(TextType.F0091, getText(TextType.RepairHpAmount));
            }
        }

        {
            // repairUnitTypeArray
            if (!config.checkIsValidUnitTypeSubset(data.getRepairUnitTypeArray())) {
                return getFormattedText(TextType.F0091, getText(TextType.RepairableUnits));
            }
        }

        {
            // incomePerTurn
            if (!TilesUtilsCustomLimitsBuilding.IncomePerTurn.checkIsValid(data.getIncomePerTurn())) {
                return getFormattedText(TextType.F0091, getText(TextType.B0157));
            }
        }

        {
            // visionRange
            if (!TilesUtilsCustomLimitsBuilding.VisionRange.checkIsValid(data.getVisionRange())) {
                return getFormattedText(TextType.F0091, getText(TextType.VisionRange));
            }
        }

        {
            // isVisionEnabledForAllPlayers no need to check
        }

        {
            // hideUnitTypeArray
            if (!config.checkIsValidUnitTypeSubset(data.getHideUnitTypeArray())) {
                return getFormattedText(TextType.F0091, getText(TextType.HidableUnits));
            }
        }

        {
            // produceUnitTypeArray
            if (!config.checkIsValidUnitTypeSubset(data.getProduceUnitTypeArray())) {
                return getFormattedText(TextType.F0091, getText(TextType.ProducibleUnits));
            }
        }

        {
            // globalAttackBonus
            if (!TilesUtilsCustomLimitsBuilding.GlobalAttackBonus.checkIsValid(data.getGlobalAttackBonus())) {
                return getFormattedText(TextType.F0091, getText(TextType.GlobalAtkBonus));
            }
        }

        {
            // globalDefenseBonus
            if (!TilesUtilsCustomLimitsBuilding.GlobalDefenseBonus.checkIsValid(data.getGlobalDefenseBonus())) {
                return getFormattedText(TextType.F0091, getText(TextType.GlobalDefBonus));
            }
        }

        {
            // unitTypeArrayForCoBoard
            if (!config.checkIsValidUnitTypeSubset(data.getUnitTypeArrayForCoBoard())) {
                return getFormattedText(TextType.F0091, getText(TextType.CoBoardableUnit));
            }
        }

        {
            // blockEnemyUnitTypeArray
            if (!config.checkIsValidUnitTypeSubset(data.getBlockEnemyUnitTypeArray())) {
                return getFormattedText(TextType.F0091, getText(TextType.BlockableEnemyUnits));
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
        if (!TilesUtilsCustomLimitsCannon.Priority.checkIsValid(data.getPriority())) {
            return getFormattedText(TextType.F0091, getText(TextType.Priority));
        }

        if (!TilesUtilsCustomLimitsCannon.MaxTargetCount.checkIsValid(data.getMaxTargetCount())) {
            return getFormattedText(TextType.F0091, getText(TextType.MaxTargets));
        }

        if (!TilesUtilsCustomLimitsCannon.RangeForUp.checkIsValid(data.getRangeForUp())) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeUp));
        }

        if (!TilesUtilsCustomLimitsCannon.RangeForDown.checkIsValid(data.getRangeForDown())) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeDown));
        }

        if (!TilesUtilsCustomLimitsCannon.RangeForLeft.checkIsValid(data.getRangeForLeft())) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeLeft));
        }

        if (!TilesUtilsCustomLimitsCannon.RangeForRight.checkIsValid(data.getRangeForRight())) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeRight));
        }

        if (!TilesUtilsCustomLimitsCannon.OffsetHp.checkIsValid(data.getOffsetHp())) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsHpOffset));
        }

        {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const canBeFatal = data.getCanBeFatal();
        }

        if (!TilesUtilsCustomLimitsCannon.OffsetFuelPercentage.checkIsValid(data.getOffsetFuelPercentage())) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsFuelOffset$));
        }

        if (!TilesUtilsCustomLimitsCannon.OffsetPrimaryAmmoPercentage.checkIsValid(data.getOffsetPrimaryAmmoPercentage())) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsPriAmmoOffset$));
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
        if (!TilesUtilsCustomLimitsCrystal.Priority.checkIsValid(data.getPriority())) {
            return getFormattedText(TextType.F0091, getText(TextType.Priority));
        }

        if (!TilesUtilsCustomLimitsCrystal.Radius.checkIsValid(data.getRadius())) {
            return getFormattedText(TextType.F0091, getText(TextType.EffectiveRadius));
        }

        if (!TilesUtilsCustomLimitsCrystal.OffsetFund.checkIsValid(data.getOffsetFund())) {
            return getFormattedText(TextType.F0091, getText(TextType.FundOffset));
        }

        if (!TilesUtilsCustomLimitsCrystal.OffsetEnergyPercentage.checkIsValid(data.getOffsetEnergyPercentage())) {
            return getFormattedText(TextType.F0091, getText(TextType.CoEnergyOffset$));
        }

        if (!TilesUtilsCustomLimitsCrystal.OffsetHp.checkIsValid(data.getOffsetHp())) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsHpOffset));
        }

        {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const canBeFatal = data.getCanBeFatal();
        }

        if (!TilesUtilsCustomLimitsCrystal.OffsetFuelPercentage.checkIsValid(data.getOffsetFuelPercentage())) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsFuelOffset$));
        }

        if (!TilesUtilsCustomLimitsCrystal.OffsetPrimaryAmmoPercentage.checkIsValid(data.getOffsetPrimaryAmmoPercentage())) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsPriAmmoOffset$));
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
        if (!TilesUtilsCustomLimitsLaserTurret.Priority.checkIsValid(data.getPriority())) {
            return getFormattedText(TextType.F0091, getText(TextType.Priority));
        }

        if (!TilesUtilsCustomLimitsLaserTurret.RangeForDown.checkIsValid(data.getRangeForDown())) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeDown));
        }

        if (!TilesUtilsCustomLimitsLaserTurret.RangeForUp.checkIsValid(data.getRangeForUp())) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeUp));
        }

        if (!TilesUtilsCustomLimitsLaserTurret.RangeForLeft.checkIsValid(data.getRangeForLeft())) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeLeft));
        }

        if (!TilesUtilsCustomLimitsLaserTurret.RangeForRight.checkIsValid(data.getRangeForRight())) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeRight));
        }

        if (!TilesUtilsCustomLimitsLaserTurret.OffsetHp.checkIsValid(data.getOffsetHp())) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsHpOffset));
        }

        if (!TilesUtilsCustomLimitsLaserTurret.OffsetFuelPercentage.checkIsValid(data.getOffsetFuelPercentage())) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsFuelOffset$));
        }

        if (!TilesUtilsCustomLimitsLaserTurret.OffsetPrimaryAmmoPercentage.checkIsValid(data.getOffsetPrimaryAmmoPercentage())) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsPriAmmoOffset$));
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
