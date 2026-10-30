import {
    type Ui_Interfaces_IUiContainerBase,
    type Ui_Types_UiUnitViewData,
} from "../../internal.ts";

export interface IUiUnitView extends Ui_Interfaces_IUiContainerBase.IUiContainerBase {
    update(viewData: Ui_Types_UiUnitViewData.UiUnitViewData, tickCount?: number): void;

    getViewData(): Ui_Types_UiUnitViewData.UiUnitViewData | null;

    updateOnAnimationTick(tickCount: number): void;

    updateOnStateIndicatorTick(): void;
}
