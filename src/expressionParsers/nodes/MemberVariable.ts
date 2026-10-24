import type * as ExpressionParsersContextsBase from "../contexts/Base.ts";
import * as ExpressionParsersContextsFog from "../contexts/Fog.ts";
import * as ExpressionParsersContextsNum from "../contexts/Num.ts";
import * as ExpressionParsersContextsNumArray from "../contexts/NumArray.ts";
import * as ExpressionParsersContextsPlayer from "../contexts/Player.ts";
import * as ExpressionParsersContextsPlayerArray from "../contexts/PlayerArray.ts";
import * as ExpressionParsersContextsPosition from "../contexts/Position.ts";
import * as ExpressionParsersContextsPositionArray from "../contexts/PositionArray.ts";
import * as ExpressionParsersContextsTaskObjective from "../contexts/TaskObjective.ts";
import * as ExpressionParsersContextsTile from "../contexts/Tile.ts";
import * as ExpressionParsersContextsTileArray from "../contexts/TileArray.ts";
import * as ExpressionParsersContextsTileBuff from "../contexts/TileBuff.ts";
import * as ExpressionParsersContextsTileBuffArray from "../contexts/TileBuffArray.ts";
import * as ExpressionParsersContextsTurn from "../contexts/Turn.ts";
import * as ExpressionParsersContextsUnit from "../contexts/Unit.ts";
import * as ExpressionParsersContextsUnitArray from "../contexts/UnitArray.ts";
import * as ExpressionParsersContextsUnitStatistic from "../contexts/UnitStatistic.ts";
import * as ExpressionParsersContextsUnitStatisticArray from "../contexts/UnitStatisticArray.ts";
import * as ExpressionParsersContextsWar from "../contexts/War.ts";
import * as ExpressionParsersContextsWarOperation from "../contexts/WarOperation.ts";
import * as ExpressionParsersContextsWeather from "../contexts/Weather.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersNodesBase from "./Base.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsFogMap from "../results/FogMap.ts";
import * as ExpressionParsersResultsNullableUnit from "../results/NullableUnit.ts";
import * as ExpressionParsersResultsNullableUnitArray from "../results/NullableUnitArray.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersResultsNumArray from "../results/NumArray.ts";
import * as ExpressionParsersResultsPlayer from "../results/Player.ts";
import * as ExpressionParsersResultsPlayerArray from "../results/PlayerArray.ts";
import * as ExpressionParsersResultsPosition from "../results/Position.ts";
import * as ExpressionParsersResultsPositionArray from "../results/PositionArray.ts";
import * as ExpressionParsersResultsTaskObjective from "../results/TaskObjective.ts";
import * as ExpressionParsersResultsTile from "../results/Tile.ts";
import * as ExpressionParsersResultsTileArray from "../results/TileArray.ts";
import * as ExpressionParsersResultsTileBuff from "../results/TileBuff.ts";
import * as ExpressionParsersResultsTileBuffArray from "../results/TileBuffArray.ts";
import * as ExpressionParsersResultsTurnManager from "../results/TurnManager.ts";
import * as ExpressionParsersResultsUnitStatistic from "../results/UnitStatistic.ts";
import * as ExpressionParsersResultsUnitStatisticArray from "../results/UnitStatisticArray.ts";
import * as ExpressionParsersResultsWar from "../results/War.ts";
import * as ExpressionParsersResultsWarOperation from "../results/WarOperation.ts";
import * as ExpressionParsersResultsWeatherManager from "../results/WeatherManager.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

export class MemberVariable extends ExpressionParsersNodesBase.Base {
    private _lhs            : ExpressionParsersNodesBase.Base;
    private _identifierName : string;

    public constructor(lhs: ExpressionParsersNodesBase.Base, identifierName: string) {
        super();

        this._lhs               = lhs;
        this._identifierName    = identifierName;
    }

