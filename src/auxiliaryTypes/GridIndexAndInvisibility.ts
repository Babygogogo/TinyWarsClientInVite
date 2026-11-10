import type { AuxiliaryTypes_GridIndex } from "../internal";

export class GridIndexAndInvisibility {
    public gridIndex    : AuxiliaryTypes_GridIndex.GridIndex;
    public isInvisible  : boolean;

    public constructor(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, isInvisible: boolean) {
        this.gridIndex   = gridIndex;
        this.isInvisible = isInvisible;
    }
}
