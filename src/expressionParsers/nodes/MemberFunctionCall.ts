import {
    ExpressionParsers_Nodes_Base,
    Utils_ClientErrorCode,
    ExpressionParsers_Contexts_War,
    ExpressionParsers_Enums,
    ExpressionParsers_Contexts_Fog,
    ExpressionParsers_Results_FogMap,
    ExpressionParsers_Utils,
    Lang_Utils,
    Helpers_Misc,
    ExpressionParsers_Results_NullableUnit,
    ExpressionParsers_Results_NullableUnitArray,
    ExpressionParsers_Contexts_Num,
    ExpressionParsers_Contexts_NumArray,
    ExpressionParsers_Contexts_Player,
    ExpressionParsers_Contexts_PlayerArray,
    ExpressionParsers_Contexts_Position,
    ExpressionParsers_Contexts_PositionArray,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_NumArray,
    ExpressionParsers_Results_Player,
    ExpressionParsers_Results_PlayerArray,
    ExpressionParsers_Results_Position,
    ExpressionParsers_Results_PositionArray,
    ExpressionParsers_Results_TaskObjective,
    ExpressionParsers_Results_Tile,
    ExpressionParsers_Results_TileArray,
    ExpressionParsers_Results_TileBuff,
    ExpressionParsers_Results_TileBuffArray,
    ExpressionParsers_Results_UnitStatistic,
    ExpressionParsers_Results_UnitStatisticArray,
    ExpressionParsers_Results_War,
    ExpressionParsers_Results_WarOperation,
    ExpressionParsers_Contexts_TaskObjective,
    Lang_Constants,
    ExpressionParsers_Contexts_Tile,
    ExpressionParsers_Contexts_TileArray,
    ExpressionParsers_Contexts_TileBuff,
    ExpressionParsers_Contexts_TileBuffArray,
    ExpressionParsers_Contexts_Turn,
    ExpressionParsers_Results_TurnManager,
    ExpressionParsers_Contexts_Unit,
    ExpressionParsers_Contexts_UnitArray,
    ExpressionParsers_Contexts_UnitStatistic,
    ExpressionParsers_Contexts_UnitStatisticArray,
    ExpressionParsers_Contexts_WarOperation,
    ExpressionParsers_Contexts_Weather,
    ExpressionParsers_Results_WeatherManager,
    type ExpressionParsers_Contexts_Base,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class MemberFunctionCall extends ExpressionParsers_Nodes_Base.Base {
    private readonly _lhs            : ExpressionParsers_Nodes_Base.Base;
    private readonly _identifierName : string;
    private readonly _argumentArray  : ExpressionParsers_Nodes_Base.Base[];

    public constructor(lhs: ExpressionParsers_Nodes_Base.Base, identifierName: string, argumentArray: ExpressionParsers_Nodes_Base.Base[]) {
        super();

        this._lhs               = lhs;
        this._identifierName    = identifierName;
        this._argumentArray     = argumentArray;
    }

    public override eval(ctx: ExpressionParsers_Contexts_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, lambdaArgumentDict: Map<string, ExpressionParsers_Results_Base.Base> | null, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        // Evaluate all arguments
        const argArray = new Array<ExpressionParsers_Results_Base.Base>(this._argumentArray.length);
        for (let i = 0; i < this._argumentArray.length; i++) {
            argArray[i] = this._argumentArray[i].eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        }

        // Call the function
        // TODO: add more context
        const lhsResult = this._lhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (lhsResult instanceof ExpressionParsers_Results_War.War) {
            return new ExpressionParsers_Contexts_War.War(lhsResult.war).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_TurnManager.TurnManager) {
            return new ExpressionParsers_Contexts_Turn.Turn(lhsResult.turnManager).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_Player.Player) {
            return new ExpressionParsers_Contexts_Player.Player(lhsResult.player).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_Position.Position) {
            return new ExpressionParsers_Contexts_Position.Position(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_PositionArray.PositionArray) {
            return new ExpressionParsers_Contexts_PositionArray.PositionArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_Tile.Tile) {
            return new ExpressionParsers_Contexts_Tile.Tile(lhsResult.tile).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_NullableUnit.NullableUnit) {
            return new ExpressionParsers_Contexts_Unit.Unit(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_NullableUnitArray.NullableUnitArray) {
            return new ExpressionParsers_Contexts_UnitArray.UnitArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_TileArray.TileArray) {
            return new ExpressionParsers_Contexts_TileArray.TileArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_PlayerArray.PlayerArray) {
            return new ExpressionParsers_Contexts_PlayerArray.PlayerArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_Num.Num) {
            return new ExpressionParsers_Contexts_Num.Num(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            return new ExpressionParsers_Contexts_NumArray.NumArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_WeatherManager.WeatherManager) {
            return new ExpressionParsers_Contexts_Weather.Weather(lhsResult.weatherManager).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_TaskObjective.TaskObjective) {
            return new ExpressionParsers_Contexts_TaskObjective.TaskObjective(lhsResult.war, lhsResult.objectiveId).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_TileBuff.TileBuff) {
            return new ExpressionParsers_Contexts_TileBuff.TileBuff(lhsResult.buff, lhsResult.tile).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_TileBuffArray.TileBuffArray) {
            return new ExpressionParsers_Contexts_TileBuffArray.TileBuffArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_FogMap.FogMap) {
            return new ExpressionParsers_Contexts_Fog.Fog(lhsResult.fogMap).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_WarOperation.WarOperation) {
            return new ExpressionParsers_Contexts_WarOperation.WarOperation(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_UnitStatistic.UnitStatistic) {
            return new ExpressionParsers_Contexts_UnitStatistic.UnitStatistic(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else if (lhsResult instanceof ExpressionParsers_Results_UnitStatisticArray.UnitStatisticArray) {
            return new ExpressionParsers_Contexts_UnitStatisticArray.UnitStatisticArray(lhsResult).callFunction(this._identifierName, argArray, rootCtx, localVariableDict, isRestricted);
        } else {
            throw Helpers_Misc.newError(`Unexpected lhsType: ${typeof lhsResult}`, Utils_ClientErrorCode.ClientErrorCode.EpNodeMemberFunction_Eval_00);
        }
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsers_Enums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsers_Enums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsers_Enums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsers_Enums.ResultType {
        const lhsResultType     = this._lhs.getResultType({
            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
        });
        const newContextType    = ExpressionParsers_Utils.getContextType(lhsResultType);
        const identifierName    = this._identifierName;
        if ((newContextType == null) || (newContextType === ExpressionParsers_Enums.ContextType.Unknown)) {
            throw Helpers_Misc.newError(
                Lang_Utils.getFormattedText(Lang_Constants.TextType.F0035, identifierName),
                Utils_ClientErrorCode.ClientErrorCode.EpNodeMemberFunction_GetResultType_00,
            );
        }

        const info = ExpressionParsers_Utils.getFunctionInfoDict(newContextType).get(identifierName);
        if (info == null) {
            throw Helpers_Misc.newError(
                Lang_Utils.getFormattedText(Lang_Constants.TextType.F0036, Lang_Utils.getExpressionParserContextName(newContextType), identifierName),
                Utils_ClientErrorCode.ClientErrorCode.EpNodeMemberFunction_GetResultType_01,
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
