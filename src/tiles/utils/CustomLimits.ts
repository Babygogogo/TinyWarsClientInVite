import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import {
    Building as CustomLimitsBuilding,
    Crystal as CustomLimitsCrystal,
    Cannon as CustomLimitsCannon,
    LaserTurret as CustomLimitsLaserTurret,
} from "../constants/CustomLimits.ts";

export namespace Building {
    

    export namespace DefenseAmount {
        

        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsBuilding.DefenseAmount.MinValue) && (value <= CustomLimitsBuilding.DefenseAmount.MaxValue);
        }
    }

    export namespace MaxCapturePoint {
        

        export function checkIsValid(value: Undefinable<number>): boolean {
            return (value == null)
                || ((value >= CustomLimitsBuilding.MaxCapturePoint.MinValue) && (value <= CustomLimitsBuilding.MaxCapturePoint.MaxValue));
        }
    }

    export namespace RepairNormalizedHp {
        

        export function checkIsValid(value: Undefinable<number>): boolean {
            return (value == null)
                || ((value >= CustomLimitsBuilding.RepairNormalizedHp.MinValue) && (value <= CustomLimitsBuilding.RepairNormalizedHp.MaxValue));
        }
    }

    export namespace IncomePerTurn {
        

        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsBuilding.IncomePerTurn.MinValue) && (value <= CustomLimitsBuilding.IncomePerTurn.MaxValue);
        }
    }

    export namespace VisionRange {
        

        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsBuilding.VisionRange.MinValue) && (value <= CustomLimitsBuilding.VisionRange.MaxValue);
        }
    }

    export namespace GlobalAttackBonus {
        

        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsBuilding.GlobalAttackBonus.MinValue) && (value <= CustomLimitsBuilding.GlobalAttackBonus.MaxValue);
        }
    }

    export namespace GlobalDefenseBonus {
        

        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsBuilding.GlobalDefenseBonus.MinValue) && (value <= CustomLimitsBuilding.GlobalDefenseBonus.MaxValue);
        }
    }
}

export namespace Crystal {
    

    export namespace Radius {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsCrystal.Radius.MinValue)
                && (value <= CustomLimitsCrystal.Radius.MaxValue);
        }
    }

    export namespace Priority {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsCrystal.Priority.MinValue)
                && (value <= CustomLimitsCrystal.Priority.MaxValue);
        }
    }

    export namespace OffsetFund {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsCrystal.OffsetFund.MinValue)
                && (value <= CustomLimitsCrystal.OffsetFund.MaxValue);
        }
    }

    export namespace OffsetEnergyPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsCrystal.OffsetEnergyPercentage.MinValue)
                && (value <= CustomLimitsCrystal.OffsetEnergyPercentage.MaxValue);
        }
    }

    export namespace OffsetHp {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsCrystal.OffsetHp.MinValue)
                && (value <= CustomLimitsCrystal.OffsetHp.MaxValue);
        }
    }

    export namespace OffsetFuelPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsCrystal.OffsetFuelPercentage.MinValue)
                && (value <= CustomLimitsCrystal.OffsetFuelPercentage.MaxValue);
        }
    }

    export namespace OffsetPrimaryAmmoPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsCrystal.OffsetPrimaryAmmoPercentage.MinValue)
                && (value <= CustomLimitsCrystal.OffsetPrimaryAmmoPercentage.MaxValue);
        }
    }
}

export namespace Cannon {
    

    export namespace RangeForUp {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsCannon.RangeForUp.MinValue)
                && (value <= CustomLimitsCannon.RangeForUp.MaxValue);
        }
    }

    export namespace RangeForDown {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsCannon.RangeForDown.MinValue)
                && (value <= CustomLimitsCannon.RangeForDown.MaxValue);
        }
    }

    export namespace RangeForLeft {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsCannon.RangeForLeft.MinValue)
                && (value <= CustomLimitsCannon.RangeForLeft.MaxValue);
        }
    }

    export namespace RangeForRight {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsCannon.RangeForRight.MinValue)
                && (value <= CustomLimitsCannon.RangeForRight.MaxValue);
        }
    }

    export namespace Priority {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsCannon.Priority.MinValue)
                && (value <= CustomLimitsCannon.Priority.MaxValue);
        }
    }

    export namespace MaxTargetCount {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsCannon.MaxTargetCount.MinValue)
                && (value <= CustomLimitsCannon.MaxTargetCount.MaxValue);
        }
    }

    export namespace OffsetHp {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsCannon.OffsetHp.MinValue)
                && (value <= CustomLimitsCannon.OffsetHp.MaxValue);
        }
    }

    export namespace OffsetFuelPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsCannon.OffsetFuelPercentage.MinValue)
                && (value <= CustomLimitsCannon.OffsetFuelPercentage.MaxValue);
        }
    }

    export namespace OffsetPrimaryAmmoPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsCannon.OffsetPrimaryAmmoPercentage.MinValue)
                && (value <= CustomLimitsCannon.OffsetPrimaryAmmoPercentage.MaxValue);
        }
    }
}

export namespace LaserTurret {
    

    export namespace RangeForUp {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsLaserTurret.RangeForUp.MinValue)
                && (value <= CustomLimitsLaserTurret.RangeForUp.MaxValue);
        }
    }

    export namespace RangeForDown {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsLaserTurret.RangeForDown.MinValue)
                && (value <= CustomLimitsLaserTurret.RangeForDown.MaxValue);
        }
    }

    export namespace RangeForLeft {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsLaserTurret.RangeForLeft.MinValue)
                && (value <= CustomLimitsLaserTurret.RangeForLeft.MaxValue);
        }
    }

    export namespace RangeForRight {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsLaserTurret.RangeForRight.MinValue)
                && (value <= CustomLimitsLaserTurret.RangeForRight.MaxValue);
        }
    }

    export namespace Priority {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsLaserTurret.Priority.MinValue)
                && (value <= CustomLimitsLaserTurret.Priority.MaxValue);
        }
    }

    export namespace OffsetHp {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsLaserTurret.OffsetHp.MinValue)
                && (value <= CustomLimitsLaserTurret.OffsetHp.MaxValue);
        }
    }

    export namespace OffsetFuelPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsLaserTurret.OffsetFuelPercentage.MinValue)
                && (value <= CustomLimitsLaserTurret.OffsetFuelPercentage.MaxValue);
        }
    }

    export namespace OffsetPrimaryAmmoPercentage {
        export function checkIsValid(value: number): boolean {
            return (value >= CustomLimitsLaserTurret.OffsetPrimaryAmmoPercentage.MinValue)
                && (value <= CustomLimitsLaserTurret.OffsetPrimaryAmmoPercentage.MaxValue);
        }
    }
}
