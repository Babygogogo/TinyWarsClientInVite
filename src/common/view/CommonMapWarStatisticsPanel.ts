import * as FloatText2 from "../../FloatText.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

const WarTypeFullArray = [
    WarTypesConstants.WarTypeId.MrwStd,
    WarTypesConstants.WarTypeId.MrwFog,
    WarTypesConstants.WarTypeId.MmwStd,
    WarTypesConstants.WarTypeId.MmwFog,
    WarTypesConstants.WarTypeId.AtwStd,
    WarTypesConstants.WarTypeId.AtwFog,
    WarTypesConstants.WarTypeId.McwStd,
    WarTypesConstants.WarTypeId.McwFog,
    WarTypesConstants.WarTypeId.CcwStd,
    WarTypesConstants.WarTypeId.CcwFog,
    WarTypesConstants.WarTypeId.ScwStd,
    WarTypesConstants.WarTypeId.ScwFog,
    WarTypesConstants.WarTypeId.SrwStd,
    WarTypesConstants.WarTypeId.SrwFog,
    // WarType.CampStd,
    // WarType.CampFog,
];

export interface OpenData {
    normalMapId   : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnRule!              : UiInterfacesIUiButton.IUiButton;
    private readonly _labelRule!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnWarType!           : UiInterfacesIUiButton.IUiButton;
    private readonly _labelWarType!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTurnIndexTitle!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStatisticsTitle! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listStatistics!       : UiInterfacesIUiScrollList.IUiScrollList<DataForStatistics>;
    private readonly _labelNoData!          : UiInterfacesIUiLabel.IUiLabel;

    private _templateWarRuleId  = 0;
    private _warType            = WarTypesConstants.WarTypeId.MrwStd;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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

        this._templateWarRuleId = (await getNextRuleId(normalMapId, -1)) ?? HelpersMisc.getExisted(HelpersMisc.getExisted((await NormalMapModelNormalMapModel.getRawData(normalMapId))?.getTemplateWarRuleArray())[0].getRuleId());
        this._warType           = (await getNextWarType(WarTypesConstants.WarTypeId.Undefined, normalMapId, this._templateWarRuleId)) ?? WarTypesConstants.WarTypeId.MrwStd;
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
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0302));
            return;
        }

        const nextWarType = await getNextWarType(WarTypesConstants.WarTypeId.Undefined, normalMapId, nextRuleId);
        if (nextWarType == null) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0302));
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
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0302));
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

        this._btnRule.setText(LangUtils.getText(LangConstants.TextType.B0318));
        this._btnWarType.setText(LangUtils.getText(LangConstants.TextType.B0599));
        this._labelTurnIndexTitle.setText(`${LangUtils.getText(LangConstants.TextType.Turns)}(${LangUtils.getText(LangConstants.TextType.B0877)})`);
        this._labelStatisticsTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0876)} (${LangUtils.getText(LangConstants.TextType.B0550)} / ${LangUtils.getText(LangConstants.TextType.B0551)} / ${LangUtils.getText(LangConstants.TextType.B0552)})`);
        this._labelNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
    }

    private async _updateLabelTitle(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapName = await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId);
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0876)} #${normalMapId} ${mapName}`);
    }

    private async _updateLabelRule(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const templateWarRuleId = this._templateWarRuleId;
        const templateWarRule   = (await NormalMapModelNormalMapModel.getRawData(normalMapId))?.getTemplateWarRuleArray()?.find(v => v.getRuleId() === templateWarRuleId);
        const ruleName          = templateWarRule ? LangUtils.getLanguageText({ textArray: templateWarRule.getRuleNameArray() }) ?? LangConstants.UndefinedError : LangConstants.UndefinedError;
        this._labelRule.setText(`#${templateWarRuleId} ${ruleName}`);
    }

    private _updateLabelWarType(): void {
        this._labelWarType.setText(LangUtils.getWarTypeName(this._warType) ?? LangConstants.UndefinedError);
    }

    private async _updateComponentsForListStatistics(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const statisticsForRuleArray    = (await NormalMapModelNormalMapModel.getBriefData(normalMapId))?.getNormalMapExtraData()?.getMapWarStatistics()?.getStatisticsForRuleArray();
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
            const turnGames         = HelpersMisc.getExisted(info.getTotalGames());
            const statisticsArray   = HelpersMisc.getExisted(info.getGameResultArray());
            dataArray.push({
                index           : 0,
                isLast          : false,
                turnIndex       : HelpersMisc.getExisted(info.getTurnIndex()),
                totalGames      : 0,
                turnGames,
                statisticsArray,
            });

            totalGames += turnGames;
            for (let i = 0; i < statisticsArray.length; ++i) {
                fullStatisticsArray[i] = (fullStatisticsArray[i] ?? 0) + statisticsArray[i];
            }
        }
        dataArray.sort((v1, v2) => HelpersMisc.getExisted(v1.turnIndex) - HelpersMisc.getExisted(v2.turnIndex));

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

