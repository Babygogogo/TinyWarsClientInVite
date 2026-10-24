import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoStructureUnitFilter from "../../proto/schema/CommonProto/Structure/UnitFilter.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UnitsUtilsFilter from "../../units/utils/Filter.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

export interface OpenData {
    war         : IBwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                                 : UiInterfacesIUiButton.IUiButton;

    private readonly _btnUnitFilter!                            : UiInterfacesIUiButton.IUiButton;
    private readonly _labelUnitFilter!                          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnCustomNameId!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelCustomNameId!                        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConfirm!                               : UiInterfacesIUiButton.IUiButton;

    private _unitFilter     : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureUnitFilter.UnitFilter>;
    private _customNameId   = 0;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnUnitFilter,                          callback: this._onTouchedBtnUnitFilter },
            { ui: this._btnCustomNameId,                        callback: this._onTouchedBtnCustomNameId },

            { ui: this._btnConfirm,                             callback: this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
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
            if ((filter == null) || (UnitsUtilsFilter.checkIsMeet(filter, unit))) {
                unit.setCustomNameId(customNameId == 0 ? null : customNameId);
            }
        }
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    private _onTouchedBtnUnitFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeUnitFilterPanel, {
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1433),
            availableNumberArray    : HelpersCollection.createRange(0, UnitsConstants.CustomName.MaxId + 1, 1),
            currentNumber           : this._customNameId,
            columnsCount            : 4,
            showNumber              : true,
            getNumberMainText       : num => {
                if (num === 0) {
                    return `(${LangUtils.getText(LangConstants.TextType.B0391)})`;
                } else {
                    return LangUtils.getLanguageText({ textArray: arr?.find(v => (v.getNameId() ?? 0) === num)?.getNameTextArray() }) ?? `----`;
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
        this._labelTitle.setLangText(LangConstants.TextType.B1373);
        this._btnConfirm.setLangText(LangConstants.TextType.B0026);
        this._btnUnitFilter.setLangText(LangConstants.TextType.UnitFilter);
        this._btnCustomNameId.setLangText(LangConstants.TextType.B0162);

        this._updateLabelUnitFilter();
        this._updateLabelCustomNameId();
    }

    private _updateLabelUnitFilter(): void {
        const allUnits = this.getOpenData()?.war.getUnitMap().getAllUnits();
        if (allUnits == null) {
            return;
        }

        const filter = this._unitFilter;
        this._labelUnitFilter.setText(LangUtils.getFormattedText(
            LangConstants.TextType.F0257,
            filter == null
                ? allUnits.length
                : allUnits.filter(v => UnitsUtilsFilter.checkIsMeet(filter, v)).length,
            LangUtils.getText(LangConstants.TextType.Units),
        ));
    }

    private _updateLabelCustomNameId(): void {
        const customNameId  = this._customNameId;
        const label         = this._labelCustomNameId;
        if (customNameId === 0) {
            label.setText(`(${LangUtils.getText(LangConstants.TextType.B0391)})`);
        } else {
            label.setText(LangUtils.getLanguageText({
                textArray   : this.getOpenData()?.war.getUnitMap().getUnitCustomNameArray()?.find(v => (v.getNameId() ?? 0) === customNameId)?.getNameTextArray(),
            }) ?? `----`);
        }
    }
}
