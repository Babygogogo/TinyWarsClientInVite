import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../Constants.ts";
import * as SoundsSoundPlayer from "../SoundPlayer.ts";
import * as SoundsUtils from "../Utils.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiPromptedInput from "../../ui/interfaces/IUiPromptedInput.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import * as UiTypesUiInputEventType from "../../ui/types/UiInputEventType.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export interface OpenData {
    currentBgmCode      : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    gameConfig          : GameConfigGcData.GcData;
    callbackOnConfirm   : (bgmCode: number) => void;
    callbackOnCancel?   : () => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutOngoing!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelOngoingTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelOngoing!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _inputFilter!          : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _btnClearFilter!       : UiInterfacesIUiButton.IUiButton;
    private readonly _listBgm!              : UiInterfacesIUiScrollList.IUiScrollList<DataForBgmRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnHelp,                                    callback: this._onTouchedBtnHelp },
            { ui: this._btnClose,                                   callback: this._onTouchedBtnClose },
            { ui: this._btnClearFilter,                             callback: this._onTouchedBtnClearFilter },

            { ui: this._layoutOngoing,                               callback: this._onTouchedGroupOngoing },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.SoundManagerPlayingBgmCodeChanged,   callback: this._onNotifySoundManagerPlayingBgmCodeChanged },
        ]);
        this._setInputListenerArray([
            { ui: this._inputFilter,                                callback: this._onFocusOutInputFilter,  eventType: UiTypesUiInputEventType.UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        this._setCallbackOnTouchedMask(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnClose();
        });
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0820),
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        openData.callbackOnConfirm(SoundsSoundPlayer.getPlayingBgmCode());
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0541));
        this._labelOngoingTitle.setText(LangUtils.getText(LangConstants.TextType.B1281));
        this._inputFilter.setPromptText(LangUtils.getText(LangConstants.TextType.B0132));
        this._updateLabelOngoing();
    }

    private async _updateListBgm(bgmCode: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): Promise<void> {
        const list      = this._listBgm;
        const dataArray = this._createDataForListBgm();
        bgmCode         ??= SoundsSoundPlayer.getPlayingBgmCode();
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

        this._labelOngoing.setText(LangUtils.getBgmSfxName(SoundsSoundPlayer.getPlayingBgmCode(), gameConfig) ?? `----`);
        this._layoutOngoing.arrangeItems();
    }

    private _createDataForListBgm(): DataForBgmRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const filterText    = this._inputFilter.getInputText()?.toLocaleLowerCase();
        const gameConfig    = openData.gameConfig;
        const callback      = HelpersMisc.getExisted(openData.callbackOnConfirm);
        const dataArray     : DataForBgmRenderer[] = [];
        for (const bgmCode of SoundsUtils.getAllBgmCodeArray()) {
            if ((!filterText) || (LangUtils.getBgmSfxName(bgmCode, gameConfig)?.toLocaleLowerCase().includes(filterText))) {
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

interface DataForBgmRenderer extends UiTypesUiListItemData.UiListItemData {
    bgmCode     : number;
    gameConfig  : GameConfigGcData.GcData;
    callback    : (bgmCode: number) => void;
    panel       : Panel;
}
class BgmRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForBgmRenderer> {
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!        : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSelected!  : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutText!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTag!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._imgSelected,    callback: this._onTouchedImgSelected },
            { ui: this,                 callback: this._onTouchedSelf },
        ]);
        this._setShortSfxCode(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        this.setIsTouchEnabled(true);

        this._imgSelected.setIsTouchEnabled(true);
    }
    protected async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        TweenExecutor.Executor.removeTweens(imgSelected);
        TweenExecutor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        await super._onClosed();

        TweenExecutor.Executor.removeTweens(this._imgSelected);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedImgSelected(e: VendorEgretEgret.Event): void {
        e.stopPropagation();
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonConfirm01);

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
            SoundsSoundPlayer.playBgm(bgmCode);
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

        const name      = LangUtils.getBgmSfxName(openData.bgmCode, openData.gameConfig) ?? LangConstants.UndefinedError;
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
