import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import { newError } from "../../helpers/Misc.ts";

export class Position extends Base {
    public readonly x: number;
    public readonly y: number;

    public constructor(war: IBwWar, x: number, y: number) {
        super(war);

        const newX = Math.floor(x);
        if (!isFinite(newX)) {
            throw newError(`Invalid newX: ${newX}`);
        }

        const newY = Math.floor(y);
        if (!isFinite(newY)) {
            throw newError(`Invalid newY: ${newY}`);
        }

        this.x = newX;
        this.y = newY;
    }

    public override getResultType(): ResultType {
        return ResultType.Position;
    }
    public override checkIsEqual(rhs: Base): boolean {
        return (rhs instanceof Position)
            && (this.x === rhs.x)
            && (this.y === rhs.y);
    }
}
