import {
    type Ui_Interfaces_IUiOpenableComponent,
    type Sounds_Constants,
    type Ui_Types_UiItemTapEventData,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface IUiListItemRenderer<OpenData extends Ui_Types_UiListItemData.UiListItemData> extends Ui_Interfaces_IUiOpenableComponent.IUiOpenableComponent<OpenData> {
    onItemTapEvent(e: Ui_Types_UiItemTapEventData.UiItemTapEventData): void;

    getShortSfxCode(): Sounds_Constants.ShortSfxCode;
}
