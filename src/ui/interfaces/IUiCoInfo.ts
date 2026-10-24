import type * as UiInterfacesIUiOpenableComponent from "./IUiOpenableComponent.ts";
import type * as UiTypesUiCoData from "../types/UiCoData.ts";
import type * as UiTypesUiCoInfoType from "../types/UiCoInfoType.ts";

export interface IUiCoInfo extends UiInterfacesIUiOpenableComponent.IUiOpenableComponent<UiTypesUiCoData.UiCoData> {
    updateOnSelectedInfoType(): void;
    getSelectedInfoType(): UiTypesUiCoInfoType.UiCoInfoType | null;
}
