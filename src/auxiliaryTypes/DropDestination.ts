import {
    type AuxiliaryTypes_GridIndex,
} from "../internal.ts";
import { DropDestination as ProtoDropDestination } from "../proto/schema/CommonProto/Structure/DropDestination.ts";

export class DropDestination {
    private readonly _gridIndex  : AuxiliaryTypes_GridIndex.GridIndex;
    private readonly _unitId     : number;

    public constructor(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, unitId: number) {
        this._gridIndex = gridIndex;
        this._unitId    = unitId;
    }

    public toProto(): ProtoDropDestination {
        return ProtoDropDestination.fromJson({
            gridIndex : this._gridIndex.toProto().toJson(),
            unitId    : this._unitId,
        });
    }
}
