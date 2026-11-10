import { AuxiliaryTypes_GridIndex } from "../internal";


export class RawGridIndexAndPathInfo {
    public readonly gridIndex       : AuxiliaryTypes_GridIndex.GridIndex;
    public isVisible                : boolean;
    public isBlocked                : boolean;
    public readonly isUnitInvisible : boolean;

    public constructor(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, isVisible: boolean, isBlocked: boolean, isUnitInvisible: boolean) {
        this.gridIndex       = gridIndex;
        this.isVisible       = isVisible;
        this.isBlocked       = isBlocked;
        this.isUnitInvisible = isUnitInvisible;
    }
}
