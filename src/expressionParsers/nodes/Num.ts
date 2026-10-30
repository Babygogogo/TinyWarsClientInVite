import type { Base as ContextsBase } from "../contexts/Base.ts";
import {
    ContextType,
    ResultType,
} from "../Enums.ts";
import { Base } from "./Base.ts";
import type { Base as ResultsBase } from "../results/Base.ts";
import { Num as ResultsNum } from "../results/Num.ts";

export class Num extends Base {
    private _number: number;             // The number

    public constructor(num: number) {
        super();

        this._number = num;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public override eval(ctx: ContextsBase): ResultsBase {
        return new ResultsNum(ctx.getWar(), this._number);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ContextType;
        lambdaArgumentInfoDict  : Map<string, ResultType> | null;
        localVariableDict       : Map<string, ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ResultType {
        return ResultType.Number;
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
