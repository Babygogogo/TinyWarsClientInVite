import type * as ExpressionParsersContextsBase from "../contexts/Base.ts";
import type * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersNodesBase from "./Base.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

export class FunctionCall extends ExpressionParsersNodesBase.Base {
    private _identifierName : string;
    private _argumentArray  : ExpressionParsersNodesBase.Base[];

    public constructor(identifierName: string, argumentArray: ExpressionParsersNodesBase.Base[]) {
        super();

        this._identifierName    = identifierName;
        this._argumentArray     = argumentArray;
    }

    public override eval(ctx: ExpressionParsersContextsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, lambdaArgumentDict: Map<string, ExpressionParsersResultsBase.Base> | null, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        // Evaluate all arguments
        const argValues = new Array<ExpressionParsersResultsBase.Base>(this._argumentArray.length);
        for (let i = 0; i < this._argumentArray.length; i++) {
            argValues[i] = this._argumentArray[i].eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        }

        // Call the function
        return ctx.callFunction(this._identifierName, argValues, rootCtx, localVariableDict, isRestricted);
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsersEnums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsersEnums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsersEnums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsersEnums.ResultType {
        const name          = this._identifierName;
        const resultType    = ExpressionParsersUtils.getFunctionInfoDict(contextType).get(name)?.getResultType(this._argumentArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet);
        if (resultType != null) {
            return resultType;
        } else {
            const errorCode = UtilsClientErrorCode.ClientErrorCode.EpNodeFunctionCall_GetResultType_00;
            throw HelpersMisc.newError(
                LangUtils.getFormattedText(LangConstants.TextType.F0024, name),
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
