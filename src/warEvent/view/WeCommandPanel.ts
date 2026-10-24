import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as CampaignsMainsProvider from "../../campaigns/mains/Provider.ts";
import * as CampaignsManagementsGateway from "../../campaigns/managements/Gateway.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoWarEventConditionIdAndFlags from "../../proto/schema/CommonProto/WarEvent/ConditionIdAndFlags.ts";
import * as ProtoSchemaCommonProtoWarEventConditionNodeAndActions from "../../proto/schema/CommonProto/WarEvent/ConditionNodeAndActions.ts";
import * as ProtoSchemaCommonProtoWarEventNodeIdAndFlags from "../../proto/schema/CommonProto/WarEvent/NodeIdAndFlags.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import * as ProtoSchemaCommonProtoWarEventWarEventConditionNode from "../../proto/schema/CommonProto/WarEvent/WarEventConditionNode.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarEventsActionsConstantsCommon from "../../warEvents/actions/constants/Common.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";
import * as WarEventsConditionNodesUtils from "../../warEvents/conditionNodes/Utils.ts";
import * as WarEventsConditionsUtilsCommon from "../../warEvents/conditions/utils/Common.ts";
import * as WarEventsConstants from "../../warEvents/Constants.ts";
import * as WarEventsEventsUtils from "../../warEvents/events/Utils.ts";
import * as WarEventsFullDatasUtils from "../../warEvents/fullDatas/Utils.ts";

type WarEventFullData           = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventAction             = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;

export interface OpenData {
    war                 : MapEditorInterfaceIMeWar.IMeWar;
    descType            : WarEventsConstants.DescType;
    eventId             : number;
    actionId?           : number;
    actionIndex?        : number;
    actionBoundNodeId?  : number;
    conditionId?        : number;
    parentNodeId?       : number;
    nodeId?             : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutError!                  : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupBtn!                     : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnModifyEventName!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnModifyMaxCallCountPerTurn! : UiInterfacesIUiButton.IUiButton;
    private readonly _btnModifyMaxCallCountTotal!   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnInitSubNodeToEvent!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnShallowCloneEvent!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeepCloneEvent!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteEvent!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNegateRootNode!            : UiInterfacesIUiButton.IUiButton;

    private readonly _btnRenameNode!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSwitchNodeAndOr!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSwitchNodeTrueFalse!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnReplaceNode!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAddSubNodeToNode!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAddSubCondition!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnShallowCloneNode!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeepCloneNode!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMoveUpNode!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteNode!                : UiInterfacesIUiButton.IUiButton;

    private readonly _btnRenameCondition!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnModifyCondition!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnReplaceCondition!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeepCloneCondition!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMoveUpCondition!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteCondition!           : UiInterfacesIUiButton.IUiButton;

