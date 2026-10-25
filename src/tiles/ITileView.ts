import type { DataForTileView as BaseWarModelBwTypesDataForTileView } from "../baseWar/model/BwTypes.ts";
import type { IUiImage } from "../ui/interfaces/IUiImage.ts";

type DataForTileView = BaseWarModelBwTypesDataForTileView;

export interface ITileView {
    setData(data: DataForTileView): void;
    getData(): DataForTileView | null;

    updateView(): void;
    updateTileAnimation(): void;
    updateImgBuff(): void;

    getImgHighlight(): IUiImage;
    getImgObject(): IUiImage;
    getImgBuff(): IUiImage;
    getImgDecoration(): IUiImage;
    getImgBase(): IUiImage;
}
