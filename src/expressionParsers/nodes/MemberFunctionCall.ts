import type { Base as ContextsBase } from "../contexts/Base.ts";
import { Fog } from "../contexts/Fog.ts";
import { Num } from "../contexts/Num.ts";
import { NumArray } from "../contexts/NumArray.ts";
import { Player } from "../contexts/Player.ts";
import { PlayerArray } from "../contexts/PlayerArray.ts";
import { Position } from "../contexts/Position.ts";
import { PositionArray } from "../contexts/PositionArray.ts";
import { TaskObjective } from "../contexts/TaskObjective.ts";
import { Tile } from "../contexts/Tile.ts";
import { TileArray } from "../contexts/TileArray.ts";
import { TileBuff } from "../contexts/TileBuff.ts";
import { TileBuffArray } from "../contexts/TileBuffArray.ts";
import { Turn } from "../contexts/Turn.ts";
import { Unit } from "../contexts/Unit.ts";
import { UnitArray } from "../contexts/UnitArray.ts";
import { UnitStatistic } from "../contexts/UnitStatistic.ts";
import { UnitStatisticArray } from "../contexts/UnitStatisticArray.ts";
import { War as ContextsWar } from "../contexts/War.ts";
import { WarOperation } from "../contexts/WarOperation.ts";
import { Weather } from "../contexts/Weather.ts";
import {
    ContextType,
    ResultType,
} from "../Enums.ts";
import { Base } from "./Base.ts";
import type { Base as ResultsBase } from "../results/Base.ts";
import { FogMap } from "../results/FogMap.ts";
import { NullableUnit } from "../results/NullableUnit.ts";
import { NullableUnitArray } from "../results/NullableUnitArray.ts";
import { Num as ResultsNum } from "../results/Num.ts";
import { NumArray as ResultsNumArray } from "../results/NumArray.ts";
import { Player as ResultsPlayer } from "../results/Player.ts";
import { PlayerArray as ResultsPlayerArray } from "../results/PlayerArray.ts";
import { Position as ResultsPosition } from "../results/Position.ts";
import { PositionArray as ResultsPositionArray } from "../results/PositionArray.ts";
import { TaskObjective as ResultsTaskObjective } from "../results/TaskObjective.ts";
import { Tile as ResultsTile } from "../results/Tile.ts";
import { TileArray as ResultsTileArray } from "../results/TileArray.ts";
import { TileBuff as ResultsTileBuff } from "../results/TileBuff.ts";
import { TileBuffArray as ResultsTileBuffArray } from "../results/TileBuffArray.ts";
import { TurnManager } from "../results/TurnManager.ts";
import { UnitStatistic as ResultsUnitStatistic } from "../results/UnitStatistic.ts";
import { UnitStatisticArray as ResultsUnitStatisticArray } from "../results/UnitStatisticArray.ts";
import { War as ResultsWar } from "../results/War.ts";
import { WarOperation as ResultsWarOperation } from "../results/WarOperation.ts";
import { WeatherManager } from "../results/WeatherManager.ts";
import {
    getContextType,
    getFunctionInfoDict,
} from "../Utils.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getFormattedText,
    getExpressionParserContextName,
} from "../../lang/Utils.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class MemberFunctionCall extends Base {
    private _lhs            : Base;
    private _identifierName : string;
    private _argumentArray  : Base[];

    public constructor(lhs: Base, identifierName: string, argumentArray: Base[]) {
        super();

        this._lhs               = lhs;
        this._identifierName    = identifierName;
        this._argumentArray     = argumentArray;
    }

    public override eval(ctx: ContextsBase, rootCtx: ContextsBase, lambdaArgumentDict: Map<string, ResultsBase> | null, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsBase {
        // Evaluate all arguments
        const argArray = new Array<ResultsBase>(this._argumentArray.length);
        for (let i = 0; i < this._argumentArray.length; i++) {
            argArray[i] = this._argumentArray[i].eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        }

        // Call the function
        // TODO: add more context
        const lhsResult = this._lhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (lhsResult instanceof ResultsWar) {
            return new ContextsWar(lhsResult.war).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof TurnManager) {
            return new Turn(lhsResult.turnManager).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ResultsPlayer) {
            return new Player(lhsResult.player).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ResultsPosition) {
            return new Position(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ResultsPositionArray) {
            return new PositionArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ResultsTile) {
            return new Tile(lhsResult.tile).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof NullableUnit) {
            return new Unit(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof NullableUnitArray) {
            return new UnitArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ResultsTileArray) {
            return new TileArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ResultsPlayerArray) {
            return new PlayerArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ResultsNum) {
            return new Num(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ResultsNumArray) {
            return new NumArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof WeatherManager) {
            return new Weather(lhsResult.weatherManager).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ResultsTaskObjective) {
            return new TaskObjective(lhsResult.war, lhsResult.objectiveId).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ResultsTileBuff) {
            return new TileBuff(lhsResult.buff, lhsResult.tile).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ResultsTileBuffArray) {
            return new TileBuffArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof FogMap) {
            return new Fog(lhsResult.fogMap).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ResultsWarOperation) {
            return new WarOperation(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ResultsUnitStatistic) {
            return new UnitStatistic(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ResultsUnitStatisticArray) {
            return new UnitStatisticArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else {
            throw newError(`Unexpected lhsType: ${typeof lhsResult}`, ClientErrorCode.EpNodeMemberFunction_Eval_00);
        }
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ContextType;
        lambdaArgumentInfoDict  : Map<string, ResultType> | null;
        localVariableDict       : Map<string, ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ResultType {
        const lhsResultType     = this._lhs.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        const newContextType    = getContextType(lhsResultType);
        const identifierName    = this._identifierName;
        if ((newContextType == null) || (newContextType === ContextType.Unknown)) {
            throw newError(
                getFormattedText(TextType.F0035, identifierName),
                ClientErrorCode.EpNodeMemberFunction_GetResultType_00
            );
        }

        const info = getFunctionInfoDict(newContextType).get(identifierName);
        if (info == null) {
            throw newError(
                getFormattedText(TextType.F0036, getExpressionParserContextName(newContextType), identifierName),
                ClientErrorCode.EpNodeMemberFunction_GetResultType_01
            );
        }

        return info.getResultType(this._argumentArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet);
    }

    public override getTokensCount(): number {
        let count = this._lhs.getTokensCount() + 1 + 1;
        for (const arg of this._argumentArray) {
            count += arg.getTokensCount();
        }

        return count;
    }

    // public override getPriority(): Priority {
    //     return Priority.Leaf;
    // }
    // public override toString(): string {
    //     const lhs           = this._lhs;
    //     const lhsRawString  = lhs.toString();
    //     const lhsString     = this.getPriority() > lhs.getPriority() ? `(${lhsRawString})` : lhsRawString;
    //     return `${lhsString}.${getIdentifierName(this._identifierName) ?? Lang.ErrorTextForUndefined}(${this._argumentArray.map(v => v.toString()).join(`, `)})`;
    // }
    // public override toProto(): CommonProto.Structure.Expression.INode {
    //     return { nodeMemberFunctionCall: {
    //         identifierCode  : this._identifierName,
    //         lhs             : this._lhs.toProto(),
    //         argumentArray   : this._argumentArray.map(v => v.toProto()),
    //     } };
    // }
}
