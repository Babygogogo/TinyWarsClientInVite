import {
    NormalMap_Model_NormalMapModel,
    Helpers_Misc,
    Lang_Utils,
    Players_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    WarTypes_Constants,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

const WarTypeFullArray = [
    WarTypes_Constants.WarTypeId.MrwStd,
    WarTypes_Constants.WarTypeId.MrwFog,
    WarTypes_Constants.WarTypeId.MmwStd,
    WarTypes_Constants.WarTypeId.MmwFog,
    WarTypes_Constants.WarTypeId.AtwStd,
    WarTypes_Constants.WarTypeId.AtwFog,
    WarTypes_Constants.WarTypeId.McwStd,
    WarTypes_Constants.WarTypeId.McwFog,
    WarTypes_Constants.WarTypeId.CcwStd,
    WarTypes_Constants.WarTypeId.CcwFog,
    WarTypes_Constants.WarTypeId.ScwStd,
    WarTypes_Constants.WarTypeId.ScwFog,
    WarTypes_Constants.WarTypeId.SrwStd,
    WarTypes_Constants.WarTypeId.SrwFog,
    // WarType.CampStd,
    // WarType.CampFog,
];

export interface OpenData {
    normalMapId   : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRule!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelRule!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnWarType!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelWarType!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTurnIndexTitle!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelStatisticsTitle! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listStatistics!       : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForStatistics>;
    private readonly _labelNoData!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private _templateWarRuleId  = 0;
    private _warType            = WarTypes_Constants.WarTypeId.MrwStd;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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

        this._templateWarRuleId = (await getNextRuleId(normalMapId, -1)) ?? Helpers_Misc.getExisted((await NormalMap_Model_NormalMapModel.getRawData(normalMapId))?.getTemplateWarRuleArray())[0].getRuleId();
        this._warType           = (await getNextWarType(WarTypes_Constants.WarTypeId.Undefined, normalMapId, this._templateWarRuleId)) ?? WarTypes_Constants.WarTypeId.MrwStd;
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
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0302));
            return;
        }

        const nextWarType = await getNextWarType(WarTypes_Constants.WarTypeId.Undefined, normalMapId, nextRuleId);
        if (nextWarType == null) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0302));
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
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0302));
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

        this._btnRule.setLangText(Lang_Constants.TextType.B0318);
        this._btnWarType.setLangText(Lang_Constants.TextType.B0599);
        this._labelTurnIndexTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.Turns)}(${Lang_Utils.getText(Lang_Constants.TextType.B0877)})`);
        this._labelStatisticsTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0876)} (${Lang_Utils.getText(Lang_Constants.TextType.B0550)} / ${Lang_Utils.getText(Lang_Constants.TextType.B0551)} / ${Lang_Utils.getText(Lang_Constants.TextType.B0552)})`);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
    }

    private async _updateLabelTitle(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapName = await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId);
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0876)} #${normalMapId} ${mapName}`);
    }

    private async _updateLabelRule(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const templateWarRuleId = this._templateWarRuleId;
        const templateWarRule   = (await NormalMap_Model_NormalMapModel.getRawData(normalMapId))?.getTemplateWarRuleArray()?.find(v => v.getRuleId() === templateWarRuleId);
        const ruleName          = templateWarRule ? Lang_Utils.getLanguageText({ textArray: templateWarRule.getRuleNameArray() }) ?? Lang_Constants.UndefinedError : Lang_Constants.UndefinedError;
        this._labelRule.setText(`#${templateWarRuleId} ${ruleName}`);
    }

    private _updateLabelWarType(): void {
        this._labelWarType.setText(Lang_Utils.getWarTypeName(this._warType) ?? Lang_Constants.UndefinedError);
    }

    private async _updateComponentsForListStatistics(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const statisticsForRuleArray    = (await NormalMap_Model_NormalMapModel.getBriefData(normalMapId))?.getNormalMapExtraData()?.getMapWarStatistics()?.getStatisticsForRuleArray();
        const statisticsForTurnArray    = statisticsForRuleArray?.find(v => ((v.getRuleId()) === this._templateWarRuleId) && ((v.getWarType()) === this._warType))?.getStatisticsForTurnArray();
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
            const turnGames         = info.getTotalGames();
            const statisticsArray   = info.getGameResultArray();
            dataArray.push({
                index           : 0,
                isLast          : false,
                turnIndex       : info.getTurnIndex(),
                totalGames      : 0,
                turnGames,
                statisticsArray,
            });

            totalGames += turnGames;
            for (let i = 0; i < statisticsArray.length; ++i) {
                fullStatisticsArray[i] = (fullStatisticsArray[i] ?? 0) + statisticsArray[i];
            }
        }
        dataArray.sort((v1, v2) => Helpers_Misc.getExisted(v1.turnIndex) - Helpers_Misc.getExisted(v2.turnIndex));

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

