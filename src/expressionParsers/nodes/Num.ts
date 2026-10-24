import type * as ExpressionParsersContextsBase from "../contexts/Base.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersNodesBase from "./Base.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";

export class Num extends ExpressionParsersNodesBase.Base {
    private _number: number;             // The number

    public constructor(num: number) {
        super();

        this._number = num;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public override eval(ctx: ExpressionParsersContextsBase.Base): ExpressionParsersResultsBase.Base {
        return new ExpressionParsersResultsNum.Num(ctx.getWar(), this._number);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsersEnums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsersEnums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsersEnums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.Number;
    }

    public override getTokensCount(): number {
        return 1;
    }

    // public override getPriority(): Priority {
    //     return Priority.Leaf;
    // }
    // public override toString(): string {
    //     return `${this._number}`;
    // }
    // public override toProto(): CommonProto.Structure.Expression.INode {
    //     return { nodeNumber: {
    //         number  : this._number,
    //     } };
    // }
}
