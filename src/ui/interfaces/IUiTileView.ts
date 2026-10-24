import type * as UiInterfacesIUiImage from "./IUiImage.ts";
import type * as UiTypesUiTileViewData from "../types/UiTileViewData.ts";

export interface IUiTileView {
    init(data: UiTypesUiTileViewData.UiTileViewData): IUiTileView;

    startRunningView(): void;

    updateView(): void;

    getImgObject(): UiInterfacesIUiImage.IUiImage;
    getImgBase(): UiInterfacesIUiImage.IUiImage;
    getImgDecoration(): UiInterfacesIUiImage.IUiImage;

    updateOnAnimationTick(): void;
}
