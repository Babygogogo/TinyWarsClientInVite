import { show } from "../../FloatText.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getLanguageText, getWarTypeName } from "../../lang/Utils.ts";
import { getRawData, getMapNameInCurrentLanguage, getBriefData } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

const WarTypeFullArray = [
    WarTypeId.MrwStd,
    WarTypeId.MrwFog,
    WarTypeId.MmwStd,
    WarTypeId.MmwFog,
    WarTypeId.AtwStd,
    WarTypeId.AtwFog,
    WarTypeId.McwStd,
    WarTypeId.McwFog,
    WarTypeId.CcwStd,
    WarTypeId.CcwFog,
    WarTypeId.ScwStd,
    WarTypeId.ScwFog,
    WarTypeId.SrwStd,
    WarTypeId.SrwFog,
    // WarType.CampStd,
    // WarType.CampFog,
];

export interface OpenData {
    normalMapId   : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnRule!              : IUiButton;
    private readonly _labelRule!            : IUiLabel;
    private readonly _btnWarType!           : IUiButton;
    private readonly _labelWarType!         : IUiLabel;
    private readonly _labelTurnIndexTitle!  : IUiLabel;
    private readonly _labelStatisticsTitle! : IUiLabel;
    private readonly _listStatistics!       : IUiScrollList<DataForStatistics>;
    private readonly _labelNoData!          : IUiLabel;

    private _templateWarRuleId  = 0;
    private _warType            = WarTypeId.MrwStd;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },
            { ui: this._btnRule,                    callback: this._onTouchedBtnRule },
            { ui: this._btnWarType,                 callback: this._onTouchedBtnWarType },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listStatistics.setItemRendererClass(StatisticsRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        this._templateWarRuleId = (await getNextRuleId(normalMapId, -1)) ?? getExisted(getExisted((await getRawData(normalMapId))?.getTemplateWarRuleArray())[0].getRuleId());
        this._warType           = (await getNextWarType(WarTypeId.Undefined, normalMapId, this._templateWarRuleId)) ?? WarTypeId.MrwStd;
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listStatistics.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private async _onTouchedBtnRule(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const nextRuleId = await getNextRuleId(normalMapId, this._templateWarRuleId);
        if (nextRuleId == null) {
            show(getText(TextType.A0302));
            return;
        }

        const nextWarType = await getNextWarType(WarTypeId.Undefined, normalMapId, nextRuleId);
        if (nextWarType == null) {
            show(getText(TextType.A0302));
            return;
        }

        this._templateWarRuleId    = nextRuleId;
        this._warType   = nextWarType;
        this._updateView();
    }

    private async _onTouchedBtnWarType(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const nextWarType = await getNextWarType(this._warType, normalMapId, this._templateWarRuleId);
        if (nextWarType == null) {
            show(getText(TextType.A0302));
            return;
        }

        this._warType = nextWarType;
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateComponentsForListStatistics();
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelTitle();
        this._updateLabelRule();
        this._updateLabelWarType();

        this._btnRule.setText(getText(TextType.B0318));
        this._btnWarType.setText(getText(TextType.B0599));
        this._labelTurnIndexTitle.setText(`${getText(TextType.Turns)}(${getText(TextType.B0877)})`);
        this._labelStatisticsTitle.setText(`${getText(TextType.B0876)} (${getText(TextType.B0550)} / ${getText(TextType.B0551)} / ${getText(TextType.B0552)})`);
        this._labelNoData.setText(getText(TextType.B0278));
    }

    private async _updateLabelTitle(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapName = await getMapNameInCurrentLanguage(normalMapId);
        this._labelTitle.setText(`${getText(TextType.B0876)} #${normalMapId} ${mapName}`);
    }

    private async _updateLabelRule(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const templateWarRuleId = this._templateWarRuleId;
        const templateWarRule   = (await getRawData(normalMapId))?.getTemplateWarRuleArray()?.find(v => v.getRuleId() === templateWarRuleId);
        const ruleName          = templateWarRule ? getLanguageText({ textArray: templateWarRule.getRuleNameArray() }) ?? UndefinedError : UndefinedError;
        this._labelRule.setText(`#${templateWarRuleId} ${ruleName}`);
    }

    private _updateLabelWarType(): void {
        this._labelWarType.setText(getWarTypeName(this._warType) ?? UndefinedError);
    }

    private async _updateComponentsForListStatistics(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const statisticsForRuleArray    = (await getBriefData(normalMapId))?.getNormalMapExtraData()?.getMapWarStatistics()?.getStatisticsForRuleArray();
        const statisticsForTurnArray    = statisticsForRuleArray?.find(v => ((v.getRuleId() ?? 0) === this._templateWarRuleId) && ((v.getWarType() ?? 0) === this._warType))?.getStatisticsForTurnArray();
        const labelNoData               = this._labelNoData;
        const listStatistics            = this._listStatistics;
        if (!statisticsForTurnArray?.length) {
            labelNoData.setIsVisible(true);
            await listStatistics.removeAllItems();
            return;
        }

        const dataArray             : DataForStatistics[] = [];
        const fullStatisticsArray   : number[] = [];
        let totalGames              = 0;
        for (const info of statisticsForTurnArray) {
            const turnGames         = getExisted(info.getTotalGames());
            const statisticsArray   = getExisted(info.getGameResultArray());
            dataArray.push({
                index           : 0,
                isLast          : false,
                turnIndex       : getExisted(info.getTurnIndex()),
                totalGames      : 0,
                turnGames,
                statisticsArray,
            });

            totalGames += turnGames;
            for (let i = 0; i < statisticsArray.length; ++i) {
                fullStatisticsArray[i] = (fullStatisticsArray[i] ?? 0) + statisticsArray[i];
            }
        }
        dataArray.sort((v1, v2) => getExisted(v1.turnIndex) - getExisted(v2.turnIndex));

        let index = 0;
        for (const data of dataArray) {
            data.totalGames = totalGames;
            data.index      = index++;
        }
        dataArray.push({
            index           : index++,
            isLast          : true,
            turnIndex       : null,
            totalGames,
            turnGames       : totalGames,
            statisticsArray : fullStatisticsArray,
        });

        labelNoData.setIsVisible(false);
        await listStatistics.bindData(dataArray, true);
    }
}

