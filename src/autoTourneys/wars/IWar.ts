import type * as MultiPlayerWarInterfaceIMpwWar from "../../multiPlayerWar/interface/IMpwWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForAtw from "../../proto/schema/CommonProto/WarSettings/SettingsForAtw.ts";

export interface IWar extends MultiPlayerWarInterfaceIMpwWar.IMpwWar {
    getCanCheat(): boolean;
    getShouldSerializeFullInfoForFreeModeGames(): boolean;

    getIsNeedExecutedOperations(): boolean;
    getIsNeedSeedRandom(): boolean;
    getNormalMapId(): number;

    getSettingsForAtw(): ProtoSchemaCommonProtoWarSettingsSettingsForAtw.SettingsForAtw;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getSettingsBootTimerParams(): number[];
}
