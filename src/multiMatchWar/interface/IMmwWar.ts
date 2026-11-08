import {
    type MultiPlayerWar_Interface_IMpwWar,
} from "../../internal.ts";
import type { SettingsForMmw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMmw.ts";

export interface IMmwWar extends MultiPlayerWar_Interface_IMpwWar.IMpwWar {
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
