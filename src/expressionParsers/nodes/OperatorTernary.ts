import type * as ExpressionParsersContextsBase from "../contexts/Base.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersNodesBase from "./Base.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

const ValidOperandTypes = [
    ExpressionParsersEnums.ResultType.Player,
    ExpressionParsersEnums.ResultType.PlayerArray,
    ExpressionParsersEnums.ResultType.Unit,
    ExpressionParsersEnums.ResultType.UnitArray,
    ExpressionParsersEnums.ResultType.Tile,
    ExpressionParsersEnums.ResultType.TileArray,
    ExpressionParsersEnums.ResultType.TileBuff,
    ExpressionParsersEnums.ResultType.TileBuffArray,
    ExpressionParsersEnums.ResultType.UnitStatistic,
    ExpressionParsersEnums.ResultType.UnitStatisticArray,
    ExpressionParsersEnums.ResultType.Number,
    ExpressionParsersEnums.ResultType.NumberArray,
];

export class OperatorTernary extends ExpressionParsersNodesBase.Base {
    private _condition  : ExpressionParsersNodesBase.Base;
    private _lhs        : ExpressionParsersNodesBase.Base;              // Left hand side of the operation
    private _rhs        : ExpressionParsersNodesBase.Base;              // Right hand side of the operation

    public constructor(condition: ExpressionParsersNodesBase.Base, lhs: ExpressionParsersNodesBase.Base, rhs: ExpressionParsersNodesBase.Base) {
        super();

        this._condition = condition;
        this._lhs       = lhs;
        this._rhs       = rhs;
    }

    public override eval(ctx: ExpressionParsersContextsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, lambdaArgumentDict: Map<string, ExpressionParsersResultsBase.Base> | null, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        const condition = this._condition.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (!(condition instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Condition is not finite: ${condition}`);
        }

        return condition.num !== 0
            ? this._lhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted)
            : this._rhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsersEnums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsersEnums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsersEnums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsersEnums.ResultType {
        const conditionType = this._condition.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        if (conditionType !== ExpressionParsersEnums.ResultType.Number) {
            throw HelpersMisc.newError(
                ExpressionParsersUtils.getErrorTextForOperandType("?:", 1, ExpressionParsersEnums.ResultType.Number, conditionType),
                UtilsClientErrorCode.ClientErrorCode.EpNodeOperatorTernary_GetResultType_00
            );
        }

        const lhsType = this._lhs.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        if (ValidOperandTypes.indexOf(lhsType) < 0) {
            throw HelpersMisc.newError(
                ExpressionParsersUtils.getErrorTextForOperandType("?:", 2, ValidOperandTypes, lhsType),
                UtilsClientErrorCode.ClientErrorCode.EpNodeOperatorTernary_GetResultType_01
            );
        }

        const rhsType = this._rhs.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        if (rhsType !== lhsType) {
            throw HelpersMisc.newError(
                ExpressionParsersUtils.getErrorTextForOperandType("?:", 3, lhsType, rhsType),
                UtilsClientErrorCode.ClientErrorCode.EpNodeOperatorTernary_GetResultType_02
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
