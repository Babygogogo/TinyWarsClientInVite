import { ReplayFilter } from "../../auxiliaryTypes/ReplayFilter.ts";
import { Constants } from "../../gameConfig/GcMap.ts";
import { getLatestGameConfig } from "../../gameConfig/GcModel.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getGameModeName, getGameModeHelpText, getTextForYesOrNo } from "../../lang/Utils.ts";
import { getEnabledNormalMapIdSet, getMapNameInCurrentLanguage } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { TurnIndex } from "../../turns/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import { getSelfUserId, getUserNickname } from "../../users/Model.ts";
import { Common } from "../../warOperations/Constants.ts";

export interface OpenData {
    replayFilter    : ReplayFilter | null;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _btnReset!                     : IUiButton;
    private readonly _btnSearch!                    : IUiButton;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnClose!                     : IUiButton;
    private readonly _btnHelp!                      : IUiButton;

    private readonly _labelReplayIdTitle!           : IUiLabel;
    private readonly _labelReplayId!                : IUiLabel;
    private readonly _btnReplayId!                  : IUiButton;
    private readonly _btnDeleteReplayId!            : IUiButton;

    private readonly _labelMapNameTitle!            : IUiLabel;
    private readonly _labelMapName!                 : IUiLabel;
    private readonly _btnMapName!                   : IUiButton;
    private readonly _btnDeleteMapName!             : IUiButton;

    private readonly _labelPlayerNameTitle!         : IUiLabel;
    private readonly _labelPlayerName!              : IUiLabel;
    private readonly _btnPlayerSelf!                : IUiButton;
    private readonly _btnPlayerName!                : IUiButton;
    private readonly _btnDeletePlayerName!          : IUiButton;

    private readonly _labelCoNameTitle!             : IUiLabel;
    private readonly _labelCoName!                  : IUiLabel;
    private readonly _btnCoName!                    : IUiButton;
    private readonly _btnDeleteCoName!              : IUiButton;

    private readonly _labelMinGlobalRatingTitle!    : IUiLabel;
    private readonly _labelMinGlobalRating!         : IUiLabel;
    private readonly _btnMinGlobalRating!           : IUiButton;
    private readonly _btnDeleteMinGlobalRating!     : IUiButton;

    // private readonly _labelMinMyRatingTitle!        : Ui.Interfaces.IUiLabel;
    // private readonly _labelMinMyRating!             : Ui.Interfaces.IUiLabel;
    // private readonly _btnMinMyRating!               : Ui.Interfaces.IUiButton;

    private readonly _labelHasFogTitle!             : IUiLabel;
    private readonly _labelHasFog!                  : IUiLabel;
    private readonly _btnHasFog!                    : IUiButton;
    private readonly _btnDeleteHasFog!              : IUiButton;

    private readonly _labelIsRankedTitle!           : IUiLabel;
    private readonly _labelIsRanked!                : IUiLabel;
    private readonly _btnIsRanked!                  : IUiButton;
    private readonly _btnDeleteIsRanked!            : IUiButton;

    private readonly _labelIsFavoriteTitle!         : IUiLabel;
    private readonly _labelIsFavorite!              : IUiLabel;
    private readonly _btnIsFavorite!                : IUiButton;
    private readonly _btnDeleteIsFavorite!          : IUiButton;

    private readonly _labelMapWidthTitle!           : IUiLabel;
    private readonly _labelMapWidth!                : IUiLabel;
    private readonly _btnMapWidth!                  : IUiButton;
    private readonly _btnDeleteMapWidth!            : IUiButton;

    private readonly _labelMapHeightTitle!          : IUiLabel;
    private readonly _labelMapHeight!               : IUiLabel;
    private readonly _btnMapHeight!                 : IUiButton;
    private readonly _btnDeleteMapHeight!           : IUiButton;

    private readonly _labelPlayersCountTitle!       : IUiLabel;
    private readonly _labelPlayersCount!            : IUiLabel;
    private readonly _btnPlayersCount!              : IUiButton;
    private readonly _btnDeletePlayersCount!        : IUiButton;

    private readonly _labelRankScoreTitle!          : IUiLabel;
    private readonly _labelRankScore!               : IUiLabel;
    private readonly _btnRankScore!                 : IUiButton;
    private readonly _btnDeleteRankScore!           : IUiButton;

