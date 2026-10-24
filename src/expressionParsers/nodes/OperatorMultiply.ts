import type * as ExpressionParsersContextsBase from "../contexts/Base.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersNodesBase from "./Base.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

export class OperatorMultiply extends ExpressionParsersNodesBase.Base {
    private _lhs: ExpressionParsersNodesBase.Base;              // Left hand side of the operation
    private _rhs: ExpressionParsersNodesBase.Base;              // Right hand side of the operation

    public constructor(lhs: ExpressionParsersNodesBase.Base, rhs: ExpressionParsersNodesBase.Base) {
        super();

        this._lhs = lhs;
        this._rhs = rhs;
    }

    public override eval(ctx: ExpressionParsersContextsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, lambdaArgumentDict: Map<string, ExpressionParsersResultsBase.Base> | null, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        const lhs = this._lhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (!(lhs instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected lhs type.`);
        }

        const rhs = this._rhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (!(rhs instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected rhs type.`);
        }

        return new ExpressionParsersResultsNum.Num(ctx.getWar(), lhs.num * rhs.num);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsersEnums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsersEnums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsersEnums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsersEnums.ResultType {
        const lhsType = this._lhs.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        if (lhsType !== ExpressionParsersEnums.ResultType.Number) {
            throw HelpersMisc.newError(
                ExpressionParsersUtils.getErrorTextForOperandType("*", 1, ExpressionParsersEnums.ResultType.Number, lhsType),
                UtilsClientErrorCode.ClientErrorCode.EpNodeOperatorMultiply_GetResultType_00
            );
        }

        const rhsType = this._rhs.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        if (rhsType !== ExpressionParsersEnums.ResultType.Number) {
            throw HelpersMisc.newError(
                ExpressionParsersUtils.getErrorTextForOperandType("*", 2, ExpressionParsersEnums.ResultType.Number, rhsType),
                UtilsClientErrorCode.ClientErrorCode.EpNodeOperatorMultiply_GetResultType_01
            );
        }

        return ExpressionParsersEnums.ResultType.Number;
    }

    public override getTokensCount(): number {
        return this._lhs.getTokensCount() + this._rhs.getTokensCount() + 1;
    }

    // public override getPriority(): Priority {
    //     return Priority.MultiplyDivideMod;
    // }
    // public override toString(): string {
    //     const lhs           = this._lhs;
    //     const rhs           = this._rhs;
    //     const lhsRawString  = lhs.toString();
    //     const rhsRawString  = rhs.toString();
    //     const priority      = this.getPriority();
    //     const lhsString     = priority > lhs.getPriority() ? `(${lhsRawString})` : lhsRawString;
    //     const rhsString     = priority >= rhs.getPriority() ? `(${rhsRawString})` : rhsRawString;
    //     return `${lhsString} * ${rhsString}`;
    // }
    // public override toProto(): CommonProto.Structure.Expression.INode {
    //     return { nodeBinary: {
    //         operatorCode    : OperatorCode.Multiply,
    //         lhs             : this._lhs.toProto(),
    //         rhs             : this._rhs.toProto(),
    //     } };
    // }
}
