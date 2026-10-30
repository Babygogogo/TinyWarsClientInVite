import {
    checkIsSelfDesigner,
    getCampaignInfo,
    getCampaignMapRawData,
} from "../../mains/Provider.ts";
import {
    reqCmCreateCampaignMap,
    reqCmSetCampaignMapEnabled,
} from "../Gateway.ts";
import { showLang } from "../../../FloatText.ts";
import { getDict } from "../../../gamePanels/Dict.ts";
import { openPanel } from "../../../gamePanels/Manager.ts";
import { gotoMapEditorWar } from "../../../helpers/GameFlow.ts";
import { TextType } from "../../../lang/Constants.ts";
import {
    getText,
    getLanguageText,
    getTextForYesOrNo,
} from "../../../lang/Utils.ts";
import { getMapEditorData } from "../../../mapEditor/model/MeModel.ts";
import { reqMeSubmitNormalMap } from "../../../mapEditor/model/MeProxy.ts";
import { TypeId } from "../../../notifications/TypeId.ts";
import type { S as MeSubmitNormalMapResponse } from "../../../proto/schema/CommonProto/NetMessage/MsgMeSubmitNormalMap/S.ts";
import { UiListItemRenderer } from "../../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../../ui/types/UiListItemData.ts";
import type { Event } from "../../../vendor/egret/Egret.ts";

export interface OpenData {
    campaignId  : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnAddMap!            : IUiButton;

