import {
    type Ui_Interfaces_IUiContainer,
} from "../../internal.ts";

export interface IUiProgressBar extends Ui_Interfaces_IUiContainer.IUiContainer {
    getStartValue(): number;
    setStartValue(value: number): void;

    getEndValue(): number;
    setEndValue(value: number): void;

    getCurrentValue(): number;
    setCurrentValue(value: number): void;
    get currentValue(): number;
    set currentValue(value: number);
}
