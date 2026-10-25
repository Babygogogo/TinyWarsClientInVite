import { ContextType, ResultType } from "./Enums.ts";
import type { Base } from "./nodes/Base.ts";
import type { TextType } from "../lang/Constants.ts";

type FunctionResultTypeGetter = (argArray: Base[], contextType: ContextType, lambdaArgumentInfoDict: Map<string, ResultType> | null, localVariableDict: Map<string, ResultType> | null, customCounterNameSet: Set<string>) => ResultType;
export class FunctionInfo {
    public readonly desc            : TextType;
    public readonly getResultType   : FunctionResultTypeGetter;
    public readonly isExtension     : boolean;

    public constructor(desc: TextType, getResultType: FunctionResultTypeGetter, isExtension = false) {
        this.desc           = desc;
        this.getResultType  = getResultType;
        this.isExtension    = isExtension;
    }

    public checkIsParamValid(argArray: Base[], contextType: ContextType, lambdaArgumentInfoDict: Map<string, ResultType> | null, localVariableDict: Map<string, ResultType> | null, customCounterNameSet: Set<string>):boolean {
        try {
            return this.getResultType(argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) !== ResultType.Unknown;
        } catch (e) {
            return false;
        }
    }
}
