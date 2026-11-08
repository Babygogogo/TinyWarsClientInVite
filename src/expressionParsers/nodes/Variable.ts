import {
    ExpressionParsers_Nodes_Base,
    Utils_ClientErrorCode,
    ExpressionParsers_Enums,
    Lang_Utils,
    ExpressionParsers_Utils,
    Helpers_Misc,
    ExpressionParsers_Results_Num,
    Lang_Constants,
    type ExpressionParsers_Contexts_Base,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class Variable extends ExpressionParsers_Nodes_Base.Base {
    private readonly _identifierName: string;

    public constructor(identifierName: string) {
        super();

        this._identifierName = identifierName;
    }

    public override eval(ctx: ExpressionParsers_Contexts_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, lambdaArgumentDict: Map<string, ExpressionParsers_Results_Base.Base> | null, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        const name              = this._identifierName;
        const lambdaArgument    = lambdaArgumentDict?.get(name);
        if (lambdaArgument != null) {
            return lambdaArgument;
        }

        const localVariable = localVariableDict?.get(name);
        if (localVariable != null) {
            return localVariable;
        }

        if (name.startsWith("cc_")) {
            const war               = ctx.getWar();
            const customCounterName = name.substring(3);
            const customCounterId   = war.getCommonSettingManager().getInstanceWarRule().getWarEventFullData()?.getCustomCounterNameArray()?.find(v => (v.getName() ?? ``) === customCounterName)?.getId() ?? 0;
            return new ExpressionParsers_Results_Num.Num(war, war.getWarEventManager().getCustomCounter(customCounterId));
        }

        return ctx.resolveVariable(name, isRestricted);
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsers_Enums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsers_Enums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsers_Enums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsers_Enums.ResultType {
        const name              = this._identifierName;
        const lambdaArgument    = lambdaArgumentInfoDict?.get(name);
        if (lambdaArgument != null) {
            return lambdaArgument;
        }

        const localVariable = localVariableDict?.get(name);
        if (localVariable != null) {
            return localVariable;
        }

        if (name.startsWith("cc_")) {
            return customCounterNameSet.has(name.substring(3)) ? ExpressionParsers_Enums.ResultType.Number : ExpressionParsers_Enums.ResultType.Unknown;
        }

        const contextVariable = ExpressionParsers_Utils.getVariableInfoDict(contextType).get(name)?.resultType;
        if (contextVariable != null) {
            return contextVariable;
        }

        throw Helpers_Misc.newError(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0021, name), Utils_ClientErrorCode.ClientErrorCode.EpNodeVariable_GetResultType_00);
    }

    public override getTokensCount(): number {
        return 1;
    }
    // public override getPriority(): Priority {
    //     return Priority.Leaf;
    // }
    // public override toString(): string {
    //     return getIdentifierName(this._identifierName) ?? Lang.ErrorTextForUndefined;
    // }
    // public override toProto(): CommonProto.Structure.Expression.INode {
    //     return { nodeVariable: {
    //         identifierCode  : this._identifierName,
    //     }, };
    // }
}
