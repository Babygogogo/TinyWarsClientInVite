import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { createRange } from "../../helpers/Collection.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getLanguageText,
    getFormattedText,
} from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { TileFilter } from "../../proto/schema/CommonProto/Structure/TileFilter.ts";
import { CustomName } from "../../tiles/constants/Common.ts";
import { checkIsMeet } from "../../tiles/utils/Filter.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";

export interface OpenData {
    war         : IBwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                                  : IUiImage;
    private readonly _group!                                    : IUiContainer;
    private readonly _labelTitle!                               : IUiLabel;
    private readonly _btnClose!                                 : IUiButton;

    private readonly _btnTileFilter!                            : IUiButton;
    private readonly _labelTileFilter!                          : IUiLabel;

    private readonly _btnCustomNameId!                          : IUiButton;
    private readonly _labelCustomNameId!                        : IUiLabel;

    private readonly _btnConfirm!                               : IUiButton;

    private _tileFilter     : Undefinable<TileFilter>;
    private _customNameId   = 0;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnTileFilter,                          callback: this._onTouchedBtnTileFilter },
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
        const tileMap = this.getOpenData()?.war.getTileMap();
        if (tileMap == null) {
            return;
        }

        const filter        = this._tileFilter;
        const customNameId  = this._customNameId;
        for (const tile of tileMap.getAllTiles()) {
            if ((filter == null) || (checkIsMeet(filter, tile))) {
                tile.setCustomNameId(customNameId == 0 ? null : customNameId);
            }
        }
        showLang(TextType.OperationSucceeded);
    }

    private _onTouchedBtnTileFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().WeTileFilterPanel, {
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : war.getPlayersCountUnneutral(),
            mapSize                 : war.getTileMap().getMapSize(),
            currentFilter           : this._tileFilter,
            callback                : filter => {
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
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.B1430),
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
        this._btnTileFilter.setLangText(TextType.TileFilter);
        this._btnCustomNameId.setLangText(TextType.B0162);

        this._updateLabelTileFilter();
        this._updateLabelCustomNameId();
    }

    private _updateLabelTileFilter(): void {
        const allTiles = this.getOpenData()?.war.getTileMap().getAllTiles();
        if (allTiles == null) {
            return;
        }

        const filter = this._tileFilter;
        this._labelTileFilter.setText(getFormattedText(
            TextType.F0257,
            filter == null
                ? allTiles.length
                : allTiles.filter(v => checkIsMeet(filter, v)).length,
            getText(TextType.Tiles),
        ));
    }

    private _updateLabelCustomNameId(): void {
        const customNameId  = this._customNameId;
        const label         = this._labelCustomNameId;
        if (customNameId === 0) {
            label.setText(`(${getText(TextType.B0391)})`);
        } else {
            label.setText(getLanguageText({
                textArray   : this.getOpenData()?.war.getTileMap().getTileCustomNameArray()?.find(v => (v.getNameId()) === customNameId)?.getNameTextArray(),
            }) ?? `----`);
        }
    }
}
