import {
    ExpressionParsers_Results_Base,
    ExpressionParsers_Enums,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
} from "../../internal.ts";

export class PlayerArray extends ExpressionParsers_Results_Base.Base {
    public readonly array: Players_IPlayer.IPlayer[];

    public constructor(war: BaseWar_Interface_IBwWar.IBwWar, array: Players_IPlayer.IPlayer[]) {
        super(war);

        this.array = array;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.PlayerArray;
    }
    public checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
        if (!(rhs instanceof PlayerArray)) {
            return false;
        }

        const array1 = this.array;
        const array2 = rhs.array;
        if (array1.length !== array2.length) {
            return false;
        }

        for (let i = 0; i < array1.length; ++i) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }

        return true;
    }
}
