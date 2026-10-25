import type { IUiOpenableComponent } from "./IUiOpenableComponent.ts";
import type { UiCoData } from "../types/UiCoData.ts";
import type { UiCoInfoType } from "../types/UiCoInfoType.ts";

export interface IUiCoInfo extends IUiOpenableComponent<UiCoData> {
    updateOnSelectedInfoType(): void;
    getSelectedInfoType(): UiCoInfoType | null;
}
