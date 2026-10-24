import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import * as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";

export interface OpenData {
    srcMapRawData   : ProtoSchemaCommonProtoMapMapRawData.MapRawData;
    war             : MapEditorInterfaceIMeWar.IMeWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!                              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                             : UiInterfacesIUiButton.IUiButton;

    private readonly _labelTileAndUnit!                     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnOverwriteTileAndUnit!              : UiInterfacesIUiButton.IUiButton;

    private readonly _labelWarEvent!                        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnImportWarEvent!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnOverwriteWarEvent!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _labelTaskObjective!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnImportTaskObjective!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnOverwriteTaskObjective!            : UiInterfacesIUiButton.IUiButton;

    private readonly _labelRepeatableSimpleDialogue!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnImportRepeatableSimpleDialogue!    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnOverwriteRepeatableSimpleDialogue! : UiInterfacesIUiButton.IUiButton;

    private readonly _labelAll!                             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnOverwriteAll!                      : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnHelp,                                callback: this._onTouchedBtnHelp },
            { ui: this._btnClose,                               callback: this.closePanel },

            { ui: this._btnOverwriteTileAndUnit,                callback: this._onTouchedBtnOverwriteTileAndUnit },

            { ui: this._btnImportWarEvent,                      callback: this._onTouchedBtnImportWarEvent },
            { ui: this._btnOverwriteWarEvent,                   callback: this._onTouchedBtnOverwriteWarEvent },

            { ui: this._btnImportTaskObjective,                 callback: this._onTouchedBtnImportTaskObjective },
            { ui: this._btnOverwriteTaskObjective,              callback: this._onTouchedBtnOverwriteTaskObjective },

            { ui: this._btnImportRepeatableSimpleDialogue,      callback: this._onTouchedBtnImportRepeatableSimpleDialogue },
            { ui: this._btnOverwriteRepeatableSimpleDialogue,   callback: this._onTouchedBtnOverwriteRepeatableSimpleDialogue },

            { ui: this._btnOverwriteAll,                        callback: this._onTouchedBtnOverwriteAll },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0876)
        });
    }

    private async _onTouchedBtnOverwriteTileAndUnit(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent  : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : async () => {
                const war                   = openData.war;
                const dstMapRawData         = await war.serializeForMap();
                const srcMapRawData         = openData.srcMapRawData;
                dstMapRawData.setUnitDataArray(srcMapRawData.getUnitDataArray().map(v => v.clone()));
                dstMapRawData.setTileDataArray(srcMapRawData.getTileDataArray().map(v => v.clone()));

                war.stopRunning();
                await war.initWithMapRawData({
                    mapRawData                  : dstMapRawData,
                    slotIndex                   : war.getMapSlotIndex(),
                    gameConfig                  : await GameConfigGcModel.getLatestGameConfig(),
                    srcNormalMapIdForAddEvent   : null,
                    gridMarkData                : null,
                });
                war.setIsMapModified(true);
                war.startRunning()
                    .startRunningView();
            },
        });
    }

    private _onTouchedBtnImportWarEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const srcMapRawData         = openData.srcMapRawData;
        const newWarEventFullData   = srcMapRawData.getWarEventFullData()?.clone();
        if (newWarEventFullData == null) {
            FloatText2.showLang(LangConstants.TextType.B0278);
            return;
        }
        if ((!newWarEventFullData.getActionArray().length)             &&
            (!newWarEventFullData.getConditionArray().length)          &&
            (!newWarEventFullData.getConditionNodeArray().length)      &&
            (!newWarEventFullData.getCustomCounterNameArray().length)  &&
            (!newWarEventFullData.getEventArray().length)
        ) {
            FloatText2.showLang(LangConstants.TextType.B0278);
            return;
        }

        const warEventManager           = openData.war.getWarEventManager();
        const currentWarEventFullData   = warEventManager.getWarEventFullData() ?? new ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData();
        for (const data of newWarEventFullData.getCustomCounterNameArray()) {
            const id    = data.getId() ?? 0;
            const name  = data.getName();
            if (currentWarEventFullData.getCustomCounterNameArray().some(v => {
                const id1   = v.getId() ?? 0;
                const name1 = v.getName();
                return ((id === id1) && (name != name1))
                    || ((id !== id1) && (name == name1));
            })) {
                FloatText2.showLang(LangConstants.TextType.A0877);
                return;
            }
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle       : () => LangUtils.getText(LangConstants.TextType.B1253),
            getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                importWarEventFullData(newWarEventFullData, currentWarEventFullData);
                warEventManager.setWarEventFullData(currentWarEventFullData);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);

                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
            }
        });
    }
    private _onTouchedBtnOverwriteWarEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const srcMapRawData     = openData.srcMapRawData;
        const warEventFullData  = srcMapRawData.getWarEventFullData()?.clone();
        if (warEventFullData == null) {
            FloatText2.showLang(LangConstants.TextType.B0278);
            return;
        }
        if ((!warEventFullData.getActionArray().length)             &&
            (!warEventFullData.getConditionArray().length)          &&
            (!warEventFullData.getConditionNodeArray().length)      &&
            (!warEventFullData.getCustomCounterNameArray().length)  &&
            (!warEventFullData.getEventArray().length)
        ) {
            FloatText2.showLang(LangConstants.TextType.B0278);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle       : () => LangUtils.getText(LangConstants.TextType.B1255),
            getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                openData.war.getWarEventManager().setWarEventFullData(warEventFullData);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);

                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
            }
        });
    }

    private _onTouchedBtnImportTaskObjective(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const srcMapRawData = openData.srcMapRawData;
        const srcFullData   = srcMapRawData.getTaskObjectiveFullData()?.clone();
        if (!srcFullData) {
            FloatText2.showLang(LangConstants.TextType.B0278);
            return;
        }

        const srcDataArray = srcFullData.getTaskObjectiveArray();
        if (!srcDataArray?.length) {
            FloatText2.showLang(LangConstants.TextType.B0278);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle       : () => LangUtils.getText(LangConstants.TextType.B1253),
            getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                const war               = openData.war;
                const existingFullData  = war.getTaskObjectiveFullData() ?? new ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData.TaskObjectiveFullData();
                const existingDataArray = existingFullData.getTaskObjectiveArray();
                let objectiveId         = (existingDataArray.length ? Math.max(...existingDataArray.map(v => v.getObjectiveId() ?? 0)) : 0) + 1;
                for (const data of srcDataArray) {
                    data.setObjectiveId(objectiveId++);
                    existingDataArray.push(data);
                }
                war.setTaskObjectiveFullData(existingFullData);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeTaskObjectiveFullDataChanged);

                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
            },
        });
    }
    private _onTouchedBtnOverwriteTaskObjective(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const srcMapRawData = openData.srcMapRawData;
        const srcFullData   = srcMapRawData.getTaskObjectiveFullData()?.clone();
        if (!srcFullData) {
            FloatText2.showLang(LangConstants.TextType.B0278);
            return;
        }

        const dataArray = srcFullData.getTaskObjectiveArray();
        if (!dataArray?.length) {
            FloatText2.showLang(LangConstants.TextType.B0278);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle       : () => LangUtils.getText(LangConstants.TextType.B1255),
            getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                openData.war.setTaskObjectiveFullData(srcFullData);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeTaskObjectiveFullDataChanged);

                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
            },
        });
    }

    private _onTouchedBtnImportRepeatableSimpleDialogue(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const srcMapRawData = openData.srcMapRawData;
        const srcDataArray  = srcMapRawData.getMapSimpleDialogueArray().map(v => v.clone());
        if (!srcDataArray) {
            FloatText2.showLang(LangConstants.TextType.B0278);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle       : () => LangUtils.getText(LangConstants.TextType.B1253),
            getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                const existingDataArray = openData.war.getMapSimpleDialogueArray();
                let dialogueId          = (existingDataArray.length ? Math.max(...existingDataArray.map(v => v.getDialogueId() ?? 0)) : 0) + 1;
                for (const data of srcDataArray) {
                    data.setDialogueId(dialogueId++);
                    existingDataArray.push(data);
                }

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);

                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
            },
        });
    }
    private _onTouchedBtnOverwriteRepeatableSimpleDialogue(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const srcMapRawData = openData.srcMapRawData;
        const dataArray     = srcMapRawData.getMapSimpleDialogueArray().map(v => v.clone());
        if (!dataArray) {
            FloatText2.showLang(LangConstants.TextType.B0278);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle       : () => LangUtils.getText(LangConstants.TextType.B1255),
            getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                openData.war.setMapSimpleDialogueArray(dataArray);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged);

                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
            },
        });
    }

    private _onTouchedBtnOverwriteAll(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent  : () => LangUtils.getText(LangConstants.TextType.A0875),
            callback    : async () => {
                const mapRawData = openData.srcMapRawData.clone();
                for (const rule of mapRawData.getTemplateWarRuleArray()) {
                    const ruleAvailability = rule.getRuleAvailability();
                    (ruleAvailability) && (ruleAvailability.setCanMrw(false));
                }
                mapRawData.setCampaignMapData(null);

                const war = openData.war;
                war.stopRunning();
                await war.initWithMapRawData({
                    mapRawData                  : mapRawData,
                    slotIndex                   : war.getMapSlotIndex(),
                    gameConfig                  : await GameConfigGcModel.getLatestGameConfig(),
                    srcNormalMapIdForAddEvent   : null,
                    gridMarkData                : null,
                });
                war.setIsMapModified(true);
                war.startRunning()
                    .startRunningView();
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B1253);

        this._labelTileAndUnit.setLangText(LangConstants.TextType.B1244);
        this._btnOverwriteTileAndUnit.setLangText(LangConstants.TextType.B1255);

        this._labelWarEvent.setLangText(LangConstants.TextType.B0469);
        this._btnImportWarEvent.setLangText(LangConstants.TextType.B1253);
        this._btnOverwriteWarEvent.setLangText(LangConstants.TextType.B1255);

        this._labelTaskObjective.setLangText(LangConstants.TextType.B1214);
        this._btnImportTaskObjective.setLangText(LangConstants.TextType.B1253);
        this._btnOverwriteTaskObjective.setLangText(LangConstants.TextType.B1255);

        this._labelRepeatableSimpleDialogue.setLangText(LangConstants.TextType.B1095);
        this._btnImportRepeatableSimpleDialogue.setLangText(LangConstants.TextType.B1253);
        this._btnOverwriteRepeatableSimpleDialogue.setLangText(LangConstants.TextType.B1255);

        this._labelAll.setLangText(LangConstants.TextType.B1338);
        this._btnOverwriteAll.setLangText(LangConstants.TextType.B1255);
    }
}

