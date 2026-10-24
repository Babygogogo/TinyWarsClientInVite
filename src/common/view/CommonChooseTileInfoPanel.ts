import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";

type TileInfo = {
    tileBaseType            : number;
    tileBaseShapeId         : number;
    tileObjectType          : number;
    tileObjectShapeId       : number;
    tileDecorationType      : number;
    tileDecorationShapeId   : number;
    tilePlayerIndex         : number;
};
export interface OpenData {
    gameConfig              : GameConfigGcData.GcData;
    /** 从P0开始；必须连续；不能包含不可用的玩家；需把overriding计算在内 */
    finalSkinIdArray        : number[];
    currentTileInfo         : TileInfo;
    callback                : (tileInfo: TileInfo) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _btnTileBase!              : UiInterfacesIUiButton.IUiButton;
    private readonly _conTileBase!              : UiInterfacesIUiContainer.IUiContainer;

    private readonly _btnTileDecorator!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteTileDecorator!   : UiInterfacesIUiButton.IUiButton;
    private readonly _conTileDecorator!         : UiInterfacesIUiContainer.IUiContainer;

    private readonly _btnTileObject!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteTileObject!      : UiInterfacesIUiButton.IUiButton;
    private readonly _conTileObject!            : UiInterfacesIUiContainer.IUiContainer;

    private readonly _btnConfirm!               : UiInterfacesIUiButton.IUiButton;

    private readonly _tileView                  = new (UiUtilsUiFactory.getUiTileViewClass())();
    private readonly _tileInfo                  : TileInfo = {
        tileBaseType            : 0,
        tileBaseShapeId         : 0,
        tileObjectType          : 0,
        tileObjectShapeId       : 0,
        tileDecorationType      : 0,
        tileDecorationShapeId   : 0,
        tilePlayerIndex         : 0,
    };

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.TileAnimationTick,           callback: this._onNotifyTileAnimationTick },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                           callback: this.closePanel },

            { ui: this._btnTileBase,                        callback: this._onTouchedBtnTileBase },

            { ui: this._btnTileDecorator,                   callback: this._onTouchedBtnTileDecoration },
            { ui: this._btnDeleteTileDecorator,             callback: this._onTouchedBtnDeleteTileDecoration },

            { ui: this._btnTileObject,                      callback: this._onTouchedBtnTileObject },
            { ui: this._btnDeleteTileObject,                callback: this._onTouchedBtnDeleteTileObject },

            { ui: this._btnConfirm,                         callback: this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        const tileView = this._tileView;
        this._conTileBase.addUiChild(tileView.getImgBase());
        this._conTileObject.addUiChild(tileView.getImgObject());
        this._conTileDecorator.addUiChild(tileView.getImgDecoration());
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const currentTileInfo = this.getOpenData()?.currentTileInfo;
        if (currentTileInfo == null) {
            return;
        }

        const selfTileInfo                  = this._tileInfo;
        selfTileInfo.tileBaseType           = currentTileInfo.tileBaseType;
        selfTileInfo.tileBaseShapeId        = currentTileInfo.tileBaseShapeId;
        selfTileInfo.tileObjectType         = currentTileInfo.tileObjectType;
        selfTileInfo.tileObjectShapeId      = currentTileInfo.tileObjectShapeId;
        selfTileInfo.tileDecorationType     = currentTileInfo.tileDecorationType;
        selfTileInfo.tileDecorationShapeId  = currentTileInfo.tileDecorationShapeId;
        selfTileInfo.tilePlayerIndex        = currentTileInfo.tilePlayerIndex;

        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyTileAnimationTick(): void {
        this._updateTileView();
    }

    private _onTouchedBtnTileBase(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const tileInfo = this._tileInfo;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseTileBasePanel, {
            currentBaseType : tileInfo.tileBaseType,
            gameConfig      : gameConfig,
            callback        : (baseType, baseShapeId) => {
                tileInfo.tileBaseType       = baseType;
                tileInfo.tileBaseShapeId    = baseShapeId;
                this._updateTileView();
            },
        });
    }

    private _onTouchedBtnTileDecoration(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const tileInfo = this._tileInfo;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseTileDecorationPanel, {
            currentDecorationType   : tileInfo.tileDecorationType,
            gameConfig              : gameConfig,
            callback                : (decorationType, decorationShapeId) => {
                tileInfo.tileDecorationType     = decorationType;
                tileInfo.tileDecorationShapeId  = decorationShapeId;
                this._updateTileView();
            },
        });
    }
    private _onTouchedBtnDeleteTileDecoration(): void {
        this._tileInfo.tileDecorationType       = 0;
        this._tileInfo.tileDecorationShapeId    = 0;
        this._updateTileView();
    }

    private _onTouchedBtnTileObject(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig        = openData.gameConfig;
        const tileInfo          = this._tileInfo;
        const tileObjectType    = tileInfo.tileObjectType;
        const tileObjectCfg     = tileObjectType == null ? null : gameConfig.getTileObjectCfg(tileObjectType);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseTileObjectPanel, {
            currentPlayerIndex  : ((tileObjectCfg == null) || (tileObjectCfg.isNeutralOnly)) ? undefined : tileInfo.tilePlayerIndex,
            gameConfig          : gameConfig,
            finalSkinIdArray    : openData.finalSkinIdArray,
            callback            : (objectType, objectShapeId, playerIndex) => {
                tileInfo.tileObjectType     = objectType;
                tileInfo.tileObjectShapeId  = objectShapeId;
                tileInfo.tilePlayerIndex    = playerIndex;
                this._updateTileView();
            },
        });
    }
    private _onTouchedBtnDeleteTileObject(): void {
        this._tileInfo.tileObjectType       = 0;
        this._tileInfo.tileObjectShapeId    = 0;
        this._tileInfo.tilePlayerIndex      = 0;
        this._updateTileView();
    }

    private _onTouchedBtnConfirm(): void {
        this.getOpenData()?.callback(this._tileInfo);
        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateTileView();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0516);

        this._btnTileBase.setLangText(LangConstants.TextType.TileBase);

        this._btnTileDecorator.setLangText(LangConstants.TextType.TileDecoration);
        this._btnDeleteTileDecorator.setLangText(LangConstants.TextType.B0220);

        this._btnTileObject.setLangText(LangConstants.TextType.TileObject);
        this._btnDeleteTileObject.setLangText(LangConstants.TextType.B0220);

        this._btnConfirm.setLangText(LangConstants.TextType.B0026);
    }

    private _updateTileView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileView  = this._tileView;
        const tileInfo  = this._tileInfo;
        tileView.init({
            tileBaseType            : tileInfo.tileBaseType,
            tileBaseShapeId         : tileInfo.tileBaseShapeId,
            tileObjectType          : tileInfo.tileObjectType,
            tileObjectShapeId       : tileInfo.tileObjectShapeId,
            tileDecorationType      : tileInfo.tileDecorationType,
            tileDecorationShapeId   : tileInfo.tileDecorationShapeId,
            skinId                  : openData.finalSkinIdArray[tileInfo.tilePlayerIndex],
            overridingSkinId        : undefined,
            gameConfig              : openData.gameConfig,
        });
        tileView.updateView();
    }
}
