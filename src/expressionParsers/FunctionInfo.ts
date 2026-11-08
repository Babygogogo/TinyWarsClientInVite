import {
    ExpressionParsers_Enums,
    type ExpressionParsers_Nodes_Base,
    type Lang_Constants,
} from "../internal.ts";

type FunctionResultTypeGetter = (argArray: ExpressionParsers_Nodes_Base.Base[], contextType: ExpressionParsers_Enums.ContextType, lambdaArgumentInfoDict: Map<string, ExpressionParsers_Enums.ResultType> | null, localVariableDict: Map<string, ExpressionParsers_Enums.ResultType> | null, customCounterNameSet: Set<string>) => ExpressionParsers_Enums.ResultType;
export class FunctionInfo {
    public readonly desc            : Lang_Constants.TextType;
    public readonly getResultType   : FunctionResultTypeGetter;
    public readonly isExtension     : boolean;

    public constructor(desc: Lang_Constants.TextType, getResultType: FunctionResultTypeGetter, isExtension = false) {
        this.desc           = desc;
        this.getResultType  = getResultType;
        this.isExtension    = isExtension;
    }

    public checkIsParamValid(argArray: ExpressionParsers_Nodes_Base.Base[], contextType: ExpressionParsers_Enums.ContextType, lambdaArgumentInfoDict: Map<string, ExpressionParsers_Enums.ResultType> | null, localVariableDict: Map<string, ExpressionParsers_Enums.ResultType> | null, customCounterNameSet: Set<string>):boolean {
        try {
            return this.getResultType(argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) !== ExpressionParsers_Enums.ResultType.Unknown;
        } catch (e) {
            return false;
        }
    }
}
