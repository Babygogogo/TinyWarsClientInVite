import type { DisplayLayerId } from "../graphics/Constants.ts";
import type { IUiPanel } from "../ui/interfaces/IUiPanel.ts";

export interface PanelConfig<T> {
    cls             : new () => IUiPanel<T>;
    skinName        : string;
    layer           : DisplayLayerId;
    isExclusive?    : boolean;
    needCache?      : boolean;
}
