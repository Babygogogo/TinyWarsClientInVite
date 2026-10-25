import { showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText, getLanguageText } from "../../lang/Utils.ts";
import { Constants } from "../../mapTags/Constants.ts";
import { getMapTag } from "../../normalMap/model/NormalMapModel.ts";
import { reqMmSetMapTagSingleData } from "../../normalMap/model/NormalMapProxy.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { MapTagSingleData } from "../../proto/schema/CommonProto/Map/MapTag/MapTagSingleData.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;

    private readonly _listMapTag!           : IUiScrollList<DataForMapTagRenderer>;

    private readonly _btnRename!            : IUiButton;
    private readonly _btnEnable!            : IUiButton;
    private readonly _btnDisable!           : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgMmSetMapTagSingleData,    callback: this._onNotifyMsgMmSetMapTagSingleData },
            { type: TypeId.MsgMapGetMapTag,             callback: this._onNotifyMsgMapGetMapTag },
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
        showLang(TextType.OperationSucceeded);
    }
    private async _onNotifyMsgMapGetMapTag(): Promise<void> {
        await this._updateListMapTag();
        this._updateBtnEnable();
    }

    private async _onTouchedBtnRename(): Promise<void> {
        const mapTagId = this._listMapTag.getFirstSelectedData()?.mapTagId;
        if (mapTagId == null) {
            showLang(TextType.A0856);
            return;
        }

        const mapTagData = (await getMapTag())?.getMapTagDataArray()?.find(v => v.getMapTagId() === mapTagId);
        openPanel(getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : mapTagData?.getNameArray() ?? [],
            maxTextLength       : Constants.MaxNameLength,
            getHelpText         : () => getText(TextType.A0313),
            callback            : textArray => reqMmSetMapTagSingleData(MapTagSingleData.fromJson({
                mapTagId    : mapTagId,
                isEnabled   : !!mapTagData?.getIsEnabled(),
                nameArray   : textArray.map(v => v.toJson()),
            })),
        });
    }
    private async _onTouchedBtnEnable(): Promise<void> {
        const mapTagId = this._listMapTag.getFirstSelectedData()?.mapTagId;
        if (mapTagId == null) {
            showLang(TextType.A0856);
            return;
        }

        const mapTagData = (await getMapTag())?.getMapTagDataArray().find(v => v.getMapTagId() === mapTagId);
        if ((mapTagData == null) || (mapTagData.getIsEnabled())) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const nameArray = mapTagData.getNameArray();
        if (getLanguageText({ textArray: nameArray }) == null) {
            showLang(TextType.A0311);
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent  : () => getText(TextType.AreYouSureYouWantToContinue),
            callback    : () => reqMmSetMapTagSingleData(MapTagSingleData.fromJson({
                mapTagId    : mapTagId,
                isEnabled   : !mapTagData.getIsEnabled(),
                nameArray   : nameArray.map(v => v.toJson()),
            })),
        });
    }
    private async _onTouchedBtnDisable(): Promise<void> {
        const mapTagId = this._listMapTag.getFirstSelectedData()?.mapTagId;
        if (mapTagId == null) {
            showLang(TextType.A0856);
            return;
        }

        const mapTagData = (await getMapTag())?.getMapTagDataArray().find(v => v.getMapTagId() === mapTagId);
        if ((mapTagData == null) || (!mapTagData.getIsEnabled())) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const nameArray = mapTagData.getNameArray();
        if (getLanguageText({ textArray: nameArray }) == null) {
            showLang(TextType.A0311);
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent  : () => getText(TextType.AreYouSureYouWantToContinue),
            callback    : () => reqMmSetMapTagSingleData(MapTagSingleData.fromJson({
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
        this._labelTitle.setLangText(TextType.B0445);
        this._btnEnable.setLangText(TextType.B0433);
        this._btnDisable.setLangText(TextType.B0434);
        this._btnRename.setLangText(TextType.B0495);
    }

    private async _updateListMapTag(): Promise<void> {
        const dataArray : DataForMapTagRenderer[] = [];
        for (let mapTagId = Constants.MinId; mapTagId <= Constants.MaxId; ++mapTagId) {
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
            const mapTag        = (await getMapTag())?.getMapTagDataArray().find(v => v.getMapTagId() === mapTagId);
            btnEnable.setIsVisible((mapTag == null) || (!mapTag.getIsEnabled()));
        }
    }
}

interface DataForMapTagRenderer extends UiListItemData {
    mapTagId    : number;
    panel       : Panel;
}
class MapTagRenderer extends UiListItemRenderer<DataForMapTagRenderer> {
    private readonly _imgSelected!      : IUiImage;

    private readonly _layoutName!       : IUiLayout;
    private readonly _labelMapTagId!    : IUiLabel;
    private readonly _labelIsEnabled!   : IUiLabel;
    private readonly _labelMapTagName!  : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._applySettingsForWholeTouch();
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Executor.removeTweens(imgSelected);
        Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Executor.removeTweens(this._imgSelected);
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

        const mapTagData = (await getMapTag())?.getMapTagDataArray().find(v => v.getMapTagId() === mapTagId);
        if (this.getOpenData()?.mapTagId !== mapTagId) {
            return;
        }

        const isEnabled         = !!mapTagData?.getIsEnabled();
        const labelIsEnabled    = this._labelIsEnabled;
        labelIsEnabled.setText(getText(isEnabled ? TextType.B0431 : TextType.B0432));
        labelIsEnabled.setTextColor(isEnabled ? 0x00FF00 : 0xC9D3DF);
        this._labelMapTagName.setText(getLanguageText({ textArray: mapTagData?.getNameArray() }) ?? '--');
        this._layoutName.arrangeItems();
    }
}