    private readonly _listMap!              : IUiScrollList<DataForCampaignMapRenderer>;
    private readonly _labelNoData!          : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgCmCreateCampaignMap,      callback: this._onNotifyMsgCmCreateCampaignMap },
            { type: TypeId.MsgCmSetCampaignMapEnabled,  callback: this._onNotifyMsgCmSetCampaignMapEnabled },
            { type: TypeId.MsgMeSubmitNormalMap,        callback: this._onNotifyMsgMeSubmitNormalMap },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnAddMap,          callback: this._onTouchedBtnAddMap },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listMap.setItemRendererClass(CampaignMapRenderer);

        this._updateView();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listMap.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _onTouchedBtnAddMap(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getText(TextType.AreYouSureYouWantToContinue),
            callback    : () => reqCmCreateCampaignMap(campaignId),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgCmCreateCampaignMap(): void {
        showLang(TextType.OperationSucceeded);
        this._updateComponentsForListMap();
    }
    private _onNotifyMsgCmSetCampaignMapEnabled(): void {
        showLang(TextType.OperationSucceeded);
        this._updateComponentsForListMap();
    }
    private _onNotifyMsgMeSubmitNormalMap(e: Event): void {
        const data      = e.data as MeSubmitNormalMapResponse;
        const slotIndex = data.getSlotIndex() ?? 0;
        openPanel(getDict().CommonConfirmPanel, {
            getContent  : () => getText(TextType.A0440),
            callback    : async () => {
                const mapEditorData = await getMapEditorData(slotIndex);
                gotoMapEditorWar({
                    mapRawData                  : mapEditorData?.mapRawData,
                    slotIndex                   : slotIndex,
                    isReview                    : false,
                    srcNormalMapIdForAddEvent   : null,
                    gridMarkData                : mapEditorData?.gridMarkData,
                });
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateTopButtons();
        this._updateComponentsForListMap();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1045);
        this._labelNoData.setLangText(TextType.B0278);
    }

    private async _updateTopButtons(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        this._btnAddMap.setIsVisible(await checkIsSelfDesigner(campaignId));
    }

    private async _updateComponentsForListMap(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const label                 = this._labelNoData;
        const list                  = this._listMap;
        const allCampaignMapIdArray = (await getCampaignInfo(campaignId))?.getAllCampaignMapIdArray();
        if (!allCampaignMapIdArray?.length) {
            label.setIsVisible(true);
            await list.removeAllItems();
        } else {
            label.setIsVisible(false);

            const dataArray : DataForCampaignMapRenderer[] = [];
            let index       = 0;
            for (const campaignMapId of allCampaignMapIdArray) {
                dataArray.push({
                    index           : index++,
                    campaignId      : campaignId,
                    campaignMapId   : campaignMapId,
                });
            }
            await list.bindData(dataArray);
        }
    }
}

interface DataForCampaignMapRenderer extends UiListItemData {
    index           : number;
    campaignId      : number;
    campaignMapId   : number;
}
class CampaignMapRenderer extends UiListItemRenderer<DataForCampaignMapRenderer> {
    private readonly _imgBg!        : IUiImage;
    private readonly _labelName!    : IUiLabel;
    private readonly _btnEnable!    : IUiButton;
    private readonly _btnImport!    : IUiButton;
    private readonly _btnModify!    : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnModify,                      callback: this._onTouchedBtnModify },
            { ui: this._btnImport,                      callback: this._onTouchedBtnImport },
            { ui: this._btnEnable,                      callback: this._onTouchedBtnEnable },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForLanguage();
        // this._imgBg.alpha = this._getData().index % 2 < 1 ? 0.2 : 0.5;
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private async _onTouchedBtnModify(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { campaignId, campaignMapId } = openData;
        const mapRawData                    = await getCampaignMapRawData(campaignId, campaignMapId);
        if (mapRawData == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle    : () => getText(TextType.B0317),
            getContent  : () => getText(TextType.A0835),
            callback    : () => {
                openPanel(getDict().CommonChooseSingleMapEditorSlotPanel, {
                    currentSlotIndex        : 0,
                    needConfirmOverwrite    : true,
                    needNonEmptySlot        : false,
                    getHelpText             : null,
                    callback                : slotIndex => {
                        reqMeSubmitNormalMap({
                            slotIndex                   : slotIndex,
                            mapRawData                  : mapRawData,
                            needReview                  : false,
                            srcNormalMapIdForAddEvent   : null,
                            gridMarkData                : null,
                        });
                    },
                });
            },
        });
    }
    private async _onTouchedBtnImport(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { campaignId, campaignMapId } = openData;
        const mapRawData                    = await getCampaignMapRawData(campaignId, campaignMapId);
        if (mapRawData == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle       : () => getText(TextType.B0128),
            getContent     : () => getText(TextType.A0836),
            callback    : () => openPanel(getDict().CommonChooseSingleMapEditorSlotPanel, {
                currentSlotIndex        : 0,
                needConfirmOverwrite    : true,
                needNonEmptySlot        : true,
                getHelpText             : () => getText(TextType.A0441),
                callback                : async slotIndex => {
                    const existingData = await getMapEditorData(slotIndex);
                    if (existingData == null) {
                        return;
                    }

                    const existingMapRawData = existingData.mapRawData;
                    if (existingMapRawData == null) {
                        return;
                    }

                    existingMapRawData.setCampaignMapData(mapRawData.getCampaignMapData()?.clone());

                    const templateWarRuleArray = existingMapRawData.getTemplateWarRuleArray();
                    if (templateWarRuleArray) {
                        if (templateWarRuleArray.length > 1) {
                            templateWarRuleArray.length = 1;
                        }

                        const warRule = templateWarRuleArray[0];
                        if (warRule) {
                            warRule.setRuleAvailability(null);
                        }
                    }

                    reqMeSubmitNormalMap({
                        slotIndex                   : slotIndex,
                        mapRawData                  : existingMapRawData,
                        needReview                  : false,
                        srcNormalMapIdForAddEvent   : null,
                        gridMarkData                : existingData.gridMarkData,
                    });
                },
            }),
        });
    }
    private async _onTouchedBtnEnable(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const campaignId    = openData.campaignId;
        const campaignInfo  = await getCampaignInfo(campaignId);
        if (campaignInfo == null) {
            return;
        }

        const campaignMapId = openData.campaignMapId;
        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getText(TextType.AreYouSureYouWantToContinue),
            callback    : () => reqCmSetCampaignMapEnabled(
                campaignId,
                campaignMapId,
                (campaignInfo.getEnabledCampaignMapIdArray().indexOf(campaignMapId)) < 0,
            ),
        });
    }

    private _updateComponentsForLanguage(): void {
        this._btnModify.setLangText(TextType.B0317);
        this._btnImport.setLangText(TextType.B0128);
        this._updateLabelName();
        this._updateBtnEnable();
        this._updateBtnModifyAndImport();
    }

    private async _updateLabelName(): Promise<void> {
        const label = this._labelName;
        label.setText(``);

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { campaignId, campaignMapId } = openData;
        const mapNameArray                  = (await getCampaignMapRawData(campaignId, campaignMapId))?.getMapNameArray();
        const newOpenData                   = this.getOpenData();
        if ((campaignId === newOpenData?.campaignId) && (campaignMapId === newOpenData?.campaignMapId)) {
            label.setText(`#${campaignMapId} ${getLanguageText({ textArray: mapNameArray }) ?? getText(TextType.B0277)}`);
        }
    }

    private async _updateBtnEnable(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const campaignId    = openData.campaignId;
        const btn           = this._btnEnable;
        btn.setIsVisible(false);

        const campaignInfo  = await getCampaignInfo(campaignId);
        const campaignMapId = openData.campaignMapId;
        if ((campaignInfo != null)                                          &&
            (await checkIsSelfDesigner(campaignId))  &&
            (campaignId === this.getOpenData()?.campaignId)                 &&
            (campaignMapId === this.getOpenData()?.campaignMapId)
        ) {
            btn.setIsVisible(true);
            btn.setText(`${getText(TextType.B1140)}: ${getTextForYesOrNo((campaignInfo.getEnabledCampaignMapIdArray().indexOf(campaignMapId)) >= 0)}`);
        }
    }

    private async _updateBtnModifyAndImport(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const btnModify     = this._btnModify;
        const btnImport     = this._btnImport;
        btnModify.setIsVisible(false);
        btnImport.setIsVisible(false);

        if ((await checkIsSelfDesigner(campaignId)) &&
            (campaignId === this.getOpenData()?.campaignId)
        ) {
            btnModify.setIsVisible(true);
            btnImport.setIsVisible(true);
        }
    }
}
