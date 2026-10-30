import {
    ExpressionParsers_Results_Base,
    Helpers_Misc,
    ExpressionParsers_Enums,
    type BaseWar_Interface_IBwWar,
} from "../../internal.ts";

export class Position extends ExpressionParsers_Results_Base.Base {
    public readonly x: number;
    public readonly y: number;

    public constructor(war: BaseWar_Interface_IBwWar.IBwWar, x: number, y: number) {
        super(war);

        const newX = Math.floor(x);
        if (!isFinite(newX)) {
            throw Helpers_Misc.newError(`Invalid newX: ${newX}`);
        }

        const newY = Math.floor(y);
        if (!isFinite(newY)) {
            throw Helpers_Misc.newError(`Invalid newY: ${newY}`);
        }

        this.x = newX;
        this.y = newY;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.Position;
    }
    public override checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
        return (rhs instanceof Position)
            && (this.x === rhs.x)
            && (this.y === rhs.y);
    }
}
