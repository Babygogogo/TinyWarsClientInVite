import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesCoStatisticsFilter from "../../auxiliaryTypes/CoStatisticsFilter.ts";
import * as CommonModelCommonModel from "../model/CommonModel.ts";
import * as GameModesConstants from "../../gameModes/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";

export type OpenData = {
    filter              : AuxiliaryTypesAuxiliaryTypes.Undefinable<AuxiliaryTypesCoStatisticsFilter.CoStatisticsFilter>;
    callbackOnConfirm   : (mapFilter: AuxiliaryTypesAuxiliaryTypes.Undefinable<AuxiliaryTypesCoStatisticsFilter.CoStatisticsFilter>) => void;
};
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;

    private readonly _btnReset!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSearch!                    : UiInterfacesIUiButton.IUiButton;

    private readonly _labelNormalMapIdTitle!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNormalMapId!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyNormalMapId!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteNormalMapId!         : UiInterfacesIUiButton.IUiButton;

    private readonly _labelGameModeTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelGameMode!                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyGameMode!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteGameMode!            : UiInterfacesIUiButton.IUiButton;

    private readonly _labelMinTurnIndexTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMinTurnIndex!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyMinTurnIndex!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteMinTurnIndex!        : UiInterfacesIUiButton.IUiButton;

    private readonly _labelMaxTurnIndexTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMaxTurnIndex!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyMaxTurnIndex!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteMaxTurnIndex!        : UiInterfacesIUiButton.IUiButton;

    private readonly _labelMinRankScoreTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMinRankScore!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyMinRankScore!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteMinRankScore!        : UiInterfacesIUiButton.IUiButton;

    private readonly _labelMaxRankScoreTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMaxRankScore!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyMaxRankScore!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteMaxRankScore!        : UiInterfacesIUiButton.IUiButton;

    private readonly _labelHasFogTitle!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelHasFog!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyHasFog!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteHasFog!              : UiInterfacesIUiButton.IUiButton;

    private readonly _labelIncludeMirrorGameTitle!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelIncludeMirrorGame!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyIncludeMirrorGame!   : UiInterfacesIUiButton.IUiButton;

    private readonly _labelShowDeprecatedCoTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelShowDeprecatedCo!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyShowDeprecatedCo!    : UiInterfacesIUiButton.IUiButton;

    private _filter                                 = new AuxiliaryTypesCoStatisticsFilter.CoStatisticsFilter();

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
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._filter = this.getOpenData()?.filter?.clone() ?? new AuxiliaryTypesCoStatisticsFilter.CoStatisticsFilter();
        this._updateComponentsForLanguage();
        this._resetComponentsForFilter();
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0312),
        });
    }

    private _onTouchedBtnReset(): void {
        this._filter = new AuxiliaryTypesCoStatisticsFilter.CoStatisticsFilter();
        this._resetComponentsForFilter();
    }

    private _onTouchedBtnSearch(): void {
        const filter = this._filter;
        this.getOpenData()?.callbackOnConfirm(checkIsEmptyCoStatisticsFilter(filter) ? undefined : filter);
        this.closePanel();
    }

    private async _onTouchedBtnModifyNormalMapId(): Promise<void> {
        const normalMapIdSet = new Set<number>();
        for (const gameData of (await CommonModelCommonModel.getCoStatistics())?.getGameDataArray() ?? []) {
            const normalMapId = gameData.getNormalMapId() ?? 0;
            if (normalMapId >= 0) {
                normalMapIdSet.add(normalMapId);
            }
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : [...normalMapIdSet],
            getTitleText                : () => LangUtils.getText(LangConstants.TextType.B0227),
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            availableNumberArray    : [
                GameModesConstants.ModeId.Versus,
                GameModesConstants.ModeId.Free,
                GameModesConstants.ModeId.UnrankedMatch,
                GameModesConstants.ModeId.RankedMatch,
                GameModesConstants.ModeId.AutoTourney,
            ],
            currentNumber           : filter.gameMode,
            keepOrder               : true,
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0153),
            getNumberMainText       : mode => LangUtils.getGameModeName(mode) ?? LangConstants.UndefinedError,
            getNumberHelpText       : mode => LangUtils.getGameModeHelpText(mode) ?? LangConstants.UndefinedError,
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0611),
            minValue        : 6,
            maxValue        : filter.maxTurnIndex ?? TurnsConstants.TurnIndex.MaxLimit,
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0621),
            minValue        : filter.minTurnIndex ?? 6,
            maxValue        : TurnsConstants.TurnIndex.MaxLimit,
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0687),
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0863),
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0132));
        this._labelNormalMapIdTitle.setText(LangUtils.getText(LangConstants.TextType.B0225));
        this._labelGameModeTitle.setText(LangUtils.getText(LangConstants.TextType.B0153));
        this._labelMinTurnIndexTitle.setText(LangUtils.getText(LangConstants.TextType.B0611));
        this._labelMaxTurnIndexTitle.setText(LangUtils.getText(LangConstants.TextType.B0621));
        this._labelMinRankScoreTitle.setText(LangUtils.getText(LangConstants.TextType.B0687));
        this._labelMaxRankScoreTitle.setText(LangUtils.getText(LangConstants.TextType.B0863));
        this._labelHasFogTitle.setText(LangUtils.getText(LangConstants.TextType.B0438));
        this._labelIncludeMirrorGameTitle.setText(LangUtils.getText(LangConstants.TextType.B0941));
        this._labelShowDeprecatedCoTitle.setText(LangUtils.getText(LangConstants.TextType.B0948));

        this._btnReset.setText(LangUtils.getText(LangConstants.TextType.B0391));
        this._btnSearch.setText(LangUtils.getText(LangConstants.TextType.B0228));
        this._updateLabelMaxRankScore();
    }

    private async _updateLabelNormalMapId(): Promise<void> {
        const normalMapId = this._filter.normalMapId;
        this._labelNormalMapId.setText(normalMapId == null
            ? ``
            : (await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId) ?? LangConstants.UndefinedError)
        );
    }
    private _updateLabelGameMode(): void {
        const gameMode = this._filter.gameMode;
        this._labelGameMode.setText(gameMode == null ? `` : (LangUtils.getGameModeName(gameMode) ?? LangConstants.UndefinedError));
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
        this._labelHasFog.setText(hasFog == null ? `` : LangUtils.getTextForYesOrNo(hasFog));
    }
    private _updateLabelIncludeMirrorGame(): void {
        this._labelIncludeMirrorGame.setText(LangUtils.getTextForYesOrNo(this._filter.includeMirrorGame));
    }
    private _updateLabelShowDeprecatedCo(): void {
        this._labelShowDeprecatedCo.setText(LangUtils.getTextForYesOrNo(this._filter.showDeprecatedCo));
    }
}

function checkIsEmptyCoStatisticsFilter(filter: AuxiliaryTypesAuxiliaryTypes.Undefinable<AuxiliaryTypesCoStatisticsFilter.CoStatisticsFilter>): boolean {
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
