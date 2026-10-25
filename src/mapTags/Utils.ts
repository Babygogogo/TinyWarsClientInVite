/** 1 <= id <= 30 */
export function getEncodedMapTagId(mapTagIdArray: number[]): number {
    let encodedTagId = 0;
    for (const id of mapTagIdArray) {
        encodedTagId |= 1 << (id - 1);
    }
    return encodedTagId;
}
export function getDecodedMapTagIdList(groupedMapTagId: number): number[] {
    const idArray: number[] = [];
    for (let id = 1; id <= 30; ++id) {
        if (groupedMapTagId & (1 << (id - 1))) {
            idArray.push(id);
        }
    }
    return idArray;
}
