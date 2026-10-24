import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export interface UiMapInfoData {
    warInfo?    : {
        warData             : ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
        showInitialWarData  : boolean;
    },
    mapInfo?    : {
        hasFog      : boolean | null | undefined;
        mapRawData  : ProtoSchemaCommonProtoMapMapRawData.MapRawData;
        gameConfig  : GameConfigGcData.GcData;
    },
}
