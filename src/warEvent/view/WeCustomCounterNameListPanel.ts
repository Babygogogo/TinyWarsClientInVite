import { Constants } from "../../customCounters/Constants.ts";
import { checkIsValidName } from "../../customCounters/Utils.ts";
import { show, showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText, getFormattedText } from "../../lang/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { IdAndName } from "../../proto/schema/CommonProto/Structure/IdAndName.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    isReviewingMap  : boolean;
    fullData        : WarEventFullData;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnHelp!              : IUiButton;

    private readonly _listName!             : IUiScrollList<DataForCustomCounterRenderer>;
    private readonly _labelTips!            : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,     callback: this._onNotifyWarEventFullDataChanged },
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
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0658),
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListName();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1143);
        this._labelTips.setLangText(TextType.A0785);
    }
    private async _updateListName(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const fullData      = openData.fullData;
        const isReviewing   = openData.isReviewingMap;
        const dataArray     : DataForCustomCounterRenderer[] = [];
        for (let id = Constants.MinId; id <= Constants.MaxId; ++id) {
            dataArray.push({
                fullData    : fullData,
                id          : id,
                isReviewing : isReviewing,
            });
        }

        await this._listName.bindData(dataArray);
    }
}

interface DataForCustomCounterRenderer extends UiListItemData {
    isReviewing : boolean;
    id          : number;
    fullData    : WarEventFullData;
}
class CustomCounterRenderer extends UiListItemRenderer<DataForCustomCounterRenderer> {
    private readonly _layoutName!   : IUiLayout;
    private readonly _labelId!      : IUiLabel;
    private readonly _labelName!    : IUiLabel;

    private readonly _imgSelected!  : IUiImage;

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
        Executor.removeTweens(imgSelected);
        Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Executor.removeTweens(this._imgSelected);

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
            openPanel(getDict().CommonAlertPanel, {
                getTitle   : () => `${getText(TextType.B1143)} #${id}`,
                getContent : () => currentText || `(${getText(TextType.B0277)})`,
            });
            return;
        }

        openPanel(getDict().CommonInputPanel, {
            title           : getText(TextType.B0162),
            currentValue    : currentText,
            charRestrict    : `a-zA-Z0-9`,
            maxChars        : 20,
            tips            : getText(TextType.A0659),
            canBeEmpty      : true,
            isMultiLine     : false,
            callback        : panel => {
                const text = (panel.getInputText() || ``).trim();
                if (text === currentText) {
                    return;
                }
                if (!text.length) {
                    dataArray.splice(index, 1);
                    dispatch(TypeId.WarEventFullDataChanged, fullData);
                    return;
                }

                if (!checkIsValidName(text)) {
                    show(getFormattedText(TextType.F0091, getText(TextType.B0162)));
                    return;
                }
                if (dataArray.some(v => v.getName() === text)) {
                    showLang(TextType.A0660);
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
                dispatch(TypeId.WarEventFullDataChanged, fullData);
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
