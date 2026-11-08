import {
    type Ui_Interfaces_IUiOpenableComponent,
    type Ui_Types_UiCoData,
    type Ui_Types_UiCoInfoType,
} from "../../internal.ts";

export interface IUiCoInfo extends Ui_Interfaces_IUiOpenableComponent.IUiOpenableComponent<Ui_Types_UiCoData.UiCoData> {
    updateOnSelectedInfoType(): void;
    getSelectedInfoType(): Ui_Types_UiCoInfoType.UiCoInfoType | null;
}
