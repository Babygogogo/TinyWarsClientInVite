import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";
import type * as FogMapsIFogMap from "../../fogMaps/IFogMap.ts";

type IFogMap = FogMapsIFogMap.IFogMap;

export class FogMap extends ExpressionParsersResultsBase.Base {
    public readonly fogMap: IFogMap;

    public constructor(fogMap: IFogMap) {
        super(fogMap.getWar());

        this.fogMap = fogMap;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.Fog;
    }
    public checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
        return (rhs instanceof FogMap)
            && (this.fogMap === rhs.fogMap);
    }
}
