import type { Base as ContextsBase } from "../contexts/Base.ts";
import {
    ResultType,
    ContextType,
} from "../Enums.ts";
import { Base } from "./Base.ts";
import type { Base as ResultsBase } from "../results/Base.ts";
import { Num } from "../results/Num.ts";
import { getErrorTextForOperandType } from "../Utils.ts";
import { newError } from "../../helpers/Misc.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

const ValidOperandTypes = [
    ResultType.Player,
    ResultType.PlayerArray,
    ResultType.Unit,
    ResultType.UnitArray,
    ResultType.Tile,
    ResultType.TileArray,
    ResultType.TileBuff,
    ResultType.TileBuffArray,
    ResultType.UnitStatistic,
    ResultType.UnitStatisticArray,
    ResultType.Number,
    ResultType.NumberArray,
];

export class OperatorTernary extends Base {
    private _condition  : Base;
    private _lhs        : Base;              // Left hand side of the operation
    private _rhs        : Base;              // Right hand side of the operation

    public constructor(condition: Base, lhs: Base, rhs: Base) {
        super();

        this._condition = condition;
        this._lhs       = lhs;
        this._rhs       = rhs;
    }

    public override eval(ctx: ContextsBase, rootCtx: ContextsBase, lambdaArgumentDict: Map<string, ResultsBase> | null, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsBase {
        const condition = this._condition.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (!(condition instanceof Num)) {
            throw newError(`Condition is not finite: ${condition}`);
        }

        return condition.num !== 0
            ? this._lhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted)
            : this._rhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ContextType;
        lambdaArgumentInfoDict  : Map<string, ResultType> | null;
        localVariableDict       : Map<string, ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ResultType {
        const conditionType = this._condition.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        if (conditionType !== ResultType.Number) {
            throw newError(
                getErrorTextForOperandType("?:", 1, ResultType.Number, conditionType),
                ClientErrorCode.EpNodeOperatorTernary_GetResultType_00
            );
        }

        const lhsType = this._lhs.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        if (ValidOperandTypes.indexOf(lhsType) < 0) {
            throw newError(
                getErrorTextForOperandType("?:", 2, ValidOperandTypes, lhsType),
                ClientErrorCode.EpNodeOperatorTernary_GetResultType_01
            );
        }

        const rhsType = this._rhs.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        if (rhsType !== lhsType) {
            throw newError(
                getErrorTextForOperandType("?:", 3, lhsType, rhsType),
                ClientErrorCode.EpNodeOperatorTernary_GetResultType_02
            );
        }

        return lhsType;
    }

    public override getTokensCount(): number {
        return this._condition.getTokensCount() + this._lhs.getTokensCount() + this._rhs.getTokensCount() + 1;
    }

    // public override getPriority(): Priority {
    //     return Priority.Ternary;
    // }
    // public override toString(): string {
    //     const lhs                   = this._lhs;
    //     const rhs                   = this._rhs;
    //     const condition             = this._condition;
    //     const lhsRawString          = lhs.toString();
    //     const rhsRawString          = rhs.toString();
    //     const conditionRawString    = condition.toString();
    //     const priority              = this.getPriority();
    //     const lhsString             = priority >= lhs.getPriority() ? `(${lhsRawString})` : lhsRawString;
    //     const rhsString             = priority >= rhs.getPriority() ? `(${rhsRawString})` : rhsRawString;
    //     const conditionString       = priority >= condition.getPriority() ? `(${conditionRawString})` : conditionRawString;
    //     return `${conditionString} ? ${lhsString} : ${rhsString}`;
    // }
    // public override toProto(): CommonProto.Structure.Expression.INode {
    //     return { nodeTernary: {
    //         condition   : this._condition.toProto(),
    //         lhs         : this._lhs.toProto(),
    //         rhs         : this._rhs.toProto(),
    //     } };
    // }
}
