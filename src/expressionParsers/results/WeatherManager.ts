import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";
import type * as WeathersIManager from "../../weathers/IManager.ts";

export class WeatherManager extends ExpressionParsersResultsBase.Base {
    public readonly weatherManager: WeathersIManager.IManager;

    public constructor(weatherManager: WeathersIManager.IManager) {
        super(weatherManager.getWar());

        this.weatherManager = weatherManager;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.Weather;
    }
    public checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
        return (rhs instanceof WeatherManager)
            && (this.weatherManager === rhs.weatherManager);
    }
}
