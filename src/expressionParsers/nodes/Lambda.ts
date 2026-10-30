import {
    ExpressionParsers_Nodes_Base,
    Utils_ClientErrorCode,
    ExpressionParsers_Enums,
    Lang_Utils,
    Helpers_Misc,
    ExpressionParsers_Results_Lambda,
    Lang_Constants,
    type ExpressionParsers_Contexts_Base,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class Lambda extends ExpressionParsers_Nodes_Base.Base {
    private _argumentNameArray  : string[];
    private _expression         : ExpressionParsers_Nodes_Base.Base;

    public constructor(argumentNameArray: string[], expression: ExpressionParsers_Nodes_Base.Base) {
        super();

        this._argumentNameArray = argumentNameArray;
        this._expression        = expression;
    }

    public evalLambda(rootCtx: ExpressionParsers_Contexts_Base.Base, directLambdaArgumentArray: ExpressionParsers_Results_Base.Base[], indirectLambdaArgumentDict: Map<string, ExpressionParsers_Results_Base.Base> | null, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        const argumentNameArray = this._argumentNameArray;
        if (directLambdaArgumentArray.length !== argumentNameArray.length) {
            throw Helpers_Misc.newError(`Unexpected arguments count: ${directLambdaArgumentArray.length}, ${argumentNameArray.length} expected.`);
        }

        const mergedLambdaArgumentDict = new Map<string, ExpressionParsers_Results_Base.Base>();
        for (const [name, value] of indirectLambdaArgumentDict?.entries() ?? []) {
            mergedLambdaArgumentDict.set(name, value);
        }
        for (let i = 0; i < argumentNameArray.length; ++i) {
            const name = argumentNameArray[i];
            if (mergedLambdaArgumentDict.has(name)) {
                throw Helpers_Misc.newError(`Argument name occupied: ${name}`);
            }
            mergedLambdaArgumentDict.set(name, directLambdaArgumentArray[i]);
        }

        return this._expression.eval(rootCtx, rootCtx, mergedLambdaArgumentDict, localVariableDict, isRestricted);
    }
    public getLambdaResultType({ contextType, directLambdaArgumentInfoArray, indirectLambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType                     : ExpressionParsers_Enums.ContextType;
        directLambdaArgumentInfoArray   : ExpressionParsers_Enums.ResultType[] | null;
        indirectLambdaArgumentInfoDict  : Map<string, ExpressionParsers_Enums.ResultType> | null;
        localVariableDict               : Map<string, ExpressionParsers_Enums.ResultType> | null;
        customCounterNameSet            : Set<string>;
    }): ExpressionParsers_Enums.ResultType {
        const argumentNameArray = this._argumentNameArray;
        if (directLambdaArgumentInfoArray?.length !== argumentNameArray.length) {
            throw Helpers_Misc.newError(
                Lang_Utils.getFormattedText(Lang_Constants.TextType.F0031, argumentNameArray.length, directLambdaArgumentInfoArray?.length),
                Utils_ClientErrorCode.ClientErrorCode.EpNodeLambda_GetLambdaResultType_00,
            );
        }

        const dict = new Map<string, ExpressionParsers_Enums.ResultType>();
        for (const [key, value] of indirectLambdaArgumentInfoDict?.entries() ?? []) {
            dict.set(key, value);
        }
        for (let i = 0; i < argumentNameArray.length; ++i) {
            const name = argumentNameArray[i];
            if (dict.has(name)) {
                throw Helpers_Misc.newError(
                    Lang_Utils.getFormattedText(Lang_Constants.TextType.F0032, name),
                    Utils_ClientErrorCode.ClientErrorCode.EpNodeLambda_GetLambdaResultType_01,
                );
            }
            dict.set(name, directLambdaArgumentInfoArray[i]);
        }

        return this._expression.getResultType({
            contextType            : contextType,
            lambdaArgumentInfoDict : dict,
            localVariableDict      : localVariableDict,
            customCounterNameSet   : customCounterNameSet,
        });
    }
    public getLambdaResultType2({ contextType, directLambdaArgumentInfoArray, indirectLambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType                     : ExpressionParsers_Enums.ContextType;
        directLambdaArgumentInfoArray   : ExpressionParsers_Enums.ResultType[] | null;
        indirectLambdaArgumentInfoDict  : Map<string, ExpressionParsers_Enums.ResultType> | null;
        localVariableDict               : Map<string, ExpressionParsers_Results_Base.Base> | null;
        customCounterNameSet            : Set<string>;
    }): ExpressionParsers_Enums.ResultType {
        if (localVariableDict == null) {
            return this.getLambdaResultType({
                contextType                    : contextType,
                directLambdaArgumentInfoArray  : directLambdaArgumentInfoArray,
                indirectLambdaArgumentInfoDict : indirectLambdaArgumentInfoDict,
                localVariableDict              : null,
                customCounterNameSet           : customCounterNameSet,
            });
        }

        const dict = new Map<string, ExpressionParsers_Enums.ResultType>();
        for (const [name, value] of localVariableDict) {
            dict.set(name, value.getResultType());
        }

        return this.getLambdaResultType({
            contextType                    : contextType,
            directLambdaArgumentInfoArray  : directLambdaArgumentInfoArray,
            indirectLambdaArgumentInfoDict : indirectLambdaArgumentInfoDict,
            localVariableDict              : dict,
            customCounterNameSet           : customCounterNameSet,
        });
    }

    public override eval(ctx: ExpressionParsers_Contexts_Base.Base): ExpressionParsers_Results_Base.Base {
        return new ExpressionParsers_Results_Lambda.Lambda(ctx.getWar(), this);
    }
    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.Lambda;
    }

    public override getTokensCount(): number {
        return this._argumentNameArray.length + this._expression.getTokensCount() + 1;
    }

    // public override getPriority(): Priority {
    //     return Priority.Leaf;
    // }
    // public override toString(): string {
    //     throw Helpers.newError(`Unsupported.`);
    // }
    // public override toProto(): CommonProto.Structure.Expression.INode {
    //     throw Helpers.newError(`Unsupported.`);
    // }
}
