import type { ITileMap } from "./ITileMap.ts";
import type { IUiContainer } from "../ui/interfaces/IUiContainer.ts";

export interface ITileMapView extends IUiContainer {
    init(tileMap: ITileMap): void;
    fastInit(tileMap: ITileMap): void;

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
