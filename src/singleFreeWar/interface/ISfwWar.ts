import {
    type SinglePlayerWar_Interface_ISpwWar,
} from "../../internal.ts";
import type { SettingsForSfw } from "../../proto/schema/CommonProto/WarSettings/SettingsForSfw.ts";

export interface ISfwWar extends SinglePlayerWar_Interface_ISpwWar.ISpwWar {
    getSettingsForSfw(): SettingsForSfw;
}
