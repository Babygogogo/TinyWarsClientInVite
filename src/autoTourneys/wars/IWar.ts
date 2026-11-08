import {
    type MultiPlayerWar_Interface_IMpwWar,
} from "../../internal.ts";
import type { SettingsForAtw } from "../../proto/schema/CommonProto/WarSettings/SettingsForAtw.ts";

export interface IWar extends MultiPlayerWar_Interface_IMpwWar.IMpwWar {
    getCanCheat(): boolean;
    getShouldSerializeFullInfoForFreeModeGames(): boolean;

    getIsNeedExecutedOperations(): boolean;
    getIsNeedSeedRandom(): boolean;
    getNormalMapId(): number;

    getSettingsForAtw(): SettingsForAtw;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getSettingsBootTimerParams(): number[];
}
