import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import type { Position } from "./Position.ts";

export class PositionArray extends Base {
    public readonly positionArray: Position[];

    public constructor(war: IBwWar, positionArray: Position[]) {
        super(war);

        this.positionArray = positionArray;
    }

    public override getResultType(): ResultType {
        return ResultType.PositionArray;
    }
    public override checkIsEqual(rhs: Base): boolean {
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
