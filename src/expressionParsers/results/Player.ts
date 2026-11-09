import {
    ExpressionParsers_Results_Base,
    ExpressionParsers_Enums,
    type Players_Player,
} from "../../internal.ts";

export class Player extends ExpressionParsers_Results_Base.Base {
    public readonly player: Players_Player.Player;

    public constructor(player: Players_Player.Player) {
        super(player.getWar());

        this.player = player;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.Player;
    }
    public checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
        return (rhs instanceof Player)
            && (this.player === rhs.player);
    }
}
