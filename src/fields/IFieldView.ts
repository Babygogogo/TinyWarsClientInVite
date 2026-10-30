import {
    type Fields_IField,
    type Ui_Interfaces_IUiContainer,
} from "../internal.ts";

export interface IFieldView extends Ui_Interfaces_IUiContainer.IUiContainer {
    init(field: Fields_IField.IField): void;
    fastInit(field: Fields_IField.IField): void;

    startRunningView(): void;
    stopRunningView(): void;

    setUnitsVisible(visible: boolean): void;
    getUnitsVisible(): boolean;

    setTileObjectsVisible(visible: boolean): void;
    getTileObjectsVisible(): boolean;

    setTileBasesVisible(visible: boolean): void;
    getTileBasesVisible(): boolean;

    setTileDecorationsVisible(visible: boolean): void;
    getTileDecorationsVisible(): boolean;
}
