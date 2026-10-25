import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import type { IManager } from "../../weathers/IManager.ts";

export class WeatherManager extends Base {
    public readonly weatherManager: IManager;

    public constructor(weatherManager: IManager) {
        super(weatherManager.getWar());

        this.weatherManager = weatherManager;
    }

    public override getResultType(): ResultType {
        return ResultType.Weather;
    }
    public checkIsEqual(rhs: Base): boolean {
        return (rhs instanceof WeatherManager)
            && (this.weatherManager === rhs.weatherManager);
    }
}
