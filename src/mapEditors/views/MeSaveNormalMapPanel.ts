import {
    Utils_ClientErrorCode,
    Graphics_Constants,
    MapEditor_Model_MeHelpers,
    GamePanels_Dict,
    Maps_Utils_MapRawData,
    Lang_Utils,
    Helpers_Misc,
    NormalMap_Model_NormalMapModel,
    MapEditor_Model_MeModel,
    GamePanels_Manager,
    MapEditor_Model_MeProxy,
    NormalMap_Model_NormalMapProxy,
    FloatText,
    Lang_Constants,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { WarRuleDialogueInfo } from "../../proto/schema/CommonProto/NetMessage/MsgMmSubmitMapSimpleDialogue/WarRuleDialogueInfo.ts";
import { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { RuleAvailability } from "../../proto/schema/CommonProto/WarRule/RuleAvailability.ts";

export interface OpenData {
    war : MapEditor_Interface_IMeWar.IMeWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelReviewDescTitle!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelReviewDesc!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupCommand!             : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _groupSave!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnSave!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelpSave!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSaveAndSubmit!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelpSaveAndSubmit!     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupEventAndDialogue!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnAddWarEvent!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSubmitDialogue!        : Ui_Interfaces_IUiButton.IUiButton;

    private _mapRawData         : MapRawData | null = null;
    private _mapErrorCode       = Utils_ClientErrorCode.ClientErrorCode.NoError;
    private _canSubmitForReview = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                 callback : this._onNotifyLanguageChanged },
            { type : "MsgMmAddWarEvent",                callback : this._onNotifyMsgMmAddWarEvent },
            { type : "MsgMmSubmitMapSimpleDialogue",    callback : this._onNotifyMsgMmSubmitMapSimpleDialogue },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._btnSave,                callback : this._onTouchedBtnSave },
            { ui : this._btnHelpSave,            callback : this._onTouchedBtnHelpSave },
            { ui : this._btnSaveAndSubmit,       callback : this._onTouchedBtnSaveAndSubmit },
            { ui : this._btnHelpSaveAndSubmit,   callback : this._onTouchedBtnHelpSaveAndSubmit },

            { ui : this._btnAddWarEvent,         callback : this._onTouchedBtnAddWarEvent },
            { ui : this._btnSubmitDialogue,      callback : this._onTouchedBtnSubmitDialogue },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._btnHelpSave.setText(`?`);
        this._btnHelpSaveAndSubmit.setText(`?`);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._initDataAndUpdateGroupCommand();
    }

    private async _onTouchedBtnSave(): Promise<void> {
        const mapRawData = this._mapRawData;
        if (mapRawData == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const slotIndex                 = war.getMapSlotIndex();
        const srcNormalMapIdForAddEvent = war.getSrcNormalMapIdForAddEvent();
        const reviewingSlotIndex        = await MapEditor_Model_MeModel.getReviewingMapSlotIndex();
        if (reviewingSlotIndex === slotIndex) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0245),
                callback   : () => {
                    MapEditor_Model_MeProxy.reqMeSubmitNormalMap({
                        slotIndex                 : slotIndex,
                        mapRawData                : mapRawData,
                        needReview                : false,
                        srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                        gridMarkData              : war.getGridMarkData(),
                    });
                    this.closePanel();
                },
            });
        } else {
            MapEditor_Model_MeProxy.reqMeSubmitNormalMap({
                slotIndex                 : slotIndex,
                mapRawData                : mapRawData,
                needReview                : false,
                srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                gridMarkData              : war.getGridMarkData(),
            });
            this.closePanel();
        }
    }

    private _onTouchedBtnHelpSave(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0420),
        });
    }

    private async _onTouchedBtnAddWarEvent(): Promise<void> {
        if (!this._canSubmitForReview) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0394));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const srcNormalMapIdForAddEvent = war.getSrcNormalMapIdForAddEvent();
        if (srcNormalMapIdForAddEvent == null) {
            return;
        }

        const oldWarEventFullData       = Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(srcNormalMapIdForAddEvent)).getWarEventFullData() ?? new WarEventFullData();
        const newWarEventFullData       = war.getWarEventManager().getWarEventFullData() ?? new WarEventFullData();
        const oldActionIdSet            = new Set(oldWarEventFullData.getActionArray().map(v => Helpers_Misc.getExisted(v.getWeaCommonData()?.getActionId())));
        const incrementalActionArray    = newWarEventFullData.getActionArray().filter(v => !oldActionIdSet.has(Helpers_Misc.getExisted(v.getWeaCommonData()?.getActionId())));
        const oldEventIdSet             = new Set(oldWarEventFullData.getEventArray().map(v => v.getEventId()));
        const incrementalEventArray     = newWarEventFullData.getEventArray().filter(v => !oldEventIdSet.has(v.getEventId()));
        const oldNodeIdSet              = new Set(oldWarEventFullData.getConditionNodeArray().map(v => v.getNodeId()));
        const incrementalNodeArray      = newWarEventFullData.getConditionNodeArray().filter(v => !oldNodeIdSet.has(v.getNodeId()));
        const oldConditionIdSet         = new Set(oldWarEventFullData.getConditionArray().map(v => Helpers_Misc.getExisted(v.getWecCommonData()?.getConditionId())));
        const incrementalConditionArray = newWarEventFullData.getConditionArray().filter(v => !oldConditionIdSet.has(Helpers_Misc.getExisted(v.getWecCommonData()?.getConditionId())));
        if ((!incrementalActionArray?.length)   &&
            (!incrementalEventArray?.length)    &&
            (!incrementalNodeArray?.length)     &&
            (!incrementalConditionArray?.length)
        ) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0395));
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getFormattedText(
                Lang_Constants.TextType.F0157,
                incrementalEventArray.length,
                incrementalEventArray.length ? incrementalEventArray.map(v => `E${v.getEventId()}`).join(`, `) : `----`,
                incrementalNodeArray.length,
                incrementalNodeArray.length ? incrementalNodeArray.map(v => `N${v.getNodeId()}`).join(`, `) : `----`,
                incrementalConditionArray.length,
                incrementalConditionArray.length ? incrementalConditionArray.map(v => `C${v.getWecCommonData()?.getConditionId()}`).join(`, `) : `----`,
                incrementalActionArray.length,
                incrementalActionArray.length ? incrementalActionArray.map(v => `A${v.getWeaCommonData()?.getActionId()}`).join(`, `) : `----`,
            ),
            callback : () => {
                NormalMap_Model_NormalMapProxy.reqMmAddWarEvent(
                    srcNormalMapIdForAddEvent,
                    WarEventFullData.fromJson({
                        eventArray             : incrementalEventArray.map(v => v.toJson()),
                        actionArray            : incrementalActionArray.map(v => v.toJson()),
                        conditionArray         : incrementalConditionArray.map(v => v.toJson()),
                        conditionNodeArray     : incrementalNodeArray.map(v => v.toJson()),
                        customCounterNameArray : [],
                    }),
                );
            },
        });
    }
    private _onTouchedBtnSubmitDialogue(): void {
        if (!this._canSubmitForReview) {
            FloatText.showLang(Lang_Constants.TextType.A0394);
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const srcNormalMapIdForAddEvent = war.getSrcNormalMapIdForAddEvent();
        if (srcNormalMapIdForAddEvent == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B1100),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const mapRawData                = Helpers_Misc.getExisted(this._mapRawData);
                const warRuleDialogueInfoArray  : WarRuleDialogueInfo[] = [];
                for (const warRule of mapRawData.getTemplateWarRuleArray()) {
                    warRuleDialogueInfoArray.push(WarRuleDialogueInfo.fromJson({
                        templateWarRuleId        : warRule.getRuleId(),
                        mapSimpleDialogueIdArray : warRule.getMapSimpleDialogueIdArray(),
                    }));
                }
                NormalMap_Model_NormalMapProxy.reqMmSubmitMapSimpleDialogue(
                    srcNormalMapIdForAddEvent,
                    mapRawData.getMapSimpleDialogueArray(),
                    warRuleDialogueInfoArray,
                );
            },
        });
    }

    private async _onTouchedBtnSaveAndSubmit(): Promise<void> {
        if (!this._canSubmitForReview) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0316));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }
        if (war.getSrcNormalMapIdForAddEvent()) {
            FloatText.showLang(Lang_Constants.TextType.A0434);
            return;
        }

        const mapRawData = this._mapRawData;
        if (mapRawData == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const slotIndex                 = war.getMapSlotIndex();
        const srcNormalMapIdForAddEvent = war.getSrcNormalMapIdForAddEvent();
        const reviewingSlotIndex        = await MapEditor_Model_MeModel.getReviewingMapSlotIndex();
        if (reviewingSlotIndex === slotIndex) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0245),
                callback   : () => {
                    MapEditor_Model_MeProxy.reqMeSubmitNormalMap({
                        slotIndex                 : slotIndex,
                        mapRawData                : mapRawData,
                        needReview                : true,
                        srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                        gridMarkData              : war.getGridMarkData(),
                    });
                    this.closePanel();
                },
            });
        } else {
            if (reviewingSlotIndex == null) {
                MapEditor_Model_MeProxy.reqMeSubmitNormalMap({
                    slotIndex                 : slotIndex,
                    mapRawData                : mapRawData,
                    needReview                : true,
                    srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                    gridMarkData              : war.getGridMarkData(),
                });
                this.closePanel();
            } else {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0084),
                    callback   : () => {
                        MapEditor_Model_MeProxy.reqMeSubmitNormalMap({
                            slotIndex                 : slotIndex,
                            mapRawData                : mapRawData,
                            needReview                : true,
                            srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                            gridMarkData              : war.getGridMarkData(),
                        });
                        this.closePanel();
                    },
                });
            }
        }
    }
    private _onTouchedBtnHelpSaveAndSubmit(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0285),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgMmAddWarEvent(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.OperationSucceeded));
    }
    private _onNotifyMsgMmSubmitMapSimpleDialogue(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.OperationSucceeded));
    }

    private _updateComponentsForLanguage(): void {
        this._btnSave.setLangText(Lang_Constants.TextType.B0844);
        this._btnAddWarEvent.setLangText(Lang_Constants.TextType.B1007);
        this._btnSubmitDialogue.setLangText(Lang_Constants.TextType.B1100);
        this._btnSaveAndSubmit.setLangText(Lang_Constants.TextType.B0921);
        this._labelTitle.setLangText(Lang_Constants.TextType.B0155);
    }

    private async _initDataAndUpdateGroupCommand(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const groupCommand              = this._groupCommand;
        const srcNormalMapIdForAddEvent = war.getSrcNormalMapIdForAddEvent();
        groupCommand.removeAllItems(false);
        groupCommand.addItem(this._groupSave, false);
        (srcNormalMapIdForAddEvent != null) && (groupCommand.addItem(this._groupEventAndDialogue, false));
        groupCommand.arrangeItems();

        const mapRawData            = await war.serializeForMap();
        const criticalErrorCode     = await MapEditor_Model_MeHelpers.getCriticalErrorCodeForMapRawData(mapRawData);
        const labelReviewDescTitle  = this._labelReviewDescTitle;
        const labelReviewDesc       = this._labelReviewDesc;
        if (criticalErrorCode) {
            this._canSubmitForReview        = false;
            this._mapErrorCode              = criticalErrorCode;
            this._mapRawData                = null;
            labelReviewDescTitle.setLangText(Lang_Constants.TextType.A0433);
            labelReviewDescTitle.setTextColor(Graphics_Constants.ColorValue.Yellow);
            labelReviewDesc.setText(Lang_Utils.getErrorText(criticalErrorCode));
            return;
        }

        const errorCode     = await Maps_Utils_MapRawData.getErrorCode({
            mapRawData                       : mapRawData,
            allowRedundantWarEvents          : srcNormalMapIdForAddEvent != null,
            allowRedundantMapSimpleDialogues : srcNormalMapIdForAddEvent != null,
        });
        this._mapErrorCode  = errorCode;
        this._mapRawData    = mapRawData;
        if (mapRawData.getTemplateWarRuleArray().some(v => !checkIsValidAvailability(v.getRuleAvailability()))) {
            this._canSubmitForReview        = false;
            labelReviewDescTitle.setLangText(Lang_Constants.TextType.A0083);
            labelReviewDescTitle.setTextColor(Graphics_Constants.ColorValue.Yellow);
            labelReviewDesc.setLangText(Lang_Constants.TextType.A0298);
            return;
        }

        if (errorCode) {
            this._canSubmitForReview        = false;
            labelReviewDescTitle.setLangText(Lang_Constants.TextType.A0083);
            labelReviewDescTitle.setTextColor(Graphics_Constants.ColorValue.Yellow);
            labelReviewDesc.setText(Lang_Utils.getErrorText(errorCode));
        } else {
            this._canSubmitForReview        = true;
            labelReviewDescTitle.setLangText(Lang_Constants.TextType.A0786);
            labelReviewDescTitle.setTextColor(Graphics_Constants.ColorValue.Green);
            labelReviewDesc.setText(``);
        }
    }
}

function checkIsValidAvailability(ruleAvailability: AuxiliaryTypes_AuxiliaryTypes.Undefinable<RuleAvailability>): boolean {
    if (ruleAvailability == null) {
        return false;
    }

    return !!((ruleAvailability.getCanCcw())
        || (ruleAvailability.getCanMcw())
        || (ruleAvailability.getCanMrw())
        || (ruleAvailability.getCanSrw()));
}
