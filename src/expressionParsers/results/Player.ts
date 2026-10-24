import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";
import type * as PlayersIPlayer from "../../players/IPlayer.ts";

type IPlayer = PlayersIPlayer.IPlayer;

export class Player extends ExpressionParsersResultsBase.Base {
    public readonly player: IPlayer;

    public constructor(player: IPlayer) {
        super(player.getWar());

        this.player = player;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.Player;
    }
    public checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
        return (rhs instanceof Player)
            && (this.player === rhs.player);
    }
}
