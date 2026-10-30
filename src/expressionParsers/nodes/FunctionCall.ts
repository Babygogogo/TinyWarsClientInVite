import type { Base as ContextsBase } from "../contexts/Base.ts";
import type {
    ContextType,
    ResultType,
} from "../Enums.ts";
import { Base } from "./Base.ts";
import type { Base as ResultsBase } from "../results/Base.ts";
import { getFunctionInfoDict } from "../Utils.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getFormattedText } from "../../lang/Utils.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class FunctionCall extends Base {
    private _identifierName : string;
    private _argumentArray  : Base[];

    public constructor(identifierName: string, argumentArray: Base[]) {
        super();

        this._identifierName    = identifierName;
        this._argumentArray     = argumentArray;
    }

    public override eval(ctx: ContextsBase, rootCtx: ContextsBase, lambdaArgumentDict: Map<string, ResultsBase> | null, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsBase {
        // Evaluate all arguments
        const argValues = new Array<ResultsBase>(this._argumentArray.length);
        for (let i = 0; i < this._argumentArray.length; i++) {
            argValues[i] = this._argumentArray[i].eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        }

        // Call the function
        return ctx.callFunction(this._identifierName, argValues, rootCtx, localVariableDict, isRestricted);
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ContextType;
        lambdaArgumentInfoDict  : Map<string, ResultType> | null;
        localVariableDict       : Map<string, ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ResultType {
        const name          = this._identifierName;
        const resultType    = getFunctionInfoDict(contextType).get(name)?.getResultType(this._argumentArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet);
        if (resultType != null) {
            return resultType;
        } else {
            const errorCode = ClientErrorCode.EpNodeFunctionCall_GetResultType_00;
            throw newError(
                getFormattedText(TextType.F0024, name),
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
