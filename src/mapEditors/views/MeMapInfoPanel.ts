import {
    Helpers_GameFlow,
    Maps_Constants,
    Notifications_Dispatcher,
    Campaigns_Mains_Provider,
    MapTags_Utils,
    GamePanels_Dict,
    Maps_Utils_MapRawData,
    Lang_Utils,
    Helpers_Misc,
    NormalMap_Model_NormalMapModel,
    Helpers_Collection,
    MapEditor_Model_MeModel,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Campaigns_Managements_Gateway,
    MapEditor_Model_MeProxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";
import type { S as UserSetMapEditorAutoSaveTimeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgUserSetMapEditorAutoSaveTime/S.ts";

export interface OpenData {
    war     : MapEditor_Interface_IMeWar.IMeWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!                              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMapNameTitle!                    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyMapName!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelMapName!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelMapDescriptionTitle!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyMapDescription!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelMapDescription!                  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelMapDesignerTitle!                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyMapDesigner!               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelMapDesigner!                     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelMapSizeTitle!                    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyMapSize!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelMapSize!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelMapTagTitle!                     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyMapTag!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelMapTag!                          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelWarRuleTitle!                    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyWarRule!                   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelWarRule!                         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelWarEventTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyWarEvent!                  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelWarEvent!                        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelCustomCounterTitle!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyCustomCounter!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelCustomCounter!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelTaskObjectiveTitle!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyTaskObjective!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTaskObjective!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelRepeatableSimpleDialogueTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyRepeatableSimpleDialogue!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelRepeatableSimpleDialogue!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelTileCustomNameTitle!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyTileCustomName!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTileCustomName!                  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelUnitCustomNameTitle!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupModifyUnitCustomName!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelUnitCustomName!                  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnTilesAndUnits!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSimulation!                        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnFreeMode!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnImport!                            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClearMap!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteSlotData!                    : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.UnitAndTileTextureVersionChanged,    callback: this._onNotifyUnitAndTileTextureVersionChanged },
            { type: Notifications_TypeId.TypeId.MeMapNameChanged,                    callback: this._onNotifyMeMapNameChanged },
            { type: Notifications_TypeId.TypeId.MeMapCleared,                        callback: this._onNotifyMeMapCleared },
            { type: Notifications_TypeId.TypeId.MeMapSizeChanged,                    callback: this._onNotifyMeMapSizeChanged },
            { type: Notifications_TypeId.TypeId.MeMapDescChanged,                    callback: this._onNotifyMeMapDescChanged },
            { type: Notifications_TypeId.TypeId.WarEventFullDataChanged,             callback: this._onNotifyWarEventFullDataChanged },
            { type: Notifications_TypeId.TypeId.MeTaskObjectiveFullDataChanged,      callback: this._onNotifyMeTaskObjectiveFullDataChanged },
            { type: Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged,          callback: this._onNotifyMeMapSimpleDialogueChanged },
            { type: Notifications_TypeId.TypeId.BwTileCustomNameArrayChanged,        callback: this._onNotifyBwTileCustomNameArrayChanged },
            { type: Notifications_TypeId.TypeId.BwUnitCustomNameArrayChanged,        callback: this._onNotifyBwUnitCustomNameArrayChanged },
            { type: Notifications_TypeId.TypeId.MsgUserSetMapEditorAutoSaveTime,     callback: this._onNotifyMsgUserSetMapEditorAutoSaveTime },
            { type: Notifications_TypeId.TypeId.MsgCmSetCampaignMapName,             callback: this._onNotifyMsgCmSetCampaignMapName },
            { type: Notifications_TypeId.TypeId.MsgCmSetCampaignMapExtraText,        callback: this._onNotifyMsgCmSetCampaignMapExtraText },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                               callback: this.closePanel },
            { ui: this._btnHelp,                                callback: this._onTouchedBtnHelp },
            { ui: this._groupModifyMapDesigner,                 callback: this._onTouchedGroupModifyMapDesigner },
            { ui: this._groupModifyMapName,                     callback: this._onTouchedGroupModifyMapName },
            { ui: this._groupModifyMapDescription,              callback: this._onTouchedGroupModifyMapDescription },
            { ui: this._groupModifyMapSize,                     callback: this._onTouchedGroupModifyMapSize },
            { ui: this._groupModifyMapTag,                      callback: this._onTouchedGroupModifyMapTag },
            { ui: this._groupModifyWarRule,                     callback: this._onTouchedGroupModifyWarRule },
            { ui: this._groupModifyWarEvent,                    callback: this._onTouchedGroupModifyWarEvent },
            { ui: this._groupModifyCustomCounter,               callback: this._onTouchedGroupModifyCustomCounter },
            { ui: this._groupModifyTaskObjective,               callback: this._onTouchedGroupModifyTaskObjective },
            { ui: this._groupModifyRepeatableSimpleDialogue,    callback: this._onTouchedGroupModifyRepeatableSimpleDialogue },
            { ui: this._groupModifyTileCustomName,              callback: this._onTouchedGroupModifyTileCustomName },
            { ui: this._groupModifyUnitCustomName,              callback: this._onTouchedGroupModifyUnitCustomName },

            { ui: this._btnTilesAndUnits,                       callback: this._onTouchedBtnTilesAndUnits },
            { ui: this._btnSimulation,                          callback: this._onTouchedBtnSimulation },
            { ui: this._btnFreeMode,                            callback: this._onTouchedBtnFreeMode },
            { ui: this._btnImport,                              callback: this._onTouchedBtnImport },
            { ui: this._btnClearMap,                            callback: this._onTouchedBtnClearMap },
            { ui: this._btnDeleteSlotData,                      callback: this._onTouchedBtnDeleteSlotData },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyMsgUserSetMapEditorAutoSaveTime(e: Egret_Egret.Event): void {
        const data = e.data as UserSetMapEditorAutoSaveTimeResponse;
        FloatText.show(Lang_Utils.getText(data.getTime() == null ? Lang_Constants.TextType.A0248 : Lang_Constants.TextType.A0247));
    }
    private _onNotifyMsgCmSetCampaignMapName(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }
    private _onNotifyMsgCmSetCampaignMapExtraText(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyUnitAndTileTextureVersionChanged(): void {
        this._updateView();
    }

    private _onNotifyMeMapNameChanged(): void {
        this._updateLabelMapName();
    }
    private _onNotifyMeMapCleared(): void {
        this._updateLabelMapSize();
    }
    private _onNotifyMeMapSizeChanged(): void {
        this._updateLabelMapSize();
    }
    private _onNotifyMeMapDescChanged(): void {
        this._updateLabelMapDescription();
    }
    private _onNotifyWarEventFullDataChanged(): void {
        this._updateLabelWarEvent();
        this._updateLabelCustomCounter();
    }
    private _onNotifyMeTaskObjectiveFullDataChanged(): void {
        this._updateLabelTaskObjective();
    }
    private _onNotifyMeMapSimpleDialogueChanged(): void {
        this._updateLabelRepeatableSimpleDialogue();
    }
    private _onNotifyBwTileCustomNameArrayChanged(): void {
        this._updateLabelTileCustomName();
    }
    private _onNotifyBwUnitCustomNameArrayChanged(): void {
        this._updateLabelUnitCustomName();
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0782),
        });
    }

    private _onTouchedGroupModifyMapName(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const mapNameArray  = war.getMapNameArray();
        if (war.getIsReviewingMap()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowLangTextPanel, {
                getTitleText: () => Lang_Utils.getText(Lang_Constants.TextType.B0225),
                textArray   : mapNameArray,
            });

        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputShortLangTextPanel, {
                currentTextArray    : mapNameArray,
                maxTextLength       : Maps_Constants.Common.MaxNameLength,
                callback            : async newMapNameArray => {
                    war.setMapNameArray(newMapNameArray);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapNameChanged);

                    const campaignMapData = war.getCampaignMapData();
                    if (campaignMapData != null) {
                        const campaignId    = campaignMapData.getCampaignId();
                        const campaignMapId = campaignMapData.getCampaignMapId();
                        if ((await Campaigns_Mains_Provider.getCampaignInfo(campaignId))?.getEnabledCampaignMapIdArray().some(v => v === campaignMapId)) {
                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                                getContent         : () => Lang_Utils.getText(Lang_Constants.TextType.A0112),
                                callback        : () => Campaigns_Managements_Gateway.reqCmSetCampaignMapName(
                                    campaignId,
                                    campaignMapId,
                                    newMapNameArray
                                ),
                            });
                        }
                    }
                },
            });
        }
    }

    private _onTouchedGroupModifyMapDescription(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const mapDescArray  = war.getMapDescArray();
        if (war.getIsReviewingMap()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowLangTextPanel, {
                getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B0893),
                textArray       : mapDescArray,
            });
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputLanguageTextPanel, {
                maxLength           : Maps_Constants.Common.MaxDescLength,
                currentTextArray    : mapDescArray,
                isMultiline         : true,
                getTitle            : () => Lang_Utils.getText(Lang_Constants.TextType.B0893),
                callback            : async newMapDescArray => {
                    war.setMapDescArray(newMapDescArray);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapDescChanged);

                    const campaignMapData = war.getCampaignMapData();
                    if (campaignMapData != null) {
                        const campaignId    = campaignMapData.getCampaignId();
                        const campaignMapId = campaignMapData.getCampaignMapId();
                        if ((await Campaigns_Mains_Provider.getCampaignInfo(campaignId))?.getEnabledCampaignMapIdArray().some(v => v === campaignMapId)) {
                            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                                getContent      : () => Lang_Utils.getText(Lang_Constants.TextType.A0109),
                                callback        : () => Campaigns_Managements_Gateway.reqCmSetCampaignMapExtraText(
                                    campaignId,
                                    campaignMapId,
                                    {
                                        mapDescription: newMapDescArray.map(v => v.toJson()),
                                    },
                                ),
                            });
                        }
                    }
                },
            });
        }
    }

    private _onTouchedGroupModifyMapSize(): void {
        if (!this.getOpenData()?.war.getIsReviewingMap()) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeResizePanel, void 0);
        }
    }

    private async _onTouchedGroupModifyMapTag(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const currentGroupedMapTagId    = war.getGroupedMapTagId() ?? 0;
        if (war.getIsReviewingMap()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowMapTagIdPanel, {
                currentGroupedMapTagId  : currentGroupedMapTagId,
            });
        } else {
            const mapTag = await NormalMap_Model_NormalMapModel.getMapTag();
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
                availableNumberArray    : Helpers_Collection.getNonNullElements(mapTag?.getMapTagDataArray().map(v => v.getIsEnabled() ? v.getMapTagId() : null) ?? []).sort((v1, v2) => v1 - v2),
                currentNumberArray      : MapTags_Utils.getDecodedMapTagIdList(currentGroupedMapTagId),
                showNumber              : true,
                getTitleText            : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B0445)),
                getNumberMainText       : mapTagId => Lang_Utils.getLanguageText({ textArray: mapTag?.getMapTagDataArray().find(v => (v.getMapTagId()) === mapTagId)?.getNameArray() }) ?? Lang_Constants.UndefinedError,
                callbackOnConfirm       : newMapTagIdArray => {
                    war.setGroupedMapTagId(MapTags_Utils.getEncodedMapTagId(newMapTagIdArray));
                    this._updateLabelMapTag();
                },
            });
        }
    }

    private _onTouchedGroupModifyWarRule(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeWarRulePanel, { war: war });
        this.closePanel();
    }

    private _onTouchedGroupModifyWarEvent(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeMainPanel, { war : war });
        this.closePanel();
    }

    private _onTouchedGroupModifyCustomCounter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeCustomCounterNameListPanel, {
            isReviewingMap  : war.getIsReviewingMap(),
            fullData        : Helpers_Misc.getExisted(war.getWarEventManager().getWarEventFullData()),
        });
    }

    private _onTouchedGroupModifyTaskObjective(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeTaskObjectiveListPanel, { war: war });
    }

    private _onTouchedGroupModifyRepeatableSimpleDialogue(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeMapSimpleDialogueMainPanel, { war: war });
    }

    private _onTouchedGroupModifyTileCustomName(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeTileCustomNameListPanel, { war: war });
    }

    private _onTouchedGroupModifyUnitCustomName(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeUnitCustomNameListPanel, { war: war });
    }

    private _onTouchedBtnTilesAndUnits(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeTileUnitInfoPanel, { war: war });
        this.closePanel();
    }

    private async _onTouchedBtnSimulation(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const mapRawData    = await war.serializeForMap();
        const errorCode     = await Maps_Utils_MapRawData.getErrorCode({
            mapRawData                          : mapRawData,
            allowRedundantWarEvents             : false,
            allowRedundantMapSimpleDialogues    : false,
        });
        if (errorCode) {
            FloatText.show(Lang_Utils.getErrorText(errorCode));
            return;
        }

        Helpers_GameFlow.checkAndCreateSimulation(mapRawData, war.getGridMarkData());
    }

    private async _onTouchedBtnFreeMode(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const mapRawData    = await war.serializeForMap();
        const errorCode     = await Maps_Utils_MapRawData.getErrorCode({
            mapRawData                          : mapRawData,
            allowRedundantWarEvents             : false,
            allowRedundantMapSimpleDialogues    : false,
        });
        if (errorCode) {
            FloatText.show(Lang_Utils.getErrorText(errorCode));
            return;
        }

        if (!war.getIsMapModified()) {
            Helpers_GameFlow.checkAndCreateMultiFreeWar(mapRawData);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.A0317),
                callback    : () => Helpers_GameFlow.checkAndCreateMultiFreeWar(mapRawData),
            });
        }
    }

    private _onTouchedBtnImport(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeImportExportPanel, {
                war     : war,
            });
            this.closePanel();
        }
    }
    private _onTouchedBtnClearMap(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeClearPanel, { war });
        }
    }

    private async _onTouchedBtnDeleteSlotData(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const slotIndex = war.getMapSlotIndex();
            if (await MapEditor_Model_MeModel.getReviewingMapSlotIndex() === slotIndex) {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0315));
                return;
            }

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0314),
                callback: () => MapEditor_Model_MeProxy.reqMeDeleteSlot(slotIndex),
            });
        }
    }

    private _onTouchedGroupModifyMapDesigner(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (!war.getIsReviewingMap()) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
                title           : Lang_Utils.getText(Lang_Constants.TextType.B0163),
                tips            : null,
                currentValue    : war.getMapDesignerName(),
                maxChars        : Maps_Constants.Common.MaxDesignerLength,
                charRestrict    : null,
                callback        : (panel) => {
                    war.setMapDesignerName(panel.getInputText());
                    this._updateLabelMapDesigner();
                },
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelMapName();
        this._updateLabelMapDescription();
        this._updateLabelMapDesigner();
        this._updateLabelMapSize();
        this._updateLabelMapTag();
        this._updateLabelWarRule();
        this._updateLabelWarEvent();
        this._updateLabelCustomCounter();
        this._updateLabelTaskObjective();
        this._updateLabelRepeatableSimpleDialogue();
        this._updateLabelTileCustomName();
        this._updateLabelUnitCustomName();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0298);
        this._labelMapNameTitle.setLangText(Lang_Constants.TextType.B0225);
        this._labelMapDescriptionTitle.setLangText(Lang_Constants.TextType.B0893);
        this._labelMapDesignerTitle.setLangText(Lang_Constants.TextType.B0163);
        this._labelMapSizeTitle.setLangText(Lang_Constants.TextType.B0300);
        this._labelMapTagTitle.setLangText(Lang_Constants.TextType.B0445);
        this._labelWarRuleTitle.setLangText(Lang_Constants.TextType.B0314);
        this._labelWarEventTitle.setLangText(Lang_Constants.TextType.B0461);
        this._labelCustomCounterTitle.setLangText(Lang_Constants.TextType.B1257);
        this._labelTaskObjectiveTitle.setLangText(Lang_Constants.TextType.B1214);
        this._labelRepeatableSimpleDialogueTitle.setLangText(Lang_Constants.TextType.B1095);
        this._labelTileCustomNameTitle.setLangText(Lang_Constants.TextType.B1430);
        this._labelUnitCustomNameTitle.setLangText(Lang_Constants.TextType.B1433);

        this._btnTilesAndUnits.setLangText(Lang_Constants.TextType.B1244);
        this._btnSimulation.setLangText(Lang_Constants.TextType.B0325);
        this._btnFreeMode.setLangText(Lang_Constants.TextType.B1285);
        this._btnImport.setLangText(Lang_Constants.TextType.B1252);
        this._btnClearMap.setLangText(Lang_Constants.TextType.B0391);
        this._btnDeleteSlotData.setLangText(Lang_Constants.TextType.B1251);
    }

    private _updateLabelMapName(): void {
        this._labelMapName.setText(Lang_Utils.getJoinedShortLanguageText(this.getOpenData()?.war.getMapNameArray(), 10));
    }

    private _updateLabelMapDescription(): void {
        this._labelMapDescription.setText(Lang_Utils.getJoinedShortLanguageText(this.getOpenData()?.war.getMapDescArray(), 10));
    }

    private _updateLabelMapDesigner(): void {
        this._labelMapDesigner.setText(this.getOpenData()?.war.getMapDesignerName() ?? Lang_Constants.UndefinedError);
    }

    private _updateLabelMapSize(): void {
        const size = this.getOpenData()?.war.getTileMap().getMapSize();
        if (size == null) {
            return;
        }

        this._labelMapSize.setText(`${size.getWidth()} * ${size.getHeight()}`);
    }

    private _updateLabelMapTag(): void {
        const groupedMapTagId   = this.getOpenData()?.war.getGroupedMapTagId();
        const mapTagIdArray     = groupedMapTagId == null ? null : MapTags_Utils.getDecodedMapTagIdList(groupedMapTagId);
        this._labelMapTag.setText(`${mapTagIdArray?.length ?? 0}`);
    }

    private _updateLabelWarRule(): void {
        this._labelWarRule.setText(`${this.getOpenData()?.war.getTemplateWarRuleArray().length}`);
    }

    private _updateLabelWarEvent(): void {
        this._labelWarEvent.setText(`${this.getOpenData()?.war.getWarEventManager().getWarEventFullData()?.getEventArray().length ?? 0}`);
    }

    private _updateLabelCustomCounter(): void {
        this._labelCustomCounter.setText(`${this.getOpenData()?.war.getWarEventManager().getWarEventFullData()?.getCustomCounterNameArray().length ?? 0}`);
    }

    private _updateLabelTaskObjective(): void {
        this._labelTaskObjective.setText(`${this.getOpenData()?.war.getTaskObjectiveFullData()?.getTaskObjectiveArray().length ?? 0}`);
    }

    private _updateLabelRepeatableSimpleDialogue(): void {
        this._labelRepeatableSimpleDialogue.setText(`${this.getOpenData()?.war.getMapSimpleDialogueArray().length}`);
    }

    private _updateLabelTileCustomName(): void {
        this._labelTileCustomName.setText(`${this.getOpenData()?.war.getTileMap().getTileCustomNameArray()?.length ?? 0}`);
    }

    private _updateLabelUnitCustomName(): void {
        this._labelUnitCustomName.setText(`${this.getOpenData()?.war.getUnitMap().getUnitCustomNameArray()?.length ?? 0}`);
    }
}
