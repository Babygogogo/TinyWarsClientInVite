import {
    ExpressionParsers_Results_Base,
    ExpressionParsers_Enums,
    type Weathers_IManager,
} from "../../internal.ts";

export class WeatherManager extends ExpressionParsers_Results_Base.Base {
    public readonly weatherManager: Weathers_IManager.IManager;

    public constructor(weatherManager: Weathers_IManager.IManager) {
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
