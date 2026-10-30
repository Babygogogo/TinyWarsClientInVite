import {
    MapTags_Constants,
    Tween_Executor,
    GamePanels_Dict,
    Lang_Utils,
    NormalMap_Model_NormalMapModel,
    GamePanels_Manager,
    NormalMap_Model_NormalMapProxy,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import { MapTagSingleData } from "../../proto/schema/CommonProto/Map/MapTag/MapTagSingleData.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listMapTag!           : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMapTagRenderer>;

    private readonly _btnRename!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnEnable!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDisable!           : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MsgMmSetMapTagSingleData,    callback: this._onNotifyMsgMmSetMapTagSingleData },
            { type: Notifications_TypeId.TypeId.MsgMapGetMapTag,             callback: this._onNotifyMsgMapGetMapTag },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },

            { ui: this._btnRename,          callback: this._onTouchedBtnRename },
            { ui: this._btnEnable,          callback: this._onTouchedBtnEnable },
            { ui: this._btnDisable,         callback: this._onTouchedBtnDisable },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listMapTag.setItemRendererClass(MapTagRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listMapTag.removeAllItems();

        await super._onClosed();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public updateOnSelectMapTagId(mapTagId: number): void {
        this._updateBtnEnable();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgMmSetMapTagSingleData(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }
    private async _onNotifyMsgMapGetMapTag(): Promise<void> {
        await this._updateListMapTag();
        this._updateBtnEnable();
    }

    private async _onTouchedBtnRename(): Promise<void> {
        const mapTagId = this._listMapTag.getFirstSelectedData()?.mapTagId;
        if (mapTagId == null) {
            FloatText.showLang(Lang_Constants.TextType.A0856);
            return;
        }

        const mapTagData = (await NormalMap_Model_NormalMapModel.getMapTag())?.getMapTagDataArray()?.find(v => v.getMapTagId() === mapTagId);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : mapTagData?.getNameArray() ?? [],
            maxTextLength       : MapTags_Constants.Constants.MaxNameLength,
            getHelpText         : () => Lang_Utils.getText(Lang_Constants.TextType.A0313),
            callback            : textArray => NormalMap_Model_NormalMapProxy.reqMmSetMapTagSingleData(MapTagSingleData.fromJson({
                mapTagId    : mapTagId,
                isEnabled   : !!mapTagData?.getIsEnabled(),
                nameArray   : textArray.map(v => v.toJson()),
            })),
        });
    }
    private async _onTouchedBtnEnable(): Promise<void> {
        const mapTagId = this._listMapTag.getFirstSelectedData()?.mapTagId;
        if (mapTagId == null) {
            FloatText.showLang(Lang_Constants.TextType.A0856);
            return;
        }

        const mapTagData = (await NormalMap_Model_NormalMapModel.getMapTag())?.getMapTagDataArray().find(v => v.getMapTagId() === mapTagId);
        if ((mapTagData == null) || (mapTagData.getIsEnabled())) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const nameArray = mapTagData.getNameArray();
        if (Lang_Utils.getLanguageText({ textArray: nameArray }) == null) {
            FloatText.showLang(Lang_Constants.TextType.A0311);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent  : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback    : () => NormalMap_Model_NormalMapProxy.reqMmSetMapTagSingleData(MapTagSingleData.fromJson({
                mapTagId    : mapTagId,
                isEnabled   : !mapTagData.getIsEnabled(),
                nameArray   : nameArray.map(v => v.toJson()),
            })),
        });
    }
    private async _onTouchedBtnDisable(): Promise<void> {
        const mapTagId = this._listMapTag.getFirstSelectedData()?.mapTagId;
        if (mapTagId == null) {
            FloatText.showLang(Lang_Constants.TextType.A0856);
            return;
        }

        const mapTagData = (await NormalMap_Model_NormalMapModel.getMapTag())?.getMapTagDataArray().find(v => v.getMapTagId() === mapTagId);
        if ((mapTagData == null) || (!mapTagData.getIsEnabled())) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const nameArray = mapTagData.getNameArray();
        if (Lang_Utils.getLanguageText({ textArray: nameArray }) == null) {
            FloatText.showLang(Lang_Constants.TextType.A0311);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent  : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback    : () => NormalMap_Model_NormalMapProxy.reqMmSetMapTagSingleData(MapTagSingleData.fromJson({
                mapTagId    : mapTagId,
                isEnabled   : !mapTagData.getIsEnabled(),
                nameArray   : nameArray.map(v => v.toJson()),
            }))
        });
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        await this._updateListMapTag();
        this._updateBtnEnable();
    }
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0445);
        this._btnEnable.setLangText(Lang_Constants.TextType.B0433);
        this._btnDisable.setLangText(Lang_Constants.TextType.B0434);
        this._btnRename.setLangText(Lang_Constants.TextType.B0495);
    }

    private async _updateListMapTag(): Promise<void> {
        const dataArray : DataForMapTagRenderer[] = [];
        for (let mapTagId = MapTags_Constants.Constants.MinId; mapTagId <= MapTags_Constants.Constants.MaxId; ++mapTagId) {
            dataArray.push({
                mapTagId    : mapTagId,
                panel       : this,
            });
        }

        await this._listMapTag.bindData(dataArray, false, true);
    }

    private async _updateBtnEnable(): Promise<void> {
        const btnEnable = this._btnEnable;
        const mapTagId  = this._listMapTag.getFirstSelectedData()?.mapTagId;
        if (mapTagId == null) {
            btnEnable.setIsVisible(true);
        } else {
            const mapTag        = (await NormalMap_Model_NormalMapModel.getMapTag())?.getMapTagDataArray().find(v => v.getMapTagId() === mapTagId);
            btnEnable.setIsVisible((mapTag == null) || (!mapTag.getIsEnabled()));
        }
    }
}

interface DataForMapTagRenderer extends Ui_Types_UiListItemData.UiListItemData {
    mapTagId    : number;
    panel       : Panel;
}
class MapTagRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMapTagRenderer> {
    private readonly _imgSelected!      : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMapTagId!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelIsEnabled!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapTagName!  : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._applySettingsForWholeTouch();
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Tween_Executor.Executor.removeTweens(imgSelected);
        Tween_Executor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Tween_Executor.Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectMapTagId(openData.mapTagId);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private async _updateView(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const mapTagId = openData.mapTagId;
        this._labelMapTagId.setText(`#${mapTagId}`);

        const mapTagData = (await NormalMap_Model_NormalMapModel.getMapTag())?.getMapTagDataArray().find(v => v.getMapTagId() === mapTagId);
        if (this.getOpenData()?.mapTagId !== mapTagId) {
            return;
        }

        const isEnabled         = !!mapTagData?.getIsEnabled();
        const labelIsEnabled    = this._labelIsEnabled;
        labelIsEnabled.setLangText(isEnabled ? Lang_Constants.TextType.B0431 : Lang_Constants.TextType.B0432);
        labelIsEnabled.setTextColor(isEnabled ? 0x00FF00 : 0xC9D3DF);
        this._labelMapTagName.setText(Lang_Utils.getLanguageText({ textArray: mapTagData?.getNameArray() }) ?? '--');
        this._layoutName.arrangeItems();
    }
}
