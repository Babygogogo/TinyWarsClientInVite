import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getCampaignMapRawData } from "../../campaigns/mains/Provider.ts";
import { reqCmSetCampaignMapWarEventAction } from "../../campaigns/managements/Gateway.ts";
import { showLang, show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { deleteElementFromList, moveElementInList2, deleteElementFromList2, moveElementInList } from "../../helpers/Collection.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText, getFormattedText, getLanguageText, getTextForYesOrNo, getWarEventConditionNodeDesc } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ConditionIdAndFlags } from "../../proto/schema/CommonProto/WarEvent/ConditionIdAndFlags.ts";
import { ConditionNodeAndActions } from "../../proto/schema/CommonProto/WarEvent/ConditionNodeAndActions.ts";
import { NodeIdAndFlags } from "../../proto/schema/CommonProto/WarEvent/NodeIdAndFlags.ts";
import type {
    WarEventAction as ProtoSchemaCommonProtoWarEventWarEventAction,
} from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import { WarEventConditionNode } from "../../proto/schema/CommonProto/WarEvent/WarEventConditionNode.ts";
import type {
    WarEventFullData as ProtoSchemaCommonProtoWarEventWarEventFullData,
} from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { InterchangeableTypeId } from "../../warEvents/actions/constants/Common.ts";
import {
    cloneAction,
    openActionModifyPanel,
    addDefaultAction,
    getErrorTipForAction,
    getDetailDescForAction,
    getInterchangeableTypeId,
} from "../../warEvents/actions/utils/Common.ts";
import { createAndAddRootNodeInEvent, cloneNode, getErrorTipForConditionNode } from "../../warEvents/conditionNodes/Utils.ts";
import {
    addDefaultCondition,
    openConditionModifyPanel,
    cloneCondition,
    getErrorTipForCondition,
    getDetailedDescForCondition,
} from "../../warEvents/conditions/utils/Common.ts";
import { DescType, Event } from "../../warEvents/Constants.ts";
import {
    cloneEvent,
    getErrorTipForEvent,
    getErrorTipForEventCallCountInPlayerTurn,
    getErrorTipForEventCallCountTotal,
} from "../../warEvents/events/Utils.ts";
import { getNode, getEvent, getCondition, getAction } from "../../warEvents/fullDatas/Utils.ts";

type WarEventFullData           = ProtoSchemaCommonProtoWarEventWarEventFullData;
type WarEventAction             = ProtoSchemaCommonProtoWarEventWarEventAction;

export interface OpenData {
    war                 : IMeWar;
    descType            : DescType;
    eventId             : number;
    actionId?           : number;
    actionIndex?        : number;
    actionBoundNodeId?  : number;
    conditionId?        : number;
    parentNodeId?       : number;
    nodeId?             : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _btnClose!                     : IUiButton;
    private readonly _labelTitle!                   : IUiLabel;

    private readonly _layoutError!                  : IUiLayout;
    private readonly _labelDesc!                    : IUiLabel;
    private readonly _labelError!                   : IUiLabel;

    private readonly _groupBtn!                     : IUiLayout;
    private readonly _btnModifyEventName!           : IUiButton;
    private readonly _btnModifyMaxCallCountPerTurn! : IUiButton;
    private readonly _btnModifyMaxCallCountTotal!   : IUiButton;
    private readonly _btnInitSubNodeToEvent!        : IUiButton;
    private readonly _btnShallowCloneEvent!         : IUiButton;
    private readonly _btnDeepCloneEvent!            : IUiButton;
    private readonly _btnDeleteEvent!               : IUiButton;
    private readonly _btnNegateRootNode!            : IUiButton;

    private readonly _btnRenameNode!                : IUiButton;
    private readonly _btnSwitchNodeAndOr!           : IUiButton;
    private readonly _btnSwitchNodeTrueFalse!       : IUiButton;
    private readonly _btnReplaceNode!               : IUiButton;
    private readonly _btnAddSubNodeToNode!          : IUiButton;
    private readonly _btnAddSubCondition!           : IUiButton;
    private readonly _btnShallowCloneNode!          : IUiButton;
    private readonly _btnDeepCloneNode!             : IUiButton;
    private readonly _btnMoveUpNode!                : IUiButton;
    private readonly _btnDeleteNode!                : IUiButton;

    private readonly _btnRenameCondition!           : IUiButton;
    private readonly _btnModifyCondition!           : IUiButton;
    private readonly _btnReplaceCondition!          : IUiButton;
    private readonly _btnDeepCloneCondition!        : IUiButton;
    private readonly _btnMoveUpCondition!           : IUiButton;
    private readonly _btnDeleteCondition!           : IUiButton;

    private readonly _btnRenameAction!              : IUiButton;
    private readonly _btnModifyAction!              : IUiButton;
    private readonly _btnReplaceAction!             : IUiButton;
    private readonly _btnAddAction!                 : IUiButton;
    private readonly _btnDeepCloneAction!           : IUiButton;
    private readonly _btnShallowCloneAction!        : IUiButton;
    private readonly _btnDeleteAction!              : IUiButton;
    private readonly _btnMoveUpAction!              : IUiButton;
    private readonly _btnUpdateCampaignAction!      : IUiButton;

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
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,             callback: this._onNotifyWarEventFullDataChanged },
            { type: TypeId.MsgCmSetCampaignMapWarEventAction,   callback: this._onNotifyMsgCmSetCampaignMapWarEventAction },
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

        const warEvent = getExisted(openData.war.getWarEventManager().getWarEvent(openData.eventId));
        openPanel(getDict().CommonInputShortLangTextPanel, {
            currentTextArray : warEvent.getEventNameArray(),
            maxTextLength   : Event.MaxNameLength,
            callback        : nameArray => {
                warEvent.setEventNameArray(nameArray);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnModifyMaxCallCountPerTurn(): void { // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventData                         = getExisted(openData.war.getWarEventManager().getWarEventFullData()?.getEventArray()?.find(v => v.getEventId() === openData.eventId));
        const minValue                          = 1;
        const currentValue                      = eventData.getMaxCallCountInPlayerTurn() ?? 1;
        const canBeTriggeredRightAfterAnyEvent  = eventData.getCanBeTriggeredRightAfterAnyEvent() ?? true;
        const textForCurrentOption              = ` (${getText(TextType.B1379)})`;
        openPanel(getDict().CommonConfirmPanel, {
            getTitle               : () => getText(TextType.B1400),
            getContent             : () => getText(TextType.A0954),
            getTextForConfirm      : () => `${getText(TextType.Yes)}${canBeTriggeredRightAfterAnyEvent ? textForCurrentOption : ``}`,
            getTextForCancel       : () => `${getText(TextType.No)}${!canBeTriggeredRightAfterAnyEvent ? textForCurrentOption : ``}`,
            callback            : () => openPanel(getDict().CommonInputIntegerPanel, {
                getTitle           : () => getText(TextType.B0476),
                currentValue    : currentValue,
                minValue        : minValue,
                maxValue        : Event.MaxCallCountInPlayerTurn,
                callback        : (value) => {
                    eventData.setCanBeTriggeredRightAfterAnyEvent(true);
                    eventData.setMaxCallCountInPlayerTurn(value);
                    dispatch(TypeId.WarEventFullDataChanged);
                },
            }),
            callbackOnCancel    : () => openPanel(getDict().CommonInputIntegerPanel, {
                getTitle           : () => getText(TextType.B0476),
                currentValue    : currentValue,
                minValue        : minValue,
                maxValue        : Event.MaxCallCountTotal,
                callback        : (value) => {
                    eventData.setCanBeTriggeredRightAfterAnyEvent(false);
                    eventData.setMaxCallCountInPlayerTurn(value);
                    dispatch(TypeId.WarEventFullDataChanged);
                },
            }),
        });
    }
    private _onTouchedBtnModifyMaxCallCountTotal(): void {   // DONE
        const data = this.getOpenData();
        if (data) {
            const minValue  = 1;
            const maxValue  = Event.MaxCallCountTotal;
            const eventData = getExisted(data.war.getWarEventManager().getWarEventFullData()?.getEventArray().find(v => v.getEventId() === data.eventId));
            openPanel(getDict().CommonInputIntegerPanel, {
                getTitle           : () => getText(TextType.B0477),
                currentValue    : eventData.getMaxCallCountTotal() ?? 1,
                minValue,
                maxValue,
                callback        : (value) => {
                    eventData.setMaxCallCountTotal(value);
                    dispatch(TypeId.WarEventFullDataChanged);
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
        const fullData  = getExisted(openData.war.getWarEventManager().getWarEventFullData());
        openPanel(getDict().CommonConfirmPanel, {
            getContent          : () => getText(TextType.A0993),
            showButtonClose     : true,
            getTextForConfirm   : () => getText(TextType.B1477),
            getTextForCancel    : () => getText(TextType.B0258),
            callback            : () => {
                const newNodeId = createAndAddRootNodeInEvent({
                    fullData    : fullData,
                    eventId     : eventId,
                    isNeedAnd   : true,
                    isNeedFalse : null,
                });
                if (newNodeId == null) {
                    showLang(TextType.YouCanNotDoThisRightNow);
                } else {
                    show(getFormattedText(TextType.F0084, `N${newNodeId}`));
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
            callbackOnCancel    : () => {
                openPanel(getDict().WeNodeReplacePanel, {
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
        openPanel(getDict().CommonConfirmPanel, {
            getTitle            : () => `${getText(TextType.B1478)} E${eventId}`,
            getContent          : () => getText(TextType.A0990),
            showButtonClose     : true,
            getTextForConfirm   : () => getText(TextType.B0487),
            getTextForCancel    : () => getText(TextType.B0748),
            callback            : () => {
                const newEventId = cloneEvent(getExisted(openData.war.getWarEventManager().getWarEventFullData()), eventId, true);
                show(getFormattedText(TextType.F0084, `E${newEventId}`));

                this.closePanel();
                dispatch(TypeId.WarEventFullDataChanged);
            },
            callbackOnCancel    : () => {
                const newEventId = cloneEvent(getExisted(openData.war.getWarEventManager().getWarEventFullData()), eventId, false);
                show(getFormattedText(TextType.F0084, `E${newEventId}`));

                this.closePanel();
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnDeepCloneEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId = openData.eventId;
        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => `${getText(TextType.B0748)} E${eventId}`,
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback: () => {
                const newEventId = cloneEvent(getExisted(openData.war.getWarEventManager().getWarEventFullData()), eventId, false);
                show(getFormattedText(TextType.F0084, `E${newEventId}`));

                this.closePanel();
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnDeleteEvent(): void {               // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId = openData.eventId;
        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => `${getText(TextType.B0479)} E${eventId}`,
            getContent : () => getText(TextType.A0935),
            callback: () => {
                const war           = openData.war;
                const eventArray    = getExisted(war.getWarEventManager().getWarEventFullData()?.getEventArray());
                deleteElementFromList(eventArray, eventArray.find(v => v.getEventId() === eventId));

                for (const templateWarRule of war.getTemplateWarRuleArray()) {
                    deleteElementFromList(templateWarRule.getWarEventIdArray(), eventId);
                }

                this.closePanel();
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnNegateRootNode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const fullData      = getExisted(openData.war.getWarEventManager().getWarEventFullData());
        const parentNodeId  = openData.parentNodeId;
        {
            const nodeId = openData.nodeId;
            if (nodeId != null) {
                if (parentNodeId != null) {
                    const subNodeIdAndFlags = fullData.getConditionNodeArray().find(v => v.getNodeId() === parentNodeId)?.getSubNodeIdAndFlagsArray()?.find(v => v.getNodeId() === nodeId);
                    if (subNodeIdAndFlags == null) {
                        showLang(TextType.YouCanNotDoThisRightNow);
                    } else {
                        openPanel(getDict().CommonConfirmPanel, {
                            getContent  : () => getText(TextType.A0991),
                            callback    : () => {
                                subNodeIdAndFlags.setIsNegated(!subNodeIdAndFlags.getIsNegated());
                                showLang(TextType.OperationSucceeded);
                                dispatch(TypeId.WarEventFullDataChanged);
                            },
                        });
                    }
                } else {
                    const nodeIdAndFlags = fullData.getEventArray().find(v => v.getEventId() === openData.eventId)?.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)?.getNodeIdAndFlags();
                    if (nodeIdAndFlags == null) {
                        showLang(TextType.YouCanNotDoThisRightNow);
                    } else {
                        openPanel(getDict().CommonConfirmPanel, {
                            getContent  : () => getText(TextType.A0991),
                            callback    : () => {
                                nodeIdAndFlags.setIsNegated(!nodeIdAndFlags.getIsNegated());
                                showLang(TextType.OperationSucceeded);
                                dispatch(TypeId.WarEventFullDataChanged);
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
                    showLang(TextType.YouCanNotDoThisRightNow);
                } else {
                    const conditionIdAndFlags = fullData.getConditionNodeArray().find(v => v.getNodeId() === parentNodeId)?.getConditionIdAndFlagsArray()?.find(v => v.getConditionId() === conditionId);
                    if (conditionIdAndFlags == null) {
                        showLang(TextType.YouCanNotDoThisRightNow);
                    } else {
                        openPanel(getDict().CommonConfirmPanel, {
                            getContent  : () => getText(TextType.A0991),
                            callback    : () => {
                                conditionIdAndFlags.setIsNegated(!conditionIdAndFlags.getIsNegated());
                                showLang(TextType.OperationSucceeded);
                                dispatch(TypeId.WarEventFullDataChanged);
                            },
                        });
                    }
                }
                return;
            }
        }

        showLang(TextType.YouCanNotDoThisRightNow);
    }

    private _onTouchedBtnRenameNode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const node = getExisted(openData.war.getWarEventManager().getWarEventFullData()?.getConditionNodeArray()?.find(v => v.getNodeId() === openData.nodeId));
        openPanel(getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : node.getNodeNameArray(),
            maxTextLength       : Event.MaxNameLength,
            allowEmpty          : true,
            callback            : nameArray => {
                node.setNodeNameArray(nameArray);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnSwitchNodeAndOr(): void {           // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const node = getExisted(openData.war.getWarEventManager().getWarEventFullData()?.getConditionNodeArray().find(v => v.getNodeId() === openData.nodeId));
        node.setIsNeedAnd(node.getIsNeedAnd() ? null : true);
        dispatch(TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnSwitchNodeTrueFalse(): void {           // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const node = getExisted(openData.war.getWarEventManager().getWarEventFullData()?.getConditionNodeArray().find(v => v.getNodeId() === openData.nodeId));
        node.setIsNeedFalse(node.getIsNeedFalse() ? null : true);
        dispatch(TypeId.WarEventFullDataChanged);
    }
    private _onTouchedBtnReplaceNode(): void {               // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().WeNodeReplacePanel, {
            eventId         : openData.eventId,
            parentNodeId    : openData.parentNodeId,
            oldNodeId       : openData.nodeId ?? null,
            fullData        : getExisted(openData.war.getWarEventManager().getWarEventFullData()),
        });
    }
    private _onTouchedBtnAddSubNodeToNode(): void {          // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const parentNodeId  = getExisted(openData.nodeId);
        const fullData      = getExisted(war.getWarEventManager().getWarEventFullData());
        openPanel(getDict().CommonConfirmPanel, {
            getContent          : () => getText(TextType.A0989),
            showButtonClose     : true,
            getTextForConfirm   : () => getText(TextType.B1477),
            getTextForCancel    : () => getText(TextType.B0258),
            callback            : () => {
                const subNodeId = createSubNodeInParentNode({
                    fullData        : fullData,
                    parentNodeId    : parentNodeId,
                    isNeedAnd       : true,
                    isNeedFalse     : null,
                });
                if (subNodeId == null) {
                    showLang(TextType.YouCanNotDoThisRightNow);
                } else {
                    dispatch(TypeId.WarEventFullDataChanged);
                    show(getFormattedText(TextType.F0206, subNodeId));
                }
            },
            callbackOnCancel    : () => {
                openPanel(getDict().WeNodeReplacePanel, {
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
        const fullData  = getExisted(war.getWarEventManager().getWarEventFullData());
        const nodeId    = getExisted(openData.nodeId);
        openPanel(getDict().CommonConfirmPanel, {
            getContent          : () => getText(TextType.A0992),
            showButtonClose     : true,
            getTextForConfirm   : () => getText(TextType.B1477),
            getTextForCancel    : () => getText(TextType.B0258),
            callback            : () => {
                const newConditionId = addDefaultCondition(fullData, nodeId);
                show(getFormattedText(TextType.F0084, `C${newConditionId}`));
                dispatch(TypeId.WarEventFullDataChanged);
            },
            callbackOnCancel    : () => {
                openPanel(getDict().WeConditionReplacePanel, {
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

        const nodeId    = getExisted(openData.nodeId);
        const callback  = (isShallowClone: boolean) => {
            const fullData      = getExisted(openData.war.getWarEventManager().getWarEventFullData());
            const newNodeId     = cloneNode(fullData, nodeId, isShallowClone);
            const parentNodeId  = openData.parentNodeId;
            if (parentNodeId != null) {
                getExisted(getNode(fullData, parentNodeId)?.getSubNodeIdAndFlagsArray()).push(NodeIdAndFlags.fromJson({ nodeId: newNodeId }));
            } else {
                const srcActionIdArray = fullData.getEventArray().find(v => v.getEventId() === openData.eventId)?.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)?.getActionIdArray() ?? [];
                getExisted(getEvent(fullData, openData.eventId)).getRootNodeAndActionsArray().push(ConditionNodeAndActions.fromJson({
                    nodeIdAndFlags  : { nodeId: newNodeId },
                    actionIdArray   : isShallowClone
                        ? srcActionIdArray.concat()
                        : srcActionIdArray.map(v => cloneAction(fullData, v)),
                }));
            }
            show(getFormattedText(TextType.F0084, `N${newNodeId}`));

            this.closePanel();
            dispatch(TypeId.WarEventFullDataChanged);
        };

        openPanel(getDict().CommonConfirmPanel, {
            getTitle            : () => `${getText(TextType.B1478)} N${nodeId}`,
            getContent          : () => getText(TextType.A0990),
            showButtonClose     : true,
            getTextForConfirm   : () => getText(TextType.B0487),
            getTextForCancel    : () => getText(TextType.B0748),
            callback            : () => callback(true),
            callbackOnCancel    : () => callback(false),
        });
    }
    private _onTouchedBtnDeepCloneNode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nodeId = getExisted(openData.nodeId);
        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => `${getText(TextType.B0748)} N${nodeId}`,
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback: () => {
                const fullData      = getExisted(openData.war.getWarEventManager().getWarEventFullData());
                const newNodeId     = cloneNode(fullData, nodeId, false);
                const parentNodeId  = openData.parentNodeId;
                if (parentNodeId != null) {
                    getExisted(getNode(fullData, parentNodeId)?.getSubNodeIdAndFlagsArray()).push(NodeIdAndFlags.fromJson({ nodeId: newNodeId }));
                } else {
                    getExisted(getEvent(fullData, openData.eventId)).getRootNodeAndActionsArray().push(ConditionNodeAndActions.fromJson({
                        nodeIdAndFlags  : { nodeId: newNodeId },
                        actionIdArray   : [],
                    }));
                }
                show(getFormattedText(TextType.F0084, `N${newNodeId}`));

                this.closePanel();
                dispatch(TypeId.WarEventFullDataChanged);
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
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        if (parentNodeId != null) {
            const nodeIdAndFlagsArray = fullData.getConditionNodeArray().find(v => (v.getNodeId() ?? 0) === parentNodeId)?.getSubNodeIdAndFlagsArray();
            if (nodeIdAndFlagsArray == null) {
                showLang(TextType.YouCanNotDoThisRightNow);
                return;
            }

            if (moveElementInList2(nodeIdAndFlagsArray, v => v.getNodeId() === nodeId, -1)) {
                dispatch(TypeId.WarEventFullDataChanged);
                showLang(TextType.OperationSucceeded);
            } else {
                showLang(TextType.YouCanNotDoThisRightNow);
            }

        } else {
            const eventId                   = openData.eventId;
            const rootNodeAndActionsArray   = fullData.getEventArray().find(v => v.getEventId() === eventId)?.getRootNodeAndActionsArray();
            if (rootNodeAndActionsArray == null) {
                showLang(TextType.YouCanNotDoThisRightNow);
                return;
            }

            if (moveElementInList2(rootNodeAndActionsArray, v => v.getNodeIdAndFlags()?.getNodeId() === nodeId, -1)) {
                dispatch(TypeId.WarEventFullDataChanged);
                showLang(TextType.OperationSucceeded);
            } else {
                showLang(TextType.YouCanNotDoThisRightNow);
            }
        }
    }
    private _onTouchedBtnDeleteNode(): void {                // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nodeId = openData.nodeId;
        openPanel(getDict().CommonConfirmPanel, {
            getTitle    : () => `${getText(TextType.B0481)} N${nodeId}`,
            getContent  : () => getText(TextType.A0934),
            callback    : () => {
                const fullData      = getExisted(openData.war.getWarEventManager().getWarEventFullData());
                const parentNodeId  = openData.parentNodeId;
                if (parentNodeId != null) {
                    deleteElementFromList2(
                        getExisted(fullData.getConditionNodeArray().find(v => v.getNodeId() === openData.parentNodeId)).getSubNodeIdAndFlagsArray(),
                        v => v.getNodeId() === nodeId
                    );
                } else {
                    deleteElementFromList2(
                        getExisted(fullData.getEventArray().find(v => v.getEventId() === openData.eventId)).getRootNodeAndActionsArray(),
                        v => v.getNodeIdAndFlags()?.getNodeId() === nodeId
                    );
                }

                // WarEventHelper.checkAndDeleteUnusedNode(fullData, nodeId);

                this.closePanel();
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnRenameCondition(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const data = getExisted(getCondition(getExisted(openData.war.getWarEventManager().getWarEventFullData()), getExisted(openData.conditionId))).createIfNotExistsWecCommonData();
        openPanel(getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : data.getConditionNameArray(),
            maxTextLength       : Event.MaxNameLength,
            allowEmpty          : true,
            callback            : nameArray => {
                data.setConditionNameArray(nameArray);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnModifyCondition(): void {           // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const fullData = getExisted(openData.war.getWarEventManager().getWarEventFullData());
        openConditionModifyPanel({
            fullData    : fullData,
            condition   : getExisted(getCondition(fullData, getExisted(openData.conditionId))),
            war         : openData.war,
        });
    }
    private _onTouchedBtnReplaceCondition(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        openPanel(getDict().WeConditionReplacePanel, {
            gameConfig      : war.getGcData(),
            fullData        : getExisted(war.getWarEventManager().getWarEventFullData()),
            parentNodeId    : getExisted(openData.parentNodeId),
            oldConditionId  : getExisted(openData.conditionId),
        });
    }
    private _onTouchedBtnDeepCloneCondition(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const conditionId = getExisted(openData.conditionId);
        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => `${getText(TextType.B0748)} C${conditionId}`,
            getContent : () => getText(TextType.AreYouSureYouWantToContinue),
            callback: () => {
                const fullData                  = getExisted(openData.war.getWarEventManager().getWarEventFullData());
                const conditionIdAndFlagsArray  = getExisted(fullData.getConditionNodeArray().find(v => v.getNodeId() === openData.parentNodeId)?.getConditionIdAndFlagsArray());
                const newConditionId            = cloneCondition(fullData, conditionId);
                conditionIdAndFlagsArray.push(ConditionIdAndFlags.fromJson({ conditionId: newConditionId }));
                conditionIdAndFlagsArray.sort((v1, v2) => v1.getConditionId() - v2.getConditionId());
                show(getFormattedText(TextType.F0084, `C${newConditionId}`));

                this.closePanel();
                dispatch(TypeId.WarEventFullDataChanged);
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
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const conditionIdAndFlagsArray = fullData.getConditionNodeArray().find(v => v.getNodeId() === parentNodeId)?.getConditionIdAndFlagsArray();
        if (conditionIdAndFlagsArray == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        if (moveElementInList2(conditionIdAndFlagsArray, v => v.getConditionId() === conditionId, -1)) {
            dispatch(TypeId.WarEventFullDataChanged);
            showLang(TextType.OperationSucceeded);
        } else {
            showLang(TextType.YouCanNotDoThisRightNow);
        }
    }
    private _onTouchedBtnDeleteCondition(): void {           // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const conditionId = openData.conditionId;
        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => `${getText(TextType.B0485)} C${conditionId}`,
            getContent : () => getText(TextType.A0934),
            callback: () => {
                const fullData = getExisted(openData.war.getWarEventManager().getWarEventFullData());
                deleteElementFromList2(
                    getExisted(fullData.getConditionNodeArray().find(v => v.getNodeId() === openData.parentNodeId)?.getConditionIdAndFlagsArray()),
                    v => v.getConditionId() === conditionId,
                    1
                );
                // WarEventHelper.checkAndDeleteUnusedCondition(fullData, conditionId);

                this.closePanel();
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnRenameAction(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const data = getExisted(getAction(getExisted(openData.war.getWarEventManager().getWarEventFullData()), getExisted(openData.actionId))).createIfNotExistsWeaCommonData();
        openPanel(getDict().CommonInputShortLangTextPanel, {
            currentTextArray    : data.getActionNameArray(),
            maxTextLength       : Event.MaxNameLength,
            allowEmpty          : true,
            callback            : nameArray => {
                data.setActionNameArray(nameArray);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnModifyAction(): void {              // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const fullData  = getExisted(war.getWarEventManager().getWarEventFullData());
        openActionModifyPanel(war, fullData, getExisted(getAction(fullData, getExisted(openData.actionId))));
    }
    private _onTouchedBtnReplaceAction(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nodeId = openData.actionBoundNodeId;
        if (nodeId == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const war = openData.war;
        openPanel(getDict().WeActionReplacePanel, {
            war         : war,
            fullData    : getExisted(war.getWarEventManager().getWarEventFullData()),
            eventId     : openData.eventId,
            nodeId      : nodeId,
            oldActionId    : getExisted(openData.actionId),
            oldActionIndex : getExisted(openData.actionIndex),
        });
    }
    private _onTouchedBtnAddAction(): void {                 // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nodeId = openData.nodeId;
        if (nodeId == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const war       = openData.war;
        const fullData  = getExisted(war.getWarEventManager().getWarEventFullData());
        openPanel(getDict().CommonConfirmPanel, {
            getContent          : () => getText(TextType.A0994),
            showButtonClose     : true,
            getTextForConfirm   : () => getText(TextType.B1477),
            getTextForCancel    : () => getText(TextType.B0258),
            callback            : () => {
                const actionIndex = openData.actionIndex;
                const newActionId = addDefaultAction({
                    fullData    : fullData,
                    eventId     : openData.eventId,
                    nodeId      : nodeId,
                    actionIndex : actionIndex == null ? null : actionIndex + 1,
                });
                if (newActionId == null) {
                    showLang(TextType.YouCanNotDoThisRightNow);
                } else {
                    show(getFormattedText(TextType.F0084, `A${newActionId}`));
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            },
            callbackOnCancel    : () => {
                openPanel(getDict().WeActionReplacePanel, {
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

        const actionId = getExisted(openData.actionId);
        openPanel(getDict().CommonConfirmPanel, {
            getTitle    : () => `${getText(TextType.B0748)} A${actionId}`,
            getContent  : () => getText(TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                const actionBoundNodeId = openData.actionBoundNodeId;
                if (actionBoundNodeId == null) {
                    showLang(TextType.YouCanNotDoThisRightNow);
                } else {
                    const fullData      = getExisted(openData.war.getWarEventManager().getWarEventFullData());
                    const newActionId   = cloneAction(fullData, actionId);
                    getEvent(fullData, openData.eventId)
                        ?.getRootNodeAndActionsArray()
                        .find(v => v.getNodeIdAndFlags()?.getNodeId() === actionBoundNodeId)
                        ?.getActionIdArray()
                        .splice(getExisted(openData.actionIndex) + 1, 0, newActionId);
                    show(getFormattedText(TextType.F0084, `A${newActionId}`));

                    dispatch(TypeId.WarEventFullDataChanged);
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
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            const actionId = getExisted(openData.actionId);
            getEvent(getExisted(openData.war.getWarEventManager().getWarEventFullData()), openData.eventId)
                ?.getRootNodeAndActionsArray()
                .find(v => v.getNodeIdAndFlags()?.getNodeId() === actionBoundNodeId)
                ?.getActionIdArray()
                .splice(getExisted(openData.actionIndex) + 1, 0, actionId);

            show(getFormattedText(TextType.F0084, `A${actionId}`));
            dispatch(TypeId.WarEventFullDataChanged);
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
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const eventId       = openData.eventId;
        const actionIdArray = fullData.getEventArray().find(v => (v.getEventId() ?? 0) === eventId)?.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === actionBoundNodeId)?.getActionIdArray();
        if (actionIdArray == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        if (moveElementInList(actionIdArray, actionId, -1)) {
            dispatch(TypeId.WarEventFullDataChanged);
            showLang(TextType.OperationSucceeded);
        } else {
            showLang(TextType.YouCanNotDoThisRightNow);
        }
    }
    private _onTouchedBtnDeleteAction(): void {              // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const actionBoundNodeId = openData.actionBoundNodeId;
        if (actionBoundNodeId == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle    : () => `${getText(TextType.B0486)} A${openData.actionId}`,
            getContent  : () => getText(TextType.A0934),
            callback    : () => {
                const eventId = openData.eventId;
                openData.war.getWarEventManager().getWarEventFullData()?.getEventArray().find(v => v.getEventId() === eventId)
                    ?.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === actionBoundNodeId)
                    ?.getActionIdArray().splice(getExisted(openData.actionIndex), 1);

                this.closePanel();
                dispatch(TypeId.WarEventFullDataChanged);
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
                openPanel(getDict().CommonConfirmPanel, {
                    getContent  : () => getFormattedText(TextType.F0005, actionId, campaignId, campaignMapId),
                    callback    : () => reqCmSetCampaignMapWarEventAction(campaignId, campaignMapId, action),
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
        showLang(TextType.OperationSucceeded);
    }

    private _updateComponentsForLanguage(): void {                              // DONE
        this._btnClose.setText(getText(TextType.B0146));

        this._btnShallowCloneEvent.setLangText(TextType.B1478);
        this._btnDeepCloneEvent.setLangText(TextType.B0748);
        this._btnDeleteEvent.setLangText(TextType.B0479);
        this._btnModifyEventName.setLangText(TextType.B0495);
        this._btnModifyMaxCallCountPerTurn.setLangText(TextType.B0317);
        this._btnModifyMaxCallCountTotal.setLangText(TextType.B0317);
        this._btnInitSubNodeToEvent.setLangText(TextType.B0494);
        this._btnNegateRootNode.setLangText(TextType.B1476);

        this._btnRenameNode.setLangText(TextType.B0495);
        this._btnSwitchNodeAndOr.setLangText(TextType.B0482);
        this._btnSwitchNodeTrueFalse.setLangText(TextType.B1107);
        this._btnReplaceNode.setLangText(TextType.B0480);
        this._btnAddSubCondition.setLangText(TextType.B0483);
        this._btnAddSubNodeToNode.setLangText(TextType.B0484);
        this._btnShallowCloneNode.setLangText(TextType.B1478);
        this._btnDeepCloneNode.setLangText(TextType.B0748);
        this._btnMoveUpNode.setLangText(TextType.B0463);
        this._btnDeleteNode.setLangText(TextType.B0499);

        this._btnRenameCondition.setLangText(TextType.B0495);
        this._btnModifyCondition.setLangText(TextType.B0501);
        this._btnReplaceCondition.setLangText(TextType.B0500);
        this._btnDeepCloneCondition.setLangText(TextType.B0748);
        this._btnMoveUpCondition.setLangText(TextType.B0463);
        this._btnDeleteCondition.setLangText(TextType.B0485);

        this._btnRenameAction.setLangText(TextType.B0495);
        this._btnModifyAction.setLangText(TextType.B0317);
        this._btnReplaceAction.setLangText(TextType.B0480);
        this._btnAddAction.setLangText(TextType.B0496);
        this._btnDeepCloneAction.setLangText(TextType.B0748);
        this._btnShallowCloneAction.setLangText(TextType.B0487);
        this._btnMoveUpAction.setLangText(TextType.B0463);
        this._btnDeleteAction.setLangText(TextType.B0220);
        this._btnUpdateCampaignAction.setLangText(TextType.B0125);

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
        if (descType === DescType.Action) {
            label.setText(`${getText(TextType.B0317)} A${openData.actionId || `???`}`);
        } else if (descType === DescType.Condition) {
            label.setText(`${getText(TextType.B0317)} C${openData.conditionId || `???`}`);
        } else if (descType === DescType.ConditionNode) {
            label.setText(`${getText(TextType.B0317)} N${openData.nodeId || `???`}`);
        } else if (descType === DescType.EventName) {
            label.setText(`${getText(TextType.B0317)} E${openData.eventId || `???`}`);
        } else if (descType === DescType.EventMaxCallCountInPlayerTurn) {
            label.setText(`${getText(TextType.B0317)} E${openData.eventId || `???`}`);
        } else if (descType === DescType.EventMaxCallCountTotal) {
            label.setText(`${getText(TextType.B0317)} E${openData.eventId || `???`}`);
        } else {
            throw newError(`Invalid descType: ${descType}`, ClientErrorCode.WeCommandPanel_UpdateLabelTitle_00);
        }
    }

    private _updateLabelDescAndButtons(): void {                                          // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const descType = openData.descType;
        if (descType === DescType.EventName) {
            this._updateForEvent(openData);
        } else if (descType === DescType.EventMaxCallCountInPlayerTurn) {
            this._updateForEventCallCountInPlayerTurn(openData);
        } else if (descType === DescType.EventMaxCallCountTotal) {
            this._updateForEventCallCountTotal(openData);
        } else if (descType === DescType.ConditionNode) {
            this._updateForConditionNode(openData);
        } else if (descType === DescType.Condition) {
            this._updateForCondition(openData);
        } else if (descType === DescType.Action) {
            this._updateForAction(openData);
        } else {
            throw newError(`Invalid descType: ${descType}`, ClientErrorCode.WeCommandPanel_UpdateLabelDescAndButtons_00);
        }
    }
    private _updateForEvent(data: OpenData): void {                      // DONE
        const fullData      = getExisted(data.war.getWarEventManager().getWarEventFullData());
        const eventId       = data.eventId;
        const event         = getExisted(fullData.getEventArray().find(v => v.getEventId() === eventId));
        const errorTip      = getErrorTipForEvent(fullData, event);
        const labelError    = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(`[E${eventId}] ${getLanguageText({ textArray: event.getEventNameArray() })}`);
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
        const fullData              = getExisted(data.war.getWarEventManager().getWarEventFullData());
        const eventId               = data.eventId;
        const event                 = getExisted(fullData.getEventArray().find(v => v.getEventId() === eventId));
        const errorTip              = getErrorTipForEventCallCountInPlayerTurn(event);
        const textForMaxCallCount   = `${getText(TextType.B0476)}: ${event.getMaxCallCountInPlayerTurn()}`;
        const textForTrigger        = `${getText(TextType.B1400)}: ${getTextForYesOrNo(event.getCanBeTriggeredRightAfterAnyEvent() ?? true)}`;
        const labelError            = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(`[E${eventId}] ${textForMaxCallCount}, ${textForTrigger}`);
        this._layoutError.arrangeItems();

        const group = this._groupBtn;
        group.removeAllItems(false);
        group.addItem(this._btnModifyMaxCallCountPerTurn, false);
        group.arrangeItems();
    }
    private _updateForEventCallCountTotal(data: OpenData): void {        // DONE
        const fullData      = getExisted(data.war.getWarEventManager().getWarEventFullData());
        const eventId       = data.eventId;
        const event         = getExisted(fullData.getEventArray().find(v => v.getEventId() === eventId));
        const errorTip      = getErrorTipForEventCallCountTotal(event);
        const labelError    = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(`[E${eventId}] ${getText(TextType.B0477)}: ${event.getMaxCallCountTotal()}`);
        this._layoutError.arrangeItems();

        const group = this._groupBtn;
        group.removeAllItems(false);
        group.addItem(this._btnModifyMaxCallCountTotal, false);
        group.arrangeItems();
    }
    private _updateForConditionNode(data: OpenData): void {              // DONE
        const fullData      = getExisted(data.war.getWarEventManager().getWarEventFullData());
        const nodeId        = data.nodeId;
        const node          = getExisted(fullData.getConditionNodeArray()?.find(v => v.getNodeId() === nodeId));
        const errorTip      = getErrorTipForConditionNode(fullData, node);
        const labelError    = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);

        const textForName   = getLanguageText({ textArray: node.getNodeNameArray() }) ?? `(${getText(TextType.B0277)})`;
        const textForDesc   = getWarEventConditionNodeDesc(node.getIsNeedAnd(), node.getIsNeedFalse());
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
        const fullData      = getExisted(war.getWarEventManager().getWarEventFullData());
        const conditionId   = data.conditionId;
        const condition     = getExisted(fullData.getConditionArray().find(v => v.getWecCommonData()?.getConditionId() === conditionId));
        const errorTip      = getErrorTipForCondition(fullData, condition, war);
        const labelError    = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);

        const textForName   = getLanguageText({ textArray: condition.getWecCommonData()?.getConditionNameArray() }) ?? `(${getText(TextType.B0277)})`;
        const textForDesc   = getDetailedDescForCondition(condition, war.getGcData());
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
        const fullData      = getExisted(war.getWarEventManager().getWarEventFullData());
        const actionId      = data.actionId;
        const action        = getExisted(fullData.getActionArray().find(v => v.getWeaCommonData()?.getActionId() === actionId));
        const errorTip      = getErrorTipForAction(fullData, action, war);
        const labelError    = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);

        const textForName   = getLanguageText({ textArray: action.getWeaCommonData()?.getActionNameArray() }) ?? `(${getText(TextType.B0277)})`;
        const textForDesc   = getDetailDescForAction(action, war.getGcData());
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
            const mapRawData        = await getCampaignMapRawData(campaignMapData.getCampaignId() ?? 0, campaignMapData.getCampaignMapId() ?? 0);
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
    isNeedAnd           : Undefinable<boolean>;
    isNeedFalse         : Undefinable<boolean>;
    conditionIdArray?   : ConditionIdAndFlags[];
    subNodeIdArray?     : NodeIdAndFlags[];
}): number | null {
    const nodeArray     = fullData.getConditionNodeArray();
    const parentNode    = getNode(fullData, parentNodeId);
    if (parentNode == null) {
        return null;
    }

    for (let nodeId = 1; ; ++nodeId) {
        if (!nodeArray.some(v => v.getNodeId() === nodeId)) {
            nodeArray.push(WarEventConditionNode.fromJson({
                nodeId                      : nodeId,
                isNeedAnd                   : isNeedAnd,
                isNeedFalse                 : isNeedFalse,
                conditionIdAndFlagsArray    : conditionIdArray.map(v => v.toJson()),
                subNodeIdAndFlagsArray      : subNodeIdArray.map(v => v.toJson()),
                nodeNameArray               : [],
                deprecatedSubNodeIdArray    : [],
                deprecatedConditionIdArray  : [],
            }));
            nodeArray.sort((v1, v2) => getExisted(v1.getNodeId()) - getExisted(v2.getNodeId()));

            const arr = parentNode.getSubNodeIdAndFlagsArray();
            arr.push(NodeIdAndFlags.fromJson({ nodeId: nodeId }));
            arr.sort((v1, v2) => v1.getNodeId() - v2.getNodeId());

            return nodeId;
        }
    }
}

function checkIsInterchangeable(action1: WarEventAction, action2: WarEventAction): boolean {
    const interchangeableType = getInterchangeableTypeId(action1);
    return (interchangeableType !== InterchangeableTypeId.NotInterchangeable)
        && (interchangeableType === getInterchangeableTypeId(action2));
}

function checkCanNegate(openData: OpenData, fullData: ProtoSchemaCommonProtoWarEventWarEventFullData): boolean {
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
