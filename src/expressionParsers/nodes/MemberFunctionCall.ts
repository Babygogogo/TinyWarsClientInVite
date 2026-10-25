import type { Base } from "../contexts/Base.ts";
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
import { War } from "../contexts/War.ts";
import { WarOperation } from "../contexts/WarOperation.ts";
import { Weather } from "../contexts/Weather.ts";
import { ContextType, ResultType } from "../Enums.ts";
import { Base as ExpressionParsersNodesBase } from "./Base.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";
import { FogMap } from "../results/FogMap.ts";
import { NullableUnit } from "../results/NullableUnit.ts";
import { NullableUnitArray } from "../results/NullableUnitArray.ts";
import { Num as ExpressionParsersResultsNum } from "../results/Num.ts";
import { NumArray as ExpressionParsersResultsNumArray } from "../results/NumArray.ts";
import { Player as ExpressionParsersResultsPlayer } from "../results/Player.ts";
import { PlayerArray as ExpressionParsersResultsPlayerArray } from "../results/PlayerArray.ts";
import { Position as ExpressionParsersResultsPosition } from "../results/Position.ts";
import { PositionArray as ExpressionParsersResultsPositionArray } from "../results/PositionArray.ts";
import { TaskObjective as ExpressionParsersResultsTaskObjective } from "../results/TaskObjective.ts";
import { Tile as ExpressionParsersResultsTile } from "../results/Tile.ts";
import { TileArray as ExpressionParsersResultsTileArray } from "../results/TileArray.ts";
import { TileBuff as ExpressionParsersResultsTileBuff } from "../results/TileBuff.ts";
import { TileBuffArray as ExpressionParsersResultsTileBuffArray } from "../results/TileBuffArray.ts";
import { TurnManager } from "../results/TurnManager.ts";
import { UnitStatistic as ExpressionParsersResultsUnitStatistic } from "../results/UnitStatistic.ts";
import { UnitStatisticArray as ExpressionParsersResultsUnitStatisticArray } from "../results/UnitStatisticArray.ts";
import { War as ExpressionParsersResultsWar } from "../results/War.ts";
import { WarOperation as ExpressionParsersResultsWarOperation } from "../results/WarOperation.ts";
import { WeatherManager } from "../results/WeatherManager.ts";
import { getContextType, getFunctionInfoDict } from "../Utils.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getFormattedText, getExpressionParserContextName } from "../../lang/Utils.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class MemberFunctionCall extends ExpressionParsersNodesBase {
    private _lhs            : ExpressionParsersNodesBase;
    private _identifierName : string;
    private _argumentArray  : ExpressionParsersNodesBase[];

    public constructor(lhs: ExpressionParsersNodesBase, identifierName: string, argumentArray: ExpressionParsersNodesBase[]) {
        super();

        this._lhs               = lhs;
        this._identifierName    = identifierName;
        this._argumentArray     = argumentArray;
    }

    public override eval(ctx: Base, rootCtx: Base, lambdaArgumentDict: Map<string, ExpressionParsersResultsBase> | null, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        // Evaluate all arguments
        const argArray = new Array<ExpressionParsersResultsBase>(this._argumentArray.length);
        for (let i = 0; i < this._argumentArray.length; i++) {
            argArray[i] = this._argumentArray[i].eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        }

        // Call the function
        // TODO: add more context
        const lhsResult = this._lhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (lhsResult instanceof ExpressionParsersResultsWar) {
            return new War(lhsResult.war).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof TurnManager) {
            return new Turn(lhsResult.turnManager).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsersResultsPlayer) {
            return new Player(lhsResult.player).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsersResultsPosition) {
            return new Position(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsersResultsPositionArray) {
            return new PositionArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsersResultsTile) {
            return new Tile(lhsResult.tile).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof NullableUnit) {
            return new Unit(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof NullableUnitArray) {
            return new UnitArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsersResultsTileArray) {
            return new TileArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsersResultsPlayerArray) {
            return new PlayerArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsersResultsNum) {
            return new Num(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsersResultsNumArray) {
            return new NumArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof WeatherManager) {
            return new Weather(lhsResult.weatherManager).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsersResultsTaskObjective) {
            return new TaskObjective(lhsResult.war, lhsResult.objectiveId).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsersResultsTileBuff) {
            return new TileBuff(lhsResult.buff, lhsResult.tile).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsersResultsTileBuffArray) {
            return new TileBuffArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof FogMap) {
            return new Fog(lhsResult.fogMap).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsersResultsWarOperation) {
            return new WarOperation(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsersResultsUnitStatistic) {
            return new UnitStatistic(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsersResultsUnitStatisticArray) {
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
