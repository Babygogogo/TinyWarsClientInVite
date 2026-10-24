import type * as ExpressionParsersContextsBase from "../contexts/Base.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersNodesBase from "./Base.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

export class OperatorNot extends ExpressionParsersNodesBase.Base {
    private _rhs: ExpressionParsersNodesBase.Base;              // Left hand side of the operation

    public constructor(rhs: ExpressionParsersNodesBase.Base) {
        super();

        this._rhs = rhs;
    }

    public override eval(ctx: ExpressionParsersContextsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, lambdaArgumentDict: Map<string, ExpressionParsersResultsBase.Base> | null, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        const rhs = this._rhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (!(rhs instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected rhs type.`);
        }

        return new ExpressionParsersResultsNum.Num(ctx.getWar(), rhs.num === 0 ? 1 : 0);
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsersEnums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsersEnums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsersEnums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsersEnums.ResultType {
        const rhsType = this._rhs.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        if (rhsType !== ExpressionParsersEnums.ResultType.Number) {
            throw HelpersMisc.newError(
                ExpressionParsersUtils.getErrorTextForOperandType("!", 1, ExpressionParsersEnums.ResultType.Number, rhsType),
                UtilsClientErrorCode.ClientErrorCode.EpNodeOperatorNot_GetResultType_01
            );
        }

        return ExpressionParsersEnums.ResultType.Number;
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