    private readonly _btnRenameAction!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnModifyAction!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnReplaceAction!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAddAction!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeepCloneAction!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnShallowCloneAction!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteAction!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMoveUpAction!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnUpdateCampaignAction!      : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                       callback: this.closePanel },
            { ui: this._btnModifyEventName,             callback: this._onTouchedBtnModifyEventName },
            { ui: this._btnModifyMaxCallCountPerTurn,   callback: this._onTouchedBtnModifyMaxCallCountPerTurn },
            { ui: this._btnModifyMaxCallCountTotal,     callback: this._onTouchedBtnModifyMaxCallCountTotal },
            { ui: this._btnInitSubNodeToEvent,          callback: this._onTouchedBtnInitSubNodeToEvent },
            { ui: this._btnShallowCloneEvent,           callback: this._onTouchedBtnShallowCloneEvent },
            { ui: this._btnDeepCloneEvent,              callback: this._onTouchedBtnDeepCloneEvent },
            { ui: this._btnDeleteEvent,                 callback: this._onTouchedBtnDeleteEvent },
            { ui: this._btnNegateRootNode,              callback: this._onTouchedBtnNegateRootNode },

            { ui: this._btnRenameNode,                  callback: this._onTouchedBtnRenameNode },
            { ui: this._btnSwitchNodeAndOr,             callback: this._onTouchedBtnSwitchNodeAndOr },
            { ui: this._btnSwitchNodeTrueFalse,         callback: this._onTouchedBtnSwitchNodeTrueFalse },
            { ui: this._btnReplaceNode,                 callback: this._onTouchedBtnReplaceNode },
            { ui: this._btnAddSubNodeToNode,            callback: this._onTouchedBtnAddSubNodeToNode },
            { ui: this._btnAddSubCondition,             callback: this._onTouchedBtnAddSubCondition },
            { ui: this._btnShallowCloneNode,            callback: this._onTouchedBtnShallowCloneNode },
            { ui: this._btnDeepCloneNode,               callback: this._onTouchedBtnDeepCloneNode },
            { ui: this._btnMoveUpNode,                  callback: this._onTouchedBtnMoveUpNode },
            { ui: this._btnDeleteNode,                  callback: this._onTouchedBtnDeleteNode },

            { ui: this._btnRenameCondition,             callback: this._onTouchedBtnRenameCondition },
            { ui: this._btnModifyCondition,             callback: this._onTouchedBtnModifyCondition },
            { ui: this._btnReplaceCondition,            callback: this._onTouchedBtnReplaceCondition },
            { ui: this._btnDeepCloneCondition,          callback: this._onTouchedBtnDeepCloneCondition },
            { ui: this._btnMoveUpCondition,             callback: this._onTouchedBtnMoveUpCondition },
            { ui: this._btnDeleteCondition,             callback: this._onTouchedBtnDeleteCondition },

            { ui: this._btnRenameAction,                callback: this._onTouchedBtnRenameAction },
            { ui: this._btnModifyAction,                callback: this._onTouchedBtnModifyAction },
            { ui: this._btnReplaceAction,               callback: this._onTouchedBtnReplaceAction },
            { ui: this._btnAddAction,                   callback: this._onTouchedBtnAddAction },
            { ui: this._btnDeepCloneAction,             callback: this._onTouchedBtnDeepCloneAction },
            { ui: this._btnShallowCloneAction,          callback: this._onTouchedBtnShallowCloneAction },
            { ui: this._btnMoveUpAction,                callback: this._onTouchedBtnMoveUpAction },
            { ui: this._btnDeleteAction,                callback: this._onTouchedBtnDeleteAction },
            { ui: this._btnUpdateCampaignAction,        callback: this._onTouchedBtnUpdateCampaignAction },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,             callback: this._onNotifyWarEventFullDataChanged },
            { type: NotificationsTypeId.TypeId.MsgCmSetCampaignMapWarEventAction,   callback: this._onNotifyMsgCmSetCampaignMapWarEventAction },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnModifyEventName(): void {           // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warEvent = HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEvent(openData.eventId));
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray : warEvent.getEventNameArray(),
            maxTextLength   : WarEventsConstants.Event.MaxNameLength,
            callback        : nameArray => {
                warEvent.setEventNameArray(nameArray);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnModifyMaxCallCountPerTurn(): void { // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventData                         = HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData()?.getEventArray()?.find(v => v.getEventId() === openData.eventId));
        const minValue                          = 1;
        const currentValue                      = eventData.getMaxCallCountInPlayerTurn() ?? 1;
        const canBeTriggeredRightAfterAnyEvent  = eventData.getCanBeTriggeredRightAfterAnyEvent() ?? true;
        const textForCurrentOption              = ` (${LangUtils.getText(LangConstants.TextType.B1379)})`;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle               : () => LangUtils.getText(LangConstants.TextType.B1400),
            getContent             : () => LangUtils.getText(LangConstants.TextType.A0954),
            getTextForConfirm      : () => `${LangUtils.getText(LangConstants.TextType.Yes)}${canBeTriggeredRightAfterAnyEvent ? textForCurrentOption : ``}`,
            getTextForCancel       : () => `${LangUtils.getText(LangConstants.TextType.No)}${!canBeTriggeredRightAfterAnyEvent ? textForCurrentOption : ``}`,
            callback            : () => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle           : () => LangUtils.getText(LangConstants.TextType.B0476),
                currentValue    : currentValue,
                minValue        : minValue,
                maxValue        : WarEventsConstants.Event.MaxCallCountInPlayerTurn,
                callback        : (value) => {
                    eventData.setCanBeTriggeredRightAfterAnyEvent(true);
                    eventData.setMaxCallCountInPlayerTurn(value);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                },
            }),
            callbackOnCancel    : () => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle           : () => LangUtils.getText(LangConstants.TextType.B0476),
                currentValue    : currentValue,
                minValue        : minValue,
                maxValue        : WarEventsConstants.Event.MaxCallCountTotal,
                callback        : (value) => {
                    eventData.setCanBeTriggeredRightAfterAnyEvent(false);
                    eventData.setMaxCallCountInPlayerTurn(value);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                },
            }),
        });
    }
    private _onTouchedBtnModifyMaxCallCountTotal(): void {   // DONE
        const data = this.getOpenData();
        if (data) {
            const minValue  = 1;
            const maxValue  = WarEventsConstants.Event.MaxCallCountTotal;
            const eventData = HelpersMisc.getExisted(data.war.getWarEventManager().getWarEventFullData()?.getEventArray().find(v => v.getEventId() === data.eventId));
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
                getTitle           : () => LangUtils.getText(LangConstants.TextType.B0477),
                currentValue    : eventData.getMaxCallCountTotal() ?? 1,
                minValue,
                maxValue,
                callback        : (value) => {
                    eventData.setMaxCallCountTotal(value);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                },
            });
        }
    }
    private _onTouchedBtnInitSubNodeToEvent(): void {        // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId   = openData.eventId;
        const fullData  = HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent          : () => LangUtils.getText(LangConstants.TextType.A0993),
            showButtonClose     : true,
            getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B1477),
            getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B0258),
            callback            : () => {
                const newNodeId = WarEventsConditionNodesUtils.createAndAddRootNodeInEvent({
                    fullData    : fullData,
                    eventId     : eventId,
                    isNeedAnd   : true,
                    isNeedFalse : null,
                });
                if (newNodeId == null) {
                    FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                } else {
                    FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0084, `N${newNodeId}`));
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
            callbackOnCancel    : () => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().WeNodeReplacePanel, {
                    eventId     : eventId,
                    oldNodeId   : null,
                    fullData    : fullData,
                });
            },
        });

    }
    private _onTouchedBtnShallowCloneEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId = openData.eventId;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle            : () => `${LangUtils.getText(LangConstants.TextType.B1478)} E${eventId}`,
            getContent          : () => LangUtils.getText(LangConstants.TextType.A0990),
            showButtonClose     : true,
            getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B0487),
            getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B0748),
            callback            : () => {
                const newEventId = WarEventsEventsUtils.cloneEvent(HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData()), eventId, true);
                FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0084, `E${newEventId}`));

                this.closePanel();
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
            callbackOnCancel    : () => {
                const newEventId = WarEventsEventsUtils.cloneEvent(HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData()), eventId, false);
                FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0084, `E${newEventId}`));

                this.closePanel();
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnDeepCloneEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId = openData.eventId;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle   : () => `${LangUtils.getText(LangConstants.TextType.B0748)} E${eventId}`,
            getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback: () => {
                const newEventId = WarEventsEventsUtils.cloneEvent(HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData()), eventId, false);
                FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0084, `E${newEventId}`));

                this.closePanel();
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnDeleteEvent(): void {               // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId = openData.eventId;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle   : () => `${LangUtils.getText(LangConstants.TextType.B0479)} E${eventId}`,
            getContent : () => LangUtils.getText(LangConstants.TextType.A0935),
            callback: () => {
                const war           = openData.war;
                const eventArray    = HelpersMisc.getExisted(war.getWarEventManager().getWarEventFullData()?.getEventArray());
                HelpersCollection.deleteElementFromList(eventArray, eventArray.find(v => v.getEventId() === eventId));

                for (const templateWarRule of war.getTemplateWarRuleArray()) {
                    HelpersCollection.deleteElementFromList(templateWarRule.getWarEventIdArray(), eventId);
                }

                this.closePanel();
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnNegateRootNode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const fullData      = HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
        const parentNodeId  = openData.parentNodeId;
        {
            const nodeId = openData.nodeId;
            if (nodeId != null) {
                if (parentNodeId != null) {
                    const subNodeIdAndFlags = fullData.getConditionNodeArray().find(v => v.getNodeId() === parentNodeId)?.getSubNodeIdAndFlagsArray()?.find(v => v.getNodeId() === nodeId);
                    if (subNodeIdAndFlags == null) {
                        FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                    } else {
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                            getContent  : () => LangUtils.getText(LangConstants.TextType.A0991),
                            callback    : () => {
                                subNodeIdAndFlags.setIsNegated(!subNodeIdAndFlags.getIsNegated());
                                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
                                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                            },
                        });
                    }
                } else {
                    const nodeIdAndFlags = fullData.getEventArray().find(v => v.getEventId() === openData.eventId)?.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)?.getNodeIdAndFlags();
                    if (nodeIdAndFlags == null) {
                        FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                    } else {
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                            getContent  : () => LangUtils.getText(LangConstants.TextType.A0991),
                            callback    : () => {
                                nodeIdAndFlags.setIsNegated(!nodeIdAndFlags.getIsNegated());
                                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
                                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                            },
                        });
                    }
                }
                return;
            }
        }
        {
            const conditionId = openData.conditionId;
            if (conditionId != null) {
                if (parentNodeId == null) {
                    FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                } else {
                    const conditionIdAndFlags = fullData.getConditionNodeArray().find(v => v.getNodeId() === parentNodeId)?.getConditionIdAndFlagsArray()?.find(v => v.getConditionId() === conditionId);
                    if (conditionIdAndFlags == null) {
                        FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                    } else {
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                            getContent  : () => LangUtils.getText(LangConstants.TextType.A0991),
                            callback    : () => {
                                conditionIdAndFlags.setIsNegated(!conditionIdAndFlags.getIsNegated());
                                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
                                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                            },
                        });
                    }
                }
                return;
            }
        }

        FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
    }

    private _onTouchedBtnRenameNode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const node = HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData()?.getConditionNodeArray()?.find(v => v.getNodeId() === openData.nodeId));
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : node.getNodeNameArray(),
            maxTextLength       : WarEventsConstants.Event.MaxNameLength,
            allowEmpty          : true,
            callback            : nameArray => {
                node.setNodeNameArray(nameArray);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnSwitchNodeAndOr(): void {           // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const node = HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData()?.getConditionNodeArray().find(v => v.getNodeId() === openData.nodeId));
        node.setIsNeedAnd(node.getIsNeedAnd() ? null : true);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnSwitchNodeTrueFalse(): void {           // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const node = HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData()?.getConditionNodeArray().find(v => v.getNodeId() === openData.nodeId));
        node.setIsNeedFalse(node.getIsNeedFalse() ? null : true);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnReplaceNode(): void {               // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeNodeReplacePanel, {
            eventId         : openData.eventId,
            parentNodeId    : openData.parentNodeId,
            oldNodeId       : openData.nodeId ?? null,
            fullData        : HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData()),
        });
    }
    private _onTouchedBtnAddSubNodeToNode(): void {          // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const parentNodeId  = HelpersMisc.getExisted(openData.nodeId);
        const fullData      = HelpersMisc.getExisted(war.getWarEventManager().getWarEventFullData());
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent          : () => LangUtils.getText(LangConstants.TextType.A0989),
            showButtonClose     : true,
            getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B1477),
            getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B0258),
            callback            : () => {
                const subNodeId = createSubNodeInParentNode({
                    fullData        : fullData,
                    parentNodeId    : parentNodeId,
                    isNeedAnd       : true,
                    isNeedFalse     : null,
                });
                if (subNodeId == null) {
                    FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                } else {
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                    FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0206, subNodeId));
                }
            },
            callbackOnCancel    : () => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().WeNodeReplacePanel, {
                    fullData        : fullData,
                    eventId         : openData.eventId,
                    parentNodeId    : parentNodeId,
                    oldNodeId       : null,
                });
            },
        });
    }
    private _onTouchedBtnAddSubCondition(): void {           // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const fullData  = HelpersMisc.getExisted(war.getWarEventManager().getWarEventFullData());
        const nodeId    = HelpersMisc.getExisted(openData.nodeId);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent          : () => LangUtils.getText(LangConstants.TextType.A0992),
            showButtonClose     : true,
            getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B1477),
            getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B0258),
            callback            : () => {
                const newConditionId = WarEventsConditionsUtilsCommon.addDefaultCondition(fullData, nodeId);
                FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0084, `C${newConditionId}`));
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
            callbackOnCancel    : () => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().WeConditionReplacePanel, {
                    gameConfig      : war.getGcData(),
                    fullData        : fullData,
                    parentNodeId    : nodeId,
                    oldConditionId  : null,
                });
            },
        });
    }
    private _onTouchedBtnShallowCloneNode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nodeId    = HelpersMisc.getExisted(openData.nodeId);
        const callback  = (isShallowClone: boolean) => {
            const fullData      = HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
            const newNodeId     = WarEventsConditionNodesUtils.cloneNode(fullData, nodeId, isShallowClone);
            const parentNodeId  = openData.parentNodeId;
            if (parentNodeId != null) {
                HelpersMisc.getExisted(WarEventsFullDatasUtils.getNode(fullData, parentNodeId)?.getSubNodeIdAndFlagsArray()).push(ProtoSchemaCommonProtoWarEventNodeIdAndFlags.NodeIdAndFlags.fromJson({ nodeId: newNodeId }));
            } else {
                const srcActionIdArray = fullData.getEventArray().find(v => v.getEventId() === openData.eventId)?.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)?.getActionIdArray() ?? [];
                HelpersMisc.getExisted(WarEventsFullDatasUtils.getEvent(fullData, openData.eventId)).getRootNodeAndActionsArray().push(ProtoSchemaCommonProtoWarEventConditionNodeAndActions.ConditionNodeAndActions.fromJson({
                    nodeIdAndFlags  : { nodeId: newNodeId },
                    actionIdArray   : isShallowClone
                        ? srcActionIdArray.concat()
                        : srcActionIdArray.map(v => WarEventsActionsUtilsCommon.cloneAction(fullData, v)),
                }));
            }
            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0084, `N${newNodeId}`));

            this.closePanel();
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
        };

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle            : () => `${LangUtils.getText(LangConstants.TextType.B1478)} N${nodeId}`,
            getContent          : () => LangUtils.getText(LangConstants.TextType.A0990),
            showButtonClose     : true,
            getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B0487),
            getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B0748),
            callback            : () => callback(true),
            callbackOnCancel    : () => callback(false),
        });
    }
    private _onTouchedBtnDeepCloneNode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nodeId = HelpersMisc.getExisted(openData.nodeId);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle   : () => `${LangUtils.getText(LangConstants.TextType.B0748)} N${nodeId}`,
            getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback: () => {
                const fullData      = HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
                const newNodeId     = WarEventsConditionNodesUtils.cloneNode(fullData, nodeId, false);
                const parentNodeId  = openData.parentNodeId;
                if (parentNodeId != null) {
                    HelpersMisc.getExisted(WarEventsFullDatasUtils.getNode(fullData, parentNodeId)?.getSubNodeIdAndFlagsArray()).push(ProtoSchemaCommonProtoWarEventNodeIdAndFlags.NodeIdAndFlags.fromJson({ nodeId: newNodeId }));
                } else {
                    HelpersMisc.getExisted(WarEventsFullDatasUtils.getEvent(fullData, openData.eventId)).getRootNodeAndActionsArray().push(ProtoSchemaCommonProtoWarEventConditionNodeAndActions.ConditionNodeAndActions.fromJson({
                        nodeIdAndFlags  : { nodeId: newNodeId },
                        actionIdArray   : [],
                    }));
                }
                FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0084, `N${newNodeId}`));

                this.closePanel();
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnMoveUpNode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const parentNodeId  = openData.parentNodeId;
        const nodeId        = openData.nodeId;
        const fullData      = openData.war.getWarEventManager().getWarEventFullData();
        if ((nodeId == null) || (fullData == null)) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        if (parentNodeId != null) {
            const nodeIdAndFlagsArray = fullData.getConditionNodeArray().find(v => (v.getNodeId() ?? 0) === parentNodeId)?.getSubNodeIdAndFlagsArray();
            if (nodeIdAndFlagsArray == null) {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                return;
            }

            if (HelpersCollection.moveElementInList2(nodeIdAndFlagsArray, v => v.getNodeId() === nodeId, -1)) {
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
            } else {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            }

        } else {
            const eventId                   = openData.eventId;
            const rootNodeAndActionsArray   = fullData.getEventArray().find(v => v.getEventId() === eventId)?.getRootNodeAndActionsArray();
            if (rootNodeAndActionsArray == null) {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                return;
            }

            if (HelpersCollection.moveElementInList2(rootNodeAndActionsArray, v => v.getNodeIdAndFlags()?.getNodeId() === nodeId, -1)) {
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
            } else {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            }
        }
    }
    private _onTouchedBtnDeleteNode(): void {                // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nodeId = openData.nodeId;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle    : () => `${LangUtils.getText(LangConstants.TextType.B0481)} N${nodeId}`,
            getContent  : () => LangUtils.getText(LangConstants.TextType.A0934),
            callback    : () => {
                const fullData      = HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
                const parentNodeId  = openData.parentNodeId;
                if (parentNodeId != null) {
                    HelpersCollection.deleteElementFromList2(
                        HelpersMisc.getExisted(fullData.getConditionNodeArray().find(v => v.getNodeId() === openData.parentNodeId)).getSubNodeIdAndFlagsArray(),
                        v => v.getNodeId() === nodeId
                    );
                } else {
                    HelpersCollection.deleteElementFromList2(
                        HelpersMisc.getExisted(fullData.getEventArray().find(v => v.getEventId() === openData.eventId)).getRootNodeAndActionsArray(),
                        v => v.getNodeIdAndFlags()?.getNodeId() === nodeId
                    );
                }

                // WarEventHelper.checkAndDeleteUnusedNode(fullData, nodeId);

                this.closePanel();
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnRenameCondition(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const data = HelpersMisc.getExisted(WarEventsFullDatasUtils.getCondition(HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData()), HelpersMisc.getExisted(openData.conditionId))).createIfNotExistsWecCommonData();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : data.getConditionNameArray(),
            maxTextLength       : WarEventsConstants.Event.MaxNameLength,
            allowEmpty          : true,
            callback            : nameArray => {
                data.setConditionNameArray(nameArray);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnModifyCondition(): void {           // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const fullData = HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
        WarEventsConditionsUtilsCommon.openConditionModifyPanel({
            fullData    : fullData,
            condition   : HelpersMisc.getExisted(WarEventsFullDatasUtils.getCondition(fullData, HelpersMisc.getExisted(openData.conditionId))),
            war         : openData.war,
        });
    }
    private _onTouchedBtnReplaceCondition(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeConditionReplacePanel, {
            gameConfig      : war.getGcData(),
            fullData        : HelpersMisc.getExisted(war.getWarEventManager().getWarEventFullData()),
            parentNodeId    : HelpersMisc.getExisted(openData.parentNodeId),
            oldConditionId  : HelpersMisc.getExisted(openData.conditionId),
        });
    }
    private _onTouchedBtnDeepCloneCondition(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const conditionId = HelpersMisc.getExisted(openData.conditionId);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle   : () => `${LangUtils.getText(LangConstants.TextType.B0748)} C${conditionId}`,
            getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback: () => {
                const fullData                  = HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
                const conditionIdAndFlagsArray  = HelpersMisc.getExisted(fullData.getConditionNodeArray().find(v => v.getNodeId() === openData.parentNodeId)?.getConditionIdAndFlagsArray());
                const newConditionId            = WarEventsConditionsUtilsCommon.cloneCondition(fullData, conditionId);
                conditionIdAndFlagsArray.push(ProtoSchemaCommonProtoWarEventConditionIdAndFlags.ConditionIdAndFlags.fromJson({ conditionId: newConditionId }));
                conditionIdAndFlagsArray.sort((v1, v2) => v1.getConditionId() - v2.getConditionId());
                FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0084, `C${newConditionId}`));

                this.closePanel();
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnMoveUpCondition(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const parentNodeId  = openData.parentNodeId;
        const conditionId   = openData.conditionId;
        const fullData      = openData.war.getWarEventManager().getWarEventFullData();
        if ((parentNodeId == null) || (conditionId == null) || (fullData == null)) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const conditionIdAndFlagsArray = fullData.getConditionNodeArray().find(v => v.getNodeId() === parentNodeId)?.getConditionIdAndFlagsArray();
        if (conditionIdAndFlagsArray == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        if (HelpersCollection.moveElementInList2(conditionIdAndFlagsArray, v => v.getConditionId() === conditionId, -1)) {
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
        } else {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        }
    }
    private _onTouchedBtnDeleteCondition(): void {           // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const conditionId = openData.conditionId;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle   : () => `${LangUtils.getText(LangConstants.TextType.B0485)} C${conditionId}`,
            getContent : () => LangUtils.getText(LangConstants.TextType.A0934),
            callback: () => {
                const fullData = HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
                HelpersCollection.deleteElementFromList2(
                    HelpersMisc.getExisted(fullData.getConditionNodeArray().find(v => v.getNodeId() === openData.parentNodeId)?.getConditionIdAndFlagsArray()),
                    v => v.getConditionId() === conditionId,
                    1
                );
                // WarEventHelper.checkAndDeleteUnusedCondition(fullData, conditionId);

                this.closePanel();
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnRenameAction(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const data = HelpersMisc.getExisted(WarEventsFullDatasUtils.getAction(HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData()), HelpersMisc.getExisted(openData.actionId))).createIfNotExistsWeaCommonData();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : data.getActionNameArray(),
            maxTextLength       : WarEventsConstants.Event.MaxNameLength,
            allowEmpty          : true,
            callback            : nameArray => {
                data.setActionNameArray(nameArray);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnModifyAction(): void {              // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const fullData  = HelpersMisc.getExisted(war.getWarEventManager().getWarEventFullData());
        WarEventsActionsUtilsCommon.openActionModifyPanel(war, fullData, HelpersMisc.getExisted(WarEventsFullDatasUtils.getAction(fullData, HelpersMisc.getExisted(openData.actionId))));
    }
    private _onTouchedBtnReplaceAction(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nodeId = openData.actionBoundNodeId;
        if (nodeId == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const war = openData.war;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeActionReplacePanel, {
            war         : war,
            fullData    : HelpersMisc.getExisted(war.getWarEventManager().getWarEventFullData()),
            eventId     : openData.eventId,
            nodeId      : nodeId,
            oldActionId    : HelpersMisc.getExisted(openData.actionId),
            oldActionIndex : HelpersMisc.getExisted(openData.actionIndex),
        });
    }
    private _onTouchedBtnAddAction(): void {                 // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nodeId = openData.nodeId;
        if (nodeId == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const war       = openData.war;
        const fullData  = HelpersMisc.getExisted(war.getWarEventManager().getWarEventFullData());
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent          : () => LangUtils.getText(LangConstants.TextType.A0994),
            showButtonClose     : true,
            getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B1477),
            getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B0258),
            callback            : () => {
                const actionIndex = openData.actionIndex;
                const newActionId = WarEventsActionsUtilsCommon.addDefaultAction({
                    fullData    : fullData,
                    eventId     : openData.eventId,
                    nodeId      : nodeId,
                    actionIndex : actionIndex == null ? null : actionIndex + 1,
                });
                if (newActionId == null) {
                    FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                } else {
                    FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0084, `A${newActionId}`));
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
            callbackOnCancel    : () => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().WeActionReplacePanel, {
                    war             : war,
                    fullData        : fullData,
                    eventId         : openData.eventId,
                    nodeId          : nodeId,
                    oldActionId     : null,
                    oldActionIndex  : null,
                });
            },
        });
    }
    private _onTouchedBtnDeepCloneAction(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const actionId = HelpersMisc.getExisted(openData.actionId);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle    : () => `${LangUtils.getText(LangConstants.TextType.B0748)} A${actionId}`,
            getContent  : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                const actionBoundNodeId = openData.actionBoundNodeId;
                if (actionBoundNodeId == null) {
                    FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                } else {
                    const fullData      = HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
                    const newActionId   = WarEventsActionsUtilsCommon.cloneAction(fullData, actionId);
                    WarEventsFullDatasUtils.getEvent(fullData, openData.eventId)
                        ?.getRootNodeAndActionsArray()
                        .find(v => v.getNodeIdAndFlags()?.getNodeId() === actionBoundNodeId)
                        ?.getActionIdArray()
                        .splice(HelpersMisc.getExisted(openData.actionIndex) + 1, 0, newActionId);
                    FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0084, `A${newActionId}`));

                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            },
        });
    }
    private _onTouchedBtnShallowCloneAction(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const actionBoundNodeId = openData.actionBoundNodeId;
        if (actionBoundNodeId == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            const actionId = HelpersMisc.getExisted(openData.actionId);
            WarEventsFullDatasUtils.getEvent(HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData()), openData.eventId)
                ?.getRootNodeAndActionsArray()
                .find(v => v.getNodeIdAndFlags()?.getNodeId() === actionBoundNodeId)
                ?.getActionIdArray()
                .splice(HelpersMisc.getExisted(openData.actionIndex) + 1, 0, actionId);

            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0084, `A${actionId}`));
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
        }
    }
    private _onTouchedBtnMoveUpAction(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const actionId          = openData.actionId;
        const actionBoundNodeId = openData.actionBoundNodeId;
        const fullData          = openData.war.getWarEventManager().getWarEventFullData();
        if ((actionId == null)          ||
            (actionBoundNodeId == null) ||
            (fullData == null)
        ) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const eventId       = openData.eventId;
        const actionIdArray = fullData.getEventArray().find(v => (v.getEventId() ?? 0) === eventId)?.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === actionBoundNodeId)?.getActionIdArray();
        if (actionIdArray == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        if (HelpersCollection.moveElementInList(actionIdArray, actionId, -1)) {
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
        } else {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        }
    }
    private _onTouchedBtnDeleteAction(): void {              // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const actionBoundNodeId = openData.actionBoundNodeId;
        if (actionBoundNodeId == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle    : () => `${LangUtils.getText(LangConstants.TextType.B0486)} A${openData.actionId}`,
            getContent  : () => LangUtils.getText(LangConstants.TextType.A0934),
            callback    : () => {
                const eventId = openData.eventId;
                openData.war.getWarEventManager().getWarEventFullData()?.getEventArray().find(v => v.getEventId() === eventId)
                    ?.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === actionBoundNodeId)
                    ?.getActionIdArray().splice(HelpersMisc.getExisted(openData.actionIndex), 1);

                this.closePanel();
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnUpdateCampaignAction(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war               = openData.war;
        const actionId          = openData.actionId;
        const campaignMapData   = war.getCampaignMapData();
        if ((campaignMapData != null) && (actionId != null)) {
            const action = war.getWarEventManager().getWarEventFullData()?.getActionArray()?.find(v => (v.getWeaCommonData()?.getActionId() ?? 0) === actionId);
            if (action != null) {
                const campaignId    = campaignMapData.getCampaignId() ?? 0;
                const campaignMapId = campaignMapData.getCampaignMapId() ?? 0;
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getContent  : () => LangUtils.getFormattedText(LangConstants.TextType.F0005, actionId, campaignId, campaignMapId),
                    callback    : () => CampaignsManagementsGateway.reqCmSetCampaignMapWarEventAction(campaignId, campaignMapId, action),
                });
            }
        }
    }

    private _onNotifyLanguageChanged(): void {                    // DONE
        this._updateComponentsForLanguage();
    }
    private _onNotifyWarEventFullDataChanged(): void {
        this._updateLabelDescAndButtons();
    }
    private _onNotifyMsgCmSetCampaignMapWarEventAction(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    private _updateComponentsForLanguage(): void {                              // DONE
        this._btnClose.setText(LangUtils.getText(LangConstants.TextType.B0146));

        this._btnShallowCloneEvent.setLangText(LangConstants.TextType.B1478);
        this._btnDeepCloneEvent.setLangText(LangConstants.TextType.B0748);
        this._btnDeleteEvent.setLangText(LangConstants.TextType.B0479);
        this._btnModifyEventName.setLangText(LangConstants.TextType.B0495);
        this._btnModifyMaxCallCountPerTurn.setLangText(LangConstants.TextType.B0317);
        this._btnModifyMaxCallCountTotal.setLangText(LangConstants.TextType.B0317);
        this._btnInitSubNodeToEvent.setLangText(LangConstants.TextType.B0494);
        this._btnNegateRootNode.setLangText(LangConstants.TextType.B1476);

        this._btnRenameNode.setLangText(LangConstants.TextType.B0495);
        this._btnSwitchNodeAndOr.setLangText(LangConstants.TextType.B0482);
        this._btnSwitchNodeTrueFalse.setLangText(LangConstants.TextType.B1107);
        this._btnReplaceNode.setLangText(LangConstants.TextType.B0480);
        this._btnAddSubCondition.setLangText(LangConstants.TextType.B0483);
        this._btnAddSubNodeToNode.setLangText(LangConstants.TextType.B0484);
        this._btnShallowCloneNode.setLangText(LangConstants.TextType.B1478);
        this._btnDeepCloneNode.setLangText(LangConstants.TextType.B0748);
        this._btnMoveUpNode.setLangText(LangConstants.TextType.B0463);
        this._btnDeleteNode.setLangText(LangConstants.TextType.B0499);

        this._btnRenameCondition.setLangText(LangConstants.TextType.B0495);
        this._btnModifyCondition.setLangText(LangConstants.TextType.B0501);
        this._btnReplaceCondition.setLangText(LangConstants.TextType.B0500);
        this._btnDeepCloneCondition.setLangText(LangConstants.TextType.B0748);
        this._btnMoveUpCondition.setLangText(LangConstants.TextType.B0463);
        this._btnDeleteCondition.setLangText(LangConstants.TextType.B0485);

        this._btnRenameAction.setLangText(LangConstants.TextType.B0495);
        this._btnModifyAction.setLangText(LangConstants.TextType.B0317);
        this._btnReplaceAction.setLangText(LangConstants.TextType.B0480);
        this._btnAddAction.setLangText(LangConstants.TextType.B0496);
        this._btnDeepCloneAction.setLangText(LangConstants.TextType.B0748);
        this._btnShallowCloneAction.setLangText(LangConstants.TextType.B0487);
        this._btnMoveUpAction.setLangText(LangConstants.TextType.B0463);
        this._btnDeleteAction.setLangText(LangConstants.TextType.B0220);
        this._btnUpdateCampaignAction.setLangText(LangConstants.TextType.B0125);

        this._updateLabelTitle();
        this._updateLabelDescAndButtons();
    }

    private _updateLabelTitle(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const descType  = openData.descType;
        const label     = this._labelTitle;
        if (descType === WarEventsConstants.DescType.Action) {
            label.setText(`${LangUtils.getText(LangConstants.TextType.B0317)} A${openData.actionId || `???`}`);
        } else if (descType === WarEventsConstants.DescType.Condition) {
            label.setText(`${LangUtils.getText(LangConstants.TextType.B0317)} C${openData.conditionId || `???`}`);
        } else if (descType === WarEventsConstants.DescType.ConditionNode) {
            label.setText(`${LangUtils.getText(LangConstants.TextType.B0317)} N${openData.nodeId || `???`}`);
        } else if (descType === WarEventsConstants.DescType.EventName) {
            label.setText(`${LangUtils.getText(LangConstants.TextType.B0317)} E${openData.eventId || `???`}`);
        } else if (descType === WarEventsConstants.DescType.EventMaxCallCountInPlayerTurn) {
            label.setText(`${LangUtils.getText(LangConstants.TextType.B0317)} E${openData.eventId || `???`}`);
        } else if (descType === WarEventsConstants.DescType.EventMaxCallCountTotal) {
            label.setText(`${LangUtils.getText(LangConstants.TextType.B0317)} E${openData.eventId || `???`}`);
        } else {
            throw HelpersMisc.newError(`Invalid descType: ${descType}`, UtilsClientErrorCode.ClientErrorCode.WeCommandPanel_UpdateLabelTitle_00);
        }
    }

    private _updateLabelDescAndButtons(): void {                                          // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const descType = openData.descType;
        if (descType === WarEventsConstants.DescType.EventName) {
            this._updateForEvent(openData);
        } else if (descType === WarEventsConstants.DescType.EventMaxCallCountInPlayerTurn) {
            this._updateForEventCallCountInPlayerTurn(openData);
        } else if (descType === WarEventsConstants.DescType.EventMaxCallCountTotal) {
            this._updateForEventCallCountTotal(openData);
        } else if (descType === WarEventsConstants.DescType.ConditionNode) {
            this._updateForConditionNode(openData);
        } else if (descType === WarEventsConstants.DescType.Condition) {
            this._updateForCondition(openData);
        } else if (descType === WarEventsConstants.DescType.Action) {
            this._updateForAction(openData);
        } else {
            throw HelpersMisc.newError(`Invalid descType: ${descType}`, UtilsClientErrorCode.ClientErrorCode.WeCommandPanel_UpdateLabelDescAndButtons_00);
        }
    }
    private _updateForEvent(data: OpenData): void {                      // DONE
        const fullData      = HelpersMisc.getExisted(data.war.getWarEventManager().getWarEventFullData());
        const eventId       = data.eventId;
        const event         = HelpersMisc.getExisted(fullData.getEventArray().find(v => v.getEventId() === eventId));
        const errorTip      = WarEventsEventsUtils.getErrorTipForEvent(fullData, event);
        const labelError    = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(`[E${eventId}] ${LangUtils.getLanguageText({ textArray: event.getEventNameArray() })}`);
        this._layoutError.arrangeItems();

        const group = this._groupBtn;
        group.removeAllItems(false);
        group.addItem(this._btnModifyEventName, false);
        group.addItem(this._btnInitSubNodeToEvent, false);
        group.addItem(this._btnShallowCloneEvent, false);
        // group.addItem(this._btnDeepCloneEvent, false);
        group.addItem(this._btnDeleteEvent, false);
        group.arrangeItems();
    }
    private _updateForEventCallCountInPlayerTurn(data: OpenData): void { // DONE
        const fullData              = HelpersMisc.getExisted(data.war.getWarEventManager().getWarEventFullData());
        const eventId               = data.eventId;
        const event                 = HelpersMisc.getExisted(fullData.getEventArray().find(v => v.getEventId() === eventId));
        const errorTip              = WarEventsEventsUtils.getErrorTipForEventCallCountInPlayerTurn(event);
        const textForMaxCallCount   = `${LangUtils.getText(LangConstants.TextType.B0476)}: ${event.getMaxCallCountInPlayerTurn()}`;
        const textForTrigger        = `${LangUtils.getText(LangConstants.TextType.B1400)}: ${LangUtils.getTextForYesOrNo(event.getCanBeTriggeredRightAfterAnyEvent() ?? true)}`;
        const labelError            = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(`[E${eventId}] ${textForMaxCallCount}, ${textForTrigger}`);
        this._layoutError.arrangeItems();

        const group = this._groupBtn;
        group.removeAllItems(false);
        group.addItem(this._btnModifyMaxCallCountPerTurn, false);
        group.arrangeItems();
    }
    private _updateForEventCallCountTotal(data: OpenData): void {        // DONE
        const fullData      = HelpersMisc.getExisted(data.war.getWarEventManager().getWarEventFullData());
        const eventId       = data.eventId;
        const event         = HelpersMisc.getExisted(fullData.getEventArray().find(v => v.getEventId() === eventId));
        const errorTip      = WarEventsEventsUtils.getErrorTipForEventCallCountTotal(event);
        const labelError    = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(`[E${eventId}] ${LangUtils.getText(LangConstants.TextType.B0477)}: ${event.getMaxCallCountTotal()}`);
        this._layoutError.arrangeItems();

        const group = this._groupBtn;
        group.removeAllItems(false);
        group.addItem(this._btnModifyMaxCallCountTotal, false);
        group.arrangeItems();
    }
    private _updateForConditionNode(data: OpenData): void {              // DONE
        const fullData      = HelpersMisc.getExisted(data.war.getWarEventManager().getWarEventFullData());
        const nodeId        = data.nodeId;
        const node          = HelpersMisc.getExisted(fullData.getConditionNodeArray()?.find(v => v.getNodeId() === nodeId));
        const errorTip      = WarEventsConditionNodesUtils.getErrorTipForConditionNode(fullData, node);
        const labelError    = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);

        const textForName   = LangUtils.getLanguageText({ textArray: node.getNodeNameArray() }) ?? `(${LangUtils.getText(LangConstants.TextType.B0277)})`;
        const textForDesc   = LangUtils.getWarEventConditionNodeDesc(node.getIsNeedAnd(), node.getIsNeedFalse());
        this._labelDesc.setText(`[N${nodeId}] ${textForName}\n${textForDesc}`);
        this._layoutError.arrangeItems();

        const group = this._groupBtn;
        group.removeAllItems(false);
        group.addItem(this._btnRenameNode, false);
        group.addItem(this._btnSwitchNodeAndOr, false);
        group.addItem(this._btnSwitchNodeTrueFalse, false);
        if (checkCanNegate(data, fullData)) {
            group.addItem(this._btnNegateRootNode, false);
        }
        group.addItem(this._btnAddSubCondition, false);
        group.addItem(this._btnAddSubNodeToNode, false);
        group.addItem(this._btnReplaceNode, false);
        group.addItem(this._btnShallowCloneNode, false);
        // group.addItem(this._btnDeepCloneNode, false);
        group.addItem(this._btnMoveUpNode, false);
        group.addItem(this._btnDeleteNode, false);
        if (fullData.getEventArray().find(v => v.getEventId() === data.eventId)?.getRootNodeAndActionsArray().some(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)) {
            group.addItem(this._btnAddAction, false);
        }
        group.arrangeItems();
    }
    private _updateForCondition(data: OpenData): void {                  // DONE
        const war           = data.war;
        const fullData      = HelpersMisc.getExisted(war.getWarEventManager().getWarEventFullData());
        const conditionId   = data.conditionId;
        const condition     = HelpersMisc.getExisted(fullData.getConditionArray().find(v => v.getWecCommonData()?.getConditionId() === conditionId));
        const errorTip      = WarEventsConditionsUtilsCommon.getErrorTipForCondition(fullData, condition, war);
        const labelError    = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);

        const textForName   = LangUtils.getLanguageText({ textArray: condition.getWecCommonData()?.getConditionNameArray() }) ?? `(${LangUtils.getText(LangConstants.TextType.B0277)})`;
        const textForDesc   = WarEventsConditionsUtilsCommon.getDetailedDescForCondition(condition, war.getGcData());
        this._labelDesc.setText(`[C${conditionId}] ${textForName}\n${textForDesc}`);
        this._layoutError.arrangeItems();

        const group = this._groupBtn;
        group.removeAllItems(false);
        group.addItem(this._btnRenameCondition, false);
        if (checkCanNegate(data, fullData)) {
            group.addItem(this._btnNegateRootNode, false);
        }
        group.addItem(this._btnModifyCondition, false);
        group.addItem(this._btnReplaceCondition, false);
        group.addItem(this._btnDeepCloneCondition, false);
        group.addItem(this._btnMoveUpCondition, false);
        group.addItem(this._btnDeleteCondition, false);
        group.arrangeItems();
    }
    private async _updateForAction(data: OpenData): Promise<void> {                     // DONE
        const war           = data.war;
        const fullData      = HelpersMisc.getExisted(war.getWarEventManager().getWarEventFullData());
        const actionId      = data.actionId;
        const action        = HelpersMisc.getExisted(fullData.getActionArray().find(v => v.getWeaCommonData()?.getActionId() === actionId));
        const errorTip      = WarEventsActionsUtilsCommon.getErrorTipForAction(fullData, action, war);
        const labelError    = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);

        const textForName   = LangUtils.getLanguageText({ textArray: action.getWeaCommonData()?.getActionNameArray() }) ?? `(${LangUtils.getText(LangConstants.TextType.B0277)})`;
        const textForDesc   = WarEventsActionsUtilsCommon.getDetailDescForAction(action, war.getGcData());
        this._labelDesc.setText(`[A${actionId}] ${textForName}\n${textForDesc}`);
        this._layoutError.arrangeItems();

        const group = this._groupBtn;
        group.removeAllItems(false);
        group.addItem(this._btnRenameAction, false);
        group.addItem(this._btnModifyAction, false);
        group.addItem(this._btnReplaceAction, false);
        group.addItem(this._btnDeepCloneAction, false);
        group.addItem(this._btnShallowCloneAction, false);
        group.addItem(this._btnMoveUpAction, false);
        group.addItem(this._btnDeleteAction, false);
        group.arrangeItems();

        const campaignMapData = war.getCampaignMapData();
        if ((campaignMapData != null) && (!errorTip)) {
            const mapRawData        = await CampaignsMainsProvider.getCampaignMapRawData(campaignMapData.getCampaignId() ?? 0, campaignMapData.getCampaignMapId() ?? 0);
            const existingAction    = mapRawData?.getWarEventFullData()?.getActionArray().find(v => (v.getWeaCommonData()?.getActionId() ?? 0) === actionId);
            if ((existingAction != null) && (checkIsInterchangeable(action, existingAction))) {
                group.addItem(this._btnUpdateCampaignAction, true);
            }
        }
    }
}

