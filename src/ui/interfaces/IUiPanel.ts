import type * as GamePanelsTypes from "../../gamePanels/Types.ts";
import type * as UiInterfacesIUiOpenableComponent from "./IUiOpenableComponent.ts";

type PanelConfig<T> = GamePanelsTypes.PanelConfig<T>;

export interface IUiPanel<OpenData> extends UiInterfacesIUiOpenableComponent.IUiOpenableComponent<OpenData> {
    setPanelConfig(config: PanelConfig<OpenData>): void;
    getPanelConfig(): PanelConfig<OpenData>;

    closePanel(): void;

    resize(stageWidth: number, stageHeight: number): void;
}
