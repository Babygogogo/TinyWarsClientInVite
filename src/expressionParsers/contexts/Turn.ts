import {
    ExpressionParsers_Contexts_Base,
    ExpressionParsers_Enums,
    ExpressionParsers_Utils,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_Player,
    ExpressionParsers_Results_War,
    Lang_Constants,
    ExpressionParsers_Contexts_War,
    type ExpressionParsers_Types,
    type Turns_ITurnManager,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class Turn extends ExpressionParsers_Contexts_Base.Base {
    private static readonly VnPlayerIndex   = "playerIndex";
    private static readonly VnTeamIndex     = "teamIndex";
    private static readonly VnPlayer        = "player";
    private static readonly VnIndex         = "index";
    private static readonly VnPhase         = "phase";
    private static readonly VnWar           = "war";

    public static readonly Functions    = Turn.generateFunctions();
    public static readonly Variables    = Turn.generateVariables();
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = ExpressionParsers_Utils.extendVariableInfoDict(ExpressionParsers_Contexts_War.War.Variables);
        variables.set(Turn.VnPlayerIndex,    { desc : Lang_Constants.TextType.A0138, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Turn.VnTeamIndex,      { desc : Lang_Constants.TextType.A0383, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Turn.VnPlayer,         { desc : Lang_Constants.TextType.A0444, resultType : ExpressionParsers_Enums.ResultType.Player, isExtension : false });
        variables.set(Turn.VnIndex,          { desc : Lang_Constants.TextType.A0445, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Turn.VnPhase,          { desc : Lang_Constants.TextType.A0446, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Turn.VnWar,            { desc : Lang_Constants.TextType.A0384, resultType : ExpressionParsers_Enums.ResultType.War,    isExtension : false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        const functions = ExpressionParsers_Utils.extendFunctionInfoDict(ExpressionParsers_Contexts_War.War.Functions);
        return functions;
    }

    private readonly _turnManager    : Turns_ITurnManager.ITurnManager;
    private _contextWar     : ExpressionParsers_Contexts_War.War | null = null;

    public constructor(turnManager: Turns_ITurnManager.ITurnManager) {
        super(turnManager.getWar());

        this._turnManager = turnManager;
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.Turn;
    }

    public override resolveVariable(identifierName: string): ExpressionParsers_Results_Base.Base {
        const war = this.getWar();
        switch (identifierName) {
            case Turn.VnPlayerIndex    : return new ExpressionParsers_Results_Num.Num(war, this._turnManager.getPlayerIndexInTurn());
            case Turn.VnTeamIndex      : return new ExpressionParsers_Results_Num.Num(war, war.getPlayerInTurn().getTeamIndex());
            case Turn.VnPlayer         : return new ExpressionParsers_Results_Player.Player(war.getPlayer(this._turnManager.getPlayerIndexInTurn()));
            case Turn.VnIndex          : return new ExpressionParsers_Results_Num.Num(war, this._turnManager.getTurnIndex());
            case Turn.VnPhase          : return new ExpressionParsers_Results_Num.Num(war, this._turnManager.getPhaseCode());
            case Turn.VnWar            : return new ExpressionParsers_Results_War.War(this._turnManager.getWar());
            default                             : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this._turnManager.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        switch (identifierName) {
            default : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this._turnManager.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
}
