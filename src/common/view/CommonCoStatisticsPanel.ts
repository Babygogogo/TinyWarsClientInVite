import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { CoStatisticsFilter } from "../../auxiliaryTypes/CoStatisticsFilter.ts";
import { getCoStatistics } from "../model/CommonModel.ts";
import { DisplayCategoryArray, ForceArray } from "../../cos/Constants.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import { getGameConfig } from "../../gameConfig/GcModel.ts";
import { getEnum } from "../../gameModes/Utils.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getCoHeadBackgroundByCoId, getCoHead } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { format } from "../../helpers/Text.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { GameData } from "../../proto/schema/CommonProto/NetMessage/MsgCommonGetCoStatistics/GameData.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";
import { checkIsMrw, checkHasFog } from "../../warTypes/Utils.ts";

interface CoData {
    rankedBan           : number;
    rankedWin           : number;
    rankedLose          : number;
    rankedDraw          : number;
    allWin              : number;
    allLose             : number;
    allDraw             : number;
}

let _previousFilter     : Undefinable<CoStatisticsFilter>;

export interface OpenData {
    filter              : Undefinable<CoStatisticsFilter>;
    usePreviousFilter   : boolean;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;

    private readonly _layoutTitle!          : IUiLayout;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _labelReplaysCount!    : IUiLabel;

    private readonly _btnSearch!            : IUiButton;
    private readonly _btnHelp!              : IUiButton;
    private readonly _btnClose!             : IUiButton;

    private readonly _listCo!               : IUiScrollList<DataForCoRenderer>;

