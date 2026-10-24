import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as TilesConstantsCustomLimits from "../constants/CustomLimits.ts";

type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export namespace Building {
    

    export namespace DefenseAmount {
        

        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Building.DefenseAmount.MinValue) && (value <= TilesConstantsCustomLimits.Building.DefenseAmount.MaxValue);
        }
    }

    export namespace MaxCapturePoint {
        

        export function checkIsValid(value: Undefinable<number>): boolean {
            return (value == null)
                || ((value >= TilesConstantsCustomLimits.Building.MaxCapturePoint.MinValue) && (value <= TilesConstantsCustomLimits.Building.MaxCapturePoint.MaxValue));
        }
    }

    export namespace RepairNormalizedHp {
        

        export function checkIsValid(value: Undefinable<number>): boolean {
            return (value == null)
                || ((value >= TilesConstantsCustomLimits.Building.RepairNormalizedHp.MinValue) && (value <= TilesConstantsCustomLimits.Building.RepairNormalizedHp.MaxValue));
        }
    }

    export namespace IncomePerTurn {
        

        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Building.IncomePerTurn.MinValue) && (value <= TilesConstantsCustomLimits.Building.IncomePerTurn.MaxValue);
        }
    }

    export namespace VisionRange {
        

        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Building.VisionRange.MinValue) && (value <= TilesConstantsCustomLimits.Building.VisionRange.MaxValue);
        }
    }

    export namespace GlobalAttackBonus {
        

        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Building.GlobalAttackBonus.MinValue) && (value <= TilesConstantsCustomLimits.Building.GlobalAttackBonus.MaxValue);
        }
    }

    export namespace GlobalDefenseBonus {
        

        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Building.GlobalDefenseBonus.MinValue) && (value <= TilesConstantsCustomLimits.Building.GlobalDefenseBonus.MaxValue);
        }
    }
}

export namespace Crystal {
    

    export namespace Radius {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Crystal.Radius.MinValue)
                && (value <= TilesConstantsCustomLimits.Crystal.Radius.MaxValue);
        }
    }

    export namespace Priority {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Crystal.Priority.MinValue)
                && (value <= TilesConstantsCustomLimits.Crystal.Priority.MaxValue);
        }
    }

    export namespace OffsetFund {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Crystal.OffsetFund.MinValue)
                && (value <= TilesConstantsCustomLimits.Crystal.OffsetFund.MaxValue);
        }
    }

    export namespace OffsetEnergyPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Crystal.OffsetEnergyPercentage.MinValue)
                && (value <= TilesConstantsCustomLimits.Crystal.OffsetEnergyPercentage.MaxValue);
        }
    }

    export namespace OffsetHp {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Crystal.OffsetHp.MinValue)
                && (value <= TilesConstantsCustomLimits.Crystal.OffsetHp.MaxValue);
        }
    }

    export namespace OffsetFuelPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Crystal.OffsetFuelPercentage.MinValue)
                && (value <= TilesConstantsCustomLimits.Crystal.OffsetFuelPercentage.MaxValue);
        }
    }

    export namespace OffsetPrimaryAmmoPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Crystal.OffsetPrimaryAmmoPercentage.MinValue)
                && (value <= TilesConstantsCustomLimits.Crystal.OffsetPrimaryAmmoPercentage.MaxValue);
        }
    }
}

export namespace Cannon {
    

    export namespace RangeForUp {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Cannon.RangeForUp.MinValue)
                && (value <= TilesConstantsCustomLimits.Cannon.RangeForUp.MaxValue);
        }
    }

    export namespace RangeForDown {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Cannon.RangeForDown.MinValue)
                && (value <= TilesConstantsCustomLimits.Cannon.RangeForDown.MaxValue);
        }
    }

    export namespace RangeForLeft {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Cannon.RangeForLeft.MinValue)
                && (value <= TilesConstantsCustomLimits.Cannon.RangeForLeft.MaxValue);
        }
    }

    export namespace RangeForRight {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Cannon.RangeForRight.MinValue)
                && (value <= TilesConstantsCustomLimits.Cannon.RangeForRight.MaxValue);
        }
    }

    export namespace Priority {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Cannon.Priority.MinValue)
                && (value <= TilesConstantsCustomLimits.Cannon.Priority.MaxValue);
        }
    }

    export namespace MaxTargetCount {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Cannon.MaxTargetCount.MinValue)
                && (value <= TilesConstantsCustomLimits.Cannon.MaxTargetCount.MaxValue);
        }
    }

    export namespace OffsetHp {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Cannon.OffsetHp.MinValue)
                && (value <= TilesConstantsCustomLimits.Cannon.OffsetHp.MaxValue);
        }
    }

    export namespace OffsetFuelPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Cannon.OffsetFuelPercentage.MinValue)
                && (value <= TilesConstantsCustomLimits.Cannon.OffsetFuelPercentage.MaxValue);
        }
    }

    export namespace OffsetPrimaryAmmoPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.Cannon.OffsetPrimaryAmmoPercentage.MinValue)
                && (value <= TilesConstantsCustomLimits.Cannon.OffsetPrimaryAmmoPercentage.MaxValue);
        }
    }
}

export namespace LaserTurret {
    

    export namespace RangeForUp {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.LaserTurret.RangeForUp.MinValue)
                && (value <= TilesConstantsCustomLimits.LaserTurret.RangeForUp.MaxValue);
        }
    }

    export namespace RangeForDown {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.LaserTurret.RangeForDown.MinValue)
                && (value <= TilesConstantsCustomLimits.LaserTurret.RangeForDown.MaxValue);
        }
    }

    export namespace RangeForLeft {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.LaserTurret.RangeForLeft.MinValue)
                && (value <= TilesConstantsCustomLimits.LaserTurret.RangeForLeft.MaxValue);
        }
    }

    export namespace RangeForRight {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.LaserTurret.RangeForRight.MinValue)
                && (value <= TilesConstantsCustomLimits.LaserTurret.RangeForRight.MaxValue);
        }
    }

    export namespace Priority {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.LaserTurret.Priority.MinValue)
                && (value <= TilesConstantsCustomLimits.LaserTurret.Priority.MaxValue);
        }
    }

    export namespace OffsetHp {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.LaserTurret.OffsetHp.MinValue)
                && (value <= TilesConstantsCustomLimits.LaserTurret.OffsetHp.MaxValue);
        }
    }

    export namespace OffsetFuelPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.LaserTurret.OffsetFuelPercentage.MinValue)
                && (value <= TilesConstantsCustomLimits.LaserTurret.OffsetFuelPercentage.MaxValue);
        }
    }

    export namespace OffsetPrimaryAmmoPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimits.LaserTurret.OffsetPrimaryAmmoPercentage.MinValue)
                && (value <= TilesConstantsCustomLimits.LaserTurret.OffsetPrimaryAmmoPercentage.MaxValue);
        }
    }
}
