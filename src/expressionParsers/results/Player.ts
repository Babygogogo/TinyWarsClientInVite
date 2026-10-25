import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import type { IPlayer as PlayersIPlayer } from "../../players/IPlayer.ts";

type IPlayer = PlayersIPlayer;

export class Player extends Base {
    public readonly player: IPlayer;

    public constructor(player: IPlayer) {
        super(player.getWar());

        this.player = player;
    }

    public override getResultType(): ResultType {
        return ResultType.Player;
    }
    public checkIsEqual(rhs: Base): boolean {
        return (rhs instanceof Player)
            && (this.player === rhs.player);
    }
}
