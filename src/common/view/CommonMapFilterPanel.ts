import { MapFilter } from "../../auxiliaryTypes/MapFilter.ts";
import { Constants } from "../../gameConfig/GcMap.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getFormattedText, getLanguageText } from "../../lang/Utils.ts";
import { getDecodedMapTagIdList, getEncodedMapTagId } from "../../mapTags/Utils.ts";
import { getMapTag } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";

export type OpenData = {
    mapFilter           : MapFilter | null;
    callbackOnConfirm   : (mapFilter: MapFilter) => void;
};
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnHelp!                  : IUiButton;
    private readonly _btnClose!                 : IUiButton;

    private readonly _btnReset!                 : IUiButton;
    private readonly _btnSearch!                : IUiButton;

    private readonly _labelMapNameTitle!        : IUiLabel;
    private readonly _labelMapName!             : IUiLabel;
    private readonly _btnModifyMapName!         : IUiButton;
    private readonly _btnDeleteMapName!         : IUiButton;

    private readonly _labelMapDesignerTitle!    : IUiLabel;
    private readonly _labelMapDesigner!         : IUiLabel;
    private readonly _btnModifyMapDesigner!     : IUiButton;
    private readonly _btnDeleteMapDesigner!     : IUiButton;

    private readonly _labelPlayersCountTitle!   : IUiLabel;
    private readonly _labelPlayersCount!        : IUiLabel;
    private readonly _btnModifyPlayersCount!    : IUiButton;
    private readonly _btnDeletePlayersCount!    : IUiButton;

    private readonly _labelPlayedTimesTitle!    : IUiLabel;
    private readonly _labelPlayedTimes!         : IUiLabel;
    private readonly _btnModifyPlayedTimes!     : IUiButton;
    private readonly _btnDeletePlayedTimes!     : IUiButton;

    private readonly _labelMinRatingTitle!      : IUiLabel;
    private readonly _labelMinRating!           : IUiLabel;
    private readonly _btnModifyMinRating!       : IUiButton;
    private readonly _btnDeleteMinRating!       : IUiButton;

    private readonly _labelMapTagTitle!         : IUiLabel;
    private readonly _labelMapTag!              : IUiLabel;
    private readonly _btnModifyMapTag!          : IUiButton;
    private readonly _btnDeleteMapTag!          : IUiButton;

    private readonly _labelMapWidthTitle!       : IUiLabel;
    private readonly _labelMapWidth!            : IUiLabel;
    private readonly _btnModifyMapWidth!        : IUiButton;
    private readonly _btnDeleteMapWidth!        : IUiButton;

    private readonly _labelMapHeightTitle!      : IUiLabel;
    private readonly _labelMapHeight!           : IUiLabel;
    private readonly _btnModifyMapHeight!       : IUiButton;
    private readonly _btnDeleteMapHeight!       : IUiButton;

    private _mapFilter                          = new MapFilter();

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
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._mapFilter = this.getOpenData()?.mapFilter?.clone() ?? new MapFilter();
        this._updateComponentsForLanguage();
        this._resetComponentsForFilter();
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0063),
        });
    }

    private _onTouchedBtnReset(): void {
        this._mapFilter = new MapFilter();
        this._resetComponentsForFilter();
    }

    private _onTouchedBtnSearch(): void {
        this.getOpenData()?.callbackOnConfirm(this._mapFilter);
        this.closePanel();
    }

    private _onTouchedBtnModifyMapName(): void {
        const filter = this._mapFilter;
        openPanel(getDict().CommonInputPanel, {
            title           : getText(TextType.B0225),
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
        openPanel(getDict().CommonInputPanel, {
            title           : getText(TextType.B0251),
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
        openPanel(getDict().CommonDoubleSliderPanel, {
            getTitleText        : () => getText(TextType.B0922),
            minNumber           : 2,
            maxNumber           : PlayerIndex.Max,
            currentLowerNumber  : range[0] ?? 2,
            currentUpperNumber  : range[1] ?? PlayerIndex.Max,
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
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B0568),
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
        openPanel(getDict().CommonDoubleSliderPanel, {
            getTitleText        : () => getText(TextType.B0569),
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
        const mapTagData = await getMapTag();
        const filter        = this._mapFilter;
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            availableNumberArray    : getNonNullElements(mapTagData?.getMapTagDataArray()?.map(v => v.getIsEnabled() ? v.getMapTagId() : null) ?? []).sort((v1, v2) => v1 - v2),
            currentNumberArray      : getDecodedMapTagIdList(filter.mapTagIdFlags ?? 0),
            showNumber              : true,
            getTitleText            : () => getFormattedText(TextType.F0092, getText(TextType.B0445)),
            getNumberMainText       : mapTagId => getLanguageText({ textArray: mapTagData?.getMapTagDataArray()?.find(v => (v.getMapTagId() ?? 0) === mapTagId)?.getNameArray() }) ?? UndefinedError,
            callbackOnConfirm       : newMapTagIdArray => {
                filter.mapTagIdFlags = getEncodedMapTagId(newMapTagIdArray);
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
        const maxValue          = Constants.MaxGridsCount;
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B1389),
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

                openPanel(getDict().CommonInputNullableIntegerPanel, {
                    getTitle           : () => getText(TextType.B1390),
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
        const maxValue          = Constants.MaxGridsCount;
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B1391),
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

                openPanel(getDict().CommonInputNullableIntegerPanel, {
                    getTitle           : () => getText(TextType.B1392),
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
        this._labelTitle.setText(getText(TextType.B0447));
        this._labelMapNameTitle.setText(getText(TextType.B0225));
        this._labelMapDesignerTitle.setText(getText(TextType.B0251));
        this._labelPlayersCountTitle.setText(getText(TextType.B0922));
        this._labelPlayedTimesTitle.setText(getText(TextType.B0565));
        this._labelMinRatingTitle.setText(getText(TextType.B0364));
        this._labelMapTagTitle.setText(getText(TextType.B0445));
        this._labelMapWidthTitle.setLangText(TextType.B0034);
        this._labelMapHeightTitle.setLangText(TextType.B0035);

        this._btnReset.setText(getText(TextType.B0391));
        this._btnSearch.setText(getText(TextType.B0228));

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
        const mapTagIdArray = getDecodedMapTagIdList(this._mapFilter.mapTagIdFlags ?? 0);
        const length        = mapTagIdArray.length;
        const label         = this._labelMapTag;
        if (length == 0) {
            label.setText(``);
        } else if (length === 1) {
            label.setText(getLanguageText({ textArray: (await getMapTag())?.getMapTagDataArray()?.find(v => v.getMapTagId() === mapTagIdArray[0])?.getNameArray() }) ?? UndefinedError);
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
            label.setText(`${minWidth ?? getText(TextType.B0776)} ~ ${maxWidth ?? getText(TextType.B0776)}`);
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
            label.setText(`${minHeight ?? getText(TextType.B0776)} ~ ${maxHeight ?? getText(TextType.B0776)}`);
        }
    }
}