function createSubNodeInParentNode({ fullData, parentNodeId, isNeedAnd, isNeedFalse, conditionIdArray = [], subNodeIdArray = [] }: {   // DONE
    fullData            : WarEventFullData;
    parentNodeId        : number;
    isNeedAnd           : AuxiliaryTypesAuxiliaryTypes.Undefinable<boolean>;
    isNeedFalse         : AuxiliaryTypesAuxiliaryTypes.Undefinable<boolean>;
    conditionIdArray?   : ProtoSchemaCommonProtoWarEventConditionIdAndFlags.ConditionIdAndFlags[];
    subNodeIdArray?     : ProtoSchemaCommonProtoWarEventNodeIdAndFlags.NodeIdAndFlags[];
}): number | null {
    const nodeArray     = fullData.getConditionNodeArray();
    const parentNode    = WarEventsFullDatasUtils.getNode(fullData, parentNodeId);
    if (parentNode == null) {
        return null;
    }

    for (let nodeId = 1; ; ++nodeId) {
        if (!nodeArray.some(v => v.getNodeId() === nodeId)) {
            nodeArray.push(ProtoSchemaCommonProtoWarEventWarEventConditionNode.WarEventConditionNode.fromJson({
                nodeId                      : nodeId,
                isNeedAnd                   : isNeedAnd,
                isNeedFalse                 : isNeedFalse,
                conditionIdAndFlagsArray    : conditionIdArray.map(v => v.toJson()),
                subNodeIdAndFlagsArray      : subNodeIdArray.map(v => v.toJson()),
                nodeNameArray               : [],
                deprecatedSubNodeIdArray    : [],
                deprecatedConditionIdArray  : [],
            }));
            nodeArray.sort((v1, v2) => HelpersMisc.getExisted(v1.getNodeId()) - HelpersMisc.getExisted(v2.getNodeId()));

            const arr = parentNode.getSubNodeIdAndFlagsArray();
            arr.push(ProtoSchemaCommonProtoWarEventNodeIdAndFlags.NodeIdAndFlags.fromJson({ nodeId: nodeId }));
            arr.sort((v1, v2) => v1.getNodeId() - v2.getNodeId());

            return nodeId;
        }
    }
}

function checkIsInterchangeable(action1: WarEventAction, action2: WarEventAction): boolean {
    const interchangeableType = WarEventsActionsUtilsCommon.getInterchangeableTypeId(action1);
    return (interchangeableType !== WarEventsActionsConstantsCommon.InterchangeableTypeId.NotInterchangeable)
        && (interchangeableType === WarEventsActionsUtilsCommon.getInterchangeableTypeId(action2));
}

function checkCanNegate(openData: OpenData, fullData: ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData): boolean {
    const nodeId = openData.nodeId;
    if (openData.parentNodeId != null) {
        if ((openData.conditionId != null) || (nodeId != null)) {
            return true;
        }
    }

    if (nodeId != null) {
        if (fullData.getEventArray().find(v => v.getEventId() === openData.eventId)?.getRootNodeAndActionsArray().some(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)) {
            return true;
        }
    }

    return false;
}
