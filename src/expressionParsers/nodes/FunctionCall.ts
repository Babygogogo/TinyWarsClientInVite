import {
    ExpressionParsers_Nodes_Base,
    Utils_ClientErrorCode,
    Lang_Utils,
    ExpressionParsers_Utils,
    Helpers_Misc,
    Lang_Constants,
    type ExpressionParsers_Contexts_Base,
    type ExpressionParsers_Enums,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class FunctionCall extends ExpressionParsers_Nodes_Base.Base {
    private _identifierName : string;
    private _argumentArray  : ExpressionParsers_Nodes_Base.Base[];

    public constructor(identifierName: string, argumentArray: ExpressionParsers_Nodes_Base.Base[]) {
        super();

        this._identifierName    = identifierName;
        this._argumentArray     = argumentArray;
    }

    public override eval(ctx: ExpressionParsers_Contexts_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, lambdaArgumentDict: Map<string, ExpressionParsers_Results_Base.Base> | null, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        // Evaluate all arguments
        const argValues = new Array<ExpressionParsers_Results_Base.Base>(this._argumentArray.length);
        for (let i = 0; i < this._argumentArray.length; i++) {
            argValues[i] = this._argumentArray[i].eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        }

        // Call the function
        return ctx.callFunction(this._identifierName, argValues, rootCtx, localVariableDict, isRestricted);
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsers_Enums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsers_Enums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsers_Enums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsers_Enums.ResultType {
        const name          = this._identifierName;
        const resultType    = ExpressionParsers_Utils.getFunctionInfoDict(contextType).get(name)?.getResultType(this._argumentArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet);
        if (resultType != null) {
            return resultType;
        } else {
            const errorCode = Utils_ClientErrorCode.ClientErrorCode.EpNodeFunctionCall_GetResultType_00;
            throw Helpers_Misc.newError(
                Lang_Utils.getFormattedText(Lang_Constants.TextType.F0024, name),
                errorCode,
            );
        }
    }

    public override getTokensCount(): number {
        let count = 1 + 1;
        for (const arg of this._argumentArray) {
            count += arg.getTokensCount();
        }
        return count;
    }

    // public override getPriority(): Priority {
    //     return Priority.Leaf;
    // }
    // public override toString(): string {
    //     return `${getIdentifierName(this._identifierName) ?? Lang.ErrorTextForUndefined}(${this._argumentArray.map(v => v.toString()).join(`, `)})`;
    // }
    // public override toProto(): CommonProto.Structure.Expression.INode {
    //     return { nodeFunctionCall: {
    //         identifierCode  : this._identifierName,
    //         argumentArray   : this._argumentArray.map(v => v.toProto()),
    //     } };
    // }
}
