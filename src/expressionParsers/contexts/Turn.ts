import * as ExpressionParsersContextsBase from "./Base.ts";
import * as ExpressionParsersContextsWar from "./War.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersResultsPlayer from "../results/Player.ts";
import * as ExpressionParsersResultsWar from "../results/War.ts";
import type * as ExpressionParsersTypes from "../Types.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as LangConstants from "../../lang/Constants.ts";
import type * as TurnsITurnManager from "../../turns/ITurnManager.ts";

type ITurnManager   = TurnsITurnManager.ITurnManager;

export class Turn extends ExpressionParsersContextsBase.Base {
    private static readonly VnPlayerIndex   = "playerIndex";
    private static readonly VnTeamIndex     = "teamIndex";
    private static readonly VnPlayer        = "player";
    private static readonly VnIndex         = "index";
    private static readonly VnPhase         = "phase";
    private static readonly VnWar           = "war";

    public static readonly Functions    = Turn.generateFunctions();
    public static readonly Variables    = Turn.generateVariables();
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        variables.set(Turn.VnPlayerIndex,    { desc: LangConstants.TextType.A0138, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Turn.VnTeamIndex,      { desc: LangConstants.TextType.A0383, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Turn.VnPlayer,         { desc: LangConstants.TextType.A0444, resultType: ExpressionParsersEnums.ResultType.Player, isExtension: false });
        variables.set(Turn.VnIndex,          { desc: LangConstants.TextType.A0445, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Turn.VnPhase,          { desc: LangConstants.TextType.A0446, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Turn.VnWar,            { desc: LangConstants.TextType.A0384, resultType: ExpressionParsersEnums.ResultType.War,    isExtension: false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
        return functions;
    }

    private _turnManager    : ITurnManager;
    private _contextWar     : ExpressionParsersContextsWar.War | null = null;

    public constructor(turnManager: ITurnManager) {
        super(turnManager.getWar());

        this._turnManager = turnManager;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.Turn;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase.Base {
        const war = this.getWar();
        switch (identifierName) {
            case Turn.VnPlayerIndex    : return new ExpressionParsersResultsNum.Num(war, this._turnManager.getPlayerIndexInTurn());
            case Turn.VnTeamIndex      : return new ExpressionParsersResultsNum.Num(war, war.getPlayerInTurn().getTeamIndex());
            case Turn.VnPlayer         : return new ExpressionParsersResultsPlayer.Player(war.getPlayer(this._turnManager.getPlayerIndexInTurn()));
            case Turn.VnIndex          : return new ExpressionParsersResultsNum.Num(war, this._turnManager.getTurnIndex());
            case Turn.VnPhase          : return new ExpressionParsersResultsNum.Num(war, this._turnManager.getPhaseCode());
            case Turn.VnWar            : return new ExpressionParsersResultsWar.War(this._turnManager.getWar());
            default                             : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this._turnManager.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        switch (identifierName) {
            default : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this._turnManager.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
}
