import {
    CustomCounters_Utils,
    CustomCounters_Constants,
    Notifications_Dispatcher,
    Tween_Executor,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import { IdAndName } from "../../proto/schema/CommonProto/Structure/IdAndName.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";

export interface OpenData {
    isReviewingMap  : boolean;
    fullData        : WarEventFullData;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listName!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForCustomCounterRenderer>;
    private readonly _labelTips!            : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.WarEventFullDataChanged,     callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnHelp,                callback: this._onTouchedBtnHelp },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listName.setItemRendererClass(CustomCounterRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listName.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyWarEventFullDataChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0658),
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListName();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1143);
        this._labelTips.setLangText(Lang_Constants.TextType.A0785);
    }
    private async _updateListName(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const fullData      = openData.fullData;
        const isReviewing   = openData.isReviewingMap;
        const dataArray     : DataForCustomCounterRenderer[] = [];
        for (let id = CustomCounters_Constants.Constants.MinId; id <= CustomCounters_Constants.Constants.MaxId; ++id) {
            dataArray.push({
                fullData    : fullData,
                id          : id,
                isReviewing : isReviewing,
            });
        }

        await this._listName.bindData(dataArray);
    }
}

interface DataForCustomCounterRenderer extends Ui_Types_UiListItemData.UiListItemData {
    isReviewing : boolean;
    id          : number;
    fullData    : WarEventFullData;
}
class CustomCounterRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForCustomCounterRenderer> {
    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelId!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _imgSelected!  : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgSelected, callback: this._onTouchedImgSelected },
        ]);
        this._applySettingsForWholeTouch(undefined, true);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Tween_Executor.Executor.removeTweens(imgSelected);
        Tween_Executor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Tween_Executor.Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedImgSelected(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const id            = openData.id;
        const fullData      = openData.fullData;
        const dataArray     = fullData.getCustomCounterNameArray();
        const index         = dataArray.findIndex(v => (v.getId() ?? 0) === id);
        const nameData      = index >= 0 ? dataArray[index] : null;
        const currentText   = nameData?.getName() ?? ``;
        if (openData.isReviewing) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
                getTitle   : () => `${Lang_Utils.getText(Lang_Constants.TextType.B1143)} #${id}`,
                getContent : () => currentText || `(${Lang_Utils.getText(Lang_Constants.TextType.B0277)})`,
            });
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title           : Lang_Utils.getText(Lang_Constants.TextType.B0162),
            currentValue    : currentText,
            charRestrict    : `a-zA-Z0-9`,
            maxChars        : 20,
            tips            : Lang_Utils.getText(Lang_Constants.TextType.A0659),
            canBeEmpty      : true,
            isMultiLine     : false,
            callback        : panel => {
                const text = (panel.getInputText() || ``).trim();
                if (text === currentText) {
                    return;
                }
                if (!text.length) {
                    dataArray.splice(index, 1);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged, fullData);
                    return;
                }

                if (!CustomCounters_Utils.checkIsValidName(text)) {
                    FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0162)));
                    return;
                }
                if (dataArray.some(v => v.getName() === text)) {
                    FloatText.showLang(Lang_Constants.TextType.A0660);
                    return;
                }

                if (nameData) {
                    nameData.setName(text);
                } else {
                    dataArray.push(IdAndName.fromJson({
                        id      : id,
                        name    : text,
                    }));
                }
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged, fullData);
            },
        });
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const id = openData.id;
        this._labelId.setText(`#${id}`);
        this._labelName.setText(openData.fullData.getCustomCounterNameArray().find(v => (v.getId() ?? 0) === id)?.getName() ?? ``);
        this._layoutName.arrangeItems();
    }
}
