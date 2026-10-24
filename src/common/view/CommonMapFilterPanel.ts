import * as AuxiliaryTypesMapFilter from "../../auxiliaryTypes/MapFilter.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MapTagsUtils from "../../mapTags/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";

export type OpenData = {
    mapFilter           : AuxiliaryTypesMapFilter.MapFilter | null;
    callbackOnConfirm   : (mapFilter: AuxiliaryTypesMapFilter.MapFilter) => void;
};
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _btnReset!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSearch!                : UiInterfacesIUiButton.IUiButton;

    private readonly _labelMapNameTitle!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapName!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyMapName!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteMapName!         : UiInterfacesIUiButton.IUiButton;

    private readonly _labelMapDesignerTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapDesigner!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyMapDesigner!     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteMapDesigner!     : UiInterfacesIUiButton.IUiButton;

    private readonly _labelPlayersCountTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPlayersCount!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyPlayersCount!    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeletePlayersCount!    : UiInterfacesIUiButton.IUiButton;

    private readonly _labelPlayedTimesTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPlayedTimes!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyPlayedTimes!     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeletePlayedTimes!     : UiInterfacesIUiButton.IUiButton;

    private readonly _labelMinRatingTitle!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMinRating!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyMinRating!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteMinRating!       : UiInterfacesIUiButton.IUiButton;

    private readonly _labelMapTagTitle!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapTag!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyMapTag!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteMapTag!          : UiInterfacesIUiButton.IUiButton;

    private readonly _labelMapWidthTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapWidth!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyMapWidth!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteMapWidth!        : UiInterfacesIUiButton.IUiButton;

    private readonly _labelMapHeightTitle!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapHeight!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyMapHeight!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteMapHeight!       : UiInterfacesIUiButton.IUiButton;

    private _mapFilter                          = new AuxiliaryTypesMapFilter.MapFilter();

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },
            { ui: this._btnHelp,                    callback: this._onTouchedBtnHelp },
            { ui: this._btnReset,                   callback: this._onTouchedBtnReset },
            { ui: this._btnSearch,                  callback: this._onTouchedBtnSearch },

            { ui: this._btnModifyMapName,           callback: this._onTouchedBtnModifyMapName },
            { ui: this._btnDeleteMapName,           callback: this._onTouchedBtnDeleteMapName },

            { ui: this._btnModifyMapDesigner,       callback: this._onTouchedBtnModifyMapDesigner },
            { ui: this._btnDeleteMapDesigner,       callback: this._onTouchedBtnDeleteMapDesigner },

            { ui: this._btnModifyPlayersCount,      callback: this._onTouchedBtnModifyPlayersCount },
            { ui: this._btnDeletePlayersCount,      callback: this._onTouchedBtnDeletePlayersCount },

            { ui: this._btnModifyPlayedTimes,       callback: this._onTouchedBtnModifyPlayedTimes },
            { ui: this._btnDeletePlayedTimes,       callback: this._onTouchedBtnDeletePlayedTimes },

            { ui: this._btnModifyMinRating,         callback: this._onTouchedBtnModifyMinRating },
            { ui: this._btnDeleteMinRating,         callback: this._onTouchedBtnDeleteMinRating },

            { ui: this._btnModifyMapTag,            callback: this._onTouchedBtnModifyMapTag },
            { ui: this._btnDeleteMapTag,            callback: this._onTouchedBtnDeleteMapTag },

            { ui: this._btnModifyMapWidth,          callback: this._onTouchedBtnMapWidth },
            { ui: this._btnDeleteMapWidth,          callback: this._onTouchedBtnDeleteMapWidth },

            { ui: this._btnModifyMapHeight,         callback: this._onTouchedBtnMapHeight },
            { ui: this._btnDeleteMapHeight,         callback: this._onTouchedBtnDeleteMapHeight },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._mapFilter = this.getOpenData()?.mapFilter?.clone() ?? new AuxiliaryTypesMapFilter.MapFilter();
        this._updateComponentsForLanguage();
        this._resetComponentsForFilter();
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0063),
        });
    }

    private _onTouchedBtnReset(): void {
        this._mapFilter = new AuxiliaryTypesMapFilter.MapFilter();
        this._resetComponentsForFilter();
    }

    private _onTouchedBtnSearch(): void {
        this.getOpenData()?.callbackOnConfirm(this._mapFilter);
        this.closePanel();
    }

    private _onTouchedBtnModifyMapName(): void {
        const filter = this._mapFilter;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0225),
            currentValue    : filter.mapName ?? ``,
            maxChars        : 20,
            canBeEmpty      : true,
            charRestrict    : null,
            tips            : null,
            callback        : panel => {
                filter.mapName = panel.getInputText();
                this._updateLabelMapName();
            }
        });
    }
    private _onTouchedBtnDeleteMapName(): void {
        this._mapFilter.mapName = null;
        this._updateLabelMapName();
    }

    private _onTouchedBtnModifyMapDesigner(): void {
        const filter = this._mapFilter;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0251),
            currentValue    : filter.mapDesigner ?? ``,
            maxChars        : 20,
            canBeEmpty      : true,
            charRestrict    : null,
            tips            : null,
            callback        : panel => {
                filter.mapDesigner = panel.getInputText();
                this._updateLabelMapDesigner();
            }
        });
    }
    private _onTouchedBtnDeleteMapDesigner(): void {
        this._mapFilter.mapDesigner = null;
        this._updateLabelMapDesigner();
    }

    private _onTouchedBtnModifyPlayersCount(): void {
        const filter    = this._mapFilter;
        const range     = filter.playersCountRange ?? [];
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonDoubleSliderPanel, {
            getTitleText        : () => LangUtils.getText(LangConstants.TextType.B0922),
            minNumber           : 2,
            maxNumber           : PlayersConstants.PlayerIndex.Max,
            currentLowerNumber  : range[0] ?? 2,
            currentUpperNumber  : range[1] ?? PlayersConstants.PlayerIndex.Max,
            callback            : (minNumber, maxNumber) => {
                filter.playersCountRange = [minNumber, maxNumber];
                this._updateLabelPlayersCount();
            }
        });
    }
    private _onTouchedBtnDeletePlayersCount(): void {
        this._mapFilter.playersCountRange = null;
        this._updateLabelPlayersCount();
    }

    private _onTouchedBtnModifyPlayedTimes(): void {
        const filter = this._mapFilter;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0568),
            currentValue    : filter.playedTimes ?? 0,
            maxValue        : 9999,
            minValue        : 0,
            callback        : playedTimes => {
                filter.playedTimes = playedTimes;
                this._updateLabelPlayedTimes();
            }
        });
    }
    private _onTouchedBtnDeletePlayedTimes(): void {
        this._mapFilter.playedTimes = null;
        this._updateLabelPlayedTimes();
    }

    private _onTouchedBtnModifyMinRating(): void {
        const filter    = this._mapFilter;
        const range     = filter.globalRatingRange ?? [];
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonDoubleSliderPanel, {
            getTitleText        : () => LangUtils.getText(LangConstants.TextType.B0569),
            minNumber           : 0,
            maxNumber           : 10,
            currentLowerNumber  : range[0] ?? 0,
            currentUpperNumber  : range[1] ?? 10,
            callback            : (minNumber, maxNumber) => {
                filter.globalRatingRange = [minNumber, maxNumber];
                this._updateLabelMinRating();
            }
        });
    }
    private _onTouchedBtnDeleteMinRating(): void {
        this._mapFilter.globalRatingRange = null;
        this._updateLabelMinRating();
    }

    private async _onTouchedBtnModifyMapTag(): Promise<void> {
        const mapTagData = await NormalMapModelNormalMapModel.getMapTag();
        const filter        = this._mapFilter;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            availableNumberArray    : HelpersCollection.getNonNullElements(mapTagData?.getMapTagDataArray()?.map(v => v.getIsEnabled() ? v.getMapTagId() : null) ?? []).sort((v1, v2) => v1 - v2),
            currentNumberArray      : MapTagsUtils.getDecodedMapTagIdList(filter.mapTagIdFlags ?? 0),
            showNumber              : true,
            getTitleText            : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.B0445)),
            getNumberMainText       : mapTagId => LangUtils.getLanguageText({ textArray: mapTagData?.getMapTagDataArray()?.find(v => (v.getMapTagId() ?? 0) === mapTagId)?.getNameArray() }) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : newMapTagIdArray => {
                filter.mapTagIdFlags = MapTagsUtils.getEncodedMapTagId(newMapTagIdArray);
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
        const maxValue          = GameConfigGcMap.Constants.MaxGridsCount;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B1389),
            currentValue    : filter.minMapWidth,
            minValue        : minValue,
            maxValue        : oldMaxMapWidth ?? maxValue,
            callback        : newMinMapWidth => {
                if (newMinMapWidth == null) {
                    delete filter.minMapWidth;
                } else {
                    filter.minMapWidth = newMinMapWidth;
                }
                this._updateLabelMapWidth();

                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                    getTitle           : () => LangUtils.getText(LangConstants.TextType.B1390),
                    currentValue    : oldMaxMapWidth,
                    minValue        : newMinMapWidth ?? minValue,
                    maxValue        : maxValue,
                    callback        : newMaxMapWidth => {
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
        const maxValue          = GameConfigGcMap.Constants.MaxGridsCount;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B1391),
            currentValue    : filter.minMapHeight,
            minValue        : minValue,
            maxValue        : oldMaxMapHeight ?? maxValue,
            callback        : newMinMapHeight => {
                if (newMinMapHeight == null) {
                    delete filter.minMapHeight;
                } else {
                    filter.minMapHeight = newMinMapHeight;
                }
                this._updateLabelMapHeight();

                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
                    getTitle           : () => LangUtils.getText(LangConstants.TextType.B1392),
                    currentValue    : oldMaxMapHeight,
                    minValue        : newMinMapHeight ?? minValue,
                    maxValue        : maxValue,
                    callback        : newMaxMapHeight => {
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0447));
        this._labelMapNameTitle.setText(LangUtils.getText(LangConstants.TextType.B0225));
        this._labelMapDesignerTitle.setText(LangUtils.getText(LangConstants.TextType.B0251));
        this._labelPlayersCountTitle.setText(LangUtils.getText(LangConstants.TextType.B0922));
        this._labelPlayedTimesTitle.setText(LangUtils.getText(LangConstants.TextType.B0565));
        this._labelMinRatingTitle.setText(LangUtils.getText(LangConstants.TextType.B0364));
        this._labelMapTagTitle.setText(LangUtils.getText(LangConstants.TextType.B0445));
        this._labelMapWidthTitle.setLangText(LangConstants.TextType.B0034);
        this._labelMapHeightTitle.setLangText(LangConstants.TextType.B0035);

        this._btnReset.setText(LangUtils.getText(LangConstants.TextType.B0391));
        this._btnSearch.setText(LangUtils.getText(LangConstants.TextType.B0228));

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
            : `${range[0]} ~ ${range[1]}`
        );
    }
    private _updateLabelPlayedTimes(): void {
        this._labelPlayedTimes.setText(`${this._mapFilter.playedTimes ?? ``}`);
    }
    private _updateLabelMinRating(): void {
        const range = this._mapFilter.globalRatingRange;
        this._labelMinRating.setText(range == null
            ? ``
            : `${range[0]} ~ ${range[1]}`
        );
    }
    private async _updateLabelMapTag(): Promise<void> {
        const mapTagIdArray = MapTagsUtils.getDecodedMapTagIdList(this._mapFilter.mapTagIdFlags ?? 0);
        const length        = mapTagIdArray.length;
        const label         = this._labelMapTag;
        if (length == 0) {
            label.setText(``);
        } else if (length === 1) {
            label.setText(LangUtils.getLanguageText({ textArray: (await NormalMapModelNormalMapModel.getMapTag())?.getMapTagDataArray()?.find(v => v.getMapTagId() === mapTagIdArray[0])?.getNameArray() }) ?? LangConstants.UndefinedError);
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
            label.setText(`${minWidth ?? LangUtils.getText(LangConstants.TextType.B0776)} ~ ${maxWidth ?? LangUtils.getText(LangConstants.TextType.B0776)}`);
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
            label.setText(`${minHeight ?? LangUtils.getText(LangConstants.TextType.B0776)} ~ ${maxHeight ?? LangUtils.getText(LangConstants.TextType.B0776)}`);
        }
    }
}
