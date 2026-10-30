import {
    GamePanels_Dict,
    NormalMap_Model_NormalMapModel,
    Lang_Utils,
    GameConfigs_Provider,
    Users_Model,
    Maps_Constants,
    GameModes_Constants,
    GamePanels_Manager,
    Players_Constants,
    AuxiliaryTypes_ReplayFilter,
    Lang_Constants,
    Turns_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    WarOperations_Constants,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";

export interface OpenData {
    replayFilter    : AuxiliaryTypes_ReplayFilter.ReplayFilter | null;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnReset!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSearch!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!                      : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelReplayIdTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelReplayId!                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnReplayId!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteReplayId!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMapNameTitle!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapName!                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnMapName!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMapName!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelPlayerNameTitle!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPlayerName!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnPlayerSelf!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnPlayerName!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeletePlayerName!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelCoNameTitle!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCoName!                  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnCoName!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteCoName!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMinGlobalRatingTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMinGlobalRating!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnMinGlobalRating!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMinGlobalRating!     : Ui_Interfaces_IUiButton.IUiButton;

    // private readonly _labelMinMyRatingTitle!        : Ui.Interfaces.IUiLabel;
    // private readonly _labelMinMyRating!             : Ui.Interfaces.IUiLabel;
    // private readonly _btnMinMyRating!               : Ui.Interfaces.IUiButton;

    private readonly _labelHasFogTitle!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelHasFog!                  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHasFog!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteHasFog!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelIsRankedTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelIsRanked!                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnIsRanked!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteIsRanked!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelIsFavoriteTitle!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelIsFavorite!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnIsFavorite!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteIsFavorite!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMapWidthTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapWidth!                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnMapWidth!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMapWidth!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMapHeightTitle!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapHeight!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnMapHeight!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMapHeight!           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelPlayersCountTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPlayersCount!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnPlayersCount!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeletePlayersCount!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelRankScoreTitle!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRankScore!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnRankScore!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteRankScore!           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelTurnsCountTitle!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTurnsCount!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnTurnsCount!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteTurnsCount!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelActionsCountTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelActionsCount!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActionsCount!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteActionsCount!        : Ui_Interfaces_IUiButton.IUiButton;

    private _replayFilter                           = new AuxiliaryTypes_ReplayFilter.ReplayFilter();

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,                   callback : this.closePanel },
            { ui : this._btnHelp,                    callback : this._onTouchedBtnHelp },
            { ui : this._btnReset,                   callback : this._onTouchedBtnReset },
            { ui : this._btnSearch,                  callback : this._onTouchedBtnSearch },

            { ui : this._btnReplayId,                callback : this._onTouchedBtnReplayId },
            { ui : this._btnDeleteReplayId,          callback : this._onTouchedBtnDeleteReplayId },

            { ui : this._btnMapName,                 callback : this._onTouchedBtnMapName },
            { ui : this._btnDeleteMapName,           callback : this._onTouchedBtnDeleteMapName },

            { ui : this._btnPlayerSelf,              callback : this._onTouchedBtnPlayerSelf },
            { ui : this._btnPlayerName,              callback : this._onTouchedBtnPlayerName },
            { ui : this._btnDeletePlayerName,        callback : this._onTouchedBtnDeletePlayerName },

            { ui : this._btnCoName,                  callback : this._onTouchedBtnCoName },
            { ui : this._btnDeleteCoName,            callback : this._onTouchedBtnDeleteCoName },

            { ui : this._btnMinGlobalRating,         callback : this._onTouchedBtnMinGlobalRating },
            { ui : this._btnDeleteMinGlobalRating,   callback : this._onTouchedBtnDeleteMinGlobalRating },

            { ui : this._btnHasFog,                  callback : this._onTouchedBtnHasFog },
            { ui : this._btnDeleteHasFog,            callback : this._onTouchedBtnDeleteHasFog },

            { ui : this._btnIsRanked,                callback : this._onTouchedBtnIsRanked },
            { ui : this._btnDeleteIsRanked,          callback : this._onTouchedBtnDeleteIsRanked },

            { ui : this._btnIsFavorite,              callback : this._onTouchedBtnIsFavorite },
            { ui : this._btnDeleteIsFavorite,        callback : this._onTouchedBtnDeleteIsFavorite },

            { ui : this._btnMapWidth,                callback : this._onTouchedBtnMapWidth },
            { ui : this._btnDeleteMapWidth,          callback : this._onTouchedBtnDeleteMapWidth },

            { ui : this._btnMapHeight,               callback : this._onTouchedBtnMapHeight },
            { ui : this._btnDeleteMapHeight,         callback : this._onTouchedBtnDeleteMapHeight },

            { ui : this._btnPlayersCount,            callback : this._onTouchedBtnPlayersCount },
            { ui : this._btnDeletePlayersCount,      callback : this._onTouchedBtnDeletePlayersCount },

            { ui : this._btnRankScore,               callback : this._onTouchedBtnRankScore },
            { ui : this._btnDeleteRankScore,         callback : this._onTouchedBtnDeleteRankScore },

            { ui : this._btnTurnsCount,              callback : this._onTouchedBtnTurnsCount },
            { ui : this._btnDeleteTurnsCount,        callback : this._onTouchedBtnDeleteTurnsCount },

            { ui : this._btnActionsCount,            callback : this._onTouchedBtnActionsCount },
            { ui : this._btnDeleteActionsCount,      callback : this._onTouchedBtnDeleteActionsCount },

            // { ui: this._btnMinMyRating,         callback: this._onTouchedBtnMinMyRating },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._replayFilter = this.getOpenData()?.replayFilter?.clone() ?? new AuxiliaryTypes_ReplayFilter.ReplayFilter();

        this._updateComponentsForLanguage();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => `${Lang_Utils.getText(Lang_Constants.TextType.A0837)}\n\n${Lang_Utils.getText(Lang_Constants.TextType.A0063)}`,
        });
    }

    private _onTouchedBtnReset(): void {
        this._replayFilter = new AuxiliaryTypes_ReplayFilter.ReplayFilter();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnSearch(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().RwReplayListPanel, {
            filter               : this._replayFilter,
            usePreviousFilter    : false,
            usePreviousPageIndex : false,
        });
        this.closePanel();
    }

    private _onTouchedBtnMinGlobalRating(): void {
        const filter        = this._replayFilter;
        const ratingArray   = filter.globalRatingRange ?? [];
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonDoubleSliderPanel, {
            getTitleText       : () => Lang_Utils.getText(Lang_Constants.TextType.B0364),
            minNumber          : 0,
            maxNumber          : 10,
            currentLowerNumber : ratingArray[0] ?? 0,
            currentUpperNumber : ratingArray[1] ?? 10,
            callback           : (lowerNumber, upperNumber)  => {
                filter.globalRatingRange = [lowerNumber, upperNumber];
                this._updateLabelMinGlobalRating();
            },
        });
    }
    private _onTouchedBtnDeleteMinGlobalRating(): void {
        this._replayFilter.globalRatingRange = null;
        this._updateLabelMinGlobalRating();
    }

    private _onTouchedBtnMinMyRating(): void {
        const filter = this._replayFilter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0082),
            minValue     : 0,
            maxValue     : 10,
            currentValue : filter.minMyRating ?? 0,
            callback     : minMyRating => {
                filter.minMyRating = minMyRating;
                this._updateLabelMinMyRating();
            },
        });
    }

    private _onTouchedBtnReplayId(): void {
        const filter = this._replayFilter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0235),
            minValue     : 1,
            maxValue     : 99999999,
            currentValue : filter.replayId ?? 0,
            callback     : replayId => {
                filter.replayId = replayId;
                this._updateLabelReplayId();
            },
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            availableNumberArray : [
                GameModes_Constants.ModeId.AutoTourney,
                GameModes_Constants.ModeId.Coop,
                GameModes_Constants.ModeId.Free,
                GameModes_Constants.ModeId.RankedMatch,
                GameModes_Constants.ModeId.UnrankedMatch,
                GameModes_Constants.ModeId.Versus,
            ],
            currentNumber     : filter.gameMode ?? null,
            getTitleText      : () => Lang_Utils.getText(Lang_Constants.TextType.B1013),
            getNumberMainText : gameMode => Lang_Utils.getGameModeName(gameMode) ?? Lang_Constants.UndefinedError,
            getNumberHelpText : gameMode => Lang_Utils.getGameModeHelpText(gameMode),
            callbackOnConfirm : gameMode => {
                filter.gameMode = gameMode;
                this._updateLabelIsRanked();
            },
        });
    }
    private _onTouchedBtnDeleteIsRanked(): void {
        this._replayFilter.gameMode = null;
        this._updateLabelIsRanked();
    }

    private _onTouchedBtnPlayerSelf(): void {
        const filter    = this._replayFilter;
        const userId    = Users_Model.getSelfUserId();
        filter.userId   = (filter.userId === userId) ? null : userId;
        this._updateLabelPlayerName();
    }
    private _onTouchedBtnPlayerName(): void {
        const filter = this._replayFilter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonSearchSingleUserPanel, {
            getTitleText      : null,
            callbackOnConfirm : userId => {
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray : [...await NormalMap_Model_NormalMapModel.getEnabledNormalMapIdSet()],
            getTitleText              : () => Lang_Utils.getText(Lang_Constants.TextType.B0227),
            callback                  : normalMapId => {
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
        const gameConfig    = await GameConfigs_Provider.getLatestGameConfig();
        const filter        = this._replayFilter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoCategoryIdPanel, {
            gameConfig                 : gameConfig,
            availableCoCategoryIdArray : gameConfig.getAllEnabledCoCategoryIdArray(),
            currentCoCategoryId        : filter.coCategoryId ?? null,
            isBan                      : false,
            callbackOnConfirm          : coCategoryId => {
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
        const filter = this._replayFilter;
        delete filter.minMapWidth;
        delete filter.maxMapWidth;
        this._updateLabelMapWidth();
    }

    private _onTouchedBtnMapHeight(): void {
        const filter            = this._replayFilter;
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
        const filter = this._replayFilter;
        delete filter.minMapHeight;
        delete filter.maxMapHeight;
        this._updateLabelMapHeight();
    }

    private _onTouchedBtnPlayersCount(): void {
        const filter = this._replayFilter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonDoubleSliderPanel, {
            getTitleText       : () => Lang_Utils.getText(Lang_Constants.TextType.B0364),
            minNumber          : 2,
            maxNumber          : Players_Constants.PlayerIndex.Max,
            currentLowerNumber : filter.minPlayersCountUnneutral ?? 2,
            currentUpperNumber : filter.maxPlayersCountUnneutral ?? Players_Constants.PlayerIndex.Max,
            callback           : (lowerNumber, upperNumber)  => {
                filter.minPlayersCountUnneutral = lowerNumber;
                filter.maxPlayersCountUnneutral = upperNumber;
                this._updateLabelPlayersCount();
            },
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0687),
            currentValue : filter.minRankScore,
            minValue     : minValue,
            maxValue     : oldMaxRankScore ?? maxValue,
            callback     : newMinRankScore => {
                if (newMinRankScore == null) {
                    delete filter.minRankScore;
                } else {
                    filter.minRankScore = newMinRankScore;
                }
                this._updateLabelRankScore();

                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                    getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0863),
                    currentValue : oldMaxRankScore,
                    minValue     : newMinRankScore ?? minValue,
                    maxValue     : maxValue,
                    callback     : newMaxRankScore => {
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
        const minValue          = Turns_Constants.TurnIndex.FirstIndex;
        const maxValue          = Turns_Constants.TurnIndex.MaxLimit;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0611),
            currentValue : filter.minTurnsCount,
            minValue     : minValue,
            maxValue     : oldMaxTurnsCount ?? maxValue,
            callback     : newMinTurnsCount => {
                if (newMinTurnsCount == null) {
                    delete filter.minTurnsCount;
                } else {
                    filter.minTurnsCount = newMinTurnsCount;
                }
                this._updateLabelTurnsCount();

                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                    getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0621),
                    currentValue : oldMaxTurnsCount,
                    minValue     : newMinTurnsCount ?? minValue,
                    maxValue     : maxValue,
                    callback     : newMaxTurnsCount => {
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
        const maxValue              = WarOperations_Constants.Common.MaxLimit;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1395),
            currentValue : filter.minWarOperationsCount,
            minValue     : minValue,
            maxValue     : oldMaxActionsCount ?? maxValue,
            callback     : newMinActionsCount => {
                if (newMinActionsCount == null) {
                    delete filter.minWarOperationsCount;
                } else {
                    filter.minWarOperationsCount = newMinActionsCount;
                }
                this._updateLabelActionsCount();

                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
                    getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B1396),
                    currentValue : oldMaxActionsCount,
                    minValue     : newMinActionsCount ?? minValue,
                    maxValue     : maxValue,
                    callback     : newMaxActionsCount => {
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0228);
        this._labelReplayIdTitle.setLangText(Lang_Constants.TextType.B0235);
        this._labelMapNameTitle.setLangText(Lang_Constants.TextType.B0225);
        this._labelPlayerNameTitle.setLangText(Lang_Constants.TextType.B0031);
        this._btnPlayerSelf.setLangText(Lang_Constants.TextType.B0216);
        this._labelCoNameTitle.setLangText(Lang_Constants.TextType.B0394);
        this._labelMinGlobalRatingTitle.setLangText(Lang_Constants.TextType.B0083);
        this._labelHasFogTitle.setLangText(Lang_Constants.TextType.B0020);
        this._labelIsRankedTitle.setLangText(Lang_Constants.TextType.B0153);
        this._labelIsFavoriteTitle.setLangText(Lang_Constants.TextType.B1291);
        this._labelMapWidthTitle.setLangText(Lang_Constants.TextType.B0034);
        this._labelMapHeightTitle.setLangText(Lang_Constants.TextType.B0035);
        this._labelPlayersCountTitle.setLangText(Lang_Constants.TextType.B0922);
        this._labelRankScoreTitle.setLangText(Lang_Constants.TextType.B0060);
        this._labelTurnsCountTitle.setLangText(Lang_Constants.TextType.B1393);
        this._labelActionsCountTitle.setLangText(Lang_Constants.TextType.B1394);

        this._btnReset.setLangText(Lang_Constants.TextType.B0567);
        this._btnSearch.setLangText(Lang_Constants.TextType.B0228);

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
            : (await Users_Model.getUserNickname(userId)) ?? Lang_Constants.UndefinedError,
        );
    }

    private async _updateLabelMapName(): Promise<void> {
        const normalMapId = this._replayFilter.normalMapId;
        this._labelMapName.setText(normalMapId == null
            ? ``
            : (await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId)) ?? Lang_Constants.UndefinedError,
        );
    }

    private async _updateLabelCoName(): Promise<void> {
        const coCategoryId = this._replayFilter.coCategoryId;
        this._labelCoName.setText(coCategoryId == null
            ? ``
            : (await GameConfigs_Provider.getLatestGameConfig()).getCoCategoryCfg(coCategoryId)?.getName() ?? Lang_Constants.UndefinedError,
        );
    }

    private _updateLabelMinMyRating(): void {
        // this._labelMinMyRating.text = `${this._minMyRating ?? ``}`;
    }

    private _updateLabelMinGlobalRating(): void {
        const range = this._replayFilter.globalRatingRange ?? [];
        this._labelMinGlobalRating.setText(!range.length
            ? ``
            : `${range[0]} ~ ${range[1]}`,
        );
    }

    private _updateLabelHasFog(): void {
        const hasFog = this._replayFilter.hasFog;
        this._labelHasFog.setText(hasFog == null
            ? ``
            : Lang_Utils.getTextForYesOrNo(hasFog),
        );
    }

    private _updateLabelIsFavorite(): void {
        const isFavorite = this._replayFilter.isFavorite;
        this._labelIsFavorite.setText(isFavorite == null
            ? ``
            : Lang_Utils.getTextForYesOrNo(isFavorite),
        );
    }

    private _updateLabelIsRanked(): void {
        const gameMode = this._replayFilter.gameMode;
        this._labelIsRanked.setText(gameMode == null
            ? ``
            : (Lang_Utils.getGameModeName(gameMode) ?? Lang_Constants.UndefinedError),
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
            label.setText(`${minWidth ?? Lang_Utils.getText(Lang_Constants.TextType.B0776)} ~ ${maxWidth ?? Lang_Utils.getText(Lang_Constants.TextType.B0776)}`);
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
            label.setText(`${minHeight ?? Lang_Utils.getText(Lang_Constants.TextType.B0776)} ~ ${maxHeight ?? Lang_Utils.getText(Lang_Constants.TextType.B0776)}`);
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
            label.setText(`${minHeight ?? Lang_Utils.getText(Lang_Constants.TextType.B0776)} ~ ${maxHeight ?? Lang_Utils.getText(Lang_Constants.TextType.B0776)}`);
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
            label.setText(`${minHeight ?? Lang_Utils.getText(Lang_Constants.TextType.B0776)} ~ ${maxHeight ?? Lang_Utils.getText(Lang_Constants.TextType.B0776)}`);
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
            label.setText(`${minHeight ?? Lang_Utils.getText(Lang_Constants.TextType.B0776)} ~ ${maxHeight ?? Lang_Utils.getText(Lang_Constants.TextType.B0776)}`);
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
            label.setText(`${minHeight ?? Lang_Utils.getText(Lang_Constants.TextType.B0776)} ~ ${maxHeight ?? Lang_Utils.getText(Lang_Constants.TextType.B0776)}`);
        }
    }
}
