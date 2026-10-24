import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as FloatText2 from "../../FloatText.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarRuleTemplateWarRule from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import type * as WarEventViewWeMainPanel from "./WeMainPanel.ts";
import * as WarEventsEventsUtils from "../../warEvents/events/Utils.ts";
import * as WarEventsFullDatasUtils from "../../warEvents/fullDatas/Utils.ts";

type TemplateWarRule    = ProtoSchemaCommonProtoWarRuleTemplateWarRule.TemplateWarRule;
type WarEventFullData   = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;

export interface OpenData {
    war                     : MapEditorInterfaceIMeWar.IMeWar;
    gameConfig              : GameConfigGcData.GcData;
    templateWarRuleArray    : TemplateWarRule[];
    fullData                : WarEventFullData;
    selectedEventId         : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _listEvent!            : UiInterfacesIUiScrollList.IUiScrollList<DataForEventRenderer>;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNoEvent!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnDeleteAll!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteRedundancy!  : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,     callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnDeleteAll,           callback: this._onTouchedBtnDeleteAll },
            { ui: this._btnDeleteRedundancy,    callback: this._onTouchedBtnDeleteRedundancy },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listEvent.setItemRendererClass(ConditionRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listEvent.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyWarEventFullDataChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnDeleteAll(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0931),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0320),
            callback: () => {
                const warEventFullData = openData.fullData;
                warEventFullData.getActionArray().length = 0;
                warEventFullData.getConditionArray().length = 0;
                warEventFullData.getConditionNodeArray().length = 0;
                warEventFullData.getEventArray().length = 0;

                for (const templateWarRule of openData.templateWarRuleArray) {
                    const arr = templateWarRule.getWarEventIdArray();
                    (arr) && (arr.length = 0);
                }

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnDeleteRedundancy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0188),
            callback: () => {
                const result = WarEventsFullDatasUtils.checkAndDeleteUnusedComponents(HelpersMisc.getExisted(openData.war.getWarEventManager().getWarEventFullData()));
                FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0063, result.deletedNodesCount, result.deletedConditionsCount, result.deletedActionsCount));
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListConditionAndLabelNoCondition();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0461));
        this._labelNoEvent.setText(LangUtils.getText(LangConstants.TextType.B0278));
        this._btnDeleteAll.setText(LangUtils.getText(LangConstants.TextType.B0931));
        this._btnDeleteRedundancy.setText(LangUtils.getText(LangConstants.TextType.B0498));
    }
    private async _updateListConditionAndLabelNoCondition(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war                   = openData.war;
        const fullData              = openData.fullData;
        const gameConfig            = openData.gameConfig;
        const selectedEventId       = openData.selectedEventId;
        const templateWarRuleArray  = openData.templateWarRuleArray;
        const dataArray             : DataForEventRenderer[] = [];
        for (const eventData of openData.fullData.getEventArray()) {
            dataArray.push({
                war                     : war,
                gameConfig              : gameConfig,
                selectedEventId         : selectedEventId,
                templateWarRuleArray    : templateWarRuleArray,
                eventId                 : HelpersMisc.getExisted(eventData?.getEventId()),
                fullData                : fullData,
                panel                   : this,
            });
        }

        this._labelNoEvent.setIsVisible(!dataArray.length);
        await this._listEvent.bindData(dataArray);
    }
}

interface DataForEventRenderer extends UiTypesUiListItemData.UiListItemData {
    war                     : MapEditorInterfaceIMeWar.IMeWar;
    gameConfig              : GameConfigGcData.GcData;
    templateWarRuleArray    : TemplateWarRule[];
    selectedEventId         : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    eventId                 : number;
    fullData                : WarEventFullData;
    panel                   : Panel;
}
class ConditionRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForEventRenderer> {
    private readonly _labelDesc!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDescTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnDeepClone!     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnShallowClone!  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSelect!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDelete!        : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnDeepClone,       callback: this._onTouchedBtnDeepClone },
            { ui: this._btnShallowClone,    callback: this._onTouchedBtnShallowClone },
            { ui: this._btnSelect,          callback: this._onTouchedBtnSelect },
            { ui: this._btnDelete,          callback: this._onTouchedBtnDelete },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateLabelDesc();
        this._updateBtnSelect();
    }

    private _onTouchedBtnDeepClone(): void {          // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
                callback: () => {
                    const newEventId = WarEventsEventsUtils.cloneEvent(openData.fullData, openData.eventId, false);
                    FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0084, `E${newEventId}`));

                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                },
            });
        }
    }
    private _onTouchedBtnShallowClone(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
                callback: () => {
                    const newEventId = WarEventsEventsUtils.cloneEvent(openData.fullData, openData.eventId, true);
                    FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0084, `E${newEventId}`));

                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                },
            });
        }
    }
    private _onTouchedBtnSelect(): void {        // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        (GamePanelsManager.getRunningPanel(GamePanelsDict.getDict().WeMainPanel) as WarEventViewWeMainPanel.Panel)?.setAndReviseSelectedEventId(openData.eventId, true);
        openData.panel.closePanel();
    }
    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
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

                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                },
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnDeepClone.setLangText(LangConstants.TextType.B0748);
        this._btnShallowClone.setLangText(LangConstants.TextType.B0487);
        this._btnSelect.setLangText(LangConstants.TextType.B0258);
        this._btnDelete.setLangText(LangConstants.TextType.B0220);

        this._updateLabelDesc();
        this._labelDescTitle.setText([
            LangUtils.getText(LangConstants.TextType.B0162),
            LangUtils.getText(LangConstants.TextType.B0749),
        ].join(`\n`));
    }

    private _updateLabelDesc(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId = openData.eventId;
        this._labelDesc.setText([
            HelpersText.getTruncatedText(
                `E${eventId} ${LangUtils.getLanguageText({ textArray: openData.fullData.getEventArray()?.find(v => v.getEventId() === eventId)?.getEventNameArray() }) ?? `----`}`,
                15
            ),
            openData.templateWarRuleArray.filter(rule => rule.getWarEventIdArray()?.some(v => v === eventId)).map(v => `R${v.getRuleId()}`).join(', ') || `----`,
        ].join(`\n`));
    }
    private _updateBtnSelect(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._btnSelect.setIsVisible(openData.selectedEventId !== openData.eventId);
    }
}
