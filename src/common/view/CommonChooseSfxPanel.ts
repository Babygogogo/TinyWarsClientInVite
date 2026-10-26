import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getBgmSfxName } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { getAllSfxCodeArray } from "../../sounds/Utils.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    currentSfxCode  : Undefinable<number>;
    gameConfig      : GcData;
    callback        : (sfxCode: number) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;
    private readonly _listSfx!          : IUiScrollList<DataForSfxRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                    callback: this.closePanel },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listSfx.setItemRendererClass(SfxRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listSfx.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        const list      = this._listSfx;
        const sfxCode   = this.getOpenData()?.currentSfxCode;
        await list.bindData(this._createDataForListSfx());
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.sfxCode === sfxCode) ?? -1);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(getText(TextType.B0542));
    }

    private _createDataForListSfx(): DataForSfxRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const callback      = openData.callback;
        const dataArray     : DataForSfxRenderer[] = [];
        const gameConfig    = openData.gameConfig;
        for (const sfxCode of getAllSfxCodeArray()) {
            dataArray.push({
                callback    : callback,
                sfxCode     : sfxCode,
                gameConfig  : gameConfig,
                panel       : this,
            });
        }
        return dataArray;
    }
}

interface DataForSfxRenderer extends UiListItemData {
    sfxCode     : number;
    gameConfig  : GcData;
    callback    : (sfxCode: number) => void;
    panel       : Panel;
}
class SfxRenderer extends UiListItemRenderer<DataForSfxRenderer> {
    private readonly _group!        : IUiContainer;
    private readonly _imgBg!        : IUiImage;
    private readonly _labelName!    : IUiLabel;
    private readonly _groupSelect!  : IUiContainer;
    private readonly _imgSelect!    : IUiImage;
    private readonly _labelSelect!  : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupSelect,                    callback: this._onTouchedGroupSelect },
        ]);
        this._applySettingsForWholeTouch(true, true, undefined, ShortSfxCode.None);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        const sfxCode = this.getOpenData()?.sfxCode;
        if (sfxCode == null) {
            return;
        }

        playShortSfx(sfxCode);
    }

    private _onTouchedGroupSelect(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openData.panel.closePanel();
        openData.callback(openData.sfxCode);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelSelect.setText(getText(TextType.B0258));
        this._updateLabelName();
    }

    private _updateLabelName(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelName.setText(getBgmSfxName(openData.sfxCode, openData.gameConfig) ?? UndefinedError);
    }
}