    private readonly _labelTurnsCountTitle!         : IUiLabel;
    private readonly _labelTurnsCount!              : IUiLabel;
    private readonly _btnTurnsCount!                : IUiButton;
    private readonly _btnDeleteTurnsCount!          : IUiButton;

    private readonly _labelActionsCountTitle!       : IUiLabel;
    private readonly _labelActionsCount!            : IUiLabel;
    private readonly _btnActionsCount!              : IUiButton;
    private readonly _btnDeleteActionsCount!        : IUiButton;

    private _replayFilter                           = new ReplayFilter();

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },
            { ui: this._btnHelp,                    callback: this._onTouchedBtnHelp },
            { ui: this._btnReset,                   callback: this._onTouchedBtnReset },
            { ui: this._btnSearch,                  callback: this._onTouchedBtnSearch },

            { ui: this._btnReplayId,                callback: this._onTouchedBtnReplayId },
            { ui: this._btnDeleteReplayId,          callback: this._onTouchedBtnDeleteReplayId },

            { ui: this._btnMapName,                 callback: this._onTouchedBtnMapName },
            { ui: this._btnDeleteMapName,           callback: this._onTouchedBtnDeleteMapName },

            { ui: this._btnPlayerSelf,              callback: this._onTouchedBtnPlayerSelf },
            { ui: this._btnPlayerName,              callback: this._onTouchedBtnPlayerName },
            { ui: this._btnDeletePlayerName,        callback: this._onTouchedBtnDeletePlayerName },

            { ui: this._btnCoName,                  callback: this._onTouchedBtnCoName },
            { ui: this._btnDeleteCoName,            callback: this._onTouchedBtnDeleteCoName },

            { ui: this._btnMinGlobalRating,         callback: this._onTouchedBtnMinGlobalRating },
            { ui: this._btnDeleteMinGlobalRating,   callback: this._onTouchedBtnDeleteMinGlobalRating },

            { ui: this._btnHasFog,                  callback: this._onTouchedBtnHasFog },
            { ui: this._btnDeleteHasFog,            callback: this._onTouchedBtnDeleteHasFog },

            { ui: this._btnIsRanked,                callback: this._onTouchedBtnIsRanked },
            { ui: this._btnDeleteIsRanked,          callback: this._onTouchedBtnDeleteIsRanked },

            { ui: this._btnIsFavorite,              callback: this._onTouchedBtnIsFavorite },
            { ui: this._btnDeleteIsFavorite,        callback: this._onTouchedBtnDeleteIsFavorite },

            { ui: this._btnMapWidth,                callback: this._onTouchedBtnMapWidth },
            { ui: this._btnDeleteMapWidth,          callback: this._onTouchedBtnDeleteMapWidth },

            { ui: this._btnMapHeight,               callback: this._onTouchedBtnMapHeight },
            { ui: this._btnDeleteMapHeight,         callback: this._onTouchedBtnDeleteMapHeight },

            { ui: this._btnPlayersCount,            callback: this._onTouchedBtnPlayersCount },
            { ui: this._btnDeletePlayersCount,      callback: this._onTouchedBtnDeletePlayersCount },

            { ui: this._btnRankScore,               callback: this._onTouchedBtnRankScore },
            { ui: this._btnDeleteRankScore,         callback: this._onTouchedBtnDeleteRankScore },

            { ui: this._btnTurnsCount,              callback: this._onTouchedBtnTurnsCount },
            { ui: this._btnDeleteTurnsCount,        callback: this._onTouchedBtnDeleteTurnsCount },

            { ui: this._btnActionsCount,            callback: this._onTouchedBtnActionsCount },
            { ui: this._btnDeleteActionsCount,      callback: this._onTouchedBtnDeleteActionsCount },

            // { ui: this._btnMinMyRating,         callback: this._onTouchedBtnMinMyRating },
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
        this._replayFilter = this.getOpenData()?.replayFilter?.clone() ?? new ReplayFilter();

        this._updateComponentsForLanguage();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => `${getText(TextType.A0837)}\n\n${getText(TextType.A0063)}`,
        });
    }

    private _onTouchedBtnReset(): void {
        this._replayFilter = new ReplayFilter();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnSearch(): void {
        openPanel(getDict().RwReplayListPanel, {
            filter                  : this._replayFilter,
            usePreviousFilter       : false,
            usePreviousPageIndex    : false,
        });
        this.closePanel();
    }

    private _onTouchedBtnMinGlobalRating(): void {
        const filter        = this._replayFilter;
        const ratingArray   = filter.globalRatingRange ?? [];
        openPanel(getDict().CommonDoubleSliderPanel, {
            getTitleText        : () => getText(TextType.B0364),
            minNumber           : 0,
            maxNumber           : 10,
            currentLowerNumber  : ratingArray[0] ?? 0,
            currentUpperNumber  : ratingArray[1] ?? 10,
            callback        : (lowerNumber, upperNumber)  => {
                filter.globalRatingRange = [lowerNumber, upperNumber];
                this._updateLabelMinGlobalRating();
            }
        });
    }
    private _onTouchedBtnDeleteMinGlobalRating(): void {
        this._replayFilter.globalRatingRange = null;
        this._updateLabelMinGlobalRating();
    }

    private _onTouchedBtnMinMyRating(): void {
        const filter = this._replayFilter;
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B0082),
            minValue        : 0,
            maxValue        : 10,
            currentValue    : filter.minMyRating ?? 0,
            callback        : minMyRating => {
                filter.minMyRating = minMyRating;
                this._updateLabelMinMyRating();
            }
        });
    }

    private _onTouchedBtnReplayId(): void {
        const filter = this._replayFilter;
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B0235),
            minValue        : 1,
            maxValue        : 99999999,
            currentValue    : filter.replayId ?? 0,
            callback        : replayId => {
                filter.replayId = replayId;
                this._updateLabelReplayId();
            }
        });
    }
    private _onTouchedBtnDeleteReplayId(): void {
        this._replayFilter.replayId = null;
        this._updateLabelReplayId();
    }

    private _onTouchedBtnHasFog(): void {
        const filter    = this._replayFilter;
        filter.hasFog   = !filter.hasFog;
        this._updateLabelHasFog();
    }
    private _onTouchedBtnDeleteHasFog(): void {
        this._replayFilter.hasFog = null;
        this._updateLabelHasFog();
    }

    private _onTouchedBtnIsFavorite(): void {
        const filter        = this._replayFilter;
        filter.isFavorite   = !filter.isFavorite;
        this._updateLabelIsFavorite();
    }
    private _onTouchedBtnDeleteIsFavorite(): void {
        this._replayFilter.isFavorite = null;
        this._updateLabelIsFavorite();
    }

    private _onTouchedBtnIsRanked(): void {
        const filter = this._replayFilter;
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            availableNumberArray    : [
                ModeId.AutoTourney,
                ModeId.Coop,
                ModeId.Free,
                ModeId.RankedMatch,
                ModeId.UnrankedMatch,
                ModeId.Versus,
            ],
            currentNumber       : filter.gameMode ?? null,
            getTitleText        : () => getText(TextType.B1013),
            getNumberMainText   : gameMode => getGameModeName(gameMode) ?? UndefinedError,
            getNumberHelpText   : gameMode => getGameModeHelpText(gameMode),
            callbackOnConfirm   : gameMode => {
                filter.gameMode = gameMode;
                this._updateLabelIsRanked();
            }
        });
    }
    private _onTouchedBtnDeleteIsRanked(): void {
        this._replayFilter.gameMode = null;
        this._updateLabelIsRanked();
    }

    private _onTouchedBtnPlayerSelf(): void {
        const filter    = this._replayFilter;
        const userId    = getSelfUserId();
        filter.userId   = (filter.userId === userId) ? null : userId;
        this._updateLabelPlayerName();
    }
    private _onTouchedBtnPlayerName(): void {
        const filter = this._replayFilter;
        openPanel(getDict().CommonSearchSingleUserPanel, {
            getTitleText        : null,
            callbackOnConfirm   : userId => {
                filter.userId = userId;
                this._updateLabelPlayerName();
            },
        });
    }
    private _onTouchedBtnDeletePlayerName(): void {
        this._replayFilter.userId = null;
        this._updateLabelPlayerName();
    }

    private async _onTouchedBtnMapName(): Promise<void> {
        const filter = this._replayFilter;
        openPanel(getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : [...await getEnabledNormalMapIdSet()],
            getTitleText                : () => getText(TextType.B0227),
            callback                    : normalMapId => {
                filter.normalMapId = normalMapId;
                this._updateLabelMapName();
            },
        });
    }
    private _onTouchedBtnDeleteMapName(): void {
        this._replayFilter.normalMapId = null;
        this._updateLabelMapName();
    }

    private async _onTouchedBtnCoName(): Promise<void> {
        const gameConfig    = await getLatestGameConfig();
        const filter        = this._replayFilter;
        openPanel(getDict().CommonChooseSingleCoCategoryIdPanel, {
            gameConfig                      : gameConfig,
            availableCoCategoryIdArray      : gameConfig.getAllEnabledCoCategoryIdArray(),
            currentCoCategoryId             : filter.coCategoryId ?? null,
            isBan                           : false,
            callbackOnConfirm               : coCategoryId => {
                filter.coCategoryId = coCategoryId;
                this._updateLabelCoName();
            },
        });
    }
    private _onTouchedBtnDeleteCoName(): void {
        this._replayFilter.coCategoryId = null;
        this._updateLabelCoName();
    }

    private _onTouchedBtnMapWidth(): void {
        const filter            = this._replayFilter;
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
        const filter = this._replayFilter;
        delete filter.minMapWidth;
        delete filter.maxMapWidth;
        this._updateLabelMapWidth();
    }

    private _onTouchedBtnMapHeight(): void {
        const filter            = this._replayFilter;
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
        const filter = this._replayFilter;
        delete filter.minMapHeight;
        delete filter.maxMapHeight;
        this._updateLabelMapHeight();
    }

    private _onTouchedBtnPlayersCount(): void {
        const filter = this._replayFilter;
        openPanel(getDict().CommonDoubleSliderPanel, {
            getTitleText        : () => getText(TextType.B0364),
            minNumber           : 2,
            maxNumber           : PlayerIndex.Max,
            currentLowerNumber  : filter.minPlayersCountUnneutral ?? 2,
            currentUpperNumber  : filter.maxPlayersCountUnneutral ?? PlayerIndex.Max,
            callback            : (lowerNumber, upperNumber)  => {
                filter.minPlayersCountUnneutral = lowerNumber;
                filter.maxPlayersCountUnneutral = upperNumber;
                this._updateLabelPlayersCount();
            }
        });
    }
    private _onTouchedBtnDeletePlayersCount(): void {
        const filter = this._replayFilter;
        delete filter.minPlayersCountUnneutral;
        delete filter.maxPlayersCountUnneutral;
        this._updateLabelPlayersCount();
    }

    private _onTouchedBtnRankScore(): void {
        const filter            = this._replayFilter;
        const oldMaxRankScore   = filter.maxRankScore;
        const minValue          = 0;
        const maxValue          = 9999;
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B0687),
            currentValue    : filter.minRankScore,
            minValue        : minValue,
            maxValue        : oldMaxRankScore ?? maxValue,
            callback        : newMinRankScore => {
                if (newMinRankScore == null) {
                    delete filter.minRankScore;
                } else {
                    filter.minRankScore = newMinRankScore;
                }
                this._updateLabelRankScore();

                openPanel(getDict().CommonInputNullableIntegerPanel, {
                    getTitle           : () => getText(TextType.B0863),
                    currentValue    : oldMaxRankScore,
                    minValue        : newMinRankScore ?? minValue,
                    maxValue        : maxValue,
                    callback        : newMaxRankScore => {
                        if (newMaxRankScore == null) {
                            delete filter.maxRankScore;
                        } else {
                            filter.maxRankScore = newMaxRankScore;
                        }
                        this._updateLabelRankScore();
                    },
                });
            },
        });
    }
    private _onTouchedBtnDeleteRankScore(): void {
        const filter = this._replayFilter;
        delete filter.minRankScore;
        delete filter.maxRankScore;
        this._updateLabelRankScore();
    }

    private _onTouchedBtnTurnsCount(): void {
        const filter            = this._replayFilter;
        const oldMaxTurnsCount  = filter.maxTurnsCount;
        const minValue          = TurnIndex.FirstIndex;
        const maxValue          = TurnIndex.MaxLimit;
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B0611),
            currentValue    : filter.minTurnsCount,
            minValue        : minValue,
            maxValue        : oldMaxTurnsCount ?? maxValue,
            callback        : newMinTurnsCount => {
                if (newMinTurnsCount == null) {
                    delete filter.minTurnsCount;
                } else {
                    filter.minTurnsCount = newMinTurnsCount;
                }
                this._updateLabelTurnsCount();

                openPanel(getDict().CommonInputNullableIntegerPanel, {
                    getTitle           : () => getText(TextType.B0621),
                    currentValue    : oldMaxTurnsCount,
                    minValue        : newMinTurnsCount ?? minValue,
                    maxValue        : maxValue,
                    callback        : newMaxTurnsCount => {
                        if (newMaxTurnsCount == null) {
                            delete filter.maxTurnsCount;
                        } else {
                            filter.maxTurnsCount = newMaxTurnsCount;
                        }
                        this._updateLabelTurnsCount();
                    },
                });
            },
        });
    }
    private _onTouchedBtnDeleteTurnsCount(): void {
        const filter = this._replayFilter;
        delete filter.minTurnsCount;
        delete filter.maxTurnsCount;
        this._updateLabelTurnsCount();
    }

    private _onTouchedBtnActionsCount(): void {
        const filter                = this._replayFilter;
        const oldMaxActionsCount    = filter.maxWarOperationsCount;
        const minValue              = 1;
        const maxValue              = Common.MaxLimit;
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B1395),
            currentValue    : filter.minWarOperationsCount,
            minValue        : minValue,
            maxValue        : oldMaxActionsCount ?? maxValue,
            callback        : newMinActionsCount => {
                if (newMinActionsCount == null) {
                    delete filter.minWarOperationsCount;
                } else {
                    filter.minWarOperationsCount = newMinActionsCount;
                }
                this._updateLabelActionsCount();

                openPanel(getDict().CommonInputNullableIntegerPanel, {
                    getTitle           : () => getText(TextType.B1396),
                    currentValue    : oldMaxActionsCount,
                    minValue        : newMinActionsCount ?? minValue,
                    maxValue        : maxValue,
                    callback        : newMaxActionsCount => {
                        if (newMaxActionsCount == null) {
                            delete filter.maxWarOperationsCount;
                        } else {
                            filter.maxWarOperationsCount = newMaxActionsCount;
                        }
                        this._updateLabelActionsCount();
                    },
                });
            },
        });
    }
    private _onTouchedBtnDeleteActionsCount(): void {
        const filter = this._replayFilter;
        delete filter.minWarOperationsCount;
        delete filter.maxWarOperationsCount;
        this._updateLabelActionsCount();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0228);
        this._labelReplayIdTitle.setLangText(TextType.B0235);
        this._labelMapNameTitle.setLangText(TextType.B0225);
        this._labelPlayerNameTitle.setLangText(TextType.B0031);
        this._btnPlayerSelf.setLangText(TextType.B0216);
        this._labelCoNameTitle.setLangText(TextType.B0394);
        this._labelMinGlobalRatingTitle.setLangText(TextType.B0083);
        this._labelHasFogTitle.setLangText(TextType.B0020);
        this._labelIsRankedTitle.setLangText(TextType.B0153);
        this._labelIsFavoriteTitle.setLangText(TextType.B1291);
        this._labelMapWidthTitle.setLangText(TextType.B0034);
        this._labelMapHeightTitle.setLangText(TextType.B0035);
        this._labelPlayersCountTitle.setLangText(TextType.B0922);
        this._labelRankScoreTitle.setLangText(TextType.B0060);
        this._labelTurnsCountTitle.setLangText(TextType.B1393);
        this._labelActionsCountTitle.setLangText(TextType.B1394);

        this._btnReset.setLangText(TextType.B0567);
        this._btnSearch.setLangText(TextType.B0228);

        this._updateLabelHasFog();
        this._updateLabelIsFavorite();
        this._updateLabelIsRanked();
        this._updateLabelMapWidth();
        this._updateLabelMapHeight();
        this._updateLabelPlayersCount();
        this._updateLabelRankScore();
        this._updateLabelTurnsCount();
        this._updateLabelActionsCount();
    }
    private _updateComponentsForFilter(): void {
        this._updateLabelReplayId();
        this._updateLabelPlayerName();
        this._updateLabelMapName();
        this._updateLabelCoName();
        this._updateLabelMinMyRating();
        this._updateLabelMinGlobalRating();
        this._updateLabelHasFog();
        this._updateLabelIsFavorite();
        this._updateLabelIsRanked();
        this._updateLabelMapWidth();
        this._updateLabelMapHeight();
        this._updateLabelPlayersCount();
        this._updateLabelRankScore();
        this._updateLabelTurnsCount();
        this._updateLabelActionsCount();
    }

    private _updateLabelReplayId(): void {
        this._labelReplayId.setText(`${this._replayFilter.replayId ?? ``}`);
    }

    private async _updateLabelPlayerName(): Promise<void> {
        const userId = this._replayFilter.userId;
        this._labelPlayerName.setText(userId == null
            ? ``
            : (await getUserNickname(userId)) ?? UndefinedError
        );
    }

    private async _updateLabelMapName(): Promise<void> {
        const normalMapId = this._replayFilter.normalMapId;
        this._labelMapName.setText(normalMapId == null
            ? ``
            : (await getMapNameInCurrentLanguage(normalMapId)) ?? UndefinedError
        );
    }

    private async _updateLabelCoName(): Promise<void> {
        const coCategoryId = this._replayFilter.coCategoryId;
        this._labelCoName.setText(coCategoryId == null
            ? ``
            : (await getLatestGameConfig()).getCoCategoryCfg(coCategoryId)?.getName() ?? UndefinedError
        );
    }

    private _updateLabelMinMyRating(): void {
        // this._labelMinMyRating.text = `${this._minMyRating ?? ``}`;
    }

    private _updateLabelMinGlobalRating(): void {
        const range = this._replayFilter.globalRatingRange ?? [];
        this._labelMinGlobalRating.setText(!range.length
            ? ``
            : `${range[0]} ~ ${range[1]}`
        );
    }

    private _updateLabelHasFog(): void {
        const hasFog = this._replayFilter.hasFog;
        this._labelHasFog.setText(hasFog == null
            ? ``
            : getTextForYesOrNo(hasFog)
        );
    }

    private _updateLabelIsFavorite(): void {
        const isFavorite = this._replayFilter.isFavorite;
        this._labelIsFavorite.setText(isFavorite == null
            ? ``
            : getTextForYesOrNo(isFavorite)
        );
    }

    private _updateLabelIsRanked(): void {
        const gameMode = this._replayFilter.gameMode;
        this._labelIsRanked.setText(gameMode == null
            ? ``
            : (getGameModeName(gameMode) ?? UndefinedError)
        );
    }

    private _updateLabelMapWidth(): void {
        const filter    = this._replayFilter;
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
        const filter    = this._replayFilter;
        const minHeight = filter.minMapHeight;
        const maxHeight = filter.maxMapHeight;
        const label     = this._labelMapHeight;
        if ((minHeight == null) && (maxHeight == null)) {
            label.setText(``);
        } else {
            label.setText(`${minHeight ?? getText(TextType.B0776)} ~ ${maxHeight ?? getText(TextType.B0776)}`);
        }
    }

    private _updateLabelPlayersCount(): void {
        const filter    = this._replayFilter;
        const minHeight = filter.minPlayersCountUnneutral;
        const maxHeight = filter.maxPlayersCountUnneutral;
        const label     = this._labelPlayersCount;
        if ((minHeight == null) && (maxHeight == null)) {
            label.setText(``);
        } else {
            label.setText(`${minHeight ?? getText(TextType.B0776)} ~ ${maxHeight ?? getText(TextType.B0776)}`);
        }
    }

    private _updateLabelRankScore(): void {
        const filter    = this._replayFilter;
        const minHeight = filter.minRankScore;
        const maxHeight = filter.maxRankScore;
        const label     = this._labelRankScore;
        if ((minHeight == null) && (maxHeight == null)) {
            label.setText(``);
        } else {
            label.setText(`${minHeight ?? getText(TextType.B0776)} ~ ${maxHeight ?? getText(TextType.B0776)}`);
        }
    }

    private _updateLabelTurnsCount(): void {
        const filter    = this._replayFilter;
        const minHeight = filter.minTurnsCount;
        const maxHeight = filter.maxTurnsCount;
        const label     = this._labelTurnsCount;
        if ((minHeight == null) && (maxHeight == null)) {
            label.setText(``);
        } else {
            label.setText(`${minHeight ?? getText(TextType.B0776)} ~ ${maxHeight ?? getText(TextType.B0776)}`);
        }
    }

    private _updateLabelActionsCount(): void {
        const filter    = this._replayFilter;
        const minHeight = filter.minWarOperationsCount;
        const maxHeight = filter.maxWarOperationsCount;
        const label     = this._labelActionsCount;
        if ((minHeight == null) && (maxHeight == null)) {
            label.setText(``);
        } else {
            label.setText(`${minHeight ?? getText(TextType.B0776)} ~ ${maxHeight ?? getText(TextType.B0776)}`);
        }
    }
}
