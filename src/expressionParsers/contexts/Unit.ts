import {
    ExpressionParsers_Contexts_Base,
    Locations_Utils,
    Utils_ClientErrorCode,
    ExpressionParsers_Enums,
    ExpressionParsers_Utils,
    ExpressionParsers_FunctionInfo,
    Locations_Constants,
    Helpers_Misc,
    ExpressionParsers_Results_NullableUnit,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_NumArray,
    ExpressionParsers_Results_Player,
    ExpressionParsers_Results_Position,
    ExpressionParsers_Results_War,
    Units_Constants,
    Lang_Constants,
    ExpressionParsers_Results_Tile,
    ExpressionParsers_Contexts_War,
    type ExpressionParsers_Types,
    type Units_Unit,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class Unit extends ExpressionParsers_Contexts_Base.Base {
    private static readonly VnX                     = "x";
    private static readonly VnY                     = "y";
    private static readonly VnPos                   = "pos";
    private static readonly VnPlayerIndex           = "playerIndex";
    private static readonly VnTeamIndex             = "teamIndex";
    private static readonly VnType                  = "type";
    private static readonly VnId                    = "id";
    private static readonly VnCustomNameId          = "customNameId";
    private static readonly VnLoader                = "loader";
    private static readonly VnLoaderId              = "loaderId";
    private static readonly VnActionState           = "actionState";
    private static readonly VnCoOnboard             = "coOnboard";
    private static readonly VnCapturing             = "capturing";
    private static readonly VnBuilding              = "building";
    private static readonly VnDived                 = "dived";
    private static readonly VnTags                  = "tags";
    private static readonly VnAiMode                = "aiMode";
    private static readonly VnMoveType              = "moveType";
    private static readonly VnInCoZone              = "inCoZone";
    private static readonly VnPlayer                = "player";
    private static readonly VnTile                  = "tile";
    private static readonly VnExist                 = "exist";
    private static readonly VnVisionRange           = "visionRange";
    private static readonly VnVisionRange0          = "visionRange0";
    private static readonly VnWar                   = "war";

    private static readonly FnHp                    = "hp";
    private static readonly FnFuel                  = "fuel";
    private static readonly FnMovement              = "movement";
    private static readonly FnPromotion             = "promotion";
    private static readonly FnCost                  = "cost";
    private static readonly FnPrimaryAmmo           = "primaryAmmo";
    private static readonly FnFlareAmmo             = "flareAmmo";
    private static readonly FnBuildMaterial         = "buildMaterial";
    private static readonly FnProduceMaterial       = "produceMaterial";
    private static readonly FnLoadedUnitsCount      = "loadedUnitsCount";
    private static readonly FnHasTag                = "hasTag";
    private static readonly FnHasProhibitedLocation = "hasProhibitedLocation";
    private static readonly FnInLocation            = "inLocation";
    private static readonly FnDistanceToGrid        = "distanceToGrid";
    private static readonly FnDistanceToLocation    = "distanceToLocation";
    private static readonly FnDistanceToCoUnit      = "distanceToCoUnit";

    public static readonly Variables    = Unit.generateVariables();
    public static readonly Functions    = Unit.generateFunctions();
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = ExpressionParsers_Utils.extendVariableInfoDict(ExpressionParsers_Contexts_War.War.Variables);
        variables.set(Unit.VnX,                { desc : Lang_Constants.TextType.A0186, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnY,                { desc : Lang_Constants.TextType.A0200, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnPos,              { desc : Lang_Constants.TextType.A0577, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnPlayerIndex,      { desc : Lang_Constants.TextType.A0202, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnTeamIndex,        { desc : Lang_Constants.TextType.A0203, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnType,             { desc : Lang_Constants.TextType.A0204, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnId,               { desc : Lang_Constants.TextType.A0213, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnCustomNameId,     { desc : Lang_Constants.TextType.A0959, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnLoader,           { desc : Lang_Constants.TextType.A0471, resultType : ExpressionParsers_Enums.ResultType.Unit,          isExtension : false });
        variables.set(Unit.VnLoaderId,         { desc : Lang_Constants.TextType.A0214, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnActionState,      { desc : Lang_Constants.TextType.A0229, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnCoOnboard,        { desc : Lang_Constants.TextType.A0234, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnCapturing,        { desc : Lang_Constants.TextType.A0236, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnBuilding,         { desc : Lang_Constants.TextType.A0255, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnDived,            { desc : Lang_Constants.TextType.A0256, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnTags,             { desc : Lang_Constants.TextType.A0709, resultType : ExpressionParsers_Enums.ResultType.NumberArray,   isExtension : false });
        variables.set(Unit.VnAiMode,           { desc : Lang_Constants.TextType.A0307, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnMoveType,         { desc : Lang_Constants.TextType.A0927, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnInCoZone,         { desc : Lang_Constants.TextType.A0710, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnPlayer,           { desc : Lang_Constants.TextType.A0464, resultType : ExpressionParsers_Enums.ResultType.Player,        isExtension : false });
        variables.set(Unit.VnTile,             { desc : Lang_Constants.TextType.A0462, resultType : ExpressionParsers_Enums.ResultType.Tile,          isExtension : false });
        variables.set(Unit.VnExist,            { desc : Lang_Constants.TextType.A0463, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnVisionRange,      { desc : Lang_Constants.TextType.A0775, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnVisionRange0,     { desc : Lang_Constants.TextType.A0776, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Unit.VnWar,              { desc : Lang_Constants.TextType.A0384, resultType : ExpressionParsers_Enums.ResultType.War,           isExtension : false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        const functions = ExpressionParsers_Utils.extendFunctionInfoDict(ExpressionParsers_Contexts_War.War.Functions);
        functions.set(
            Unit.FnHp,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0215,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Unit.FnHp, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_00,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Unit.FnHp, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_01,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Unit.FnFuel,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0216,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Unit.FnFuel, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_02,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Unit.FnFuel, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_03,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Unit.FnMovement,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0554,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Unit.FnMovement, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_04,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Unit.FnMovement, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_05,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Unit.FnPromotion,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0223,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Unit.FnPromotion, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_06,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Unit.FnPromotion, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_07,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Unit.FnCost,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0472,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Unit.FnCost, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_08,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Unit.FnCost, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_09,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Unit.FnPrimaryAmmo,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0257,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Unit.FnPrimaryAmmo, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_10,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Unit.FnPrimaryAmmo, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_11,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Unit.FnFlareAmmo,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0260,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Unit.FnFlareAmmo, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_12,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Unit.FnFlareAmmo, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_13,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Unit.FnBuildMaterial,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0261,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Unit.FnBuildMaterial, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_14,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Unit.FnBuildMaterial, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_15,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Unit.FnProduceMaterial,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0287,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Unit.FnProduceMaterial, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_16,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Unit.FnProduceMaterial, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_16,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Unit.FnLoadedUnitsCount,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0310,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Unit.FnLoadedUnitsCount, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_18,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Unit.FnLoadedUnitsCount, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_19,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Unit.FnHasTag,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0335,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Unit.FnHasTag, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_20,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Unit.FnHasTag, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_21,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Unit.FnHasProhibitedLocation,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0366,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Unit.FnHasProhibitedLocation, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_22,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Unit.FnHasProhibitedLocation, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_23,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Unit.FnInLocation,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0473,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Unit.FnInLocation, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_24,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Unit.FnInLocation, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_25,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Unit.FnDistanceToGrid,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0381,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Unit.FnDistanceToGrid, 2, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_26,
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(Unit.FnDistanceToGrid, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_27,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Unit.FnDistanceToLocation,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0382,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Unit.FnDistanceToLocation, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_28,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Unit.FnDistanceToLocation, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_29,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Unit.FnDistanceToCoUnit,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0771,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 0) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Unit.FnDistanceToCoUnit, 0, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_30,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );

        return functions;
    }

    private readonly _unit       : Units_Unit.Unit | null;
    private _contextWar : ExpressionParsers_Contexts_War.War | null = null;

    public constructor(data: ExpressionParsers_Results_NullableUnit.NullableUnit) {
        super(data.war);

        this._unit  = data.unit;
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.Unit;
    }

    public override resolveVariable(identifierName: string, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        const unit      = this._unit;
        const war       = this.getWar();
        switch (identifierName) {
            case Unit.VnX              : return new ExpressionParsers_Results_Num.Num(war, unit ? (unit.getGridX())                       : -2);
            case Unit.VnY              : return new ExpressionParsers_Results_Num.Num(war, unit ? (unit.getGridY())                       : -2);
            case Unit.VnPlayerIndex    : return new ExpressionParsers_Results_Num.Num(war, unit ? (unit.getPlayerIndex())                 : -2);
            case Unit.VnTeamIndex      : return new ExpressionParsers_Results_Num.Num(war, unit ? (unit.getTeamIndex())                   : -2);
            case Unit.VnType           : return new ExpressionParsers_Results_Num.Num(war, unit ? (unit.getUnitType())                    : -2);
            case Unit.VnId             : return new ExpressionParsers_Results_Num.Num(war, unit ? (unit.getUnitId())                      : -2);
            case Unit.VnCustomNameId   : return new ExpressionParsers_Results_Num.Num(war, unit ? (unit.getCustomNameId() ?? -1)          : -2);
            case Unit.VnLoaderId       : return new ExpressionParsers_Results_Num.Num(war, unit ? (unit.getLoaderUnitId() ?? -1)          : -2);
            case Unit.VnActionState    : return new ExpressionParsers_Results_Num.Num(war, unit ? (unit.getActionState())                 : -2);
            case Unit.VnCoOnboard      : return new ExpressionParsers_Results_Num.Num(war, unit ? (unit.getIsCoOnboard() ? 1 : 0)         : -2);
            case Unit.VnCapturing      : return new ExpressionParsers_Results_Num.Num(war, unit ? (unit.checkIsCapturingTile() ? 1 : 0)   : -2);
            case Unit.VnBuilding       : return new ExpressionParsers_Results_Num.Num(war, unit ? (unit.checkIsBuildingTile() ? 1 : 0)    : -2);
            case Unit.VnDived          : return new ExpressionParsers_Results_Num.Num(war, unit ? (unit.getIsDiving() ? 1 : 0)            : -2);
            case Unit.VnAiMode         : return new ExpressionParsers_Results_Num.Num(war, unit ? (unit.getAiMode())                      : -2);
            case Unit.VnMoveType       : return new ExpressionParsers_Results_Num.Num(war, unit ? (unit.getMoveTypeId())                  : -2);
            case Unit.VnExist          : return new ExpressionParsers_Results_Num.Num(war, unit ? 1 : 0);
            case Unit.VnVisionRange    : return this.resolveVisionRange(isRestricted);
            case Unit.VnVisionRange0   : return this.resolveVisionRange0();
            case Unit.VnWar            : return new ExpressionParsers_Results_War.War(war);
            case Unit.VnTags           :
                if (unit == null) {
                    return new ExpressionParsers_Results_NumArray.NumArray(war, [-2]);
                } else {
                    return new ExpressionParsers_Results_NumArray.NumArray(war, unit.getTagIdArray(true));
                }
            case Unit.VnInCoZone       :
                if (isRestricted) {
                    throw Helpers_Misc.newError(`Restricted.`);
                } else {
                    if (unit == null) {
                        return new ExpressionParsers_Results_Num.Num(war, -2);
                    } else {
                        if (unit.getIsCoOnboard()) {
                            return new ExpressionParsers_Results_Num.Num(war, 1);
                        }
                        if (unit.getLoaderUnitId() != null) {
                            return new ExpressionParsers_Results_Num.Num(war, 0);
                        }

                        const player = unit.getPlayer();
                        return new ExpressionParsers_Results_Num.Num(
                            war,
                            (unit.getGridIndex().getMinDistance(player.getCoGridIndexListOnMap()) <= player.getCoZoneRadius()) ? 1 : 0,
                        );
                    }
                }
            case Unit.VnPos            :
                return new ExpressionParsers_Results_Position.Position(war, unit?.getGridX() ?? -2, unit?.getGridY() ?? -2);
            case Unit.VnLoader         :
                if (unit == null) {
                    throw Helpers_Misc.newError(`The unit is null.`);
                } else {
                    return new ExpressionParsers_Results_NullableUnit.NullableUnit(war, unit.getLoaderUnit());
                }
            case Unit.VnPlayer           :
                if (unit == null) {
                    throw Helpers_Misc.newError(`The unit is null.`);
                } else {
                    return new ExpressionParsers_Results_Player.Player(unit.getPlayer());
                }
            case Unit.VnTile             :
                if (unit == null) {
                    throw Helpers_Misc.newError(`The unit is null.`);
                } else {
                    return new ExpressionParsers_Results_Tile.Tile(war.getTileMap().getTile(unit.getGridIndex()));
                }
            default                             : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(war)).resolveVariable(identifierName);
        }
    }
    private resolveVisionRange(isRestricted: boolean): ExpressionParsers_Results_Num.Num {
        if (isRestricted) {
            throw Helpers_Misc.newError(`Restricted.`);
        }

        const unit  = this._unit;
        const war   = this.getWar();
        return unit
            ? new ExpressionParsers_Results_Num.Num(war, unit.getFinalVisionRange(unit.getVisionInfo(), unit.getGridIndex()))
            : new ExpressionParsers_Results_Num.Num(war, -2);
    }
    private resolveVisionRange0(): ExpressionParsers_Results_Num.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        return unit
            ? new ExpressionParsers_Results_Num.Num(war, unit.getCfgVisionRange())
            : new ExpressionParsers_Results_Num.Num(war, -2);
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        switch (identifierName) {
            case Unit.FnHp                     : return this.callHp(argumentArray[0]);
            case Unit.FnFuel                   : return this.callFuel(argumentArray[0]);
            case Unit.FnMovement               : return this.callMovement(argumentArray[0], isRestricted);
            case Unit.FnPromotion              : return this.callPromotion(argumentArray[0]);
            case Unit.FnCost                   : return this.callCost(argumentArray[0]);
            case Unit.FnPrimaryAmmo            : return this.callPrimaryAmmo(argumentArray[0]);
            case Unit.FnFlareAmmo              : return this.callFlareAmmo(argumentArray[0]);
            case Unit.FnBuildMaterial          : return this.callBuildMaterial(argumentArray[0]);
            case Unit.FnProduceMaterial        : return this.callProduceMaterial(argumentArray[0]);
            case Unit.FnLoadedUnitsCount       : return this.callLoadedUnitsCount(argumentArray[0]);
            case Unit.FnHasTag                 : return this.callHasTag(argumentArray[0]);
            case Unit.FnHasProhibitedLocation  : return this.callHasProhibitedLocation(argumentArray[0]);
            case Unit.FnInLocation             : return this.callInLocation(argumentArray[0]);
            case Unit.FnDistanceToGrid         : return this.callDistanceToGrid(argumentArray[0], argumentArray[1]);
            case Unit.FnDistanceToLocation     : return this.callDistanceToLocation(argumentArray[0]);
            case Unit.FnDistanceToCoUnit       : return this.callDistanceToCoUnit();
            default                                     : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    public callHp(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getCurrentHp();
        const maxValue      = unit.getMaxHp();
        switch (arg.num) {
            case 1  : return new ExpressionParsers_Results_Num.Num(war, maxValue);
            case 2  : return new ExpressionParsers_Results_Num.Num(war, maxValue - currentValue);
            case 3  : return new ExpressionParsers_Results_Num.Num(war, currentValue / maxValue);
            case 4  : return new ExpressionParsers_Results_Num.Num(war, (maxValue - currentValue) / maxValue);
            case 5  : return new ExpressionParsers_Results_Num.Num(war, unit.getNormalizedCurrentHp());
            case 6  : return new ExpressionParsers_Results_Num.Num(war, unit.getNormalizedMaxHp());
            case 7  : return new ExpressionParsers_Results_Num.Num(war, unit.getNormalizedMaxHp() - unit.getNormalizedCurrentHp());
            default : return new ExpressionParsers_Results_Num.Num(war, currentValue);
        }
    }
    public callFuel(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getCurrentFuel();
        const maxValue      = unit.getMaxFuel();
        switch (arg.num) {
            case 1  : return new ExpressionParsers_Results_Num.Num(war, maxValue);
            case 2  : return new ExpressionParsers_Results_Num.Num(war, maxValue - currentValue);
            case 3  : return new ExpressionParsers_Results_Num.Num(war, currentValue / maxValue);
            case 4  : return new ExpressionParsers_Results_Num.Num(war, (maxValue - currentValue) / maxValue);
            default : return new ExpressionParsers_Results_Num.Num(war, currentValue);
        }
    }
    private callMovement(arg: ExpressionParsers_Results_Base.Base, isRestricted: boolean): ExpressionParsers_Results_Num.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        if (arg.num === 1) {
            if (isRestricted) {
                throw Helpers_Misc.newError(`Restricted.`);
            }

            return new ExpressionParsers_Results_Num.Num(war, unit.getFinalMoveRange());
        } else {
            return new ExpressionParsers_Results_Num.Num(war, unit.getCfgMoveRange());
        }
    }
    public callPromotion(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getCurrentPromotion();
        const maxValue      = unit.getMaxPromotion();
        switch (arg.num) {
            case 1  : return new ExpressionParsers_Results_Num.Num(war, maxValue);
            case 2  : return new ExpressionParsers_Results_Num.Num(war, maxValue - currentValue);
            case 3  : return new ExpressionParsers_Results_Num.Num(war, currentValue / maxValue);
            case 4  : return new ExpressionParsers_Results_Num.Num(war, (maxValue - currentValue) / maxValue);
            default : return new ExpressionParsers_Results_Num.Num(war, currentValue);
        }
    }
    public callCost(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getNormalizedCurrentHp();
        const maxValue      = unit.getNormalizedMaxHp();
        const cost          = unit.getProductionCfgCost();
        const costWithCo    = unit.getIsCoOnboard() ? (cost + unit.getCoBoardCost()) : cost;
        switch (arg.num) {
            case 1  : return new ExpressionParsers_Results_Num.Num(war, cost * currentValue / maxValue);
            case 2  : return new ExpressionParsers_Results_Num.Num(war, cost * (maxValue - currentValue) / maxValue);
            case 3  : return new ExpressionParsers_Results_Num.Num(war, costWithCo);
            case 4  : return new ExpressionParsers_Results_Num.Num(war, costWithCo * currentValue / maxValue);
            case 5  : return new ExpressionParsers_Results_Num.Num(war, costWithCo * (maxValue - currentValue) / maxValue);
            default : return new ExpressionParsers_Results_Num.Num(war, cost);
        }
    }
    public callPrimaryAmmo(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        const maxValue = unit.getPrimaryWeaponMaxAmmo();
        if (maxValue == null) {
            return new ExpressionParsers_Results_Num.Num(war, -1);
        }

        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const currentValue = unit.getPrimaryWeaponCurrentAmmo();
        switch (arg.num) {
            case 1  : return new ExpressionParsers_Results_Num.Num(war, maxValue);
            case 2  : return new ExpressionParsers_Results_Num.Num(war, maxValue - currentValue);
            case 3  : return new ExpressionParsers_Results_Num.Num(war, currentValue / maxValue);
            case 4  : return new ExpressionParsers_Results_Num.Num(war, (maxValue - currentValue) / maxValue);
            default : return new ExpressionParsers_Results_Num.Num(war, currentValue);
        }
    }
    public callFlareAmmo(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        const maxValue  = unit.getFlareMaxAmmo();
        if (maxValue == null) {
            return new ExpressionParsers_Results_Num.Num(war, -1);
        }

        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getFlareCurrentAmmo();
        switch (arg.num) {
            case 1  : return new ExpressionParsers_Results_Num.Num(war, maxValue);
            case 2  : return new ExpressionParsers_Results_Num.Num(war, maxValue - currentValue);
            case 3  : return new ExpressionParsers_Results_Num.Num(war, currentValue / maxValue);
            case 4  : return new ExpressionParsers_Results_Num.Num(war, (maxValue - currentValue) / maxValue);
            default : return new ExpressionParsers_Results_Num.Num(war, currentValue);
        }
    }
    public callBuildMaterial(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        const maxValue  = unit.getMaxBuildMaterial();
        if (maxValue == null) {
            return new ExpressionParsers_Results_Num.Num(war, -1);
        }

        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getCurrentBuildMaterial();
        switch (arg.num) {
            case 1  : return new ExpressionParsers_Results_Num.Num(war, maxValue);
            case 2  : return new ExpressionParsers_Results_Num.Num(war, maxValue - currentValue);
            case 3  : return new ExpressionParsers_Results_Num.Num(war, currentValue / maxValue);
            case 4  : return new ExpressionParsers_Results_Num.Num(war, (maxValue - currentValue) / maxValue);
            default : return new ExpressionParsers_Results_Num.Num(war, currentValue);
        }
    }
    public callProduceMaterial(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        const maxValue  = unit.getMaxProduceMaterial();
        if (maxValue == null) {
            return new ExpressionParsers_Results_Num.Num(war, -1);
        }

        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const currentValue = unit.getCurrentProduceMaterial();
        switch (arg.num) {
            case 1  : return new ExpressionParsers_Results_Num.Num(war, maxValue);
            case 2  : return new ExpressionParsers_Results_Num.Num(war, maxValue - currentValue);
            case 3  : return new ExpressionParsers_Results_Num.Num(war, currentValue / maxValue);
            case 4  : return new ExpressionParsers_Results_Num.Num(war, (maxValue - currentValue) / maxValue);
            default : return new ExpressionParsers_Results_Num.Num(war, currentValue);
        }
    }
    public callLoadedUnitsCount(isRecursive: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        if (!(isRecursive instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        return new ExpressionParsers_Results_Num.Num(war, war.getUnitMap().getUnitsLoadedByLoader(unit, isRecursive.num !== 0).length);
    }
    public callHasTag(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const tagId = arg.num;
        if (tagId != Math.floor(tagId)) {
            throw Helpers_Misc.newError(`Invalid tagId: ${tagId}`);
        }

        const war   = this.getWar();
        const unit  = this._unit;
        if (unit == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        if ((tagId > Units_Constants.TagId.MaxTagId) || (tagId < Units_Constants.TagId.MinTagId)) {
            return new ExpressionParsers_Results_Num.Num(war, 0);
        }

        return new ExpressionParsers_Results_Num.Num(war, unit.getHasTagId(tagId) ? 1 : 0);
    }
    public callHasProhibitedLocation(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const locationId = arg.num;
        if (locationId != Math.floor(locationId)) {
            throw Helpers_Misc.newError(`Invalid locationId: ${locationId}`);
        }

        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        if ((locationId > Locations_Constants.MaxId) || (locationId < Locations_Constants.MinId)) {
            return new ExpressionParsers_Results_Num.Num(war, 0);
        }

        const groupedLocationIdArray = Locations_Utils.encode([locationId]);
        return new ExpressionParsers_Results_Num.Num(
            war,
            (Locations_Utils.checkHasAnyOverlap(groupedLocationIdArray, unit.getForbiddenGroupedLocationIdArray())) ? 1 : 0,
        );
    }
    public callInLocation(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const locationId = arg.num;
        if (locationId != Math.floor(locationId)) {
            throw Helpers_Misc.newError(`Invalid locationId: ${locationId}`);
        }

        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        if ((locationId > Locations_Constants.MaxId) || (locationId < Locations_Constants.MinId)) {
            return new ExpressionParsers_Results_Num.Num(war, 0);
        }

        const groupedLocationIdArray = Locations_Utils.encode([locationId]);
        return new ExpressionParsers_Results_Num.Num(
            war,
            war.getTileMap().getTile(unit.getGridIndex()).checkHasAnyLocationIdByGroupedLocationIdArray(groupedLocationIdArray) ? 1 : 0,
        );
    }
    public callDistanceToGrid(argX: ExpressionParsers_Results_Base.Base, argY: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(argX instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected argX.`);
        }
        if (!(argY instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected argY.`);
        }

        const x = argX.num;
        const y = argY.num;
        if ((x != Math.floor(x)) || (y != Math.floor(y))) {
            throw Helpers_Misc.newError(`Invalid xy: ${x}, ${y}`);
        }

        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        const gridIndex = unit.getGridIndex();
        return new ExpressionParsers_Results_Num.Num(war, Math.abs(gridIndex.getX() - x) + Math.abs(gridIndex.getY() - y));
    }
    public callDistanceToLocation(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const locationId = arg.num;
        if (locationId != Math.floor(locationId)) {
            throw Helpers_Misc.newError(`Invalid locationId: ${locationId}`);
        }

        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        if ((locationId > Locations_Constants.MaxId) || (locationId < Locations_Constants.MinId)) {
            return new ExpressionParsers_Results_Num.Num(war, -1);
        }

        const gridIndexList = this.getWar().getTileMap().getGridIndexListWithAnyLocationId([locationId]);
        return new ExpressionParsers_Results_Num.Num(
            war,
            (gridIndexList.length <= 0) ? -1 : unit.getGridIndex().getMinDistance(gridIndexList),
        );
    }
    private callDistanceToCoUnit(): ExpressionParsers_Results_Num.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }
        if (unit.getIsCoOnboard()) {
            return new ExpressionParsers_Results_Num.Num(war, 0);
        }
        if (unit.getLoaderUnitId() != null) {
            return new ExpressionParsers_Results_Num.Num(war, -1);
        }

        const gridIndexList = unit.getPlayer().getCoGridIndexListOnMap();
        return (gridIndexList.length <= 0)
            ? new ExpressionParsers_Results_Num.Num(war, -1)
            : new ExpressionParsers_Results_Num.Num(war, unit.getGridIndex().getMinDistance(gridIndexList));
    }
}
