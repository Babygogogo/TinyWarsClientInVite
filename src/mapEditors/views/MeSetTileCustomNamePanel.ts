import {
    Tiles_Utils_Filter,
    Helpers_Collection,
    Tiles_Constants_Common,
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
import type { TileFilter } from "../../proto/schema/CommonProto/Structure/TileFilter.ts";

export interface OpenData {
    war         : BaseWar_Interface_IBwWar.IBwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnTileFilter!                            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTileFilter!                          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnCustomNameId!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelCustomNameId!                        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConfirm!                               : Ui_Interfaces_IUiButton.IUiButton;

    private _tileFilter     : AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileFilter>;
    private _customNameId   = 0;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,                               callback : this.closePanel },

            { ui : this._btnTileFilter,                          callback : this._onTouchedBtnTileFilter },
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
        const tileMap = this.getOpenData()?.war.getTileMap();
        if (tileMap == null) {
            return;
        }

        const filter        = this._tileFilter;
        const customNameId  = this._customNameId;
        for (const tile of tileMap.getAllTiles()) {
            if ((filter == null) || (Tiles_Utils_Filter.checkIsMeet(filter, tile))) {
                tile.setCustomNameId(customNameId == 0 ? null : customNameId);
            }
        }
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    private _onTouchedBtnTileFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeTileFilterPanel, {
            gameConfig            : war.getGcData(),
            playersCountUnneutral : war.getPlayersCountUnneutral(),
            mapSize               : war.getTileMap().getMapSize(),
            currentFilter         : this._tileFilter,
            callback              : filter => {
                this._tileFilter = filter;
                this._updateLabelTileFilter();
            },
        });
    }

    private _onTouchedBtnCustomNameId(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const arr = war.getTileMap().getTileCustomNameArray();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B1430),
            availableNumberArray : Helpers_Collection.createRange(0, Tiles_Constants_Common.CustomName.MaxId + 1, 1),
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
        this._btnTileFilter.setLangText(Lang_Constants.TextType.TileFilter);
        this._btnCustomNameId.setLangText(Lang_Constants.TextType.B0162);

        this._updateLabelTileFilter();
        this._updateLabelCustomNameId();
    }

    private _updateLabelTileFilter(): void {
        const allTiles = this.getOpenData()?.war.getTileMap().getAllTiles();
        if (allTiles == null) {
            return;
        }

        const filter = this._tileFilter;
        this._labelTileFilter.setText(Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0257,
            filter == null
                ? allTiles.length
                : allTiles.filter(v => Tiles_Utils_Filter.checkIsMeet(filter, v)).length,
            Lang_Utils.getText(Lang_Constants.TextType.Tiles),
        ));
    }

    private _updateLabelCustomNameId(): void {
        const customNameId  = this._customNameId;
        const label         = this._labelCustomNameId;
        if (customNameId === 0) {
            label.setText(`(${Lang_Utils.getText(Lang_Constants.TextType.B0391)})`);
        } else {
            label.setText(Lang_Utils.getLanguageText({
                textArray : this.getOpenData()?.war.getTileMap().getTileCustomNameArray()?.find(v => (v.getNameId()) === customNameId)?.getNameTextArray(),
            }) ?? `----`);
        }
    }
}
