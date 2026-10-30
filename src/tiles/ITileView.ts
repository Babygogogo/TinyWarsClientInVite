import {
    type BaseWar_Model_BwTypes,
    type Ui_Interfaces_IUiImage,
} from "../internal.ts";

export interface ITileView {
    setData(data: BaseWar_Model_BwTypes.DataForTileView): void;
    getData(): BaseWar_Model_BwTypes.DataForTileView | null;

    updateView(): void;
    updateTileAnimation(): void;
    updateImgBuff(): void;

    getImgHighlight(): Ui_Interfaces_IUiImage.IUiImage;
    getImgObject(): Ui_Interfaces_IUiImage.IUiImage;
    getImgBuff(): Ui_Interfaces_IUiImage.IUiImage;
    getImgDecoration(): Ui_Interfaces_IUiImage.IUiImage;
    getImgBase(): Ui_Interfaces_IUiImage.IUiImage;
}
