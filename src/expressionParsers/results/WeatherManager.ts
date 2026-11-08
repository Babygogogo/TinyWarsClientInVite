import {
    ExpressionParsers_Enums,
    ExpressionParsers_Results_Base,
    type Weathers_Manager,
} from "../../internal.ts";

export class WeatherManager extends ExpressionParsers_Results_Base.Base {
    public readonly weatherManager: Weathers_Manager.Manager;

    public constructor(weatherManager: Weathers_Manager.Manager) {
        super(weatherManager.getWar());

        this.weatherManager = weatherManager;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.Weather;
    }
    public checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
        return (rhs instanceof WeatherManager)
            && (this.weatherManager === rhs.weatherManager);
    }
}
