import type * as ExpressionParsersContextsBase from "../contexts/Base.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersNodesBase from "./Base.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

export class Variable extends ExpressionParsersNodesBase.Base {
    private _identifierName: string;

    public constructor(identifierName: string) {
        super();

        this._identifierName = identifierName;
    }

    public override eval(ctx: ExpressionParsersContextsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, lambdaArgumentDict: Map<string, ExpressionParsersResultsBase.Base> | null, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
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
            return new ExpressionParsersResultsNum.Num(war, war.getWarEventManager().getCustomCounter(customCounterId));
        }

        return ctx.resolveVariable(name, isRestricted);
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsersEnums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsersEnums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsersEnums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsersEnums.ResultType {
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
            return customCounterNameSet.has(name.substring(3)) ? ExpressionParsersEnums.ResultType.Number : ExpressionParsersEnums.ResultType.Unknown;
        }

        const contextVariable = ExpressionParsersUtils.getVariableInfoDict(contextType).get(name)?.resultType;
        if (contextVariable != null) {
            return contextVariable;
        }

        throw HelpersMisc.newError(LangUtils.getFormattedText(LangConstants.TextType.F0021, name), UtilsClientErrorCode.ClientErrorCode.EpNodeVariable_GetResultType_00);
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
