import {
    Tiles_Constants_CustomLimits,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";

export namespace Building {

    export namespace DefenseAmount {

        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Building.DefenseAmount.MinValue) && (value <= Tiles_Constants_CustomLimits.Building.DefenseAmount.MaxValue);
        }
    }

    export namespace MaxCapturePoint {

        export function checkIsValid(value: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): boolean {
            return (value == null)
                || ((value >= Tiles_Constants_CustomLimits.Building.MaxCapturePoint.MinValue) && (value <= Tiles_Constants_CustomLimits.Building.MaxCapturePoint.MaxValue));
        }
    }

    export namespace RepairNormalizedHp {

        export function checkIsValid(value: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): boolean {
            return (value == null)
                || ((value >= Tiles_Constants_CustomLimits.Building.RepairNormalizedHp.MinValue) && (value <= Tiles_Constants_CustomLimits.Building.RepairNormalizedHp.MaxValue));
        }
    }

    export namespace IncomePerTurn {

        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Building.IncomePerTurn.MinValue) && (value <= Tiles_Constants_CustomLimits.Building.IncomePerTurn.MaxValue);
        }
    }

    export namespace VisionRange {

        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Building.VisionRange.MinValue) && (value <= Tiles_Constants_CustomLimits.Building.VisionRange.MaxValue);
        }
    }

    export namespace GlobalAttackBonus {

        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Building.GlobalAttackBonus.MinValue) && (value <= Tiles_Constants_CustomLimits.Building.GlobalAttackBonus.MaxValue);
        }
    }

    export namespace GlobalDefenseBonus {

        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Building.GlobalDefenseBonus.MinValue) && (value <= Tiles_Constants_CustomLimits.Building.GlobalDefenseBonus.MaxValue);
        }
    }
}

export namespace Crystal {

    export namespace Radius {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Crystal.Radius.MinValue)
                && (value <= Tiles_Constants_CustomLimits.Crystal.Radius.MaxValue);
        }
    }

    export namespace Priority {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Crystal.Priority.MinValue)
                && (value <= Tiles_Constants_CustomLimits.Crystal.Priority.MaxValue);
        }
    }

    export namespace OffsetFund {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Crystal.OffsetFund.MinValue)
                && (value <= Tiles_Constants_CustomLimits.Crystal.OffsetFund.MaxValue);
        }
    }

    export namespace OffsetEnergyPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Crystal.OffsetEnergyPercentage.MinValue)
                && (value <= Tiles_Constants_CustomLimits.Crystal.OffsetEnergyPercentage.MaxValue);
        }
    }

    export namespace OffsetHp {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Crystal.OffsetHp.MinValue)
                && (value <= Tiles_Constants_CustomLimits.Crystal.OffsetHp.MaxValue);
        }
    }

    export namespace OffsetFuelPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Crystal.OffsetFuelPercentage.MinValue)
                && (value <= Tiles_Constants_CustomLimits.Crystal.OffsetFuelPercentage.MaxValue);
        }
    }

    export namespace OffsetPrimaryAmmoPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Crystal.OffsetPrimaryAmmoPercentage.MinValue)
                && (value <= Tiles_Constants_CustomLimits.Crystal.OffsetPrimaryAmmoPercentage.MaxValue);
        }
    }
}

export namespace Cannon {

    export namespace RangeForUp {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Cannon.RangeForUp.MinValue)
                && (value <= Tiles_Constants_CustomLimits.Cannon.RangeForUp.MaxValue);
        }
    }

    export namespace RangeForDown {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Cannon.RangeForDown.MinValue)
                && (value <= Tiles_Constants_CustomLimits.Cannon.RangeForDown.MaxValue);
        }
    }

    export namespace RangeForLeft {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Cannon.RangeForLeft.MinValue)
                && (value <= Tiles_Constants_CustomLimits.Cannon.RangeForLeft.MaxValue);
        }
    }

    export namespace RangeForRight {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Cannon.RangeForRight.MinValue)
                && (value <= Tiles_Constants_CustomLimits.Cannon.RangeForRight.MaxValue);
        }
    }

    export namespace Priority {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Cannon.Priority.MinValue)
                && (value <= Tiles_Constants_CustomLimits.Cannon.Priority.MaxValue);
        }
    }

    export namespace MaxTargetCount {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Cannon.MaxTargetCount.MinValue)
                && (value <= Tiles_Constants_CustomLimits.Cannon.MaxTargetCount.MaxValue);
        }
    }

    export namespace OffsetHp {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Cannon.OffsetHp.MinValue)
                && (value <= Tiles_Constants_CustomLimits.Cannon.OffsetHp.MaxValue);
        }
    }

    export namespace OffsetFuelPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Cannon.OffsetFuelPercentage.MinValue)
                && (value <= Tiles_Constants_CustomLimits.Cannon.OffsetFuelPercentage.MaxValue);
        }
    }

    export namespace OffsetPrimaryAmmoPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.Cannon.OffsetPrimaryAmmoPercentage.MinValue)
                && (value <= Tiles_Constants_CustomLimits.Cannon.OffsetPrimaryAmmoPercentage.MaxValue);
        }
    }
}

export namespace LaserTurret {

    export namespace RangeForUp {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.LaserTurret.RangeForUp.MinValue)
                && (value <= Tiles_Constants_CustomLimits.LaserTurret.RangeForUp.MaxValue);
        }
    }

    export namespace RangeForDown {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.LaserTurret.RangeForDown.MinValue)
                && (value <= Tiles_Constants_CustomLimits.LaserTurret.RangeForDown.MaxValue);
        }
    }

    export namespace RangeForLeft {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.LaserTurret.RangeForLeft.MinValue)
                && (value <= Tiles_Constants_CustomLimits.LaserTurret.RangeForLeft.MaxValue);
        }
    }

    export namespace RangeForRight {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.LaserTurret.RangeForRight.MinValue)
                && (value <= Tiles_Constants_CustomLimits.LaserTurret.RangeForRight.MaxValue);
        }
    }

    export namespace Priority {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.LaserTurret.Priority.MinValue)
                && (value <= Tiles_Constants_CustomLimits.LaserTurret.Priority.MaxValue);
        }
    }

    export namespace OffsetHp {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.LaserTurret.OffsetHp.MinValue)
                && (value <= Tiles_Constants_CustomLimits.LaserTurret.OffsetHp.MaxValue);
        }
    }

    export namespace OffsetFuelPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.LaserTurret.OffsetFuelPercentage.MinValue)
                && (value <= Tiles_Constants_CustomLimits.LaserTurret.OffsetFuelPercentage.MaxValue);
        }
    }

    export namespace OffsetPrimaryAmmoPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= Tiles_Constants_CustomLimits.LaserTurret.OffsetPrimaryAmmoPercentage.MinValue)
                && (value <= Tiles_Constants_CustomLimits.LaserTurret.OffsetPrimaryAmmoPercentage.MaxValue);
        }
    }
}
