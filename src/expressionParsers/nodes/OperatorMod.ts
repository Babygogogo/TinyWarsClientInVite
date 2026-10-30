import type { Base as ContextsBase } from "../contexts/Base.ts";
import {
    ContextType,
    ResultType,
} from "../Enums.ts";
import { Base } from "./Base.ts";
import type { Base as ResultsBase } from "../results/Base.ts";
import { Num } from "../results/Num.ts";
import { getErrorTextForOperandType } from "../Utils.ts";
import { newError } from "../../helpers/Misc.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class OperatorMod extends Base {
    private _lhs: Base;              // Left hand side of the operation
    private _rhs: Base;              // Right hand side of the operation

    public constructor(lhs: Base, rhs: Base) {
        super();

        this._lhs = lhs;
        this._rhs = rhs;
    }

    public override eval(ctx: ContextsBase, rootCtx: ContextsBase, lambdaArgumentDict: Map<string, ResultsBase> | null, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsBase {
        const lhs = this._lhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (!(lhs instanceof Num)) {
            throw newError(`Unexpected lhs type.`);
        }

        const rhs = this._rhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (!(rhs instanceof Num)) {
            throw newError(`Unexpected rhs type.`);
        }

        return new Num(ctx.getWar(), lhs.num % rhs.num);
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ContextType;
        lambdaArgumentInfoDict  : Map<string, ResultType> | null;
        localVariableDict       : Map<string, ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ResultType {
        const lhsType = this._lhs.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        if (lhsType !== ResultType.Number) {
            throw newError(
                getErrorTextForOperandType("%", 1, ResultType.Number, lhsType),
                ClientErrorCode.EpNodeOperatorMod_GetResultType_00
            );
        }

        const rhsType = this._rhs.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        if (rhsType !== ResultType.Number) {
            throw newError(
                getErrorTextForOperandType("%", 2, ResultType.Number, rhsType),
                ClientErrorCode.EpNodeOperatorMod_GetResultType_01
            );
        }

        return ResultType.Number;
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
    //     return `${lhsString} % ${rhsString}`;
    // }
    // public override toProto(): CommonProto.Structure.Expression.INode {
    //     return { nodeBinary: {
    //         operatorCode    : OperatorCode.Mod,
    //         lhs             : this._lhs.toProto(),
    //         rhs             : this._rhs.toProto(),
    //     } };
    // }
}
