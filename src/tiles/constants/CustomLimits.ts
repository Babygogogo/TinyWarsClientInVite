import {
    Units_Constants,
} from "../../internal.ts";

export namespace Common {
     
    export const enum CurrentBuildPoint {
        MaxValue    = 1000,
        MinValue    = 0,
    }
}

export namespace Building {
     
    export const enum DefenseAmount {
        MaxValue    = 1000000,
        MinValue    = -MaxValue,
    }

     
    export const enum MaxCapturePoint {
        MaxValue    = 1000,
        MinValue    = 0,
    }

     
    export const enum RepairNormalizedHp {
        MaxValue    = 10,
        MinValue    = 0,
    }

     
    export const enum IncomePerTurn {
        MaxValue    = 1000000,
        MinValue    = -MaxValue,
    }

     
    export const enum VisionRange {
        MaxValue    = 1000,
        MinValue    = 0,
    }

     
    export const enum GlobalAttackBonus {
        MaxValue    = 1000000,
        MinValue    = -MaxValue,
    }

     
    export const enum GlobalDefenseBonus {
        MaxValue    = 1000000,
        MinValue    = -MaxValue,
    }
}

export namespace Crystal {
     
    export const enum Radius {
        MinValue = 0,
        MaxValue = 9999,
    }

     
    export const enum Priority {
        MinValue = 0,
        MaxValue = 9999,
    }

     
    export const enum OffsetFund {
        MinValue = -10000000,
        MaxValue = 10000000,
    }

     
    export const enum OffsetEnergyPercentage {
        MinValue = -100,
        MaxValue = 100,
    }

     
    export const enum OffsetHp {
        MinValue = -Units_Constants.Hp.MaxNormalizedHp,
        MaxValue = Units_Constants.Hp.MaxNormalizedHp,
    }

     
    export const enum OffsetFuelPercentage {
        MinValue = -100,
        MaxValue = 100,
    }

     
    export const enum OffsetPrimaryAmmoPercentage {
        MinValue = -100,
        MaxValue = 100,
    }
}

export namespace Cannon {
     
    export const enum RangeForUp {
        MinValue = 0,
        MaxValue = 9999,
    }

     
    export const enum RangeForDown {
        MinValue = 0,
        MaxValue = 9999,
    }

     
    export const enum RangeForLeft {
        MinValue = 0,
        MaxValue = 9999,
    }

     
    export const enum RangeForRight {
        MinValue = 0,
        MaxValue = 9999,
    }

     
    export const enum Priority {
        MinValue = 0,
        MaxValue = 9999,
    }

     
    export const enum MaxTargetCount {
        MinValue = 0,
        MaxValue = 9999,
    }

     
    export const enum OffsetHp {
        MinValue = -Units_Constants.Hp.MaxNormalizedHp,
        MaxValue = Units_Constants.Hp.MaxNormalizedHp,
    }

     
    export const enum OffsetFuelPercentage {
        MinValue = -100,
        MaxValue = 100,
    }

     
    export const enum OffsetPrimaryAmmoPercentage {
        MinValue = -100,
        MaxValue = 100,
    }
}

export namespace LaserTurret {
     
    export const enum RangeForUp {
        MinValue = 0,
        MaxValue = 9999,
    }

     
    export const enum RangeForDown {
        MinValue = 0,
        MaxValue = 9999,
    }

     
    export const enum RangeForLeft {
        MinValue = 0,
        MaxValue = 9999,
    }

     
    export const enum RangeForRight {
        MinValue = 0,
        MaxValue = 9999,
    }

     
    export const enum Priority {
        MinValue = 0,
        MaxValue = 9999,
    }

     
    export const enum OffsetHp {
        MinValue = -Units_Constants.Hp.MaxNormalizedHp,
        MaxValue = Units_Constants.Hp.MaxNormalizedHp,
    }

     
    export const enum OffsetFuelPercentage {
        MinValue = -100,
        MaxValue = 100,
    }

     
    export const enum OffsetPrimaryAmmoPercentage {
        MinValue = -100,
        MaxValue = 100,
    }
}
