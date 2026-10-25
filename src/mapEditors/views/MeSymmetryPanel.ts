import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { SymmetryTypeId } from "../../geometries/Constants.ts";
import { getSkinCircle } from "../../helpers/ImageSource.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { getAsymmetricalCounters } from "../../mapEditor/model/MeHelpers.ts";
import type { AsymmetricalCounters } from "../../mapEditor/model/MeTypes.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    war     : IMeWar
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnClose!                     : IUiButton;

    private readonly _labelTileSymmetry!            : IUiLabel;
    private readonly _labelDirection!               : IUiLabel;
    private readonly _labelStatus!                  : IUiLabel;
    private readonly _labelAutoDraw!                : IUiLabel;

    private readonly _groupLeftRight!               : IUiContainer;
    private readonly _labelLeftRightTitle!          : IUiLabel;
    private readonly _labelLeftRightRate!           : IUiLabel;
    private readonly _groupLeftRightBox!            : IUiContainer;
    private readonly _imgLeftRight!                 : IUiImage;

    private readonly _groupUpDown!                  : IUiContainer;
    private readonly _labelUpDownTitle!             : IUiLabel;
    private readonly _labelUpDownRate!              : IUiLabel;
    private readonly _groupUpDownBox!               : IUiContainer;
    private readonly _imgUpDown!                    : IUiImage;

    private readonly _groupRotational!              : IUiContainer;
    private readonly _labelRotationalTitle!         : IUiLabel;
    private readonly _labelRotationalRate!          : IUiLabel;
    private readonly _groupRotationalBox!           : IUiContainer;
    private readonly _imgRotational!                : IUiImage;

    private readonly _groupUpLeftDownRight!         : IUiContainer;
    private readonly _labelUpLeftDownRightTitle!    : IUiLabel;
    private readonly _labelUpLeftDownRightRate!     : IUiLabel;
    private readonly _groupUpLeftDownRightBox!      : IUiContainer;
    private readonly _imgUpLeftDownRight!           : IUiImage;

    private readonly _groupUpRightDownLeft!         : IUiContainer;
    private readonly _labelUpRightDownLeftTitle!    : IUiLabel;
    private readonly _labelUpRightDownLeftRate!     : IUiLabel;
    private readonly _groupUpRightDownLeftBox!      : IUiContainer;
    private readonly _imgUpRightDownLeft!           : IUiImage;

    private readonly _labelColorSymmetry!           : IUiLabel;
    private readonly _btnColorSymmetry!             : IUiButton;
    private readonly _btnHelpColorSymmetry!         : IUiButton;
    private readonly _groupColorSymmetry!           : IUiContainer;
    private readonly _imgColorSymmetry!             : IUiImage;
    private readonly _listColorSymmetry!            : IUiScrollList<DataForColorSymmetryRenderer>;

    private readonly _labelFillTile!                : IUiLabel;
    private readonly _btnFillTile!                  : IUiButton;

    private _asymmetricalCounters   : AsymmetricalCounters | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MeDrawerSymmetricalPlayerIndexChanged,   callback: this._onNotifyMeDrawerSymmetricalPlayerIndexChanged },
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
        this._asymmetricalCounters  = getAsymmetricalCounters(war);

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
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0396),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedLabelAutoDraw(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0397),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupLeftRightBox(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        if (drawer.getSymmetricalDrawType() !== SymmetryTypeId.LeftToRight) {
            drawer.setSymmetricalDrawType(SymmetryTypeId.LeftToRight);
        } else {
            drawer.setSymmetricalDrawType(SymmetryTypeId.None);
        }
        this._updateGroupBoxes();
    }
    private _onTouchedGroupUpDownBox(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        if (drawer.getSymmetricalDrawType() !== SymmetryTypeId.UpToDown) {
            drawer.setSymmetricalDrawType(SymmetryTypeId.UpToDown);
        } else {
            drawer.setSymmetricalDrawType(SymmetryTypeId.None);
        }
        this._updateGroupBoxes();
    }
    private _onTouchedGroupRotationalBox(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        if (drawer.getSymmetricalDrawType() !== SymmetryTypeId.Rotation) {
            drawer.setSymmetricalDrawType(SymmetryTypeId.Rotation);
        } else {
            drawer.setSymmetricalDrawType(SymmetryTypeId.None);
        }
        this._updateGroupBoxes();
    }
    private _onTouchedGroupUpLeftDownRightBox(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const drawer    = war.getDrawer();
        if (drawer.getSymmetricalDrawType() === SymmetryTypeId.UpLeftToDownRight) {
            drawer.setSymmetricalDrawType(SymmetryTypeId.None);
        } else {
            const mapSize = war.getTileMap().getMapSize();
            if (mapSize.getWidth() === mapSize.getHeight()) {
                drawer.setSymmetricalDrawType(SymmetryTypeId.UpLeftToDownRight);
            } else {
                openPanel(getDict().CommonHelpPanel, {
                    getContent : () => getText(TextType.A0780),
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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const drawer    = war.getDrawer();
        if (drawer.getSymmetricalDrawType() === SymmetryTypeId.UpRightToDownLeft) {
            drawer.setSymmetricalDrawType(SymmetryTypeId.None);
        } else {
            const mapSize = war.getTileMap().getMapSize();
            if (mapSize.getWidth() === mapSize.getHeight()) {
                drawer.setSymmetricalDrawType(SymmetryTypeId.UpRightToDownLeft);
            } else {
                openPanel(getDict().CommonHelpPanel, {
                    getContent : () => getText(TextType.A0780),
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

        openPanel(getDict().MeSymmetricalPlayerIndexPanel, {
            war : war,
        });
    }
    private _onTouchedBtnHelpColorSymmetry(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0779),
        });
    }
    private _onTouchedGroupColorSymmetry(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        drawer.setIsSymmetricalPlayerIndexEnabled(!drawer.getIsSymmetricalPlayerIndexEnabled());
        this._updateGroupColorSymmetry();
    }

    private _onTouchedBtnFillTile(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().MeSymmetryFillTilePanel, {
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
        this._labelTitle.setText(getText(TextType.B0306));
        this._labelTileSymmetry.setText(getText(TextType.B1248));
        this._labelDirection.setText(getText(TextType.B1247));
        this._labelStatus.setText(`${getText(TextType.B0367)} ?`);
        this._labelAutoDraw.setText(`${getText(TextType.B0307)} ?`);
        this._labelUpDownTitle.setText(getText(TextType.B0308));
        this._labelLeftRightTitle.setText(getText(TextType.B0309));
        this._labelRotationalTitle.setText(getText(TextType.B0310));
        this._labelUpLeftDownRightTitle.setText(getText(TextType.B0311));
        this._labelUpRightDownLeftTitle.setText(getText(TextType.B0312));
        this._labelColorSymmetry.setText(getText(TextType.B1155));
        this._btnColorSymmetry.setText(getText(TextType.B0560));
        this._labelFillTile.setText(getText(TextType.B1245));
        this._btnFillTile.setText(getText(TextType.B1246));
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
        this._imgLeftRight.setIsVisible(this.getOpenData()?.war.getDrawer().getSymmetricalDrawType() === SymmetryTypeId.LeftToRight);
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
        this._imgUpDown.setIsVisible(this.getOpenData()?.war.getDrawer().getSymmetricalDrawType() === SymmetryTypeId.UpToDown);
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
        this._imgRotational.setIsVisible(this.getOpenData()?.war.getDrawer().getSymmetricalDrawType() === SymmetryTypeId.Rotation);
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
        this._imgUpLeftDownRight.setIsVisible(this.getOpenData()?.war.getDrawer().getSymmetricalDrawType() === SymmetryTypeId.UpLeftToDownRight);
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
        this._imgUpRightDownLeft.setIsVisible(this.getOpenData()?.war.getDrawer().getSymmetricalDrawType() === SymmetryTypeId.UpRightToDownLeft);
    }

    private async _updateGroupColorSymmetry(): Promise<void> {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        const isEnabled = drawer.getIsSymmetricalPlayerIndexEnabled();
        this._imgColorSymmetry.setIsVisible(isEnabled);

        const dataArray : DataForColorSymmetryRenderer[] = [];
        for (let playerIndex = PlayerIndex.First; playerIndex <= PlayerIndex.Max; ++playerIndex) {
            dataArray.push({
                dstPlayerIndex  : drawer.getSymmetricalPlayerIndex(playerIndex),
                isEnabled       : isEnabled,
            });
        }
        await this._listColorSymmetry.bindData(dataArray);
    }
}

interface DataForColorSymmetryRenderer extends UiListItemData {
    dstPlayerIndex  : number;
    isEnabled       : boolean;
}
class ColorSymmetryRenderer extends UiListItemRenderer<DataForColorSymmetryRenderer> {
    private readonly _imgColor! : IUiImage;

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgColor.loadSource(getSkinCircle(openData.dstPlayerIndex, true));
    }
}
