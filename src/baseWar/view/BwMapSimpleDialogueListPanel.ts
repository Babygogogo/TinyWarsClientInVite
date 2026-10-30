import {
    Stages_Constants,
    GamePanels_Dict,
    Lang_Utils,
    Numbers_Utils,
    GamePanels_Manager,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type BaseWar_Interface_IBwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiList,
    type Ui_Interfaces_IUiScroller,
    type Ui_Types_UiListItemData,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";

export interface OpenData {
    war     : BaseWar_Interface_IBwWar.IBwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData>{
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelNoData!              : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _sclContent!               : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _layoutContent!            : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _layoutRepeatableDialogue! : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelRepeatableDialogue!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listRepeatableDialogue!   : Ui_Interfaces_IUiList.IUiList<DataForDialogueRenderer>;

    private readonly _layoutWarEventDialogue!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelWarEventDialogue!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listWarEventDialogue!     : Ui_Interfaces_IUiList.IUiList<DataForDialogueRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B1098);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
        this._labelRepeatableDialogue.setLangText(Lang_Constants.TextType.B1098);
        this._labelWarEventDialogue.setLangText(Lang_Constants.TextType.B0469);
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
        const groupHeight   = Numbers_Utils.getValueInRange({
            rawValue    : layoutContent.getScaledHeight() + 80,
            minValue    : 140,
            maxValue    : Stages_Constants.Dimension.DesignMinHeight,
        });
        sclContent.scrollTop();
        sclContent.setUnscaledManualHeight(groupHeight - 80);
        this._group.setUnscaledManualHeight(groupHeight);
    }
}

interface DataForDialogueRenderer extends Ui_Types_UiListItemData.UiListItemData {
    war         : BaseWar_Interface_IBwWar.IBwWar;
    dialogueId  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    actionId    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
}
class DialogueRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForDialogueRenderer> {
    private readonly _btnPlay!  : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnPlay,  callback: this._onTouchedBtnPlay },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwMapSimpleDialoguePanel, {
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
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwBigDialoguePanel, {
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
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwSmallDialoguePanel, {
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
                btnPlay.setText(Lang_Utils.getLanguageText({
                    textArray: war.getInstanceWarRule().getMapSimpleDialogueArray().find(v => v.getDialogueId() === dialogueId)?.getDialogueNameArray()
                }) ?? Lang_Constants.UndefinedError);
                return;
            }
        }
        {
            const actionId = openData.actionId;
            if (actionId != null) {
                btnPlay.setText(Lang_Utils.getLanguageText({ textArray: war.getWarEventManager().getWarEventAction(actionId).getWeaCommonData()?.getActionNameArray() }) ?? `A${actionId}`);
                return;
            }
        }
    }
}
