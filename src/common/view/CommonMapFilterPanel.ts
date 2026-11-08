import {
    Maps_Constants,
    MapTags_Utils,
    GamePanels_Dict,
    Lang_Utils,
    NormalMap_Model_NormalMapModel,
    Helpers_Collection,
    AuxiliaryTypes_MapFilter,
    GamePanels_Manager,
    Players_Constants,
    Lang_Constants,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";

export type OpenData = {
    mapFilter           : AuxiliaryTypes_MapFilter.MapFilter | null;
    callbackOnConfirm   : (mapFilter: AuxiliaryTypes_MapFilter.MapFilter) => void;
};
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnReset!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSearch!                : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMapNameTitle!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapName!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyMapName!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMapName!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMapDesignerTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapDesigner!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyMapDesigner!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMapDesigner!     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelPlayersCountTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPlayersCount!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyPlayersCount!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeletePlayersCount!    : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelPlayedTimesTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPlayedTimes!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyPlayedTimes!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeletePlayedTimes!     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMinRatingTitle!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMinRating!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyMinRating!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMinRating!       : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMapTagTitle!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapTag!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyMapTag!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMapTag!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMapWidthTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapWidth!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyMapWidth!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMapWidth!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMapHeightTitle!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapHeight!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyMapHeight!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMapHeight!       : Ui_Interfaces_IUiButton.IUiButton;

    private _mapFilter                          = new AuxiliaryTypes_MapFilter.MapFilter();

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,                   callback : this.closePanel },
            { ui : this._btnHelp,                    callback : this._onTouchedBtnHelp },
            { ui : this._btnReset,                   callback : this._onTouchedBtnReset },
            { ui : this._btnSearch,                  callback : this._onTouchedBtnSearch },

            { ui : this._btnModifyMapName,           callback : this._onTouchedBtnModifyMapName },
            { ui : this._btnDeleteMapName,           callback : this._onTouchedBtnDeleteMapName },

            { ui : this._btnModifyMapDesigner,       callback : this._onTouchedBtnModifyMapDesigner },
            { ui : this._btnDeleteMapDesigner,       callback : this._onTouchedBtnDeleteMapDesigner },

            { ui : this._btnModifyPlayersCount,      callback : this._onTouchedBtnModifyPlayersCount },
            { ui : this._btnDeletePlayersCount,      callback : this._onTouchedBtnDeletePlayersCount },

            { ui : this._btnModifyPlayedTimes,       callback : this._onTouchedBtnModifyPlayedTimes },
            { ui : this._btnDeletePlayedTimes,       callback : this._onTouchedBtnDeletePlayedTimes },

            { ui : this._btnModifyMinRating,         callback : this._onTouchedBtnModifyMinRating },
            { ui : this._btnDeleteMinRating,         callback : this._onTouchedBtnDeleteMinRating },

            { ui : this._btnModifyMapTag,            callback : this._onTouchedBtnModifyMapTag },
            { ui : this._btnDeleteMapTag,            callback : this._onTouchedBtnDeleteMapTag },

            { ui : this._btnModifyMapWidth,          callback : this._onTouchedBtnMapWidth },
            { ui : this._btnDeleteMapWidth,          callback : this._onTouchedBtnDeleteMapWidth },

            { ui : this._btnModifyMapHeight,         callback : this._onTouchedBtnMapHeight },
            { ui : this._btnDeleteMapHeight,         callback : this._onTouchedBtnDeleteMapHeight },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",    callback : this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._mapFilter = this.getOpenData()?.mapFilter?.clone() ?? new AuxiliaryTypes_MapFilter.MapFilter();
        this._updateComponentsForLanguage();
        this._resetComponentsForFilter();
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0063),
        });
    }

    private _onTouchedBtnReset(): void {
        this._mapFilter = new AuxiliaryTypes_MapFilter.MapFilter();
        this._resetComponentsForFilter();
    }

    private _onTouchedBtnSearch(): void {
        this.getOpenData()?.callbackOnConfirm(this._mapFilter);
        this.closePanel();
    }

    private _onTouchedBtnModifyMapName(): void {
        const filter = this._mapFilter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B0225),
            currentValue : filter.mapName ?? ``,
            maxChars     : 20,
            canBeEmpty   : true,
            charRestrict : null,
            tips         : null,
            callback     : panel => {
                filter.mapName = panel.getInputText();
                this._updateLabelMapName();
            },
        });
    }
    private _onTouchedBtnDeleteMapName(): void {
        this._mapFilter.mapName = null;
        this._updateLabelMapName();
    }

    private _onTouchedBtnModifyMapDesigner(): void {
        const filter = this._mapFilter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B0251),
            currentValue : filter.mapDesigner ?? ``,
            maxChars     : 20,
            canBeEmpty   : true,
            charRestrict : null,
            tips         : null,
            callback     : panel => {
                filter.mapDesigner = panel.getInputText();
                this._updateLabelMapDesigner();
            },
        });
    }
    private _onTouchedBtnDeleteMapDesigner(): void {
        this._mapFilter.mapDesigner = null;
        this._updateLabelMapDesigner();
    }

    private _onTouchedBtnModifyPlayersCount(): void {
        const filter    = this._mapFilter;
        const range     = filter.playersCountRange ?? [];
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonDoubleSliderPanel, {
            getTitleText       : () => Lang_Utils.getText(Lang_Constants.TextType.B0922),
            minNumber          : 2,
            maxNumber          : Players_Constants.PlayerIndex.Max,
            currentLowerNumber : range[0] ?? 2,
            currentUpperNumber : range[1] ?? Players_Constants.PlayerIndex.Max,
            callback           : (minNumber, maxNumber) => {
                filter.playersCountRange = [minNumber, maxNumber];
                this._updateLabelPlayersCount();
            },
        });
    }
    private _onTouchedBtnDeletePlayersCount(): void {
        this._mapFilter.playersCountRange = null;
        this._updateLabelPlayersCount();
    }

    private _onTouchedBtnModifyPlayedTimes(): void {
        const filter = this._mapFilter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0568),
            currentValue : filter.playedTimes ?? 0,
            maxValue     : 9999,
            minValue     : 0,
            callback     : playedTimes => {
                filter.playedTimes = playedTimes;
                this._updateLabelPlayedTimes();
            },
        });
    }
    private _onTouchedBtnDeletePlayedTimes(): void {
        this._mapFilter.playedTimes = null;
        this._updateLabelPlayedTimes();
    }

    private _onTouchedBtnModifyMinRating(): void {
        const filter    = this._mapFilter;
        const range     = filter.globalRatingRange ?? [];
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonDoubleSliderPanel, {
            getTitleText       : () => Lang_Utils.getText(Lang_Constants.TextType.B0569),
            minNumber          : 0,
            maxNumber          : 10,
            currentLowerNumber : range[0] ?? 0,
            currentUpperNumber : range[1] ?? 10,
            callback           : (minNumber, maxNumber) => {
                filter.globalRatingRange = [minNumber, maxNumber];
                this._updateLabelMinRating();
            },
        });
    }
    private _onTouchedBtnDeleteMinRating(): void {
        this._mapFilter.globalRatingRange = null;
        this._updateLabelMinRating();
    }

    private async _onTouchedBtnModifyMapTag(): Promise<void> {
        const mapTagData = await NormalMap_Model_NormalMapModel.getMapTag();
        const filter        = this._mapFilter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            availableNumberArray : Helpers_Collection.getNonNullElements(mapTagData?.getMapTagDataArray()?.map(v => v.getIsEnabled() ? v.getMapTagId() : null) ?? []).sort((v1, v2) => v1 - v2),
            currentNumberArray   : MapTags_Utils.getDecodedMapTagIdList(filter.mapTagIdFlags ?? 0),
            showNumber           : true,
            getTitleText         : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B0445)),
            getNumberMainText    : mapTagId => Lang_Utils.getLanguageText({ textArray : mapTagData?.getMapTagDataArray()?.find(v => (v.getMapTagId()) === mapTagId)?.getNameArray() }) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : newMapTagIdArray => {
                filter.mapTagIdFlags = MapTags_Utils.getEncodedMapTagId(newMapTagIdArray);
                this._updateLabelMapTag();
            },
        });
    }
    private _onTouchedBtnDeleteMapTag(): void {
        this._mapFilter.mapTagIdFlags = 0;
        this._updateLabelMapTag();
    }

    private _onTouchedBtnMapWidth(): void {
        const filter            = this._mapFilter;
        const oldMaxMapWidth    = filter.maxMapWidth;
        const minValue          = 1;
        const maxValue          = Maps_Constants.Common.MaxGridsCount;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1389),
            currentValue : filter.minMapWidth,
            minValue     : minValue,
            maxValue     : oldMaxMapWidth ?? maxValue,
            callback     : newMinMapWidth => {
                if (newMinMapWidth == null) {
                    delete filter.minMapWidth;
                } else {
                    filter.minMapWidth = newMinMapWidth;
                }
                this._updateLabelMapWidth();

                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                    getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1390),
                    currentValue : oldMaxMapWidth,
                    minValue     : newMinMapWidth ?? minValue,
                    maxValue     : maxValue,
                    callback     : newMaxMapWidth => {
                        if (newMaxMapWidth == null) {
                            delete filter.maxMapWidth;
                        } else {
                            filter.maxMapWidth = newMaxMapWidth;
                        }
                        this._updateLabelMapWidth();
                    },
                });
            },
        });
    }
    private _onTouchedBtnDeleteMapWidth(): void {
        const filter = this._mapFilter;
        delete filter.minMapWidth;
        delete filter.maxMapWidth;
        this._updateLabelMapWidth();
    }

    private _onTouchedBtnMapHeight(): void {
        const filter            = this._mapFilter;
        const oldMaxMapHeight   = filter.maxMapHeight;
        const minValue          = 1;
        const maxValue          = Maps_Constants.Common.MaxGridsCount;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1391),
            currentValue : filter.minMapHeight,
            minValue     : minValue,
            maxValue     : oldMaxMapHeight ?? maxValue,
            callback     : newMinMapHeight => {
                if (newMinMapHeight == null) {
                    delete filter.minMapHeight;
                } else {
                    filter.minMapHeight = newMinMapHeight;
                }
                this._updateLabelMapHeight();

                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                    getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1392),
                    currentValue : oldMaxMapHeight,
                    minValue     : newMinMapHeight ?? minValue,
                    maxValue     : maxValue,
                    callback     : newMaxMapHeight => {
                        if (newMaxMapHeight == null) {
                            delete filter.maxMapHeight;
                        } else {
                            filter.maxMapHeight = newMaxMapHeight;
                        }
                        this._updateLabelMapHeight();
                    },
                });
            },
        });
    }
    private _onTouchedBtnDeleteMapHeight(): void {
        const filter = this._mapFilter;
        delete filter.minMapHeight;
        delete filter.maxMapHeight;
        this._updateLabelMapHeight();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _resetComponentsForFilter(): void {
        this._updateLabelMapName();
        this._updateLabelMapDesigner();
        this._updateLabelPlayersCount();
        this._updateLabelPlayedTimes();
        this._updateLabelMinRating();
        this._updateLabelMapTag();
        this._updateLabelMapWidth();
        this._updateLabelMapHeight();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0447);
        this._labelMapNameTitle.setLangText(Lang_Constants.TextType.B0225);
        this._labelMapDesignerTitle.setLangText(Lang_Constants.TextType.B0251);
        this._labelPlayersCountTitle.setLangText(Lang_Constants.TextType.B0922);
        this._labelPlayedTimesTitle.setLangText(Lang_Constants.TextType.B0565);
        this._labelMinRatingTitle.setLangText(Lang_Constants.TextType.B0364);
        this._labelMapTagTitle.setLangText(Lang_Constants.TextType.B0445);
        this._labelMapWidthTitle.setLangText(Lang_Constants.TextType.B0034);
        this._labelMapHeightTitle.setLangText(Lang_Constants.TextType.B0035);

        this._btnReset.setLangText(Lang_Constants.TextType.B0391);
        this._btnSearch.setLangText(Lang_Constants.TextType.B0228);

        this._updateLabelMapTag();
        this._updateLabelMapWidth();
        this._updateLabelMapHeight();
    }

    private _updateLabelMapName(): void {
        this._labelMapName.setText(this._mapFilter.mapName ?? ``);
    }
    private _updateLabelMapDesigner(): void {
        this._labelMapDesigner.setText(this._mapFilter.mapDesigner ?? ``);
    }
    private _updateLabelPlayersCount(): void {
        const range = this._mapFilter.playersCountRange;
        this._labelPlayersCount.setText(range == null
            ? ``
            : `${range[0]} ~ ${range[1]}`,
        );
    }
    private _updateLabelPlayedTimes(): void {
        this._labelPlayedTimes.setText(`${this._mapFilter.playedTimes ?? ``}`);
    }
    private _updateLabelMinRating(): void {
        const range = this._mapFilter.globalRatingRange;
        this._labelMinRating.setText(range == null
            ? ``
            : `${range[0]} ~ ${range[1]}`,
        );
    }
    private async _updateLabelMapTag(): Promise<void> {
        const mapTagIdArray = MapTags_Utils.getDecodedMapTagIdList(this._mapFilter.mapTagIdFlags ?? 0);
        const length        = mapTagIdArray.length;
        const label         = this._labelMapTag;
        if (length == 0) {
            label.setText(``);
        } else if (length === 1) {
            label.setText(Lang_Utils.getLanguageText({ textArray : (await NormalMap_Model_NormalMapModel.getMapTag())?.getMapTagDataArray()?.find(v => v.getMapTagId() === mapTagIdArray[0])?.getNameArray() }) ?? Lang_Constants.UndefinedError);
        } else {
            label.setText(`${length}`);
        }
    }
    private _updateLabelMapWidth(): void {
        const filter    = this._mapFilter;
        const minWidth  = filter.minMapWidth;
        const maxWidth  = filter.maxMapWidth;
        const label     = this._labelMapWidth;
        if ((minWidth == null) && (maxWidth == null)) {
            label.setText(``);
        } else {
            label.setText(`${minWidth ?? Lang_Utils.getText(Lang_Constants.TextType.B0776)} ~ ${maxWidth ?? Lang_Utils.getText(Lang_Constants.TextType.B0776)}`);
        }
    }
    private _updateLabelMapHeight(): void {
        const filter    = this._mapFilter;
        const minHeight = filter.minMapHeight;
        const maxHeight = filter.maxMapHeight;
        const label     = this._labelMapHeight;
        if ((minHeight == null) && (maxHeight == null)) {
            label.setText(``);
        } else {
            label.setText(`${minHeight ?? Lang_Utils.getText(Lang_Constants.TextType.B0776)} ~ ${maxHeight ?? Lang_Utils.getText(Lang_Constants.TextType.B0776)}`);
        }
    }
}
