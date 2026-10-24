import type * as AuxiliaryTypesGridIndex from "./GridIndex.ts";

export class MovePathNode {
    private _gridIndex      : AuxiliaryTypesGridIndex.GridIndex;
    private _totalMoveCost  : number;

    public constructor(gridIndex: AuxiliaryTypesGridIndex.GridIndex, totalMoveCost: number) {
        this._gridIndex     = gridIndex;
        this._totalMoveCost = totalMoveCost;
    }

    public getGridIndex(): AuxiliaryTypesGridIndex.GridIndex {
        return this._gridIndex;
    }
    public getTotalMoveCost(): number {
        return this._totalMoveCost;
    }
}
