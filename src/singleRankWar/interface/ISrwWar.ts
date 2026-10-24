import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../singlePlayerWar/interface/ISpwWar.ts";

export interface ISrwWar extends SinglePlayerWarInterfaceISpwWar.ISpwWar {
    serializeForValidation(): ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;

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
