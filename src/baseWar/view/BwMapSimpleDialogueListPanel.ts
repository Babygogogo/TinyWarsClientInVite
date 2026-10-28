import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getLanguageText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { Dimension } from "../../stages/Constants.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiList } from "../../ui/interfaces/IUiList.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    war     : IBwWar;
}
export class Panel extends UiPanel<OpenData>{
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnClose!                 : IUiButton;

    private readonly _labelNoData!              : IUiLabel;

    private readonly _sclContent!               : IUiScroller<IUiLayout>;
    private readonly _layoutContent!            : IUiLayout;

    private readonly _layoutRepeatableDialogue! : IUiLayout;
    private readonly _labelRepeatableDialogue!  : IUiLabel;
    private readonly _listRepeatableDialogue!   : IUiList<DataForDialogueRenderer>;

    private readonly _layoutWarEventDialogue!   : IUiLayout;
    private readonly _labelWarEventDialogue!    : IUiLabel;
    private readonly _listWarEventDialogue!     : IUiList<DataForDialogueRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listRepeatableDialogue.setItemRendererClass(DialogueRenderer);
        this._listWarEventDialogue.setItemRendererClass(DialogueRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listRepeatableDialogue.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateComponentsForDialogue();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1098);
        this._labelNoData.setLangText(TextType.B0278);
        this._labelRepeatableDialogue.setLangText(TextType.B1098);
        this._labelWarEventDialogue.setLangText(TextType.B0469);
    }
    private async _updateComponentsForDialogue(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const dataArrayForListRepeatable: DataForDialogueRenderer[] = [];
        for (const dialogueData of war.getInstanceWarRule().getMapSimpleDialogueArray()) {
            dataArrayForListRepeatable.push({
                war         : war,
                dialogueId  : dialogueData.getDialogueId(),
                actionId    : null,
            });
        }

        const dataArrayForListWarEvent: DataForDialogueRenderer[] = [];
        for (const actionId of war.getWarEventManager().getCalledDialogueActionIdArray()) {
            dataArrayForListWarEvent.push({
                war         : war,
                dialogueId  : null,
                actionId    : actionId,
            });
        }

        this._labelNoData.setIsVisible(dataArrayForListRepeatable.length + dataArrayForListWarEvent.length <= 0);
        await Promise.all([
            this._listRepeatableDialogue.bindData(dataArrayForListRepeatable),
            this._listWarEventDialogue.bindData(dataArrayForListWarEvent),
        ]);

        const layoutContent = this._layoutContent;
        layoutContent.removeAllItems(false);
        if (dataArrayForListRepeatable.length) {
            const layoutRepeatableDialogue = this._layoutRepeatableDialogue;
            layoutRepeatableDialogue.arrangeItems();
            layoutContent.addItem(layoutRepeatableDialogue, false);
        }
        if (dataArrayForListWarEvent.length) {
            const layoutWarEventDialogue = this._layoutWarEventDialogue;
            layoutWarEventDialogue.arrangeItems();
            layoutContent.addItem(layoutWarEventDialogue, false);
        }
        layoutContent.arrangeItems();

        const sclContent    = this._sclContent;
        const groupHeight   = getValueInRange({
            rawValue    : layoutContent.getScaledHeight() + 80,
            minValue    : 140,
            maxValue    : Dimension.DesignMinHeight,
        });
        sclContent.scrollTop();
        sclContent.setUnscaledManualHeight(groupHeight - 80);
        this._group.setUnscaledManualHeight(groupHeight);
    }
}

interface DataForDialogueRenderer extends UiListItemData {
    war         : IBwWar;
    dialogueId  : Undefinable<number>;
    actionId    : Undefinable<number>;
}
class DialogueRenderer extends UiListItemRenderer<DataForDialogueRenderer> {
    private readonly _btnPlay!  : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnPlay,  callback: this._onTouchedBtnPlay },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onTouchedBtnPlay(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        {
            const dialogueId = openData.dialogueId;
            if (dialogueId != null) {
                const dialogueData = openData.war.getInstanceWarRule().getMapSimpleDialogueArray().find(v => v.getDialogueId() === dialogueId);
                if (dialogueData) {
                    openPanel(getDict().BwMapSimpleDialoguePanel, {
                        war             : war,
                        dialogueData    : dialogueData,
                        callbackOnClose : () => {
                            // nothing to do
                        },
                    });
                    // PanelHelpers.close(PanelHelpers.PanelDict.BwMapSimpleDialogueListPanel);
                }
                return;
            }
        }
        {
            const actionId = openData.actionId;
            if (actionId != null) {
                const action = war.getWarEventManager().getWarEventAction(actionId);
                {
                    const act = action.getWeaBigDialogueSimple();
                    if (act) {
                        openPanel(getDict().BwBigDialoguePanel, {
                            war         : war,
                            actionData  : act,
                            callbackOnClose : () => {
                                // nothing to do
                            },
                        });
                        return;
                    }
                }
                {
                    const act = action.getWeaSmallDialogueSimple();
                    if (act) {
                        openPanel(getDict().BwSmallDialoguePanel, {
                            war         : war,
                            actionData  : act,
                            callbackOnClose : () => {
                                // nothing to do
                            },
                        });
                        return;
                    }
                }
            }
        }
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._updateBtnPlay();
    }

    private _updateBtnPlay(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const btnPlay   = this._btnPlay;

        {
            const dialogueId    = openData.dialogueId;
            if (dialogueId != null) {
                btnPlay.setText(getLanguageText({
                    textArray: war.getInstanceWarRule().getMapSimpleDialogueArray().find(v => v.getDialogueId() === dialogueId)?.getDialogueNameArray()
                }) ?? UndefinedError);
                return;
            }
        }
        {
            const actionId = openData.actionId;
            if (actionId != null) {
                btnPlay.setText(getLanguageText({ textArray: war.getWarEventManager().getWarEventAction(actionId).getWeaCommonData()?.getActionNameArray() }) ?? `A${actionId}`);
                return;
            }
        }
    }
}
