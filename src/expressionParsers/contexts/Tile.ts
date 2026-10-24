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
import * as ExpressionParsersResultsTileBuff from "../results/TileBuff.ts";
import * as ExpressionParsersResultsTileBuffArray from "../results/TileBuffArray.ts";
import * as ExpressionParsersResultsWar from "../results/War.ts";
import type * as ExpressionParsersTypes from "../Types.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LocationsConstants from "../../locations/Constants.ts";
import * as LocationsUtils from "../../locations/Utils.ts";
import type * as TilesITile from "../../tiles/ITile.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type ITile                  = TilesITile.ITile;

export class Tile extends ExpressionParsersContextsBase.Base {
    private static readonly VnX                     = "x";
    private static readonly VnY                     = "y";
    private static readonly VnPos                   = "pos";
    private static readonly VnPlayerIndex           = "playerIndex";
    private static readonly VnTeamIndex             = "teamIndex";
    private static readonly VnType                  = "type";
    private static readonly VnCustomNameId          = "customNameId";
    private static readonly VnBaseType              = "baseType";
    private static readonly VnObjectType            = "objectType";
    private static readonly VnHighlighted           = "highlighted";
    private static readonly VnLocationIds           = "locationIds";
    private static readonly VnHasUnit               = "hasUnit";
    private static readonly VnUnit                  = "unit";
    private static readonly VnPlayer                = "player";
    private static readonly VnWar                   = "war";

    private static readonly FnHp                    = "hp";
    private static readonly FnIncome                = "income";
    private static readonly FnCapturePoint          = "capturePoint";
    private static readonly FnBuildPoint            = "buildPoint";
    private static readonly FnInLocation            = "inLocation";
    private static readonly FnDistanceToGrid        = "distanceToGrid";
    private static readonly FnDistanceToLocation    = "distanceToLocation";
    private static readonly FnAllAbnormalStates     = "allAbnormalStates";
    private static readonly FnCanHideUnitType       = "canHideUnitType";

