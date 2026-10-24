import type * as ProtoSchemaCommonProtoWarSettingsSettingsForSfw from "../../proto/schema/CommonProto/WarSettings/SettingsForSfw.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../singlePlayerWar/interface/ISpwWar.ts";

type SettingsForSfw = ProtoSchemaCommonProtoWarSettingsSettingsForSfw.SettingsForSfw;

export interface ISfwWar extends SinglePlayerWarInterfaceISpwWar.ISpwWar {
    getSettingsForSfw(): SettingsForSfw;
}
