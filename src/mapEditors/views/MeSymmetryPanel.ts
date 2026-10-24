import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GeometriesConstants from "../../geometries/Constants.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as MapEditorModelMeHelpers from "../../mapEditor/model/MeHelpers.ts";
import type * as MapEditorModelMeTypes from "../../mapEditor/model/MeTypes.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    war     : MapEditorInterfaceIMeWar.IMeWar
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;

    private readonly _labelTileSymmetry!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDirection!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStatus!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelAutoDraw!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupLeftRight!               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelLeftRightTitle!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLeftRightRate!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupLeftRightBox!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgLeftRight!                 : UiInterfacesIUiImage.IUiImage;

    private readonly _groupUpDown!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelUpDownTitle!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUpDownRate!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupUpDownBox!               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgUpDown!                    : UiInterfacesIUiImage.IUiImage;

    private readonly _groupRotational!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelRotationalTitle!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRotationalRate!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupRotationalBox!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgRotational!                : UiInterfacesIUiImage.IUiImage;

    private readonly _groupUpLeftDownRight!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelUpLeftDownRightTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUpLeftDownRightRate!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupUpLeftDownRightBox!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgUpLeftDownRight!           : UiInterfacesIUiImage.IUiImage;

    private readonly _groupUpRightDownLeft!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelUpRightDownLeftTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUpRightDownLeftRate!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupUpRightDownLeftBox!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgUpRightDownLeft!           : UiInterfacesIUiImage.IUiImage;

    private readonly _labelColorSymmetry!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnColorSymmetry!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelpColorSymmetry!         : UiInterfacesIUiButton.IUiButton;
    private readonly _groupColorSymmetry!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgColorSymmetry!             : UiInterfacesIUiImage.IUiImage;
    private readonly _listColorSymmetry!            : UiInterfacesIUiScrollList.IUiScrollList<DataForColorSymmetryRenderer>;

    private readonly _labelFillTile!                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnFillTile!                  : UiInterfacesIUiButton.IUiButton;

    private _asymmetricalCounters   : MapEditorModelMeTypes.AsymmetricalCounters | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MeDrawerSymmetricalPlayerIndexChanged,   callback: this._onNotifyMeDrawerSymmetricalPlayerIndexChanged },
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
        this._asymmetricalCounters  = MapEditorModelMeHelpers.getAsymmetricalCounters(war);

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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0396),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedLabelAutoDraw(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0397),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupLeftRightBox(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if (drawer.getSymmetricalDrawType() !== GeometriesConstants.SymmetryTypeId.LeftToRight) {
            drawer.setSymmetricalDrawType(GeometriesConstants.SymmetryTypeId.LeftToRight);
        } else {
            drawer.setSymmetricalDrawType(GeometriesConstants.SymmetryTypeId.None);
        }
        this._updateGroupBoxes();
    }
    private _onTouchedGroupUpDownBox(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if (drawer.getSymmetricalDrawType() !== GeometriesConstants.SymmetryTypeId.UpToDown) {
            drawer.setSymmetricalDrawType(GeometriesConstants.SymmetryTypeId.UpToDown);
        } else {
            drawer.setSymmetricalDrawType(GeometriesConstants.SymmetryTypeId.None);
        }
        this._updateGroupBoxes();
    }
    private _onTouchedGroupRotationalBox(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if (drawer.getSymmetricalDrawType() !== GeometriesConstants.SymmetryTypeId.Rotation) {
            drawer.setSymmetricalDrawType(GeometriesConstants.SymmetryTypeId.Rotation);
        } else {
            drawer.setSymmetricalDrawType(GeometriesConstants.SymmetryTypeId.None);
        }
        this._updateGroupBoxes();
    }
    private _onTouchedGroupUpLeftDownRightBox(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const drawer    = war.getDrawer();
        if (drawer.getSymmetricalDrawType() === GeometriesConstants.SymmetryTypeId.UpLeftToDownRight) {
            drawer.setSymmetricalDrawType(GeometriesConstants.SymmetryTypeId.None);
        } else {
            const mapSize = war.getTileMap().getMapSize();
            if (mapSize.getWidth() === mapSize.getHeight()) {
                drawer.setSymmetricalDrawType(GeometriesConstants.SymmetryTypeId.UpLeftToDownRight);
            } else {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                    getContent : () => LangUtils.getText(LangConstants.TextType.A0780),
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const drawer    = war.getDrawer();
        if (drawer.getSymmetricalDrawType() === GeometriesConstants.SymmetryTypeId.UpRightToDownLeft) {
            drawer.setSymmetricalDrawType(GeometriesConstants.SymmetryTypeId.None);
        } else {
            const mapSize = war.getTileMap().getMapSize();
            if (mapSize.getWidth() === mapSize.getHeight()) {
                drawer.setSymmetricalDrawType(GeometriesConstants.SymmetryTypeId.UpRightToDownLeft);
            } else {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                    getContent : () => LangUtils.getText(LangConstants.TextType.A0780),
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeSymmetricalPlayerIndexPanel, {
            war : war,
        });
    }
    private _onTouchedBtnHelpColorSymmetry(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0779),
        });
    }
    private _onTouchedGroupColorSymmetry(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        drawer.setIsSymmetricalPlayerIndexEnabled(!drawer.getIsSymmetricalPlayerIndexEnabled());
        this._updateGroupColorSymmetry();
    }

    private _onTouchedBtnFillTile(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeSymmetryFillTilePanel, {
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0306));
        this._labelTileSymmetry.setText(LangUtils.getText(LangConstants.TextType.B1248));
        this._labelDirection.setText(LangUtils.getText(LangConstants.TextType.B1247));
        this._labelStatus.setText(`${LangUtils.getText(LangConstants.TextType.B0367)} ?`);
        this._labelAutoDraw.setText(`${LangUtils.getText(LangConstants.TextType.B0307)} ?`);
        this._labelUpDownTitle.setText(LangUtils.getText(LangConstants.TextType.B0308));
        this._labelLeftRightTitle.setText(LangUtils.getText(LangConstants.TextType.B0309));
        this._labelRotationalTitle.setText(LangUtils.getText(LangConstants.TextType.B0310));
        this._labelUpLeftDownRightTitle.setText(LangUtils.getText(LangConstants.TextType.B0311));
        this._labelUpRightDownLeftTitle.setText(LangUtils.getText(LangConstants.TextType.B0312));
        this._labelColorSymmetry.setText(LangUtils.getText(LangConstants.TextType.B1155));
        this._btnColorSymmetry.setText(LangUtils.getText(LangConstants.TextType.B0560));
        this._labelFillTile.setText(LangUtils.getText(LangConstants.TextType.B1245));
        this._btnFillTile.setText(LangUtils.getText(LangConstants.TextType.B1246));
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
        this._imgLeftRight.setIsVisible(this.getOpenData()?.war.getDrawer().getSymmetricalDrawType() === GeometriesConstants.SymmetryTypeId.LeftToRight);
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
        this._imgUpDown.setIsVisible(this.getOpenData()?.war.getDrawer().getSymmetricalDrawType() === GeometriesConstants.SymmetryTypeId.UpToDown);
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
        this._imgRotational.setIsVisible(this.getOpenData()?.war.getDrawer().getSymmetricalDrawType() === GeometriesConstants.SymmetryTypeId.Rotation);
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
        this._imgUpLeftDownRight.setIsVisible(this.getOpenData()?.war.getDrawer().getSymmetricalDrawType() === GeometriesConstants.SymmetryTypeId.UpLeftToDownRight);
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
        this._imgUpRightDownLeft.setIsVisible(this.getOpenData()?.war.getDrawer().getSymmetricalDrawType() === GeometriesConstants.SymmetryTypeId.UpRightToDownLeft);
    }

    private async _updateGroupColorSymmetry(): Promise<void> {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        const isEnabled = drawer.getIsSymmetricalPlayerIndexEnabled();
        this._imgColorSymmetry.setIsVisible(isEnabled);

        const dataArray : DataForColorSymmetryRenderer[] = [];
        for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex <= PlayersConstants.PlayerIndex.Max; ++playerIndex) {
            dataArray.push({
                dstPlayerIndex  : drawer.getSymmetricalPlayerIndex(playerIndex),
                isEnabled       : isEnabled,
            });
        }
        await this._listColorSymmetry.bindData(dataArray);
    }
}

interface DataForColorSymmetryRenderer extends UiTypesUiListItemData.UiListItemData {
    dstPlayerIndex  : number;
    isEnabled       : boolean;
}
class ColorSymmetryRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForColorSymmetryRenderer> {
    private readonly _imgColor! : UiInterfacesIUiImage.IUiImage;

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgColor.loadSource(HelpersImageSource.getSkinCircle(openData.dstPlayerIndex, true));
    }
}
