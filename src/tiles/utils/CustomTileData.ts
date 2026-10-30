import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getFormattedText,
    getText,
} from "../../lang/Utils.ts";
import type { TileCustomBuildingData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import type { TileCustomCannonData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomCannonData.ts";
import type { TileCustomCrystalData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomCrystalData.ts";
import type { TileCustomLaserTurretData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomLaserTurretData.ts";
import {
    Building as CustomLimitsBuilding,
    Cannon as CustomLimitsCannon,
    Crystal as CustomLimitsCrystal,
    LaserTurret as CustomLimitsLaserTurret,
} from "./CustomLimits.ts";

export namespace Building {

    export function checkIsValid(data: TileCustomBuildingData, config: GameConfig): boolean {
        return Building.getErrorTip(data, config) == null;
    }
    export function getErrorTip(data: TileCustomBuildingData, config: GameConfig): string | null {
        {
            // defenseAmount
            if (!CustomLimitsBuilding.DefenseAmount.checkIsValid(data.getDefenseAmount())) {
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
            if (!CustomLimitsBuilding.MaxCapturePoint.checkIsValid(data.getMaxCapturePoint())) {
                return getFormattedText(TextType.F0091, getText(TextType.MaxCapturePoint));
            }
        }

        {
            // isDefeatedOnCapture no need to check
        }

        {
            // repairAmount
            if (!CustomLimitsBuilding.RepairNormalizedHp.checkIsValid(data.getRepairNormalizedHp())) {
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
            if (!CustomLimitsBuilding.IncomePerTurn.checkIsValid(data.getIncomePerTurn())) {
                return getFormattedText(TextType.F0091, getText(TextType.B0157));
            }
        }

        {
            // visionRange
            if (!CustomLimitsBuilding.VisionRange.checkIsValid(data.getVisionRange())) {
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
            if (!CustomLimitsBuilding.GlobalAttackBonus.checkIsValid(data.getGlobalAttackBonus())) {
                return getFormattedText(TextType.F0091, getText(TextType.GlobalAtkBonus));
            }
        }

        {
            // globalDefenseBonus
            if (!CustomLimitsBuilding.GlobalDefenseBonus.checkIsValid(data.getGlobalDefenseBonus())) {
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
        if (!CustomLimitsCannon.Priority.checkIsValid(data.getPriority())) {
            return getFormattedText(TextType.F0091, getText(TextType.Priority));
        }

        if (!CustomLimitsCannon.MaxTargetCount.checkIsValid(data.getMaxTargetCount())) {
            return getFormattedText(TextType.F0091, getText(TextType.MaxTargets));
        }

        if (!CustomLimitsCannon.RangeForUp.checkIsValid(data.getRangeForUp())) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeUp));
        }

        if (!CustomLimitsCannon.RangeForDown.checkIsValid(data.getRangeForDown())) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeDown));
        }

        if (!CustomLimitsCannon.RangeForLeft.checkIsValid(data.getRangeForLeft())) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeLeft));
        }

        if (!CustomLimitsCannon.RangeForRight.checkIsValid(data.getRangeForRight())) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeRight));
        }

        if (!CustomLimitsCannon.OffsetHp.checkIsValid(data.getOffsetHp())) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsHpOffset));
        }

        {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const canBeFatal = data.getCanBeFatal();
        }

        if (!CustomLimitsCannon.OffsetFuelPercentage.checkIsValid(data.getOffsetFuelPercentage())) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsFuelOffset$));
        }

        if (!CustomLimitsCannon.OffsetPrimaryAmmoPercentage.checkIsValid(data.getOffsetPrimaryAmmoPercentage())) {
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
        if (!CustomLimitsCrystal.Priority.checkIsValid(data.getPriority())) {
            return getFormattedText(TextType.F0091, getText(TextType.Priority));
        }

        if (!CustomLimitsCrystal.Radius.checkIsValid(data.getRadius())) {
            return getFormattedText(TextType.F0091, getText(TextType.EffectiveRadius));
        }

        if (!CustomLimitsCrystal.OffsetFund.checkIsValid(data.getOffsetFund())) {
            return getFormattedText(TextType.F0091, getText(TextType.FundOffset));
        }

        if (!CustomLimitsCrystal.OffsetEnergyPercentage.checkIsValid(data.getOffsetEnergyPercentage())) {
            return getFormattedText(TextType.F0091, getText(TextType.CoEnergyOffset$));
        }

        if (!CustomLimitsCrystal.OffsetHp.checkIsValid(data.getOffsetHp())) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsHpOffset));
        }

        {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const canBeFatal = data.getCanBeFatal();
        }

        if (!CustomLimitsCrystal.OffsetFuelPercentage.checkIsValid(data.getOffsetFuelPercentage())) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsFuelOffset$));
        }

        if (!CustomLimitsCrystal.OffsetPrimaryAmmoPercentage.checkIsValid(data.getOffsetPrimaryAmmoPercentage())) {
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
        if (!CustomLimitsLaserTurret.Priority.checkIsValid(data.getPriority())) {
            return getFormattedText(TextType.F0091, getText(TextType.Priority));
        }

        if (!CustomLimitsLaserTurret.RangeForDown.checkIsValid(data.getRangeForDown())) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeDown));
        }

        if (!CustomLimitsLaserTurret.RangeForUp.checkIsValid(data.getRangeForUp())) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeUp));
        }

        if (!CustomLimitsLaserTurret.RangeForLeft.checkIsValid(data.getRangeForLeft())) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeLeft));
        }

        if (!CustomLimitsLaserTurret.RangeForRight.checkIsValid(data.getRangeForRight())) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeRight));
        }

        if (!CustomLimitsLaserTurret.OffsetHp.checkIsValid(data.getOffsetHp())) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsHpOffset));
        }

        if (!CustomLimitsLaserTurret.OffsetFuelPercentage.checkIsValid(data.getOffsetFuelPercentage())) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsFuelOffset$));
        }

        if (!CustomLimitsLaserTurret.OffsetPrimaryAmmoPercentage.checkIsValid(data.getOffsetPrimaryAmmoPercentage())) {
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
