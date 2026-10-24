import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MapTagsConstants from "../../mapTags/Constants.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NormalMapModelNormalMapProxy from "../../normalMap/model/NormalMapProxy.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoMapMapTagMapTagSingleData from "../../proto/schema/CommonProto/Map/MapTag/MapTagSingleData.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _listMapTag!           : UiInterfacesIUiScrollList.IUiScrollList<DataForMapTagRenderer>;

    private readonly _btnRename!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnEnable!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDisable!           : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMmSetMapTagSingleData,    callback: this._onNotifyMsgMmSetMapTagSingleData },
            { type: NotificationsTypeId.TypeId.MsgMapGetMapTag,             callback: this._onNotifyMsgMapGetMapTag },
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
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }
    private async _onNotifyMsgMapGetMapTag(): Promise<void> {
        await this._updateListMapTag();
        this._updateBtnEnable();
    }

    private async _onTouchedBtnRename(): Promise<void> {
        const mapTagId = this._listMapTag.getFirstSelectedData()?.mapTagId;
        if (mapTagId == null) {
            FloatText2.showLang(LangConstants.TextType.A0856);
            return;
        }

        const mapTagData = (await NormalMapModelNormalMapModel.getMapTag())?.getMapTagDataArray()?.find(v => v.getMapTagId() === mapTagId);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : mapTagData?.getNameArray() ?? [],
            maxTextLength       : MapTagsConstants.Constants.MaxNameLength,
            getHelpText         : () => LangUtils.getText(LangConstants.TextType.A0313),
            callback            : textArray => NormalMapModelNormalMapProxy.reqMmSetMapTagSingleData(ProtoSchemaCommonProtoMapMapTagMapTagSingleData.MapTagSingleData.fromJson({
                mapTagId    : mapTagId,
                isEnabled   : !!mapTagData?.getIsEnabled(),
                nameArray   : textArray.map(v => v.toJson()),
            })),
        });
    }
    private async _onTouchedBtnEnable(): Promise<void> {
        const mapTagId = this._listMapTag.getFirstSelectedData()?.mapTagId;
        if (mapTagId == null) {
            FloatText2.showLang(LangConstants.TextType.A0856);
            return;
        }

        const mapTagData = (await NormalMapModelNormalMapModel.getMapTag())?.getMapTagDataArray().find(v => v.getMapTagId() === mapTagId);
        if ((mapTagData == null) || (mapTagData.getIsEnabled())) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const nameArray = mapTagData.getNameArray();
        if (LangUtils.getLanguageText({ textArray: nameArray }) == null) {
            FloatText2.showLang(LangConstants.TextType.A0311);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent  : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => NormalMapModelNormalMapProxy.reqMmSetMapTagSingleData(ProtoSchemaCommonProtoMapMapTagMapTagSingleData.MapTagSingleData.fromJson({
                mapTagId    : mapTagId,
                isEnabled   : !mapTagData.getIsEnabled(),
                nameArray   : nameArray.map(v => v.toJson()),
            })),
        });
    }
    private async _onTouchedBtnDisable(): Promise<void> {
        const mapTagId = this._listMapTag.getFirstSelectedData()?.mapTagId;
        if (mapTagId == null) {
            FloatText2.showLang(LangConstants.TextType.A0856);
            return;
        }

        const mapTagData = (await NormalMapModelNormalMapModel.getMapTag())?.getMapTagDataArray().find(v => v.getMapTagId() === mapTagId);
        if ((mapTagData == null) || (!mapTagData.getIsEnabled())) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const nameArray = mapTagData.getNameArray();
        if (LangUtils.getLanguageText({ textArray: nameArray }) == null) {
            FloatText2.showLang(LangConstants.TextType.A0311);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent  : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => NormalMapModelNormalMapProxy.reqMmSetMapTagSingleData(ProtoSchemaCommonProtoMapMapTagMapTagSingleData.MapTagSingleData.fromJson({
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
        this._labelTitle.setLangText(LangConstants.TextType.B0445);
        this._btnEnable.setLangText(LangConstants.TextType.B0433);
        this._btnDisable.setLangText(LangConstants.TextType.B0434);
        this._btnRename.setLangText(LangConstants.TextType.B0495);
    }

    private async _updateListMapTag(): Promise<void> {
        const dataArray : DataForMapTagRenderer[] = [];
        for (let mapTagId = MapTagsConstants.Constants.MinId; mapTagId <= MapTagsConstants.Constants.MaxId; ++mapTagId) {
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
            const mapTag        = (await NormalMapModelNormalMapModel.getMapTag())?.getMapTagDataArray().find(v => v.getMapTagId() === mapTagId);
            btnEnable.setIsVisible((mapTag == null) || (!mapTag.getIsEnabled()));
        }
    }
}

interface DataForMapTagRenderer extends UiTypesUiListItemData.UiListItemData {
    mapTagId    : number;
    panel       : Panel;
}
class MapTagRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMapTagRenderer> {
    private readonly _imgSelected!      : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMapTagId!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelIsEnabled!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapTagName!  : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._applySettingsForWholeTouch();
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        TweenExecutor.Executor.removeTweens(imgSelected);
        TweenExecutor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        TweenExecutor.Executor.removeTweens(this._imgSelected);
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

        const mapTagData = (await NormalMapModelNormalMapModel.getMapTag())?.getMapTagDataArray().find(v => v.getMapTagId() === mapTagId);
        if (this.getOpenData()?.mapTagId !== mapTagId) {
            return;
        }

        const isEnabled         = !!mapTagData?.getIsEnabled();
        const labelIsEnabled    = this._labelIsEnabled;
        labelIsEnabled.setText(LangUtils.getText(isEnabled ? LangConstants.TextType.B0431 : LangConstants.TextType.B0432));
        labelIsEnabled.setTextColor(isEnabled ? 0x00FF00 : 0xC9D3DF);
        this._labelMapTagName.setText(LangUtils.getLanguageText({ textArray: mapTagData?.getNameArray() }) ?? '--');
        this._layoutName.arrangeItems();
    }
}
