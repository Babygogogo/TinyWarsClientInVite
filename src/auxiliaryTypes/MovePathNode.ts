import {
    type AuxiliaryTypes_GridIndex,
} from "../internal.ts";

export class MovePathNode {
    private _gridIndex      : AuxiliaryTypes_GridIndex.GridIndex;
    private _totalMoveCost  : number;

    public constructor(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, totalMoveCost: number) {
        this._gridIndex     = gridIndex;
        this._totalMoveCost = totalMoveCost;
    }

    public getGridIndex(): AuxiliaryTypes_GridIndex.GridIndex {
        return this._gridIndex;
    }
    public getTotalMoveCost(): number {
        return this._totalMoveCost;
    }
}
