import {
    ExpressionParsers_Contexts_Base,
    Utils_ClientErrorCode,
    ExpressionParsers_Enums,
    ExpressionParsers_Utils,
    ExpressionParsers_FunctionInfo,
    Numbers_Utils,
    Helpers_Misc,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_War,
    Lang_Constants,
    ExpressionParsers_Contexts_War,
    type ExpressionParsers_Types,
    type FogMaps_IFogMap,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class Fog extends ExpressionParsers_Contexts_Base.Base {
    private static readonly VnWar           = "war";

    private static readonly FnEnabled       = "enabled";

    public static readonly Functions    = Fog.generateFunctions();
    public static readonly Variables    = Fog.generateVariables();
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = ExpressionParsers_Utils.extendVariableInfoDict(ExpressionParsers_Contexts_War.War.Variables);
        variables.set(Fog.VnWar,         { desc : Lang_Constants.TextType.A0384, resultType : ExpressionParsers_Enums.ResultType.War, isExtension : false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        const functions = ExpressionParsers_Utils.extendFunctionInfoDict(ExpressionParsers_Contexts_War.War.Functions);
        functions.set(
            Fog.FnEnabled,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0457,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Fog.FnEnabled, `1`, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextFog_GenerateFunctions_00,
                        );
                    }

                    const argResultType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Fog.FnEnabled, 1, ExpressionParsers_Enums.ResultType.Number, argResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextFog_GenerateFunctions_01,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );

        return functions;
    }

    private readonly _fogMap     : FogMaps_IFogMap.IFogMap;
    private _contextWar : ExpressionParsers_Contexts_War.War | null = null;

    public constructor(fogMap: FogMaps_IFogMap.IFogMap) {
        super(fogMap.getWar());

        this._fogMap = fogMap;
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.Fog;
    }

    public override resolveVariable(identifierName: string): ExpressionParsers_Results_Base.Base {
        switch (identifierName) {
            case Fog.VnWar     : return new ExpressionParsers_Results_War.War(this._fogMap.getWar());
            default                     : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this._fogMap.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        switch (identifierName) {
            case Fog.FnEnabled : return this.callEnabled(argumentArray[0]);
            default                     : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this._fogMap.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    private callEnabled(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const war = this.getWar();
        switch (Numbers_Utils.getValueInInt32(arg.num)) {
            case 1  : return new ExpressionParsers_Results_Num.Num(war, this._fogMap.checkHasFogByDefault() ? 1 : 0);
            default : return new ExpressionParsers_Results_Num.Num(war, this._fogMap.checkHasFogCurrently() ? 1 : 0);
        }
    }
}
