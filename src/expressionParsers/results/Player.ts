import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import type { IPlayer } from "../../players/IPlayer.ts";

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
