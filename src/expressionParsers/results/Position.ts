import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";

export class Position extends ExpressionParsersResultsBase.Base {
    public readonly x: number;
    public readonly y: number;

    public constructor(war: BaseWarInterfaceIBwWar.IBwWar, x: number, y: number) {
        super(war);

        const newX = Math.floor(x);
        if (!isFinite(newX)) {
            throw HelpersMisc.newError(`Invalid newX: ${newX}`);
        }

        const newY = Math.floor(y);
        if (!isFinite(newY)) {
            throw HelpersMisc.newError(`Invalid newY: ${newY}`);
        }

        this.x = newX;
        this.y = newY;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.Position;
    }
    public override checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
        return (rhs instanceof Position)
            && (this.x === rhs.x)
            && (this.y === rhs.y);
    }
}
