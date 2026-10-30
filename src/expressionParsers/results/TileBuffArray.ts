import {
    ExpressionParsers_Results_Base,
    ExpressionParsers_Enums,
    type BaseWar_Interface_IBwWar,
    type ExpressionParsers_Results_TileBuff,
} from "../../internal.ts";

export class TileBuffArray extends ExpressionParsers_Results_Base.Base {
    public readonly buffArray: ExpressionParsers_Results_TileBuff.TileBuff[];

    public constructor(war: BaseWar_Interface_IBwWar.IBwWar, buffArray: ExpressionParsers_Results_TileBuff.TileBuff[]) {
        super(war);

        this.buffArray = buffArray;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.TileBuffArray;
    }
    public override checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
        if (!(rhs instanceof TileBuffArray)) {
            return false;
        }

        const array1 = this.buffArray;
        const array2 = rhs.buffArray;
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
