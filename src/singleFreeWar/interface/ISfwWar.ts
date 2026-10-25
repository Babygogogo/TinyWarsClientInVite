import type {
    SettingsForSfw as ProtoSchemaCommonProtoWarSettingsSettingsForSfw,
} from "../../proto/schema/CommonProto/WarSettings/SettingsForSfw.ts";
import type { ISpwWar } from "../../singlePlayerWar/interface/ISpwWar.ts";

type SettingsForSfw = ProtoSchemaCommonProtoWarSettingsSettingsForSfw;

export interface ISfwWar extends ISpwWar {
    getSettingsForSfw(): SettingsForSfw;
}