function importWarEventFullData(srcData: ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData, dstData: ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData): void {
    const actionIdMapping = new Map<number, number>();
    {
        const usedIdSet = new Set(dstData.getActionArray()?.map(v => v.getWeaCommonData()?.getActionId() ?? 0));
        let nextId      = usedIdSet.size ? Math.max(...usedIdSet) + 1 : 1;
        for (const data of srcData.getActionArray()) {
            actionIdMapping.set(data.getWeaCommonData()?.getActionId() ?? 0, nextId++);
        }
    }

    const conditionIdMapping = new Map<number, number>();
    {
        const usedIdSet = new Set(dstData.getConditionArray()?.map(v => v.getWecCommonData()?.getConditionId() ?? 0));
        let nextId      = usedIdSet.size ? Math.max(...usedIdSet) + 1 : 1;
        for (const data of srcData.getConditionArray()) {
            conditionIdMapping.set(data.getWecCommonData()?.getConditionId() ?? 0, nextId++);
        }
    }

    const conditionNodeIdMapping = new Map<number, number>();
    {
        const usedIdSet = new Set(dstData.getConditionNodeArray()?.map(v => v.getNodeId() ?? 0));
        let nextId      = usedIdSet.size ? Math.max(...usedIdSet) + 1 : 1;
        for (const data of srcData.getConditionNodeArray()) {
            conditionNodeIdMapping.set(data.getNodeId() ?? 0, nextId++);
        }
    }

    const eventIdMapping = new Map<number, number>();
    {
        const usedIdSet = new Set(dstData.getEventArray()?.map(v => v.getEventId() ?? 0));
        let nextId      = usedIdSet.size ? Math.max(...usedIdSet) + 1 : 1;
        for (const data of srcData.getEventArray()) {
            eventIdMapping.set(data.getEventId() ?? 0, nextId++);
        }
    }

    const newSrcData = srcData.clone();
    {
        for (const data of newSrcData.getActionArray()) {
            const commonData    = data.createIfNotExistsWeaCommonData();
            commonData.setActionId(actionIdMapping.get(commonData.getActionId() ?? 0));

            {
                const subData = data.getWeaStopPersistentAction();
                if (subData) {
                    subData.setActionIdArray(subData.getActionIdArray().map(v => actionIdMapping.get(v) ?? 0));
                }
            }
        }

        for (const data of newSrcData.getConditionArray()) {
            const commonData = data.createIfNotExistsWecCommonData();
            commonData.setConditionId(conditionIdMapping.get(commonData.getConditionId() ?? 0));

            {
                const subData = data.getWecOngoingPersistentActionPresence();
                if (subData) {
                    subData.setOngoingActionIdArray(subData.getOngoingActionIdArray().map(v => actionIdMapping.get(v) ?? 0));
                }
            }

            {
                const subData = data.getWecEventCalledCount();
                if (subData) {
                    subData.setEventIdArray(subData.getEventIdArray().map(v => eventIdMapping.get(v) ?? 0));
                }
            }
        }

        for (const data of newSrcData.getConditionNodeArray()) {
            data.setNodeId(conditionNodeIdMapping.get(data.getNodeId() ?? 0));

            for (const conditionId of data.getConditionIdAndFlagsArray()) {
                conditionId.setConditionId(conditionIdMapping.get(conditionId.getConditionId()) ?? 0);
            }
            for (const subNodeId of data.getSubNodeIdAndFlagsArray()) {
                subNodeId.setNodeId(conditionNodeIdMapping.get(subNodeId.getNodeId()) ?? 0);
            }
        }

        for (const data of newSrcData.getEventArray()) {
            data.setEventId(eventIdMapping.get(data.getEventId() ?? 0));

            for (const rootNodeAndActions of data.getRootNodeAndActionsArray()) {
                rootNodeAndActions.setActionIdArray(rootNodeAndActions.getActionIdArray().map(v => actionIdMapping.get(v) ?? 0));

                {
                    const nodeIdAndFlags = rootNodeAndActions.getNodeIdAndFlags();
                    (nodeIdAndFlags) && (nodeIdAndFlags.setNodeId(conditionNodeIdMapping.get(nodeIdAndFlags.getNodeId()) ?? 0));
                }
            }
        }
    }

    {
        dstData.setActionArray(dstData.getActionArray().concat(newSrcData.getActionArray()));
        dstData.setConditionArray(dstData.getConditionArray().concat(newSrcData.getConditionArray()));
        dstData.setConditionNodeArray(dstData.getConditionNodeArray().concat(newSrcData.getConditionNodeArray()));
        dstData.setCustomCounterNameArray(dstData.getCustomCounterNameArray().concat(newSrcData.getCustomCounterNameArray()));
        dstData.setEventArray(dstData.getEventArray().concat(newSrcData.getEventArray()));
    }
}
