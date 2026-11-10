import type { AuxiliaryTypes_GridIndexAndInvisibility } from "../internal";
import type { SerialUnit } from "../proto/schema/CommonProto/WarSerialization/SerialUnit";

export class RevisedDropUnitInfo {
    private readonly _unitDataBeforeAction  : SerialUnit;
    private readonly _path                  : AuxiliaryTypes_GridIndexAndInvisibility.GridIndexAndInvisibility[];

    public constructor(unitDataBeforeAction: SerialUnit, path: AuxiliaryTypes_GridIndexAndInvisibility.GridIndexAndInvisibility[]) {
        this._unitDataBeforeAction  = unitDataBeforeAction;
        this._path                  = path;
    }

    public getUnitDataBeforeAction(): SerialUnit {
        return this._unitDataBeforeAction;
    }

    public getPath(): AuxiliaryTypes_GridIndexAndInvisibility.GridIndexAndInvisibility[] {
        return this._path;
    }
}
