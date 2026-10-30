import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import {
    showLang,
    show,
} from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
    getErrorText,
} from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { getCriticalErrorCodeForMapRawData } from "../../mapEditor/model/MeHelpers.ts";
import { getReviewingMapSlotIndex } from "../../mapEditor/model/MeModel.ts";
import { reqMeSubmitNormalMap } from "../../mapEditor/model/MeProxy.ts";
import { getErrorCode } from "../../maps/utils/MapRawData.ts";
import { getRawData } from "../../normalMap/model/NormalMapModel.ts";
import {
    reqMmAddWarEvent,
    reqMmSubmitMapSimpleDialogue,
} from "../../normalMap/model/NormalMapProxy.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { WarRuleDialogueInfo } from "../../proto/schema/CommonProto/NetMessage/MsgMmSubmitMapSimpleDialogue/WarRuleDialogueInfo.ts";
import { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { RuleAvailability } from "../../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export interface OpenData {
    war : IMeWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnClose!                 : IUiButton;

    private readonly _labelReviewDescTitle!     : IUiLabel;
    private readonly _labelReviewDesc!          : IUiLabel;
    private readonly _groupCommand!             : IUiLayout;

    private readonly _groupSave!                : IUiContainer;
    private readonly _btnSave!                  : IUiButton;
    private readonly _btnHelpSave!              : IUiButton;
    private readonly _btnSaveAndSubmit!         : IUiButton;
    private readonly _btnHelpSaveAndSubmit!     : IUiButton;

    private readonly _groupEventAndDialogue!    : IUiContainer;
    private readonly _btnAddWarEvent!           : IUiButton;
    private readonly _btnSubmitDialogue!        : IUiButton;

    private _mapRawData         : MapRawData | null = null;
    private _mapErrorCode       = ClientErrorCode.NoError;
    private _canSubmitForReview = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgMmAddWarEvent,                callback: this._onNotifyMsgMmAddWarEvent },
            { type: TypeId.MsgMmSubmitMapSimpleDialogue,    callback: this._onNotifyMsgMmSubmitMapSimpleDialogue },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel, },
            { ui: this._btnSave,                callback: this._onTouchedBtnSave, },
            { ui: this._btnHelpSave,            callback: this._onTouchedBtnHelpSave },
            { ui: this._btnSaveAndSubmit,       callback: this._onTouchedBtnSaveAndSubmit },
            { ui: this._btnHelpSaveAndSubmit,   callback: this._onTouchedBtnHelpSaveAndSubmit },

            { ui: this._btnAddWarEvent,         callback: this._onTouchedBtnAddWarEvent },
            { ui: this._btnSubmitDialogue,      callback: this._onTouchedBtnSubmitDialogue },
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
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const slotIndex                 = war.getMapSlotIndex();
        const srcNormalMapIdForAddEvent = war.getSrcNormalMapIdForAddEvent();
        const reviewingSlotIndex        = await getReviewingMapSlotIndex();
        if (reviewingSlotIndex === slotIndex) {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.A0245),
                callback: () => {
                    reqMeSubmitNormalMap({
                        slotIndex                   : slotIndex,
                        mapRawData                  : mapRawData,
                        needReview                  : false,
                        srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                        gridMarkData                : war.getGridMarkData(),
                    });
                    this.closePanel();
                },
            });
        } else {
            reqMeSubmitNormalMap({
                slotIndex                   : slotIndex,
                mapRawData                  : mapRawData,
                needReview                  : false,
                srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                gridMarkData                : war.getGridMarkData(),
            });
            this.closePanel();
        }
    }

    private _onTouchedBtnHelpSave(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0420),
        });
    }

    private async _onTouchedBtnAddWarEvent(): Promise<void> {
        if (!this._canSubmitForReview) {
            show(getText(TextType.A0394));
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

        const oldWarEventFullData       = getExisted(await getRawData(srcNormalMapIdForAddEvent)).getWarEventFullData() ?? new WarEventFullData();
        const newWarEventFullData       = war.getWarEventManager().getWarEventFullData() ?? new WarEventFullData();
        const oldActionIdSet            = new Set(oldWarEventFullData.getActionArray().map(v => getExisted(v.getWeaCommonData()?.getActionId())));
        const incrementalActionArray    = newWarEventFullData.getActionArray().filter(v => !oldActionIdSet.has(getExisted(v.getWeaCommonData()?.getActionId())));
        const oldEventIdSet             = new Set(oldWarEventFullData.getEventArray().map(v => v.getEventId()));
        const incrementalEventArray     = newWarEventFullData.getEventArray().filter(v => !oldEventIdSet.has(v.getEventId()));
        const oldNodeIdSet              = new Set(oldWarEventFullData.getConditionNodeArray().map(v => v.getNodeId()));
        const incrementalNodeArray      = newWarEventFullData.getConditionNodeArray().filter(v => !oldNodeIdSet.has(v.getNodeId()));
        const oldConditionIdSet         = new Set(oldWarEventFullData.getConditionArray().map(v => getExisted(v.getWecCommonData()?.getConditionId())));
        const incrementalConditionArray = newWarEventFullData.getConditionArray().filter(v => !oldConditionIdSet.has(getExisted(v.getWecCommonData()?.getConditionId())));
        if ((!incrementalActionArray?.length)   &&
            (!incrementalEventArray?.length)    &&
            (!incrementalNodeArray?.length)     &&
            (!incrementalConditionArray?.length)
        ) {
            show(getText(TextType.A0395));
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getFormattedText(
                TextType.F0157,
                incrementalEventArray.length,
                incrementalEventArray.length ? incrementalEventArray.map(v => `E${v.getEventId()}`).join(`, `) : `----`,
                incrementalNodeArray.length,
                incrementalNodeArray.length ? incrementalNodeArray.map(v => `N${v.getNodeId()}`).join(`, `) : `----`,
                incrementalConditionArray.length,
                incrementalConditionArray.length ? incrementalConditionArray.map(v => `C${v.getWecCommonData()?.getConditionId()}`).join(`, `) : `----`,
                incrementalActionArray.length,
                incrementalActionArray.length ? incrementalActionArray.map(v => `A${v.getWeaCommonData()?.getActionId()}`).join(`, `) : `----`,
            ),
            callback    : () => {
                reqMmAddWarEvent(
                    srcNormalMapIdForAddEvent,
                    WarEventFullData.fromJson({
                        eventArray              : incrementalEventArray.map(v => v.toJson()),
                        actionArray             : incrementalActionArray.map(v => v.toJson()),
                        conditionArray          : incrementalConditionArray.map(v => v.toJson()),
                        conditionNodeArray      : incrementalNodeArray.map(v => v.toJson()),
                        customCounterNameArray  : [],
                    })
                );
            },
        });
    }
    private _onTouchedBtnSubmitDialogue(): void {
        if (!this._canSubmitForReview) {
            showLang(TextType.A0394);
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

        openPanel(getDict().CommonConfirmPanel, {
            getTitle       : () => getText(TextType.B1100),
            getContent     : () => getText(TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                const mapRawData                = getExisted(this._mapRawData);
                const warRuleDialogueInfoArray  : WarRuleDialogueInfo[] = [];
                for (const warRule of mapRawData.getTemplateWarRuleArray()) {
                    warRuleDialogueInfoArray.push(WarRuleDialogueInfo.fromJson({
                        templateWarRuleId           : warRule.getRuleId(),
                        mapSimpleDialogueIdArray    : warRule.getMapSimpleDialogueIdArray(),
                    }));
                }
                reqMmSubmitMapSimpleDialogue(
                    srcNormalMapIdForAddEvent,
                    mapRawData.getMapSimpleDialogueArray(),
                    warRuleDialogueInfoArray,
                );
            },
        });
    }

    private async _onTouchedBtnSaveAndSubmit(): Promise<void> {
        if (!this._canSubmitForReview) {
            show(getText(TextType.A0316));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }
        if (war.getSrcNormalMapIdForAddEvent()) {
            showLang(TextType.A0434);
            return;
        }

        const mapRawData = this._mapRawData;
        if (mapRawData == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const slotIndex                 = war.getMapSlotIndex();
        const srcNormalMapIdForAddEvent = war.getSrcNormalMapIdForAddEvent();
        const reviewingSlotIndex        = await getReviewingMapSlotIndex();
        if (reviewingSlotIndex === slotIndex) {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.A0245),
                callback: () => {
                    reqMeSubmitNormalMap({
                        slotIndex                   : slotIndex,
                        mapRawData                  : mapRawData,
                        needReview                  : true,
                        srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                        gridMarkData                : war.getGridMarkData(),
                    });
                    this.closePanel();
                },
            });
        } else {
            if (reviewingSlotIndex == null) {
                reqMeSubmitNormalMap({
                    slotIndex                   : slotIndex,
                    mapRawData                  : mapRawData,
                    needReview                  : true,
                    srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                    gridMarkData                : war.getGridMarkData(),
                });
                this.closePanel();
            } else {
                openPanel(getDict().CommonConfirmPanel, {
                    getContent : () => getText(TextType.A0084),
                    callback: () => {
                        reqMeSubmitNormalMap({
                            slotIndex                   : slotIndex,
                            mapRawData                  : mapRawData,
                            needReview                  : true,
                            srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                            gridMarkData                : war.getGridMarkData(),
                        });
                        this.closePanel();
                    },
                });
            }
        }
    }
    private _onTouchedBtnHelpSaveAndSubmit(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0285),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgMmAddWarEvent(): void {
        show(getText(TextType.OperationSucceeded));
    }
    private _onNotifyMsgMmSubmitMapSimpleDialogue(): void {
        show(getText(TextType.OperationSucceeded));
    }

    private _updateComponentsForLanguage(): void {
        this._btnSave.setLangText(TextType.B0844);
        this._btnAddWarEvent.setLangText(TextType.B1007);
        this._btnSubmitDialogue.setLangText(TextType.B1100);
        this._btnSaveAndSubmit.setLangText(TextType.B0921);
        this._labelTitle.setLangText(TextType.B0155);
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
        const criticalErrorCode     = await getCriticalErrorCodeForMapRawData(mapRawData);
        const labelReviewDescTitle  = this._labelReviewDescTitle;
        const labelReviewDesc       = this._labelReviewDesc;
        if (criticalErrorCode) {
            this._canSubmitForReview        = false;
            this._mapErrorCode              = criticalErrorCode;
            this._mapRawData                = null;
            labelReviewDescTitle.setLangText(TextType.A0433);
            labelReviewDescTitle.setTextColor(ColorValue.Yellow);
            labelReviewDesc.setText(getErrorText(criticalErrorCode));
            return;
        }

        const errorCode     = await getErrorCode({
            mapRawData                          : mapRawData,
            allowRedundantWarEvents             : srcNormalMapIdForAddEvent != null,
            allowRedundantMapSimpleDialogues    : srcNormalMapIdForAddEvent != null,
        });
        this._mapErrorCode  = errorCode;
        this._mapRawData    = mapRawData;
        if (mapRawData.getTemplateWarRuleArray().some(v => !checkIsValidAvailability(v.getRuleAvailability()))) {
            this._canSubmitForReview        = false;
            labelReviewDescTitle.setLangText(TextType.A0083);
            labelReviewDescTitle.setTextColor(ColorValue.Yellow);
            labelReviewDesc.setLangText(TextType.A0298);
            return;
        }

        if (errorCode) {
            this._canSubmitForReview        = false;
            labelReviewDescTitle.setLangText(TextType.A0083);
            labelReviewDescTitle.setTextColor(ColorValue.Yellow);
            labelReviewDesc.setText(getErrorText(errorCode));
        } else {
            this._canSubmitForReview        = true;
            labelReviewDescTitle.setLangText(TextType.A0786);
            labelReviewDescTitle.setTextColor(ColorValue.Green);
            labelReviewDesc.setText(``);
        }
    }
}

function checkIsValidAvailability(ruleAvailability: Undefinable<RuleAvailability>): boolean {
    if (ruleAvailability == null) {
        return false;
    }

    return !!((ruleAvailability.getCanCcw())
        || (ruleAvailability.getCanMcw())
        || (ruleAvailability.getCanMrw())
        || (ruleAvailability.getCanSrw()));
}
