import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as ExpressionParsersContextsBase from "./Base.ts";
import * as ExpressionParsersContextsWar from "./War.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersFunctionInfo from "../FunctionInfo.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsNullableUnit from "../results/NullableUnit.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersResultsNumArray from "../results/NumArray.ts";
import * as ExpressionParsersResultsPosition from "../results/Position.ts";
import * as ExpressionParsersResultsTile from "../results/Tile.ts";
import * as ExpressionParsersResultsWar from "../results/War.ts";
import type * as ExpressionParsersTypes from "../Types.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LocationsConstants from "../../locations/Constants.ts";
import * as LocationsUtils from "../../locations/Utils.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

export class Position extends ExpressionParsersContextsBase.Base {
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
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        variables.set(Position.VnX,                    { desc: LangConstants.TextType.A0561, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Position.VnY,                    { desc: LangConstants.TextType.A0562, resultType: ExpressionParsersEnums.ResultType.Number,        isExtension: false });
        variables.set(Position.VnUnit,                 { desc: LangConstants.TextType.A0563, resultType: ExpressionParsersEnums.ResultType.Unit,          isExtension: false });
        variables.set(Position.VnTile,                 { desc: LangConstants.TextType.A0564, resultType: ExpressionParsersEnums.ResultType.Tile,          isExtension: false });
        variables.set(Position.VnWar,                  { desc: LangConstants.TextType.A0384, resultType: ExpressionParsersEnums.ResultType.War,           isExtension: false });
        variables.set(Position.VnPathVisibilityArray,  { desc: LangConstants.TextType.A0881, resultType: ExpressionParsersEnums.ResultType.NumberArray,   isExtension: false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
        functions.set(
            Position.FnAdd,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0565,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Position.FnAdd, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Position) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Position.FnAdd, 1, ExpressionParsersEnums.ResultType.Position, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_01
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Position;
                },
            )
        );
        functions.set(
            Position.FnSub,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0566,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Position.FnSub, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_02
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Position) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Position.FnSub, 1, ExpressionParsersEnums.ResultType.Position, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_03
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Position;
                },
            )
        );
        functions.set(
            Position.FnScale,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0567,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Position.FnScale, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_04
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Position.FnScale, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_05
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Position;
                },
            )
        );
        functions.set(
            Position.FnDistanceToGrid,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0568,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length === 2) {
                        for (let i = 0; i < argArray.length; ++i) {
                            const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                            if (argType !== ExpressionParsersEnums.ResultType.Number) {
                                throw HelpersMisc.newError(
                                    ExpressionParsersUtils.getErrorTextForParameterType(Position.FnDistanceToGrid, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                    UtilsClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_06
                                );
                            }
                        }

                    } else if (argArray.length === 1) {
                        const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Position) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(Position.FnDistanceToGrid, 1, ExpressionParsersEnums.ResultType.Position, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_07
                            );
                        }

                    } else {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Position.FnDistanceToGrid, `[1, 2]`, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_08
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Position.FnDistanceToLocation,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0569,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Position.FnDistanceToLocation, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_09
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Position.FnDistanceToLocation, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_10
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Position.FnInLocation,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0570,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Position.FnInLocation, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_11
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Position.FnInLocation, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPosition_GenerateFunctions_12
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );

        return functions;
    }

    private readonly _x : number;
    private readonly _y : number;
    private _contextWar : ExpressionParsersContextsWar.War | null = null;

    public constructor(data: ExpressionParsersResultsPosition.Position) {
        super(data.war);

        this._x = data.x;
        this._y = data.y;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.Position;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase.Base {
        const war = this.getWar();
        switch (identifierName) {
            case Position.VnX                      : return new ExpressionParsersResultsNum.Num(war, this._x);
            case Position.VnY                      : return new ExpressionParsersResultsNum.Num(war, this._y);
            case Position.VnUnit                   : return this.resolveUnit();
            case Position.VnTile                   : return this.resolveTile();
            case Position.VnWar                    : return new ExpressionParsersResultsWar.War(war);
            case Position.VnPathVisibilityArray    : return this.resolvePathVisibilityArray();
            default                                         : return (this._contextWar ??= new ExpressionParsersContextsWar.War(war)).resolveVariable(identifierName);
        }
    }

    private resolveUnit(): ExpressionParsersResultsNullableUnit.NullableUnit {
        const war = this.getWar();
        return new ExpressionParsersResultsNullableUnit.NullableUnit(war, war.getUnitMap().getUnitOnMap(HelpersMisc.getExisted(this.getGridIndexInMap())));
    }

    private resolveTile(): ExpressionParsersResultsTile.Tile {
        return new ExpressionParsersResultsTile.Tile(this.getWar().getTileMap().getTile(HelpersMisc.getExisted(this.getGridIndexInMap())));
    }

    private resolvePathVisibilityArray(): ExpressionParsersResultsBase.Base {
        const war = this.getWar();
        return new ExpressionParsersResultsNumArray.NumArray(war, war.getFogMap().getRawVisibilityFromPathsForAllPlayers(HelpersMisc.getExisted(this.getGridIndexInMap())));
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        switch (identifierName) {
            case Position.FnAdd                : return this.callAdd(argumentArray[0]);
            case Position.FnSub                : return this.callSub(argumentArray[0]);
            case Position.FnScale              : return this.callScale(argumentArray[0]);
            case Position.FnDistanceToGrid     : return this.callDistanceToGrid(argumentArray);
            case Position.FnDistanceToLocation : return this.callDistanceToLocation(argumentArray[0]);
            case Position.FnInLocation         : return this.callInLocation(argumentArray[0]);
            default                                     : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    private callAdd(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsPosition.Position {
        if (!(arg instanceof ExpressionParsersResultsPosition.Position)) {
            throw HelpersMisc.newError(`Invalid arg.`);
        }

        return new ExpressionParsersResultsPosition.Position(this.getWar(), this._x + arg.x, this._y + arg.y);
    }
    private callSub(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsPosition.Position {
        if (!(arg instanceof ExpressionParsersResultsPosition.Position)) {
            throw HelpersMisc.newError(`Invalid arg.`);
        }

        return new ExpressionParsersResultsPosition.Position(this.getWar(), this._x - arg.x, this._y - arg.y);
    }
    private callScale(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsPosition.Position {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Invalid arg.`);
        }

        return new ExpressionParsersResultsPosition.Position(this.getWar(), this._x * arg.num, this._y * arg.num);
    }
    private callDistanceToGrid(argArray: ExpressionParsersResultsBase.Base[]): ExpressionParsersResultsNum.Num {
        if (argArray.length === 1) {
            const arg = argArray[0];
            if (!(arg instanceof ExpressionParsersResultsPosition.Position)) {
                throw HelpersMisc.newError(`Invalid arg.`);
            }
            return new ExpressionParsersResultsNum.Num(this.getWar(), Math.abs(this._x - arg.x) + Math.abs(this._y - arg.y));

        } else if (argArray.length === 2) {
            const argX = argArray[0];
            const argY = argArray[1];
            if (!(argX instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Invalid argX.`);
            }
            if (!(argY instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Invalid argY.`);
            }
            return new ExpressionParsersResultsNum.Num(this.getWar(), Math.abs(this._x - Math.floor(argX.num)) + Math.abs(this._y - Math.floor(argY.num)));
        }

        throw HelpersMisc.newError(`Invalid argArray.`);
    }
    private callDistanceToLocation(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Invalid arg.`);
        }

        const war         = this.getWar();
        const locationId  = Math.floor(arg.num);
        if ((locationId > LocationsConstants.MaxId) || (locationId < LocationsConstants.MinId)) {
            return new ExpressionParsersResultsNum.Num(war, -1);
        }

        const gridIndexList = this.getWar().getTileMap().getGridIndexListWithAnyLocationId([locationId]);
        if (gridIndexList.length <= 0) {
            return new ExpressionParsersResultsNum.Num(war, -1);
        } else {
            return new ExpressionParsersResultsNum.Num(war, Math.min(...gridIndexList.map(v => Math.abs(this._x - v.getX()) + Math.abs(this._y - v.getY()))));
        }
    }
    private callInLocation(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Invalid arg.`);
        }

        const war         = this.getWar();
        const locationId  = Math.floor(arg.num);
        if ((locationId > LocationsConstants.MaxId) || (locationId < LocationsConstants.MinId)) {
            return new ExpressionParsersResultsNum.Num(war, 0);
        }

        const gridIndex = this.getGridIndexInMap();
        if (gridIndex == null) {
            return new ExpressionParsersResultsNum.Num(war, 0);
        }

        const groupedLocationIdArray = LocationsUtils.encode([locationId]);
        return new ExpressionParsersResultsNum.Num(war, war.getTileMap().getTile(gridIndex).checkHasAnyLocationIdByGroupedLocationIdArray(groupedLocationIdArray) ? 1 : 0);
    }

    private getGridIndexInMap(): AuxiliaryTypesGridIndex.GridIndex | null {
        const gridIndex = new AuxiliaryTypesGridIndex.GridIndex(this._x, this._y);
        return gridIndex.checkIsInsideMap(this.getWar().getTileMap().getMapSize())
            ? gridIndex
            : null;
    }
}
