import {
    WarEvents_Actions_Utils_Common,
    WarEvents_Conditions_Utils_Common,
    Utils_ClientErrorCode,
    WarEvents_Events_Utils,
    WarEvents_ConditionNodes_Utils,
    Graphics_Constants,
    Helpers_Collection,
    WarEvents_Constants,
    Notifications_Dispatcher,
    WarEvents_FullDatas_Utils,
    Campaigns_Mains_Provider,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    WarEvents_Actions_Constants_Common,
    GamePanels_Manager,
    Campaigns_Managements_Gateway,
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
import { ConditionIdAndFlags } from "../../proto/schema/CommonProto/WarEvent/ConditionIdAndFlags.ts";
import { ConditionNodeAndActions } from "../../proto/schema/CommonProto/WarEvent/ConditionNodeAndActions.ts";
import { NodeIdAndFlags } from "../../proto/schema/CommonProto/WarEvent/NodeIdAndFlags.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import { WarEventConditionNode } from "../../proto/schema/CommonProto/WarEvent/WarEventConditionNode.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";

export interface OpenData {
    war                 : MapEditor_Interface_IMeWar.IMeWar;
    descType            : WarEvents_Constants.DescType;
    eventId             : number;
    actionId?           : number;
    actionIndex?        : number;
    actionBoundNodeId?  : number;
    conditionId?        : number;
    parentNodeId?       : number;
    nodeId?             : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutError!                  : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupBtn!                     : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnModifyEventName!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnModifyMaxCallCountPerTurn! : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnModifyMaxCallCountTotal!   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnInitSubNodeToEvent!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnShallowCloneEvent!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeepCloneEvent!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteEvent!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNegateRootNode!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnRenameNode!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSwitchNodeAndOr!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSwitchNodeTrueFalse!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnReplaceNode!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAddSubNodeToNode!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAddSubCondition!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnShallowCloneNode!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeepCloneNode!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMoveUpNode!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteNode!                : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnRenameCondition!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnModifyCondition!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnReplaceCondition!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeepCloneCondition!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMoveUpCondition!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteCondition!           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnRenameAction!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnModifyAction!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnReplaceAction!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAddAction!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeepCloneAction!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnShallowCloneAction!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteAction!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMoveUpAction!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnUpdateCampaignAction!      : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,                       callback : this.closePanel },
            { ui : this._btnModifyEventName,             callback : this._onTouchedBtnModifyEventName },
            { ui : this._btnModifyMaxCallCountPerTurn,   callback : this._onTouchedBtnModifyMaxCallCountPerTurn },
            { ui : this._btnModifyMaxCallCountTotal,     callback : this._onTouchedBtnModifyMaxCallCountTotal },
            { ui : this._btnInitSubNodeToEvent,          callback : this._onTouchedBtnInitSubNodeToEvent },
            { ui : this._btnShallowCloneEvent,           callback : this._onTouchedBtnShallowCloneEvent },
            { ui : this._btnDeepCloneEvent,              callback : this._onTouchedBtnDeepCloneEvent },
            { ui : this._btnDeleteEvent,                 callback : this._onTouchedBtnDeleteEvent },
            { ui : this._btnNegateRootNode,              callback : this._onTouchedBtnNegateRootNode },

            { ui : this._btnRenameNode,                  callback : this._onTouchedBtnRenameNode },
            { ui : this._btnSwitchNodeAndOr,             callback : this._onTouchedBtnSwitchNodeAndOr },
            { ui : this._btnSwitchNodeTrueFalse,         callback : this._onTouchedBtnSwitchNodeTrueFalse },
            { ui : this._btnReplaceNode,                 callback : this._onTouchedBtnReplaceNode },
            { ui : this._btnAddSubNodeToNode,            callback : this._onTouchedBtnAddSubNodeToNode },
            { ui : this._btnAddSubCondition,             callback : this._onTouchedBtnAddSubCondition },
            { ui : this._btnShallowCloneNode,            callback : this._onTouchedBtnShallowCloneNode },
            { ui : this._btnDeepCloneNode,               callback : this._onTouchedBtnDeepCloneNode },
            { ui : this._btnMoveUpNode,                  callback : this._onTouchedBtnMoveUpNode },
            { ui : this._btnDeleteNode,                  callback : this._onTouchedBtnDeleteNode },

            { ui : this._btnRenameCondition,             callback : this._onTouchedBtnRenameCondition },
            { ui : this._btnModifyCondition,             callback : this._onTouchedBtnModifyCondition },
            { ui : this._btnReplaceCondition,            callback : this._onTouchedBtnReplaceCondition },
            { ui : this._btnDeepCloneCondition,          callback : this._onTouchedBtnDeepCloneCondition },
            { ui : this._btnMoveUpCondition,             callback : this._onTouchedBtnMoveUpCondition },
            { ui : this._btnDeleteCondition,             callback : this._onTouchedBtnDeleteCondition },

            { ui : this._btnRenameAction,                callback : this._onTouchedBtnRenameAction },
            { ui : this._btnModifyAction,                callback : this._onTouchedBtnModifyAction },
            { ui : this._btnReplaceAction,               callback : this._onTouchedBtnReplaceAction },
            { ui : this._btnAddAction,                   callback : this._onTouchedBtnAddAction },
            { ui : this._btnDeepCloneAction,             callback : this._onTouchedBtnDeepCloneAction },
            { ui : this._btnShallowCloneAction,          callback : this._onTouchedBtnShallowCloneAction },
            { ui : this._btnMoveUpAction,                callback : this._onTouchedBtnMoveUpAction },
            { ui : this._btnDeleteAction,                callback : this._onTouchedBtnDeleteAction },
            { ui : this._btnUpdateCampaignAction,        callback : this._onTouchedBtnUpdateCampaignAction },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                     callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged",             callback : this._onNotifyWarEventFullDataChanged },
            { type : "MsgCmSetCampaignMapWarEventAction",   callback : this._onNotifyMsgCmSetCampaignMapWarEventAction },
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

        const warEvent = openData.war.getWarEventManager().getWarEvent(openData.eventId);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray : warEvent.getEventNameArray(),
            maxTextLength    : WarEvents_Constants.Event.MaxNameLength,
            callback         : nameArray => {
                warEvent.setEventNameArray(nameArray);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnModifyMaxCallCountPerTurn(): void { // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventData                         = Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData()?.getEventArray()?.find(v => v.getEventId() === openData.eventId));
        const minValue                          = 1;
        const currentValue                      = eventData.getMaxCallCountInPlayerTurn();
        const canBeTriggeredRightAfterAnyEvent  = eventData.getCanBeTriggeredRightAfterAnyEvent();
        const textForCurrentOption              = ` (${Lang_Utils.getText(Lang_Constants.TextType.B1379)})`;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle          : () => Lang_Utils.getText(Lang_Constants.TextType.B1400),
            getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0954),
            getTextForConfirm : () => `${Lang_Utils.getText(Lang_Constants.TextType.Yes)}${canBeTriggeredRightAfterAnyEvent ? textForCurrentOption : ``}`,
            getTextForCancel  : () => `${Lang_Utils.getText(Lang_Constants.TextType.No)}${!canBeTriggeredRightAfterAnyEvent ? textForCurrentOption : ``}`,
            callback          : () => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0476),
                currentValue : currentValue,
                minValue     : minValue,
                maxValue     : WarEvents_Constants.Event.MaxCallCountInPlayerTurn,
                callback     : (value) => {
                    eventData.setCanBeTriggeredRightAfterAnyEvent(true);
                    eventData.setMaxCallCountInPlayerTurn(value);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                },
            }),
            callbackOnCancel : () => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0476),
                currentValue : currentValue,
                minValue     : minValue,
                maxValue     : WarEvents_Constants.Event.MaxCallCountTotal,
                callback     : (value) => {
                    eventData.setCanBeTriggeredRightAfterAnyEvent(false);
                    eventData.setMaxCallCountInPlayerTurn(value);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                },
            }),
        });
    }
    private _onTouchedBtnModifyMaxCallCountTotal(): void {   // DONE
        const data = this.getOpenData();
        if (data) {
            const minValue  = 1;
            const maxValue  = WarEvents_Constants.Event.MaxCallCountTotal;
            const eventData = Helpers_Misc.getExisted(data.war.getWarEventManager().getWarEventFullData()?.getEventArray().find(v => v.getEventId() === data.eventId));
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
                getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0477),
                currentValue : eventData.getMaxCallCountTotal(),
                minValue,
                maxValue,
                callback     : (value) => {
                    eventData.setMaxCallCountTotal(value);
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
        const fullData  = Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0993),
            showButtonClose   : true,
            getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.B1477),
            getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.B0258),
            callback          : () => {
                const newNodeId = WarEvents_ConditionNodes_Utils.createAndAddRootNodeInEvent({
                    fullData    : fullData,
                    eventId     : eventId,
                    isNeedAnd   : true,
                    isNeedFalse : null,
                });
                if (newNodeId == null) {
                    FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                } else {
                    FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0084, `N${newNodeId}`));
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
            callbackOnCancel : () => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeNodeReplacePanel, {
                    eventId   : eventId,
                    oldNodeId : null,
                    fullData  : fullData,
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle          : () => `${Lang_Utils.getText(Lang_Constants.TextType.B1478)} E${eventId}`,
            getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0990),
            showButtonClose   : true,
            getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.B0487),
            getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.B0748),
            callback          : () => {
                const newEventId = WarEvents_Events_Utils.cloneEvent(Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData()), eventId, true);
                FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0084, `E${newEventId}`));

                this.closePanel();
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
            callbackOnCancel : () => {
                const newEventId = WarEvents_Events_Utils.cloneEvent(Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData()), eventId, false);
                FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0084, `E${newEventId}`));

                this.closePanel();
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnDeepCloneEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId = openData.eventId;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => `${Lang_Utils.getText(Lang_Constants.TextType.B0748)} E${eventId}`,
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const newEventId = WarEvents_Events_Utils.cloneEvent(Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData()), eventId, false);
                FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0084, `E${newEventId}`));

                this.closePanel();
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnDeleteEvent(): void {               // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId = openData.eventId;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => `${Lang_Utils.getText(Lang_Constants.TextType.B0479)} E${eventId}`,
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0935),
            callback   : () => {
                const war           = openData.war;
                const eventArray    = Helpers_Misc.getExisted(war.getWarEventManager().getWarEventFullData()?.getEventArray());
                Helpers_Collection.deleteElementFromList(eventArray, eventArray.find(v => v.getEventId() === eventId));

                for (const templateWarRule of war.getTemplateWarRuleArray()) {
                    Helpers_Collection.deleteElementFromList(templateWarRule.getWarEventIdArray(), eventId);
                }

                this.closePanel();
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnNegateRootNode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const fullData      = Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
        const parentNodeId  = openData.parentNodeId;
        {
            const nodeId = openData.nodeId;
            if (nodeId != null) {
                if (parentNodeId != null) {
                    const subNodeIdAndFlags = fullData.getConditionNodeArray().find(v => v.getNodeId() === parentNodeId)?.getSubNodeIdAndFlagsArray()?.find(v => v.getNodeId() === nodeId);
                    if (subNodeIdAndFlags == null) {
                        FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                    } else {
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0991),
                            callback   : () => {
                                subNodeIdAndFlags.setIsNegated(!subNodeIdAndFlags.getIsNegated());
                                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
                                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                            },
                        });
                    }
                } else {
                    const nodeIdAndFlags = fullData.getEventArray().find(v => v.getEventId() === openData.eventId)?.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)?.getNodeIdAndFlags();
                    if (nodeIdAndFlags == null) {
                        FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                    } else {
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0991),
                            callback   : () => {
                                nodeIdAndFlags.setIsNegated(!nodeIdAndFlags.getIsNegated());
                                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
                                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
                    FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                } else {
                    const conditionIdAndFlags = fullData.getConditionNodeArray().find(v => v.getNodeId() === parentNodeId)?.getConditionIdAndFlagsArray()?.find(v => v.getConditionId() === conditionId);
                    if (conditionIdAndFlags == null) {
                        FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                    } else {
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0991),
                            callback   : () => {
                                conditionIdAndFlags.setIsNegated(!conditionIdAndFlags.getIsNegated());
                                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
                                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                            },
                        });
                    }
                }
                return;
            }
        }

        FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
    }

    private _onTouchedBtnRenameNode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const node = Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData()?.getConditionNodeArray()?.find(v => v.getNodeId() === openData.nodeId));
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray : node.getNodeNameArray(),
            maxTextLength    : WarEvents_Constants.Event.MaxNameLength,
            allowEmpty       : true,
            callback         : nameArray => {
                node.setNodeNameArray(nameArray);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnSwitchNodeAndOr(): void {           // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const node = Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData()?.getConditionNodeArray().find(v => v.getNodeId() === openData.nodeId));
        node.setIsNeedAnd(node.getIsNeedAnd() ? null : true);
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }
    private _onTouchedBtnSwitchNodeTrueFalse(): void {           // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const node = Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData()?.getConditionNodeArray().find(v => v.getNodeId() === openData.nodeId));
        node.setIsNeedFalse(node.getIsNeedFalse() ? null : true);
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }
    private _onTouchedBtnReplaceNode(): void {               // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeNodeReplacePanel, {
            eventId      : openData.eventId,
            parentNodeId : openData.parentNodeId,
            oldNodeId    : openData.nodeId ?? null,
            fullData     : Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData()),
        });
    }
    private _onTouchedBtnAddSubNodeToNode(): void {          // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const parentNodeId  = Helpers_Misc.getExisted(openData.nodeId);
        const fullData      = Helpers_Misc.getExisted(war.getWarEventManager().getWarEventFullData());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0989),
            showButtonClose   : true,
            getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.B1477),
            getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.B0258),
            callback          : () => {
                const subNodeId = createSubNodeInParentNode({
                    fullData     : fullData,
                    parentNodeId : parentNodeId,
                    isNeedAnd    : true,
                    isNeedFalse  : null,
                });
                if (subNodeId == null) {
                    FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                } else {
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                    FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0206, subNodeId));
                }
            },
            callbackOnCancel : () => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeNodeReplacePanel, {
                    fullData     : fullData,
                    eventId      : openData.eventId,
                    parentNodeId : parentNodeId,
                    oldNodeId    : null,
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
        const fullData  = Helpers_Misc.getExisted(war.getWarEventManager().getWarEventFullData());
        const nodeId    = Helpers_Misc.getExisted(openData.nodeId);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0992),
            showButtonClose   : true,
            getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.B1477),
            getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.B0258),
            callback          : () => {
                const newConditionId = WarEvents_Conditions_Utils_Common.addDefaultCondition(fullData, nodeId);
                FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0084, `C${newConditionId}`));
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
            callbackOnCancel : () => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeConditionReplacePanel, {
                    gameConfig     : war.getGcData(),
                    fullData       : fullData,
                    parentNodeId   : nodeId,
                    oldConditionId : null,
                });
            },
        });
    }
    private _onTouchedBtnShallowCloneNode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nodeId    = Helpers_Misc.getExisted(openData.nodeId);
        const callback  = (isShallowClone: boolean) => {
            const fullData      = Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
            const newNodeId     = WarEvents_ConditionNodes_Utils.cloneNode(fullData, nodeId, isShallowClone);
            const parentNodeId  = openData.parentNodeId;
            if (parentNodeId != null) {
                Helpers_Misc.getExisted(WarEvents_FullDatas_Utils.getNode(fullData, parentNodeId)?.getSubNodeIdAndFlagsArray()).push(NodeIdAndFlags.fromJson({ nodeId : newNodeId }));
            } else {
                const srcActionIdArray = fullData.getEventArray().find(v => v.getEventId() === openData.eventId)?.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)?.getActionIdArray() ?? [];
                Helpers_Misc.getExisted(WarEvents_FullDatas_Utils.getEvent(fullData, openData.eventId)).getRootNodeAndActionsArray().push(ConditionNodeAndActions.fromJson({
                    nodeIdAndFlags : { nodeId : newNodeId },
                    actionIdArray  : isShallowClone
                        ? srcActionIdArray.concat()
                        : srcActionIdArray.map(v => WarEvents_Actions_Utils_Common.cloneAction(fullData, v)),
                }));
            }
            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0084, `N${newNodeId}`));

            this.closePanel();
            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
        };

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle          : () => `${Lang_Utils.getText(Lang_Constants.TextType.B1478)} N${nodeId}`,
            getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0990),
            showButtonClose   : true,
            getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.B0487),
            getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.B0748),
            callback          : () => callback(true),
            callbackOnCancel  : () => callback(false),
        });
    }
    private _onTouchedBtnDeepCloneNode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nodeId = Helpers_Misc.getExisted(openData.nodeId);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => `${Lang_Utils.getText(Lang_Constants.TextType.B0748)} N${nodeId}`,
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const fullData      = Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
                const newNodeId     = WarEvents_ConditionNodes_Utils.cloneNode(fullData, nodeId, false);
                const parentNodeId  = openData.parentNodeId;
                if (parentNodeId != null) {
                    Helpers_Misc.getExisted(WarEvents_FullDatas_Utils.getNode(fullData, parentNodeId)?.getSubNodeIdAndFlagsArray()).push(NodeIdAndFlags.fromJson({ nodeId : newNodeId }));
                } else {
                    Helpers_Misc.getExisted(WarEvents_FullDatas_Utils.getEvent(fullData, openData.eventId)).getRootNodeAndActionsArray().push(ConditionNodeAndActions.fromJson({
                        nodeIdAndFlags : { nodeId : newNodeId },
                        actionIdArray  : [],
                    }));
                }
                FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0084, `N${newNodeId}`));

                this.closePanel();
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        if (parentNodeId != null) {
            const nodeIdAndFlagsArray = fullData.getConditionNodeArray().find(v => (v.getNodeId()) === parentNodeId)?.getSubNodeIdAndFlagsArray();
            if (nodeIdAndFlagsArray == null) {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                return;
            }

            if (Helpers_Collection.moveElementInList2(nodeIdAndFlagsArray, v => v.getNodeId() === nodeId, -1)) {
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
            } else {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            }

        } else {
            const eventId                   = openData.eventId;
            const rootNodeAndActionsArray   = fullData.getEventArray().find(v => v.getEventId() === eventId)?.getRootNodeAndActionsArray();
            if (rootNodeAndActionsArray == null) {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                return;
            }

            if (Helpers_Collection.moveElementInList2(rootNodeAndActionsArray, v => v.getNodeIdAndFlags()?.getNodeId() === nodeId, -1)) {
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
            } else {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            }
        }
    }
    private _onTouchedBtnDeleteNode(): void {                // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nodeId = openData.nodeId;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => `${Lang_Utils.getText(Lang_Constants.TextType.B0481)} N${nodeId}`,
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0934),
            callback   : () => {
                const fullData      = Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
                const parentNodeId  = openData.parentNodeId;
                if (parentNodeId != null) {
                    Helpers_Collection.deleteElementFromList2(
                        Helpers_Misc.getExisted(fullData.getConditionNodeArray().find(v => v.getNodeId() === openData.parentNodeId)).getSubNodeIdAndFlagsArray(),
                        v => v.getNodeId() === nodeId,
                    );
                } else {
                    Helpers_Collection.deleteElementFromList2(
                        Helpers_Misc.getExisted(fullData.getEventArray().find(v => v.getEventId() === openData.eventId)).getRootNodeAndActionsArray(),
                        v => v.getNodeIdAndFlags()?.getNodeId() === nodeId,
                    );
                }

                // WarEventHelper.checkAndDeleteUnusedNode(fullData, nodeId);

                this.closePanel();
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnRenameCondition(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const data = Helpers_Misc.getExisted(WarEvents_FullDatas_Utils.getCondition(Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData()), Helpers_Misc.getExisted(openData.conditionId))).createIfNotExistsWecCommonData();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray : data.getConditionNameArray(),
            maxTextLength    : WarEvents_Constants.Event.MaxNameLength,
            allowEmpty       : true,
            callback         : nameArray => {
                data.setConditionNameArray(nameArray);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnModifyCondition(): void {           // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const fullData = Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
        WarEvents_Conditions_Utils_Common.openConditionModifyPanel({
            fullData  : fullData,
            condition : Helpers_Misc.getExisted(WarEvents_FullDatas_Utils.getCondition(fullData, Helpers_Misc.getExisted(openData.conditionId))),
            war       : openData.war,
        });
    }
    private _onTouchedBtnReplaceCondition(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeConditionReplacePanel, {
            gameConfig     : war.getGcData(),
            fullData       : Helpers_Misc.getExisted(war.getWarEventManager().getWarEventFullData()),
            parentNodeId   : Helpers_Misc.getExisted(openData.parentNodeId),
            oldConditionId : Helpers_Misc.getExisted(openData.conditionId),
        });
    }
    private _onTouchedBtnDeepCloneCondition(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const conditionId = Helpers_Misc.getExisted(openData.conditionId);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => `${Lang_Utils.getText(Lang_Constants.TextType.B0748)} C${conditionId}`,
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const fullData                  = Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
                const conditionIdAndFlagsArray  = Helpers_Misc.getExisted(fullData.getConditionNodeArray().find(v => v.getNodeId() === openData.parentNodeId)?.getConditionIdAndFlagsArray());
                const newConditionId            = WarEvents_Conditions_Utils_Common.cloneCondition(fullData, conditionId);
                conditionIdAndFlagsArray.push(ConditionIdAndFlags.fromJson({ conditionId : newConditionId }));
                conditionIdAndFlagsArray.sort((v1, v2) => v1.getConditionId() - v2.getConditionId());
                FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0084, `C${newConditionId}`));

                this.closePanel();
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const conditionIdAndFlagsArray = fullData.getConditionNodeArray().find(v => v.getNodeId() === parentNodeId)?.getConditionIdAndFlagsArray();
        if (conditionIdAndFlagsArray == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        if (Helpers_Collection.moveElementInList2(conditionIdAndFlagsArray, v => v.getConditionId() === conditionId, -1)) {
            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
        } else {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        }
    }
    private _onTouchedBtnDeleteCondition(): void {           // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const conditionId = openData.conditionId;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => `${Lang_Utils.getText(Lang_Constants.TextType.B0485)} C${conditionId}`,
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0934),
            callback   : () => {
                const fullData = Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
                Helpers_Collection.deleteElementFromList2(
                    Helpers_Misc.getExisted(fullData.getConditionNodeArray().find(v => v.getNodeId() === openData.parentNodeId)?.getConditionIdAndFlagsArray()),
                    v => v.getConditionId() === conditionId,
                    1,
                );
                // WarEventHelper.checkAndDeleteUnusedCondition(fullData, conditionId);

                this.closePanel();
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _onTouchedBtnRenameAction(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const data = Helpers_Misc.getExisted(WarEvents_FullDatas_Utils.getAction(Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData()), Helpers_Misc.getExisted(openData.actionId))).createIfNotExistsWeaCommonData();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputShortLangTextPanel, {
            currentTextArray : data.getActionNameArray(),
            maxTextLength    : WarEvents_Constants.Event.MaxNameLength,
            allowEmpty       : true,
            callback         : nameArray => {
                data.setActionNameArray(nameArray);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnModifyAction(): void {              // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const fullData  = Helpers_Misc.getExisted(war.getWarEventManager().getWarEventFullData());
        WarEvents_Actions_Utils_Common.openActionModifyPanel(war, fullData, Helpers_Misc.getExisted(WarEvents_FullDatas_Utils.getAction(fullData, Helpers_Misc.getExisted(openData.actionId))));
    }
    private _onTouchedBtnReplaceAction(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nodeId = openData.actionBoundNodeId;
        if (nodeId == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const war = openData.war;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeActionReplacePanel, {
            war            : war,
            fullData       : Helpers_Misc.getExisted(war.getWarEventManager().getWarEventFullData()),
            eventId        : openData.eventId,
            nodeId         : nodeId,
            oldActionId    : Helpers_Misc.getExisted(openData.actionId),
            oldActionIndex : Helpers_Misc.getExisted(openData.actionIndex),
        });
    }
    private _onTouchedBtnAddAction(): void {                 // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nodeId = openData.nodeId;
        if (nodeId == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const war       = openData.war;
        const fullData  = Helpers_Misc.getExisted(war.getWarEventManager().getWarEventFullData());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0994),
            showButtonClose   : true,
            getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.B1477),
            getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.B0258),
            callback          : () => {
                const actionIndex = openData.actionIndex;
                const newActionId = WarEvents_Actions_Utils_Common.addDefaultAction({
                    fullData    : fullData,
                    eventId     : openData.eventId,
                    nodeId      : nodeId,
                    actionIndex : actionIndex == null ? null : actionIndex + 1,
                });
                if (newActionId == null) {
                    FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                } else {
                    FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0084, `A${newActionId}`));
                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
                }
            },
            callbackOnCancel : () => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeActionReplacePanel, {
                    war            : war,
                    fullData       : fullData,
                    eventId        : openData.eventId,
                    nodeId         : nodeId,
                    oldActionId    : null,
                    oldActionIndex : null,
                });
            },
        });
    }
    private _onTouchedBtnDeepCloneAction(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const actionId = Helpers_Misc.getExisted(openData.actionId);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => `${Lang_Utils.getText(Lang_Constants.TextType.B0748)} A${actionId}`,
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback   : () => {
                const actionBoundNodeId = openData.actionBoundNodeId;
                if (actionBoundNodeId == null) {
                    FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                } else {
                    const fullData      = Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData());
                    const newActionId   = WarEvents_Actions_Utils_Common.cloneAction(fullData, actionId);
                    WarEvents_FullDatas_Utils.getEvent(fullData, openData.eventId)
                        ?.getRootNodeAndActionsArray()
                        .find(v => v.getNodeIdAndFlags()?.getNodeId() === actionBoundNodeId)
                        ?.getActionIdArray()
                        .splice(Helpers_Misc.getExisted(openData.actionIndex) + 1, 0, newActionId);
                    FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0084, `A${newActionId}`));

                    Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const actionId = Helpers_Misc.getExisted(openData.actionId);
            WarEvents_FullDatas_Utils.getEvent(Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData()), openData.eventId)
                ?.getRootNodeAndActionsArray()
                .find(v => v.getNodeIdAndFlags()?.getNodeId() === actionBoundNodeId)
                ?.getActionIdArray()
                .splice(Helpers_Misc.getExisted(openData.actionIndex) + 1, 0, actionId);

            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0084, `A${actionId}`));
            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const eventId       = openData.eventId;
        const actionIdArray = fullData.getEventArray().find(v => (v.getEventId()) === eventId)?.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === actionBoundNodeId)?.getActionIdArray();
        if (actionIdArray == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        if (Helpers_Collection.moveElementInList(actionIdArray, actionId, -1)) {
            Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
        } else {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        }
    }
    private _onTouchedBtnDeleteAction(): void {              // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const actionBoundNodeId = openData.actionBoundNodeId;
        if (actionBoundNodeId == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => `${Lang_Utils.getText(Lang_Constants.TextType.B0486)} A${openData.actionId}`,
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0934),
            callback   : () => {
                const eventId = openData.eventId;
                openData.war.getWarEventManager().getWarEventFullData()?.getEventArray().find(v => v.getEventId() === eventId)
                    ?.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === actionBoundNodeId)
                    ?.getActionIdArray().splice(Helpers_Misc.getExisted(openData.actionIndex), 1);

                this.closePanel();
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
                const campaignId    = campaignMapData.getCampaignId();
                const campaignMapId = campaignMapData.getCampaignMapId();
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0005, actionId, campaignId, campaignMapId),
                    callback   : () => Campaigns_Managements_Gateway.reqCmSetCampaignMapWarEventAction(campaignId, campaignMapId, action),
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
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    private _updateComponentsForLanguage(): void {                              // DONE
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);

        this._btnShallowCloneEvent.setLangText(Lang_Constants.TextType.B1478);
        this._btnDeepCloneEvent.setLangText(Lang_Constants.TextType.B0748);
        this._btnDeleteEvent.setLangText(Lang_Constants.TextType.B0479);
        this._btnModifyEventName.setLangText(Lang_Constants.TextType.B0495);
        this._btnModifyMaxCallCountPerTurn.setLangText(Lang_Constants.TextType.B0317);
        this._btnModifyMaxCallCountTotal.setLangText(Lang_Constants.TextType.B0317);
        this._btnInitSubNodeToEvent.setLangText(Lang_Constants.TextType.B0494);
        this._btnNegateRootNode.setLangText(Lang_Constants.TextType.B1476);

        this._btnRenameNode.setLangText(Lang_Constants.TextType.B0495);
        this._btnSwitchNodeAndOr.setLangText(Lang_Constants.TextType.B0482);
        this._btnSwitchNodeTrueFalse.setLangText(Lang_Constants.TextType.B1107);
        this._btnReplaceNode.setLangText(Lang_Constants.TextType.B0480);
        this._btnAddSubCondition.setLangText(Lang_Constants.TextType.B0483);
        this._btnAddSubNodeToNode.setLangText(Lang_Constants.TextType.B0484);
        this._btnShallowCloneNode.setLangText(Lang_Constants.TextType.B1478);
        this._btnDeepCloneNode.setLangText(Lang_Constants.TextType.B0748);
        this._btnMoveUpNode.setLangText(Lang_Constants.TextType.B0463);
        this._btnDeleteNode.setLangText(Lang_Constants.TextType.B0499);

        this._btnRenameCondition.setLangText(Lang_Constants.TextType.B0495);
        this._btnModifyCondition.setLangText(Lang_Constants.TextType.B0501);
        this._btnReplaceCondition.setLangText(Lang_Constants.TextType.B0500);
        this._btnDeepCloneCondition.setLangText(Lang_Constants.TextType.B0748);
        this._btnMoveUpCondition.setLangText(Lang_Constants.TextType.B0463);
        this._btnDeleteCondition.setLangText(Lang_Constants.TextType.B0485);

        this._btnRenameAction.setLangText(Lang_Constants.TextType.B0495);
        this._btnModifyAction.setLangText(Lang_Constants.TextType.B0317);
        this._btnReplaceAction.setLangText(Lang_Constants.TextType.B0480);
        this._btnAddAction.setLangText(Lang_Constants.TextType.B0496);
        this._btnDeepCloneAction.setLangText(Lang_Constants.TextType.B0748);
        this._btnShallowCloneAction.setLangText(Lang_Constants.TextType.B0487);
        this._btnMoveUpAction.setLangText(Lang_Constants.TextType.B0463);
        this._btnDeleteAction.setLangText(Lang_Constants.TextType.B0220);
        this._btnUpdateCampaignAction.setLangText(Lang_Constants.TextType.B0125);

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
        if (descType === WarEvents_Constants.DescType.Action) {
            label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0317)} A${openData.actionId || `???`}`);
        } else if (descType === WarEvents_Constants.DescType.Condition) {
            label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0317)} C${openData.conditionId || `???`}`);
        } else if (descType === WarEvents_Constants.DescType.ConditionNode) {
            label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0317)} N${openData.nodeId || `???`}`);
        } else if (descType === WarEvents_Constants.DescType.EventName) {
            label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0317)} E${openData.eventId || `???`}`);
        } else if (descType === WarEvents_Constants.DescType.EventMaxCallCountInPlayerTurn) {
            label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0317)} E${openData.eventId || `???`}`);
        } else if (descType === WarEvents_Constants.DescType.EventMaxCallCountTotal) {
            label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0317)} E${openData.eventId || `???`}`);
        } else {
            throw Helpers_Misc.newError(`Invalid descType: ${descType}`, Utils_ClientErrorCode.ClientErrorCode.WeCommandPanel_UpdateLabelTitle_00);
        }
    }

    private _updateLabelDescAndButtons(): void {                                          // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const descType = openData.descType;
        if (descType === WarEvents_Constants.DescType.EventName) {
            this._updateForEvent(openData);
        } else if (descType === WarEvents_Constants.DescType.EventMaxCallCountInPlayerTurn) {
            this._updateForEventCallCountInPlayerTurn(openData);
        } else if (descType === WarEvents_Constants.DescType.EventMaxCallCountTotal) {
            this._updateForEventCallCountTotal(openData);
        } else if (descType === WarEvents_Constants.DescType.ConditionNode) {
            this._updateForConditionNode(openData);
        } else if (descType === WarEvents_Constants.DescType.Condition) {
            this._updateForCondition(openData);
        } else if (descType === WarEvents_Constants.DescType.Action) {
            this._updateForAction(openData);
        } else {
            throw Helpers_Misc.newError(`Invalid descType: ${descType}`, Utils_ClientErrorCode.ClientErrorCode.WeCommandPanel_UpdateLabelDescAndButtons_00);
        }
    }
    private _updateForEvent(data: OpenData): void {                      // DONE
        const fullData      = Helpers_Misc.getExisted(data.war.getWarEventManager().getWarEventFullData());
        const eventId       = data.eventId;
        const event         = Helpers_Misc.getExisted(fullData.getEventArray().find(v => v.getEventId() === eventId));
        const errorTip      = WarEvents_Events_Utils.getErrorTipForEvent(fullData, event);
        const labelError    = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(`[E${eventId}] ${Lang_Utils.getLanguageText({ textArray : event.getEventNameArray() })}`);
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
        const fullData              = Helpers_Misc.getExisted(data.war.getWarEventManager().getWarEventFullData());
        const eventId               = data.eventId;
        const event                 = Helpers_Misc.getExisted(fullData.getEventArray().find(v => v.getEventId() === eventId));
        const errorTip              = WarEvents_Events_Utils.getErrorTipForEventCallCountInPlayerTurn(event);
        const textForMaxCallCount   = `${Lang_Utils.getText(Lang_Constants.TextType.B0476)}: ${event.getMaxCallCountInPlayerTurn()}`;
        const textForTrigger        = `${Lang_Utils.getText(Lang_Constants.TextType.B1400)}: ${Lang_Utils.getTextForYesOrNo(event.getCanBeTriggeredRightAfterAnyEvent())}`;
        const labelError            = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(`[E${eventId}] ${textForMaxCallCount}, ${textForTrigger}`);
        this._layoutError.arrangeItems();

        const group = this._groupBtn;
        group.removeAllItems(false);
        group.addItem(this._btnModifyMaxCallCountPerTurn, false);
        group.arrangeItems();
    }
    private _updateForEventCallCountTotal(data: OpenData): void {        // DONE
        const fullData      = Helpers_Misc.getExisted(data.war.getWarEventManager().getWarEventFullData());
        const eventId       = data.eventId;
        const event         = Helpers_Misc.getExisted(fullData.getEventArray().find(v => v.getEventId() === eventId));
        const errorTip      = WarEvents_Events_Utils.getErrorTipForEventCallCountTotal(event);
        const labelError    = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(`[E${eventId}] ${Lang_Utils.getText(Lang_Constants.TextType.B0477)}: ${event.getMaxCallCountTotal()}`);
        this._layoutError.arrangeItems();

        const group = this._groupBtn;
        group.removeAllItems(false);
        group.addItem(this._btnModifyMaxCallCountTotal, false);
        group.arrangeItems();
    }
    private _updateForConditionNode(data: OpenData): void {              // DONE
        const fullData      = Helpers_Misc.getExisted(data.war.getWarEventManager().getWarEventFullData());
        const nodeId        = data.nodeId;
        const node          = Helpers_Misc.getExisted(fullData.getConditionNodeArray()?.find(v => v.getNodeId() === nodeId));
        const errorTip      = WarEvents_ConditionNodes_Utils.getErrorTipForConditionNode(fullData, node);
        const labelError    = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);

        const textForName   = Lang_Utils.getLanguageText({ textArray : node.getNodeNameArray() }) ?? `(${Lang_Utils.getText(Lang_Constants.TextType.B0277)})`;
        const textForDesc   = Lang_Utils.getWarEventConditionNodeDesc(node.getIsNeedAnd(), node.getIsNeedFalse());
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
        const fullData      = Helpers_Misc.getExisted(war.getWarEventManager().getWarEventFullData());
        const conditionId   = data.conditionId;
        const condition     = Helpers_Misc.getExisted(fullData.getConditionArray().find(v => v.getWecCommonData()?.getConditionId() === conditionId));
        const errorTip      = WarEvents_Conditions_Utils_Common.getErrorTipForCondition(fullData, condition, war);
        const labelError    = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);

        const textForName   = Lang_Utils.getLanguageText({ textArray : condition.getWecCommonData()?.getConditionNameArray() }) ?? `(${Lang_Utils.getText(Lang_Constants.TextType.B0277)})`;
        const textForDesc   = WarEvents_Conditions_Utils_Common.getDetailedDescForCondition(condition, war.getGcData());
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
        const fullData      = Helpers_Misc.getExisted(war.getWarEventManager().getWarEventFullData());
        const actionId      = data.actionId;
        const action        = Helpers_Misc.getExisted(fullData.getActionArray().find(v => v.getWeaCommonData()?.getActionId() === actionId));
        const errorTip      = WarEvents_Actions_Utils_Common.getErrorTipForAction(fullData, action, war);
        const labelError    = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);

        const textForName   = Lang_Utils.getLanguageText({ textArray : action.getWeaCommonData()?.getActionNameArray() }) ?? `(${Lang_Utils.getText(Lang_Constants.TextType.B0277)})`;
        const textForDesc   = WarEvents_Actions_Utils_Common.getDetailDescForAction(action, war.getGcData());
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
            const mapRawData        = await Campaigns_Mains_Provider.getCampaignMapRawData(campaignMapData.getCampaignId(), campaignMapData.getCampaignMapId());
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
    isNeedAnd           : AuxiliaryTypes_AuxiliaryTypes.Undefinable<boolean>;
    isNeedFalse         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<boolean>;
    conditionIdArray?   : ConditionIdAndFlags[];
    subNodeIdArray?     : NodeIdAndFlags[];
}): number | null {
    const nodeArray     = fullData.getConditionNodeArray();
    const parentNode    = WarEvents_FullDatas_Utils.getNode(fullData, parentNodeId);
    if (parentNode == null) {
        return null;
    }

    for (let nodeId = 1; ; ++nodeId) {
        if (!nodeArray.some(v => v.getNodeId() === nodeId)) {
            nodeArray.push(WarEventConditionNode.fromJson({
                nodeId                     : nodeId,
                isNeedAnd                  : isNeedAnd,
                isNeedFalse                : isNeedFalse,
                conditionIdAndFlagsArray   : conditionIdArray.map(v => v.toJson()),
                subNodeIdAndFlagsArray     : subNodeIdArray.map(v => v.toJson()),
                nodeNameArray              : [],
                deprecatedSubNodeIdArray   : [],
                deprecatedConditionIdArray : [],
            }));
            nodeArray.sort((v1, v2) => v1.getNodeId() - v2.getNodeId());

            const arr = parentNode.getSubNodeIdAndFlagsArray();
            arr.push(NodeIdAndFlags.fromJson({ nodeId : nodeId }));
            arr.sort((v1, v2) => v1.getNodeId() - v2.getNodeId());

            return nodeId;
        }
    }
}

function checkIsInterchangeable(action1: WarEventAction, action2: WarEventAction): boolean {
    const interchangeableType = WarEvents_Actions_Utils_Common.getInterchangeableTypeId(action1);
    return (interchangeableType !== WarEvents_Actions_Constants_Common.InterchangeableTypeId.NotInterchangeable)
        && (interchangeableType === WarEvents_Actions_Utils_Common.getInterchangeableTypeId(action2));
}

function checkCanNegate(openData: OpenData, fullData: WarEventFullData): boolean {
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
