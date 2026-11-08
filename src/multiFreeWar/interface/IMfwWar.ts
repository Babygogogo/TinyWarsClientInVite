import {
    type MultiPlayerWar_Interface_IMpwWar,
} from "../../internal.ts";
import type { SettingsForMfw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";

export interface IMfwWar extends MultiPlayerWar_Interface_IMpwWar.IMpwWar {
    getCanCheat(): boolean;
    getShouldSerializeFullInfoForFreeModeGames(): boolean;

    getIsNeedExecutedOperations(): boolean;
    getIsNeedSeedRandom(): boolean;
    getNormalMapId(): number | null;

    getSettingsForMfw(): SettingsForMfw;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getWarName(): string | null;
    getWarPassword(): string | null;
    getWarComment(): string | null;

    getSettingsBootTimerParams(): number[];
}
