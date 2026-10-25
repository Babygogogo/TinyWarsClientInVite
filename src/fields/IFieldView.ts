import type { IField } from "./IField.ts";
import type { IUiContainer } from "../ui/interfaces/IUiContainer.ts";

export interface IFieldView extends IUiContainer {
    init(field: IField): void;
    fastInit(field: IField): void;

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
