import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as StagesConstants from "../../stages/Constants.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiList from "../../ui/interfaces/IUiList.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    war     : BaseWarInterfaceIBwWar.IBwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData>{
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _labelNoData!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _sclContent!               : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _layoutContent!            : UiInterfacesIUiLayout.IUiLayout;

    private readonly _layoutRepeatableDialogue! : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelRepeatableDialogue!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listRepeatableDialogue!   : UiInterfacesIUiList.IUiList<DataForDialogueRenderer>;

    private readonly _layoutWarEventDialogue!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelWarEventDialogue!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listWarEventDialogue!     : UiInterfacesIUiList.IUiList<DataForDialogueRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        this._labelTitle.setLangText(LangConstants.TextType.B1098);
        this._labelNoData.setLangText(LangConstants.TextType.B0278);
        this._labelRepeatableDialogue.setLangText(LangConstants.TextType.B1098);
        this._labelWarEventDialogue.setLangText(LangConstants.TextType.B0469);
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
                dialogueId  : dialogueData.getDialogueId() ?? 0,
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
        const groupHeight   = NumbersUtils.getValueInRange({
            rawValue    : layoutContent.getScaledHeight() + 80,
            minValue    : 140,
            maxValue    : StagesConstants.Dimension.DesignMinHeight,
        });
        sclContent.scrollTop();
        sclContent.setUnscaledManualHeight(groupHeight - 80);
        this._group.setUnscaledManualHeight(groupHeight);
    }
}

interface DataForDialogueRenderer extends UiTypesUiListItemData.UiListItemData {
    war         : BaseWarInterfaceIBwWar.IBwWar;
    dialogueId  : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    actionId    : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
}
class DialogueRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForDialogueRenderer> {
    private readonly _btnPlay!  : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnPlay,  callback: this._onTouchedBtnPlay },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwMapSimpleDialoguePanel, {
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
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwBigDialoguePanel, {
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
                        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwSmallDialoguePanel, {
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
                btnPlay.setText(LangUtils.getLanguageText({
                    textArray: war.getInstanceWarRule().getMapSimpleDialogueArray().find(v => v.getDialogueId() === dialogueId)?.getDialogueNameArray()
                }) ?? LangConstants.UndefinedError);
                return;
            }
        }
        {
            const actionId = openData.actionId;
            if (actionId != null) {
                btnPlay.setText(LangUtils.getLanguageText({ textArray: war.getWarEventManager().getWarEventAction(actionId).getWeaCommonData()?.getActionNameArray() }) ?? `A${actionId}`);
                return;
            }
        }
    }
}
