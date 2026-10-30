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

export class OperatorNot extends ExpressionParsers_Nodes_Base.Base {
    private _rhs: ExpressionParsers_Nodes_Base.Base;              // Left hand side of the operation

    public constructor(rhs: ExpressionParsers_Nodes_Base.Base) {
        super();

        this._rhs = rhs;
    }

    public override eval(ctx: ExpressionParsers_Contexts_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, lambdaArgumentDict: Map<string, ExpressionParsers_Results_Base.Base> | null, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        const rhs = this._rhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (!(rhs instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected rhs type.`);
        }

        return new ExpressionParsers_Results_Num.Num(ctx.getWar(), rhs.num === 0 ? 1 : 0);
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsers_Enums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsers_Enums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsers_Enums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsers_Enums.ResultType {
        const rhsType = this._rhs.getResultType({
            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
        });
        if (rhsType !== ExpressionParsers_Enums.ResultType.Number) {
            throw Helpers_Misc.newError(
                ExpressionParsers_Utils.getErrorTextForOperandType("!", 1, ExpressionParsers_Enums.ResultType.Number, rhsType),
                Utils_ClientErrorCode.ClientErrorCode.EpNodeOperatorNot_GetResultType_01,
            );
        }

        return ExpressionParsers_Enums.ResultType.Number;
    }

    public override getTokensCount(): number {
        return this._rhs.getTokensCount() + 1;
    }

    // public override getPriority(): Priority {
    //     return Priority.Unary;
    // }
    // public override toString(): string {
    //     const rhs           = this._rhs;
    //     const rhsRawString  = rhs.toString();
    //     const rhsString     = this.getPriority() >= rhs.getPriority() ? `(${rhsRawString})` : rhsRawString;
    //     return `!${rhsString}`;
    // }
    // public toProto(): CommonProto.Structure.Expression.INode {
    //     return { nodeUnary: {
    //         operatorCode    : OperatorCode.Not,
    //         rhs             : this._rhs.toProto(),
    //     } };
    // }
}
