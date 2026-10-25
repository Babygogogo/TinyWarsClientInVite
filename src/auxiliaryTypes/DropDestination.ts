import type { GridIndex } from "./GridIndex.ts";
import {
    DropDestination as ProtoSchemaCommonProtoStructureDropDestination,
} from "../proto/schema/CommonProto/Structure/DropDestination.ts";

export class DropDestination {
    private _gridIndex  : GridIndex;
    private _unitId     : number;

    public constructor(gridIndex: GridIndex, unitId: number) {
        this._gridIndex = gridIndex;
        this._unitId    = unitId;
    }

    public toProto(): ProtoSchemaCommonProtoStructureDropDestination {
        return ProtoSchemaCommonProtoStructureDropDestination.fromJson({
            gridIndex   : this._gridIndex.toProto().toJson(),
            unitId      : this._unitId,
        });
    }
}
