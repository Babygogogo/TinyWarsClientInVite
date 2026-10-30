import {
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwWar,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiZoomableComponent,
} from "../../internal.ts";

export interface IBwWarView extends Ui_Interfaces_IUiContainer.IUiContainer {
    init(war: BaseWar_Interface_IBwWar.IBwWar): void;
    fastInit(war: BaseWar_Interface_IBwWar.IBwWar): void;

    startRunningView(): void;
    stopRunning(): void;

    getFieldContainer(): Ui_Interfaces_IUiZoomableComponent.IUiZoomableComponent;

    tweenGridToCentralArea(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;
    moveGridToCenter(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;

    showVibration(duration?: number, maxOffset?: number): void;
    stopVibration(): void;

    updatePersistentText(): void;

    zoomField(stageX: number, stageY: number, isZoomIn: boolean): void;
}
