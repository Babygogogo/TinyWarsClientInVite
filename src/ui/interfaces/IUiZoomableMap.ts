import {
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiContainerBase,
    type Helpers_PointerInput,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { SerialPlayer } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export interface IUiZoomableMap extends Ui_Interfaces_IUiContainerBase.IUiContainerBase {
    showMapByMapData({ mapRawData, gameConfig, overridingPlayers }: {
        mapRawData          : MapRawData;
        gameConfig          : GameConfigs_GameConfig.GameConfig;
        overridingPlayers   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>;
    }): void;
    showMapByWarData({ warData, overridingPlayers, showInitialWarData }: {
        warData             : SerialWar;
        overridingPlayers   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>;
        showInitialWarData  : boolean;
    }): Promise<void>;

    clearMap(): void;

    setContentCursor(style: Helpers_PointerInput.MouseStyleType): void;
    setMouseWheelListenerEnabled(enabled: boolean): void;
    setTouchListenerEnabled(enabled: boolean): void;
    setBoundarySpacings(left?: number, right?: number, top?: number, bottom?: number): void;
}
