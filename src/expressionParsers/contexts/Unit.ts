import * as ExpressionParsersContextsBase from "./Base.ts";
import * as ExpressionParsersContextsWar from "./War.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersFunctionInfo from "../FunctionInfo.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsNullableUnit from "../results/NullableUnit.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersResultsNumArray from "../results/NumArray.ts";
import * as ExpressionParsersResultsPlayer from "../results/Player.ts";
import * as ExpressionParsersResultsPosition from "../results/Position.ts";
import * as ExpressionParsersResultsTile from "../results/Tile.ts";
import * as ExpressionParsersResultsWar from "../results/War.ts";
import type * as ExpressionParsersTypes from "../Types.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LocationsConstants from "../../locations/Constants.ts";
import * as LocationsUtils from "../../locations/Utils.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

export class Unit extends ExpressionParsersContextsBase.Base {
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
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        variables.set(Unit.VnX,                { desc: LangConstants.TextType.A0186, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnY,                { desc: LangConstants.TextType.A0200, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnPos,              { desc: LangConstants.TextType.A0577, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnPlayerIndex,      { desc: LangConstants.TextType.A0202, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnTeamIndex,        { desc: LangConstants.TextType.A0203, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnType,             { desc: LangConstants.TextType.A0204, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnId,               { desc: LangConstants.TextType.A0213, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnCustomNameId,     { desc: LangConstants.TextType.A0959, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnLoader,           { desc: LangConstants.TextType.A0471, resultType: ExpressionParsersEnums.ResultType.Unit,          isExtension: false });
        variables.set(Unit.VnLoaderId,         { desc: LangConstants.TextType.A0214, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnActionState,      { desc: LangConstants.TextType.A0229, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnCoOnboard,        { desc: LangConstants.TextType.A0234, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnCapturing,        { desc: LangConstants.TextType.A0236, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnBuilding,         { desc: LangConstants.TextType.A0255, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnDived,            { desc: LangConstants.TextType.A0256, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnTags,             { desc: LangConstants.TextType.A0709, resultType: ExpressionParsersEnums.ResultType.NumberArray,   isExtension: false });
        variables.set(Unit.VnAiMode,           { desc: LangConstants.TextType.A0307, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnMoveType,         { desc: LangConstants.TextType.A0927, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnInCoZone,         { desc: LangConstants.TextType.A0710, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnPlayer,           { desc: LangConstants.TextType.A0464, resultType: ExpressionParsersEnums.ResultType.Player,        isExtension: false });
        variables.set(Unit.VnTile,             { desc: LangConstants.TextType.A0462, resultType: ExpressionParsersEnums.ResultType.Tile,          isExtension: false });
        variables.set(Unit.VnExist,            { desc: LangConstants.TextType.A0463, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnVisionRange,      { desc: LangConstants.TextType.A0775, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnVisionRange0,     { desc: LangConstants.TextType.A0776, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Unit.VnWar,              { desc: LangConstants.TextType.A0384, resultType: ExpressionParsersEnums.ResultType.War,           isExtension: false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
        functions.set(
            Unit.FnHp,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0215,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Unit.FnHp, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Unit.FnHp, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_01
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnFuel,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0216,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Unit.FnFuel, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_02
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Unit.FnFuel, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_03
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnMovement,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0554,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Unit.FnMovement, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_04
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Unit.FnMovement, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_05
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnPromotion,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0223,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Unit.FnPromotion, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_06
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Unit.FnPromotion, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_07
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnCost,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0472,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Unit.FnCost, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_08
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Unit.FnCost, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_09
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnPrimaryAmmo,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0257,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Unit.FnPrimaryAmmo, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_10
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Unit.FnPrimaryAmmo, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_11
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnFlareAmmo,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0260,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Unit.FnFlareAmmo, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_12
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Unit.FnFlareAmmo, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_13
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnBuildMaterial,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0261,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Unit.FnBuildMaterial, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_14
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Unit.FnBuildMaterial, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_15
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnProduceMaterial,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0287,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Unit.FnProduceMaterial, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_16
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Unit.FnProduceMaterial, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_16
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnLoadedUnitsCount,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0310,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Unit.FnLoadedUnitsCount, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_18
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Unit.FnLoadedUnitsCount, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_19
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnHasTag,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0335,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Unit.FnHasTag, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_20
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Unit.FnHasTag, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_21
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnHasProhibitedLocation,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0366,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Unit.FnHasProhibitedLocation, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_22
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Unit.FnHasProhibitedLocation, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_23
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnInLocation,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0473,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Unit.FnInLocation, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_24
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Unit.FnInLocation, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_25
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnDistanceToGrid,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0381,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Unit.FnDistanceToGrid, 2, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_26
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(Unit.FnDistanceToGrid, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_27
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnDistanceToLocation,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0382,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Unit.FnDistanceToLocation, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_28
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Unit.FnDistanceToLocation, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_29
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Unit.FnDistanceToCoUnit,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0771,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 0) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Unit.FnDistanceToCoUnit, 0, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnit_GenerateFunctions_30
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );

        return functions;
    }

    private _unit       : UnitsIUnit.IUnit | null;
    private _contextWar : ExpressionParsersContextsWar.War | null = null;

    public constructor(data: ExpressionParsersResultsNullableUnit.NullableUnit) {
        super(data.war);

        this._unit  = data.unit;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.Unit;
    }

    public override resolveVariable(identifierName: string, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        const unit      = this._unit;
        const war       = this.getWar();
        switch (identifierName) {
            case Unit.VnX              : return new ExpressionParsersResultsNum.Num(war, unit ? (unit.getGridX())                       : -2);
            case Unit.VnY              : return new ExpressionParsersResultsNum.Num(war, unit ? (unit.getGridY())                       : -2);
            case Unit.VnPlayerIndex    : return new ExpressionParsersResultsNum.Num(war, unit ? (unit.getPlayerIndex())                 : -2);
            case Unit.VnTeamIndex      : return new ExpressionParsersResultsNum.Num(war, unit ? (unit.getTeamIndex())                   : -2);
            case Unit.VnType           : return new ExpressionParsersResultsNum.Num(war, unit ? (unit.getUnitType())                    : -2);
            case Unit.VnId             : return new ExpressionParsersResultsNum.Num(war, unit ? (unit.getUnitId())                      : -2);
            case Unit.VnCustomNameId   : return new ExpressionParsersResultsNum.Num(war, unit ? (unit.getCustomNameId() ?? -1)          : -2);
            case Unit.VnLoaderId       : return new ExpressionParsersResultsNum.Num(war, unit ? (unit.getLoaderUnitId() ?? -1)          : -2);
            case Unit.VnActionState    : return new ExpressionParsersResultsNum.Num(war, unit ? (unit.getActionState())                 : -2);
            case Unit.VnCoOnboard      : return new ExpressionParsersResultsNum.Num(war, unit ? (unit.getIsCoOnboard() ? 1 : 0)         : -2);
            case Unit.VnCapturing      : return new ExpressionParsersResultsNum.Num(war, unit ? (unit.checkIsCapturingTile() ? 1 : 0)   : -2);
            case Unit.VnBuilding       : return new ExpressionParsersResultsNum.Num(war, unit ? (unit.checkIsBuildingTile() ? 1 : 0)    : -2);
            case Unit.VnDived          : return new ExpressionParsersResultsNum.Num(war, unit ? (unit.getIsDiving() ? 1 : 0)            : -2);
            case Unit.VnAiMode         : return new ExpressionParsersResultsNum.Num(war, unit ? (unit.getAiMode())                      : -2);
            case Unit.VnMoveType       : return new ExpressionParsersResultsNum.Num(war, unit ? (unit.getMoveTypeId())                  : -2);
            case Unit.VnExist          : return new ExpressionParsersResultsNum.Num(war, unit ? 1 : 0);
            case Unit.VnVisionRange    : return this.resolveVisionRange(isRestricted);
            case Unit.VnVisionRange0   : return this.resolveVisionRange0();
            case Unit.VnWar            : return new ExpressionParsersResultsWar.War(war);
            case Unit.VnTags           :
                if (unit == null) {
                    return new ExpressionParsersResultsNumArray.NumArray(war, [-2]);
                } else {
                    return new ExpressionParsersResultsNumArray.NumArray(war, unit.getTagIdArray(true));
                }
            case Unit.VnInCoZone       :
                if (isRestricted) {
                    throw HelpersMisc.newError(`Restricted.`);
                } else {
                    if (unit == null) {
                        return new ExpressionParsersResultsNum.Num(war, -2);
                    } else {
                        if (unit.getIsCoOnboard()) {
                            return new ExpressionParsersResultsNum.Num(war, 1);
                        }
                        if (unit.getLoaderUnitId() != null) {
                            return new ExpressionParsersResultsNum.Num(war, 0);
                        }

                        const player = unit.getPlayer();
                        return new ExpressionParsersResultsNum.Num(
                            war,
                            (unit.getGridIndex().getMinDistance(player.getCoGridIndexListOnMap()) <= player.getCoZoneRadius()) ? 1 : 0
                        );
                    }
                }
            case Unit.VnPos            :
                return new ExpressionParsersResultsPosition.Position(war, unit?.getGridX() ?? -2, unit?.getGridY() ?? -2);
            case Unit.VnLoader         :
                if (unit == null) {
                    throw HelpersMisc.newError(`The unit is null.`);
                } else {
                    return new ExpressionParsersResultsNullableUnit.NullableUnit(war, unit.getLoaderUnit());
                }
            case Unit.VnPlayer           :
                if (unit == null) {
                    throw HelpersMisc.newError(`The unit is null.`);
                } else {
                    return new ExpressionParsersResultsPlayer.Player(unit.getPlayer());
                }
            case Unit.VnTile             :
                if (unit == null) {
                    throw HelpersMisc.newError(`The unit is null.`);
                } else {
                    return new ExpressionParsersResultsTile.Tile(war.getTileMap().getTile(unit.getGridIndex()));
                }
            default                             : return (this._contextWar ??= new ExpressionParsersContextsWar.War(war)).resolveVariable(identifierName);
        }
    }
    private resolveVisionRange(isRestricted: boolean): ExpressionParsersResultsNum.Num {
        if (isRestricted) {
            throw HelpersMisc.newError(`Restricted.`);
        }

        const unit  = this._unit;
        const war   = this.getWar();
        return unit
            ? new ExpressionParsersResultsNum.Num(war, unit.getFinalVisionRange(unit.getVisionInfo(), unit.getGridIndex()))
            : new ExpressionParsersResultsNum.Num(war, -2);
    }
    private resolveVisionRange0(): ExpressionParsersResultsNum.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        return unit
            ? new ExpressionParsersResultsNum.Num(war, unit.getCfgVisionRange())
            : new ExpressionParsersResultsNum.Num(war, -2);
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
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
            default                                     : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    public callHp(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getCurrentHp();
        const maxValue      = unit.getMaxHp();
        switch (arg.num) {
            case 1  : return new ExpressionParsersResultsNum.Num(war, maxValue);
            case 2  : return new ExpressionParsersResultsNum.Num(war, maxValue - currentValue);
            case 3  : return new ExpressionParsersResultsNum.Num(war, currentValue / maxValue);
            case 4  : return new ExpressionParsersResultsNum.Num(war, (maxValue - currentValue) / maxValue);
            case 5  : return new ExpressionParsersResultsNum.Num(war, unit.getNormalizedCurrentHp());
            case 6  : return new ExpressionParsersResultsNum.Num(war, unit.getNormalizedMaxHp());
            case 7  : return new ExpressionParsersResultsNum.Num(war, unit.getNormalizedMaxHp() - unit.getNormalizedCurrentHp());
            default : return new ExpressionParsersResultsNum.Num(war, currentValue);
        }
    }
    public callFuel(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getCurrentFuel();
        const maxValue      = unit.getMaxFuel();
        switch (arg.num) {
            case 1  : return new ExpressionParsersResultsNum.Num(war, maxValue);
            case 2  : return new ExpressionParsersResultsNum.Num(war, maxValue - currentValue);
            case 3  : return new ExpressionParsersResultsNum.Num(war, currentValue / maxValue);
            case 4  : return new ExpressionParsersResultsNum.Num(war, (maxValue - currentValue) / maxValue);
            default : return new ExpressionParsersResultsNum.Num(war, currentValue);
        }
    }
    private callMovement(arg: ExpressionParsersResultsBase.Base, isRestricted: boolean): ExpressionParsersResultsNum.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        if (arg.num === 1) {
            if (isRestricted) {
                throw HelpersMisc.newError(`Restricted.`);
            }

            return new ExpressionParsersResultsNum.Num(war, unit.getFinalMoveRange());
        } else {
            return new ExpressionParsersResultsNum.Num(war, unit.getCfgMoveRange());
        }
    }
    public callPromotion(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getCurrentPromotion();
        const maxValue      = unit.getMaxPromotion();
        switch (arg.num) {
            case 1  : return new ExpressionParsersResultsNum.Num(war, maxValue);
            case 2  : return new ExpressionParsersResultsNum.Num(war, maxValue - currentValue);
            case 3  : return new ExpressionParsersResultsNum.Num(war, currentValue / maxValue);
            case 4  : return new ExpressionParsersResultsNum.Num(war, (maxValue - currentValue) / maxValue);
            default : return new ExpressionParsersResultsNum.Num(war, currentValue);
        }
    }
    public callCost(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getNormalizedCurrentHp();
        const maxValue      = unit.getNormalizedMaxHp();
        const cost          = unit.getProductionCfgCost();
        const costWithCo    = unit.getIsCoOnboard() ? (cost + unit.getCoBoardCost()) : cost;
        switch (arg.num) {
            case 1  : return new ExpressionParsersResultsNum.Num(war, cost * currentValue / maxValue);
            case 2  : return new ExpressionParsersResultsNum.Num(war, cost * (maxValue - currentValue) / maxValue);
            case 3  : return new ExpressionParsersResultsNum.Num(war, costWithCo);
            case 4  : return new ExpressionParsersResultsNum.Num(war, costWithCo * currentValue / maxValue);
            case 5  : return new ExpressionParsersResultsNum.Num(war, costWithCo * (maxValue - currentValue) / maxValue);
            default : return new ExpressionParsersResultsNum.Num(war, cost);
        }
    }
    public callPrimaryAmmo(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        const maxValue = unit.getPrimaryWeaponMaxAmmo();
        if (maxValue == null) {
            return new ExpressionParsersResultsNum.Num(war, -1);
        }

        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const currentValue = unit.getPrimaryWeaponCurrentAmmo() ?? 0;
        switch (arg.num) {
            case 1  : return new ExpressionParsersResultsNum.Num(war, maxValue);
            case 2  : return new ExpressionParsersResultsNum.Num(war, maxValue - currentValue);
            case 3  : return new ExpressionParsersResultsNum.Num(war, currentValue / maxValue);
            case 4  : return new ExpressionParsersResultsNum.Num(war, (maxValue - currentValue) / maxValue);
            default : return new ExpressionParsersResultsNum.Num(war, currentValue);
        }
    }
    public callFlareAmmo(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        const maxValue  = unit.getFlareMaxAmmo();
        if (maxValue == null) {
            return new ExpressionParsersResultsNum.Num(war, -1);
        }

        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getFlareCurrentAmmo() ?? 0;
        switch (arg.num) {
            case 1  : return new ExpressionParsersResultsNum.Num(war, maxValue);
            case 2  : return new ExpressionParsersResultsNum.Num(war, maxValue - currentValue);
            case 3  : return new ExpressionParsersResultsNum.Num(war, currentValue / maxValue);
            case 4  : return new ExpressionParsersResultsNum.Num(war, (maxValue - currentValue) / maxValue);
            default : return new ExpressionParsersResultsNum.Num(war, currentValue);
        }
    }
    public callBuildMaterial(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        const maxValue  = unit.getMaxBuildMaterial();
        if (maxValue == null) {
            return new ExpressionParsersResultsNum.Num(war, -1);
        }

        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const currentValue  = unit.getCurrentBuildMaterial() ?? 0;
        switch (arg.num) {
            case 1  : return new ExpressionParsersResultsNum.Num(war, maxValue);
            case 2  : return new ExpressionParsersResultsNum.Num(war, maxValue - currentValue);
            case 3  : return new ExpressionParsersResultsNum.Num(war, currentValue / maxValue);
            case 4  : return new ExpressionParsersResultsNum.Num(war, (maxValue - currentValue) / maxValue);
            default : return new ExpressionParsersResultsNum.Num(war, currentValue);
        }
    }
    public callProduceMaterial(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        const maxValue  = unit.getMaxProduceMaterial();
        if (maxValue == null) {
            return new ExpressionParsersResultsNum.Num(war, -1);
        }

        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const currentValue = unit.getCurrentProduceMaterial() ?? 0;
        switch (arg.num) {
            case 1  : return new ExpressionParsersResultsNum.Num(war, maxValue);
            case 2  : return new ExpressionParsersResultsNum.Num(war, maxValue - currentValue);
            case 3  : return new ExpressionParsersResultsNum.Num(war, currentValue / maxValue);
            case 4  : return new ExpressionParsersResultsNum.Num(war, (maxValue - currentValue) / maxValue);
            default : return new ExpressionParsersResultsNum.Num(war, currentValue);
        }
    }
    public callLoadedUnitsCount(isRecursive: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        if (!(isRecursive instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        return new ExpressionParsersResultsNum.Num(war, war.getUnitMap().getUnitsLoadedByLoader(unit, isRecursive.num !== 0).length);
    }
    public callHasTag(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const tagId = arg.num;
        if (tagId != Math.floor(tagId)) {
            throw HelpersMisc.newError(`Invalid tagId: ${tagId}`);
        }

        const war   = this.getWar();
        const unit  = this._unit;
        if (unit == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        if ((tagId > UnitsConstants.TagId.MaxTagId) || (tagId < UnitsConstants.TagId.MinTagId)) {
            return new ExpressionParsersResultsNum.Num(war, 0);
        }

        return new ExpressionParsersResultsNum.Num(war, unit.getHasTagId(tagId) ? 1 : 0);
    }
    public callHasProhibitedLocation(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const locationId = arg.num;
        if (locationId != Math.floor(locationId)) {
            throw HelpersMisc.newError(`Invalid locationId: ${locationId}`);
        }

        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        if ((locationId > LocationsConstants.MaxId) || (locationId < LocationsConstants.MinId)) {
            return new ExpressionParsersResultsNum.Num(war, 0);
        }

        const groupedLocationIdArray = LocationsUtils.encode([locationId]);
        return new ExpressionParsersResultsNum.Num(
            war,
            (LocationsUtils.checkHasAnyOverlap(groupedLocationIdArray, unit.getForbiddenGroupedLocationIdArray())) ? 1 : 0
        );
    }
    public callInLocation(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const locationId = arg.num;
        if (locationId != Math.floor(locationId)) {
            throw HelpersMisc.newError(`Invalid locationId: ${locationId}`);
        }

        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        if ((locationId > LocationsConstants.MaxId) || (locationId < LocationsConstants.MinId)) {
            return new ExpressionParsersResultsNum.Num(war, 0);
        }

        const groupedLocationIdArray = LocationsUtils.encode([locationId]);
        return new ExpressionParsersResultsNum.Num(
            war,
            war.getTileMap().getTile(unit.getGridIndex()).checkHasAnyLocationIdByGroupedLocationIdArray(groupedLocationIdArray) ? 1 : 0
        );
    }
    public callDistanceToGrid(argX: ExpressionParsersResultsBase.Base, argY: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(argX instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected argX.`);
        }
        if (!(argY instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected argY.`);
        }

        const x = argX.num;
        const y = argY.num;
        if ((x != Math.floor(x)) || (y != Math.floor(y))) {
            throw HelpersMisc.newError(`Invalid xy: ${x}, ${y}`);
        }

        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        const gridIndex = unit.getGridIndex();
        return new ExpressionParsersResultsNum.Num(war, Math.abs(gridIndex.getX() - x) + Math.abs(gridIndex.getY() - y));
    }
    public callDistanceToLocation(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const locationId = arg.num;
        if (locationId != Math.floor(locationId)) {
            throw HelpersMisc.newError(`Invalid locationId: ${locationId}`);
        }

        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        if ((locationId > LocationsConstants.MaxId) || (locationId < LocationsConstants.MinId)) {
            return new ExpressionParsersResultsNum.Num(war, -1);
        }

        const gridIndexList = this.getWar().getTileMap().getGridIndexListWithAnyLocationId([locationId]);
        return new ExpressionParsersResultsNum.Num(
            war,
            (gridIndexList.length <= 0) ? -1 : unit.getGridIndex().getMinDistance(gridIndexList)
        );
    }
    private callDistanceToCoUnit(): ExpressionParsersResultsNum.Num {
        const unit  = this._unit;
        const war   = this.getWar();
        if (unit == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }
        if (unit.getIsCoOnboard()) {
            return new ExpressionParsersResultsNum.Num(war, 0);
        }
        if (unit.getLoaderUnitId() != null) {
            return new ExpressionParsersResultsNum.Num(war, -1);
        }

        const gridIndexList = unit.getPlayer().getCoGridIndexListOnMap();
        return (gridIndexList.length <= 0)
            ? new ExpressionParsersResultsNum.Num(war, -1)
            : new ExpressionParsersResultsNum.Num(war, unit.getGridIndex().getMinDistance(gridIndexList));
    }
}