interface DataForStatistics extends Ui_Types_UiListItemData.UiListItemData {
    index           : number;
    isLast          : boolean;
    turnIndex       : number | null;
    totalGames      : number;
    turnGames       : number;
    statisticsArray : number[];
}
class StatisticsRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForStatistics> {
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTurnIndex!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgBottomLine!    : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _groupPlayers!     : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _groupP1!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelWin1!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLose1!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDraw1!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupP2!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelWin2!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLose2!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDraw2!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupP3!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelWin3!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLose3!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDraw3!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupP4!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelWin4!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLose4!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDraw4!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupP5!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelWin5!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLose5!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDraw5!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupP6!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelWin6!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLose6!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDraw6!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupP7!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelWin7!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLose7!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDraw7!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupP8!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelWin8!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLose8!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDraw8!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupsForPlayers  : Ui_Interfaces_IUiContainer.IUiContainer[] = [];
    private readonly _labelsForStatics  : Ui_Interfaces_IUiLabel.IUiLabel[][] = [];

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
        for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= Players_Constants.PlayerIndex.Max; ++playerIndex) {
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
        if ((await getNextWarType(WarTypes_Constants.WarTypeId.Undefined, normalMapId, newRuleId)) != null) {
            return newRuleId;
        }
    }

    return null;
}

async function getRuleIdArray(normalMapId: number, ruleId: number): Promise<number[]> {
    const ruleIdFullArray   = (await NormalMap_Model_NormalMapModel.getRawData(normalMapId))?.getTemplateWarRuleArray()?.map(v => v.getRuleId()).sort((v1, v2) => v1 - v2) ?? [];
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

async function getNextWarType(warType: WarTypes_Constants.WarTypeId, normalMapId: number, ruleId: number): Promise<WarTypes_Constants.WarTypeId | null> {
    const statisticsForRuleArray = (await NormalMap_Model_NormalMapModel.getBriefData(normalMapId))?.getNormalMapExtraData()?.getMapWarStatistics()?.getStatisticsForRuleArray();
    for (const newWarType of getWarTypeArray(warType)) {
        if (statisticsForRuleArray?.find(v => ((v.getRuleId()) === ruleId) && ((v.getWarType()) === newWarType))?.getStatisticsForTurnArray()?.length) {
            return newWarType;
        }
    }

    return null;
}

function getWarTypeArray(warType: WarTypes_Constants.WarTypeId): WarTypes_Constants.WarTypeId[] {
    const warTypeArray  : WarTypes_Constants.WarTypeId[] = [];
    const index         = WarTypeFullArray.indexOf(warType);
    for (let i = index + 1; i < WarTypeFullArray.length; ++i) {
        warTypeArray.push(WarTypeFullArray[i]);
    }
    for (let i = 0; i < index; ++i) {
        warTypeArray.push(WarTypeFullArray[i]);
    }
    return warTypeArray;
}
