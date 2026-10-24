export class RoomFilter {
    roomId?             : number | null;
    mapName?            : string | null;
    coCategoryId?       : number | null;
    hasFog?             : boolean | null;
    userIdInRoom?       : number | null;
    userIdNotInRoom?    : number | null;

    public clone(): RoomFilter {
        const filter = new RoomFilter();
        filter.roomId          = this.roomId;
        filter.mapName         = this.mapName;
        filter.coCategoryId    = this.coCategoryId;
        filter.hasFog          = this.hasFog;
        filter.userIdInRoom    = this.userIdInRoom;
        filter.userIdNotInRoom = this.userIdNotInRoom;
        return filter;
    }
}
