import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import { Base } from "./Base.ts";
import { War } from "./War.ts";
import {
    ResultType,
    ContextType,
} from "../Enums.ts";
import { FunctionInfo } from "../FunctionInfo.ts";
import type { Base as ResultsBase } from "../results/Base.ts";
import { NullableUnit } from "../results/NullableUnit.ts";
import { Num } from "../results/Num.ts";
import { NumArray } from "../results/NumArray.ts";
import { Position as ResultsPosition } from "../results/Position.ts";
import { Tile } from "../results/Tile.ts";
import { War as ResultsWar } from "../results/War.ts";
import type {
    EpVariableInfoDict,
    EpFunctionInfoDict,
} from "../Types.ts";
import {
    extendVariableInfoDict,
    extendFunctionInfoDict,
    getErrorTextForParameterCount,
    getErrorTextForParameterType,
} from "../Utils.ts";
import {
    newError,
    getExisted,
} from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    MaxId,
    MinId,
} from "../../locations/Constants.ts";
import { encode } from "../../locations/Utils.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class Position extends Base {
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
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(Position.VnX,                    { desc: TextType.A0561, resultType: ResultType.Number,        isExtension: false });
        variables.set(Position.VnY,                    { desc: TextType.A0562, resultType: ResultType.Number,        isExtension: false });
        variables.set(Position.VnUnit,                 { desc: TextType.A0563, resultType: ResultType.Unit,          isExtension: false });
        variables.set(Position.VnTile,                 { desc: TextType.A0564, resultType: ResultType.Tile,          isExtension: false });
        variables.set(Position.VnWar,                  { desc: TextType.A0384, resultType: ResultType.War,           isExtension: false });
        variables.set(Position.VnPathVisibilityArray,  { desc: TextType.A0881, resultType: ResultType.NumberArray,   isExtension: false });

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        functions.set(
            Position.FnAdd,
            new FunctionInfo(
                TextType.A0565,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Position.FnAdd, 1, argArray.length),
                            ClientErrorCode.EpContextPosition_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Position) {
                        throw newError(
                            getErrorTextForParameterType(Position.FnAdd, 1, ResultType.Position, argType),
                            ClientErrorCode.EpContextPosition_GenerateFunctions_01
                        );
                    }

                    return ResultType.Position;
                },
            )
        );
        functions.set(
            Position.FnSub,
            new FunctionInfo(
                TextType.A0566,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Position.FnSub, 1, argArray.length),
                            ClientErrorCode.EpContextPosition_GenerateFunctions_02
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Position) {
                        throw newError(
                            getErrorTextForParameterType(Position.FnSub, 1, ResultType.Position, argType),
                            ClientErrorCode.EpContextPosition_GenerateFunctions_03
                        );
                    }

                    return ResultType.Position;
                },
            )
        );
        functions.set(
            Position.FnScale,
            new FunctionInfo(
                TextType.A0567,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Position.FnScale, 1, argArray.length),
                            ClientErrorCode.EpContextPosition_GenerateFunctions_04
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Position.FnScale, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextPosition_GenerateFunctions_05
                        );
                    }

                    return ResultType.Position;
                },
            )
        );
        functions.set(
            Position.FnDistanceToGrid,
            new FunctionInfo(
                TextType.A0568,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length === 2) {
                        for (let i = 0; i < argArray.length; ++i) {
                            const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                            if (argType !== ResultType.Number) {
                                throw newError(
                                    getErrorTextForParameterType(Position.FnDistanceToGrid, i + 1, ResultType.Number, argType),
                                    ClientErrorCode.EpContextPosition_GenerateFunctions_06
                                );
                            }
                        }

                    } else if (argArray.length === 1) {
                        const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Position) {
                            throw newError(
                                getErrorTextForParameterType(Position.FnDistanceToGrid, 1, ResultType.Position, argType),
                                ClientErrorCode.EpContextPosition_GenerateFunctions_07
                            );
                        }

                    } else {
                        throw newError(
                            getErrorTextForParameterCount(Position.FnDistanceToGrid, `[1, 2]`, argArray.length),
                            ClientErrorCode.EpContextPosition_GenerateFunctions_08
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Position.FnDistanceToLocation,
            new FunctionInfo(
                TextType.A0569,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Position.FnDistanceToLocation, 1, argArray.length),
                            ClientErrorCode.EpContextPosition_GenerateFunctions_09
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Position.FnDistanceToLocation, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextPosition_GenerateFunctions_10
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Position.FnInLocation,
            new FunctionInfo(
                TextType.A0570,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Position.FnInLocation, 1, argArray.length),
                            ClientErrorCode.EpContextPosition_GenerateFunctions_11
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Position.FnInLocation, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextPosition_GenerateFunctions_12
                        );
                    }

                    return ResultType.Number;
                },
            )
        );

        return functions;
    }

    private readonly _x : number;
    private readonly _y : number;
    private _contextWar : War | null = null;

    public constructor(data: ResultsPosition) {
        super(data.war);

        this._x = data.x;
        this._y = data.y;
    }

    public getContextType(): ContextType {
        return ContextType.Position;
    }

    public override resolveVariable(identifierName: string): ResultsBase {
        const war = this.getWar();
        switch (identifierName) {
            case Position.VnX                      : return new Num(war, this._x);
            case Position.VnY                      : return new Num(war, this._y);
            case Position.VnUnit                   : return this.resolveUnit();
            case Position.VnTile                   : return this.resolveTile();
            case Position.VnWar                    : return new ResultsWar(war);
            case Position.VnPathVisibilityArray    : return this.resolvePathVisibilityArray();
            default                                         : return (this._contextWar ??= new War(war)).resolveVariable(identifierName);
        }
    }

    private resolveUnit(): NullableUnit {
        const war = this.getWar();
        return new NullableUnit(war, war.getUnitMap().getUnitOnMap(getExisted(this.getGridIndexInMap())));
    }

    private resolveTile(): Tile {
        return new Tile(this.getWar().getTileMap().getTile(getExisted(this.getGridIndexInMap())));
    }

    private resolvePathVisibilityArray(): ResultsBase {
        const war = this.getWar();
        return new NumArray(war, war.getFogMap().getRawVisibilityFromPathsForAllPlayers(getExisted(this.getGridIndexInMap())));
    }

    public override callFunction(identifierName: string, argumentArray: ResultsBase[], rootCtx: Base, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsBase {
        switch (identifierName) {
            case Position.FnAdd                : return this.callAdd(argumentArray[0]);
            case Position.FnSub                : return this.callSub(argumentArray[0]);
            case Position.FnScale              : return this.callScale(argumentArray[0]);
            case Position.FnDistanceToGrid     : return this.callDistanceToGrid(argumentArray);
            case Position.FnDistanceToLocation : return this.callDistanceToLocation(argumentArray[0]);
            case Position.FnInLocation         : return this.callInLocation(argumentArray[0]);
            default                                     : return (this._contextWar ??= new War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    private callAdd(arg: ResultsBase): ResultsPosition {
        if (!(arg instanceof ResultsPosition)) {
            throw newError(`Invalid arg.`);
        }

        return new ResultsPosition(this.getWar(), this._x + arg.x, this._y + arg.y);
    }
    private callSub(arg: ResultsBase): ResultsPosition {
        if (!(arg instanceof ResultsPosition)) {
            throw newError(`Invalid arg.`);
        }

        return new ResultsPosition(this.getWar(), this._x - arg.x, this._y - arg.y);
    }
    private callScale(arg: ResultsBase): ResultsPosition {
        if (!(arg instanceof Num)) {
            throw newError(`Invalid arg.`);
        }

        return new ResultsPosition(this.getWar(), this._x * arg.num, this._y * arg.num);
    }
    private callDistanceToGrid(argArray: ResultsBase[]): Num {
        if (argArray.length === 1) {
            const arg = argArray[0];
            if (!(arg instanceof ResultsPosition)) {
                throw newError(`Invalid arg.`);
            }
            return new Num(this.getWar(), Math.abs(this._x - arg.x) + Math.abs(this._y - arg.y));

        } else if (argArray.length === 2) {
            const argX = argArray[0];
            const argY = argArray[1];
            if (!(argX instanceof Num)) {
                throw newError(`Invalid argX.`);
            }
            if (!(argY instanceof Num)) {
                throw newError(`Invalid argY.`);
            }
            return new Num(this.getWar(), Math.abs(this._x - Math.floor(argX.num)) + Math.abs(this._y - Math.floor(argY.num)));
        }

        throw newError(`Invalid argArray.`);
    }
    private callDistanceToLocation(arg: ResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Invalid arg.`);
        }

        const war         = this.getWar();
        const locationId  = Math.floor(arg.num);
        if ((locationId > MaxId) || (locationId < MinId)) {
            return new Num(war, -1);
        }

        const gridIndexList = this.getWar().getTileMap().getGridIndexListWithAnyLocationId([locationId]);
        if (gridIndexList.length <= 0) {
            return new Num(war, -1);
        } else {
            return new Num(war, Math.min(...gridIndexList.map(v => Math.abs(this._x - v.getX()) + Math.abs(this._y - v.getY()))));
        }
    }
    private callInLocation(arg: ResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Invalid arg.`);
        }

        const war         = this.getWar();
        const locationId  = Math.floor(arg.num);
        if ((locationId > MaxId) || (locationId < MinId)) {
            return new Num(war, 0);
        }

        const gridIndex = this.getGridIndexInMap();
        if (gridIndex == null) {
            return new Num(war, 0);
        }

        const groupedLocationIdArray = encode([locationId]);
        return new Num(war, war.getTileMap().getTile(gridIndex).checkHasAnyLocationIdByGroupedLocationIdArray(groupedLocationIdArray) ? 1 : 0);
    }

    private getGridIndexInMap(): GridIndex | null {
        const gridIndex = new GridIndex(this._x, this._y);
        return gridIndex.checkIsInsideMap(this.getWar().getTileMap().getMapSize())
            ? gridIndex
            : null;
    }
}
