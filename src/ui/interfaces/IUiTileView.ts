import type { IUiImage } from "./IUiImage.ts";
import type { UiTileViewData } from "../types/UiTileViewData.ts";

export interface IUiTileView {
    init(data: UiTileViewData): IUiTileView;

    startRunningView(): void;

    updateView(): void;

    getImgObject(): IUiImage;
    getImgBase(): IUiImage;
    getImgDecoration(): IUiImage;

    updateOnAnimationTick(): void;
}
