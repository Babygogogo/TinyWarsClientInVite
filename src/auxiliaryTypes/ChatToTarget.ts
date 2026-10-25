export class ChatToTarget {
    public toUserId?           : number | null;
    public toMcrRoomId?        : number;
    public toMfrRoomId?        : number;
    public toCcrRoomId?        : number;
    public toMapReviewTarget?  : number;
    public toPublicChannel?    : number;
    public toWarAndTeam?       : number;
    public toWarAndSelf?       : number;

    public constructor(obj: Partial<ChatToTarget> = {}) {
        Object.assign(this, obj);
    }

    public clone(): ChatToTarget {
        const target = new ChatToTarget();
        target.toUserId           = this.toUserId;
        target.toMcrRoomId        = this.toMcrRoomId;
        target.toMfrRoomId        = this.toMfrRoomId;
        target.toCcrRoomId        = this.toCcrRoomId;
        target.toMapReviewTarget  = this.toMapReviewTarget;
        target.toPublicChannel    = this.toPublicChannel;
        target.toWarAndTeam       = this.toWarAndTeam;
        target.toWarAndSelf       = this.toWarAndSelf;
        return target;
    }
}
