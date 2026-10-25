import type { IMpwWar } from "../../multiPlayerWar/interface/IMpwWar.ts";
import type { SettingsForMmw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMmw.ts";

export interface IMmwWar extends IMpwWar {
    getCanCheat(): boolean;
    getShouldSerializeFullInfoForFreeModeGames(): boolean;

    getIsNeedExecutedOperations(): boolean;
    getIsNeedSeedRandom(): boolean;
    getNormalMapId(): number;

    getSettingsForMmw(): SettingsForMmw;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getSettingsBootTimerParams(): number[];
}
