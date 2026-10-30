import {
    type AuxiliaryTypes_GridIndex,
} from "../internal.ts";
import { WeightedGridIndex } from "../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";

export class GridIndexAndWeight {
    public  gridIndex: AuxiliaryTypes_GridIndex.GridIndex;
    public  weight: number;

    public constructor(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, weight: number) {
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
