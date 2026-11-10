import type { AuxiliaryTypes_MovePath, AuxiliaryTypes_RevisedDropUnitInfo } from "../internal";
import type { SerialUnit } from "../proto/schema/CommonProto/WarSerialization/SerialUnit";

export class ThingsForMovePath {
    private readonly _unitGridIdsForEachTeamBeforeAction    : Map<number, Set<number>>;
    private readonly _focusUnitDataBeforeAction             : SerialUnit;
    private readonly _revisedPath                           : AuxiliaryTypes_MovePath.MovePath;
    private readonly _revisedDropInfo                       : AuxiliaryTypes_RevisedDropUnitInfo.RevisedDropUnitInfo[] | undefined;

    public constructor(
        unitGridIdsForEachTeamBeforeAction  : Map<number, Set<number>>,
        focusUnitDataBeforeAction           : SerialUnit,
        revisedPath                         : AuxiliaryTypes_MovePath.MovePath,
        revisedDropInfo                     : AuxiliaryTypes_RevisedDropUnitInfo.RevisedDropUnitInfo[] | undefined,
    ) {
        this._unitGridIdsForEachTeamBeforeAction = unitGridIdsForEachTeamBeforeAction;
        this._focusUnitDataBeforeAction          = focusUnitDataBeforeAction;
        this._revisedPath                        = revisedPath;
        this._revisedDropInfo                    = revisedDropInfo;
    }

    public getUnitGridIdsForEachTeamBeforeAction(): Map<number, Set<number>> {
        return this._unitGridIdsForEachTeamBeforeAction;
    }

    public getFocusUnitDataBeforeAction(): SerialUnit {
        return this._focusUnitDataBeforeAction;
    }

    public getRevisedPath(): AuxiliaryTypes_MovePath.MovePath {
        return this._revisedPath;
    }

    public getRevisedDropInfo(): AuxiliaryTypes_RevisedDropUnitInfo.RevisedDropUnitInfo[] | undefined {
        return this._revisedDropInfo;
    }
}
