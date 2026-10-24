import type * as GraphicsConstants from "../graphics/Constants.ts";
import type * as UiInterfacesIUiPanel from "../ui/interfaces/IUiPanel.ts";

export interface PanelConfig<T> {
    cls             : new () => UiInterfacesIUiPanel.IUiPanel<T>;
    skinName        : string;
    layer           : GraphicsConstants.DisplayLayerId;
    isExclusive?    : boolean;
    needCache?      : boolean;
}
