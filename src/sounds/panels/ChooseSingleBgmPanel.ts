import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getBgmSfxName,
} from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../Constants.ts";
import {
    playShortSfx,
    getPlayingBgmCode,
    playBgm,
} from "../SoundPlayer.ts";
import { getAllBgmCodeArray } from "../Utils.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiPromptedInput } from "../../ui/interfaces/IUiPromptedInput.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import { UiInputEventType } from "../../ui/types/UiInputEventType.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import type { Event } from "../../egret/Egret.ts";

export interface OpenData {
    currentBgmCode      : Undefinable<number>;
    gameConfig          : GameConfig;
    callbackOnConfirm   : (bgmCode: number) => void;
    callbackOnCancel?   : () => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnHelp!              : IUiButton;
    private readonly _btnClose!             : IUiButton;

    private readonly _layoutOngoing!        : IUiLayout;
    private readonly _labelOngoingTitle!    : IUiLabel;
    private readonly _labelOngoing!         : IUiLabel;

    private readonly _inputFilter!          : IUiPromptedInput;
    private readonly _btnClearFilter!       : IUiButton;
    private readonly _listBgm!              : IUiScrollList<DataForBgmRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnHelp,                                    callback: this._onTouchedBtnHelp },
            { ui: this._btnClose,                                   callback: this._onTouchedBtnClose },
            { ui: this._btnClearFilter,                             callback: this._onTouchedBtnClearFilter },

            { ui: this._layoutOngoing,                               callback: this._onTouchedGroupOngoing },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.SoundManagerPlayingBgmCodeChanged,   callback: this._onNotifySoundManagerPlayingBgmCodeChanged },
        ]);
        this._setInputListenerArray([
            { ui: this._inputFilter,                                callback: this._onFocusOutInputFilter,  eventType: UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listBgm.setItemRendererClass(BgmRenderer);

        {
            const layoutOngoing = this._layoutOngoing;
            layoutOngoing.setIsTouchEnabled(true);
            layoutOngoing.setIsTouchChildrenEnabled(false);
        }
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listBgm.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0820),
        });
    }
    private _onTouchedBtnClose(): void {
        const callback = this.getOpenData()?.callbackOnCancel;
        (callback) && (callback());
        this.closePanel();
    }
    private _onTouchedBtnClearFilter(): void {
        const input = this._inputFilter;
        if (input.getInputText()?.length) {
            input.setInputText(``);
            this._updateListBgm(null);
        }
    }
    private _onTouchedGroupOngoing(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openData.callbackOnConfirm(getPlayingBgmCode());
        this.closePanel();
    }
    private _onFocusOutInputFilter(): void {
        this._inputFilter.trimInputText();
        this._updateListBgm(null);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifySoundManagerPlayingBgmCodeChanged(): void {
        this._updateLabelOngoing();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListBgm(this.getOpenData()?.currentBgmCode);
        this._updateLabelOngoing();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0541);
        this._labelOngoingTitle.setLangText(TextType.B1281);
        this._inputFilter.setPromptText(getText(TextType.B0132));
        this._updateLabelOngoing();
    }

    private async _updateListBgm(bgmCode: Undefinable<number>): Promise<void> {
        const list      = this._listBgm;
        const dataArray = this._createDataForListBgm();
        bgmCode         ??= getPlayingBgmCode();
        await list.bindData(dataArray);

        const index = dataArray.findIndex(v => v.bgmCode === bgmCode);
        list.setSelectedItemIndex(index);
        list.scrollToItem(Math.max(0, index));
    }
    private _updateLabelOngoing(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        this._labelOngoing.setText(getBgmSfxName(getPlayingBgmCode(), gameConfig) ?? `----`);
        this._layoutOngoing.arrangeItems();
    }

    private _createDataForListBgm(): DataForBgmRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const filterText    = this._inputFilter.getInputText()?.toLocaleLowerCase();
        const gameConfig    = openData.gameConfig;
        const callback      = openData.callbackOnConfirm;
        const dataArray     : DataForBgmRenderer[] = [];
        for (const bgmCode of getAllBgmCodeArray()) {
            if ((!filterText) || (getBgmSfxName(bgmCode, gameConfig)?.toLocaleLowerCase().includes(filterText))) {
                dataArray.push({
                    callback    : callback,
                    bgmCode     : bgmCode,
                    gameConfig  : gameConfig,
                    panel       : this,
                });
            }
        }
        return dataArray;
    }
}

interface DataForBgmRenderer extends UiListItemData {
    bgmCode     : number;
    gameConfig  : GameConfig;
    callback    : (bgmCode: number) => void;
    panel       : Panel;
}
class BgmRenderer extends UiListItemRenderer<DataForBgmRenderer> {
    private readonly _group!        : IUiContainer;
    private readonly _imgBg!        : IUiImage;
    private readonly _imgSelected!  : IUiImage;

    private readonly _layoutText!   : IUiLayout;
    private readonly _labelTag!     : IUiLabel;
    private readonly _labelName!    : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._imgSelected,    callback: this._onTouchedImgSelected },
            { ui: this,                 callback: this._onTouchedSelf },
        ]);
        this._setShortSfxCode(ShortSfxCode.ButtonNeutral01);
        this.setIsTouchEnabled(true);

        this._imgSelected.setIsTouchEnabled(true);
    }
    protected async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Executor.removeTweens(imgSelected);
        Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        await super._onClosed();

        Executor.removeTweens(this._imgSelected);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedImgSelected(e: Event): void {
        e.stopPropagation();
        playShortSfx(ShortSfxCode.ButtonConfirm01);

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openData.panel.closePanel();
        openData.callback(openData.bgmCode);
    }
    private _onTouchedSelf(): void {
        const bgmCode = this.getOpenData()?.bgmCode;
        if (bgmCode != null) {
            playBgm(bgmCode);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelName();
    }

    private _updateLabelName(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const name      = getBgmSfxName(openData.bgmCode, openData.gameConfig) ?? UndefinedError;
        const index     = name.lastIndexOf(`(`);
        const labelTag  = this._labelTag;
        const labelName = this._labelName;
        if (index >= 0) {
            labelTag.setText(name.substring(index + 1, name.length - 1));
            labelName.setText(name.substring(0, index));
        } else {
            labelTag.setText(`--`);
            labelName.setText(name);
        }
        this._layoutText.arrangeItems();
    }
}
