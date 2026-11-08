import {
    AuxiliaryTypes_MapSize,
    Graphics_Utils,
    Helpers_Misc,
    Ui_Components_UiContainer,
    Ui_Components_UiImage,
} from "../../internal";

const getGridWidth  = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridHeight);

export class MapBorder extends Ui_Components_UiContainer.UiContainer {
    private readonly _imgCornerUL = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedCorner0000` });
    private readonly _imgCornerUR = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedCorner0001` });
    private readonly _imgCornerDR = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedCorner0002` });
    private readonly _imgCornerDL = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedCorner0003` });
    private readonly _imgBorderU  = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedBorder0000` });
    private readonly _imgBorderR  = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedBorder0001` });
    private readonly _imgBorderD  = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedBorder0002` });
    private readonly _imgBorderL  = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedBorder0003` });

    public constructor() {
        super();

        const imgCornerUL   = this._imgCornerUL;
        const imgCornerUR   = this._imgCornerUR;
        const imgCornerDL   = this._imgCornerDL;
        const imgCornerDR   = this._imgCornerDR;
        const imgBorderU    = this._imgBorderU;
        const imgBorderD    = this._imgBorderD;
        const imgBorderL    = this._imgBorderL;
        const imgBorderR    = this._imgBorderR;
        imgCornerUL.setIsSmoothing(false);
        imgCornerUR.setIsSmoothing(false);
        imgCornerDL.setIsSmoothing(false);
        imgCornerDR.setIsSmoothing(false);
        imgBorderU.setIsSmoothing(false);
        imgBorderD.setIsSmoothing(false);
        imgBorderL.setIsSmoothing(false);
        imgBorderR.setIsSmoothing(false);
        this.addUiChild(imgBorderU);
        this.addUiChild(imgBorderD);
        this.addUiChild(imgBorderL);
        this.addUiChild(imgBorderR);
        this.addUiChild(imgCornerUL);
        this.addUiChild(imgCornerUR);
        this.addUiChild(imgCornerDL);
        this.addUiChild(imgCornerDR);
    }

    public refresh(mapSize: AuxiliaryTypes_MapSize.MapSize): void {
        const horizontalPixels  = mapSize.getWidth() * getGridWidth();
        const verticalPixels    = mapSize.getHeight() * getGridHeight();
        const imgCornerUL       = this._imgCornerUL;
        const imgCornerUR       = this._imgCornerUR;
        const imgCornerDL       = this._imgCornerDL;
        const imgCornerDR       = this._imgCornerDR;
        const imgBorderU        = this._imgBorderU;
        const imgBorderD        = this._imgBorderD;
        const imgBorderL        = this._imgBorderL;
        const imgBorderR        = this._imgBorderR;
        if ((horizontalPixels <= 0) || (verticalPixels <= 0)) {
            imgCornerUL.setIsVisible(false);
            imgCornerUR.setIsVisible(false);
            imgCornerDL.setIsVisible(false);
            imgCornerDR.setIsVisible(false);
            imgBorderU.setIsVisible(false);
            imgBorderD.setIsVisible(false);
            imgBorderL.setIsVisible(false);
            imgBorderR.setIsVisible(false);
            return;
        }

        {
            imgCornerUL.setIsVisible(true);
            imgCornerUL.setX(-4);
            imgCornerUL.setY(-4);
        }

        {
            imgCornerUR.setIsVisible(true);
            imgCornerUR.setX(horizontalPixels);
            imgCornerUR.setY(-4);
        }

        {
            imgCornerDR.setIsVisible(true);
            imgCornerDR.setX(horizontalPixels);
            imgCornerDR.setY(verticalPixels);
        }

        {
            imgCornerDL.setIsVisible(true);
            imgCornerDL.setX(-4);
            imgCornerDL.setY(verticalPixels);
        }

        {
            imgBorderU.setIsVisible(true);
            imgBorderU.setX(-1);
            imgBorderU.setY(-4);
            imgBorderU.setUnscaledManualWidth(horizontalPixels + 2);
        }

        {
            imgBorderR.setIsVisible(true);
            imgBorderR.setX(horizontalPixels);
            imgBorderR.setY(-1);
            imgBorderR.setUnscaledManualHeight(verticalPixels + 2);
        }

        {
            imgBorderD.setIsVisible(true);
            imgBorderD.setX(-1);
            imgBorderD.setY(verticalPixels);
            imgBorderD.setUnscaledManualWidth(horizontalPixels + 2);
        }

        {
            imgBorderL.setIsVisible(true);
            imgBorderL.setX(-4);
            imgBorderL.setY(-1);
            imgBorderL.setUnscaledManualHeight(verticalPixels + 2);
        }
    }
}
