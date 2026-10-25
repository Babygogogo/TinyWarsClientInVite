import { Base } from "./Base.ts";
import { War } from "./War.ts";
import { ResultType, ContextType } from "../Enums.ts";
import { FunctionInfo } from "../FunctionInfo.ts";
import { Lambda } from "../nodes/Lambda.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";
import { Lambda as ExpressionParsersResultsLambda } from "../results/Lambda.ts";
import { NullableUnit } from "../results/NullableUnit.ts";
import { NullableUnitArray } from "../results/NullableUnitArray.ts";
import { Num } from "../results/Num.ts";
import { NumArray } from "../results/NumArray.ts";
import { Player } from "../results/Player.ts";
import { PlayerArray as ExpressionParsersResultsPlayerArray } from "../results/PlayerArray.ts";
import { Position } from "../results/Position.ts";
import { PositionArray } from "../results/PositionArray.ts";
import { Tile } from "../results/Tile.ts";
import { TileArray } from "../results/TileArray.ts";
import { TileBuff } from "../results/TileBuff.ts";
import { TileBuffArray } from "../results/TileBuffArray.ts";
import { UnitStatistic } from "../results/UnitStatistic.ts";
import { UnitStatisticArray } from "../results/UnitStatisticArray.ts";
import type { EpVariableInfoDict, EpFunctionInfoDict } from "../Types.ts";
import {
    extendVariableInfoDict,
    extendFunctionInfoDict,
    getErrorTextForParameterCount,
    getErrorTextForParameterType,
    getErrorTextForLambdaResultType,
} from "../Utils.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getValueInInt32 } from "../../numbers/Utils.ts";
import type { IPlayer as PlayersIPlayer } from "../../players/IPlayer.ts";
import type { ITile } from "../../tiles/ITile.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

type IPlayer        = PlayersIPlayer;

export class PlayerArray extends Base {
    private static readonly VnLength            = "length";

    private static readonly FnGet               = "get";
    private static readonly FnWhere             = "where";
    private static readonly FnSelect            = "select";
    private static readonly FnAll               = "all";
    private static readonly FnAny               = "any";

