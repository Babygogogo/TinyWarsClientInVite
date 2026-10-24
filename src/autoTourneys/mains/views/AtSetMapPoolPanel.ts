import * as AutoTourneysConstants from "../../Constants.ts";
import * as AutoTourneysMainsGateway from "../Gateway.ts";
import * as AutoTourneysMainsProvider from "../Provider.ts";
import * as FloatText2 from "../../../FloatText.ts";
import * as GameConfigGcModel from "../../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoNetMessageMsgAtSetMapPoolSimpleMapInfo from "../../../proto/schema/CommonProto/NetMessage/MsgAtSetMapPool/SimpleMapInfo.ts";
import type * as ProtoSchemaCommonProtoWarRuleInstanceWarRule from "../../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import * as SoundsConstants from "../../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../../ui/types/UiListItemData.ts";
import * as WarRulesUtilsInstance from "../../../warRules/utils/Instance.ts";

export interface OpenData {
    tourneyId   : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConfirm!   : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCancel!    : UiInterfacesIUiButton.IUiButton;

    private readonly _listMap!      : UiInterfacesIUiScrollList.IUiScrollList<DataForMapRenderer>;

    private _dataArrayForListMap    : DataForMapRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgAtSetMapPool,     callback: this._onNotifyMsgAtSetMapPool },
        ]);
        this._setUiListenerArray([
            { ui: this._btnCancel,          callback: this.closePanel },
            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
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
        const mapRawData = await NormalMapModelNormalMapModel.getRawData(normalMapId);
        if (mapRawData == null) {
            return;
        }

        const dataArray         = this._dataArrayForListMap;
        const dataIndex         = dataArray.findIndex(v => v.mapIndex === mapIndex);
        const data              = dataArray[dataIndex];
        data.normalMapId        = normalMapId;
        data.instanceWarRule    = WarRulesUtilsInstance.create({
            templateWarRule             : HelpersMisc.getExisted(mapRawData.getTemplateWarRuleArray())[0],
            warEventFullData            : mapRawData.getWarEventFullData(),
            allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
            taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
        });
        this._listMap.updateSingleData(dataIndex, data);
    }
    public async updateOnTickRule(mapIndex: number): Promise<void> {
        const dataArray     = this._dataArrayForListMap;
        const dataIndex     = dataArray.findIndex(v => v.mapIndex === mapIndex);
        const data          = dataArray[dataIndex];
        const mapRawData    = await NormalMapModelNormalMapModel.getRawData(data.normalMapId);
        if (mapRawData == null) {
            return;
        }

        const templateWarRuleArray  = mapRawData?.getTemplateWarRuleArray() ?? [];
        const rulesCount            = templateWarRuleArray.length;
        if (rulesCount == 0) {
            return;
        }

        const ruleId            = data.instanceWarRule.getTemplateWarRuleId() ?? 0;
        const templateWarRule   = templateWarRuleArray[(templateWarRuleArray.findIndex(v => (v.getRuleId() ?? 0) === ruleId) + 1) % rulesCount];
        data.instanceWarRule    = WarRulesUtilsInstance.create({
            templateWarRule             : templateWarRule,
            warEventFullData            : mapRawData.getWarEventFullData(),
            allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
            taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
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
        if (dataArray.length >= AutoTourneysConstants.Common.MaxMapsCount) {
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
        const dataArray: ProtoSchemaCommonProtoNetMessageMsgAtSetMapPoolSimpleMapInfo.SimpleMapInfo[] = [];
        for (const data of this._dataArrayForListMap) {
            dataArray.push(ProtoSchemaCommonProtoNetMessageMsgAtSetMapPoolSimpleMapInfo.SimpleMapInfo.fromJson({
                normalMapId : data.normalMapId,
                ruleId      : data.instanceWarRule.getTemplateWarRuleId() ?? 0,
            }));
        }

        const tourneyId = this.getOpenData()?.tourneyId;
        if (tourneyId != null) {
            AutoTourneysMainsGateway.reqAtSetMapPool(tourneyId, dataArray);
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgAtSetMapPool(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
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
        for (const mapInfo of (await AutoTourneysMainsProvider.getAtFullMapInfo(tourneyId))?.getSingleMapInfoArray() ?? []) {
            dataArray.push({
                mapIndex        : index++,
                normalMapId     : mapInfo.getNormalMapId() ?? 0,
                instanceWarRule : HelpersMisc.getExisted(mapInfo.getInstanceWarRule()),
                panel           : this,
            });
        }

        return dataArray;
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B1045);
        this._btnConfirm.setLangText(LangConstants.TextType.B0026);
        this._btnCancel.setLangText(LangConstants.TextType.B0154);
    }
}

interface DataForMapRenderer extends UiTypesUiListItemData.UiListItemData {
    mapIndex            : number;
    normalMapId         : number;
    instanceWarRule     : ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule;
    panel               : Panel;
}
class MapRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMapRenderer> {
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelIndex!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMapName!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRuleName!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnMap!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnRule!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnUp!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAdd!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDelete!        : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._layoutName,     callback: this._onTouchedLayoutName },
            { ui: this._btnMap,         callback: this._onTouchedBtnMap },
            { ui: this._btnRule,        callback: this._onTouchedBtnRule },
            { ui: this._btnUp,          callback: this._onTouchedBtnUp },
            { ui: this._btnAdd,         callback: this._onTouchedBtnAdd },
            { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
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

        const mapRawData = await NormalMapModelNormalMapModel.getRawData(normalMapId);
        if (mapRawData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowMapPanel, {
            mapInfo: {
                mapRawData          : mapRawData,
                gameConfig          : await GameConfigGcModel.getLatestGameConfig(),
                overridingPlayers   : null,
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
        for (const normalMapId of await NormalMapModelNormalMapModel.getEnabledNormalMapIdSet()) {
            promiseArray.push((async () => {
                const briefData = await NormalMapModelNormalMapModel.getBriefData(normalMapId);
                if (briefData?.getPlayersCountUnneutral() === AutoTourneysConstants.Common.PlayersCountUnneutral) {
                    normalMapIdArray.push(normalMapId);
                }
            })());
        }
        await Promise.all(promiseArray);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : normalMapIdArray,
            getTitleText                : () => LangUtils.getText(LangConstants.TextType.B0227),
            callback                    : normalMapId => {
                if ((normalMapId != null) && (normalMapId !== openData.normalMapId)) {
                    openData.panel.updateOnSetMap(openData.mapIndex, normalMapId);
                }
            }
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
        this._btnAdd.setLangText(LangConstants.TextType.B0320);
        this._btnDelete.setLangText(LangConstants.TextType.B0220);
        this._btnUp.setLangText(LangConstants.TextType.B0463);
        this._btnMap.setLangText(LangConstants.TextType.B1047);
        this._btnRule.setLangText(LangConstants.TextType.B0318);

        this._updateLabelMapName();
        this._updateLabelRuleName();
    }

    private async _updateLabelMapName(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        this._labelMapName.setText(`#${normalMapId} ${await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId) ?? LangConstants.UndefinedError}`);
        this._layoutName.arrangeItems();
    }
    private async _updateLabelRuleName(): Promise<void> {
        const rule = this.getOpenData()?.instanceWarRule;
        if (rule == null) {
            return;
        }

        const textForMode = LangUtils.getText(rule.getWarRuleCommonData()?.getHasFogByDefault() ? LangConstants.TextType.B0549 : LangConstants.TextType.B0548);
        this._labelRuleName.setText(`#${rule.getTemplateWarRuleId() ?? 0} (${textForMode}) ${(LangUtils.getLanguageText({ textArray: rule.getRuleNameArray() }) ?? LangConstants.UndefinedError)}`);
        this._layoutName.arrangeItems();
    }
}
