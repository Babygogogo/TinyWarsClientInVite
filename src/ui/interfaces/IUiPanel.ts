import {
    type Ui_Interfaces_IUiOpenableComponent,
    type GamePanels_Types,
} from "../../internal.ts";

export interface IUiPanel<OpenData> extends Ui_Interfaces_IUiOpenableComponent.IUiOpenableComponent<OpenData> {
    setPanelConfig(config: GamePanels_Types.PanelConfig<OpenData>): void;
    getPanelConfig(): GamePanels_Types.PanelConfig<OpenData>;

    closePanel(): void;

    resize(stageWidth: number, stageHeight: number): void;
}
