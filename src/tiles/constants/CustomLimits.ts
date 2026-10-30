import {
    Units_Constants,
} from "../../internal.ts";

export namespace Common {
    // eslint-disable-next-line no-shadow
    export const enum CurrentBuildPoint {
        MaxValue    = 1000,
        MinValue    = 0,
    }
}

export namespace Building {
    // eslint-disable-next-line no-shadow
    export const enum DefenseAmount {
        MaxValue    = 1000000,
        MinValue    = -MaxValue,
    }

    // eslint-disable-next-line no-shadow
    export const enum MaxCapturePoint {
        MaxValue    = 1000,
        MinValue    = 0,
    }

    // eslint-disable-next-line no-shadow
    export const enum RepairNormalizedHp {
        MaxValue    = 10,
        MinValue    = 0,
    }

    // eslint-disable-next-line no-shadow
    export const enum IncomePerTurn {
        MaxValue    = 1000000,
        MinValue    = -MaxValue,
    }

    // eslint-disable-next-line no-shadow
    export const enum VisionRange {
        MaxValue    = 1000,
        MinValue    = 0,
    }

    // eslint-disable-next-line no-shadow
    export const enum GlobalAttackBonus {
        MaxValue    = 1000000,
        MinValue    = -MaxValue,
    }

    // eslint-disable-next-line no-shadow
    export const enum GlobalDefenseBonus {
        MaxValue    = 1000000,
        MinValue    = -MaxValue,
    }
}

export namespace Crystal {
    // eslint-disable-next-line no-shadow
    export const enum Radius {
        MinValue = 0,
        MaxValue = 9999,
    }

    // eslint-disable-next-line no-shadow
    export const enum Priority {
        MinValue = 0,
        MaxValue = 9999,
    }

    // eslint-disable-next-line no-shadow
    export const enum OffsetFund {
        MinValue = -10000000,
        MaxValue = 10000000,
    }

    // eslint-disable-next-line no-shadow
    export const enum OffsetEnergyPercentage {
        MinValue = -100,
        MaxValue = 100,
    }

    // eslint-disable-next-line no-shadow
    export const enum OffsetHp {
        MinValue = -Units_Constants.Hp.MaxNormalizedHp,
        MaxValue = Units_Constants.Hp.MaxNormalizedHp,
    }

    // eslint-disable-next-line no-shadow
    export const enum OffsetFuelPercentage {
        MinValue = -100,
        MaxValue = 100,
    }

    // eslint-disable-next-line no-shadow
    export const enum OffsetPrimaryAmmoPercentage {
        MinValue = -100,
        MaxValue = 100,
    }
}

export namespace Cannon {
    // eslint-disable-next-line no-shadow
    export const enum RangeForUp {
        MinValue = 0,
        MaxValue = 9999,
    }

    // eslint-disable-next-line no-shadow
    export const enum RangeForDown {
        MinValue = 0,
        MaxValue = 9999,
    }

    // eslint-disable-next-line no-shadow
    export const enum RangeForLeft {
        MinValue = 0,
        MaxValue = 9999,
    }

    // eslint-disable-next-line no-shadow
    export const enum RangeForRight {
        MinValue = 0,
        MaxValue = 9999,
    }

    // eslint-disable-next-line no-shadow
    export const enum Priority {
        MinValue = 0,
        MaxValue = 9999,
    }

    // eslint-disable-next-line no-shadow
    export const enum MaxTargetCount {
        MinValue = 0,
        MaxValue = 9999,
    }

    // eslint-disable-next-line no-shadow
    export const enum OffsetHp {
        MinValue = -Units_Constants.Hp.MaxNormalizedHp,
        MaxValue = Units_Constants.Hp.MaxNormalizedHp,
    }

    // eslint-disable-next-line no-shadow
    export const enum OffsetFuelPercentage {
        MinValue = -100,
        MaxValue = 100,
    }

    // eslint-disable-next-line no-shadow
    export const enum OffsetPrimaryAmmoPercentage {
        MinValue = -100,
        MaxValue = 100,
    }
}

export namespace LaserTurret {
    // eslint-disable-next-line no-shadow
    export const enum RangeForUp {
        MinValue = 0,
        MaxValue = 9999,
    }

    // eslint-disable-next-line no-shadow
    export const enum RangeForDown {
        MinValue = 0,
        MaxValue = 9999,
    }

    // eslint-disable-next-line no-shadow
    export const enum RangeForLeft {
        MinValue = 0,
        MaxValue = 9999,
    }

    // eslint-disable-next-line no-shadow
    export const enum RangeForRight {
        MinValue = 0,
        MaxValue = 9999,
    }

    // eslint-disable-next-line no-shadow
    export const enum Priority {
        MinValue = 0,
        MaxValue = 9999,
    }

    // eslint-disable-next-line no-shadow
    export const enum OffsetHp {
        MinValue = -Units_Constants.Hp.MaxNormalizedHp,
        MaxValue = Units_Constants.Hp.MaxNormalizedHp,
    }

    // eslint-disable-next-line no-shadow
    export const enum OffsetFuelPercentage {
        MinValue = -100,
        MaxValue = 100,
    }

    // eslint-disable-next-line no-shadow
    export const enum OffsetPrimaryAmmoPercentage {
        MinValue = -100,
        MaxValue = 100,
    }
}
