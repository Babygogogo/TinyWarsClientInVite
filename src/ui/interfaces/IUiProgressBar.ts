import type * as UiInterfacesIUiContainer from "./IUiContainer.ts";

export interface IUiProgressBar extends UiInterfacesIUiContainer.IUiContainer {
    getStartValue(): number;
    setStartValue(value: number): void;

    getEndValue(): number;
    setEndValue(value: number): void;

    getCurrentValue(): number;
    setCurrentValue(value: number): void;
    get currentValue(): number;
    set currentValue(value: number);
}
