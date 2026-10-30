import { getCampaignInfo } from "../../campaigns/mains/Provider.ts";
import {
    reqCmSetCampaignMapName,
    reqCmSetCampaignMapExtraText,
} from "../../campaigns/managements/Gateway.ts";
import {
    show,
    showLang,
} from "../../FloatText.ts";
import { Common } from "../../maps/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import {
    checkAndCreateSimulation,
    checkAndCreateMultiFreeWar,
} from "../../helpers/GameFlow.ts";
import { getExisted } from "../../helpers/Misc.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
    getLanguageText,
    getErrorText,
    getJoinedShortLanguageText,
} from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { getReviewingMapSlotIndex } from "../../mapEditor/model/MeModel.ts";
import { reqMeDeleteSlot } from "../../mapEditor/model/MeProxy.ts";
import { getErrorCode } from "../../maps/utils/MapRawData.ts";
import {
    getDecodedMapTagIdList,
    getEncodedMapTagId,
} from "../../mapTags/Utils.ts";
import { getMapTag } from "../../normalMap/model/NormalMapModel.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as UserSetMapEditorAutoSaveTimeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgUserSetMapEditorAutoSaveTime/S.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { Event } from "../../egret/Egret.ts";

export interface OpenData {
    war     : IMeWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                              : IUiImage;
    private readonly _group!                                : IUiContainer;
    private readonly _labelTitle!                           : IUiLabel;
    private readonly _btnClose!                             : IUiButton;
    private readonly _btnHelp!                              : IUiButton;

    private readonly _labelMapNameTitle!                    : IUiLabel;
    private readonly _groupModifyMapName!                   : IUiContainer;
    private readonly _labelMapName!                         : IUiLabel;

    private readonly _labelMapDescriptionTitle!             : IUiLabel;
    private readonly _groupModifyMapDescription!            : IUiContainer;
    private readonly _labelMapDescription!                  : IUiLabel;

    private readonly _labelMapDesignerTitle!                : IUiLabel;
    private readonly _groupModifyMapDesigner!               : IUiContainer;
    private readonly _labelMapDesigner!                     : IUiLabel;

    private readonly _labelMapSizeTitle!                    : IUiLabel;
    private readonly _groupModifyMapSize!                   : IUiContainer;
    private readonly _labelMapSize!                         : IUiLabel;

    private readonly _labelMapTagTitle!                     : IUiLabel;
    private readonly _groupModifyMapTag!                    : IUiContainer;
    private readonly _labelMapTag!                          : IUiLabel;

    private readonly _labelWarRuleTitle!                    : IUiLabel;
    private readonly _groupModifyWarRule!                   : IUiContainer;
    private readonly _labelWarRule!                         : IUiLabel;

    private readonly _labelWarEventTitle!                   : IUiLabel;
    private readonly _groupModifyWarEvent!                  : IUiContainer;
    private readonly _labelWarEvent!                        : IUiLabel;

    private readonly _labelCustomCounterTitle!              : IUiLabel;
    private readonly _groupModifyCustomCounter!             : IUiContainer;
    private readonly _labelCustomCounter!                   : IUiLabel;

    private readonly _labelTaskObjectiveTitle!              : IUiLabel;
    private readonly _groupModifyTaskObjective!             : IUiContainer;
    private readonly _labelTaskObjective!                   : IUiLabel;

    private readonly _labelRepeatableSimpleDialogueTitle!   : IUiLabel;
    private readonly _groupModifyRepeatableSimpleDialogue!  : IUiContainer;
    private readonly _labelRepeatableSimpleDialogue!        : IUiLabel;

    private readonly _labelTileCustomNameTitle!             : IUiLabel;
    private readonly _groupModifyTileCustomName!            : IUiContainer;
    private readonly _labelTileCustomName!                  : IUiLabel;

    private readonly _labelUnitCustomNameTitle!             : IUiLabel;
    private readonly _groupModifyUnitCustomName!            : IUiContainer;
    private readonly _labelUnitCustomName!                  : IUiLabel;

