import type * as MultiPlayerWarInterfaceIMpwWar from "../../multiPlayerWar/interface/IMpwWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMrw from "../../proto/schema/CommonProto/WarSettings/SettingsForMrw.ts";

type SettingsForMrw = ProtoSchemaCommonProtoWarSettingsSettingsForMrw.SettingsForMrw;

export interface IMrwWar extends MultiPlayerWarInterfaceIMpwWar.IMpwWar {
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
