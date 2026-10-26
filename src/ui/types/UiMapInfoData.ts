import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export interface UiMapInfoData {
    warInfo?    : {
        warData             : SerialWar;
        showInitialWarData  : boolean;
    },
    mapInfo?    : {
        hasFog      : boolean | null | undefined;
        mapRawData  : MapRawData;
        gameConfig  : GameConfig;
    },
}
