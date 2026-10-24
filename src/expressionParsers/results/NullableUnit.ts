import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";

type IUnit = UnitsIUnit.IUnit;

export class NullableUnit extends ExpressionParsersResultsBase.Base {
    public readonly unit: IUnit | null;

    public constructor(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit | null) {
        super(war);

        this.unit = unit;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.Unit;
    }
    public checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
        return (rhs instanceof NullableUnit)
            && (this.unit != null)
            && (this.unit === rhs.unit);
    }
}
