import type { WoContainer } from "../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export interface ScoreAndAction {
    score   : number;
    action  : WoContainer;
}
