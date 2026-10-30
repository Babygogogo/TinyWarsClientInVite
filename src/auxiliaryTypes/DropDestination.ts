import type { GridIndex } from "./GridIndex.ts";
import { DropDestination as ProtoDropDestination } from "../proto/schema/CommonProto/Structure/DropDestination.ts";

export class DropDestination {
    private _gridIndex  : GridIndex;
    private _unitId     : number;

    public constructor(gridIndex: GridIndex, unitId: number) {
        this._gridIndex = gridIndex;
        this._unitId    = unitId;
    }

    public toProto(): ProtoDropDestination {
        return ProtoDropDestination.fromJson({
            gridIndex   : this._gridIndex.toProto().toJson(),
            unitId      : this._unitId,
        });
    }
}
