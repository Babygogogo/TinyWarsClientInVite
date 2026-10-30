import {
    Campaigns_Mains_Provider,
    GamePanels_Dict,
    Lang_Utils,
    MapEditor_Model_MeModel,
    Helpers_GameFlow,
    GamePanels_Manager,
    Campaigns_Managements_Gateway,
    MapEditor_Model_MeProxy,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../../internal.ts";
import type { S as MeSubmitNormalMapResponse } from "../../../proto/schema/CommonProto/NetMessage/MsgMeSubmitNormalMap/S.ts";

export interface OpenData {
    campaignId  : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAddMap!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listMap!              : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForCampaignMapRenderer>;
    private readonly _labelNoData!          : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MsgCmCreateCampaignMap,      callback: this._onNotifyMsgCmCreateCampaignMap },
            { type: Notifications_TypeId.TypeId.MsgCmSetCampaignMapEnabled,  callback: this._onNotifyMsgCmSetCampaignMapEnabled },
            { type: Notifications_TypeId.TypeId.MsgMeSubmitNormalMap,        callback: this._onNotifyMsgMeSubmitNormalMap },
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback    : () => Campaigns_Managements_Gateway.reqCmCreateCampaignMap(campaignId),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgCmCreateCampaignMap(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
        this._updateComponentsForListMap();
    }
    private _onNotifyMsgCmSetCampaignMapEnabled(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
        this._updateComponentsForListMap();
    }
    private _onNotifyMsgMeSubmitNormalMap(e: Egret_Egret.Event): void {
        const data      = e.data as MeSubmitNormalMapResponse;
        const slotIndex = data.getSlotIndex() ?? 0;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent  : () => Lang_Utils.getText(Lang_Constants.TextType.A0440),
            callback    : async () => {
                const mapEditorData = await MapEditor_Model_MeModel.getMapEditorData(slotIndex);
                Helpers_GameFlow.gotoMapEditorWar({
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B1045);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
    }

    private async _updateTopButtons(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        this._btnAddMap.setIsVisible(await Campaigns_Mains_Provider.checkIsSelfDesigner(campaignId));
    }

    private async _updateComponentsForListMap(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const label                 = this._labelNoData;
        const list                  = this._listMap;
        const allCampaignMapIdArray = (await Campaigns_Mains_Provider.getCampaignInfo(campaignId))?.getAllCampaignMapIdArray();
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

interface DataForCampaignMapRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index           : number;
    campaignId      : number;
    campaignMapId   : number;
}
class CampaignMapRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForCampaignMapRenderer> {
    private readonly _imgBg!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnEnable!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnImport!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnModify!    : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
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
        const mapRawData                    = await Campaigns_Mains_Provider.getCampaignMapRawData(campaignId, campaignMapId);
        if (mapRawData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle    : () => Lang_Utils.getText(Lang_Constants.TextType.B0317),
            getContent  : () => Lang_Utils.getText(Lang_Constants.TextType.A0835),
            callback    : () => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleMapEditorSlotPanel, {
                    currentSlotIndex        : 0,
                    needConfirmOverwrite    : true,
                    needNonEmptySlot        : false,
                    getHelpText             : null,
                    callback                : slotIndex => {
                        MapEditor_Model_MeProxy.reqMeSubmitNormalMap({
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
        const mapRawData                    = await Campaigns_Mains_Provider.getCampaignMapRawData(campaignId, campaignMapId);
        if (mapRawData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle       : () => Lang_Utils.getText(Lang_Constants.TextType.B0128),
            getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.A0836),
            callback    : () => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleMapEditorSlotPanel, {
                currentSlotIndex        : 0,
                needConfirmOverwrite    : true,
                needNonEmptySlot        : true,
                getHelpText             : () => Lang_Utils.getText(Lang_Constants.TextType.A0441),
                callback                : async slotIndex => {
                    const existingData = await MapEditor_Model_MeModel.getMapEditorData(slotIndex);
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

                    MapEditor_Model_MeProxy.reqMeSubmitNormalMap({
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
        const campaignInfo  = await Campaigns_Mains_Provider.getCampaignInfo(campaignId);
        if (campaignInfo == null) {
            return;
        }

        const campaignMapId = openData.campaignMapId;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback    : () => Campaigns_Managements_Gateway.reqCmSetCampaignMapEnabled(
                campaignId,
                campaignMapId,
                (campaignInfo.getEnabledCampaignMapIdArray().indexOf(campaignMapId)) < 0,
            ),
        });
    }

    private _updateComponentsForLanguage(): void {
        this._btnModify.setLangText(Lang_Constants.TextType.B0317);
        this._btnImport.setLangText(Lang_Constants.TextType.B0128);
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
        const mapNameArray                  = (await Campaigns_Mains_Provider.getCampaignMapRawData(campaignId, campaignMapId))?.getMapNameArray();
        const newOpenData                   = this.getOpenData();
        if ((campaignId === newOpenData?.campaignId) && (campaignMapId === newOpenData?.campaignMapId)) {
            label.setText(`#${campaignMapId} ${Lang_Utils.getLanguageText({ textArray: mapNameArray }) ?? Lang_Utils.getText(Lang_Constants.TextType.B0277)}`);
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

        const campaignInfo  = await Campaigns_Mains_Provider.getCampaignInfo(campaignId);
        const campaignMapId = openData.campaignMapId;
        if ((campaignInfo != null)                                          &&
            (await Campaigns_Mains_Provider.checkIsSelfDesigner(campaignId))  &&
            (campaignId === this.getOpenData()?.campaignId)                 &&
            (campaignMapId === this.getOpenData()?.campaignMapId)
        ) {
            btn.setIsVisible(true);
            btn.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1140)}: ${Lang_Utils.getTextForYesOrNo((campaignInfo.getEnabledCampaignMapIdArray().indexOf(campaignMapId)) >= 0)}`);
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

        if ((await Campaigns_Mains_Provider.checkIsSelfDesigner(campaignId)) &&
            (campaignId === this.getOpenData()?.campaignId)
        ) {
            btnModify.setIsVisible(true);
            btnImport.setIsVisible(true);
        }
    }
}
