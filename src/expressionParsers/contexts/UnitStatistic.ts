import * as ExpressionParsersContextsBase from "./Base.ts";
import * as ExpressionParsersContextsWar from "./War.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import type * as ExpressionParsersResultsUnitStatistic from "../results/UnitStatistic.ts";
import * as ExpressionParsersResultsWar from "../results/War.ts";
import type * as ExpressionParsersTypes from "../Types.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as LangConstants from "../../lang/Constants.ts";

export class UnitStatistic extends ExpressionParsersContextsBase.Base {
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
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        variables.set(UnitStatistic.VnPlayerIndex,     { desc: LangConstants.TextType.A0513, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnTeamIndex,       { desc: LangConstants.TextType.A0528, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnUnitType,        { desc: LangConstants.TextType.A0514, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnUnitGain,        { desc: LangConstants.TextType.A0515, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnUnitLoss,        { desc: LangConstants.TextType.A0516, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnUnitRemain,      { desc: LangConstants.TextType.A0517, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnHpGain,          { desc: LangConstants.TextType.A0518, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnHpLoss,          { desc: LangConstants.TextType.A0519, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnHpRemain,        { desc: LangConstants.TextType.A0520, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnWar,             { desc: LangConstants.TextType.A0384, resultType: ExpressionParsersEnums.ResultType.War,    isExtension: false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
        return functions;
    }

    private _unitStatistic  : ExpressionParsersResultsUnitStatistic.UnitStatistic;
    private _contextWar     : ExpressionParsersContextsWar.War | null = null;

    public constructor(data: ExpressionParsersResultsUnitStatistic.UnitStatistic) {
        super(data.war);

        this._unitStatistic = data;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.UnitStatistic;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase.Base {
        const war   = this.getWar();
        const data  = this._unitStatistic;
        switch (identifierName) {
            case UnitStatistic.VnPlayerIndex   : return this.resolvePlayerIndex();
            case UnitStatistic.VnTeamIndex     : return this.resolveTeamIndex();
            case UnitStatistic.VnUnitType      : return this.resolveUnitType();
            case UnitStatistic.VnUnitGain      : return new ExpressionParsersResultsNum.Num(war, data.unitGain);
            case UnitStatistic.VnUnitLoss      : return new ExpressionParsersResultsNum.Num(war, data.unitLoss);
            case UnitStatistic.VnUnitRemain    : return new ExpressionParsersResultsNum.Num(war, data.unitGain - data.unitLoss);
            case UnitStatistic.VnHpGain        : return new ExpressionParsersResultsNum.Num(war, data.normalizedHpGain);
            case UnitStatistic.VnHpLoss        : return new ExpressionParsersResultsNum.Num(war, data.normalizedHpLoss);
            case UnitStatistic.VnHpRemain      : return new ExpressionParsersResultsNum.Num(war, data.normalizedHpGain - data.normalizedHpLoss);
            case UnitStatistic.VnWar           : return new ExpressionParsersResultsWar.War(war);
            default                                     : return (this._contextWar ??= new ExpressionParsersContextsWar.War(war)).resolveVariable(identifierName);
        }
    }
    private resolvePlayerIndex(): ExpressionParsersResultsNum.Num {
        const war               = this.getWar();
        const playerIndexArray  = this._unitStatistic.playerIndexArray;
        const length            = playerIndexArray.length;
        if (length === 1) {
            return new ExpressionParsersResultsNum.Num(war, playerIndexArray[0]);
        } else if (length === 0) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        } else {
            return new ExpressionParsersResultsNum.Num(war, -1);
        }
    }
    private resolveTeamIndex(): ExpressionParsersResultsNum.Num {
        const war               = this.getWar();
        const teamIndexArray    = [...new Set(this._unitStatistic.playerIndexArray.map(v => war.getPlayer(v).getTeamIndex()))];
        const length            = teamIndexArray.length;
        if (length === 1) {
            return new ExpressionParsersResultsNum.Num(war, teamIndexArray[0]);
        } else if (length === 0) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        } else {
            return new ExpressionParsersResultsNum.Num(war, -1);
        }
    }
    private resolveUnitType(): ExpressionParsersResultsNum.Num {
        const war           = this.getWar();
        const unitTypeArray = this._unitStatistic.unitTypeArray;
        const length        = unitTypeArray.length;
        if (length === 1) {
            return new ExpressionParsersResultsNum.Num(war, unitTypeArray[0]);
        } else if (length === 0) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        } else {
            return new ExpressionParsersResultsNum.Num(war, -1);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        switch (identifierName) {
            default     : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
}
