import {
    ExpressionParsers_Nodes_Base,
    Utils_ClientErrorCode,
    ExpressionParsers_Enums,
    ExpressionParsers_Utils,
    Helpers_Misc,
    ExpressionParsers_Results_Num,
    type ExpressionParsers_Contexts_Base,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

const ValidOperandTypes = [
    ExpressionParsers_Enums.ResultType.Player,
    ExpressionParsers_Enums.ResultType.PlayerArray,
    ExpressionParsers_Enums.ResultType.Unit,
    ExpressionParsers_Enums.ResultType.UnitArray,
    ExpressionParsers_Enums.ResultType.Tile,
    ExpressionParsers_Enums.ResultType.TileArray,
    ExpressionParsers_Enums.ResultType.TileBuff,
    ExpressionParsers_Enums.ResultType.TileBuffArray,
    ExpressionParsers_Enums.ResultType.UnitStatistic,
    ExpressionParsers_Enums.ResultType.UnitStatisticArray,
    ExpressionParsers_Enums.ResultType.Number,
    ExpressionParsers_Enums.ResultType.NumberArray,
];

export class OperatorTernary extends ExpressionParsers_Nodes_Base.Base {
    private _condition  : ExpressionParsers_Nodes_Base.Base;
    private _lhs        : ExpressionParsers_Nodes_Base.Base;              // Left hand side of the operation
    private _rhs        : ExpressionParsers_Nodes_Base.Base;              // Right hand side of the operation

    public constructor(condition: ExpressionParsers_Nodes_Base.Base, lhs: ExpressionParsers_Nodes_Base.Base, rhs: ExpressionParsers_Nodes_Base.Base) {
        super();

        this._condition = condition;
        this._lhs       = lhs;
        this._rhs       = rhs;
    }

    public override eval(ctx: ExpressionParsers_Contexts_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, lambdaArgumentDict: Map<string, ExpressionParsers_Results_Base.Base> | null, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        const condition = this._condition.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (!(condition instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Condition is not finite: ${condition}`);
        }

        return condition.num !== 0
            ? this._lhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted)
            : this._rhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsers_Enums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsers_Enums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsers_Enums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsers_Enums.ResultType {
        const conditionType = this._condition.getResultType({
            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
        });
        if (conditionType !== ExpressionParsers_Enums.ResultType.Number) {
            throw Helpers_Misc.newError(
                ExpressionParsers_Utils.getErrorTextForOperandType("?:", 1, ExpressionParsers_Enums.ResultType.Number, conditionType),
                Utils_ClientErrorCode.ClientErrorCode.EpNodeOperatorTernary_GetResultType_00,
            );
        }

        const lhsType = this._lhs.getResultType({
            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
        });
        if (ValidOperandTypes.indexOf(lhsType) < 0) {
            throw Helpers_Misc.newError(
                ExpressionParsers_Utils.getErrorTextForOperandType("?:", 2, ValidOperandTypes, lhsType),
                Utils_ClientErrorCode.ClientErrorCode.EpNodeOperatorTernary_GetResultType_01,
            );
        }

        const rhsType = this._rhs.getResultType({
            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
        });
        if (rhsType !== lhsType) {
            throw Helpers_Misc.newError(
                ExpressionParsers_Utils.getErrorTextForOperandType("?:", 3, lhsType, rhsType),
                Utils_ClientErrorCode.ClientErrorCode.EpNodeOperatorTernary_GetResultType_02,
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
