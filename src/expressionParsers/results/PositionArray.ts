import {
    ExpressionParsers_Results_Base,
    ExpressionParsers_Enums,
    type BaseWar_Interface_IBwWar,
    type ExpressionParsers_Results_Position,
} from "../../internal.ts";

export class PositionArray extends ExpressionParsers_Results_Base.Base {
    public readonly positionArray: ExpressionParsers_Results_Position.Position[];

    public constructor(war: BaseWar_Interface_IBwWar.IBwWar, positionArray: ExpressionParsers_Results_Position.Position[]) {
        super(war);

        this.positionArray = positionArray;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.PositionArray;
    }
    public override checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
        if (!(rhs instanceof PositionArray)) {
            return false;
        }

        const array1 = this.positionArray;
        const array2 = rhs.positionArray;
        if (array1.length !== array2.length) {
            return false;
        }

        for (let i = 0; i < array1.length; ++i) {
            if (!array1[i].checkIsEqual(array2[i])) {
                return false;
            }
        }

        return true;
    }
}
