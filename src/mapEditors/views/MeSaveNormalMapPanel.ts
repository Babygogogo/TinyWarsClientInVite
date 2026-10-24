import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as MapEditorModelMeHelpers from "../../mapEditor/model/MeHelpers.ts";
import * as MapEditorModelMeModel from "../../mapEditor/model/MeModel.ts";
import * as MapEditorModelMeProxy from "../../mapEditor/model/MeProxy.ts";
import * as MapsUtilsMapRawData from "../../maps/utils/MapRawData.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NormalMapModelNormalMapProxy from "../../normalMap/model/NormalMapProxy.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import * as ProtoSchemaCommonProtoNetMessageMsgMmSubmitMapSimpleDialogueWarRuleDialogueInfo from "../../proto/schema/CommonProto/NetMessage/MsgMmSubmitMapSimpleDialogue/WarRuleDialogueInfo.ts";
import * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarRuleRuleAvailability from "../../proto/schema/CommonProto/WarRule/RuleAvailability.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

export interface OpenData {
    war : MapEditorInterfaceIMeWar.IMeWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _labelReviewDescTitle!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelReviewDesc!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupCommand!             : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupSave!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnSave!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelpSave!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSaveAndSubmit!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelpSaveAndSubmit!     : UiInterfacesIUiButton.IUiButton;

    private readonly _groupEventAndDialogue!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnAddWarEvent!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSubmitDialogue!        : UiInterfacesIUiButton.IUiButton;

