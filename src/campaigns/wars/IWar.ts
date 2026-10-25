import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForCaw } from "../../proto/schema/CommonProto/WarSettings/SettingsForCaw.ts";
import type { ISpwWar } from "../../singlePlayerWar/interface/ISpwWar.ts";

export interface IWar extends ISpwWar {
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
