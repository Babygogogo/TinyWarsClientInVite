import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoStructureTileFilter from "../../proto/schema/CommonProto/Structure/TileFilter.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
import * as TilesUtilsFilter from "../../tiles/utils/Filter.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";

type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;

export interface OpenData {
    war         : IBwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                                 : UiInterfacesIUiButton.IUiButton;

    private readonly _btnTileFilter!                            : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTileFilter!                          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnCustomNameId!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelCustomNameId!                        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConfirm!                               : UiInterfacesIUiButton.IUiButton;

    private _tileFilter     : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoStructureTileFilter.TileFilter>;
    private _customNameId   = 0;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnTileFilter,                          callback: this._onTouchedBtnTileFilter },
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
        const tileMap = this.getOpenData()?.war.getTileMap();
        if (tileMap == null) {
            return;
        }

        const filter        = this._tileFilter;
        const customNameId  = this._customNameId;
        for (const tile of tileMap.getAllTiles()) {
            if ((filter == null) || (TilesUtilsFilter.checkIsMeet(filter, tile))) {
                tile.setCustomNameId(customNameId == 0 ? null : customNameId);
            }
        }
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    private _onTouchedBtnTileFilter(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeTileFilterPanel, {
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1430),
            availableNumberArray    : HelpersCollection.createRange(0, TilesConstantsCommon.CustomName.MaxId + 1, 1),
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
        this._btnTileFilter.setLangText(LangConstants.TextType.TileFilter);
        this._btnCustomNameId.setLangText(LangConstants.TextType.B0162);

        this._updateLabelTileFilter();
        this._updateLabelCustomNameId();
    }

    private _updateLabelTileFilter(): void {
        const allTiles = this.getOpenData()?.war.getTileMap().getAllTiles();
        if (allTiles == null) {
            return;
        }

        const filter = this._tileFilter;
        this._labelTileFilter.setText(LangUtils.getFormattedText(
            LangConstants.TextType.F0257,
            filter == null
                ? allTiles.length
                : allTiles.filter(v => TilesUtilsFilter.checkIsMeet(filter, v)).length,
            LangUtils.getText(LangConstants.TextType.Tiles),
        ));
    }

    private _updateLabelCustomNameId(): void {
        const customNameId  = this._customNameId;
        const label         = this._labelCustomNameId;
        if (customNameId === 0) {
            label.setText(`(${LangUtils.getText(LangConstants.TextType.B0391)})`);
        } else {
            label.setText(LangUtils.getLanguageText({
                textArray   : this.getOpenData()?.war.getTileMap().getTileCustomNameArray()?.find(v => (v.getNameId() ?? 0) === customNameId)?.getNameTextArray(),
            }) ?? `----`);
        }
    }
}
