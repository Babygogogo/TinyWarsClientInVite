import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import type { MouseStyleType } from "../../helpers/PointerInput.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { SerialPlayer } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { IUiContainerBase } from "./IUiContainerBase.ts";

export interface IUiZoomableMap extends IUiContainerBase {
    showMapByMapData({ mapRawData, gameConfig, overridingPlayers }: {
        mapRawData          : MapRawData;
        gameConfig          : GcData;
        overridingPlayers   : Undefinable<SerialPlayer[]>;
    }): void;
    showMapByWarData({ warData, overridingPlayers, showInitialWarData }: {
        warData             : SerialWar;
        overridingPlayers   : Undefinable<SerialPlayer[]>;
        showInitialWarData  : boolean;
    }): Promise<void>;

    clearMap(): void;

    setContentCursor(style: MouseStyleType): void;
    setMouseWheelListenerEnabled(enabled: boolean): void;
    setTouchListenerEnabled(enabled: boolean): void;
    setBoundarySpacings(left?: number, right?: number, top?: number, bottom?: number): void;
}
