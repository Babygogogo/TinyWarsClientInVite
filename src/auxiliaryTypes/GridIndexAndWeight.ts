import type { GridIndex } from "./GridIndex.ts";
import { WeightedGridIndex } from "../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";

export class GridIndexAndWeight {
    public  gridIndex: GridIndex;
    public  weight: number;

    public constructor(gridIndex: GridIndex, weight: number) {
        this.gridIndex  = gridIndex;
        this.weight     = weight;
    }

    public toProto(): WeightedGridIndex {
        return WeightedGridIndex.fromJson({
            gridIndex   : this.gridIndex.toProto().toJson(),
            weight      : this.weight,
        });
    }
}
