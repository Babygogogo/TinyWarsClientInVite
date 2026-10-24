import * as CampaignsMainsProvider from "../../mains/Provider.ts";
import * as CampaignsManagementsGateway from "../Gateway.ts";
import * as FloatText2 from "../../../FloatText.ts";
import * as GamePanelsDict from "../../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../../helpers/GameFlow.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as MapEditorModelMeModel from "../../../mapEditor/model/MeModel.ts";
import * as MapEditorModelMeProxy from "../../../mapEditor/model/MeProxy.ts";
import * as NotificationsTypeId from "../../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMeSubmitNormalMapS from "../../../proto/schema/CommonProto/NetMessage/MsgMeSubmitNormalMap/S.ts";
import * as UiComponentsUiListItemRenderer from "../../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../../ui/types/UiListItemData.ts";
import type * as VendorEgretEgret from "../../../vendor/egret/Egret.ts";

export interface OpenData {
    campaignId  : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAddMap!            : UiInterfacesIUiButton.IUiButton;

    private readonly _listMap!              : UiInterfacesIUiScrollList.IUiScrollList<DataForCampaignMapRenderer>;
    private readonly _labelNoData!          : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgCmCreateCampaignMap,      callback: this._onNotifyMsgCmCreateCampaignMap },
            { type: NotificationsTypeId.TypeId.MsgCmSetCampaignMapEnabled,  callback: this._onNotifyMsgCmSetCampaignMapEnabled },
            { type: NotificationsTypeId.TypeId.MsgMeSubmitNormalMap,        callback: this._onNotifyMsgMeSubmitNormalMap },
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => CampaignsManagementsGateway.reqCmCreateCampaignMap(campaignId),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgCmCreateCampaignMap(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
        this._updateComponentsForListMap();
    }
    private _onNotifyMsgCmSetCampaignMapEnabled(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
        this._updateComponentsForListMap();
    }
    private _onNotifyMsgMeSubmitNormalMap(e: VendorEgretEgret.Event): void {
        const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgMeSubmitNormalMapS.S;
        const slotIndex = data.getSlotIndex() ?? 0;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent  : () => LangUtils.getText(LangConstants.TextType.A0440),
            callback    : async () => {
                const mapEditorData = await MapEditorModelMeModel.getMapEditorData(slotIndex);
                HelpersGameFlow.gotoMapEditorWar({
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1045));
        this._labelNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
    }

    private async _updateTopButtons(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        this._btnAddMap.setIsVisible(await CampaignsMainsProvider.checkIsSelfDesigner(campaignId));
    }

    private async _updateComponentsForListMap(): Promise<void> {
        const campaignId = this.getOpenData()?.campaignId;
        if (campaignId == null) {
            return;
        }

        const label                 = this._labelNoData;
        const list                  = this._listMap;
        const allCampaignMapIdArray = (await CampaignsMainsProvider.getCampaignInfo(campaignId))?.getAllCampaignMapIdArray();
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

interface DataForCampaignMapRenderer extends UiTypesUiListItemData.UiListItemData {
    index           : number;
    campaignId      : number;
    campaignMapId   : number;
}
class CampaignMapRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForCampaignMapRenderer> {
    private readonly _imgBg!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnEnable!    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnImport!    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnModify!    : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
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
        const mapRawData                    = await CampaignsMainsProvider.getCampaignMapRawData(campaignId, campaignMapId);
        if (mapRawData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle    : () => LangUtils.getText(LangConstants.TextType.B0317),
            getContent  : () => LangUtils.getText(LangConstants.TextType.A0835),
            callback    : () => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleMapEditorSlotPanel, {
                    currentSlotIndex        : 0,
                    needConfirmOverwrite    : true,
                    needNonEmptySlot        : false,
                    getHelpText             : null,
                    callback                : slotIndex => {
                        MapEditorModelMeProxy.reqMeSubmitNormalMap({
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
        const mapRawData                    = await CampaignsMainsProvider.getCampaignMapRawData(campaignId, campaignMapId);
        if (mapRawData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle       : () => LangUtils.getText(LangConstants.TextType.B0128),
            getContent     : () => LangUtils.getText(LangConstants.TextType.A0836),
            callback    : () => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleMapEditorSlotPanel, {
                currentSlotIndex        : 0,
                needConfirmOverwrite    : true,
                needNonEmptySlot        : true,
                getHelpText             : () => LangUtils.getText(LangConstants.TextType.A0441),
                callback                : async slotIndex => {
                    const existingData = await MapEditorModelMeModel.getMapEditorData(slotIndex);
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

                    MapEditorModelMeProxy.reqMeSubmitNormalMap({
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
        const campaignInfo  = await CampaignsMainsProvider.getCampaignInfo(campaignId);
        if (campaignInfo == null) {
            return;
        }

        const campaignMapId = openData.campaignMapId;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => CampaignsManagementsGateway.reqCmSetCampaignMapEnabled(
                campaignId,
                campaignMapId,
                (campaignInfo.getEnabledCampaignMapIdArray().indexOf(campaignMapId) ?? -1) < 0,
            ),
        });
    }

    private _updateComponentsForLanguage(): void {
        this._btnModify.setText(LangUtils.getText(LangConstants.TextType.B0317));
        this._btnImport.setText(LangUtils.getText(LangConstants.TextType.B0128));
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
        const mapNameArray                  = (await CampaignsMainsProvider.getCampaignMapRawData(campaignId, campaignMapId))?.getMapNameArray();
        const newOpenData                   = this.getOpenData();
        if ((campaignId === newOpenData?.campaignId) && (campaignMapId === newOpenData?.campaignMapId)) {
            label.setText(`#${campaignMapId} ${LangUtils.getLanguageText({ textArray: mapNameArray }) ?? LangUtils.getText(LangConstants.TextType.B0277)}`);
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

        const campaignInfo  = await CampaignsMainsProvider.getCampaignInfo(campaignId);
        const campaignMapId = openData.campaignMapId;
        if ((campaignInfo != null)                                          &&
            (await CampaignsMainsProvider.checkIsSelfDesigner(campaignId))  &&
            (campaignId === this.getOpenData()?.campaignId)                 &&
            (campaignMapId === this.getOpenData()?.campaignMapId)
        ) {
            btn.setIsVisible(true);
            btn.setText(`${LangUtils.getText(LangConstants.TextType.B1140)}: ${LangUtils.getTextForYesOrNo((campaignInfo.getEnabledCampaignMapIdArray().indexOf(campaignMapId) ?? -1) >= 0)}`);
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

        if ((await CampaignsMainsProvider.checkIsSelfDesigner(campaignId)) &&
            (campaignId === this.getOpenData()?.campaignId)
        ) {
            btnModify.setIsVisible(true);
            btnImport.setIsVisible(true);
        }
    }
}
