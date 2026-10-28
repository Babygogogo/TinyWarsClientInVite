import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { createRange } from "../../helpers/Collection.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText, getLanguageText, getFormattedText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { UnitFilter } from "../../proto/schema/CommonProto/Structure/UnitFilter.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import { CustomName } from "../../units/Constants.ts";
import { checkIsMeet } from "../../units/utils/Filter.ts";

export interface OpenData {
    war         : IBwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                  : IUiImage;
    private readonly _group!                                    : IUiContainer;
    private readonly _labelTitle!                               : IUiLabel;
    private readonly _btnClose!                                 : IUiButton;

    private readonly _btnUnitFilter!                            : IUiButton;
    private readonly _labelUnitFilter!                          : IUiLabel;

    private readonly _btnCustomNameId!                          : IUiButton;
    private readonly _labelCustomNameId!                        : IUiLabel;

    private readonly _btnConfirm!                               : IUiButton;

    private _unitFilter     : Undefinable<UnitFilter>;
    private _customNameId   = 0;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnUnitFilter,                          callback: this._onTouchedBtnUnitFilter },
            { ui: this._btnCustomNameId,                        callback: this._onTouchedBtnCustomNameId },

            { ui: this._btnConfirm,                             callback: this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
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
            if ((filter == null) || (checkIsMeet(filter, unit))) {
                unit.setCustomNameId(customNameId == 0 ? null : customNameId);
            }
        }
        showLang(TextType.OperationSucceeded);
    }

    private _onTouchedBtnUnitFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().WeUnitFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getUnitMap().getMapSize(),
            currentFilter           : this._unitFilter,
            callback                : filter => {
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
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.B1433),
            availableNumberArray    : createRange(0, CustomName.MaxId + 1, 1),
            currentNumber           : this._customNameId,
            columnsCount            : 4,
            showNumber              : true,
            getNumberMainText       : num => {
                if (num === 0) {
                    return `(${getText(TextType.B0391)})`;
                } else {
                    return getLanguageText({ textArray: arr?.find(v => (v.getNameId()) === num)?.getNameTextArray() }) ?? `----`;
                }
            },
            callbackOnConfirm       : num => {
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
        this._labelTitle.setLangText(TextType.B1373);
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnUnitFilter.setLangText(TextType.UnitFilter);
        this._btnCustomNameId.setLangText(TextType.B0162);

        this._updateLabelUnitFilter();
        this._updateLabelCustomNameId();
    }

    private _updateLabelUnitFilter(): void {
        const allUnits = this.getOpenData()?.war.getUnitMap().getAllUnits();
        if (allUnits == null) {
            return;
        }

        const filter = this._unitFilter;
        this._labelUnitFilter.setText(getFormattedText(
            TextType.F0257,
            filter == null
                ? allUnits.length
                : allUnits.filter(v => checkIsMeet(filter, v)).length,
            getText(TextType.Units),
        ));
    }

    private _updateLabelCustomNameId(): void {
        const customNameId  = this._customNameId;
        const label         = this._labelCustomNameId;
        if (customNameId === 0) {
            label.setText(`(${getText(TextType.B0391)})`);
        } else {
            label.setText(getLanguageText({
                textArray   : this.getOpenData()?.war.getUnitMap().getUnitCustomNameArray()?.find(v => (v.getNameId()) === customNameId)?.getNameTextArray(),
            }) ?? `----`);
        }
    }
}
