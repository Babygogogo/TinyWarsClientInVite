import { deleteElementFromList2 } from "../helpers/Collection.ts";
import { GridIdAndMarkTypeId } from "../proto/schema/CommonProto/Structure/GridIdAndMarkTypeId.ts";

export function addGridMark(list: GridIdAndMarkTypeId[], gridId: number, markTypeId: number): boolean {
    const existingData = list.find(v => v.getGridId() === gridId);
    if (existingData) {
        if (existingData.getMarkTypeId() === markTypeId) {
            return false;
        } else {
            existingData.setMarkTypeId(markTypeId);
            return true;
        }
    } else {
        list.push(GridIdAndMarkTypeId.fromJson({
            gridId      : gridId,
            markTypeId  : markTypeId,
        }));
        return true;
    }
}
export function deleteGridMark(list: GridIdAndMarkTypeId[], gridId: number): boolean {
    return deleteElementFromList2(list, v => v.getGridId() === gridId) > 0;
}
export function updateGridMarkList(list: GridIdAndMarkTypeId[], gridIdArrayForAddMark: number[], gridIdArrayForDeleteMark: number[], markTypeId: number): void {
    for (const gridId of gridIdArrayForAddMark) {
        const data = list.find(v => v.getGridId() === gridId);
        if (data) {
            data.setMarkTypeId(markTypeId);
        } else {
            list.push(GridIdAndMarkTypeId.fromJson({
                gridId      : gridId,
                markTypeId  : markTypeId,
            }));
        }
    }
    deleteElementFromList2(list, v => gridIdArrayForDeleteMark.includes(v.getGridId()));
}
