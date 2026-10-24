import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants2 from "../../lang/Constants.ts";
import * as LangUtils2 from "../../lang/Utils.ts";
import * as LocalDataStorage2 from "../../localData/Storage.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";

export interface OpenData {
    war     : MapEditorInterfaceIMeWar.IMeWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;

    private readonly _btnAll!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnRiver!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnBeach!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSea!                       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDecoration!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnRoad!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnBridge!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnPlasma!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSuperPlasma!               : UiInterfacesIUiButton.IUiButton;

    private readonly _groupRealTimeAdjustContainer! : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupRealTimeAdjust!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _imgRealTimeAdjust!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelRealTimeAdjust!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelpRealTimeAdjust!        : UiInterfacesIUiButton.IUiButton;

    private readonly _groupRealTimeToggle!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _imgRealTimeToggle!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelRealTimeToggle!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupGlobalAdjustContainer!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupGlobalAdjust!            : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelGlobalAdjust!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelpGlobalAdjust!          : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },

            { ui: this._btnAll,                     callback: this._onTouchedBtnAll },
            { ui: this._btnRiver,                   callback: this._onTouchedBtnRiver },
            { ui: this._btnBeach,                   callback: this._onTouchedBtnBeach },
            { ui: this._btnSea,                     callback: this._onTouchedBtnSea },
            { ui: this._btnDecoration,              callback: this._onTouchedBtnDecoration },
            { ui: this._btnRoad,                    callback: this._onTouchedBtnRoad },
            { ui: this._btnBridge,                  callback: this._onTouchedBtnBridge },
            { ui: this._btnPlasma,                  callback: this._onTouchedBtnPlasma },
            { ui: this._btnSuperPlasma,             callback: this._onTouchedBtnSuperPlasma },

            { ui: this._groupRealTimeAdjust,        callback: this._onTouchedGroupRealTimeAdjust },
            { ui: this._btnHelpRealTimeAdjust,      callback: this._onTouchedBtnHelpRealTimeAdjust },

            { ui: this._groupRealTimeToggle,        callback: this._onTouchedGroupRealTimeToggle },

            { ui: this._btnHelpGlobalAdjust,        callback: this._onTouchedBtnHelpGlobalAdjust },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateImgRealTimeAdjust();
        this._updateImgRealTimeToggle();
    }

    private _onTouchedBtnAll(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent  : () => LangUtils2.getText(LangConstants2.TextType.A0259),
            callback    : () => {
                drawer.autoAdjustBeaches();
                drawer.autoAdjustBridges(drawer.getBridgeConnectTileTypeArray().concat());
                drawer.autoAdjustPipes();
                drawer.autoAdjustPlasmas();
                drawer.autoAdjustRivers();
                drawer.autoAdjustRoads(drawer.getRoadConnectTileTypeArray().concat());
                drawer.autoAdjustSeas();
                drawer.autoFillTileDecorations();
            },
        });
    }
    private _onTouchedBtnRiver(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils2.getText(LangConstants2.TextType.A0259),
            callback: () => drawer.autoAdjustRivers(),
        });
    }
    private _onTouchedBtnBeach(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils2.getText(LangConstants2.TextType.A0259),
            callback: () => drawer.autoAdjustBeaches(),
        });
    }
    private _onTouchedBtnSea(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils2.getText(LangConstants2.TextType.A0259),
            callback: () => drawer.autoAdjustSeas(),
        });
    }
    private _onTouchedBtnDecoration(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils2.getText(LangConstants2.TextType.A0259),
            callback: () => drawer.autoFillTileDecorations(),
        });
    }
    private _onTouchedBtnRoad(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const gameConfig    = war.getGcData();
        const drawer        = war.getDrawer();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseTileTypePanel, {
            gameConfig              : gameConfig,
            currentTileTypeArray    : drawer.getRoadConnectTileTypeArray(),
            availableTileTypeArray  : gameConfig.getAllTileTypeArraySortedByWeight(),
            getHelpText             : () => LangUtils2.getText(LangConstants2.TextType.A0398),
            callbackOnConfirm       : tileTypeArray => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getContent : () => LangUtils2.getText(LangConstants2.TextType.A0259),
                    callback: () => war.getDrawer().autoAdjustRoads(tileTypeArray),
                });
            }
        });
    }
    private _onTouchedBtnBridge(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const gameConfig    = war.getGcData();
        const drawer        = war.getDrawer();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseTileTypePanel, {
            gameConfig              : gameConfig,
            currentTileTypeArray    : drawer.getBridgeConnectTileTypeArray(),
            availableTileTypeArray  : gameConfig.getAllTileTypeArraySortedByWeight(),
            getHelpText             : () => LangUtils2.getText(LangConstants2.TextType.A0399),
            callbackOnConfirm       : tileTypeArray => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getContent : () => LangUtils2.getText(LangConstants2.TextType.A0259),
                    callback: () => war.getDrawer().autoAdjustBridges(tileTypeArray),
                });
            }
        });
    }
    private _onTouchedBtnPlasma(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils2.getText(LangConstants2.TextType.A0259),
            callback: () => drawer.autoAdjustPlasmas(),
        });
    }
    private _onTouchedBtnSuperPlasma(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils2.getText(LangConstants2.TextType.A0259),
            callback: () => drawer.autoAdjustPipes(),
        });
    }
    private _onTouchedGroupRealTimeAdjust(): void {
        this.getOpenData()?.war.getDrawer().setIsRealTimeAdjust(!this._imgRealTimeAdjust.getIsVisible());
        this._updateImgRealTimeAdjust();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupRealTimeToggle(): void {
        LocalDataStorage2.setShowMapEditorAutoAdjustToggle(!LocalDataStorage2.getShowMapEditorAutoAdjustToggle());
        this._updateImgRealTimeToggle();

        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeAutoAdjustToggleVisibilityChanged);
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedBtnHelpRealTimeAdjust(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils2.getText(LangConstants2.TextType.A0032),
        });
    }
    private _onTouchedBtnHelpGlobalAdjust(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils2.getText(LangConstants2.TextType.A0778),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        this._labelTitle.setLangText(LangConstants2.TextType.B1451);
        this._btnAll.setLangText(LangConstants2.TextType.B0120);
        this._btnRiver.setText(LangUtils2.getTileName(TilesConstantsCommon.TileTypeId.River, gameConfig) ?? LangConstants2.UndefinedError);
        this._btnBeach.setText(LangUtils2.getTileName(TilesConstantsCommon.TileTypeId.Beach, gameConfig) ?? LangConstants2.UndefinedError);
        this._btnSea.setText(LangUtils2.getTileName(TilesConstantsCommon.TileTypeId.Sea, gameConfig) ?? LangConstants2.UndefinedError);
        this._btnDecoration.setLangText(LangConstants2.TextType.TileDecoration);
        this._btnRoad.setText(LangUtils2.getTileObjectName(TilesConstantsCommon.ObjectTypeId.Road, gameConfig) ?? LangConstants2.UndefinedError);
        this._btnBridge.setText(LangUtils2.getTileObjectName(TilesConstantsCommon.ObjectTypeId.Bridge, gameConfig) ?? LangConstants2.UndefinedError);
        this._btnPlasma.setText(LangUtils2.getTileObjectName(TilesConstantsCommon.ObjectTypeId.Plasma, gameConfig) ?? LangConstants2.UndefinedError);
        this._btnSuperPlasma.setText(LangUtils2.getTileObjectName(TilesConstantsCommon.ObjectTypeId.Pipe, gameConfig) ?? LangConstants2.UndefinedError);
        this._labelRealTimeAdjust.setLangText(LangConstants2.TextType.B1121);
        this._labelRealTimeToggle.setLangText(LangConstants2.TextType.B1452);
        this._labelGlobalAdjust.setLangText(LangConstants2.TextType.B1243);

        this._groupRealTimeAdjust.arrangeItems();
        this._groupRealTimeToggle.arrangeItems();
        this._groupRealTimeAdjustContainer.arrangeItems();
        this._groupGlobalAdjust.arrangeItems();
        this._groupGlobalAdjustContainer.arrangeItems();
    }

    private _updateImgRealTimeAdjust(): void {
        this._imgRealTimeAdjust.setIsVisible(!!this.getOpenData()?.war.getDrawer().getIsRealTimeAdjust());
    }
    private _updateImgRealTimeToggle(): void {
        this._imgRealTimeToggle.setIsVisible(LocalDataStorage2.getShowMapEditorAutoAdjustToggle());
    }
}
