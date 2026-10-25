import type { PanelConfig } from "../../gamePanels/Types.ts";
import type { IUiOpenableComponent } from "./IUiOpenableComponent.ts";

export interface IUiPanel<OpenData> extends IUiOpenableComponent<OpenData> {
    setPanelConfig(config: PanelConfig<OpenData>): void;
    getPanelConfig(): PanelConfig<OpenData>;

    closePanel(): void;

    resize(stageWidth: number, stageHeight: number): void;
}
