import * as CustomCountersConstants from "../../customCounters/Constants.ts";
import * as CustomCountersUtils from "../../customCounters/Utils.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoStructureIdAndName from "../../proto/schema/CommonProto/Structure/IdAndName.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    isReviewingMap  : boolean;
    fullData        : ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!              : UiInterfacesIUiButton.IUiButton;

    private readonly _listName!             : UiInterfacesIUiScrollList.IUiScrollList<DataForCustomCounterRenderer>;
    private readonly _labelTips!            : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,     callback: this._onNotifyWarEventFullDataChanged },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0658),
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListName();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1143));
        this._labelTips.setText(LangUtils.getText(LangConstants.TextType.A0785));
    }
    private async _updateListName(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const fullData      = openData.fullData;
        const isReviewing   = openData.isReviewingMap;
        const dataArray     : DataForCustomCounterRenderer[] = [];
        for (let id = CustomCountersConstants.Constants.MinId; id <= CustomCountersConstants.Constants.MaxId; ++id) {
            dataArray.push({
                fullData    : fullData,
                id          : id,
                isReviewing : isReviewing,
            });
        }

        await this._listName.bindData(dataArray);
    }
}

interface DataForCustomCounterRenderer extends UiTypesUiListItemData.UiListItemData {
    isReviewing : boolean;
    id          : number;
    fullData    : ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
}
class CustomCounterRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForCustomCounterRenderer> {
    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelId!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _imgSelected!  : UiInterfacesIUiImage.IUiImage;

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
        TweenExecutor.Executor.removeTweens(imgSelected);
        TweenExecutor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        TweenExecutor.Executor.removeTweens(this._imgSelected);

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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonAlertPanel, {
                getTitle   : () => `${LangUtils.getText(LangConstants.TextType.B1143)} #${id}`,
                getContent : () => currentText || `(${LangUtils.getText(LangConstants.TextType.B0277)})`,
            });
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0162),
            currentValue    : currentText,
            charRestrict    : `a-zA-Z0-9`,
            maxChars        : 20,
            tips            : LangUtils.getText(LangConstants.TextType.A0659),
            canBeEmpty      : true,
            isMultiLine     : false,
            callback        : panel => {
                const text = (panel.getInputText() || ``).trim();
                if (text === currentText) {
                    return;
                }
                if (!text.length) {
                    dataArray.splice(index, 1);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged, fullData);
                    return;
                }

                if (!CustomCountersUtils.checkIsValidName(text)) {
                    FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0162)));
                    return;
                }
                if (dataArray.some(v => v.getName() === text)) {
                    FloatText2.showLang(LangConstants.TextType.A0660);
                    return;
                }

                if (nameData) {
                    nameData.setName(text);
                } else {
                    dataArray.push(ProtoSchemaCommonProtoStructureIdAndName.IdAndName.fromJson({
                        id      : id,
                        name    : text,
                    }));
                }
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged, fullData);
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
