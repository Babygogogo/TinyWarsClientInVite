import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import type { TileBuff } from "./TileBuff.ts";

export class TileBuffArray extends Base {
    public readonly buffArray: TileBuff[];

    public constructor(war: IBwWar, buffArray: TileBuff[]) {
        super(war);

        this.buffArray = buffArray;
    }

    public override getResultType(): ResultType {
        return ResultType.TileBuffArray;
    }
    public override checkIsEqual(rhs: Base): boolean {
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
