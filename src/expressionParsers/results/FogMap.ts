import {
    ExpressionParsers_Enums,
    ExpressionParsers_Results_Base,
    FogMaps_FogMap,
} from "../../internal.ts";

export class FogMap extends ExpressionParsers_Results_Base.Base {
    public readonly fogMap: FogMaps_FogMap.FogMap;

    public constructor(fogMap: FogMaps_FogMap.FogMap) {
        super(fogMap.getWar());

        this.fogMap = fogMap;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.Fog;
    }
    public checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
        return (rhs instanceof FogMap)
            && (this.fogMap === rhs.fogMap);
    }
}
