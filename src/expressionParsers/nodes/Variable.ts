import type { Base as ContextsBase } from "../contexts/Base.ts";
import {
    ContextType,
    ResultType,
} from "../Enums.ts";
import { Base } from "./Base.ts";
import type { Base as ResultsBase } from "../results/Base.ts";
import { Num } from "../results/Num.ts";
import { getVariableInfoDict } from "../Utils.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getFormattedText } from "../../lang/Utils.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class Variable extends Base {
    private _identifierName: string;

    public constructor(identifierName: string) {
        super();

        this._identifierName = identifierName;
    }

    public override eval(ctx: ContextsBase, rootCtx: ContextsBase, lambdaArgumentDict: Map<string, ResultsBase> | null, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsBase {
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
            return new Num(war, war.getWarEventManager().getCustomCounter(customCounterId));
        }

        return ctx.resolveVariable(name, isRestricted);
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ContextType;
        lambdaArgumentInfoDict  : Map<string, ResultType> | null;
        localVariableDict       : Map<string, ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ResultType {
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
            return customCounterNameSet.has(name.substring(3)) ? ResultType.Number : ResultType.Unknown;
        }

        const contextVariable = getVariableInfoDict(contextType).get(name)?.resultType;
        if (contextVariable != null) {
            return contextVariable;
        }

        throw newError(getFormattedText(TextType.F0021, name), ClientErrorCode.EpNodeVariable_GetResultType_00);
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
