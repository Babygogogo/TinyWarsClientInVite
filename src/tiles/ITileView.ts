import type * as BaseWarModelBwTypes from "../baseWar/model/BwTypes.ts";
import type * as UiInterfacesIUiImage from "../ui/interfaces/IUiImage.ts";

type DataForTileView = BaseWarModelBwTypes.DataForTileView;

export interface ITileView {
    setData(data: DataForTileView): void;
    getData(): DataForTileView | null;

    updateView(): void;
    updateTileAnimation(): void;
    updateImgBuff(): void;

    getImgHighlight(): UiInterfacesIUiImage.IUiImage;
    getImgObject(): UiInterfacesIUiImage.IUiImage;
    getImgBuff(): UiInterfacesIUiImage.IUiImage;
    getImgDecoration(): UiInterfacesIUiImage.IUiImage;
    getImgBase(): UiInterfacesIUiImage.IUiImage;
}
