import {
    ExpressionParsers_Contexts_Base,
    Utils_ClientErrorCode,
    ExpressionParsers_Enums,
    Locations_Utils,
    ExpressionParsers_Utils,
    ExpressionParsers_FunctionInfo,
    Helpers_Misc,
    AuxiliaryTypes_GridIndex,
    Locations_Constants,
    ExpressionParsers_Results_NullableUnit,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_NumArray,
    ExpressionParsers_Results_Position,
    ExpressionParsers_Results_War,
    Lang_Constants,
    ExpressionParsers_Results_Tile,
    ExpressionParsers_Contexts_War,
    type ExpressionParsers_Types,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class Position extends ExpressionParsers_Contexts_Base.Base {
    private static readonly VnX                     = "x";
    private static readonly VnY                     = "y";
    private static readonly VnUnit                  = "unit";
    private static readonly VnTile                  = "tile";
    private static readonly VnWar                   = "war";
    private static readonly VnPathVisibilityArray   = "pathVisibilityArray";

    private static readonly FnAdd                   = "add";
    private static readonly FnSub                   = "sub";
    private static readonly FnScale                 = "scale";
    private static readonly FnDistanceToGrid        = "distanceToGrid";
    private static readonly FnDistanceToLocation    = "distanceToLocation";
    private static readonly FnInLocation            = "inLocation";

    public static readonly Functions    = Position.generateFunctions();
    public static readonly Variables    = Position.generateVariables();
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = ExpressionParsers_Utils.extendVariableInfoDict(ExpressionParsers_Contexts_War.War.Variables);
        variables.set(Position.VnX,                    { desc : Lang_Constants.TextType.A0561, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Position.VnY,                    { desc : Lang_Constants.TextType.A0562, resultType : ExpressionParsers_Enums.ResultType.Number,        isExtension : false });
        variables.set(Position.VnUnit,                 { desc : Lang_Constants.TextType.A0563, resultType : ExpressionParsers_Enums.ResultType.Unit,          isExtension : false });
        variables.set(Position.VnTile,                 { desc : Lang_Constants.TextType.A0564, resultType : ExpressionParsers_Enums.ResultType.Tile,          isExtension : false });
        variables.set(Position.VnWar,                  { desc : Lang_Constants.TextType.A0384, resultType : ExpressionParsers_Enums.ResultType.War,           isExtension : false });
        variables.set(Position.VnPathVisibilityArray,  { desc : Lang_Constants.TextType.A0881, resultType : ExpressionParsers_Enums.ResultType.NumberArray,   isExtension : false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        const functions = ExpressionParsers_Utils.extendFunctionInfoDict(ExpressionParsers_Contexts_War.War.Functions);
        functions.set(
            Position.FnAdd,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0565,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Position.FnAdd, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_00,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Position) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Position.FnAdd, 1, ExpressionParsers_Enums.ResultType.Position, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_01,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Position;
                },
            ),
        );
        functions.set(
            Position.FnSub,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0566,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Position.FnSub, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_02,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Position) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Position.FnSub, 1, ExpressionParsers_Enums.ResultType.Position, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_03,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Position;
                },
            ),
        );
        functions.set(
            Position.FnScale,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0567,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Position.FnScale, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_04,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Position.FnScale, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_05,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Position;
                },
            ),
        );
        functions.set(
            Position.FnDistanceToGrid,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0568,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length === 2) {
                        for (let i = 0; i < argArray.length; ++i) {
                            const argType = argArray[i].getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            });
                            if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                                throw Helpers_Misc.newError(
                                    ExpressionParsers_Utils.getErrorTextForParameterType(Position.FnDistanceToGrid, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                    Utils_ClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_06,
                                );
                            }
                        }

                    } else if (argArray.length === 1) {
                        const argType = argArray[0].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Position) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(Position.FnDistanceToGrid, 1, ExpressionParsers_Enums.ResultType.Position, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_07,
                            );
                        }

                    } else {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Position.FnDistanceToGrid, `[1, 2]`, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_08,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Position.FnDistanceToLocation,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0569,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Position.FnDistanceToLocation, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_09,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Position.FnDistanceToLocation, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_10,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            Position.FnInLocation,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0570,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Position.FnInLocation, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_11,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Position.FnInLocation, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_12,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );

        return functions;
    }

    private readonly _x : number;
    private readonly _y : number;
    private _contextWar : ExpressionParsers_Contexts_War.War | null = null;

    public constructor(data: ExpressionParsers_Results_Position.Position) {
        super(data.war);

        this._x = data.x;
        this._y = data.y;
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.Position;
    }

    public override resolveVariable(identifierName: string): ExpressionParsers_Results_Base.Base {
        const war = this.getWar();
        switch (identifierName) {
            case Position.VnX                      : return new ExpressionParsers_Results_Num.Num(war, this._x);
            case Position.VnY                      : return new ExpressionParsers_Results_Num.Num(war, this._y);
            case Position.VnUnit                   : return this.resolveUnit();
            case Position.VnTile                   : return this.resolveTile();
            case Position.VnWar                    : return new ExpressionParsers_Results_War.War(war);
            case Position.VnPathVisibilityArray    : return this.resolvePathVisibilityArray();
            default                                         : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(war)).resolveVariable(identifierName);
        }
    }

    private resolveUnit(): ExpressionParsers_Results_NullableUnit.NullableUnit {
        const war = this.getWar();
        return new ExpressionParsers_Results_NullableUnit.NullableUnit(war, war.getUnitMap().getUnitOnMap(Helpers_Misc.getExisted(this.getGridIndexInMap())));
    }

    private resolveTile(): ExpressionParsers_Results_Tile.Tile {
        return new ExpressionParsers_Results_Tile.Tile(this.getWar().getTileMap().getTile(Helpers_Misc.getExisted(this.getGridIndexInMap())));
    }

    private resolvePathVisibilityArray(): ExpressionParsers_Results_Base.Base {
        const war = this.getWar();
        return new ExpressionParsers_Results_NumArray.NumArray(war, war.getFogMap().getRawVisibilityFromPathsForAllPlayers(Helpers_Misc.getExisted(this.getGridIndexInMap())));
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        switch (identifierName) {
            case Position.FnAdd                : return this.callAdd(argumentArray[0]);
            case Position.FnSub                : return this.callSub(argumentArray[0]);
            case Position.FnScale              : return this.callScale(argumentArray[0]);
            case Position.FnDistanceToGrid     : return this.callDistanceToGrid(argumentArray);
            case Position.FnDistanceToLocation : return this.callDistanceToLocation(argumentArray[0]);
            case Position.FnInLocation         : return this.callInLocation(argumentArray[0]);
            default                                     : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    private callAdd(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Position.Position {
        if (!(arg instanceof ExpressionParsers_Results_Position.Position)) {
            throw Helpers_Misc.newError(`Invalid arg.`);
        }

        return new ExpressionParsers_Results_Position.Position(this.getWar(), this._x + arg.x, this._y + arg.y);
    }
    private callSub(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Position.Position {
        if (!(arg instanceof ExpressionParsers_Results_Position.Position)) {
            throw Helpers_Misc.newError(`Invalid arg.`);
        }

        return new ExpressionParsers_Results_Position.Position(this.getWar(), this._x - arg.x, this._y - arg.y);
    }
    private callScale(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Position.Position {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Invalid arg.`);
        }

        return new ExpressionParsers_Results_Position.Position(this.getWar(), this._x * arg.num, this._y * arg.num);
    }
    private callDistanceToGrid(argArray: ExpressionParsers_Results_Base.Base[]): ExpressionParsers_Results_Num.Num {
        if (argArray.length === 1) {
            const arg = argArray[0];
            if (!(arg instanceof ExpressionParsers_Results_Position.Position)) {
                throw Helpers_Misc.newError(`Invalid arg.`);
            }
            return new ExpressionParsers_Results_Num.Num(this.getWar(), Math.abs(this._x - arg.x) + Math.abs(this._y - arg.y));

        } else if (argArray.length === 2) {
            const argX = argArray[0];
            const argY = argArray[1];
            if (!(argX instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Invalid argX.`);
            }
            if (!(argY instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Invalid argY.`);
            }
            return new ExpressionParsers_Results_Num.Num(this.getWar(), Math.abs(this._x - Math.floor(argX.num)) + Math.abs(this._y - Math.floor(argY.num)));
        }

        throw Helpers_Misc.newError(`Invalid argArray.`);
    }
    private callDistanceToLocation(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Invalid arg.`);
        }

        const war         = this.getWar();
        const locationId  = Math.floor(arg.num);
        if ((locationId > Locations_Constants.MaxId) || (locationId < Locations_Constants.MinId)) {
            return new ExpressionParsers_Results_Num.Num(war, -1);
        }

        const gridIndexList = this.getWar().getTileMap().getGridIndexListWithAnyLocationId([locationId]);
        if (gridIndexList.length <= 0) {
            return new ExpressionParsers_Results_Num.Num(war, -1);
        } else {
            return new ExpressionParsers_Results_Num.Num(war, Math.min(...gridIndexList.map(v => Math.abs(this._x - v.getX()) + Math.abs(this._y - v.getY()))));
        }
    }
    private callInLocation(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Invalid arg.`);
        }

        const war         = this.getWar();
        const locationId  = Math.floor(arg.num);
        if ((locationId > Locations_Constants.MaxId) || (locationId < Locations_Constants.MinId)) {
            return new ExpressionParsers_Results_Num.Num(war, 0);
        }

        const gridIndex = this.getGridIndexInMap();
        if (gridIndex == null) {
            return new ExpressionParsers_Results_Num.Num(war, 0);
        }

        const groupedLocationIdArray = Locations_Utils.encode([locationId]);
        return new ExpressionParsers_Results_Num.Num(war, war.getTileMap().getTile(gridIndex).checkHasAnyLocationIdByGroupedLocationIdArray(groupedLocationIdArray) ? 1 : 0);
    }

    private getGridIndexInMap(): AuxiliaryTypes_GridIndex.GridIndex | null {
        const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(this._x, this._y);
        return gridIndex.checkIsInsideMap(this.getWar().getTileMap().getMapSize())
            ? gridIndex
            : null;
    }
}
