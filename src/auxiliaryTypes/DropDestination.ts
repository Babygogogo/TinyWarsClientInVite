import type * as AuxiliaryTypesGridIndex from "./GridIndex.ts";
import * as ProtoSchemaCommonProtoStructureDropDestination from "../proto/schema/CommonProto/Structure/DropDestination.ts";

export class DropDestination {
    private _gridIndex  : AuxiliaryTypesGridIndex.GridIndex;
    private _unitId     : number;

    public constructor(gridIndex: AuxiliaryTypesGridIndex.GridIndex, unitId: number) {
        this._gridIndex = gridIndex;
        this._unitId    = unitId;
    }

    public toProto(): ProtoSchemaCommonProtoStructureDropDestination.DropDestination {
        return ProtoSchemaCommonProtoStructureDropDestination.DropDestination.fromJson({
            gridIndex   : this._gridIndex.toProto().toJson(),
            unitId      : this._unitId,
        });
    }
}
