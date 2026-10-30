import {
    ExpressionParsers_Nodes_Base,
    ExpressionParsers_Enums,
    ExpressionParsers_Results_Num,
    type ExpressionParsers_Contexts_Base,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class Num extends ExpressionParsers_Nodes_Base.Base {
    private _number: number;             // The number

    public constructor(num: number) {
        super();

        this._number = num;
    }

     
    public override eval(ctx: ExpressionParsers_Contexts_Base.Base): ExpressionParsers_Results_Base.Base {
        return new ExpressionParsers_Results_Num.Num(ctx.getWar(), this._number);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsers_Enums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsers_Enums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsers_Enums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.Number;
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
