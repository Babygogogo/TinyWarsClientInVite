import * as ExpressionParsersEnums from "./Enums.ts";
import type * as ExpressionParsersNodesBase from "./nodes/Base.ts";
import type * as LangConstants from "../lang/Constants.ts";

type FunctionResultTypeGetter = (argArray: ExpressionParsersNodesBase.Base[], contextType: ExpressionParsersEnums.ContextType, lambdaArgumentInfoDict: Map<string, ExpressionParsersEnums.ResultType> | null, localVariableDict: Map<string, ExpressionParsersEnums.ResultType> | null, customCounterNameSet: Set<string>) => ExpressionParsersEnums.ResultType;
export class FunctionInfo {
    public readonly desc            : LangConstants.TextType;
    public readonly getResultType   : FunctionResultTypeGetter;
    public readonly isExtension     : boolean;

    public constructor(desc: LangConstants.TextType, getResultType: FunctionResultTypeGetter, isExtension = false) {
        this.desc           = desc;
        this.getResultType  = getResultType;
        this.isExtension    = isExtension;
    }

    public checkIsParamValid(argArray: ExpressionParsersNodesBase.Base[], contextType: ExpressionParsersEnums.ContextType, lambdaArgumentInfoDict: Map<string, ExpressionParsersEnums.ResultType> | null, localVariableDict: Map<string, ExpressionParsersEnums.ResultType> | null, customCounterNameSet: Set<string>):boolean {
        try {
            return this.getResultType(argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) !== ExpressionParsersEnums.ResultType.Unknown;
        } catch (e) {
            return false;
        }
    }
}
