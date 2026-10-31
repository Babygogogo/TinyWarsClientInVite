import {
    ExpressionParsers_Results_Base,
    ExpressionParsers_Enums,
    type BaseWar_Interface_IBwWar,
    type Units_Unit,
} from "../../internal.ts";

export class NullableUnit extends ExpressionParsers_Results_Base.Base {
    public readonly unit: Units_Unit.Unit | null;

    public constructor(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_Unit.Unit | null) {
        super(war);

        this.unit = unit;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.Unit;
    }
    public checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
        return (rhs instanceof NullableUnit)
            && (this.unit != null)
            && (this.unit === rhs.unit);
    }
}
