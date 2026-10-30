import {
    AutoTourneys_Constants,
    WarRules_Utils_Instance,
    AutoTourneys_Mains_Provider,
    NormalMap_Model_NormalMapModel,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GameConfigs_Provider,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    AutoTourneys_Mains_Gateway,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../../internal.ts";
import { SimpleMapInfo } from "../../../proto/schema/CommonProto/NetMessage/MsgAtSetMapPool/SimpleMapInfo.ts";
import type { InstanceWarRule } from "../../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";

export interface OpenData {
    tourneyId   : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConfirm!   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCancel!    : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listMap!      : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMapRenderer>;

    private _dataArrayForListMap    : DataForMapRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgAtSetMapPool,     callback : this._onNotifyMsgAtSetMapPool },
        ]);
        this._setUiListenerArray([
            { ui : this._btnCancel,          callback : this.closePanel },
            { ui : this._btnConfirm,         callback : this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listMap.setItemRendererClass(MapRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._dataArrayForListMap = await this._createDataArrayForListMap();
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listMap.removeAllItems();

        await super._onClosed();
    }

    public async updateOnSetMap(mapIndex: number, normalMapId: number): Promise<void> {
        const mapRawData = await NormalMap_Model_NormalMapModel.getRawData(normalMapId);
        if (mapRawData == null) {
            return;
        }

        const dataArray         = this._dataArrayForListMap;
        const dataIndex         = dataArray.findIndex(v => v.mapIndex === mapIndex);
        const data              = dataArray[dataIndex];
        data.normalMapId        = normalMapId;
        data.instanceWarRule    = WarRules_Utils_Instance.create({
            templateWarRule           : mapRawData.getTemplateWarRuleArray()[0],
            warEventFullData          : mapRawData.getWarEventFullData(),
            allMapSimpleDialogueArray : mapRawData.getMapSimpleDialogueArray(),
            taskObjectiveFullData     : mapRawData.getTaskObjectiveFullData(),
        });
        this._listMap.updateSingleData(dataIndex, data);
    }
    public async updateOnTickRule(mapIndex: number): Promise<void> {
        const dataArray     = this._dataArrayForListMap;
        const dataIndex     = dataArray.findIndex(v => v.mapIndex === mapIndex);
        const data          = dataArray[dataIndex];
        const mapRawData    = await NormalMap_Model_NormalMapModel.getRawData(data.normalMapId);
        if (mapRawData == null) {
            return;
        }

        const templateWarRuleArray  = mapRawData?.getTemplateWarRuleArray();
        const rulesCount            = templateWarRuleArray.length;
        if (rulesCount == 0) {
            return;
        }

        const ruleId            = data.instanceWarRule.getTemplateWarRuleId() ?? 0;
        const templateWarRule   = templateWarRuleArray[(templateWarRuleArray.findIndex(v => (v.getRuleId()) === ruleId) + 1) % rulesCount];
        data.instanceWarRule    = WarRules_Utils_Instance.create({
            templateWarRule           : templateWarRule,
            warEventFullData          : mapRawData.getWarEventFullData(),
            allMapSimpleDialogueArray : mapRawData.getMapSimpleDialogueArray(),
            taskObjectiveFullData     : mapRawData.getTaskObjectiveFullData(),
        });
        this._listMap.updateSingleData(dataIndex, data);
    }
    public updateOnMoveUp(mapIndex: number): void {
        if (mapIndex <= 1) {
            return;
        }

        const dataArray = this._dataArrayForListMap;
        const index2    = dataArray.findIndex(v => v.mapIndex === mapIndex);
        const index1    = index2 - 1;
        const data1     = dataArray[index1];
        const data2     = dataArray[index2];
        [data1.instanceWarRule, data2.instanceWarRule]  = [data2.instanceWarRule, data1.instanceWarRule];
        [data1.normalMapId, data2.normalMapId]                      = [data2.normalMapId, data1.normalMapId];

        const list = this._listMap;
        list.updateSingleData(index1, data1);
        list.updateSingleData(index2, data2);
    }
    public async updateOnAdd(mapIndex: number): Promise<void> {
        const dataArray = this._dataArrayForListMap;
        if (dataArray.length >= AutoTourneys_Constants.Common.MaxMapsCount) {
            return;
        }

        const dataIndex = dataArray.findIndex(v => v.mapIndex === mapIndex);
        const srcData   = dataArray[dataIndex];
        dataArray.splice(
            dataIndex + 1,
            0,
            {
                mapIndex        : 1,
                normalMapId     : srcData.normalMapId,
                instanceWarRule : srcData.instanceWarRule.clone(),
                panel           : this,
            },
        );

        let index = 1;
        for (const data of dataArray) {
            data.mapIndex = index++;
        }

        await this._listMap.bindData(dataArray);
    }
    public async updateOnDelete(mapIndex: number): Promise<void> {
        const dataArray = this._dataArrayForListMap;
        if (dataArray.length <= 1) {
            return;
        }

        dataArray.splice(dataArray.findIndex(v => v.mapIndex === mapIndex), 1);

        let index = 1;
        for (const data of dataArray) {
            data.mapIndex = index++;
        }

        await this._listMap.bindData(dataArray);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _onTouchedBtnConfirm(): Promise<void> {
        const dataArray: SimpleMapInfo[] = [];
        for (const data of this._dataArrayForListMap) {
            dataArray.push(SimpleMapInfo.fromJson({
                normalMapId : data.normalMapId,
                ruleId      : data.instanceWarRule.getTemplateWarRuleId() ?? 0,
            }));
        }

        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId != null) {
            AutoTourneys_Mains_Gateway.reqAtSetMapPool(tourneyId, dataArray);
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgAtSetMapPool(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
        this.closePanel();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        await this._listMap.bindData(this._dataArrayForListMap, true);
    }

    private async _createDataArrayForListMap(): Promise<DataForMapRenderer[]> {
        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId == null) {
            return [];
        }

        const dataArray : DataForMapRenderer[] = [];
        let index       = 1;
        for (const mapInfo of (await AutoTourneys_Mains_Provider.getAtFullMapInfo(tourneyId))?.getSingleMapInfoArray() ?? []) {
            dataArray.push({
                mapIndex        : index++,
                normalMapId     : mapInfo.getNormalMapId(),
                instanceWarRule : Helpers_Misc.getExisted(mapInfo.getInstanceWarRule()),
                panel           : this,
            });
        }

        return dataArray;
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1045);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);
    }
}

interface DataForMapRenderer extends Ui_Types_UiListItemData.UiListItemData {
    mapIndex            : number;
    normalMapId         : number;
    instanceWarRule     : InstanceWarRule;
    panel               : Panel;
}
class MapRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMapRenderer> {
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelIndex!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMapName!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRuleName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnMap!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRule!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnUp!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDelete!        : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._layoutName,     callback : this._onTouchedLayoutName },
            { ui : this._btnMap,         callback : this._onTouchedBtnMap },
            { ui : this._btnRule,        callback : this._onTouchedBtnRule },
            { ui : this._btnUp,          callback : this._onTouchedBtnUp },
            { ui : this._btnAdd,         callback : this._onTouchedBtnAdd },
            { ui : this._btnDelete,      callback : this._onTouchedBtnDelete },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }
    private async _onTouchedLayoutName(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapRawData = await NormalMap_Model_NormalMapModel.getRawData(normalMapId);
        if (mapRawData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowMapPanel, {
            mapInfo : {
                mapRawData        : mapRawData,
                gameConfig        : await GameConfigs_Provider.getLatestGameConfig(),
                overridingPlayers : null,
            },
        });
    }
    private async _onTouchedBtnMap(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const normalMapIdArray  : number[] = [];
        const promiseArray      : Promise<void>[] = [];
        for (const normalMapId of await NormalMap_Model_NormalMapModel.getEnabledNormalMapIdSet()) {
            promiseArray.push((async () => {
                const briefData = await NormalMap_Model_NormalMapModel.getBriefData(normalMapId);
                if (briefData?.getPlayersCountUnneutral() === AutoTourneys_Constants.Common.PlayersCountUnneutral) {
                    normalMapIdArray.push(normalMapId);
                }
            })());
        }
        await Promise.all(promiseArray);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray : normalMapIdArray,
            getTitleText              : () => Lang_Utils.getText(Lang_Constants.TextType.B0227),
            callback                  : normalMapId => {
                if ((normalMapId != null) && (normalMapId !== openData.normalMapId)) {
                    openData.panel.updateOnSetMap(openData.mapIndex, normalMapId);
                }
            },
        });
    }
    private _onTouchedBtnRule(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnTickRule(openData.mapIndex);
    }
    private _onTouchedBtnUp(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnMoveUp(openData.mapIndex);
    }
    private _onTouchedBtnAdd(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnAdd(openData.mapIndex);
    }
    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnDelete(openData.mapIndex);
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const index = openData.mapIndex;
        this._imgBg.setIsVisible(index % 2 < 1);
        this._labelIndex.setText(`#${index}`);
        this._btnAdd.setLangText(Lang_Constants.TextType.B0320);
        this._btnDelete.setLangText(Lang_Constants.TextType.B0220);
        this._btnUp.setLangText(Lang_Constants.TextType.B0463);
        this._btnMap.setLangText(Lang_Constants.TextType.B1047);
        this._btnRule.setLangText(Lang_Constants.TextType.B0318);

        this._updateLabelMapName();
        this._updateLabelRuleName();
    }

    private async _updateLabelMapName(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        this._labelMapName.setText(`#${normalMapId} ${await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId) ?? Lang_Constants.UndefinedError}`);
        this._layoutName.arrangeItems();
    }
    private async _updateLabelRuleName(): Promise<void> {
        const rule = this.getOpenData()?.instanceWarRule;
        if (rule == null) {
            return;
        }

        const textForMode = Lang_Utils.getText(rule.getWarRuleCommonData()?.getHasFogByDefault() ? Lang_Constants.TextType.B0549 : Lang_Constants.TextType.B0548);
        this._labelRuleName.setText(`#${rule.getTemplateWarRuleId() ?? 0} (${textForMode}) ${(Lang_Utils.getLanguageText({ textArray : rule.getRuleNameArray() }) ?? Lang_Constants.UndefinedError)}`);
        this._layoutName.arrangeItems();
    }
}
