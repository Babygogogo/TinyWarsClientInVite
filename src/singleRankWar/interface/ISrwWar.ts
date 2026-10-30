import {
    type SinglePlayerWar_Interface_ISpwWar,
} from "../../internal.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export interface ISrwWar extends SinglePlayerWar_Interface_ISpwWar.ISpwWar {
    serializeForValidation(): SerialWar;

    getIsNeedExecutedOperations(): boolean;
    getIsNeedSeedRandom(): boolean;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getNormalMapId(): number;

    getCanCheat(): boolean;
    getShouldSerializeFullInfoForFreeModeGames(): boolean;

    getSettingsBootTimerParams(): number[];
}
