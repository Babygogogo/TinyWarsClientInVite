import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import { checkIsSameList } from "../../helpers/Collection.ts";

export class UnitStatistic extends Base {
    public readonly playerIndexArray                : number[];
    public readonly unitTypeArray                   : number[];
    public readonly groupedObserverTeamIndexesArray : number[];
    public readonly unitGain                        : number;
    public readonly unitLoss                        : number;
    public readonly normalizedHpGain                : number;
    public readonly normalizedHpLoss                : number;

    public constructor(war: IBwWar, data: { playerIndexArray: number[], unitTypeArray: number[], groupedObserverTeamIndexesArray: number[], unitGain: number, unitLoss: number, normalizedHpGain: number, normalizedHpLoss: number }) {
        super(war);

        this.playerIndexArray                   = data.playerIndexArray;
        this.unitTypeArray                      = data.unitTypeArray;
        this.groupedObserverTeamIndexesArray    = data.groupedObserverTeamIndexesArray;
        this.unitGain                           = data.unitGain;
        this.unitLoss                           = data.unitLoss;
        this.normalizedHpGain                   = data.normalizedHpGain;
        this.normalizedHpLoss                   = data.normalizedHpLoss;
    }

    public override getResultType(): ResultType {
        return ResultType.UnitStatistic;
    }
    public checkIsEqual(rhs: Base): boolean {
        if (!(rhs instanceof UnitStatistic)) {
            return false;
        }

        return (this.war                === rhs.war)
            && (this.normalizedHpGain   === rhs.normalizedHpGain)
            && (this.normalizedHpLoss   === rhs.normalizedHpLoss)
            && (this.unitGain           === rhs.unitGain)
            && (this.unitLoss           === rhs.unitLoss)
            && (checkIsSameList(this.groupedObserverTeamIndexesArray, rhs.groupedObserverTeamIndexesArray))
            && (checkIsSameList(this.unitTypeArray, rhs.unitTypeArray))
            && (checkIsSameList(this.playerIndexArray, rhs.playerIndexArray));
    }
}
