import {
    WarEvents_FullDatas_Utils,
    WarEvents_Events_Utils,
    Helpers_Collection,
    Notifications_Dispatcher,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GamePanels_Manager,
    Helpers_Text,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type GameConfigs_GameConfig,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    type AuxiliaryTypes_AuxiliaryTypes,
    type WarEvent_View_WeMainPanel,
} from "../../internal.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";

export interface OpenData {
    war                     : MapEditor_Interface_IMeWar.IMeWar;
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    templateWarRuleArray    : TemplateWarRule[];
    fullData                : WarEventFullData;
    selectedEventId         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listEvent!            : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForEventRenderer>;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNoEvent!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnDeleteAll!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteRedundancy!  : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,             callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.WarEventFullDataChanged,     callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._btnDeleteAll,           callback : this._onTouchedBtnDeleteAll },
            { ui : this._btnDeleteRedundancy,    callback : this._onTouchedBtnDeleteRedundancy },
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0931),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0320),
            callback   : () => {
                const warEventFullData = openData.fullData;
                warEventFullData.getActionArray().length = 0;
                warEventFullData.getConditionArray().length = 0;
                warEventFullData.getConditionNodeArray().length = 0;
                warEventFullData.getEventArray().length = 0;

                for (const templateWarRule of openData.templateWarRuleArray) {
                    const arr = templateWarRule.getWarEventIdArray();
                    (arr) && (arr.length = 0);
                }

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnDeleteRedundancy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0188),
            callback   : () => {
                const result = WarEvents_FullDatas_Utils.checkAndDeleteUnusedComponents(Helpers_Misc.getExisted(openData.war.getWarEventManager().getWarEventFullData()));
                FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0063, result.deletedNodesCount, result.deletedConditionsCount, result.deletedActionsCount));
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListConditionAndLabelNoCondition();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0461);
        this._labelNoEvent.setLangText(Lang_Constants.TextType.B0278);
        this._btnDeleteAll.setLangText(Lang_Constants.TextType.B0931);
        this._btnDeleteRedundancy.setLangText(Lang_Constants.TextType.B0498);
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
                war                  : war,
                gameConfig           : gameConfig,
                selectedEventId      : selectedEventId,
                templateWarRuleArray : templateWarRuleArray,
                eventId              : eventData?.getEventId(),
                fullData             : fullData,
                panel                : this,
            });
        }

        this._labelNoEvent.setIsVisible(!dataArray.length);
        await this._listEvent.bindData(dataArray);
    }
}

interface DataForEventRenderer extends Ui_Types_UiListItemData.UiListItemData {
    war                     : MapEditor_Interface_IMeWar.IMeWar;
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    templateWarRuleArray    : TemplateWarRule[];
    selectedEventId         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    eventId                 : number;
    fullData                : WarEventFullData;
    panel                   : Panel;
}
class ConditionRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForEventRenderer> {
    private readonly _labelDesc!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDescTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnDeepClone!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnShallowClone!  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSelect!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDelete!        : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnDeepClone,       callback : this._onTouchedBtnDeepClone },
            { ui : this._btnShallowClone,    callback : this._onTouchedBtnShallowClone },
            { ui : this._btnSelect,          callback : this._onTouchedBtnSelect },
            { ui : this._btnDelete,          callback : this._onTouchedBtnDelete },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
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
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
                callback   : () => {
                    const newEventId = WarEvents_Events_Utils.cloneEvent(openData.fullData, openData.eventId, false);
                    FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0084, `E${newEventId}`));

                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
                callback   : () => {
                    const newEventId = WarEvents_Events_Utils.cloneEvent(openData.fullData, openData.eventId, true);
                    FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0084, `E${newEventId}`));

                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                },
            });
        }
    }
    private _onTouchedBtnSelect(): void {        // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        (GamePanels_Manager.getRunningPanel(GamePanels_Dict.getDict().WeMainPanel) as WarEvent_View_WeMainPanel.Panel)?.setAndReviseSelectedEventId(openData.eventId, true);
        openData.panel.closePanel();
    }
    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
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

                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                },
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnDeepClone.setLangText(Lang_Constants.TextType.B0748);
        this._btnShallowClone.setLangText(Lang_Constants.TextType.B0487);
        this._btnSelect.setLangText(Lang_Constants.TextType.B0258);
        this._btnDelete.setLangText(Lang_Constants.TextType.B0220);

        this._updateLabelDesc();
        this._labelDescTitle.setText([
            Lang_Utils.getText(Lang_Constants.TextType.B0162),
            Lang_Utils.getText(Lang_Constants.TextType.B0749),
        ].join(`\n`));
    }

    private _updateLabelDesc(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId = openData.eventId;
        this._labelDesc.setText([
            Helpers_Text.getTruncatedText(
                `E${eventId} ${Lang_Utils.getLanguageText({ textArray : openData.fullData.getEventArray()?.find(v => v.getEventId() === eventId)?.getEventNameArray() }) ?? `----`}`,
                15,
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
