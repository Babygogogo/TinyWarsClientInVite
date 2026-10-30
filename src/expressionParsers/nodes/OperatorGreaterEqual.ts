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

export class OperatorGreaterEqual extends ExpressionParsers_Nodes_Base.Base {
    private _lhs: ExpressionParsers_Nodes_Base.Base;              // Left hand side of the operation
    private _rhs: ExpressionParsers_Nodes_Base.Base;              // Right hand side of the operation

    public constructor(lhs: ExpressionParsers_Nodes_Base.Base, rhs: ExpressionParsers_Nodes_Base.Base) {
        super();

        this._lhs = lhs;
        this._rhs = rhs;
    }

    public override eval(ctx: ExpressionParsers_Contexts_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, lambdaArgumentDict: Map<string, ExpressionParsers_Results_Base.Base> | null, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        const lhs = this._lhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (!(lhs instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected lhs type.`);
        }

        const rhs = this._rhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (!(rhs instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected rhs type.`);
        }

        return new ExpressionParsers_Results_Num.Num(ctx.getWar(), lhs.num >= rhs.num ? 1 : 0);
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsers_Enums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsers_Enums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsers_Enums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsers_Enums.ResultType {
        const lhsType = this._lhs.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        if (lhsType !== ExpressionParsers_Enums.ResultType.Number) {
            throw Helpers_Misc.newError(
                ExpressionParsers_Utils.getErrorTextForOperandType(">=", 1, ExpressionParsers_Enums.ResultType.Number, lhsType),
                Utils_ClientErrorCode.ClientErrorCode.EpNodeOperatorGreaterEqual_GetResultType_00
            );
        }

        const rhsType = this._rhs.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        if (rhsType !== ExpressionParsers_Enums.ResultType.Number) {
            throw Helpers_Misc.newError(
                ExpressionParsers_Utils.getErrorTextForOperandType(">=", 2, ExpressionParsers_Enums.ResultType.Number, rhsType),
                Utils_ClientErrorCode.ClientErrorCode.EpNodeOperatorGreaterEqual_GetResultType_01
            );
        }

        return ExpressionParsers_Enums.ResultType.Number;
    }

    public override getTokensCount(): number {
        return this._lhs.getTokensCount() + this._rhs.getTokensCount() + 1;
    }

    // public override getPriority(): Priority {
    //     return Priority.Comparator;
    // }
    // public override toString(): string {
    //     const lhs           = this._lhs;
    //     const rhs           = this._rhs;
    //     const lhsRawString  = lhs.toString();
    //     const rhsRawString  = rhs.toString();
    //     const priority      = this.getPriority();
    //     const lhsString     = priority > lhs.getPriority() ? `(${lhsRawString})` : lhsRawString;
    //     const rhsString     = priority >= rhs.getPriority() ? `(${rhsRawString})` : rhsRawString;
    //     return `${lhsString} >= ${rhsString}`;
    // }
    // public override toProto(): CommonProto.Structure.Expression.INode {
    //     return { nodeBinary: {
    //         operatorCode    : OperatorCode.GreaterEqual,
    //         lhs             : this._lhs.toProto(),
    //         rhs             : this._rhs.toProto(),
    //     } };
    // }
}
