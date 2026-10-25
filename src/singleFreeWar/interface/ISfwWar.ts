import type { SettingsForSfw } from "../../proto/schema/CommonProto/WarSettings/SettingsForSfw.ts";
import type { ISpwWar } from "../../singlePlayerWar/interface/ISpwWar.ts";

export interface ISfwWar extends ISpwWar {
    getSettingsForSfw(): SettingsForSfw;
}
