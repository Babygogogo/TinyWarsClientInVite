import {
    type Ui_Interfaces_IUiImage,
    type Ui_Types_UiTileViewData,
} from "../../internal.ts";

export interface IUiTileView {
    init(data: Ui_Types_UiTileViewData.UiTileViewData): IUiTileView;

    startRunningView(): void;

    updateView(): void;

    getImgObject(): Ui_Interfaces_IUiImage.IUiImage;
    getImgBase(): Ui_Interfaces_IUiImage.IUiImage;
    getImgDecoration(): Ui_Interfaces_IUiImage.IUiImage;

    updateOnAnimationTick(): void;
}