interface DataForStatistics extends UiListItemData {
    index           : number;
    isLast          : boolean;
    turnIndex       : number | null;
    totalGames      : number;
    turnGames       : number;
    statisticsArray : number[];
}
class StatisticsRenderer extends UiListItemRenderer<DataForStatistics> {
    private readonly _imgBg!            : IUiImage;
    private readonly _labelTurnIndex!   : IUiLabel;
    private readonly _imgBottomLine!    : IUiImage;
    private readonly _groupPlayers!     : IUiLayout;

    private readonly _groupP1!          : IUiContainer;
    private readonly _labelWin1!        : IUiLabel;
    private readonly _labelLose1!       : IUiLabel;
    private readonly _labelDraw1!       : IUiLabel;

    private readonly _groupP2!          : IUiContainer;
    private readonly _labelWin2!        : IUiLabel;
    private readonly _labelLose2!       : IUiLabel;
    private readonly _labelDraw2!       : IUiLabel;

    private readonly _groupP3!          : IUiContainer;
    private readonly _labelWin3!        : IUiLabel;
    private readonly _labelLose3!       : IUiLabel;
    private readonly _labelDraw3!       : IUiLabel;

    private readonly _groupP4!          : IUiContainer;
    private readonly _labelWin4!        : IUiLabel;
    private readonly _labelLose4!       : IUiLabel;
    private readonly _labelDraw4!       : IUiLabel;

    private readonly _groupP5!          : IUiContainer;
    private readonly _labelWin5!        : IUiLabel;
    private readonly _labelLose5!       : IUiLabel;
    private readonly _labelDraw5!       : IUiLabel;

    private readonly _groupP6!          : IUiContainer;
    private readonly _labelWin6!        : IUiLabel;
    private readonly _labelLose6!       : IUiLabel;
    private readonly _labelDraw6!       : IUiLabel;

    private readonly _groupP7!          : IUiContainer;
    private readonly _labelWin7!        : IUiLabel;
    private readonly _labelLose7!       : IUiLabel;
    private readonly _labelDraw7!       : IUiLabel;

    private readonly _groupP8!          : IUiContainer;
    private readonly _labelWin8!        : IUiLabel;
    private readonly _labelLose8!       : IUiLabel;
    private readonly _labelDraw8!       : IUiLabel;

    private readonly _groupsForPlayers  : IUiContainer[] = [];
    private readonly _labelsForStatics  : IUiLabel[][] = [];

