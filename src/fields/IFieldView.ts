import type * as FieldsIField from "./IField.ts";
import type * as UiInterfacesIUiContainer from "../ui/interfaces/IUiContainer.ts";

export interface IFieldView extends UiInterfacesIUiContainer.IUiContainer {
    init(field: FieldsIField.IField): void;
    fastInit(field: FieldsIField.IField): void;

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
