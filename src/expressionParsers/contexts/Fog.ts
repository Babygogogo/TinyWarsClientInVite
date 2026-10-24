import * as ExpressionParsersContextsBase from "./Base.ts";
import * as ExpressionParsersContextsWar from "./War.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersFunctionInfo from "../FunctionInfo.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersResultsWar from "../results/War.ts";
import type * as ExpressionParsersTypes from "../Types.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import type * as FogMapsIFogMap from "../../fogMaps/IFogMap.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type IFogMap        = FogMapsIFogMap.IFogMap;

export class Fog extends ExpressionParsersContextsBase.Base {
    private static readonly VnWar           = "war";

    private static readonly FnEnabled       = "enabled";

    public static readonly Functions    = Fog.generateFunctions();
    public static readonly Variables    = Fog.generateVariables();
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        variables.set(Fog.VnWar,         { desc: LangConstants.TextType.A0384, resultType: ExpressionParsersEnums.ResultType.War, isExtension: false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
        functions.set(
            Fog.FnEnabled,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0457,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Fog.FnEnabled, `1`, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextFog_GenerateFunctions_00
                        );
                    }

                    const argResultType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argResultType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Fog.FnEnabled, 1, ExpressionParsersEnums.ResultType.Number, argResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextFog_GenerateFunctions_01
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );

        return functions;
    }

    private _fogMap     : IFogMap;
    private _contextWar : ExpressionParsersContextsWar.War | null = null;

    public constructor(fogMap: IFogMap) {
        super(fogMap.getWar());

        this._fogMap = fogMap;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.Fog;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase.Base {
        switch (identifierName) {
            case Fog.VnWar     : return new ExpressionParsersResultsWar.War(this._fogMap.getWar());
            default                     : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this._fogMap.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        switch (identifierName) {
            case Fog.FnEnabled : return this.callEnabled(argumentArray[0]);
            default                     : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this._fogMap.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    private callEnabled(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const war = this.getWar();
        switch (NumbersUtils.getValueInInt32(arg.num)) {
            case 1  : return new ExpressionParsersResultsNum.Num(war, this._fogMap.checkHasFogByDefault() ? 1 : 0);
            default : return new ExpressionParsersResultsNum.Num(war, this._fogMap.checkHasFogCurrently() ? 1 : 0);
        }
    }
}
