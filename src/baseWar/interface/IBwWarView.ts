import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "./IBwWar.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiZoomableComponent from "../../ui/interfaces/IUiZoomableComponent.ts";

export interface IBwWarView extends UiInterfacesIUiContainer.IUiContainer {
    init(war: BaseWarInterfaceIBwWar.IBwWar): void;
    fastInit(war: BaseWarInterfaceIBwWar.IBwWar): void;

    startRunningView(): void;
    stopRunning(): void;

    getFieldContainer(): UiInterfacesIUiZoomableComponent.IUiZoomableComponent;

    tweenGridToCentralArea(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void;
    moveGridToCenter(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void;

    showVibration(duration?: number, maxOffset?: number): void;
    stopVibration(): void;

    updatePersistentText(): void;

    zoomField(stageX: number, stageY: number, isZoomIn: boolean): void;
}
