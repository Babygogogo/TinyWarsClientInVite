import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import type { IFogMap as FogMapsIFogMap } from "../../fogMaps/IFogMap.ts";

type IFogMap = FogMapsIFogMap;

export class FogMap extends Base {
    public readonly fogMap: IFogMap;

    public constructor(fogMap: IFogMap) {
        super(fogMap.getWar());

        this.fogMap = fogMap;
    }

    public override getResultType(): ResultType {
        return ResultType.Fog;
    }
    public checkIsEqual(rhs: Base): boolean {
        return (rhs instanceof FogMap)
            && (this.fogMap === rhs.fogMap);
    }
}
