import {
    type Tiles_ITileMap,
    type Ui_Interfaces_IUiContainer,
} from "../internal.ts";

export interface ITileMapView extends Ui_Interfaces_IUiContainer.IUiContainer {
    init(tileMap: Tiles_ITileMap.ITileMap): void;
    fastInit(tileMap: Tiles_ITileMap.ITileMap): void;

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
