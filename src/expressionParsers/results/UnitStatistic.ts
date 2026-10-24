import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";

export class UnitStatistic extends ExpressionParsersResultsBase.Base {
    public readonly playerIndexArray                : number[];
    public readonly unitTypeArray                   : number[];
    public readonly groupedObserverTeamIndexesArray : number[];
    public readonly unitGain                        : number;
    public readonly unitLoss                        : number;
    public readonly normalizedHpGain                : number;
    public readonly normalizedHpLoss                : number;

    public constructor(war: BaseWarInterfaceIBwWar.IBwWar, data: { playerIndexArray: number[], unitTypeArray: number[], groupedObserverTeamIndexesArray: number[], unitGain: number, unitLoss: number, normalizedHpGain: number, normalizedHpLoss: number }) {
        super(war);

        this.playerIndexArray                   = data.playerIndexArray;
        this.unitTypeArray                      = data.unitTypeArray;
        this.groupedObserverTeamIndexesArray    = data.groupedObserverTeamIndexesArray;
        this.unitGain                           = data.unitGain;
        this.unitLoss                           = data.unitLoss;
        this.normalizedHpGain                   = data.normalizedHpGain;
        this.normalizedHpLoss                   = data.normalizedHpLoss;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.UnitStatistic;
    }
    public checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
        if (!(rhs instanceof UnitStatistic)) {
            return false;
        }

        return (this.war                === rhs.war)
            && (this.normalizedHpGain   === rhs.normalizedHpGain)
            && (this.normalizedHpLoss   === rhs.normalizedHpLoss)
            && (this.unitGain           === rhs.unitGain)
            && (this.unitLoss           === rhs.unitLoss)
            && (HelpersCollection.checkIsSameList(this.groupedObserverTeamIndexesArray, rhs.groupedObserverTeamIndexesArray))
            && (HelpersCollection.checkIsSameList(this.unitTypeArray, rhs.unitTypeArray))
            && (HelpersCollection.checkIsSameList(this.playerIndexArray, rhs.playerIndexArray));
    }
}