    private _coStatisticsFilter?            : Undefinable<CoStatisticsFilter>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnSearch,              callback: this._onTouchedBtnSearch },
            { ui: this._btnHelp,                callback: this._onTouchedBtnHelp },
            { ui: this._btnClose,               callback: this.closePanel },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listCo.setItemRendererClass(CoRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listCo.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnSearch(): void {
        openPanel(getDict().CommonCoStatisticsFilterPanel, {
            filter              : this._coStatisticsFilter,
            callbackOnConfirm   : filter => {
                this.setOpenData({
                    filter              : filter,
                    usePreviousFilter   : false,
                });
                this._doApplyOpenData();
            },
        });
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0903),
        });
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.usePreviousFilter) {
            this._coStatisticsFilter = _previousFilter;
        } else {
            this._coStatisticsFilter = openData.filter;
        }
        _previousFilter = this._coStatisticsFilter;

        await Promise.all([
            this._updateComponentsForLanguage(),
            this._initListCo(),
        ]);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _updateComponentsForLanguage(): Promise<void> {
        this._labelTitle.setText(getText(TextType.B1076));

        const gameDataArray     = (await getCoStatistics())?.getGameDataArray();
        let rankedReplaysCount  = 0;
        let allReplaysCount     = 0;
        for (const gameData of gameDataArray ?? []) {
            if (!checkIsMeetFilter(gameData, this._coStatisticsFilter)) {
                continue;
            }

            if (checkIsMrw(gameData.getWarType() ?? 0)) {
                ++rankedReplaysCount;
            }
            ++allReplaysCount;
        }
        this._labelReplaysCount.setText(`(${getText(TextType.B0610)}: ${rankedReplaysCount}, ${getText(TextType.B0877)}: ${allReplaysCount})`);
        this._layoutTitle.arrangeItems();
    }

    private async _initListCo(): Promise<void> {
        const dataArray = await this._createDataArrayForListCo();
        const listCo    = this._listCo;
        if (dataArray.length) {
            await listCo.bindData(dataArray);
        } else {
            await listCo.removeAllItems();
        }
    }

    private async _createDataArrayForListCo(): Promise<DataForCoRenderer[]> {
        const coStatistics = await getCoStatistics();
        if (coStatistics == null) {
            return [];
        }

        const gameDataArray = coStatistics.getGameDataArray();
        if (!gameDataArray?.length) {
            return [];
        }

        const configVersion = coStatistics.getConfigVersion();
        const gameConfig    = configVersion == null ? null : await getGameConfig(configVersion);
        if (gameConfig == null) {
            return [];
        }

        const coDataDict            = new Map<number, CoData>();
        const banDict               = new Map<number, number>();  // coId, count
        const coStatisticsFilter    = this._coStatisticsFilter;
        let rankedReplaysCount      = 0;
        let allReplaysCount         = 0;
        for (const gameData of gameDataArray) {
            if (!checkIsMeetFilter(gameData, coStatisticsFilter)) {
                continue;
            }

            const pickedCoIdArray = gameData.getPickedCoIdArray();
            if (pickedCoIdArray?.length !== 2) {
                continue;
            }

            const warType   = gameData.getWarType() ?? 0;
            const isRanked  = (warType === WarTypeId.MrwFog) || (warType === WarTypeId.MrwStd);
            if (isRanked) {
                ++rankedReplaysCount;

                for (const coId of gameData.getBannedCoIdArray()) {
                    banDict.set(coId, (banDict.get(coId) ?? 0) + 1);
                }
            }
            ++allReplaysCount;

            const winnerPlayerIndex = gameData.getWinnerPlayerIndex() ?? 0;
            for (let i = 0; i < pickedCoIdArray.length; ++i) {
                const coId = pickedCoIdArray[i];
                if (!coDataDict.has(coId)) {
                    coDataDict.set(coId, {
                        rankedBan       : 0,
                        rankedWin       : 0,
                        rankedDraw      : 0,
                        rankedLose      : 0,
                        allWin          : 0,
                        allLose         : 0,
                        allDraw         : 0,
                    });
                }

                const coData = getExisted(coDataDict.get(coId));
                if (winnerPlayerIndex === 0) {
                    ++coData.allDraw;
                    if (isRanked) {
                        ++coData.rankedDraw;
                    }
                } else if (winnerPlayerIndex === i + 1) {
                    ++coData.allWin;
                    if (isRanked) {
                        ++coData.rankedWin;
                    }
                } else {
                    ++coData.allLose;
                    if (isRanked) {
                        ++coData.rankedLose;
                    }
                }
            }
        }
        for (const [coId, coData] of coDataDict) {
            const banCount = banDict.get(coId);
            if (banCount != null) {
                coData.rankedBan = banCount;
            }
        }

        const showDeprecatedCo      = coStatisticsFilter?.showDeprecatedCo;
        const availableCoIdArray    = [...coDataDict.keys()].sort((v1, v2) => (gameConfig.getCoBasicCfg(v1)?.getName() ?? ``).localeCompare(gameConfig.getCoBasicCfg(v2)?.getName() ?? ``));
        const dataArray             : DataForCoRenderer[] = [];
        for (const displayCategory of DisplayCategoryArray) {
            const coIdArray1 = availableCoIdArray.filter(v => gameConfig.getCoBasicCfg(v)?.getDisplayCategoryId() === displayCategory);
            if (coIdArray1.length <= 0) {
                continue;
            }

            for (const force of ForceArray) {
                const coIdArray2 = coIdArray1.filter(v => gameConfig.getCoBasicCfg(v)?.getForce() === force);
                if (coIdArray2.length <= 0) {
                    continue;
                }

                for (const coId of coIdArray2) {
                    if ((!showDeprecatedCo) && (!gameConfig.getCoBasicCfg(coId)?.getIsEnabledForMrwAndAtw())) {
                        continue;
                    }

                    const coData = coDataDict.get(coId);
                    dataArray.push({
                        gameConfig          : gameConfig,
                        coId                : coId,
                        allReplaysCount     : allReplaysCount,
                        rankedReplaysCount  : rankedReplaysCount,
                        rankedBanCount      : coData?.rankedBan ?? 0,
                        rankedWin           : coData?.rankedWin ?? 0,
                        rankedLose          : coData?.rankedLose ?? 0,
                        rankedDraw          : coData?.rankedDraw ?? 0,
                        allWin              : coData?.allWin ?? 0,
                        allLose             : coData?.allLose ?? 0,
                        allDraw             : coData?.allDraw ?? 0,
                    });
                }
            }
        }

        return dataArray;
    }
}

