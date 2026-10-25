import type { Base } from "../contexts/Base.ts";
import { ContextType, ResultType } from "../Enums.ts";
import { Base as ExpressionParsersNodesBase } from "./Base.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";
import { Lambda as ExpressionParsersResultsLambda } from "../results/Lambda.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getFormattedText } from "../../lang/Utils.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class Lambda extends ExpressionParsersNodesBase {
    private _argumentNameArray  : string[];
    private _expression         : ExpressionParsersNodesBase;

    public constructor(argumentNameArray: string[], expression: ExpressionParsersNodesBase) {
        super();

        this._argumentNameArray = argumentNameArray;
        this._expression        = expression;
    }

    public evalLambda(rootCtx: Base, directLambdaArgumentArray: ExpressionParsersResultsBase[], indirectLambdaArgumentDict: Map<string, ExpressionParsersResultsBase> | null, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        const argumentNameArray = this._argumentNameArray;
        if (directLambdaArgumentArray.length !== argumentNameArray.length) {
            throw newError(`Unexpected arguments count: ${directLambdaArgumentArray.length}, ${argumentNameArray.length} expected.`);
        }

        const mergedLambdaArgumentDict = new Map<string, ExpressionParsersResultsBase>();
        for (const [name, value] of indirectLambdaArgumentDict?.entries() ?? []) {
            mergedLambdaArgumentDict.set(name, value);
        }
        for (let i = 0; i < argumentNameArray.length; ++i) {
            const name = argumentNameArray[i];
            if (mergedLambdaArgumentDict.has(name)) {
                throw newError(`Argument name occupied: ${name}`);
            }
            mergedLambdaArgumentDict.set(name, directLambdaArgumentArray[i]);
        }

        return this._expression.eval(rootCtx, rootCtx, mergedLambdaArgumentDict, localVariableDict, isRestricted);
    }
    public getLambdaResultType({ contextType, directLambdaArgumentInfoArray, indirectLambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType                     : ContextType;
        directLambdaArgumentInfoArray   : ResultType[] | null;
        indirectLambdaArgumentInfoDict  : Map<string, ResultType> | null;
        localVariableDict               : Map<string, ResultType> | null;
        customCounterNameSet            : Set<string>;
    }): ResultType {
        const argumentNameArray = this._argumentNameArray;
        if (directLambdaArgumentInfoArray?.length !== argumentNameArray.length) {
            throw newError(
                getFormattedText(TextType.F0031, argumentNameArray.length, directLambdaArgumentInfoArray?.length),
                ClientErrorCode.EpNodeLambda_GetLambdaResultType_00
            );
        }

        const dict = new Map<string, ResultType>();
        for (const [key, value] of indirectLambdaArgumentInfoDict?.entries() ?? []) {
            dict.set(key, value);
        }
        for (let i = 0; i < argumentNameArray.length; ++i) {
            const name = argumentNameArray[i];
            if (dict.has(name)) {
                throw newError(
                    getFormattedText(TextType.F0032, name),
                    ClientErrorCode.EpNodeLambda_GetLambdaResultType_01
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
        contextType                     : ContextType;
        directLambdaArgumentInfoArray   : ResultType[] | null;
        indirectLambdaArgumentInfoDict  : Map<string, ResultType> | null;
        localVariableDict               : Map<string, ExpressionParsersResultsBase> | null;
        customCounterNameSet            : Set<string>;
    }): ResultType {
        if (localVariableDict == null) {
            return this.getLambdaResultType({
                contextType                     : contextType,
                directLambdaArgumentInfoArray   : directLambdaArgumentInfoArray,
                indirectLambdaArgumentInfoDict  : indirectLambdaArgumentInfoDict,
                localVariableDict               : null,
                customCounterNameSet            : customCounterNameSet,
            });
        }

        const dict = new Map<string, ResultType>();
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

    public override eval(ctx: Base): ExpressionParsersResultsBase {
        return new ExpressionParsersResultsLambda(ctx.getWar(), this);
    }
    public override getResultType(): ResultType {
        return ResultType.Lambda;
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
