import type * as MultiPlayerWarInterfaceIMpwWar from "../../multiPlayerWar/interface/IMpwWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMfw from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";

type SettingsForMfw = ProtoSchemaCommonProtoWarSettingsSettingsForMfw.SettingsForMfw;

export interface IMfwWar extends MultiPlayerWarInterfaceIMpwWar.IMpwWar {
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
