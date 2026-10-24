import type * as MultiPlayerWarInterfaceIMpwWar from "../../multiPlayerWar/interface/IMpwWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMmw from "../../proto/schema/CommonProto/WarSettings/SettingsForMmw.ts";

type SettingsForMmw = ProtoSchemaCommonProtoWarSettingsSettingsForMmw.SettingsForMmw;

export interface IMmwWar extends MultiPlayerWarInterfaceIMpwWar.IMpwWar {
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