    private readonly _btnTilesAndUnits!                     : IUiButton;
    private readonly _btnSimulation!                        : IUiButton;
    private readonly _btnFreeMode!                          : IUiButton;
    private readonly _btnImport!                            : IUiButton;
    private readonly _btnClearMap!                          : IUiButton;
    private readonly _btnDeleteSlotData!                    : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.UnitAndTileTextureVersionChanged,    callback: this._onNotifyUnitAndTileTextureVersionChanged },
            { type: TypeId.MeMapNameChanged,                    callback: this._onNotifyMeMapNameChanged },
            { type: TypeId.MeMapCleared,                        callback: this._onNotifyMeMapCleared },
            { type: TypeId.MeMapSizeChanged,                    callback: this._onNotifyMeMapSizeChanged },
            { type: TypeId.MeMapDescChanged,                    callback: this._onNotifyMeMapDescChanged },
            { type: TypeId.WarEventFullDataChanged,             callback: this._onNotifyWarEventFullDataChanged },
            { type: TypeId.MeTaskObjectiveFullDataChanged,      callback: this._onNotifyMeTaskObjectiveFullDataChanged },
            { type: TypeId.MeMapSimpleDialogueChanged,          callback: this._onNotifyMeMapSimpleDialogueChanged },
            { type: TypeId.BwTileCustomNameArrayChanged,        callback: this._onNotifyBwTileCustomNameArrayChanged },
            { type: TypeId.BwUnitCustomNameArrayChanged,        callback: this._onNotifyBwUnitCustomNameArrayChanged },
            { type: TypeId.MsgUserSetMapEditorAutoSaveTime,     callback: this._onNotifyMsgUserSetMapEditorAutoSaveTime },
            { type: TypeId.MsgCmSetCampaignMapName,             callback: this._onNotifyMsgCmSetCampaignMapName },
            { type: TypeId.MsgCmSetCampaignMapExtraText,        callback: this._onNotifyMsgCmSetCampaignMapExtraText },
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
    private _onNotifyMsgUserSetMapEditorAutoSaveTime(e: Event): void {
        const data = e.data as UserSetMapEditorAutoSaveTimeResponse;
        show(getText(data.getTime() == null ? TextType.A0248 : TextType.A0247));
    }
    private _onNotifyMsgCmSetCampaignMapName(): void {
        showLang(TextType.OperationSucceeded);
    }
    private _onNotifyMsgCmSetCampaignMapExtraText(): void {
        showLang(TextType.OperationSucceeded);
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
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0782),
        });
    }

    private _onTouchedGroupModifyMapName(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const mapNameArray  = war.getMapNameArray();
        if (war.getIsReviewingMap()) {
            openPanel(getDict().CommonShowLangTextPanel, {
                getTitleText: () => getText(TextType.B0225),
                textArray   : mapNameArray,
            });

        } else {
            openPanel(getDict().CommonInputShortLangTextPanel, {
                currentTextArray    : mapNameArray,
                maxTextLength       : Common.MaxNameLength,
                callback            : async newMapNameArray => {
                    war.setMapNameArray(newMapNameArray);
                    dispatch(TypeId.MeMapNameChanged);

                    const campaignMapData = war.getCampaignMapData();
                    if (campaignMapData != null) {
                        const campaignId    = campaignMapData.getCampaignId();
                        const campaignMapId = campaignMapData.getCampaignMapId();
                        if ((await getCampaignInfo(campaignId))?.getEnabledCampaignMapIdArray().some(v => v === campaignMapId)) {
                            openPanel(getDict().CommonConfirmPanel, {
                                getContent         : () => getText(TextType.A0112),
                                callback        : () => reqCmSetCampaignMapName(
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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const mapDescArray  = war.getMapDescArray();
        if (war.getIsReviewingMap()) {
            openPanel(getDict().CommonShowLangTextPanel, {
                getTitleText    : () => getText(TextType.B0893),
                textArray       : mapDescArray,
            });
        } else {
            openPanel(getDict().CommonInputLanguageTextPanel, {
                maxLength           : Common.MaxDescLength,
                currentTextArray    : mapDescArray,
                isMultiline         : true,
                getTitle            : () => getText(TextType.B0893),
                callback            : async newMapDescArray => {
                    war.setMapDescArray(newMapDescArray);
                    dispatch(TypeId.MeMapDescChanged);

                    const campaignMapData = war.getCampaignMapData();
                    if (campaignMapData != null) {
                        const campaignId    = campaignMapData.getCampaignId();
                        const campaignMapId = campaignMapData.getCampaignMapId();
                        if ((await getCampaignInfo(campaignId))?.getEnabledCampaignMapIdArray().some(v => v === campaignMapId)) {
                            openPanel(getDict().CommonConfirmPanel, {
                                getContent      : () => getText(TextType.A0109),
                                callback        : () => reqCmSetCampaignMapExtraText(
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
            playShortSfx(ShortSfxCode.ButtonNeutral01);

            openPanel(getDict().MeResizePanel, void 0);
        }
    }

    private async _onTouchedGroupModifyMapTag(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const currentGroupedMapTagId    = war.getGroupedMapTagId() ?? 0;
        if (war.getIsReviewingMap()) {
            openPanel(getDict().CommonShowMapTagIdPanel, {
                currentGroupedMapTagId  : currentGroupedMapTagId,
            });
        } else {
            const mapTag = await getMapTag();
            openPanel(getDict().CommonChooseMultiNumberPanel, {
                availableNumberArray    : getNonNullElements(mapTag?.getMapTagDataArray().map(v => v.getIsEnabled() ? v.getMapTagId() : null) ?? []).sort((v1, v2) => v1 - v2),
                currentNumberArray      : getDecodedMapTagIdList(currentGroupedMapTagId),
                showNumber              : true,
                getTitleText            : () => getFormattedText(TextType.F0092, getText(TextType.B0445)),
                getNumberMainText       : mapTagId => getLanguageText({ textArray: mapTag?.getMapTagDataArray().find(v => (v.getMapTagId()) === mapTagId)?.getNameArray() }) ?? UndefinedError,
                callbackOnConfirm       : newMapTagIdArray => {
                    war.setGroupedMapTagId(getEncodedMapTagId(newMapTagIdArray));
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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().MeWarRulePanel, { war: war });
        this.closePanel();
    }

    private _onTouchedGroupModifyWarEvent(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().WeMainPanel, { war : war });
        this.closePanel();
    }

    private _onTouchedGroupModifyCustomCounter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().WeCustomCounterNameListPanel, {
            isReviewingMap  : war.getIsReviewingMap(),
            fullData        : getExisted(war.getWarEventManager().getWarEventFullData()),
        });
    }

    private _onTouchedGroupModifyTaskObjective(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().MeTaskObjectiveListPanel, { war: war });
    }

    private _onTouchedGroupModifyRepeatableSimpleDialogue(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().MeMapSimpleDialogueMainPanel, { war: war });
    }

    private _onTouchedGroupModifyTileCustomName(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().MeTileCustomNameListPanel, { war: war });
    }

    private _onTouchedGroupModifyUnitCustomName(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().MeUnitCustomNameListPanel, { war: war });
    }

    private _onTouchedBtnTilesAndUnits(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().MeTileUnitInfoPanel, { war: war });
        this.closePanel();
    }

    private async _onTouchedBtnSimulation(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const mapRawData    = await war.serializeForMap();
        const errorCode     = await getErrorCode({
            mapRawData                          : mapRawData,
            allowRedundantWarEvents             : false,
            allowRedundantMapSimpleDialogues    : false,
        });
        if (errorCode) {
            show(getErrorText(errorCode));
            return;
        }

        checkAndCreateSimulation(mapRawData, war.getGridMarkData());
    }

    private async _onTouchedBtnFreeMode(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const mapRawData    = await war.serializeForMap();
        const errorCode     = await getErrorCode({
            mapRawData                          : mapRawData,
            allowRedundantWarEvents             : false,
            allowRedundantMapSimpleDialogues    : false,
        });
        if (errorCode) {
            show(getErrorText(errorCode));
            return;
        }

        if (!war.getIsMapModified()) {
            checkAndCreateMultiFreeWar(mapRawData);
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent     : () => getText(TextType.A0317),
                callback    : () => checkAndCreateMultiFreeWar(mapRawData),
            });
        }
    }

    private _onTouchedBtnImport(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            openPanel(getDict().MeImportExportPanel, {
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
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            openPanel(getDict().MeClearPanel, { war });
        }
    }

    private async _onTouchedBtnDeleteSlotData(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const slotIndex = war.getMapSlotIndex();
            if (await getReviewingMapSlotIndex() === slotIndex) {
                show(getText(TextType.A0315));
                return;
            }

            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.A0314),
                callback: () => reqMeDeleteSlot(slotIndex),
            });
        }
    }

    private _onTouchedGroupModifyMapDesigner(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (!war.getIsReviewingMap()) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);

            openPanel(getDict().CommonInputPanel, {
                title           : getText(TextType.B0163),
                tips            : null,
                currentValue    : war.getMapDesignerName(),
                maxChars        : Common.MaxDesignerLength,
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
        this._labelTitle.setLangText(TextType.B0298);
        this._labelMapNameTitle.setLangText(TextType.B0225);
        this._labelMapDescriptionTitle.setLangText(TextType.B0893);
        this._labelMapDesignerTitle.setLangText(TextType.B0163);
        this._labelMapSizeTitle.setLangText(TextType.B0300);
        this._labelMapTagTitle.setLangText(TextType.B0445);
        this._labelWarRuleTitle.setLangText(TextType.B0314);
        this._labelWarEventTitle.setLangText(TextType.B0461);
        this._labelCustomCounterTitle.setLangText(TextType.B1257);
        this._labelTaskObjectiveTitle.setLangText(TextType.B1214);
        this._labelRepeatableSimpleDialogueTitle.setLangText(TextType.B1095);
        this._labelTileCustomNameTitle.setLangText(TextType.B1430);
        this._labelUnitCustomNameTitle.setLangText(TextType.B1433);

        this._btnTilesAndUnits.setLangText(TextType.B1244);
        this._btnSimulation.setLangText(TextType.B0325);
        this._btnFreeMode.setLangText(TextType.B1285);
        this._btnImport.setLangText(TextType.B1252);
        this._btnClearMap.setLangText(TextType.B0391);
        this._btnDeleteSlotData.setLangText(TextType.B1251);
    }

    private _updateLabelMapName(): void {
        this._labelMapName.setText(getJoinedShortLanguageText(this.getOpenData()?.war.getMapNameArray(), 10));
    }

    private _updateLabelMapDescription(): void {
        this._labelMapDescription.setText(getJoinedShortLanguageText(this.getOpenData()?.war.getMapDescArray(), 10));
    }

    private _updateLabelMapDesigner(): void {
        this._labelMapDesigner.setText(this.getOpenData()?.war.getMapDesignerName() ?? UndefinedError);
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
        const mapTagIdArray     = groupedMapTagId == null ? null : getDecodedMapTagIdList(groupedMapTagId);
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
