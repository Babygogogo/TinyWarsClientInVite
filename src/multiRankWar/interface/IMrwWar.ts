import {
    type MultiPlayerWar_Interface_IMpwWar,
} from "../../internal.ts";
import type { SettingsForMrw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMrw.ts";

export interface IMrwWar extends MultiPlayerWar_Interface_IMpwWar.IMpwWar {
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