interface DataForStatistics extends UiTypesUiListItemData.UiListItemData {
    index           : number;
    isLast          : boolean;
    turnIndex       : number | null;
    totalGames      : number;
    turnGames       : number;
    statisticsArray : number[];
}
class StatisticsRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForStatistics> {
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTurnIndex!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgBottomLine!    : UiInterfacesIUiImage.IUiImage;
    private readonly _groupPlayers!     : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupP1!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelWin1!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLose1!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDraw1!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupP2!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelWin2!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLose2!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDraw2!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupP3!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelWin3!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLose3!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDraw3!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupP4!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelWin4!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLose4!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDraw4!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupP5!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelWin5!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLose5!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDraw5!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupP6!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelWin6!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLose6!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDraw6!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupP7!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelWin7!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLose7!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDraw7!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupP8!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelWin8!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLose8!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDraw8!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupsForPlayers  : UiInterfacesIUiContainer.IUiContainer[] = [];
    private readonly _labelsForStatics  : UiInterfacesIUiLabel.IUiLabel[][] = [];

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
        for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex <= PlayersConstants.PlayerIndex.Max; ++playerIndex) {
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
        if ((await getNextWarType(WarTypesConstants.WarTypeId.Undefined, normalMapId, newRuleId)) != null) {
            return newRuleId;
        }
    }

    return null;
}

async function getRuleIdArray(normalMapId: number, ruleId: number): Promise<number[]> {
    const ruleIdFullArray   = (await NormalMapModelNormalMapModel.getRawData(normalMapId))?.getTemplateWarRuleArray()?.map(v => HelpersMisc.getExisted(v.getRuleId())).sort((v1, v2) => v1 - v2) ?? [];
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

async function getNextWarType(warType: WarTypesConstants.WarTypeId, normalMapId: number, ruleId: number): Promise<WarTypesConstants.WarTypeId | null> {
    const statisticsForRuleArray = (await NormalMapModelNormalMapModel.getBriefData(normalMapId))?.getNormalMapExtraData()?.getMapWarStatistics()?.getStatisticsForRuleArray();
    for (const newWarType of getWarTypeArray(warType)) {
        if (statisticsForRuleArray?.find(v => ((v.getRuleId() ?? 0) === ruleId) && ((v.getWarType() ?? 0) === newWarType))?.getStatisticsForTurnArray()?.length) {
            return newWarType;
        }
    }

    return null;
}

function getWarTypeArray(warType: WarTypesConstants.WarTypeId): WarTypesConstants.WarTypeId[] {
    const warTypeArray  : WarTypesConstants.WarTypeId[] = [];
    const index         = WarTypeFullArray.indexOf(warType);
    for (let i = index + 1; i < WarTypeFullArray.length; ++i) {
        warTypeArray.push(WarTypeFullArray[i]);
    }
    for (let i = 0; i < index; ++i) {
        warTypeArray.push(WarTypeFullArray[i]);
    }
    return warTypeArray;
}
