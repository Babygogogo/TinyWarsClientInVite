import {
    ExpressionParsers_Contexts_Base,
    ExpressionParsers_Enums,
    ExpressionParsers_Utils,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_War,
    Lang_Constants,
    ExpressionParsers_Contexts_War,
    type ExpressionParsers_Types,
    type ExpressionParsers_Results_Base,
    type ExpressionParsers_Results_UnitStatistic,
} from "../../internal.ts";

export class UnitStatistic extends ExpressionParsers_Contexts_Base.Base {
    private static readonly VnPlayerIndex       = "playerIndex";
    private static readonly VnTeamIndex         = "teamIndex";
    private static readonly VnUnitType          = "unitType";
    private static readonly VnUnitGain          = "unitGain";
    private static readonly VnUnitLoss          = "unitLoss";
    private static readonly VnUnitRemain        = "unitRemain";
    private static readonly VnHpGain            = "hpGain";
    private static readonly VnHpLoss            = "hpLoss";
    private static readonly VnHpRemain          = "hpRemain";
    private static readonly VnWar               = "war";

    public static readonly Variables    = UnitStatistic.generateVariables();
    public static readonly Functions    = UnitStatistic.generateFunctions();
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = ExpressionParsers_Utils.extendVariableInfoDict(ExpressionParsers_Contexts_War.War.Variables);
        variables.set(UnitStatistic.VnPlayerIndex,     { desc : Lang_Constants.TextType.A0513, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(UnitStatistic.VnTeamIndex,       { desc : Lang_Constants.TextType.A0528, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(UnitStatistic.VnUnitType,        { desc : Lang_Constants.TextType.A0514, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(UnitStatistic.VnUnitGain,        { desc : Lang_Constants.TextType.A0515, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(UnitStatistic.VnUnitLoss,        { desc : Lang_Constants.TextType.A0516, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(UnitStatistic.VnUnitRemain,      { desc : Lang_Constants.TextType.A0517, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(UnitStatistic.VnHpGain,          { desc : Lang_Constants.TextType.A0518, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(UnitStatistic.VnHpLoss,          { desc : Lang_Constants.TextType.A0519, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(UnitStatistic.VnHpRemain,        { desc : Lang_Constants.TextType.A0520, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(UnitStatistic.VnWar,             { desc : Lang_Constants.TextType.A0384, resultType : ExpressionParsers_Enums.ResultType.War,    isExtension : false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        const functions = ExpressionParsers_Utils.extendFunctionInfoDict(ExpressionParsers_Contexts_War.War.Functions);
        return functions;
    }

    private readonly _unitStatistic  : ExpressionParsers_Results_UnitStatistic.UnitStatistic;
    private _contextWar     : ExpressionParsers_Contexts_War.War | null = null;

    public constructor(data: ExpressionParsers_Results_UnitStatistic.UnitStatistic) {
        super(data.war);

        this._unitStatistic = data;
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.UnitStatistic;
    }

    public override resolveVariable(identifierName: string): ExpressionParsers_Results_Base.Base {
        const war   = this.getWar();
        const data  = this._unitStatistic;
        switch (identifierName) {
            case UnitStatistic.VnPlayerIndex   : return this.resolvePlayerIndex();
            case UnitStatistic.VnTeamIndex     : return this.resolveTeamIndex();
            case UnitStatistic.VnUnitType      : return this.resolveUnitType();
            case UnitStatistic.VnUnitGain      : return new ExpressionParsers_Results_Num.Num(war, data.unitGain);
            case UnitStatistic.VnUnitLoss      : return new ExpressionParsers_Results_Num.Num(war, data.unitLoss);
            case UnitStatistic.VnUnitRemain    : return new ExpressionParsers_Results_Num.Num(war, data.unitGain - data.unitLoss);
            case UnitStatistic.VnHpGain        : return new ExpressionParsers_Results_Num.Num(war, data.normalizedHpGain);
            case UnitStatistic.VnHpLoss        : return new ExpressionParsers_Results_Num.Num(war, data.normalizedHpLoss);
            case UnitStatistic.VnHpRemain      : return new ExpressionParsers_Results_Num.Num(war, data.normalizedHpGain - data.normalizedHpLoss);
            case UnitStatistic.VnWar           : return new ExpressionParsers_Results_War.War(war);
            default                                     : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(war)).resolveVariable(identifierName);
        }
    }
    private resolvePlayerIndex(): ExpressionParsers_Results_Num.Num {
        const war               = this.getWar();
        const playerIndexArray  = this._unitStatistic.playerIndexArray;
        const length            = playerIndexArray.length;
        if (length === 1) {
            return new ExpressionParsers_Results_Num.Num(war, playerIndexArray[0]);
        } else if (length === 0) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        } else {
            return new ExpressionParsers_Results_Num.Num(war, -1);
        }
    }
    private resolveTeamIndex(): ExpressionParsers_Results_Num.Num {
        const war               = this.getWar();
        const teamIndexArray    = [...new Set(this._unitStatistic.playerIndexArray.map(v => war.getPlayer(v).getTeamIndex()))];
        const length            = teamIndexArray.length;
        if (length === 1) {
            return new ExpressionParsers_Results_Num.Num(war, teamIndexArray[0]);
        } else if (length === 0) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        } else {
            return new ExpressionParsers_Results_Num.Num(war, -1);
        }
    }
    private resolveUnitType(): ExpressionParsers_Results_Num.Num {
        const war           = this.getWar();
        const unitTypeArray = this._unitStatistic.unitTypeArray;
        const length        = unitTypeArray.length;
        if (length === 1) {
            return new ExpressionParsers_Results_Num.Num(war, unitTypeArray[0]);
        } else if (length === 0) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        } else {
            return new ExpressionParsers_Results_Num.Num(war, -1);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        switch (identifierName) {
            default     : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
}
