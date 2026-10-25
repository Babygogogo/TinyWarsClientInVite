import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import {
    Building as TilesConstantsCustomLimitsBuilding,
    Crystal as TilesConstantsCustomLimitsCrystal,
    Cannon as TilesConstantsCustomLimitsCannon,
    LaserTurret as TilesConstantsCustomLimitsLaserTurret,
} from "../constants/CustomLimits.ts";

export namespace Building {
    

    export namespace DefenseAmount {
        

        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsBuilding.DefenseAmount.MinValue) && (value <= TilesConstantsCustomLimitsBuilding.DefenseAmount.MaxValue);
        }
    }

    export namespace MaxCapturePoint {
        

        export function checkIsValid(value: Undefinable<number>): boolean {
            return (value == null)
                || ((value >= TilesConstantsCustomLimitsBuilding.MaxCapturePoint.MinValue) && (value <= TilesConstantsCustomLimitsBuilding.MaxCapturePoint.MaxValue));
        }
    }

    export namespace RepairNormalizedHp {
        

        export function checkIsValid(value: Undefinable<number>): boolean {
            return (value == null)
                || ((value >= TilesConstantsCustomLimitsBuilding.RepairNormalizedHp.MinValue) && (value <= TilesConstantsCustomLimitsBuilding.RepairNormalizedHp.MaxValue));
        }
    }

    export namespace IncomePerTurn {
        

        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsBuilding.IncomePerTurn.MinValue) && (value <= TilesConstantsCustomLimitsBuilding.IncomePerTurn.MaxValue);
        }
    }

    export namespace VisionRange {
        

        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsBuilding.VisionRange.MinValue) && (value <= TilesConstantsCustomLimitsBuilding.VisionRange.MaxValue);
        }
    }

    export namespace GlobalAttackBonus {
        

        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsBuilding.GlobalAttackBonus.MinValue) && (value <= TilesConstantsCustomLimitsBuilding.GlobalAttackBonus.MaxValue);
        }
    }

    export namespace GlobalDefenseBonus {
        

        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsBuilding.GlobalDefenseBonus.MinValue) && (value <= TilesConstantsCustomLimitsBuilding.GlobalDefenseBonus.MaxValue);
        }
    }
}

export namespace Crystal {
    

    export namespace Radius {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsCrystal.Radius.MinValue)
                && (value <= TilesConstantsCustomLimitsCrystal.Radius.MaxValue);
        }
    }

    export namespace Priority {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsCrystal.Priority.MinValue)
                && (value <= TilesConstantsCustomLimitsCrystal.Priority.MaxValue);
        }
    }

    export namespace OffsetFund {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsCrystal.OffsetFund.MinValue)
                && (value <= TilesConstantsCustomLimitsCrystal.OffsetFund.MaxValue);
        }
    }

    export namespace OffsetEnergyPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsCrystal.OffsetEnergyPercentage.MinValue)
                && (value <= TilesConstantsCustomLimitsCrystal.OffsetEnergyPercentage.MaxValue);
        }
    }

    export namespace OffsetHp {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsCrystal.OffsetHp.MinValue)
                && (value <= TilesConstantsCustomLimitsCrystal.OffsetHp.MaxValue);
        }
    }

    export namespace OffsetFuelPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsCrystal.OffsetFuelPercentage.MinValue)
                && (value <= TilesConstantsCustomLimitsCrystal.OffsetFuelPercentage.MaxValue);
        }
    }

    export namespace OffsetPrimaryAmmoPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsCrystal.OffsetPrimaryAmmoPercentage.MinValue)
                && (value <= TilesConstantsCustomLimitsCrystal.OffsetPrimaryAmmoPercentage.MaxValue);
        }
    }
}

export namespace Cannon {
    

    export namespace RangeForUp {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsCannon.RangeForUp.MinValue)
                && (value <= TilesConstantsCustomLimitsCannon.RangeForUp.MaxValue);
        }
    }

    export namespace RangeForDown {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsCannon.RangeForDown.MinValue)
                && (value <= TilesConstantsCustomLimitsCannon.RangeForDown.MaxValue);
        }
    }

    export namespace RangeForLeft {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsCannon.RangeForLeft.MinValue)
                && (value <= TilesConstantsCustomLimitsCannon.RangeForLeft.MaxValue);
        }
    }

    export namespace RangeForRight {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsCannon.RangeForRight.MinValue)
                && (value <= TilesConstantsCustomLimitsCannon.RangeForRight.MaxValue);
        }
    }

    export namespace Priority {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsCannon.Priority.MinValue)
                && (value <= TilesConstantsCustomLimitsCannon.Priority.MaxValue);
        }
    }

    export namespace MaxTargetCount {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsCannon.MaxTargetCount.MinValue)
                && (value <= TilesConstantsCustomLimitsCannon.MaxTargetCount.MaxValue);
        }
    }

    export namespace OffsetHp {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsCannon.OffsetHp.MinValue)
                && (value <= TilesConstantsCustomLimitsCannon.OffsetHp.MaxValue);
        }
    }

    export namespace OffsetFuelPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsCannon.OffsetFuelPercentage.MinValue)
                && (value <= TilesConstantsCustomLimitsCannon.OffsetFuelPercentage.MaxValue);
        }
    }

    export namespace OffsetPrimaryAmmoPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsCannon.OffsetPrimaryAmmoPercentage.MinValue)
                && (value <= TilesConstantsCustomLimitsCannon.OffsetPrimaryAmmoPercentage.MaxValue);
        }
    }
}

export namespace LaserTurret {
    

    export namespace RangeForUp {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsLaserTurret.RangeForUp.MinValue)
                && (value <= TilesConstantsCustomLimitsLaserTurret.RangeForUp.MaxValue);
        }
    }

    export namespace RangeForDown {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsLaserTurret.RangeForDown.MinValue)
                && (value <= TilesConstantsCustomLimitsLaserTurret.RangeForDown.MaxValue);
        }
    }

    export namespace RangeForLeft {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsLaserTurret.RangeForLeft.MinValue)
                && (value <= TilesConstantsCustomLimitsLaserTurret.RangeForLeft.MaxValue);
        }
    }

    export namespace RangeForRight {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsLaserTurret.RangeForRight.MinValue)
                && (value <= TilesConstantsCustomLimitsLaserTurret.RangeForRight.MaxValue);
        }
    }

    export namespace Priority {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsLaserTurret.Priority.MinValue)
                && (value <= TilesConstantsCustomLimitsLaserTurret.Priority.MaxValue);
        }
    }

    export namespace OffsetHp {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsLaserTurret.OffsetHp.MinValue)
                && (value <= TilesConstantsCustomLimitsLaserTurret.OffsetHp.MaxValue);
        }
    }

    export namespace OffsetFuelPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsLaserTurret.OffsetFuelPercentage.MinValue)
                && (value <= TilesConstantsCustomLimitsLaserTurret.OffsetFuelPercentage.MaxValue);
        }
    }

    export namespace OffsetPrimaryAmmoPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= TilesConstantsCustomLimitsLaserTurret.OffsetPrimaryAmmoPercentage.MinValue)
                && (value <= TilesConstantsCustomLimitsLaserTurret.OffsetPrimaryAmmoPercentage.MaxValue);
        }
    }
}
