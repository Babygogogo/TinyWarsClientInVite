import type * as AuxiliaryTypesGridIndex from "./GridIndex.ts";
import * as ProtoSchemaCommonProtoStructureWeightedGridIndex from "../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";

export class GridIndexAndWeight {
    public  gridIndex: AuxiliaryTypesGridIndex.GridIndex;
    public  weight: number;

    public constructor(gridIndex: AuxiliaryTypesGridIndex.GridIndex, weight: number) {
        this.gridIndex  = gridIndex;
        this.weight     = weight;
    }

    public toProto(): ProtoSchemaCommonProtoStructureWeightedGridIndex.WeightedGridIndex {
        return ProtoSchemaCommonProtoStructureWeightedGridIndex.WeightedGridIndex.fromJson({
            gridIndex   : this.gridIndex.toProto().toJson(),
            weight      : this.weight,
        });
    }
}
