import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
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
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export interface OpenData {
    currentSkinId           : number | null;
    availableSkinIdArray    : number[];
    getHelpText?            : () => string;
    callback                : (skinId: number) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTips!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _list!             : UiInterfacesIUiScrollList.IUiScrollList<DataForItemRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.closePanel },
            { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._list.setItemRendererClass(ItemRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._list.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnHelp(): void {
        const func = this.getOpenData()?.getHelpText;
        const text  = func ? func() : null;
        if (text) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent : () => text,
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._btnHelp.setIsVisible(!!openData.getHelpText);

        const dataArray     = this._createDataForList();
        const list          = this._list;
        const skinId        = openData.currentSkinId;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(dataArray.findIndex(v => v.skinId === skinId));
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0573));
        this._labelTips.setText(LangUtils.getText(LangConstants.TextType.B1249));
    }

    private _createDataForList(): DataForItemRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const callback  = openData.callback;
        const dataArray : DataForItemRenderer[] = [];
        for (const skinId of openData.availableSkinIdArray) {
            dataArray.push({
                skinId      : skinId,
                callback    : callback,
            });
        }

        return dataArray;
    }
}

interface DataForItemRenderer extends UiTypesUiListItemData.UiListItemData {
    skinId      : number;
    callback    : (skinId: number) => void;
}
class ItemRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForItemRenderer> {
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!        : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSelected!  : UiInterfacesIUiImage.IUiImage;
    private readonly _imgConfirm!   : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgConfirm,  callback: this._onTouchedImgConfirm },
        ]);
        this._applySettingsForWholeTouch(true, true);

        this._imgConfirm.setIsTouchEnabled(true);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedImgConfirm(e: VendorEgretEgret.Event): void {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonConfirm01);
        openData.callback(openData.skinId);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonChooseSingleSkinIdPanel);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const skinId = this.getOpenData()?.skinId;
        if (skinId == null) {
            return;
        }

        this._imgBg.loadSource(HelpersImageSource.getSkinCircle(skinId, false));
        this._imgSelected.loadSource(HelpersImageSource.getSkinCircle(skinId, true));
    }
}
