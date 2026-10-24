import type * as ExpressionParsersContextsBase from "../contexts/Base.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersNodesBase from "./Base.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsLambda from "../results/Lambda.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

export class Lambda extends ExpressionParsersNodesBase.Base {
    private _argumentNameArray  : string[];
    private _expression         : ExpressionParsersNodesBase.Base;

    public constructor(argumentNameArray: string[], expression: ExpressionParsersNodesBase.Base) {
        super();

        this._argumentNameArray = argumentNameArray;
        this._expression        = expression;
    }

    public evalLambda(rootCtx: ExpressionParsersContextsBase.Base, directLambdaArgumentArray: ExpressionParsersResultsBase.Base[], indirectLambdaArgumentDict: Map<string, ExpressionParsersResultsBase.Base> | null, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        const argumentNameArray = this._argumentNameArray;
        if (directLambdaArgumentArray.length !== argumentNameArray.length) {
            throw HelpersMisc.newError(`Unexpected arguments count: ${directLambdaArgumentArray.length}, ${argumentNameArray.length} expected.`);
        }

        const mergedLambdaArgumentDict = new Map<string, ExpressionParsersResultsBase.Base>();
        for (const [name, value] of indirectLambdaArgumentDict?.entries() ?? []) {
            mergedLambdaArgumentDict.set(name, value);
        }
        for (let i = 0; i < argumentNameArray.length; ++i) {
            const name = argumentNameArray[i];
            if (mergedLambdaArgumentDict.has(name)) {
                throw HelpersMisc.newError(`Argument name occupied: ${name}`);
            }
            mergedLambdaArgumentDict.set(name, directLambdaArgumentArray[i]);
        }

        return this._expression.eval(rootCtx, rootCtx, mergedLambdaArgumentDict, localVariableDict, isRestricted);
    }
    public getLambdaResultType({ contextType, directLambdaArgumentInfoArray, indirectLambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType                     : ExpressionParsersEnums.ContextType;
        directLambdaArgumentInfoArray   : ExpressionParsersEnums.ResultType[] | null;
        indirectLambdaArgumentInfoDict  : Map<string, ExpressionParsersEnums.ResultType> | null;
        localVariableDict               : Map<string, ExpressionParsersEnums.ResultType> | null;
        customCounterNameSet            : Set<string>;
    }): ExpressionParsersEnums.ResultType {
        const argumentNameArray = this._argumentNameArray;
        if (directLambdaArgumentInfoArray?.length !== argumentNameArray.length) {
            throw HelpersMisc.newError(
                LangUtils.getFormattedText(LangConstants.TextType.F0031, argumentNameArray.length, directLambdaArgumentInfoArray?.length),
                UtilsClientErrorCode.ClientErrorCode.EpNodeLambda_GetLambdaResultType_00
            );
        }

        const dict = new Map<string, ExpressionParsersEnums.ResultType>();
        for (const [key, value] of indirectLambdaArgumentInfoDict?.entries() ?? []) {
            dict.set(key, value);
        }
        for (let i = 0; i < argumentNameArray.length; ++i) {
            const name = argumentNameArray[i];
            if (dict.has(name)) {
                throw HelpersMisc.newError(
                    LangUtils.getFormattedText(LangConstants.TextType.F0032, name),
                    UtilsClientErrorCode.ClientErrorCode.EpNodeLambda_GetLambdaResultType_01
                );
            }
            dict.set(name, directLambdaArgumentInfoArray[i]);
        }

        return this._expression.getResultType({
            contextType             : contextType,
            lambdaArgumentInfoDict  : dict,
            localVariableDict       : localVariableDict,
            customCounterNameSet    : customCounterNameSet,
        });
    }
    public getLambdaResultType2({ contextType, directLambdaArgumentInfoArray, indirectLambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType                     : ExpressionParsersEnums.ContextType;
        directLambdaArgumentInfoArray   : ExpressionParsersEnums.ResultType[] | null;
        indirectLambdaArgumentInfoDict  : Map<string, ExpressionParsersEnums.ResultType> | null;
        localVariableDict               : Map<string, ExpressionParsersResultsBase.Base> | null;
        customCounterNameSet            : Set<string>;
    }): ExpressionParsersEnums.ResultType {
        if (localVariableDict == null) {
            return this.getLambdaResultType({
                contextType                     : contextType,
                directLambdaArgumentInfoArray   : directLambdaArgumentInfoArray,
                indirectLambdaArgumentInfoDict  : indirectLambdaArgumentInfoDict,
                localVariableDict               : null,
                customCounterNameSet            : customCounterNameSet,
            });
        }

        const dict = new Map<string, ExpressionParsersEnums.ResultType>();
        for (const [name, value] of localVariableDict) {
            dict.set(name, value.getResultType());
        }

        return this.getLambdaResultType({
            contextType                     : contextType,
            directLambdaArgumentInfoArray   : directLambdaArgumentInfoArray,
            indirectLambdaArgumentInfoDict  : indirectLambdaArgumentInfoDict,
            localVariableDict               : dict,
            customCounterNameSet            : customCounterNameSet,
        });
    }

    public override eval(ctx: ExpressionParsersContextsBase.Base): ExpressionParsersResultsBase.Base {
        return new ExpressionParsersResultsLambda.Lambda(ctx.getWar(), this);
    }
    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.Lambda;
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
