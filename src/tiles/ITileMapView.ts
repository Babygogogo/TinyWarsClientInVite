import type * as TilesITileMap from "./ITileMap.ts";
import type * as UiInterfacesIUiContainer from "../ui/interfaces/IUiContainer.ts";

export interface ITileMapView extends UiInterfacesIUiContainer.IUiContainer {
    init(tileMap: TilesITileMap.ITileMap): void;
    fastInit(tileMap: TilesITileMap.ITileMap): void;

    startRunningView(): void;
    stopRunningView(): void;

    setBaseLayerVisible(visible: boolean): void;
    getBaseLayerVisible(): boolean;

    setDecorationLayerVisible(visible: boolean): void;
    getDecorationLayerVisible(): boolean;

    setObjectLayerVisible(visible: boolean): void;
    getObjectLayerVisible(): boolean;

    resetLocationLayer(): void;

    resetMarkLayer(): void;

    updateCoZone(): void;
}