    private _mapRawData         : ProtoSchemaCommonProtoMapMapRawData.MapRawData | null = null;
    private _mapErrorCode       = UtilsClientErrorCode.ClientErrorCode.NoError;
    private _canSubmitForReview = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMmAddWarEvent,                callback: this._onNotifyMsgMmAddWarEvent },
            { type: NotificationsTypeId.TypeId.MsgMmSubmitMapSimpleDialogue,    callback: this._onNotifyMsgMmSubmitMapSimpleDialogue },
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const slotIndex                 = war.getMapSlotIndex();
        const srcNormalMapIdForAddEvent = war.getSrcNormalMapIdForAddEvent();
        const reviewingSlotIndex        = await MapEditorModelMeModel.getReviewingMapSlotIndex();
        if (reviewingSlotIndex === slotIndex) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0245),
                callback: () => {
                    MapEditorModelMeProxy.reqMeSubmitNormalMap({
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
            MapEditorModelMeProxy.reqMeSubmitNormalMap({
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0420),
        });
    }

    private async _onTouchedBtnAddWarEvent(): Promise<void> {
        if (!this._canSubmitForReview) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0394));
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

        const oldWarEventFullData       = HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(srcNormalMapIdForAddEvent)).getWarEventFullData() ?? new ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData();
        const newWarEventFullData       = war.getWarEventManager().getWarEventFullData() ?? new ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData();
        const oldActionIdSet            = new Set(oldWarEventFullData.getActionArray().map(v => HelpersMisc.getExisted(v.getWeaCommonData()?.getActionId())));
        const incrementalActionArray    = newWarEventFullData.getActionArray().filter(v => !oldActionIdSet.has(HelpersMisc.getExisted(v.getWeaCommonData()?.getActionId())));
        const oldEventIdSet             = new Set(oldWarEventFullData.getEventArray().map(v => HelpersMisc.getExisted(v.getEventId())));
        const incrementalEventArray     = newWarEventFullData.getEventArray().filter(v => !oldEventIdSet.has(HelpersMisc.getExisted(v.getEventId())));
        const oldNodeIdSet              = new Set(oldWarEventFullData.getConditionNodeArray().map(v => HelpersMisc.getExisted(v.getNodeId())));
        const incrementalNodeArray      = newWarEventFullData.getConditionNodeArray().filter(v => !oldNodeIdSet.has(HelpersMisc.getExisted(v.getNodeId())));
        const oldConditionIdSet         = new Set(oldWarEventFullData.getConditionArray().map(v => HelpersMisc.getExisted(v.getWecCommonData()?.getConditionId())));
        const incrementalConditionArray = newWarEventFullData.getConditionArray().filter(v => !oldConditionIdSet.has(HelpersMisc.getExisted(v.getWecCommonData()?.getConditionId())));
        if ((!incrementalActionArray?.length)   &&
            (!incrementalEventArray?.length)    &&
            (!incrementalNodeArray?.length)     &&
            (!incrementalConditionArray?.length)
        ) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0395));
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getFormattedText(
                LangConstants.TextType.F0157,
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
                NormalMapModelNormalMapProxy.reqMmAddWarEvent(
                    srcNormalMapIdForAddEvent,
                    ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData.fromJson({
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
            FloatText2.showLang(LangConstants.TextType.A0394);
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle       : () => LangUtils.getText(LangConstants.TextType.B1100),
            getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                const mapRawData                = HelpersMisc.getExisted(this._mapRawData);
                const warRuleDialogueInfoArray  : ProtoSchemaCommonProtoNetMessageMsgMmSubmitMapSimpleDialogueWarRuleDialogueInfo.WarRuleDialogueInfo[] = [];
                for (const warRule of mapRawData.getTemplateWarRuleArray()) {
                    warRuleDialogueInfoArray.push(ProtoSchemaCommonProtoNetMessageMsgMmSubmitMapSimpleDialogueWarRuleDialogueInfo.WarRuleDialogueInfo.fromJson({
                        templateWarRuleId           : warRule.getRuleId() ?? 0,
                        mapSimpleDialogueIdArray    : warRule.getMapSimpleDialogueIdArray(),
                    }));
                }
                NormalMapModelNormalMapProxy.reqMmSubmitMapSimpleDialogue(
                    srcNormalMapIdForAddEvent,
                    mapRawData.getMapSimpleDialogueArray(),
                    warRuleDialogueInfoArray,
                );
            },
        });
    }

    private async _onTouchedBtnSaveAndSubmit(): Promise<void> {
        if (!this._canSubmitForReview) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0316));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }
        if (war.getSrcNormalMapIdForAddEvent()) {
            FloatText2.showLang(LangConstants.TextType.A0434);
            return;
        }

        const mapRawData = this._mapRawData;
        if (mapRawData == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const slotIndex                 = war.getMapSlotIndex();
        const srcNormalMapIdForAddEvent = war.getSrcNormalMapIdForAddEvent();
        const reviewingSlotIndex        = await MapEditorModelMeModel.getReviewingMapSlotIndex();
        if (reviewingSlotIndex === slotIndex) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0245),
                callback: () => {
                    MapEditorModelMeProxy.reqMeSubmitNormalMap({
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
                MapEditorModelMeProxy.reqMeSubmitNormalMap({
                    slotIndex                   : slotIndex,
                    mapRawData                  : mapRawData,
                    needReview                  : true,
                    srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                    gridMarkData                : war.getGridMarkData(),
                });
                this.closePanel();
            } else {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getContent : () => LangUtils.getText(LangConstants.TextType.A0084),
                    callback: () => {
                        MapEditorModelMeProxy.reqMeSubmitNormalMap({
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0285),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgMmAddWarEvent(): void {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.OperationSucceeded));
    }
    private _onNotifyMsgMmSubmitMapSimpleDialogue(): void {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.OperationSucceeded));
    }

    private _updateComponentsForLanguage(): void {
        this._btnSave.setText(LangUtils.getText(LangConstants.TextType.B0844));
        this._btnAddWarEvent.setText(LangUtils.getText(LangConstants.TextType.B1007));
        this._btnSubmitDialogue.setText(LangUtils.getText(LangConstants.TextType.B1100));
        this._btnSaveAndSubmit.setText(LangUtils.getText(LangConstants.TextType.B0921));
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0155));
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
        const criticalErrorCode     = await MapEditorModelMeHelpers.getCriticalErrorCodeForMapRawData(mapRawData);
        const labelReviewDescTitle  = this._labelReviewDescTitle;
        const labelReviewDesc       = this._labelReviewDesc;
        if (criticalErrorCode) {
            this._canSubmitForReview        = false;
            this._mapErrorCode              = criticalErrorCode;
            this._mapRawData                = null;
            labelReviewDescTitle.setText(LangUtils.getText(LangConstants.TextType.A0433));
            labelReviewDescTitle.setTextColor(GraphicsConstants.ColorValue.Yellow);
            labelReviewDesc.setText(LangUtils.getErrorText(criticalErrorCode));
            return;
        }

        const errorCode     = await MapsUtilsMapRawData.getErrorCode({
            mapRawData                          : mapRawData,
            allowRedundantWarEvents             : srcNormalMapIdForAddEvent != null,
            allowRedundantMapSimpleDialogues    : srcNormalMapIdForAddEvent != null,
        });
        this._mapErrorCode  = errorCode;
        this._mapRawData    = mapRawData;
        if (mapRawData.getTemplateWarRuleArray().some(v => !checkIsValidAvailability(v.getRuleAvailability()))) {
            this._canSubmitForReview        = false;
            labelReviewDescTitle.setText(LangUtils.getText(LangConstants.TextType.A0083));
            labelReviewDescTitle.setTextColor(GraphicsConstants.ColorValue.Yellow);
            labelReviewDesc.setText(LangUtils.getText(LangConstants.TextType.A0298));
            return;
        }

        if (errorCode) {
            this._canSubmitForReview        = false;
            labelReviewDescTitle.setText(LangUtils.getText(LangConstants.TextType.A0083));
            labelReviewDescTitle.setTextColor(GraphicsConstants.ColorValue.Yellow);
            labelReviewDesc.setText(LangUtils.getErrorText(errorCode));
        } else {
            this._canSubmitForReview        = true;
            labelReviewDescTitle.setText(LangUtils.getText(LangConstants.TextType.A0786));
            labelReviewDescTitle.setTextColor(GraphicsConstants.ColorValue.Green);
            labelReviewDesc.setText(``);
        }
    }
}

function checkIsValidAvailability(ruleAvailability: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarRuleRuleAvailability.RuleAvailability>): boolean {
    if (ruleAvailability == null) {
        return false;
    }

    return !!((ruleAvailability.getCanCcw())
        || (ruleAvailability.getCanMcw())
        || (ruleAvailability.getCanMrw())
        || (ruleAvailability.getCanSrw()));
}
