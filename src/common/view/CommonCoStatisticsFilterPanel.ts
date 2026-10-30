import {
    AuxiliaryTypes_CoStatisticsFilter,
    Common_Model_CommonModel,
    GamePanels_Dict,
    Lang_Utils,
    NormalMap_Model_NormalMapModel,
    GameModes_Constants,
    GamePanels_Manager,
    Lang_Constants,
    Turns_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";

export type OpenData = {
    filter              : AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_CoStatisticsFilter.CoStatisticsFilter>;
    callbackOnConfirm   : (mapFilter: AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_CoStatisticsFilter.CoStatisticsFilter>) => void;
};
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!                      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnReset!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSearch!                    : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelNormalMapIdTitle!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNormalMapId!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyNormalMapId!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteNormalMapId!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelGameModeTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelGameMode!                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyGameMode!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteGameMode!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMinTurnIndexTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMinTurnIndex!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyMinTurnIndex!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMinTurnIndex!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMaxTurnIndexTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMaxTurnIndex!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyMaxTurnIndex!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMaxTurnIndex!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMinRankScoreTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMinRankScore!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyMinRankScore!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMinRankScore!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelMaxRankScoreTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMaxRankScore!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyMaxRankScore!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMaxRankScore!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelHasFogTitle!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelHasFog!                  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyHasFog!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteHasFog!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelIncludeMirrorGameTitle!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelIncludeMirrorGame!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyIncludeMirrorGame!   : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelShowDeprecatedCoTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelShowDeprecatedCo!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyShowDeprecatedCo!    : Ui_Interfaces_IUiButton.IUiButton;

    private _filter                                 = new AuxiliaryTypes_CoStatisticsFilter.CoStatisticsFilter();

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },
            { ui: this._btnHelp,                    callback: this._onTouchedBtnHelp },
            { ui: this._btnReset,                   callback: this._onTouchedBtnReset },
            { ui: this._btnSearch,                  callback: this._onTouchedBtnSearch },

            { ui: this._btnModifyNormalMapId,       callback: this._onTouchedBtnModifyNormalMapId },
            { ui: this._btnDeleteNormalMapId,       callback: this._onTouchedBtnDeleteNormalMapId },

            { ui: this._btnModifyGameMode,          callback: this._onTouchedBtnModifyGameMode },
            { ui: this._btnDeleteGameMode,          callback: this._onTouchedBtnDeleteGameMode },

            { ui: this._btnModifyMinTurnIndex,      callback: this._onTouchedBtnModifyMinTurnIndex },
            { ui: this._btnDeleteMinTurnIndex,      callback: this._onTouchedBtnDeleteMinTurnIndex },

            { ui: this._btnModifyMaxTurnIndex,      callback: this._onTouchedBtnModifyMaxTurnIndex },
            { ui: this._btnDeleteMaxTurnIndex,      callback: this._onTouchedBtnDeleteMaxTurnIndex },

            { ui: this._btnModifyMinRankScore,      callback: this._onTouchedBtnModifyMinRankScore },
            { ui: this._btnDeleteMinRankScore,      callback: this._onTouchedBtnDeleteMinRankScore },

            { ui: this._btnModifyMaxRankScore,      callback: this._onTouchedBtnModifyMaxRankScore },
            { ui: this._btnDeleteMaxRankScore,      callback: this._onTouchedBtnDeleteMaxRankScore },

            { ui: this._btnModifyHasFog,            callback: this._onTouchedBtnModifyHasFog },
            { ui: this._btnDeleteHasFog,            callback: this._onTouchedBtnDeleteHasFog },

            { ui: this._btnModifyIncludeMirrorGame, callback: this._onTouchedBtnModifyIncludeMirrorGame },

            { ui: this._btnModifyShowDeprecatedCo,  callback: this._onTouchedBtnModifyShowDeprecatedCo },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._filter = this.getOpenData()?.filter?.clone() ?? new AuxiliaryTypes_CoStatisticsFilter.CoStatisticsFilter();
        this._updateComponentsForLanguage();
        this._resetComponentsForFilter();
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0312),
        });
    }

    private _onTouchedBtnReset(): void {
        this._filter = new AuxiliaryTypes_CoStatisticsFilter.CoStatisticsFilter();
        this._resetComponentsForFilter();
    }

    private _onTouchedBtnSearch(): void {
        const filter = this._filter;
        this.getOpenData()?.callbackOnConfirm(checkIsEmptyCoStatisticsFilter(filter) ? undefined : filter);
        this.closePanel();
    }

    private async _onTouchedBtnModifyNormalMapId(): Promise<void> {
        const normalMapIdSet = new Set<number>();
        for (const gameData of (await Common_Model_CommonModel.getCoStatistics())?.getGameDataArray() ?? []) {
            const normalMapId = gameData.getNormalMapId() ?? 0;
            if (normalMapId >= 0) {
                normalMapIdSet.add(normalMapId);
            }
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : [...normalMapIdSet],
            getTitleText                : () => Lang_Utils.getText(Lang_Constants.TextType.B0227),
            callback                    : normalMapId => {
                this._filter.normalMapId = normalMapId;
                this._updateLabelNormalMapId();
            }
        });
    }
    private _onTouchedBtnDeleteNormalMapId(): void {
        delete this._filter.normalMapId;
        this._updateLabelNormalMapId();
    }

    private _onTouchedBtnModifyGameMode(): void {
        const filter        = this._filter;
        const currentMode   = filter.gameMode;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            availableNumberArray    : [
                GameModes_Constants.ModeId.Versus,
                GameModes_Constants.ModeId.Free,
                GameModes_Constants.ModeId.UnrankedMatch,
                GameModes_Constants.ModeId.RankedMatch,
                GameModes_Constants.ModeId.AutoTourney,
            ],
            currentNumber           : filter.gameMode,
            keepOrder               : true,
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B0153),
            getNumberMainText       : mode => Lang_Utils.getGameModeName(mode) ?? Lang_Constants.UndefinedError,
            getNumberHelpText       : mode => Lang_Utils.getGameModeHelpText(mode) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm       : mode => {
                if (currentMode != mode) {
                    filter.gameMode = mode;
                    this._updateLabelGameMode();
                }
            }
        });
    }
    private _onTouchedBtnDeleteGameMode(): void {
        delete this._filter.gameMode;
        this._updateLabelGameMode();
    }

    private _onTouchedBtnModifyMinTurnIndex(): void {
        const filter = this._filter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.B0611),
            minValue        : 6,
            maxValue        : filter.maxTurnIndex ?? Turns_Constants.TurnIndex.MaxLimit,
            currentValue    : filter.minTurnIndex,
            callback        : minTurnIndex => {
                filter.minTurnIndex = minTurnIndex;
                this._updateLabelMinTurnIndex();
            }
        });
    }
    private _onTouchedBtnDeleteMinTurnIndex(): void {
        delete this._filter.minTurnIndex;
        this._updateLabelMinTurnIndex();
    }

    private _onTouchedBtnModifyMaxTurnIndex(): void {
        const filter = this._filter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.B0621),
            minValue        : filter.minTurnIndex ?? 6,
            maxValue        : Turns_Constants.TurnIndex.MaxLimit,
            currentValue    : filter.maxTurnIndex,
            callback        : maxTurnIndex => {
                filter.maxTurnIndex = maxTurnIndex;
                this._updateLabelMaxTurnIndex();
            }
        });
    }
    private _onTouchedBtnDeleteMaxTurnIndex(): void {
        delete this._filter.maxTurnIndex;
        this._updateLabelMaxTurnIndex();
    }

    private _onTouchedBtnModifyMinRankScore(): void {
        const filter = this._filter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.B0687),
            minValue        : 0,
            maxValue        : filter.maxRankScore ?? 9999,
            currentValue    : filter.minRankScore,
            callback        : minRankScore => {
                filter.minRankScore = minRankScore;
                this._updateLabelMinRankScore();
            }
        });
    }
    private _onTouchedBtnDeleteMinRankScore(): void {
        delete this._filter.minRankScore;
        this._updateLabelMinRankScore();
    }

    private _onTouchedBtnModifyMaxRankScore(): void {
        const filter = this._filter;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => Lang_Utils.getText(Lang_Constants.TextType.B0863),
            minValue        : filter.minRankScore ?? 0,
            maxValue        : 9999,
            currentValue    : filter.maxRankScore,
            callback        : maxRankScore => {
                filter.maxRankScore = maxRankScore;
                this._updateLabelMaxRankScore();
            }
        });
    }
    private _onTouchedBtnDeleteMaxRankScore(): void {
        delete this._filter.maxRankScore;
        this._updateLabelMaxRankScore();
    }

    private _onTouchedBtnModifyHasFog(): void {
        const filter    = this._filter;
        filter.hasFog = !filter.hasFog;
        this._updateLabelHasFog();
    }
    private _onTouchedBtnDeleteHasFog(): void {
        delete this._filter.hasFog;
        this._updateLabelHasFog();
    }

    private _onTouchedBtnModifyIncludeMirrorGame(): void {
        const filter                = this._filter;
        filter.includeMirrorGame    = !filter.includeMirrorGame;
        this._updateLabelIncludeMirrorGame();
    }

    private _onTouchedBtnModifyShowDeprecatedCo(): void {
        const filter            = this._filter;
        filter.showDeprecatedCo = !filter.showDeprecatedCo;
        this._updateLabelShowDeprecatedCo();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _resetComponentsForFilter(): void {
        this._updateLabelNormalMapId();
        this._updateLabelGameMode();
        this._updateLabelMinTurnIndex();
        this._updateLabelMaxTurnIndex();
        this._updateLabelMinRankScore();
        this._updateLabelMaxRankScore();
        this._updateLabelHasFog();
        this._updateLabelIncludeMirrorGame();
        this._updateLabelShowDeprecatedCo();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0132);
        this._labelNormalMapIdTitle.setLangText(Lang_Constants.TextType.B0225);
        this._labelGameModeTitle.setLangText(Lang_Constants.TextType.B0153);
        this._labelMinTurnIndexTitle.setLangText(Lang_Constants.TextType.B0611);
        this._labelMaxTurnIndexTitle.setLangText(Lang_Constants.TextType.B0621);
        this._labelMinRankScoreTitle.setLangText(Lang_Constants.TextType.B0687);
        this._labelMaxRankScoreTitle.setLangText(Lang_Constants.TextType.B0863);
        this._labelHasFogTitle.setLangText(Lang_Constants.TextType.B0438);
        this._labelIncludeMirrorGameTitle.setLangText(Lang_Constants.TextType.B0941);
        this._labelShowDeprecatedCoTitle.setLangText(Lang_Constants.TextType.B0948);

        this._btnReset.setLangText(Lang_Constants.TextType.B0391);
        this._btnSearch.setLangText(Lang_Constants.TextType.B0228);
        this._updateLabelMaxRankScore();
    }

    private async _updateLabelNormalMapId(): Promise<void> {
        const normalMapId = this._filter.normalMapId;
        this._labelNormalMapId.setText(normalMapId == null
            ? ``
            : (await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId) ?? Lang_Constants.UndefinedError)
        );
    }
    private _updateLabelGameMode(): void {
        const gameMode = this._filter.gameMode;
        this._labelGameMode.setText(gameMode == null ? `` : (Lang_Utils.getGameModeName(gameMode) ?? Lang_Constants.UndefinedError));
    }
    private _updateLabelMinTurnIndex(): void {
        this._labelMinTurnIndex.setText(`${this._filter.minTurnIndex ?? ``}`);
    }
    private _updateLabelMaxTurnIndex(): void {
        this._labelMaxTurnIndex.setText(`${this._filter.maxTurnIndex ?? ``}`);
    }
    private _updateLabelMinRankScore(): void {
        this._labelMinRankScore.setText(`${this._filter.minRankScore ?? ``}`);
    }
    private _updateLabelMaxRankScore(): void {
        this._labelMaxRankScore.setText(`${this._filter.maxRankScore ?? ``}`);
    }
    private _updateLabelHasFog(): void {
        const hasFog = this._filter.hasFog;
        this._labelHasFog.setText(hasFog == null ? `` : Lang_Utils.getTextForYesOrNo(hasFog));
    }
    private _updateLabelIncludeMirrorGame(): void {
        this._labelIncludeMirrorGame.setLangText(this._filter.includeMirrorGame ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
    }
    private _updateLabelShowDeprecatedCo(): void {
        this._labelShowDeprecatedCo.setLangText(this._filter.showDeprecatedCo ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
    }
}

function checkIsEmptyCoStatisticsFilter(filter: AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_CoStatisticsFilter.CoStatisticsFilter>): boolean {
    if (filter == null) {
        return true;
    }

    return (filter.gameMode == null)
        && (filter.hasFog == null)
        && (filter.maxRankScore == null)
        && (filter.maxTurnIndex == null)
        && (filter.minRankScore == null)
        && (filter.minTurnIndex == null)
        && (filter.normalMapId == null)
        && (!filter.includeMirrorGame)
        && (!filter.showDeprecatedCo);
}
