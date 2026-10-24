import * as CampaignsMainsProvider from "../../campaigns/mains/Provider.ts";
import * as CampaignsManagementsGateway from "../../campaigns/managements/Gateway.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as MapEditorModelMeModel from "../../mapEditor/model/MeModel.ts";
import * as MapEditorModelMeProxy from "../../mapEditor/model/MeProxy.ts";
import * as MapsUtilsMapRawData from "../../maps/utils/MapRawData.ts";
import * as MapTagsUtils from "../../mapTags/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetMapEditorAutoSaveTimeS from "../../proto/schema/CommonProto/NetMessage/MsgUserSetMapEditorAutoSaveTime/S.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export interface OpenData {
    war     : MapEditorInterfaceIMeWar.IMeWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!                              : UiInterfacesIUiButton.IUiButton;

    private readonly _labelMapNameTitle!                    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyMapName!                   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelMapName!                         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelMapDescriptionTitle!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyMapDescription!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelMapDescription!                  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelMapDesignerTitle!                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyMapDesigner!               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelMapDesigner!                     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelMapSizeTitle!                    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyMapSize!                   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelMapSize!                         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelMapTagTitle!                     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyMapTag!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelMapTag!                          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelWarRuleTitle!                    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyWarRule!                   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelWarRule!                         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelWarEventTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyWarEvent!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelWarEvent!                        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelCustomCounterTitle!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyCustomCounter!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelCustomCounter!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelTaskObjectiveTitle!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyTaskObjective!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTaskObjective!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelRepeatableSimpleDialogueTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyRepeatableSimpleDialogue!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelRepeatableSimpleDialogue!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelTileCustomNameTitle!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyTileCustomName!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTileCustomName!                  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelUnitCustomNameTitle!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupModifyUnitCustomName!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelUnitCustomName!                  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnTilesAndUnits!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSimulation!                        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnFreeMode!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnImport!                            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClearMap!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteSlotData!                    : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.UnitAndTileTextureVersionChanged,    callback: this._onNotifyUnitAndTileTextureVersionChanged },
            { type: NotificationsTypeId.TypeId.MeMapNameChanged,                    callback: this._onNotifyMeMapNameChanged },
            { type: NotificationsTypeId.TypeId.MeMapCleared,                        callback: this._onNotifyMeMapCleared },
            { type: NotificationsTypeId.TypeId.MeMapSizeChanged,                    callback: this._onNotifyMeMapSizeChanged },
            { type: NotificationsTypeId.TypeId.MeMapDescChanged,                    callback: this._onNotifyMeMapDescChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,             callback: this._onNotifyWarEventFullDataChanged },
            { type: NotificationsTypeId.TypeId.MeTaskObjectiveFullDataChanged,      callback: this._onNotifyMeTaskObjectiveFullDataChanged },
            { type: NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged,          callback: this._onNotifyMeMapSimpleDialogueChanged },
            { type: NotificationsTypeId.TypeId.BwTileCustomNameArrayChanged,        callback: this._onNotifyBwTileCustomNameArrayChanged },
            { type: NotificationsTypeId.TypeId.BwUnitCustomNameArrayChanged,        callback: this._onNotifyBwUnitCustomNameArrayChanged },
            { type: NotificationsTypeId.TypeId.MsgUserSetMapEditorAutoSaveTime,     callback: this._onNotifyMsgUserSetMapEditorAutoSaveTime },
            { type: NotificationsTypeId.TypeId.MsgCmSetCampaignMapName,             callback: this._onNotifyMsgCmSetCampaignMapName },
            { type: NotificationsTypeId.TypeId.MsgCmSetCampaignMapExtraText,        callback: this._onNotifyMsgCmSetCampaignMapExtraText },
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
    private _onNotifyMsgUserSetMapEditorAutoSaveTime(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetMapEditorAutoSaveTimeS.S;
        FloatText2.show(LangUtils.getText(data.getTime() == null ? LangConstants.TextType.A0248 : LangConstants.TextType.A0247));
    }
    private _onNotifyMsgCmSetCampaignMapName(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }
    private _onNotifyMsgCmSetCampaignMapExtraText(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0782),
        });
    }

    private _onTouchedGroupModifyMapName(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const mapNameArray  = war.getMapNameArray();
        if (war.getIsReviewingMap()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowLangTextPanel, {
                getTitleText: () => LangUtils.getText(LangConstants.TextType.B0225),
                textArray   : mapNameArray,
            });

        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputShortLangTextPanel, {
                currentTextArray    : mapNameArray,
                maxTextLength       : GameConfigGcMap.Constants.MaxNameLength,
                callback            : async newMapNameArray => {
                    war.setMapNameArray(newMapNameArray);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapNameChanged);

                    const campaignMapData = war.getCampaignMapData();
                    if (campaignMapData != null) {
                        const campaignId    = campaignMapData.getCampaignId() ?? 0;
                        const campaignMapId = campaignMapData.getCampaignMapId() ?? 0;
                        if ((await CampaignsMainsProvider.getCampaignInfo(campaignId))?.getEnabledCampaignMapIdArray().some(v => v === campaignMapId)) {
                            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                                getContent         : () => LangUtils.getText(LangConstants.TextType.A0112),
                                callback        : () => CampaignsManagementsGateway.reqCmSetCampaignMapName(
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const mapDescArray  = war.getMapDescArray();
        if (war.getIsReviewingMap()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowLangTextPanel, {
                getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0893),
                textArray       : mapDescArray,
            });
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputLanguageTextPanel, {
                maxLength           : GameConfigGcMap.Constants.MaxDescLength,
                currentTextArray    : mapDescArray,
                isMultiline         : true,
                getTitle            : () => LangUtils.getText(LangConstants.TextType.B0893),
                callback            : async newMapDescArray => {
                    war.setMapDescArray(newMapDescArray);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapDescChanged);

                    const campaignMapData = war.getCampaignMapData();
                    if (campaignMapData != null) {
                        const campaignId    = campaignMapData.getCampaignId() ?? 0;
                        const campaignMapId = campaignMapData.getCampaignMapId() ?? 0;
                        if ((await CampaignsMainsProvider.getCampaignInfo(campaignId))?.getEnabledCampaignMapIdArray().some(v => v === campaignMapId)) {
                            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                                getContent      : () => LangUtils.getText(LangConstants.TextType.A0109),
                                callback        : () => CampaignsManagementsGateway.reqCmSetCampaignMapExtraText(
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
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

            GamePanelsManager.openPanel(GamePanelsDict.getDict().MeResizePanel, void 0);
        }
    }

    private async _onTouchedGroupModifyMapTag(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const currentGroupedMapTagId    = war.getGroupedMapTagId() ?? 0;
        if (war.getIsReviewingMap()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowMapTagIdPanel, {
                currentGroupedMapTagId  : currentGroupedMapTagId,
            });
        } else {
            const mapTag = await NormalMapModelNormalMapModel.getMapTag();
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
                availableNumberArray    : HelpersCollection.getNonNullElements(mapTag?.getMapTagDataArray().map(v => v.getIsEnabled() ? v.getMapTagId() : null) ?? []).sort((v1, v2) => v1 - v2),
                currentNumberArray      : MapTagsUtils.getDecodedMapTagIdList(currentGroupedMapTagId),
                showNumber              : true,
                getTitleText            : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.B0445)),
                getNumberMainText       : mapTagId => LangUtils.getLanguageText({ textArray: mapTag?.getMapTagDataArray().find(v => (v.getMapTagId() ?? 0) === mapTagId)?.getNameArray() }) ?? LangConstants.UndefinedError,
                callbackOnConfirm       : newMapTagIdArray => {
                    war.setGroupedMapTagId(MapTagsUtils.getEncodedMapTagId(newMapTagIdArray));
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeWarRulePanel, { war: war });
        this.closePanel();
    }

    private _onTouchedGroupModifyWarEvent(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeMainPanel, { war : war });
        this.closePanel();
    }

    private _onTouchedGroupModifyCustomCounter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeCustomCounterNameListPanel, {
            isReviewingMap  : war.getIsReviewingMap(),
            fullData        : HelpersMisc.getExisted(war.getWarEventManager().getWarEventFullData()),
        });
    }

    private _onTouchedGroupModifyTaskObjective(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeTaskObjectiveListPanel, { war: war });
    }

    private _onTouchedGroupModifyRepeatableSimpleDialogue(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeMapSimpleDialogueMainPanel, { war: war });
    }

    private _onTouchedGroupModifyTileCustomName(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeTileCustomNameListPanel, { war: war });
    }

    private _onTouchedGroupModifyUnitCustomName(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeUnitCustomNameListPanel, { war: war });
    }

    private _onTouchedBtnTilesAndUnits(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeTileUnitInfoPanel, { war: war });
        this.closePanel();
    }

    private async _onTouchedBtnSimulation(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const mapRawData    = await war.serializeForMap();
        const errorCode     = await MapsUtilsMapRawData.getErrorCode({
            mapRawData                          : mapRawData,
            allowRedundantWarEvents             : false,
            allowRedundantMapSimpleDialogues    : false,
        });
        if (errorCode) {
            FloatText2.show(LangUtils.getErrorText(errorCode));
            return;
        }

        HelpersGameFlow.checkAndCreateSimulation(mapRawData, war.getGridMarkData());
    }

    private async _onTouchedBtnFreeMode(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const mapRawData    = await war.serializeForMap();
        const errorCode     = await MapsUtilsMapRawData.getErrorCode({
            mapRawData                          : mapRawData,
            allowRedundantWarEvents             : false,
            allowRedundantMapSimpleDialogues    : false,
        });
        if (errorCode) {
            FloatText2.show(LangUtils.getErrorText(errorCode));
            return;
        }

        if (!war.getIsMapModified()) {
            HelpersGameFlow.checkAndCreateMultiFreeWar(mapRawData);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent     : () => LangUtils.getText(LangConstants.TextType.A0317),
                callback    : () => HelpersGameFlow.checkAndCreateMultiFreeWar(mapRawData),
            });
        }
    }

    private _onTouchedBtnImport(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().MeImportExportPanel, {
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().MeClearPanel, { war });
        }
    }

    private async _onTouchedBtnDeleteSlotData(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const slotIndex = war.getMapSlotIndex();
            if (await MapEditorModelMeModel.getReviewingMapSlotIndex() === slotIndex) {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0315));
                return;
            }

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0314),
                callback: () => MapEditorModelMeProxy.reqMeDeleteSlot(slotIndex),
            });
        }
    }

    private _onTouchedGroupModifyMapDesigner(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (!war.getIsReviewingMap()) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
                title           : LangUtils.getText(LangConstants.TextType.B0163),
                tips            : null,
                currentValue    : war.getMapDesignerName(),
                maxChars        : GameConfigGcMap.Constants.MaxDesignerLength,
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
        this._labelTitle.setLangText(LangConstants.TextType.B0298);
        this._labelMapNameTitle.setLangText(LangConstants.TextType.B0225);
        this._labelMapDescriptionTitle.setLangText(LangConstants.TextType.B0893);
        this._labelMapDesignerTitle.setLangText(LangConstants.TextType.B0163);
        this._labelMapSizeTitle.setLangText(LangConstants.TextType.B0300);
        this._labelMapTagTitle.setLangText(LangConstants.TextType.B0445);
        this._labelWarRuleTitle.setLangText(LangConstants.TextType.B0314);
        this._labelWarEventTitle.setLangText(LangConstants.TextType.B0461);
        this._labelCustomCounterTitle.setLangText(LangConstants.TextType.B1257);
        this._labelTaskObjectiveTitle.setLangText(LangConstants.TextType.B1214);
        this._labelRepeatableSimpleDialogueTitle.setLangText(LangConstants.TextType.B1095);
        this._labelTileCustomNameTitle.setLangText(LangConstants.TextType.B1430);
        this._labelUnitCustomNameTitle.setLangText(LangConstants.TextType.B1433);

        this._btnTilesAndUnits.setLangText(LangConstants.TextType.B1244);
        this._btnSimulation.setLangText(LangConstants.TextType.B0325);
        this._btnFreeMode.setLangText(LangConstants.TextType.B1285);
        this._btnImport.setLangText(LangConstants.TextType.B1252);
        this._btnClearMap.setLangText(LangConstants.TextType.B0391);
        this._btnDeleteSlotData.setLangText(LangConstants.TextType.B1251);
    }

    private _updateLabelMapName(): void {
        this._labelMapName.setText(LangUtils.getJoinedShortLanguageText(this.getOpenData()?.war.getMapNameArray(), 10));
    }

    private _updateLabelMapDescription(): void {
        this._labelMapDescription.setText(LangUtils.getJoinedShortLanguageText(this.getOpenData()?.war.getMapDescArray(), 10));
    }

    private _updateLabelMapDesigner(): void {
        this._labelMapDesigner.setText(this.getOpenData()?.war.getMapDesignerName() ?? LangConstants.UndefinedError);
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
        const mapTagIdArray     = groupedMapTagId == null ? null : MapTagsUtils.getDecodedMapTagIdList(groupedMapTagId);
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
