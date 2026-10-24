import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForCaw from "../../proto/schema/CommonProto/WarSettings/SettingsForCaw.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../singlePlayerWar/interface/ISpwWar.ts";

export interface IWar extends SinglePlayerWarInterfaceISpwWar.ISpwWar {
    serializeForValidation(): ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;

    getIsNeedExecutedOperations(): boolean;
    getIsNeedSeedRandom(): boolean;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getNormalMapId(): null;

    getCanCheat(): boolean;
    getShouldSerializeFullInfoForFreeModeGames(): boolean;

    getSettingsBootTimerParams(): number[];

    getSettingsForCaw(): ProtoSchemaCommonProtoWarSettingsSettingsForCaw.SettingsForCaw;

    calculateTotalScore(): number;
}
