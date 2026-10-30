import {
    MapEditor_Model_MeWar,
    type BaseWar_Interface_IBwWar,
    Units_Constants,
    Notifications_Dispatcher,
    Tween_Executor,
    Lang_Utils,
    GamePanels_Dict,
    GamePanels_Manager,
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

import { UnitCustomName } from "../../proto/schema/CommonProto/Structure/UnitCustomName.ts";

export interface OpenData {
    war     : BaseWar_Interface_IBwWar.IBwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnBatch!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listName!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForCustomCounterRenderer>;
    private readonly _labelTips!            : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnBatch,               callback: this._onTouchedBtnBatch },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listName.setItemRendererClass(NameRenderer);
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
    private _onTouchedBtnBatch(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeSetUnitCustomNamePanel, {
            war : war,
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListName();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1433);
        this._labelTips.setLangText(Lang_Constants.TextType.A0785);
        this._btnBatch.setLangText(Lang_Constants.TextType.B1434);
    }
    private async _updateListName(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const dataArray : DataForCustomCounterRenderer[] = [];
        for (let nameId = Units_Constants.CustomName.MinId; nameId <= Units_Constants.CustomName.MaxId; ++nameId) {
            dataArray.push({
                war     : war,
                nameId  : nameId,
            });
        }

        await this._listName.bindData(dataArray);
    }
}

interface DataForCustomCounterRenderer extends Ui_Types_UiListItemData.UiListItemData {
    war     : BaseWar_Interface_IBwWar.IBwWar;
    nameId  : number;
}
class NameRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForCustomCounterRenderer> {
    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelId!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName1!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName2!   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _imgSelected!  : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgSelected,                        callback: this._onTouchedImgSelected },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.BwUnitCustomNameIdChanged,   callback: this._onNotifyBwUnitCustomNameIdChanged },
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

        const war = openData.war;
        if ((war instanceof MapEditor_Model_MeWar.MeWar) &&
            (war.getIsReviewingMap())
        ) {
            return;
        }

        const nameId        = openData.nameId;
        const unitMap       = war.getUnitMap();
        const nameArray     = unitMap.getUnitCustomNameArray() ?? [];
        const index         = nameArray.findIndex(v => (v.getNameId()) === nameId);
        const nameData      = nameArray[index];
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputShortLangTextPanel, {
            getTitleText        : () => `${Lang_Utils.getText(Lang_Constants.TextType.B1433)} #${nameId}`,
            currentTextArray    : nameData?.getNameTextArray() ?? [],
            maxTextLength       : Units_Constants.CustomName.MaxLength,
            allowEmpty          : true,
            callback            : textArray => {
                if (!textArray.length) {
                    nameArray.splice(index, 1);
                } else {
                    if (nameData) {
                        nameData.setNameTextArray(textArray);
                    } else {
                        if (nameArray.length) {
                            nameArray.push(UnitCustomName.fromJson({
                                nameId          : nameId,
                                nameTextArray   : textArray.map(v => v.toJson()),
                            }));
                        } else {
                            unitMap.setUnitCustomNameArray([UnitCustomName.fromJson({
                                nameId          : nameId,
                                nameTextArray   : textArray.map(v => v.toJson()),
                            })]);
                        }
                    }
                }

                this._updateView();
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwUnitCustomNameArrayChanged);
            },
        });
    }
    private _onNotifyBwUnitCustomNameIdChanged(): void {
        this._updateLabelId();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nameId        = openData.nameId;
        const unitMap       = openData.war.getUnitMap();
        const nameTextArray = unitMap.getUnitCustomNameArray()?.find(v => (v.getNameId()) === nameId)?.getNameTextArray();
        const languageType1 = Lang_Utils.getCurrentLanguageType();
        const languageType2 = Lang_Utils.getSecondaryLanguageType();
        this._labelName1.setText(Lang_Utils.getLanguageText({
            textArray       : nameTextArray,
            languageType    : languageType1,
            useAlternate    : false,
        }) ?? `----`);
        this._labelName2.setText(Lang_Utils.getLanguageText({
            textArray       : nameTextArray,
            languageType    : languageType2,
            useAlternate    : false,
        }) ?? `----`);

        this._updateLabelId();
        this._layoutName.arrangeItems();
    }
    private _updateLabelId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nameId = openData.nameId;
        this._labelId.setText(`#${nameId}       ${openData.war.getUnitMap().getAllUnits().filter(v => v.getCustomNameId() === nameId).length} ${Lang_Utils.getText(Lang_Constants.TextType.B1431)}`);
        this._layoutName.arrangeItems();
    }
}