    public static readonly Functions    = Tile.generateFunctions();
    public static readonly Variables    = Tile.generateVariables();
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        variables.set(Tile.VnX,            { desc: LangConstants.TextType.A0131, resultType: ExpressionParsersEnums.ResultType.Number,      isExtension: false });
        variables.set(Tile.VnY,            { desc: LangConstants.TextType.A0135, resultType: ExpressionParsersEnums.ResultType.Number,      isExtension: false });
        variables.set(Tile.VnPos,          { desc: LangConstants.TextType.A0576, resultType: ExpressionParsersEnums.ResultType.Number,      isExtension: false });
        variables.set(Tile.VnPlayerIndex,  { desc: LangConstants.TextType.A0146, resultType: ExpressionParsersEnums.ResultType.Number,      isExtension: false });
        variables.set(Tile.VnTeamIndex,    { desc: LangConstants.TextType.A0152, resultType: ExpressionParsersEnums.ResultType.Number,      isExtension: false });
        variables.set(Tile.VnType,         { desc: LangConstants.TextType.A0164, resultType: ExpressionParsersEnums.ResultType.Number,      isExtension: false });
        variables.set(Tile.VnCustomNameId, { desc: LangConstants.TextType.A0962, resultType: ExpressionParsersEnums.ResultType.Number,      isExtension: false });
        variables.set(Tile.VnBaseType,     { desc: LangConstants.TextType.A0879, resultType: ExpressionParsersEnums.ResultType.Number,      isExtension: false });
        variables.set(Tile.VnObjectType,   { desc: LangConstants.TextType.A0880, resultType: ExpressionParsersEnums.ResultType.Number,      isExtension: false });
        variables.set(Tile.VnHighlighted,  { desc: LangConstants.TextType.A0174, resultType: ExpressionParsersEnums.ResultType.Number,      isExtension: false });
        variables.set(Tile.VnLocationIds,  { desc: LangConstants.TextType.A0707, resultType: ExpressionParsersEnums.ResultType.NumberArray, isExtension: false });
        variables.set(Tile.VnHasUnit,      { desc: LangConstants.TextType.A0465, resultType: ExpressionParsersEnums.ResultType.Number,      isExtension: false });
        variables.set(Tile.VnUnit,         { desc: LangConstants.TextType.A0466, resultType: ExpressionParsersEnums.ResultType.Unit,        isExtension: false });
        variables.set(Tile.VnPlayer,       { desc: LangConstants.TextType.A0470, resultType: ExpressionParsersEnums.ResultType.Player,      isExtension: false });
        variables.set(Tile.VnWar,          { desc: LangConstants.TextType.A0384, resultType: ExpressionParsersEnums.ResultType.War,         isExtension: false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
        functions.set(
            Tile.FnHp,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0165,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Tile.FnHp, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Tile.FnHp, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_01
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Tile.FnIncome,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0511,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Tile.FnIncome, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_02
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Tile.FnIncome, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_03
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Tile.FnCapturePoint,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0170,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Tile.FnCapturePoint, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_04
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Tile.FnCapturePoint, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_05
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Tile.FnBuildPoint,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0173,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Tile.FnBuildPoint, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_06
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Tile.FnBuildPoint, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_07
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Tile.FnInLocation,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0178,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Tile.FnInLocation, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_08
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Tile.FnInLocation, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_09
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Tile.FnDistanceToGrid,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0136,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Tile.FnDistanceToGrid, 2, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_10
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(Tile.FnDistanceToGrid, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_11
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Tile.FnDistanceToLocation,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0137,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Tile.FnDistanceToLocation, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_12
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Tile.FnDistanceToLocation, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_13
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Tile.FnAllAbnormalStates,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0758,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 0) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Tile.FnAllAbnormalStates, 0, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_14
                        );
                    }

                    return ExpressionParsersEnums.ResultType.TileBuffArray;
                },
            )
        );
        functions.set(
            Tile.FnCanHideUnitType,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0854,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Tile.FnCanHideUnitType, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_15
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Tile.FnCanHideUnitType, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_16
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );

        return functions;
    }

    private _tile       : ITile;
    private _contextWar : ExpressionParsersContextsWar.War | null = null;

    public constructor(tile: ITile) {
        super(tile.getWar());

        this._tile = tile;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.Tile;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase.Base {
        const tile      = this._tile;
        const war       = tile.getWar();
        const gridIndex = tile.getGridIndex();
        switch (identifierName) {
            case Tile.VnX              : return new ExpressionParsersResultsNum.Num(war, tile.getGridX());
            case Tile.VnY              : return new ExpressionParsersResultsNum.Num(war, tile.getGridY());
            case Tile.VnPos            : return new ExpressionParsersResultsPosition.Position(war, tile.getGridX(), tile.getGridY());
            case Tile.VnPlayerIndex    : return new ExpressionParsersResultsNum.Num(war, tile.getPlayerIndex());
            case Tile.VnTeamIndex      : return new ExpressionParsersResultsNum.Num(war, tile.getTeamIndex());
            case Tile.VnType           : return new ExpressionParsersResultsNum.Num(war, tile.getTileTypeId());
            case Tile.VnCustomNameId   : return new ExpressionParsersResultsNum.Num(war, tile.getCustomNameId() ?? -1);
            case Tile.VnBaseType       : return new ExpressionParsersResultsNum.Num(war, tile.getBaseType());
            case Tile.VnObjectType     : return new ExpressionParsersResultsNum.Num(war, tile.getObjectType());
            case Tile.VnHighlighted    : return new ExpressionParsersResultsNum.Num(war, tile.getIsHighlighted() ? 1 : 0);
            case Tile.VnLocationIds    : return new ExpressionParsersResultsNumArray.NumArray(war, tile.getLocationIdList(true));
            case Tile.VnHasUnit        : return new ExpressionParsersResultsNum.Num(war, war.getUnitMap().getUnitOnMap(gridIndex) ? 1 : 0);
            case Tile.VnUnit           : return new ExpressionParsersResultsNullableUnit.NullableUnit(war, war.getUnitMap().getUnitOnMap(gridIndex));
            case Tile.VnPlayer         : return new ExpressionParsersResultsPlayer.Player(tile.getPlayer());
            case Tile.VnWar            : return new ExpressionParsersResultsWar.War(war);
            default                             : return (this._contextWar ??= new ExpressionParsersContextsWar.War(war)).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        switch (identifierName) {
            case Tile.FnHp                 : return this.callHp(argumentArray[0]);
            case Tile.FnIncome             : return this.callIncome(argumentArray[0], isRestricted);
            case Tile.FnCapturePoint       : return this.callCapturePoint(argumentArray[0]);
            case Tile.FnBuildPoint         : return this.callBuildPoint(argumentArray[0]);
            case Tile.FnInLocation         : return this.callInLocation(argumentArray[0]);
            case Tile.FnDistanceToGrid     : return this.callDistanceToGrid(argumentArray[0], argumentArray[1]);
            case Tile.FnDistanceToLocation : return this.callDistanceToLocation(argumentArray[0]);
            case Tile.FnAllAbnormalStates  : return this.callAllAbnormalStates();
            case Tile.FnCanHideUnitType    : return this.callCanHideUnitType(argumentArray[0]);
            default                                 : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this._tile.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    public callHp(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        const war = this.getWar();
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const rawMaxValue   = this._tile.getMaxHp();
        const currentValue  = this._tile.getCurrentHp();
        const argNum        = arg.num;

        if (argNum === 1) {
            return new ExpressionParsersResultsNum.Num(
                war,
                rawMaxValue == null ? -1 : rawMaxValue
            );

        } else if (argNum == 2) {
            return new ExpressionParsersResultsNum.Num(
                war,
                (rawMaxValue ?? 0) - currentValue
            );

        } else if (argNum == 3) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new ExpressionParsersResultsNum.Num(war, currentValue / maxValue);
            } else {
                throw HelpersMisc.newError(`Maximum value == 0`);
            }

        } else if (argNum == 4) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new ExpressionParsersResultsNum.Num(war, (maxValue - currentValue) / maxValue);
            } else {
                throw HelpersMisc.newError(`Maximum value == 0`);
            }

        } else {
            return new ExpressionParsersResultsNum.Num(war, currentValue);
        }
    }
    public callIncome(arg: ExpressionParsersResultsBase.Base, isRestricted: boolean): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const num = arg.num;
        const war = this.getWar();
        if (num === 1) {
            if (isRestricted) {
                throw HelpersMisc.newError(`Restricted.`);
            }

            return new ExpressionParsersResultsNum.Num(war, this._tile.getIncomeForPlayer(this._tile.getPlayerIndex()));
        } else {
            return new ExpressionParsersResultsNum.Num(war, this._tile.getIncomePerTurn());
        }
    }
    public callBuildPoint(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        const war = this.getWar();
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const rawMaxValue   = this._tile.getMaxBuildPoint();
        const currentValue  = this._tile.getCurrentBuildPoint();
        const argNum        = arg.num;

        if (argNum === 1) {
            return new ExpressionParsersResultsNum.Num(
                war,
                rawMaxValue == null ? -1 : rawMaxValue
            );

        } else if (argNum == 2) {
            return new ExpressionParsersResultsNum.Num(
                war,
                (rawMaxValue ?? 0) - currentValue
            );

        } else if (argNum == 3) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new ExpressionParsersResultsNum.Num(war, currentValue / maxValue);
            } else {
                throw HelpersMisc.newError(`Maximum value == 0`);
            }

        } else if (argNum == 4) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new ExpressionParsersResultsNum.Num(war, (maxValue - currentValue) / maxValue);
            } else {
                throw HelpersMisc.newError(`Maximum value == 0`);
            }

        } else {
            return new ExpressionParsersResultsNum.Num(war, currentValue);
        }
    }
    public callCapturePoint(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        const war = this.getWar();
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const rawMaxValue   = this._tile.getMaxCapturePoint();
        const currentValue  = this._tile.getCurrentCapturePoint() ?? 0;
        const argNum        = arg.num;

        if (argNum === 1) {
            return new ExpressionParsersResultsNum.Num(
                war,
                rawMaxValue == null ? -1 : rawMaxValue
            );

        } else if (argNum == 2) {
            return new ExpressionParsersResultsNum.Num(
                war,
                (rawMaxValue ?? 0) - currentValue
            );

        } else if (argNum == 3) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new ExpressionParsersResultsNum.Num(war, currentValue / maxValue);
            } else {
                throw HelpersMisc.newError(`Maximum value == 0`);
            }

        } else if (argNum == 4) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new ExpressionParsersResultsNum.Num(war, (maxValue - currentValue) / maxValue);
            } else {
                throw HelpersMisc.newError(`Maximum value == 0`);
            }

        } else {
            return new ExpressionParsersResultsNum.Num(war, currentValue);
        }
    }
    public callInLocation(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const locationId = arg.num;
        if (locationId != Math.floor(locationId)) {
            throw HelpersMisc.newError(`Invalid locationId: ${locationId}`);
        }

        const war = this.getWar();
        if ((locationId > LocationsConstants.MaxId) || (locationId < LocationsConstants.MinId)) {
            return new ExpressionParsersResultsNum.Num(war, 0);
        }

        const groupedLocationIdArray = LocationsUtils.encode([locationId]);
        return new ExpressionParsersResultsNum.Num(war, this._tile.checkHasAnyLocationIdByGroupedLocationIdArray(groupedLocationIdArray) ? 1 : 0);
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

        return new ExpressionParsersResultsNum.Num(this.getWar(), Math.abs(this._tile.getGridX() - x) + Math.abs(this._tile.getGridY() - y));
    }
    public callDistanceToLocation(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const locationId = arg.num;
        if (locationId != Math.floor(locationId)) {
            throw HelpersMisc.newError(`Invalid locationId: ${locationId}`);
        }

        const war = this.getWar();
        if ((locationId > LocationsConstants.MaxId) || (locationId < LocationsConstants.MinId)) {
            return new ExpressionParsersResultsNum.Num(war, -1);
        }

        const gridIndexList = this._tile.getWar().getTileMap().getGridIndexListWithAnyLocationId([locationId]);
        return new ExpressionParsersResultsNum.Num(
            war,
            (gridIndexList.length <= 0) ? -1 : this._tile.getGridIndex().getMinDistance(gridIndexList)
        );
    }
    private callAllAbnormalStates(): ExpressionParsersResultsTileBuffArray.TileBuffArray {
        const tile = this._tile;
        return new ExpressionParsersResultsTileBuffArray.TileBuffArray(
            this.getWar(),
            tile.getUnfixedBuffList()?.map(v => new ExpressionParsersResultsTileBuff.TileBuff(v, tile)) ?? []
        );
    }
    private callCanHideUnitType(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const war           = this.getWar();
        const unitTypeId    = arg.num;
        if (!war.getGcData().getUnitTemplateCfg(unitTypeId)) {
            return new ExpressionParsersResultsNum.Num(war, -1);
        }

        return new ExpressionParsersResultsNum.Num(
            war,
            this._tile.checkCanHideUnitType(unitTypeId) ? 1 : 0
        );
    }
}
