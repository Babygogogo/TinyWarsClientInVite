import {
    AuxiliaryTypes_MapSize,
    Graphics_Utils,
    Helpers_Misc,
    Ui_Components_UiContainer,
    Ui_Components_UiImage,
} from "../../internal";

const getGridWidth  = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridHeight);

export class GridBorder extends Ui_Components_UiContainer.UiContainer {
    public constructor() {
        super();

        this.setAlpha(0.3);
    }

    public refresh(mapSize: AuxiliaryTypes_MapSize.MapSize): void {
        this.removeUiChildren();

        const { width: mapWidth, height: mapHeight } = mapSize.getWH();
        const borderWidth       = mapWidth * getGridWidth();
        const borderHeight      = mapHeight * getGridHeight();

        for (let x = 1; x < mapWidth; ++x) {
            const img = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedColorBlack0000` });
            img.setIsSmoothing(false);
            img.setUnscaledManualWidth(1);
            img.setUnscaledManualHeight(borderHeight);
            img.setX((x * getGridWidth()) - 0.5);
            this.addUiChild(img);
        }

        for (let y = 1; y < mapHeight; ++y) {
            const img = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedColorBlack0000` });
            img.setIsSmoothing(false);
            img.setUnscaledManualWidth(borderWidth);
            img.setUnscaledManualHeight(1);
            img.setY((y * getGridHeight()) - 0.5);
            this.addUiChild(img);
        }
    }
}