    public updateOnLoadedSkin(): void {
        this._groupsForPlayers.push(this._groupP1, this._groupP2, this._groupP3, this._groupP4, this._groupP5, this._groupP6, this._groupP7, this._groupP8);
        this._labelsForStatics.push(
            [ this._labelWin1,  this._labelLose1,   this._labelDraw1, ],
            [ this._labelWin2,  this._labelLose2,   this._labelDraw2, ],
            [ this._labelWin3,  this._labelLose3,   this._labelDraw3, ],
            [ this._labelWin4,  this._labelLose4,   this._labelDraw4, ],
            [ this._labelWin5,  this._labelLose5,   this._labelDraw5, ],
            [ this._labelWin6,  this._labelLose6,   this._labelDraw6, ],
            [ this._labelWin7,  this._labelLose7,   this._labelDraw7, ],
            [ this._labelWin8,  this._labelLose8,   this._labelDraw8, ],
        );
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const turnGames     = openData.turnGames;
        const totalGames    = openData.totalGames;
        const turnIndex     = openData.turnIndex;
        this._imgBg.setIsVisible(openData.index % 2 == 1);
        this._imgBottomLine.setIsVisible(false);
        this._labelTurnIndex.setText(`${turnIndex ?? `--`}(${turnGames}, ${Math.round(turnGames * 100 / totalGames)}%)`);

        const statisticsArray = openData.statisticsArray;
        for (let playerIndex = PlayerIndex.First; playerIndex <= PlayerIndex.Max; ++playerIndex) {
            const index         = playerIndex - 1;
            const group         = this._groupsForPlayers[index];
            const labels        = this._labelsForStatics[index];
            const wins          = statisticsArray[index * 2];
            const groupPlayers  = this._groupPlayers;
            if (wins == null) {
                if (group.getParent() as unknown === groupPlayers) {
                    groupPlayers.removeItem(group, true);
                }
            } else {
                this._groupPlayers.addItem(group, true);

                const loses = statisticsArray[index * 2 + 1];
                const draws = turnGames - wins - loses;
                labels[0].setText(`${wins}(${Math.round(wins * 100 / turnGames)}%)`);
                labels[1].setText(`${loses}(${Math.round(loses * 100 / turnGames)}%)`);
                labels[2].setText(`${draws}(${Math.round(draws * 100 / turnGames)}%)`);
            }
        }
    }
}

async function getNextRuleId(normalMapId: number, ruleId: number): Promise<number | null> {
    for (const newRuleId of await getRuleIdArray(normalMapId, ruleId)) {
        if ((await getNextWarType(WarTypeId.Undefined, normalMapId, newRuleId)) != null) {
            return newRuleId;
        }
    }

    return null;
}

async function getRuleIdArray(normalMapId: number, ruleId: number): Promise<number[]> {
    const ruleIdFullArray   = (await getRawData(normalMapId))?.getTemplateWarRuleArray()?.map(v => getExisted(v.getRuleId())).sort((v1, v2) => v1 - v2) ?? [];
    const ruleIdArray       : number[] = [];
    const index             = ruleIdFullArray.indexOf(ruleId);
    for (let i = index + 1; i < ruleIdFullArray.length; ++i) {
        ruleIdArray.push(ruleIdFullArray[i]);
    }
    for (let i = 0; i < index; ++i) {
        ruleIdArray.push(ruleIdFullArray[i]);
    }
    return ruleIdArray;
}

async function getNextWarType(warType: WarTypeId, normalMapId: number, ruleId: number): Promise<WarTypeId | null> {
    const statisticsForRuleArray = (await getBriefData(normalMapId))?.getNormalMapExtraData()?.getMapWarStatistics()?.getStatisticsForRuleArray();
    for (const newWarType of getWarTypeArray(warType)) {
        if (statisticsForRuleArray?.find(v => ((v.getRuleId() ?? 0) === ruleId) && ((v.getWarType() ?? 0) === newWarType))?.getStatisticsForTurnArray()?.length) {
            return newWarType;
        }
    }

    return null;
}

function getWarTypeArray(warType: WarTypeId): WarTypeId[] {
    const warTypeArray  : WarTypeId[] = [];
    const index         = WarTypeFullArray.indexOf(warType);
    for (let i = index + 1; i < WarTypeFullArray.length; ++i) {
        warTypeArray.push(WarTypeFullArray[i]);
    }
    for (let i = 0; i < index; ++i) {
        warTypeArray.push(WarTypeFullArray[i]);
    }
    return warTypeArray;
}