    public override eval(ctx: ExpressionParsersContextsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, lambdaArgumentDict: Map<string, ExpressionParsersResultsBase.Base> | null, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        const lhsResult = this._lhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        // TODO: add more context
        if (lhsResult instanceof ExpressionParsersResultsWar.War) {
            return new ExpressionParsersContextsWar.War(lhsResult.war).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsTurnManager.TurnManager) {
            return new ExpressionParsersContextsTurn.Turn(lhsResult.turnManager).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsPlayer.Player) {
            return new ExpressionParsersContextsPlayer.Player(lhsResult.player).resolveVariable(this._identifierName, isRestricted);
        } else if (lhsResult instanceof ExpressionParsersResultsPosition.Position) {
            return new ExpressionParsersContextsPosition.Position(lhsResult).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsPositionArray.PositionArray) {
            return new ExpressionParsersContextsPositionArray.PositionArray(lhsResult).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsTile.Tile) {
            return new ExpressionParsersContextsTile.Tile(lhsResult.tile).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsNullableUnit.NullableUnit) {
            return new ExpressionParsersContextsUnit.Unit(lhsResult).resolveVariable(this._identifierName, isRestricted);
        } else if (lhsResult instanceof ExpressionParsersResultsNullableUnitArray.NullableUnitArray) {
            return new ExpressionParsersContextsUnitArray.UnitArray(lhsResult).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsTileArray.TileArray) {
            return new ExpressionParsersContextsTileArray.TileArray(lhsResult).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsPlayerArray.PlayerArray) {
            return new ExpressionParsersContextsPlayerArray.PlayerArray(lhsResult).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsNum.Num) {
            return new ExpressionParsersContextsNum.Num(lhsResult).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            return new ExpressionParsersContextsNumArray.NumArray(lhsResult).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsWeatherManager.WeatherManager) {
            return new ExpressionParsersContextsWeather.Weather(lhsResult.weatherManager).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsTaskObjective.TaskObjective) {
            return new ExpressionParsersContextsTaskObjective.TaskObjective(lhsResult.war, lhsResult.objectiveId).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsTileBuff.TileBuff) {
            return new ExpressionParsersContextsTileBuff.TileBuff(lhsResult.buff, lhsResult.tile).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsTileBuffArray.TileBuffArray) {
            return new ExpressionParsersContextsTileBuffArray.TileBuffArray(lhsResult).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsFogMap.FogMap) {
            return new ExpressionParsersContextsFog.Fog(lhsResult.fogMap).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsWarOperation.WarOperation) {
            return new ExpressionParsersContextsWarOperation.WarOperation(lhsResult).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsUnitStatistic.UnitStatistic) {
            return new ExpressionParsersContextsUnitStatistic.UnitStatistic(lhsResult).resolveVariable(this._identifierName);
        } else if (lhsResult instanceof ExpressionParsersResultsUnitStatisticArray.UnitStatisticArray) {
            return new ExpressionParsersContextsUnitStatisticArray.UnitStatisticArray(lhsResult).resolveVariable(this._identifierName);
        } else {
            throw HelpersMisc.newError(`Unexpected lhsType: ${typeof lhsResult}`, UtilsClientErrorCode.ClientErrorCode.EpNodeMemberVariable_Eval_00);
        }
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsersEnums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsersEnums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsersEnums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsersEnums.ResultType {
        const lhsResultType     = this._lhs.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        const newContextType    = ExpressionParsersUtils.getContextType(lhsResultType);
        const identifierName    = this._identifierName;
        if ((newContextType == null) || (newContextType === ExpressionParsersEnums.ContextType.Unknown)) {
            throw HelpersMisc.newError(
                LangUtils.getFormattedText(LangConstants.TextType.F0037, identifierName),
                UtilsClientErrorCode.ClientErrorCode.EpNodeMemberVariable_GetResultType_00
            );
        }

        const info = ExpressionParsersUtils.getVariableInfoDict(newContextType).get(identifierName);
        if (info == null) {
            throw HelpersMisc.newError(
                LangUtils.getFormattedText(LangConstants.TextType.F0038, LangUtils.getExpressionParserContextName(newContextType), identifierName),
                UtilsClientErrorCode.ClientErrorCode.EpNodeMemberVariable_GetResultType_01
            );
        }

        return info.resultType;
    }

    public override getTokensCount(): number {
        return this._lhs.getTokensCount() + 1 + 1;
    }

    // public override getPriority(): Priority {
    //     return Priority.Leaf;
    // }
    // public override toString(): string {
    //     const lhs           = this._lhs;
    //     const lhsRawString  = lhs.toString();
    //     const lhsString     = this.getPriority() > lhs.getPriority() ? `(${lhsRawString})` : lhsRawString;
    //     return `${lhsString}.${getIdentifierName(this._identifierName) ?? Lang.ErrorTextForUndefined}`;
    // }
    // public override toProto(): CommonProto.Structure.Expression.INode {
    //     return { nodeMemberVariable: {
    //         identifierCode  : this._identifierName,
    //         lhs             : this._lhs.toProto(),
    //     } };
    // }
}
