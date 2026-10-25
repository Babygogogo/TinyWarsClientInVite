import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import type { IUnit } from "../../units/IUnit.ts";

export class NullableUnit extends Base {
    public readonly unit: IUnit | null;

    public constructor(war: IBwWar, unit: IUnit | null) {
        super(war);

        this.unit = unit;
    }

    public override getResultType(): ResultType {
        return ResultType.Unit;
    }
    public checkIsEqual(rhs: Base): boolean {
        return (rhs instanceof NullableUnit)
            && (this.unit != null)
            && (this.unit === rhs.unit);
    }
}
