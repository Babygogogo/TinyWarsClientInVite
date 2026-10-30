import {
    ExpressionParsers_Results_Base,
    Helpers_Collection,
    ExpressionParsers_Enums,
    type BaseWar_Interface_IBwWar,
} from "../../internal.ts";

export class UnitStatistic extends ExpressionParsers_Results_Base.Base {
    public readonly playerIndexArray                : number[];
    public readonly unitTypeArray                   : number[];
    public readonly groupedObserverTeamIndexesArray : number[];
    public readonly unitGain                        : number;
    public readonly unitLoss                        : number;
    public readonly normalizedHpGain                : number;
    public readonly normalizedHpLoss                : number;

    public constructor(war: BaseWar_Interface_IBwWar.IBwWar, data: { playerIndexArray: number[], unitTypeArray: number[], groupedObserverTeamIndexesArray: number[], unitGain: number, unitLoss: number, normalizedHpGain: number, normalizedHpLoss: number }) {
        super(war);

        this.playerIndexArray                   = data.playerIndexArray;
        this.unitTypeArray                      = data.unitTypeArray;
        this.groupedObserverTeamIndexesArray    = data.groupedObserverTeamIndexesArray;
        this.unitGain                           = data.unitGain;
        this.unitLoss                           = data.unitLoss;
        this.normalizedHpGain                   = data.normalizedHpGain;
        this.normalizedHpLoss                   = data.normalizedHpLoss;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.UnitStatistic;
    }
    public checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
        if (!(rhs instanceof UnitStatistic)) {
            return false;
        }

        return (this.war                === rhs.war)
            && (this.normalizedHpGain   === rhs.normalizedHpGain)
            && (this.normalizedHpLoss   === rhs.normalizedHpLoss)
            && (this.unitGain           === rhs.unitGain)
            && (this.unitLoss           === rhs.unitLoss)
            && (Helpers_Collection.checkIsSameList(this.groupedObserverTeamIndexesArray, rhs.groupedObserverTeamIndexesArray))
            && (Helpers_Collection.checkIsSameList(this.unitTypeArray, rhs.unitTypeArray))
            && (Helpers_Collection.checkIsSameList(this.playerIndexArray, rhs.playerIndexArray));
    }
}
