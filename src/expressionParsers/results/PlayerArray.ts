import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import type { IPlayer } from "../../players/IPlayer.ts";

export class PlayerArray extends Base {
    public readonly array: IPlayer[];

    public constructor(war: IBwWar, array: IPlayer[]) {
        super(war);

        this.array = array;
    }

    public override getResultType(): ResultType {
        return ResultType.PlayerArray;
    }
    public checkIsEqual(rhs: Base): boolean {
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