interface DataForCoRenderer extends UiListItemData {
    gameConfig          : GcData;
    coId                : number;
    allReplaysCount     : number;
    rankedReplaysCount  : number;
    rankedBanCount      : number;
    rankedWin           : number;
    rankedLose          : number;
    rankedDraw          : number;
    allWin              : number;
    allLose             : number;
    allDraw             : number;
}
class CoRenderer
    extends     UiListItemRenderer<DataForCoRenderer>
    implements  IUiListItemRenderer<DataForCoRenderer>
{
    private readonly _imgCoForce!       : IUiImage;
    private readonly _imgCoHead!        : IUiImage;
    private readonly _labelCoId!        : IUiLabel;
    private readonly _labelName!        : IUiLabel;

    private readonly _labelCountTitle!  : IUiLabel;

    private readonly _labelRankedTitle! : IUiLabel;
    private readonly _labelRankedCount! : IUiLabel;
    private readonly _labelRankedPct!   : IUiLabel;

    private readonly _labelAllTitle!    : IUiLabel;
    private readonly _labelAllCount!    : IUiLabel;
    private readonly _labelAllPct!      : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._applySettingsForWholeTouch();

        this._updateView();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().CommonCoInfoPanel, {
            coId        : openData.coId,
            gameConfig  : openData.gameConfig,
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const coId      = openData.coId;
        const gcData    = openData.gameConfig;
        this._labelCoId.setText(`#${coId}`);
        this._labelName.setText(gcData.getCoBasicCfg(coId)?.getName() ?? UndefinedError);
        this._imgCoForce.loadSource(getCoHeadBackgroundByCoId(gcData, coId) ?? ``);
        this._imgCoHead.loadSource(getCoHead(gcData, coId) ?? ``);

        updateLabelStatistics(
            this._labelRankedCount,
            this._labelRankedPct,
            openData.rankedReplaysCount,
            openData.rankedBanCount,
            openData.rankedWin,
            openData.rankedLose,
            openData.rankedDraw
        );
        updateLabelStatistics(
            this._labelAllCount,
            this._labelAllPct,
            openData.allReplaysCount,
            null,
            openData.allWin,
            openData.allLose,
            openData.allDraw
        );
    }

    private _updateComponentsForLanguage(): void {
        this._labelCountTitle.setText(`${getText(TextType.B1074)}\n${getText(TextType.B0606)}\n${getText(TextType.B0550)}\n${getText(TextType.B0551)}\n${getText(TextType.B0552)}`);
        this._labelRankedTitle.setText(getText(TextType.B1075));
        this._labelAllTitle.setText(getText(TextType.B0120));
    }
}

function updateLabelStatistics(
    labelCount      : IUiLabel,
    labelPct        : IUiLabel,
    replaysCount    : number,
    banCount        : number | null,
    win             : number,
    lose            : number,
    draw            : number
): void {
    const gamesCount = win + lose + draw;
    labelCount.setText(`${gamesCount}\n${banCount ?? `--`}\n${win}\n${lose}\n${draw}`);

    const pickPct   = replaysCount == 0 ? `--` : format(`%.2f%%`, gamesCount * 100 / replaysCount);
    const banPct    = (replaysCount == 0) || (banCount == null) ? `--` : format(`%.2f%%`, banCount * 100 / replaysCount);
    const winPct    = gamesCount == 0 ? `--` : format(`%.2f%%`, win * 100 / gamesCount);
    const losePct   = gamesCount == 0 ? `--` : format(`%.2f%%`, lose * 100 / gamesCount);
    const drawPct   = gamesCount == 0 ? `--` : format(`%.2f%%`, draw * 100 / gamesCount);
    labelPct.setText(`${pickPct}\n${banPct}\n${winPct}\n${losePct}\n${drawPct}`);
}

function checkIsMeetFilter(gameData: GameData, filter: Undefinable<CoStatisticsFilter>): boolean {
    {
        const normalMapId = filter?.normalMapId;
        if ((normalMapId != null) && ((gameData.getNormalMapId() !== normalMapId))) {
            return false;
        }
    }
    {
        if (!filter?.includeMirrorGame) {
            const coIdArray = gameData.getPickedCoIdArray();
            if ((coIdArray?.length !== 2) || (coIdArray[0] === coIdArray[1])) {
                return false;
            }
        }
    }

    const warType = gameData.getWarType() ?? 0;
    {
        const gameMode = filter?.gameMode;
        if ((gameMode != null) && (getEnum(warType) !== gameMode)) {
            return false;
        }
    }
    {
        const hasFog = filter?.hasFog;
        if ((hasFog != null) && (checkHasFog(warType) !== hasFog)) {
            return false;
        }
    }

    const turnIndex = gameData.getTurnIndex() ?? 0;
    {
        const maxTurnIndex = filter?.maxTurnIndex;
        if ((maxTurnIndex != null) && (turnIndex > maxTurnIndex)) {
            return false;
        }
    }
    {
        const minTurnIndex = filter?.minTurnIndex;
        if ((minTurnIndex != null) && (turnIndex < minTurnIndex)) {
            return false;
        }
    }

    const rankScoreArray = gameData.getRankScoreArray();
    {
        const maxRankScore = filter?.maxRankScore;
        if (maxRankScore != null) {
            if ((!rankScoreArray?.length) || (rankScoreArray.some(v => (v < 0) || (v > maxRankScore)))) {
                return false;
            }
        }
    }
    {
        const minRankScore = filter?.minRankScore;
        if (minRankScore != null) {
            if ((!rankScoreArray?.length) || (rankScoreArray.some(v => (v < 0) || (v < minRankScore)))) {
                return false;
            }
        }
    }

    return true;
}
