import {
    ExpressionParsers_Contexts_Base,
    Utils_ClientErrorCode,
    ExpressionParsers_Enums,
    Locations_Utils,
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
    Lang_Constants,
    ExpressionParsers_Results_TileBuff,
    ExpressionParsers_Results_TileBuffArray,
    ExpressionParsers_Contexts_War,
    type ExpressionParsers_Types,
    type Tiles_ITile,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class Tile extends ExpressionParsers_Contexts_Base.Base {
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
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = ExpressionParsers_Utils.extendVariableInfoDict(ExpressionParsers_Contexts_War.War.Variables);
        variables.set(Tile.VnX,            { desc : Lang_Constants.TextType.A0131, resultType : ExpressionParsers_Enums.ResultType.Number,      isExtension : false });
        variables.set(Tile.VnY,            { desc : Lang_Constants.TextType.A0135, resultType : ExpressionParsers_Enums.ResultType.Number,      isExtension : false });
        variables.set(Tile.VnPos,          { desc : Lang_Constants.TextType.A0576, resultType : ExpressionParsers_Enums.ResultType.Number,      isExtension : false });
        variables.set(Tile.VnPlayerIndex,  { desc : Lang_Constants.TextType.A0146, resultType : ExpressionParsers_Enums.ResultType.Number,      isExtension : false });
        variables.set(Tile.VnTeamIndex,    { desc : Lang_Constants.TextType.A0152, resultType : ExpressionParsers_Enums.ResultType.Number,      isExtension : false });
        variables.set(Tile.VnType,         { desc : Lang_Constants.TextType.A0164, resultType : ExpressionParsers_Enums.ResultType.Number,      isExtension : false });
        variables.set(Tile.VnCustomNameId, { desc : Lang_Constants.TextType.A0962, resultType : ExpressionParsers_Enums.ResultType.Number,      isExtension : false });
        variables.set(Tile.VnBaseType,     { desc : Lang_Constants.TextType.A0879, resultType : ExpressionParsers_Enums.ResultType.Number,      isExtension : false });
        variables.set(Tile.VnObjectType,   { desc : Lang_Constants.TextType.A0880, resultType : ExpressionParsers_Enums.ResultType.Number,      isExtension : false });
        variables.set(Tile.VnHighlighted,  { desc : Lang_Constants.TextType.A0174, resultType : ExpressionParsers_Enums.ResultType.Number,      isExtension : false });
        variables.set(Tile.VnLocationIds,  { desc : Lang_Constants.TextType.A0707, resultType : ExpressionParsers_Enums.ResultType.NumberArray, isExtension : false });
        variables.set(Tile.VnHasUnit,      { desc : Lang_Constants.TextType.A0465, resultType : ExpressionParsers_Enums.ResultType.Number,      isExtension : false });
        variables.set(Tile.VnUnit,         { desc : Lang_Constants.TextType.A0466, resultType : ExpressionParsers_Enums.ResultType.Unit,        isExtension : false });
        variables.set(Tile.VnPlayer,       { desc : Lang_Constants.TextType.A0470, resultType : ExpressionParsers_Enums.ResultType.Player,      isExtension : false });
        variables.set(Tile.VnWar,          { desc : Lang_Constants.TextType.A0384, resultType : ExpressionParsers_Enums.ResultType.War,         isExtension : false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        const functions = ExpressionParsers_Utils.extendFunctionInfoDict(ExpressionParsers_Contexts_War.War.Functions);
        functions.set(
            Tile.FnHp,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0165,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Tile.FnHp, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_00,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Tile.FnHp, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_01,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Tile.FnIncome,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0511,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Tile.FnIncome, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_02,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Tile.FnIncome, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_03,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Tile.FnCapturePoint,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0170,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Tile.FnCapturePoint, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_04,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Tile.FnCapturePoint, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_05,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Tile.FnBuildPoint,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0173,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Tile.FnBuildPoint, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_06,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Tile.FnBuildPoint, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_07,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Tile.FnInLocation,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0178,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Tile.FnInLocation, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_08,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Tile.FnInLocation, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_09,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Tile.FnDistanceToGrid,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0136,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Tile.FnDistanceToGrid, 2, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_10,
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(Tile.FnDistanceToGrid, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_11,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Tile.FnDistanceToLocation,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0137,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Tile.FnDistanceToLocation, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_12,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Tile.FnDistanceToLocation, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_13,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Tile.FnAllAbnormalStates,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0758,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 0) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Tile.FnAllAbnormalStates, 0, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_14,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.TileBuffArray;
                },
            ),
        );
        functions.set(
            Tile.FnCanHideUnitType,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0854,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Tile.FnCanHideUnitType, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_15,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Tile.FnCanHideUnitType, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTile_GenerateFunctions_16,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );

        return functions;
    }

    private _tile       : Tiles_ITile.ITile;
    private _contextWar : ExpressionParsers_Contexts_War.War | null = null;

    public constructor(tile: Tiles_ITile.ITile) {
        super(tile.getWar());

        this._tile = tile;
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.Tile;
    }

    public override resolveVariable(identifierName: string): ExpressionParsers_Results_Base.Base {
        const tile      = this._tile;
        const war       = tile.getWar();
        const gridIndex = tile.getGridIndex();
        switch (identifierName) {
            case Tile.VnX              : return new ExpressionParsers_Results_Num.Num(war, tile.getGridX());
            case Tile.VnY              : return new ExpressionParsers_Results_Num.Num(war, tile.getGridY());
            case Tile.VnPos            : return new ExpressionParsers_Results_Position.Position(war, tile.getGridX(), tile.getGridY());
            case Tile.VnPlayerIndex    : return new ExpressionParsers_Results_Num.Num(war, tile.getPlayerIndex());
            case Tile.VnTeamIndex      : return new ExpressionParsers_Results_Num.Num(war, tile.getTeamIndex());
            case Tile.VnType           : return new ExpressionParsers_Results_Num.Num(war, tile.getTileTypeId());
            case Tile.VnCustomNameId   : return new ExpressionParsers_Results_Num.Num(war, tile.getCustomNameId() ?? -1);
            case Tile.VnBaseType       : return new ExpressionParsers_Results_Num.Num(war, tile.getBaseType());
            case Tile.VnObjectType     : return new ExpressionParsers_Results_Num.Num(war, tile.getObjectType());
            case Tile.VnHighlighted    : return new ExpressionParsers_Results_Num.Num(war, tile.getIsHighlighted() ? 1 : 0);
            case Tile.VnLocationIds    : return new ExpressionParsers_Results_NumArray.NumArray(war, tile.getLocationIdList(true));
            case Tile.VnHasUnit        : return new ExpressionParsers_Results_Num.Num(war, war.getUnitMap().getUnitOnMap(gridIndex) ? 1 : 0);
            case Tile.VnUnit           : return new ExpressionParsers_Results_NullableUnit.NullableUnit(war, war.getUnitMap().getUnitOnMap(gridIndex));
            case Tile.VnPlayer         : return new ExpressionParsers_Results_Player.Player(tile.getPlayer());
            case Tile.VnWar            : return new ExpressionParsers_Results_War.War(war);
            default                             : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(war)).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
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
            default                                 : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this._tile.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    public callHp(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        const war = this.getWar();
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const rawMaxValue   = this._tile.getMaxHp();
        const currentValue  = this._tile.getCurrentHp();
        const argNum        = arg.num;

        if (argNum === 1) {
            return new ExpressionParsers_Results_Num.Num(
                war,
                rawMaxValue == null ? -1 : rawMaxValue,
            );

        } else if (argNum == 2) {
            return new ExpressionParsers_Results_Num.Num(
                war,
                (rawMaxValue ?? 0) - currentValue,
            );

        } else if (argNum == 3) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new ExpressionParsers_Results_Num.Num(war, currentValue / maxValue);
            } else {
                throw Helpers_Misc.newError(`Maximum value == 0`);
            }

        } else if (argNum == 4) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new ExpressionParsers_Results_Num.Num(war, (maxValue - currentValue) / maxValue);
            } else {
                throw Helpers_Misc.newError(`Maximum value == 0`);
            }

        } else {
            return new ExpressionParsers_Results_Num.Num(war, currentValue);
        }
    }
    public callIncome(arg: ExpressionParsers_Results_Base.Base, isRestricted: boolean): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const num = arg.num;
        const war = this.getWar();
        if (num === 1) {
            if (isRestricted) {
                throw Helpers_Misc.newError(`Restricted.`);
            }

            return new ExpressionParsers_Results_Num.Num(war, this._tile.getIncomeForPlayer(this._tile.getPlayerIndex()));
        } else {
            return new ExpressionParsers_Results_Num.Num(war, this._tile.getIncomePerTurn());
        }
    }
    public callBuildPoint(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        const war = this.getWar();
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const rawMaxValue   = this._tile.getMaxBuildPoint();
        const currentValue  = this._tile.getCurrentBuildPoint();
        const argNum        = arg.num;

        if (argNum === 1) {
            return new ExpressionParsers_Results_Num.Num(
                war,
                rawMaxValue == null ? -1 : rawMaxValue,
            );

        } else if (argNum == 2) {
            return new ExpressionParsers_Results_Num.Num(
                war,
                (rawMaxValue ?? 0) - currentValue,
            );

        } else if (argNum == 3) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new ExpressionParsers_Results_Num.Num(war, currentValue / maxValue);
            } else {
                throw Helpers_Misc.newError(`Maximum value == 0`);
            }

        } else if (argNum == 4) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new ExpressionParsers_Results_Num.Num(war, (maxValue - currentValue) / maxValue);
            } else {
                throw Helpers_Misc.newError(`Maximum value == 0`);
            }

        } else {
            return new ExpressionParsers_Results_Num.Num(war, currentValue);
        }
    }
    public callCapturePoint(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        const war = this.getWar();
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const rawMaxValue   = this._tile.getMaxCapturePoint();
        const currentValue  = this._tile.getCurrentCapturePoint();
        const argNum        = arg.num;

        if (argNum === 1) {
            return new ExpressionParsers_Results_Num.Num(
                war,
                rawMaxValue == null ? -1 : rawMaxValue,
            );

        } else if (argNum == 2) {
            return new ExpressionParsers_Results_Num.Num(
                war,
                (rawMaxValue ?? 0) - currentValue,
            );

        } else if (argNum == 3) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new ExpressionParsers_Results_Num.Num(war, currentValue / maxValue);
            } else {
                throw Helpers_Misc.newError(`Maximum value == 0`);
            }

        } else if (argNum == 4) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new ExpressionParsers_Results_Num.Num(war, (maxValue - currentValue) / maxValue);
            } else {
                throw Helpers_Misc.newError(`Maximum value == 0`);
            }

        } else {
            return new ExpressionParsers_Results_Num.Num(war, currentValue);
        }
    }
    public callInLocation(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const locationId = arg.num;
        if (locationId != Math.floor(locationId)) {
            throw Helpers_Misc.newError(`Invalid locationId: ${locationId}`);
        }

        const war = this.getWar();
        if ((locationId > Locations_Constants.MaxId) || (locationId < Locations_Constants.MinId)) {
            return new ExpressionParsers_Results_Num.Num(war, 0);
        }

        const groupedLocationIdArray = Locations_Utils.encode([locationId]);
        return new ExpressionParsers_Results_Num.Num(war, this._tile.checkHasAnyLocationIdByGroupedLocationIdArray(groupedLocationIdArray) ? 1 : 0);
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

        return new ExpressionParsers_Results_Num.Num(this.getWar(), Math.abs(this._tile.getGridX() - x) + Math.abs(this._tile.getGridY() - y));
    }
    public callDistanceToLocation(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const locationId = arg.num;
        if (locationId != Math.floor(locationId)) {
            throw Helpers_Misc.newError(`Invalid locationId: ${locationId}`);
        }

        const war = this.getWar();
        if ((locationId > Locations_Constants.MaxId) || (locationId < Locations_Constants.MinId)) {
            return new ExpressionParsers_Results_Num.Num(war, -1);
        }

        const gridIndexList = this._tile.getWar().getTileMap().getGridIndexListWithAnyLocationId([locationId]);
        return new ExpressionParsers_Results_Num.Num(
            war,
            (gridIndexList.length <= 0) ? -1 : this._tile.getGridIndex().getMinDistance(gridIndexList),
        );
    }
    private callAllAbnormalStates(): ExpressionParsers_Results_TileBuffArray.TileBuffArray {
        const tile = this._tile;
        return new ExpressionParsers_Results_TileBuffArray.TileBuffArray(
            this.getWar(),
            tile.getUnfixedBuffList()?.map(v => new ExpressionParsers_Results_TileBuff.TileBuff(v, tile)),
        );
    }
    private callCanHideUnitType(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const war           = this.getWar();
        const unitTypeId    = arg.num;
        if (!war.getGcData().getUnitTemplateCfg(unitTypeId)) {
            return new ExpressionParsers_Results_Num.Num(war, -1);
        }

        return new ExpressionParsers_Results_Num.Num(
            war,
            this._tile.checkCanHideUnitType(unitTypeId) ? 1 : 0,
        );
    }
}
