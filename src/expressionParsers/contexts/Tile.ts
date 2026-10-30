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
import { Player } from "../results/Player.ts";
import { Position } from "../results/Position.ts";
import { TileBuff } from "../results/TileBuff.ts";
import { TileBuffArray } from "../results/TileBuffArray.ts";
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
import { newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    MaxId,
    MinId,
} from "../../locations/Constants.ts";
import { encode } from "../../locations/Utils.ts";
import type { ITile } from "../../tiles/ITile.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class Tile extends Base {
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
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(Tile.VnX,            { desc: TextType.A0131, resultType: ResultType.Number,      isExtension: false });
        variables.set(Tile.VnY,            { desc: TextType.A0135, resultType: ResultType.Number,      isExtension: false });
        variables.set(Tile.VnPos,          { desc: TextType.A0576, resultType: ResultType.Number,      isExtension: false });
        variables.set(Tile.VnPlayerIndex,  { desc: TextType.A0146, resultType: ResultType.Number,      isExtension: false });
        variables.set(Tile.VnTeamIndex,    { desc: TextType.A0152, resultType: ResultType.Number,      isExtension: false });
        variables.set(Tile.VnType,         { desc: TextType.A0164, resultType: ResultType.Number,      isExtension: false });
        variables.set(Tile.VnCustomNameId, { desc: TextType.A0962, resultType: ResultType.Number,      isExtension: false });
        variables.set(Tile.VnBaseType,     { desc: TextType.A0879, resultType: ResultType.Number,      isExtension: false });
        variables.set(Tile.VnObjectType,   { desc: TextType.A0880, resultType: ResultType.Number,      isExtension: false });
        variables.set(Tile.VnHighlighted,  { desc: TextType.A0174, resultType: ResultType.Number,      isExtension: false });
        variables.set(Tile.VnLocationIds,  { desc: TextType.A0707, resultType: ResultType.NumberArray, isExtension: false });
        variables.set(Tile.VnHasUnit,      { desc: TextType.A0465, resultType: ResultType.Number,      isExtension: false });
        variables.set(Tile.VnUnit,         { desc: TextType.A0466, resultType: ResultType.Unit,        isExtension: false });
        variables.set(Tile.VnPlayer,       { desc: TextType.A0470, resultType: ResultType.Player,      isExtension: false });
        variables.set(Tile.VnWar,          { desc: TextType.A0384, resultType: ResultType.War,         isExtension: false });

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        functions.set(
            Tile.FnHp,
            new FunctionInfo(
                TextType.A0165,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Tile.FnHp, 1, argArray.length),
                            ClientErrorCode.EpContextTile_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Tile.FnHp, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextTile_GenerateFunctions_01
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Tile.FnIncome,
            new FunctionInfo(
                TextType.A0511,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Tile.FnIncome, 1, argArray.length),
                            ClientErrorCode.EpContextTile_GenerateFunctions_02
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Tile.FnIncome, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextTile_GenerateFunctions_03
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Tile.FnCapturePoint,
            new FunctionInfo(
                TextType.A0170,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Tile.FnCapturePoint, 1, argArray.length),
                            ClientErrorCode.EpContextTile_GenerateFunctions_04
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Tile.FnCapturePoint, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextTile_GenerateFunctions_05
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Tile.FnBuildPoint,
            new FunctionInfo(
                TextType.A0173,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Tile.FnBuildPoint, 1, argArray.length),
                            ClientErrorCode.EpContextTile_GenerateFunctions_06
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Tile.FnBuildPoint, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextTile_GenerateFunctions_07
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Tile.FnInLocation,
            new FunctionInfo(
                TextType.A0178,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Tile.FnInLocation, 1, argArray.length),
                            ClientErrorCode.EpContextTile_GenerateFunctions_08
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Tile.FnInLocation, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextTile_GenerateFunctions_09
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Tile.FnDistanceToGrid,
            new FunctionInfo(
                TextType.A0136,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw newError(
                            getErrorTextForParameterCount(Tile.FnDistanceToGrid, 2, argArray.length),
                            ClientErrorCode.EpContextTile_GenerateFunctions_10
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(Tile.FnDistanceToGrid, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextTile_GenerateFunctions_11
                            );
                        }
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Tile.FnDistanceToLocation,
            new FunctionInfo(
                TextType.A0137,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Tile.FnDistanceToLocation, 1, argArray.length),
                            ClientErrorCode.EpContextTile_GenerateFunctions_12
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Tile.FnDistanceToLocation, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextTile_GenerateFunctions_13
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Tile.FnAllAbnormalStates,
            new FunctionInfo(
                TextType.A0758,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 0) {
                        throw newError(
                            getErrorTextForParameterCount(Tile.FnAllAbnormalStates, 0, argArray.length),
                            ClientErrorCode.EpContextTile_GenerateFunctions_14
                        );
                    }

                    return ResultType.TileBuffArray;
                },
            )
        );
        functions.set(
            Tile.FnCanHideUnitType,
            new FunctionInfo(
                TextType.A0854,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Tile.FnCanHideUnitType, 1, argArray.length),
                            ClientErrorCode.EpContextTile_GenerateFunctions_15
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Tile.FnCanHideUnitType, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextTile_GenerateFunctions_16
                        );
                    }

                    return ResultType.Number;
                },
            )
        );

        return functions;
    }

    private _tile       : ITile;
    private _contextWar : War | null = null;

    public constructor(tile: ITile) {
        super(tile.getWar());

        this._tile = tile;
    }

    public getContextType(): ContextType {
        return ContextType.Tile;
    }

    public override resolveVariable(identifierName: string): ResultsBase {
        const tile      = this._tile;
        const war       = tile.getWar();
        const gridIndex = tile.getGridIndex();
        switch (identifierName) {
            case Tile.VnX              : return new Num(war, tile.getGridX());
            case Tile.VnY              : return new Num(war, tile.getGridY());
            case Tile.VnPos            : return new Position(war, tile.getGridX(), tile.getGridY());
            case Tile.VnPlayerIndex    : return new Num(war, tile.getPlayerIndex());
            case Tile.VnTeamIndex      : return new Num(war, tile.getTeamIndex());
            case Tile.VnType           : return new Num(war, tile.getTileTypeId());
            case Tile.VnCustomNameId   : return new Num(war, tile.getCustomNameId() ?? -1);
            case Tile.VnBaseType       : return new Num(war, tile.getBaseType());
            case Tile.VnObjectType     : return new Num(war, tile.getObjectType());
            case Tile.VnHighlighted    : return new Num(war, tile.getIsHighlighted() ? 1 : 0);
            case Tile.VnLocationIds    : return new NumArray(war, tile.getLocationIdList(true));
            case Tile.VnHasUnit        : return new Num(war, war.getUnitMap().getUnitOnMap(gridIndex) ? 1 : 0);
            case Tile.VnUnit           : return new NullableUnit(war, war.getUnitMap().getUnitOnMap(gridIndex));
            case Tile.VnPlayer         : return new Player(tile.getPlayer());
            case Tile.VnWar            : return new ResultsWar(war);
            default                             : return (this._contextWar ??= new War(war)).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ResultsBase[], rootCtx: Base, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsBase {
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
            default                                 : return (this._contextWar ??= new War(this._tile.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    public callHp(arg: ResultsBase): Num {
        const war = this.getWar();
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const rawMaxValue   = this._tile.getMaxHp();
        const currentValue  = this._tile.getCurrentHp();
        const argNum        = arg.num;

        if (argNum === 1) {
            return new Num(
                war,
                rawMaxValue == null ? -1 : rawMaxValue
            );

        } else if (argNum == 2) {
            return new Num(
                war,
                (rawMaxValue ?? 0) - currentValue
            );

        } else if (argNum == 3) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new Num(war, currentValue / maxValue);
            } else {
                throw newError(`Maximum value == 0`);
            }

        } else if (argNum == 4) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new Num(war, (maxValue - currentValue) / maxValue);
            } else {
                throw newError(`Maximum value == 0`);
            }

        } else {
            return new Num(war, currentValue);
        }
    }
    public callIncome(arg: ResultsBase, isRestricted: boolean): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const num = arg.num;
        const war = this.getWar();
        if (num === 1) {
            if (isRestricted) {
                throw newError(`Restricted.`);
            }

            return new Num(war, this._tile.getIncomeForPlayer(this._tile.getPlayerIndex()));
        } else {
            return new Num(war, this._tile.getIncomePerTurn());
        }
    }
    public callBuildPoint(arg: ResultsBase): Num {
        const war = this.getWar();
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const rawMaxValue   = this._tile.getMaxBuildPoint();
        const currentValue  = this._tile.getCurrentBuildPoint();
        const argNum        = arg.num;

        if (argNum === 1) {
            return new Num(
                war,
                rawMaxValue == null ? -1 : rawMaxValue
            );

        } else if (argNum == 2) {
            return new Num(
                war,
                (rawMaxValue ?? 0) - currentValue
            );

        } else if (argNum == 3) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new Num(war, currentValue / maxValue);
            } else {
                throw newError(`Maximum value == 0`);
            }

        } else if (argNum == 4) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new Num(war, (maxValue - currentValue) / maxValue);
            } else {
                throw newError(`Maximum value == 0`);
            }

        } else {
            return new Num(war, currentValue);
        }
    }
    public callCapturePoint(arg: ResultsBase): Num {
        const war = this.getWar();
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const rawMaxValue   = this._tile.getMaxCapturePoint();
        const currentValue  = this._tile.getCurrentCapturePoint();
        const argNum        = arg.num;

        if (argNum === 1) {
            return new Num(
                war,
                rawMaxValue == null ? -1 : rawMaxValue
            );

        } else if (argNum == 2) {
            return new Num(
                war,
                (rawMaxValue ?? 0) - currentValue
            );

        } else if (argNum == 3) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new Num(war, currentValue / maxValue);
            } else {
                throw newError(`Maximum value == 0`);
            }

        } else if (argNum == 4) {
            const maxValue = rawMaxValue ?? 0;
            if (maxValue != 0) {
                return new Num(war, (maxValue - currentValue) / maxValue);
            } else {
                throw newError(`Maximum value == 0`);
            }

        } else {
            return new Num(war, currentValue);
        }
    }
    public callInLocation(arg: ResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const locationId = arg.num;
        if (locationId != Math.floor(locationId)) {
            throw newError(`Invalid locationId: ${locationId}`);
        }

        const war = this.getWar();
        if ((locationId > MaxId) || (locationId < MinId)) {
            return new Num(war, 0);
        }

        const groupedLocationIdArray = encode([locationId]);
        return new Num(war, this._tile.checkHasAnyLocationIdByGroupedLocationIdArray(groupedLocationIdArray) ? 1 : 0);
    }
    public callDistanceToGrid(argX: ResultsBase, argY: ResultsBase): Num {
        if (!(argX instanceof Num)) {
            throw newError(`Unexpected argX.`);
        }
        if (!(argY instanceof Num)) {
            throw newError(`Unexpected argY.`);
        }

        const x = argX.num;
        const y = argY.num;
        if ((x != Math.floor(x)) || (y != Math.floor(y))) {
            throw newError(`Invalid xy: ${x}, ${y}`);
        }

        return new Num(this.getWar(), Math.abs(this._tile.getGridX() - x) + Math.abs(this._tile.getGridY() - y));
    }
    public callDistanceToLocation(arg: ResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const locationId = arg.num;
        if (locationId != Math.floor(locationId)) {
            throw newError(`Invalid locationId: ${locationId}`);
        }

        const war = this.getWar();
        if ((locationId > MaxId) || (locationId < MinId)) {
            return new Num(war, -1);
        }

        const gridIndexList = this._tile.getWar().getTileMap().getGridIndexListWithAnyLocationId([locationId]);
        return new Num(
            war,
            (gridIndexList.length <= 0) ? -1 : this._tile.getGridIndex().getMinDistance(gridIndexList)
        );
    }
    private callAllAbnormalStates(): TileBuffArray {
        const tile = this._tile;
        return new TileBuffArray(
            this.getWar(),
            tile.getUnfixedBuffList()?.map(v => new TileBuff(v, tile))
        );
    }
    private callCanHideUnitType(arg: ResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const war           = this.getWar();
        const unitTypeId    = arg.num;
        if (!war.getGcData().getUnitTemplateCfg(unitTypeId)) {
            return new Num(war, -1);
        }

        return new Num(
            war,
            this._tile.checkCanHideUnitType(unitTypeId) ? 1 : 0
        );
    }
}
