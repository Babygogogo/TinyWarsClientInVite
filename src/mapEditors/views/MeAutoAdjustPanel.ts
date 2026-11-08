import {
    Notifications_Dispatcher,
    GamePanels_Dict,
    LocalData_Storage,
    Lang_Utils,
    Tiles_Constants_Common,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

export interface OpenData {
    war     : MapEditor_Interface_IMeWar.IMeWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnAll!                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRiver!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnBeach!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSea!                       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDecoration!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRoad!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnBridge!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnPlasma!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSuperPlasma!               : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupRealTimeAdjustContainer! : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupRealTimeAdjust!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _imgRealTimeAdjust!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelRealTimeAdjust!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelpRealTimeAdjust!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupRealTimeToggle!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _imgRealTimeToggle!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelRealTimeToggle!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupGlobalAdjustContainer!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupGlobalAdjust!            : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelGlobalAdjust!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelpGlobalAdjust!          : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",     callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                   callback : this.closePanel },

            { ui : this._btnAll,                     callback : this._onTouchedBtnAll },
            { ui : this._btnRiver,                   callback : this._onTouchedBtnRiver },
            { ui : this._btnBeach,                   callback : this._onTouchedBtnBeach },
            { ui : this._btnSea,                     callback : this._onTouchedBtnSea },
            { ui : this._btnDecoration,              callback : this._onTouchedBtnDecoration },
            { ui : this._btnRoad,                    callback : this._onTouchedBtnRoad },
            { ui : this._btnBridge,                  callback : this._onTouchedBtnBridge },
            { ui : this._btnPlasma,                  callback : this._onTouchedBtnPlasma },
            { ui : this._btnSuperPlasma,             callback : this._onTouchedBtnSuperPlasma },

            { ui : this._groupRealTimeAdjust,        callback : this._onTouchedGroupRealTimeAdjust },
            { ui : this._btnHelpRealTimeAdjust,      callback : this._onTouchedBtnHelpRealTimeAdjust },

            { ui : this._groupRealTimeToggle,        callback : this._onTouchedGroupRealTimeToggle },

            { ui : this._btnHelpGlobalAdjust,        callback : this._onTouchedBtnHelpGlobalAdjust },
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0259),
            callback   : () => {
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0259),
            callback   : () => drawer.autoAdjustRivers(),
        });
    }
    private _onTouchedBtnBeach(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0259),
            callback   : () => drawer.autoAdjustBeaches(),
        });
    }
    private _onTouchedBtnSea(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0259),
            callback   : () => drawer.autoAdjustSeas(),
        });
    }
    private _onTouchedBtnDecoration(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0259),
            callback   : () => drawer.autoFillTileDecorations(),
        });
    }
    private _onTouchedBtnRoad(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const gameConfig    = war.getGcData();
        const drawer        = war.getDrawer();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseTileTypePanel, {
            gameConfig             : gameConfig,
            currentTileTypeArray   : drawer.getRoadConnectTileTypeArray(),
            availableTileTypeArray : gameConfig.getAllTileTypeArraySortedByWeight(),
            getHelpText            : () => Lang_Utils.getText(Lang_Constants.TextType.A0398),
            callbackOnConfirm      : tileTypeArray => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0259),
                    callback   : () => war.getDrawer().autoAdjustRoads(tileTypeArray),
                });
            },
        });
    }
    private _onTouchedBtnBridge(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const gameConfig    = war.getGcData();
        const drawer        = war.getDrawer();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseTileTypePanel, {
            gameConfig             : gameConfig,
            currentTileTypeArray   : drawer.getBridgeConnectTileTypeArray(),
            availableTileTypeArray : gameConfig.getAllTileTypeArraySortedByWeight(),
            getHelpText            : () => Lang_Utils.getText(Lang_Constants.TextType.A0399),
            callbackOnConfirm      : tileTypeArray => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0259),
                    callback   : () => war.getDrawer().autoAdjustBridges(tileTypeArray),
                });
            },
        });
    }
    private _onTouchedBtnPlasma(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0259),
            callback   : () => drawer.autoAdjustPlasmas(),
        });
    }
    private _onTouchedBtnSuperPlasma(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0259),
            callback   : () => drawer.autoAdjustPipes(),
        });
    }
    private _onTouchedGroupRealTimeAdjust(): void {
        this.getOpenData()?.war.getDrawer().setIsRealTimeAdjust(!this._imgRealTimeAdjust.getIsVisible());
        this._updateImgRealTimeAdjust();

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupRealTimeToggle(): void {
        LocalData_Storage.setShowMapEditorAutoAdjustToggle(!LocalData_Storage.getShowMapEditorAutoAdjustToggle());
        this._updateImgRealTimeToggle();

        Notifications_Dispatcher.dispatch("MeAutoAdjustToggleVisibilityChanged");
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedBtnHelpRealTimeAdjust(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0032),
        });
    }
    private _onTouchedBtnHelpGlobalAdjust(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0778),
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

        this._labelTitle.setLangText(Lang_Constants.TextType.B1451);
        this._btnAll.setLangText(Lang_Constants.TextType.B0120);
        this._btnRiver.setText(Lang_Utils.getTileName(Tiles_Constants_Common.TileTypeId.River, gameConfig) ?? Lang_Constants.UndefinedError);
        this._btnBeach.setText(Lang_Utils.getTileName(Tiles_Constants_Common.TileTypeId.Beach, gameConfig) ?? Lang_Constants.UndefinedError);
        this._btnSea.setText(Lang_Utils.getTileName(Tiles_Constants_Common.TileTypeId.Sea, gameConfig) ?? Lang_Constants.UndefinedError);
        this._btnDecoration.setLangText(Lang_Constants.TextType.TileDecoration);
        this._btnRoad.setText(Lang_Utils.getTileObjectName(Tiles_Constants_Common.ObjectTypeId.Road, gameConfig) ?? Lang_Constants.UndefinedError);
        this._btnBridge.setText(Lang_Utils.getTileObjectName(Tiles_Constants_Common.ObjectTypeId.Bridge, gameConfig) ?? Lang_Constants.UndefinedError);
        this._btnPlasma.setText(Lang_Utils.getTileObjectName(Tiles_Constants_Common.ObjectTypeId.Plasma, gameConfig) ?? Lang_Constants.UndefinedError);
        this._btnSuperPlasma.setText(Lang_Utils.getTileObjectName(Tiles_Constants_Common.ObjectTypeId.Pipe, gameConfig) ?? Lang_Constants.UndefinedError);
        this._labelRealTimeAdjust.setLangText(Lang_Constants.TextType.B1121);
        this._labelRealTimeToggle.setLangText(Lang_Constants.TextType.B1452);
        this._labelGlobalAdjust.setLangText(Lang_Constants.TextType.B1243);

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
        this._imgRealTimeToggle.setIsVisible(LocalData_Storage.getShowMapEditorAutoAdjustToggle());
    }
}
