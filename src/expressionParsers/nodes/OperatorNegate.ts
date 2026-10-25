import type { Base } from "../contexts/Base.ts";
import { ContextType, ResultType } from "../Enums.ts";
import { Base as ExpressionParsersNodesBase } from "./Base.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";
import { Num } from "../results/Num.ts";
import { getErrorTextForOperandType } from "../Utils.ts";
import { newError } from "../../helpers/Misc.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class OperatorNegate extends ExpressionParsersNodesBase {
    private _rhs: ExpressionParsersNodesBase;              // Left hand side of the operation

    public constructor(rhs: ExpressionParsersNodesBase) {
        super();

        this._rhs = rhs;
    }

    public override eval(ctx: Base, rootCtx: Base, lambdaArgumentDict: Map<string, ExpressionParsersResultsBase> | null, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        const rhs = this._rhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (!(rhs instanceof Num)) {
            throw newError(`Unexpected rhs type.`);
        }

        return new Num(ctx.getWar(), -rhs.num);
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ContextType;
        lambdaArgumentInfoDict  : Map<string, ResultType> | null;
        localVariableDict       : Map<string, ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ResultType {
        const rhsType = this._rhs.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        if (rhsType !== ResultType.Number) {
            throw newError(
                getErrorTextForOperandType("-", 1, ResultType.Number, rhsType),
                ClientErrorCode.EpNodeOperatorNegate_GetResultType_01
            );
        }

        return ResultType.Number;
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
    //     return `-${rhsString}`;
    // }
    // public override toProto(): CommonProto.Structure.Expression.INode {
    //     return { nodeUnary: {
    //         operatorCode    : OperatorCode.Negate,
    //         rhs             : this._rhs.toProto(),
    //     } };
    // }
}
