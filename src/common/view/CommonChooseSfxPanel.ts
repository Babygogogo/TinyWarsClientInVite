import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as SoundsUtils from "../../sounds/Utils.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    currentSfxCode  : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    gameConfig      : GameConfigGcData.GcData;
    callback        : (sfxCode: number) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;
    private readonly _listSfx!          : UiInterfacesIUiScrollList.IUiScrollList<DataForSfxRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                    callback: this.closePanel },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0542));
    }

    private _createDataForListSfx(): DataForSfxRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const callback      = openData.callback;
        const dataArray     : DataForSfxRenderer[] = [];
        const gameConfig    = openData.gameConfig;
        for (const sfxCode of SoundsUtils.getAllSfxCodeArray()) {
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

interface DataForSfxRenderer extends UiTypesUiListItemData.UiListItemData {
    sfxCode     : number;
    gameConfig  : GameConfigGcData.GcData;
    callback    : (sfxCode: number) => void;
    panel       : Panel;
}
class SfxRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForSfxRenderer> {
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupSelect!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSelect!    : UiInterfacesIUiImage.IUiImage;
    private readonly _labelSelect!  : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupSelect,                    callback: this._onTouchedGroupSelect },
        ]);
        this._applySettingsForWholeTouch(true, true, undefined, SoundsConstants.ShortSfxCode.None);
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

        SoundsSoundPlayer.playShortSfx(sfxCode);
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
        this._labelSelect.setText(LangUtils.getText(LangConstants.TextType.B0258));
        this._updateLabelName();
    }

    private _updateLabelName(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelName.setText(LangUtils.getBgmSfxName(openData.sfxCode, openData.gameConfig) ?? LangConstants.UndefinedError);
    }
}
