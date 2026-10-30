import {
    type Graphics_Constants,
    type Ui_Interfaces_IUiPanel,
} from "../internal.ts";

export interface PanelConfig<T> {
    cls             : new () => Ui_Interfaces_IUiPanel.IUiPanel<T>;
    skinName        : string;
    layer           : Graphics_Constants.DisplayLayerId;
    isExclusive?    : boolean;
    needCache?      : boolean;
}
