import {
    Units_Utils_Filter,
    Helpers_Collection,
    Units_Constants,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    FloatText,
    Lang_Constants,
    Ui_Components_UiPanel,
    type BaseWar_Interface_IBwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { UnitFilter } from "../../proto/schema/CommonProto/Structure/UnitFilter.ts";

export interface OpenData {
    war         : BaseWar_Interface_IBwWar.IBwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnUnitFilter!                            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelUnitFilter!                          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnCustomNameId!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelCustomNameId!                        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConfirm!                               : Ui_Interfaces_IUiButton.IUiButton;

    private _unitFilter     : AuxiliaryTypes_AuxiliaryTypes.Undefinable<UnitFilter>;
    private _customNameId   = 0;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,                               callback : this.closePanel },

            { ui : this._btnUnitFilter,                          callback : this._onTouchedBtnUnitFilter },
            { ui : this._btnCustomNameId,                        callback : this._onTouchedBtnCustomNameId },

            { ui : this._btnConfirm,                             callback : this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                 callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged",         callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyWarEventFullDataChanged(): void {
        this._updateView();
    }

    private _onTouchedBtnConfirm(): void {
        const unitMap = this.getOpenData()?.war.getUnitMap();
        if (unitMap == null) {
            return;
        }

        const filter        = this._unitFilter;
        const customNameId  = this._customNameId;
        for (const unit of unitMap.getAllUnits()) {
            if ((filter == null) || (Units_Utils_Filter.checkIsMeet(filter, unit))) {
                unit.setCustomNameId(customNameId == 0 ? null : customNameId);
            }
        }
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    private _onTouchedBtnUnitFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeUnitFilterPanel, {
            gameConfig            : war.getGcData(),
            playersCountUnneutral : war.getPlayersCountUnneutral(),
            mapSize               : war.getUnitMap().getMapSize(),
            currentFilter         : this._unitFilter,
            callback              : filter => {
                this._unitFilter = filter;
                this._updateLabelUnitFilter();
            },
        });
    }

    private _onTouchedBtnCustomNameId(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const arr = war.getUnitMap().getUnitCustomNameArray();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B1433),
            availableNumberArray : Helpers_Collection.createRange(0, Units_Constants.CustomName.MaxId + 1, 1),
            currentNumber        : this._customNameId,
            columnsCount         : 4,
            showNumber           : true,
            getNumberMainText    : num => {
                if (num === 0) {
                    return `(${Lang_Utils.getText(Lang_Constants.TextType.B0391)})`;
                } else {
                    return Lang_Utils.getLanguageText({ textArray : arr?.find(v => (v.getNameId()) === num)?.getNameTextArray() }) ?? `----`;
                }
            },
            callbackOnConfirm : num => {
                this._customNameId = num;
                this._updateLabelCustomNameId();
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1373);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnUnitFilter.setLangText(Lang_Constants.TextType.UnitFilter);
        this._btnCustomNameId.setLangText(Lang_Constants.TextType.B0162);

        this._updateLabelUnitFilter();
        this._updateLabelCustomNameId();
    }

    private _updateLabelUnitFilter(): void {
        const allUnits = this.getOpenData()?.war.getUnitMap().getAllUnits();
        if (allUnits == null) {
            return;
        }

        const filter = this._unitFilter;
        this._labelUnitFilter.setText(Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0257,
            filter == null
                ? allUnits.length
                : allUnits.filter(v => Units_Utils_Filter.checkIsMeet(filter, v)).length,
            Lang_Utils.getText(Lang_Constants.TextType.Units),
        ));
    }

    private _updateLabelCustomNameId(): void {
        const customNameId  = this._customNameId;
        const label         = this._labelCustomNameId;
        if (customNameId === 0) {
            label.setText(`(${Lang_Utils.getText(Lang_Constants.TextType.B0391)})`);
        } else {
            label.setText(Lang_Utils.getLanguageText({
                textArray : this.getOpenData()?.war.getUnitMap().getUnitCustomNameArray()?.find(v => (v.getNameId()) === customNameId)?.getNameTextArray(),
            }) ?? `----`);
        }
    }
}
