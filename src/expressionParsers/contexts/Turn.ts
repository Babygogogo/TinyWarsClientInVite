import { Base } from "./Base.ts";
import { War } from "./War.ts";
import { ResultType, ContextType } from "../Enums.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";
import { Num } from "../results/Num.ts";
import { Player } from "../results/Player.ts";
import { War as ExpressionParsersResultsWar } from "../results/War.ts";
import type { EpVariableInfoDict, EpFunctionInfoDict } from "../Types.ts";
import { extendVariableInfoDict, extendFunctionInfoDict } from "../Utils.ts";
import { TextType } from "../../lang/Constants.ts";
import type { ITurnManager } from "../../turns/ITurnManager.ts";

export class Turn extends Base {
    private static readonly VnPlayerIndex   = "playerIndex";
    private static readonly VnTeamIndex     = "teamIndex";
    private static readonly VnPlayer        = "player";
    private static readonly VnIndex         = "index";
    private static readonly VnPhase         = "phase";
    private static readonly VnWar           = "war";

    public static readonly Functions    = Turn.generateFunctions();
    public static readonly Variables    = Turn.generateVariables();
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(Turn.VnPlayerIndex,    { desc: TextType.A0138, resultType: ResultType.Number, isExtension: false });
        variables.set(Turn.VnTeamIndex,      { desc: TextType.A0383, resultType: ResultType.Number, isExtension: false });
        variables.set(Turn.VnPlayer,         { desc: TextType.A0444, resultType: ResultType.Player, isExtension: false });
        variables.set(Turn.VnIndex,          { desc: TextType.A0445, resultType: ResultType.Number, isExtension: false });
        variables.set(Turn.VnPhase,          { desc: TextType.A0446, resultType: ResultType.Number, isExtension: false });
        variables.set(Turn.VnWar,            { desc: TextType.A0384, resultType: ResultType.War,    isExtension: false });

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        return functions;
    }

    private _turnManager    : ITurnManager;
    private _contextWar     : War | null = null;

    public constructor(turnManager: ITurnManager) {
        super(turnManager.getWar());

        this._turnManager = turnManager;
    }

    public getContextType(): ContextType {
        return ContextType.Turn;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase {
        const war = this.getWar();
        switch (identifierName) {
            case Turn.VnPlayerIndex    : return new Num(war, this._turnManager.getPlayerIndexInTurn());
            case Turn.VnTeamIndex      : return new Num(war, war.getPlayerInTurn().getTeamIndex());
            case Turn.VnPlayer         : return new Player(war.getPlayer(this._turnManager.getPlayerIndexInTurn()));
            case Turn.VnIndex          : return new Num(war, this._turnManager.getTurnIndex());
            case Turn.VnPhase          : return new Num(war, this._turnManager.getPhaseCode());
            case Turn.VnWar            : return new ExpressionParsersResultsWar(this._turnManager.getWar());
            default                             : return (this._contextWar ??= new War(this._turnManager.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase[], rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        switch (identifierName) {
            default : return (this._contextWar ??= new War(this._turnManager.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
}
