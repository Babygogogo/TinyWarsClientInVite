import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CoStatisticsFilter } from "../../auxiliaryTypes/CoStatisticsFilter.ts";
import { getCoStatistics } from "../model/CommonModel.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getGameModeName,
    getGameModeHelpText,
    getTextForYesOrNo,
} from "../../lang/Utils.ts";
import { getMapNameInCurrentLanguage } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { TurnIndex } from "../../turns/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";

export type OpenData = {
    filter              : Undefinable<CoStatisticsFilter>;
    callbackOnConfirm   : (mapFilter: Undefinable<CoStatisticsFilter>) => void;
};
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnHelp!                      : IUiButton;
    private readonly _btnClose!                     : IUiButton;

    private readonly _btnReset!                     : IUiButton;
    private readonly _btnSearch!                    : IUiButton;

    private readonly _labelNormalMapIdTitle!        : IUiLabel;
    private readonly _labelNormalMapId!             : IUiLabel;
    private readonly _btnModifyNormalMapId!         : IUiButton;
    private readonly _btnDeleteNormalMapId!         : IUiButton;

    private readonly _labelGameModeTitle!           : IUiLabel;
    private readonly _labelGameMode!                : IUiLabel;
    private readonly _btnModifyGameMode!            : IUiButton;
    private readonly _btnDeleteGameMode!            : IUiButton;

    private readonly _labelMinTurnIndexTitle!       : IUiLabel;
    private readonly _labelMinTurnIndex!            : IUiLabel;
    private readonly _btnModifyMinTurnIndex!        : IUiButton;
    private readonly _btnDeleteMinTurnIndex!        : IUiButton;

    private readonly _labelMaxTurnIndexTitle!       : IUiLabel;
    private readonly _labelMaxTurnIndex!            : IUiLabel;
    private readonly _btnModifyMaxTurnIndex!        : IUiButton;
    private readonly _btnDeleteMaxTurnIndex!        : IUiButton;

    private readonly _labelMinRankScoreTitle!       : IUiLabel;
    private readonly _labelMinRankScore!            : IUiLabel;
    private readonly _btnModifyMinRankScore!        : IUiButton;
    private readonly _btnDeleteMinRankScore!        : IUiButton;

    private readonly _labelMaxRankScoreTitle!       : IUiLabel;
    private readonly _labelMaxRankScore!            : IUiLabel;
    private readonly _btnModifyMaxRankScore!        : IUiButton;
    private readonly _btnDeleteMaxRankScore!        : IUiButton;

    private readonly _labelHasFogTitle!             : IUiLabel;
    private readonly _labelHasFog!                  : IUiLabel;
    private readonly _btnModifyHasFog!              : IUiButton;
    private readonly _btnDeleteHasFog!              : IUiButton;

    private readonly _labelIncludeMirrorGameTitle!  : IUiLabel;
    private readonly _labelIncludeMirrorGame!       : IUiLabel;
    private readonly _btnModifyIncludeMirrorGame!   : IUiButton;

    private readonly _labelShowDeprecatedCoTitle!   : IUiLabel;
    private readonly _labelShowDeprecatedCo!        : IUiLabel;
    private readonly _btnModifyShowDeprecatedCo!    : IUiButton;

    private _filter                                 = new CoStatisticsFilter();

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
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._filter = this.getOpenData()?.filter?.clone() ?? new CoStatisticsFilter();
        this._updateComponentsForLanguage();
        this._resetComponentsForFilter();
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0312),
        });
    }

    private _onTouchedBtnReset(): void {
        this._filter = new CoStatisticsFilter();
        this._resetComponentsForFilter();
    }

    private _onTouchedBtnSearch(): void {
        const filter = this._filter;
        this.getOpenData()?.callbackOnConfirm(checkIsEmptyCoStatisticsFilter(filter) ? undefined : filter);
        this.closePanel();
    }

    private async _onTouchedBtnModifyNormalMapId(): Promise<void> {
        const normalMapIdSet = new Set<number>();
        for (const gameData of (await getCoStatistics())?.getGameDataArray() ?? []) {
            const normalMapId = gameData.getNormalMapId() ?? 0;
            if (normalMapId >= 0) {
                normalMapIdSet.add(normalMapId);
            }
        }

        openPanel(getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : [...normalMapIdSet],
            getTitleText                : () => getText(TextType.B0227),
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
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            availableNumberArray    : [
                ModeId.Versus,
                ModeId.Free,
                ModeId.UnrankedMatch,
                ModeId.RankedMatch,
                ModeId.AutoTourney,
            ],
            currentNumber           : filter.gameMode,
            keepOrder               : true,
            getTitleText            : () => getText(TextType.B0153),
            getNumberMainText       : mode => getGameModeName(mode) ?? UndefinedError,
            getNumberHelpText       : mode => getGameModeHelpText(mode) ?? UndefinedError,
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
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B0611),
            minValue        : 6,
            maxValue        : filter.maxTurnIndex ?? TurnIndex.MaxLimit,
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
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B0621),
            minValue        : filter.minTurnIndex ?? 6,
            maxValue        : TurnIndex.MaxLimit,
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
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B0687),
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
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B0863),
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
        this._labelTitle.setLangText(TextType.B0132);
        this._labelNormalMapIdTitle.setLangText(TextType.B0225);
        this._labelGameModeTitle.setLangText(TextType.B0153);
        this._labelMinTurnIndexTitle.setLangText(TextType.B0611);
        this._labelMaxTurnIndexTitle.setLangText(TextType.B0621);
        this._labelMinRankScoreTitle.setLangText(TextType.B0687);
        this._labelMaxRankScoreTitle.setLangText(TextType.B0863);
        this._labelHasFogTitle.setLangText(TextType.B0438);
        this._labelIncludeMirrorGameTitle.setLangText(TextType.B0941);
        this._labelShowDeprecatedCoTitle.setLangText(TextType.B0948);

        this._btnReset.setLangText(TextType.B0391);
        this._btnSearch.setLangText(TextType.B0228);
        this._updateLabelMaxRankScore();
    }

    private async _updateLabelNormalMapId(): Promise<void> {
        const normalMapId = this._filter.normalMapId;
        this._labelNormalMapId.setText(normalMapId == null
            ? ``
            : (await getMapNameInCurrentLanguage(normalMapId) ?? UndefinedError)
        );
    }
    private _updateLabelGameMode(): void {
        const gameMode = this._filter.gameMode;
        this._labelGameMode.setText(gameMode == null ? `` : (getGameModeName(gameMode) ?? UndefinedError));
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
        this._labelHasFog.setText(hasFog == null ? `` : getTextForYesOrNo(hasFog));
    }
    private _updateLabelIncludeMirrorGame(): void {
        this._labelIncludeMirrorGame.setLangText(this._filter.includeMirrorGame ? TextType.Yes : TextType.No);
    }
    private _updateLabelShowDeprecatedCo(): void {
        this._labelShowDeprecatedCo.setLangText(this._filter.showDeprecatedCo ? TextType.Yes : TextType.No);
    }
}

function checkIsEmptyCoStatisticsFilter(filter: Undefinable<CoStatisticsFilter>): boolean {
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
