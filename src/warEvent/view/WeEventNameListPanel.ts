import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { show, showLang } from "../../FloatText.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, getRunningPanel } from "../../gamePanels/Manager.ts";
import { deleteElementFromList } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getTruncatedText } from "../../helpers/Text.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText, getFormattedText, getLanguageText } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import type { Panel as WarEventViewWeMainPanel } from "./WeMainPanel.ts";
import { cloneEvent } from "../../warEvents/events/Utils.ts";
import { checkAndDeleteUnusedComponents } from "../../warEvents/fullDatas/Utils.ts";

export interface OpenData {
    war                     : IMeWar;
    gameConfig              : GameConfig;
    templateWarRuleArray    : TemplateWarRule[];
    fullData                : WarEventFullData;
    selectedEventId         : Undefinable<number>;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _btnClose!             : IUiButton;

    private readonly _listEvent!            : IUiScrollList<DataForEventRenderer>;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _labelNoEvent!         : IUiLabel;

    private readonly _btnDeleteAll!         : IUiButton;
    private readonly _btnDeleteRedundancy!  : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,     callback: this._onNotifyWarEventFullDataChanged },
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

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0931),
            getContent : () => getText(TextType.A0320),
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

                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnDeleteRedundancy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0188),
            callback: () => {
                const result = checkAndDeleteUnusedComponents(getExisted(openData.war.getWarEventManager().getWarEventFullData()));
                show(getFormattedText(TextType.F0063, result.deletedNodesCount, result.deletedConditionsCount, result.deletedActionsCount));
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListConditionAndLabelNoCondition();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0461);
        this._labelNoEvent.setLangText(TextType.B0278);
        this._btnDeleteAll.setLangText(TextType.B0931);
        this._btnDeleteRedundancy.setLangText(TextType.B0498);
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
                eventId                 : eventData?.getEventId(),
                fullData                : fullData,
                panel                   : this,
            });
        }

        this._labelNoEvent.setIsVisible(!dataArray.length);
        await this._listEvent.bindData(dataArray);
    }
}

interface DataForEventRenderer extends UiListItemData {
    war                     : IMeWar;
    gameConfig              : GameConfig;
    templateWarRuleArray    : TemplateWarRule[];
    selectedEventId         : Undefinable<number>;
    eventId                 : number;
    fullData                : WarEventFullData;
    panel                   : Panel;
}
class ConditionRenderer extends UiListItemRenderer<DataForEventRenderer> {
    private readonly _labelDesc!        : IUiLabel;
    private readonly _labelDescTitle!   : IUiLabel;
    private readonly _btnDeepClone!     : IUiButton;
    private readonly _btnShallowClone!  : IUiButton;
    private readonly _btnSelect!        : IUiButton;
    private readonly _btnDelete!        : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnDeepClone,       callback: this._onTouchedBtnDeepClone },
            { ui: this._btnShallowClone,    callback: this._onTouchedBtnShallowClone },
            { ui: this._btnSelect,          callback: this._onTouchedBtnSelect },
            { ui: this._btnDelete,          callback: this._onTouchedBtnDelete },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.AreYouSureYouWantToContinue),
                callback: () => {
                    const newEventId = cloneEvent(openData.fullData, openData.eventId, false);
                    show(getFormattedText(TextType.F0084, `E${newEventId}`));

                    dispatch(TypeId.WarEventFullDataChanged);
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
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.AreYouSureYouWantToContinue),
                callback: () => {
                    const newEventId = cloneEvent(openData.fullData, openData.eventId, true);
                    show(getFormattedText(TextType.F0084, `E${newEventId}`));

                    dispatch(TypeId.WarEventFullDataChanged);
                },
            });
        }
    }
    private _onTouchedBtnSelect(): void {        // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        (getRunningPanel(getDict().WeMainPanel) as WarEventViewWeMainPanel)?.setAndReviseSelectedEventId(openData.eventId, true);
        openData.panel.closePanel();
    }
    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
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

                    dispatch(TypeId.WarEventFullDataChanged);
                },
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnDeepClone.setLangText(TextType.B0748);
        this._btnShallowClone.setLangText(TextType.B0487);
        this._btnSelect.setLangText(TextType.B0258);
        this._btnDelete.setLangText(TextType.B0220);

        this._updateLabelDesc();
        this._labelDescTitle.setText([
            getText(TextType.B0162),
            getText(TextType.B0749),
        ].join(`\n`));
    }

    private _updateLabelDesc(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId = openData.eventId;
        this._labelDesc.setText([
            getTruncatedText(
                `E${eventId} ${getLanguageText({ textArray: openData.fullData.getEventArray()?.find(v => v.getEventId() === eventId)?.getEventNameArray() }) ?? `----`}`,
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
