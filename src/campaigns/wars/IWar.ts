import {
    type SinglePlayerWar_Interface_ISpwWar,
} from "../../internal.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForCaw } from "../../proto/schema/CommonProto/WarSettings/SettingsForCaw.ts";

export interface IWar extends SinglePlayerWar_Interface_ISpwWar.ISpwWar {
    serializeForValidation(): SerialWar;

    getIsNeedExecutedOperations(): boolean;
    getIsNeedSeedRandom(): boolean;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getNormalMapId(): null;

    getCanCheat(): boolean;
    getShouldSerializeFullInfoForFreeModeGames(): boolean;

    getSettingsBootTimerParams(): number[];

    getSettingsForCaw(): SettingsForCaw;

    calculateTotalScore(): number;
}
