import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";
import type * as PlayersIPlayer from "../../players/IPlayer.ts";

type IPlayer = PlayersIPlayer.IPlayer;

export class PlayerArray extends ExpressionParsersResultsBase.Base {
    public readonly array: IPlayer[];

    public constructor(war: BaseWarInterfaceIBwWar.IBwWar, array: IPlayer[]) {
        super(war);

        this.array = array;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.PlayerArray;
    }
    public checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
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
