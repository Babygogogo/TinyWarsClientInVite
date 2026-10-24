import * as HelpersCollection from "../helpers/Collection.ts";
import * as ProtoSchemaCommonProtoStructureGridIdAndMarkTypeId from "../proto/schema/CommonProto/Structure/GridIdAndMarkTypeId.ts";

export function addGridMark(list: ProtoSchemaCommonProtoStructureGridIdAndMarkTypeId.GridIdAndMarkTypeId[], gridId: number, markTypeId: number): boolean {
    const existingData = list.find(v => v.getGridId() === gridId);
    if (existingData) {
        if (existingData.getMarkTypeId() === markTypeId) {
            return false;
        } else {
            existingData.setMarkTypeId(markTypeId);
            return true;
        }
    } else {
        list.push(ProtoSchemaCommonProtoStructureGridIdAndMarkTypeId.GridIdAndMarkTypeId.fromJson({
            gridId      : gridId,
            markTypeId  : markTypeId,
        }));
        return true;
    }
}
export function deleteGridMark(list: ProtoSchemaCommonProtoStructureGridIdAndMarkTypeId.GridIdAndMarkTypeId[], gridId: number): boolean {
    return HelpersCollection.deleteElementFromList2(list, v => v.getGridId() === gridId) > 0;
}
export function updateGridMarkList(list: ProtoSchemaCommonProtoStructureGridIdAndMarkTypeId.GridIdAndMarkTypeId[], gridIdArrayForAddMark: number[], gridIdArrayForDeleteMark: number[], markTypeId: number): void {
    for (const gridId of gridIdArrayForAddMark) {
        const data = list.find(v => v.getGridId() === gridId);
        if (data) {
            data.setMarkTypeId(markTypeId);
        } else {
            list.push(ProtoSchemaCommonProtoStructureGridIdAndMarkTypeId.GridIdAndMarkTypeId.fromJson({
                gridId      : gridId,
                markTypeId  : markTypeId,
            }));
        }
    }
    HelpersCollection.deleteElementFromList2(list, v => gridIdArrayForDeleteMark.includes(v.getGridId()));
}
