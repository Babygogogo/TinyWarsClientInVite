import {
    MapEditor_Model_MeHelpers,
    GamePanels_Dict,
    Helpers_ImageSource,
    Lang_Utils,
    GamePanels_Manager,
    Players_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Geometries_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type MapEditor_Model_MeTypes,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    war     : MapEditor_Interface_IMeWar.IMeWar
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelTileSymmetry!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDirection!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStatus!                  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelAutoDraw!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupLeftRight!               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelLeftRightTitle!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLeftRightRate!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupLeftRightBox!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgLeftRight!                 : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupUpDown!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelUpDownTitle!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUpDownRate!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupUpDownBox!               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgUpDown!                    : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupRotational!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelRotationalTitle!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRotationalRate!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupRotationalBox!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgRotational!                : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupUpLeftDownRight!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelUpLeftDownRightTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUpLeftDownRightRate!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupUpLeftDownRightBox!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgUpLeftDownRight!           : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupUpRightDownLeft!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelUpRightDownLeftTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUpRightDownLeftRate!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupUpRightDownLeftBox!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgUpRightDownLeft!           : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _labelColorSymmetry!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnColorSymmetry!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelpColorSymmetry!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _groupColorSymmetry!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgColorSymmetry!             : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _listColorSymmetry!            : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForColorSymmetryRenderer>;

    private readonly _labelFillTile!                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnFillTile!                  : Ui_Interfaces_IUiButton.IUiButton;

    private _asymmetricalCounters   : MapEditor_Model_MeTypes.AsymmetricalCounters | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MeDrawerSymmetricalPlayerIndexChanged,   callback: this._onNotifyMeDrawerSymmetricalPlayerIndexChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },

            { ui: this._labelStatus,                callback: this._onTouchedLabelStatus },
            { ui: this._labelAutoDraw,              callback: this._onTouchedLabelAutoDraw },

            { ui: this._groupLeftRightBox,          callback: this._onTouchedGroupLeftRightBox, },
            { ui: this._groupUpDownBox,             callback: this._onTouchedGroupUpDownBox, },
            { ui: this._groupRotationalBox,         callback: this._onTouchedGroupRotationalBox },
            { ui: this._groupUpLeftDownRightBox,    callback: this._onTouchedGroupUpLeftDownRightBox },
            { ui: this._groupUpRightDownLeftBox,    callback: this._onTouchedGroupUpRightDownLeftBox },

            { ui: this._btnColorSymmetry,           callback: this._onTouchedBtnColorSymmetry },
            { ui: this._btnHelpColorSymmetry,       callback: this._onTouchedBtnHelpColorSymmetry },
            { ui: this._groupColorSymmetry,         callback: this._onTouchedGroupColorSymmetry },

            { ui: this._btnFillTile,                callback: this._onTouchedBtnFillTile },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        // this._labelStatus.touchEnabled      = true;
        // this._labelAutoDraw.touchEnabled    = true;
        this._listColorSymmetry.setItemRendererClass(ColorSymmetryRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }
        this._asymmetricalCounters  = MapEditor_Model_MeHelpers.getAsymmetricalCounters(war);

        this._updateGroupLeftRight();
        this._updateGroupUpDown();
        this._updateGroupRotational();
        this._updateGroupUpLeftDownRight();
        this._updateGroupUpRightDownLeft();
        this._updateGroupColorSymmetry();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listColorSymmetry.removeAllItems();

        await super._onClosed();
    }

    private _onTouchedLabelStatus(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0396),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedLabelAutoDraw(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0397),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupLeftRightBox(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if (drawer.getSymmetricalDrawType() !== Geometries_Constants.SymmetryTypeId.LeftToRight) {
            drawer.setSymmetricalDrawType(Geometries_Constants.SymmetryTypeId.LeftToRight);
        } else {
            drawer.setSymmetricalDrawType(Geometries_Constants.SymmetryTypeId.None);
        }
        this._updateGroupBoxes();
    }
    private _onTouchedGroupUpDownBox(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if (drawer.getSymmetricalDrawType() !== Geometries_Constants.SymmetryTypeId.UpToDown) {
            drawer.setSymmetricalDrawType(Geometries_Constants.SymmetryTypeId.UpToDown);
        } else {
            drawer.setSymmetricalDrawType(Geometries_Constants.SymmetryTypeId.None);
        }
        this._updateGroupBoxes();
    }
    private _onTouchedGroupRotationalBox(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if (drawer.getSymmetricalDrawType() !== Geometries_Constants.SymmetryTypeId.Rotation) {
            drawer.setSymmetricalDrawType(Geometries_Constants.SymmetryTypeId.Rotation);
        } else {
            drawer.setSymmetricalDrawType(Geometries_Constants.SymmetryTypeId.None);
        }
        this._updateGroupBoxes();
    }
    private _onTouchedGroupUpLeftDownRightBox(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const drawer    = war.getDrawer();
        if (drawer.getSymmetricalDrawType() === Geometries_Constants.SymmetryTypeId.UpLeftToDownRight) {
            drawer.setSymmetricalDrawType(Geometries_Constants.SymmetryTypeId.None);
        } else {
            const mapSize = war.getTileMap().getMapSize();
            if (mapSize.getWidth() === mapSize.getHeight()) {
                drawer.setSymmetricalDrawType(Geometries_Constants.SymmetryTypeId.UpLeftToDownRight);
            } else {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                    getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0780),
                });
                return;
            }
        }
        this._updateGroupBoxes();
    }
    private _onTouchedGroupUpRightDownLeftBox(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const drawer    = war.getDrawer();
        if (drawer.getSymmetricalDrawType() === Geometries_Constants.SymmetryTypeId.UpRightToDownLeft) {
            drawer.setSymmetricalDrawType(Geometries_Constants.SymmetryTypeId.None);
        } else {
            const mapSize = war.getTileMap().getMapSize();
            if (mapSize.getWidth() === mapSize.getHeight()) {
                drawer.setSymmetricalDrawType(Geometries_Constants.SymmetryTypeId.UpRightToDownLeft);
            } else {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                    getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0780),
                });
                return;
            }
        }
        this._updateGroupBoxes();
    }

    private _onTouchedBtnColorSymmetry(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeSymmetricalPlayerIndexPanel, {
            war : war,
        });
    }
    private _onTouchedBtnHelpColorSymmetry(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0779),
        });
    }
    private _onTouchedGroupColorSymmetry(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        drawer.setIsSymmetricalPlayerIndexEnabled(!drawer.getIsSymmetricalPlayerIndexEnabled());
        this._updateGroupColorSymmetry();
    }

    private _onTouchedBtnFillTile(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeSymmetryFillTilePanel, {
            war : war,
        });
        this.closePanel();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMeDrawerSymmetricalPlayerIndexChanged(): void {
        this._updateGroupColorSymmetry();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0306);
        this._labelTileSymmetry.setLangText(Lang_Constants.TextType.B1248);
        this._labelDirection.setLangText(Lang_Constants.TextType.B1247);
        this._labelStatus.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0367)} ?`);
        this._labelAutoDraw.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0307)} ?`);
        this._labelUpDownTitle.setLangText(Lang_Constants.TextType.B0308);
        this._labelLeftRightTitle.setLangText(Lang_Constants.TextType.B0309);
        this._labelRotationalTitle.setLangText(Lang_Constants.TextType.B0310);
        this._labelUpLeftDownRightTitle.setLangText(Lang_Constants.TextType.B0311);
        this._labelUpRightDownLeftTitle.setLangText(Lang_Constants.TextType.B0312);
        this._labelColorSymmetry.setLangText(Lang_Constants.TextType.B1155);
        this._btnColorSymmetry.setLangText(Lang_Constants.TextType.B0560);
        this._labelFillTile.setLangText(Lang_Constants.TextType.B1245);
        this._btnFillTile.setLangText(Lang_Constants.TextType.B1246);
    }

    private _updateGroupBoxes(): void {
        this._updateGroupUpDownBox();
        this._updateGroupLeftRightBox();
        this._updateGroupRotationalBox();
        this._updateGroupUpLeftDownRightBox();
        this._updateGroupUpRightDownLeftBox();
    }

    private _updateGroupLeftRight(): void {
        const count = this._asymmetricalCounters?.LeftToRight;
        const label = this._labelLeftRightRate;
        if (count == null) {
            label.setText("----");
            label.setTextColor(0xffffff);
        } else {
            label.setText("" + count);
            label.setTextColor(count > 0 ? 0xffff00 : 0x00ff00);
        }
        this._updateGroupLeftRightBox();
    }
    private _updateGroupLeftRightBox(): void {
        this._imgLeftRight.setIsVisible(this.getOpenData()?.war.getDrawer().getSymmetricalDrawType() === Geometries_Constants.SymmetryTypeId.LeftToRight);
    }

    private _updateGroupUpDown(): void {
        const count = this._asymmetricalCounters?.UpToDown;
        const label = this._labelUpDownRate;
        if (count == null) {
            label.setText("----");
            label.setTextColor(0xffffff);
        } else {
            label.setText("" + count);
            label.setTextColor(count > 0 ? 0xffff00 : 0x00ff00);
        }
        this._updateGroupUpDownBox();
    }
    private _updateGroupUpDownBox(): void {
        this._imgUpDown.setIsVisible(this.getOpenData()?.war.getDrawer().getSymmetricalDrawType() === Geometries_Constants.SymmetryTypeId.UpToDown);
    }

    private _updateGroupRotational(): void {
        const count = this._asymmetricalCounters?.Rotation;
        const label = this._labelRotationalRate;
        if (count == null) {
            label.setText("----");
            label.setTextColor(0xffffff);
        } else {
            label.setText("" + count);
            label.setTextColor(count > 0 ? 0xffff00 : 0x00ff00);
        }
        this._updateGroupRotationalBox();
    }
    private _updateGroupRotationalBox(): void {
        this._imgRotational.setIsVisible(this.getOpenData()?.war.getDrawer().getSymmetricalDrawType() === Geometries_Constants.SymmetryTypeId.Rotation);
    }

    private _updateGroupUpLeftDownRight(): void {
        const count = this._asymmetricalCounters?.UpLeftToDownRight;
        const label = this._labelUpLeftDownRightRate;
        if (count == null) {
            label.setText("----");
            label.setTextColor(0xffffff);
        } else {
            label.setText("" + count);
            label.setTextColor(count > 0 ? 0xffff00 : 0x00ff00);
        }
        this._updateGroupUpLeftDownRightBox();
    }
    private _updateGroupUpLeftDownRightBox(): void {
        this._imgUpLeftDownRight.setIsVisible(this.getOpenData()?.war.getDrawer().getSymmetricalDrawType() === Geometries_Constants.SymmetryTypeId.UpLeftToDownRight);
    }

    private _updateGroupUpRightDownLeft(): void {
        const count = this._asymmetricalCounters?.UpRightToDownLeft;
        const label = this._labelUpRightDownLeftRate;
        if (count == null) {
            label.setText("----");
            label.setTextColor(0xffffff);
        } else {
            label.setText("" + count);
            label.setTextColor(count > 0 ? 0xffff00 : 0x00ff00);
        }
        this._updateGroupUpRightDownLeftBox();
    }
    private _updateGroupUpRightDownLeftBox(): void {
        this._imgUpRightDownLeft.setIsVisible(this.getOpenData()?.war.getDrawer().getSymmetricalDrawType() === Geometries_Constants.SymmetryTypeId.UpRightToDownLeft);
    }

    private async _updateGroupColorSymmetry(): Promise<void> {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        const isEnabled = drawer.getIsSymmetricalPlayerIndexEnabled();
        this._imgColorSymmetry.setIsVisible(isEnabled);

        const dataArray : DataForColorSymmetryRenderer[] = [];
        for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= Players_Constants.PlayerIndex.Max; ++playerIndex) {
            dataArray.push({
                dstPlayerIndex  : drawer.getSymmetricalPlayerIndex(playerIndex),
                isEnabled       : isEnabled,
            });
        }
        await this._listColorSymmetry.bindData(dataArray);
    }
}

interface DataForColorSymmetryRenderer extends Ui_Types_UiListItemData.UiListItemData {
    dstPlayerIndex  : number;
    isEnabled       : boolean;
}
class ColorSymmetryRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForColorSymmetryRenderer> {
    private readonly _imgColor! : Ui_Interfaces_IUiImage.IUiImage;

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgColor.loadSource(Helpers_ImageSource.getSkinCircle(openData.dstPlayerIndex, true));
    }
}