    public static readonly Variables    = PlayerArray.generateVariables();
    public static readonly Functions    = PlayerArray.generateFunctions();
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(PlayerArray.VnLength,    { desc: TextType.A0480, resultType: ResultType.Number, isExtension: false } );

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        functions.set(
            PlayerArray.FnGet,
            new FunctionInfo(
                TextType.A0487,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(PlayerArray.FnGet, 1, argArray.length),
                            ClientErrorCode.EpContextPlayerArray_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(PlayerArray.FnGet, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextPlayerArray_GenerateFunctions_01
                        );
                    }

                    return ResultType.Player;
                },
            )
        );
        functions.set(
            PlayerArray.FnWhere,
            new FunctionInfo(
                TextType.A0488,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(PlayerArray.FnWhere, 1, argArray.length),
                            ClientErrorCode.EpContextPlayerArray_GenerateFunctions_02
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(PlayerArray.FnWhere, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextPlayerArray_GenerateFunctions_03
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.Player],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForLambdaResultType(PlayerArray.FnWhere, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextPlayerArray_GenerateFunctions_04
                        );
                    }

                    return ResultType.PlayerArray;
                },
            )
        );
        functions.set(
            PlayerArray.FnSelect,
            new FunctionInfo(
                TextType.A0489,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(PlayerArray.FnSelect, 1, argArray.length),
                            ClientErrorCode.EpContextPlayerArray_GenerateFunctions_05
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(PlayerArray.FnSelect, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextPlayerArray_GenerateFunctions_06
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.Player],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    switch (lambdaResultType) {
                        case ResultType.Number        : return ResultType.NumberArray;
                        case ResultType.Tile          : return ResultType.TileArray;
                        case ResultType.TileBuff      : return ResultType.TileBuffArray;
                        case ResultType.Unit          : return ResultType.UnitArray;
                        case ResultType.UnitStatistic : return ResultType.UnitStatisticArray;
                        case ResultType.Player        : return ResultType.PlayerArray;
                        case ResultType.Position      : return ResultType.PositionArray;
                        default                         : throw newError(
                            getErrorTextForLambdaResultType(
                                PlayerArray.FnSelect,
                                1,
                                [
                                    ResultType.Number,
                                    ResultType.Tile,
                                    ResultType.TileBuff,
                                    ResultType.Unit,
                                    ResultType.UnitStatistic,
                                    ResultType.Player,
                                    ResultType.Position,
                                ],
                                lambdaResultType
                            ),
                            ClientErrorCode.EpContextPlayerArray_GenerateFunctions_07
                        );
                    }
                },
            )
        );
        functions.set(
            PlayerArray.FnAll,
            new FunctionInfo(
                TextType.A0509,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(PlayerArray.FnAll, 1, argArray.length),
                            ClientErrorCode.EpContextPlayerArray_GenerateFunctions_08
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(PlayerArray.FnAll, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextPlayerArray_GenerateFunctions_09
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.Player],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForLambdaResultType(PlayerArray.FnAll, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextPlayerArray_GenerateFunctions_10
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            PlayerArray.FnAny,
            new FunctionInfo(
                TextType.A0510,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(PlayerArray.FnAny, 1, argArray.length),
                            ClientErrorCode.EpContextPlayerArray_GenerateFunctions_11
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(PlayerArray.FnAny, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextPlayerArray_GenerateFunctions_12
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.Player],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForLambdaResultType(PlayerArray.FnAny, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextPlayerArray_GenerateFunctions_13
                        );
                    }

                    return ResultType.Number;
                },
            )
        );

        return functions;
    }

    private _playerArray    : IPlayer[];
    private _contextWar     : War | null = null;

    public constructor(data: ExpressionParsersResultsPlayerArray) {
        super(data.war);

        this._playerArray   = data.array;
    }

    public getContextType(): ContextType {
        return ContextType.PlayerArray;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase {
        switch (identifierName) {
            case PlayerArray.VnLength  : return new Num(this.getWar(), this._playerArray.length);
            default                             : return (this._contextWar ??= new War(this.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase[], rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        switch (identifierName) {
            case PlayerArray.FnGet     : return this.callGet(argumentArray[0]);
            case PlayerArray.FnWhere   : return this.callWhere(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case PlayerArray.FnSelect  : return this.callSelect(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case PlayerArray.FnAll     : return this.callAll(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case PlayerArray.FnAny     : return this.callAny(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            default                             : return (this._contextWar ??= new War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }

    public callGet(arg: ExpressionParsersResultsBase): Player {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const array     = this._playerArray;
        const length    = array.length;
        if (!length) {
            throw newError(`Empty array.`);
        }

        const rawIndex  = getValueInInt32(arg.num);
        const index     = rawIndex >= 0 ? rawIndex : rawIndex + length;
        const result    = array[index];
        if (result == null) {
            throw newError(`Invalid index: ${index}`);
        }

        return new Player(result);
    }

    public callWhere(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsPlayerArray {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : IPlayer[] = [];
        for (const player of this._playerArray) {
            const result = node.evalLambda(rootCtx, [new Player(player)], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`, ClientErrorCode.EpContextPlayerArray_CallWhere_00);
            }

            if (result.num !== 0) {
                resultArray.push(player);
            }
        }

        return new ExpressionParsersResultsPlayerArray(war, resultArray);
    }

    public callSelect(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const players       = this._playerArray;
        const resultType    = node.getLambdaResultType2({
            contextType                     : rootCtx.getContextType(),
            directLambdaArgumentInfoArray   : [ResultType.Player],
            indirectLambdaArgumentInfoDict  : null,
            localVariableDict               : localVariableDict,
            customCounterNameSet            : new Set(war.getInstanceWarRule().getWarEventFullData()?.getCustomCounterNameArray().map(v => v.getName() ?? ``)),
        });
        if (resultType === ResultType.Unit) {
            const resultArray: NullableUnit[] = [];
            for (const player of players) {
                const result = node.evalLambda(rootCtx, [new Player(player)], null, localVariableDict, isRestricted);
                if (!(result instanceof NullableUnit)) {
                    throw newError(`Invalid lambda result for unit.`, ClientErrorCode.EpContextPlayerArray_CallSelectNumber_00);
                }

                resultArray.push(result);
            }

            return new NullableUnitArray(war, resultArray);

        } else if (resultType === ResultType.Tile) {
            const resultArray: ITile[] = [];
            for (const player of players) {
                const result = node.evalLambda(rootCtx, [new Player(player)], null, localVariableDict, isRestricted);
                if (!(result instanceof Tile)) {
                    throw newError(`Invalid lambda result for tile.`, ClientErrorCode.EpContextPlayerArray_CallSelectNumber_01);
                }

                resultArray.push(result.tile);
            }

            return new TileArray(war, resultArray);

        } else if (resultType === ResultType.TileBuff) {
            const resultArray: TileBuff[] = [];
            for (const player of players) {
                const result = node.evalLambda(rootCtx, [new Player(player)], null, localVariableDict, isRestricted);
                if (!(result instanceof TileBuff)) {
                    throw newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result);
            }

            return new TileBuffArray(war, resultArray);

        } else if (resultType === ResultType.Player) {
            const resultArray: IPlayer[] = [];
            for (const player of players) {
                const result = node.evalLambda(rootCtx, [new Player(player)], null, localVariableDict, isRestricted);
                if (!(result instanceof Player)) {
                    throw newError(`Invalid lambda result for player.`, ClientErrorCode.EpContextPlayerArray_CallSelectNumber_02);
                }

                resultArray.push(result.player);
            }

            return new ExpressionParsersResultsPlayerArray(war, resultArray);

        } else if (resultType === ResultType.Number) {
            const resultArray: number[] = [];
            for (const player of players) {
                const result = node.evalLambda(rootCtx, [new Player(player)], null, localVariableDict, isRestricted);
                if (!(result instanceof Num)) {
                    throw newError(`Invalid lambda result for number.`, ClientErrorCode.EpContextPlayerArray_CallSelectNumber_03);
                }

                resultArray.push(result.num);
            }

            return new NumArray(war, resultArray);

        } else if (resultType === ResultType.Position) {
            const resultArray: Position[] = [];
            for (const player of players) {
                const result = node.evalLambda(rootCtx, [new Player(player)], null, localVariableDict, isRestricted);
                if (!(result instanceof Position)) {
                    throw newError(`Invalid lambda result for position.`, ClientErrorCode.EpContextPlayerArray_CallSelectNumber_04);
                }

                resultArray.push(result);
            }

            return new PositionArray(war, resultArray);

        } else if (resultType === ResultType.UnitStatistic) {
            const resultArray: UnitStatistic[] = [];
            for (const player of players) {
                const result = node.evalLambda(rootCtx, [new Player(player)], null, localVariableDict, isRestricted);
                if (!(result instanceof UnitStatistic)) {
                    throw newError(`Invalid lambda result for position.`, ClientErrorCode.EpContextPlayerArray_CallSelectNumber_05);
                }

                resultArray.push(result);
            }

            return new UnitStatisticArray(war, resultArray);

        } else {
            throw newError(`Unexpected resultType: ${resultType}`, ClientErrorCode.EpContextPlayerArray_CallSelectNumber_06);
        }
    }

    public callAll(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): Num {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war = this.getWar();
        for (const player of this._playerArray) {
            const result = node.evalLambda(rootCtx, [new Player(player)], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`);
            }

            if (result.num === 0) {
                return new Num(war, 0);
            }
        }

        return new Num(war, 1);
    }

    public callAny(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): Num {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war = this.getWar();
        for (const player of this._playerArray) {
            const result = node.evalLambda(rootCtx, [new Player(player)], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                return new Num(war, 1);
            }
        }

        return new Num(war, 0);
    }
}
