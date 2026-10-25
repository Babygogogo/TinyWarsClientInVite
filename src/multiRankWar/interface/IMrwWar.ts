import type { IMpwWar } from "../../multiPlayerWar/interface/IMpwWar.ts";
import type {
    SettingsForMrw as ProtoSchemaCommonProtoWarSettingsSettingsForMrw,
} from "../../proto/schema/CommonProto/WarSettings/SettingsForMrw.ts";

type SettingsForMrw = ProtoSchemaCommonProtoWarSettingsSettingsForMrw;

export interface IMrwWar extends IMpwWar {
    getCanCheat(): boolean;
    getShouldSerializeFullInfoForFreeModeGames(): boolean;

    getIsNeedExecutedOperations(): boolean;
    getIsNeedSeedRandom(): boolean;
    getNormalMapId(): number;

    getSettingsForMrw(): SettingsForMrw;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getSettingsBootTimerParams(): number[];
}
