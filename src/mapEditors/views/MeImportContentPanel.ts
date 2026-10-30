import {
    Notifications_Dispatcher,
    GamePanels_Dict,
    GameConfigs_Provider,
    Lang_Utils,
    GamePanels_Manager,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { TaskObjectiveFullData } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";

export interface OpenData {
    srcMapRawData   : MapRawData;
    war             : MapEditor_Interface_IMeWar.IMeWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!                              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelTileAndUnit!                     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnOverwriteTileAndUnit!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelWarEvent!                        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnImportWarEvent!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnOverwriteWarEvent!                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelTaskObjective!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnImportTaskObjective!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnOverwriteTaskObjective!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelRepeatableSimpleDialogue!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnImportRepeatableSimpleDialogue!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnOverwriteRepeatableSimpleDialogue! : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelAll!                             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnOverwriteAll!                      : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0876)
        });
    }

    private async _onTouchedBtnOverwriteTileAndUnit(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent  : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
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
                    gameConfig                  : await GameConfigs_Provider.getLatestGameConfig(),
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
            FloatText.showLang(Lang_Constants.TextType.B0278);
            return;
        }
        if ((!newWarEventFullData.getActionArray().length)             &&
            (!newWarEventFullData.getConditionArray().length)          &&
            (!newWarEventFullData.getConditionNodeArray().length)      &&
            (!newWarEventFullData.getCustomCounterNameArray().length)  &&
            (!newWarEventFullData.getEventArray().length)
        ) {
            FloatText.showLang(Lang_Constants.TextType.B0278);
            return;
        }

        const warEventManager           = openData.war.getWarEventManager();
        const currentWarEventFullData   = warEventManager.getWarEventFullData() ?? new WarEventFullData();
        for (const data of newWarEventFullData.getCustomCounterNameArray()) {
            const id    = data.getId() ?? 0;
            const name  = data.getName();
            if (currentWarEventFullData.getCustomCounterNameArray().some(v => {
                const id1   = v.getId() ?? 0;
                const name1 = v.getName();
                return ((id === id1) && (name != name1))
                    || ((id !== id1) && (name == name1));
            })) {
                FloatText.showLang(Lang_Constants.TextType.A0877);
                return;
            }
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle       : () => Lang_Utils.getText(Lang_Constants.TextType.B1253),
            getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                importWarEventFullData(newWarEventFullData, currentWarEventFullData);
                warEventManager.setWarEventFullData(currentWarEventFullData);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);

                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
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
            FloatText.showLang(Lang_Constants.TextType.B0278);
            return;
        }
        if ((!warEventFullData.getActionArray().length)             &&
            (!warEventFullData.getConditionArray().length)          &&
            (!warEventFullData.getConditionNodeArray().length)      &&
            (!warEventFullData.getCustomCounterNameArray().length)  &&
            (!warEventFullData.getEventArray().length)
        ) {
            FloatText.showLang(Lang_Constants.TextType.B0278);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle       : () => Lang_Utils.getText(Lang_Constants.TextType.B1255),
            getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                openData.war.getWarEventManager().setWarEventFullData(warEventFullData);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);

                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
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
            FloatText.showLang(Lang_Constants.TextType.B0278);
            return;
        }

        const srcDataArray = srcFullData.getTaskObjectiveArray();
        if (!srcDataArray?.length) {
            FloatText.showLang(Lang_Constants.TextType.B0278);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle       : () => Lang_Utils.getText(Lang_Constants.TextType.B1253),
            getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                const war               = openData.war;
                const existingFullData  = war.getTaskObjectiveFullData() ?? new TaskObjectiveFullData();
                const existingDataArray = existingFullData.getTaskObjectiveArray();
                let objectiveId         = (existingDataArray.length ? Math.max(...existingDataArray.map(v => v.getObjectiveId())) : 0) + 1;
                for (const data of srcDataArray) {
                    data.setObjectiveId(objectiveId++);
                    existingDataArray.push(data);
                }
                war.setTaskObjectiveFullData(existingFullData);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeTaskObjectiveFullDataChanged);

                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
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
            FloatText.showLang(Lang_Constants.TextType.B0278);
            return;
        }

        const dataArray = srcFullData.getTaskObjectiveArray();
        if (!dataArray?.length) {
            FloatText.showLang(Lang_Constants.TextType.B0278);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle       : () => Lang_Utils.getText(Lang_Constants.TextType.B1255),
            getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                openData.war.setTaskObjectiveFullData(srcFullData);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeTaskObjectiveFullDataChanged);

                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
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
            FloatText.showLang(Lang_Constants.TextType.B0278);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle       : () => Lang_Utils.getText(Lang_Constants.TextType.B1253),
            getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                const existingDataArray = openData.war.getMapSimpleDialogueArray();
                let dialogueId          = (existingDataArray.length ? Math.max(...existingDataArray.map(v => v.getDialogueId())) : 0) + 1;
                for (const data of srcDataArray) {
                    data.setDialogueId(dialogueId++);
                    existingDataArray.push(data);
                }

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);

                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
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
            FloatText.showLang(Lang_Constants.TextType.B0278);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle       : () => Lang_Utils.getText(Lang_Constants.TextType.B1255),
            getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
            callback    : () => {
                openData.war.setMapSimpleDialogueArray(dataArray);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged);

                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
            },
        });
    }

    private _onTouchedBtnOverwriteAll(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent  : () => Lang_Utils.getText(Lang_Constants.TextType.A0875),
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
                    gameConfig                  : await GameConfigs_Provider.getLatestGameConfig(),
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B1253);

        this._labelTileAndUnit.setLangText(Lang_Constants.TextType.B1244);
        this._btnOverwriteTileAndUnit.setLangText(Lang_Constants.TextType.B1255);

        this._labelWarEvent.setLangText(Lang_Constants.TextType.B0469);
        this._btnImportWarEvent.setLangText(Lang_Constants.TextType.B1253);
        this._btnOverwriteWarEvent.setLangText(Lang_Constants.TextType.B1255);

        this._labelTaskObjective.setLangText(Lang_Constants.TextType.B1214);
        this._btnImportTaskObjective.setLangText(Lang_Constants.TextType.B1253);
        this._btnOverwriteTaskObjective.setLangText(Lang_Constants.TextType.B1255);

        this._labelRepeatableSimpleDialogue.setLangText(Lang_Constants.TextType.B1095);
        this._btnImportRepeatableSimpleDialogue.setLangText(Lang_Constants.TextType.B1253);
        this._btnOverwriteRepeatableSimpleDialogue.setLangText(Lang_Constants.TextType.B1255);

        this._labelAll.setLangText(Lang_Constants.TextType.B1338);
        this._btnOverwriteAll.setLangText(Lang_Constants.TextType.B1255);
    }
}

function importWarEventFullData(srcData: WarEventFullData, dstData: WarEventFullData): void {
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
        const usedIdSet = new Set(dstData.getConditionNodeArray()?.map(v => v.getNodeId()));
        let nextId      = usedIdSet.size ? Math.max(...usedIdSet) + 1 : 1;
        for (const data of srcData.getConditionNodeArray()) {
            conditionNodeIdMapping.set(data.getNodeId(), nextId++);
        }
    }

    const eventIdMapping = new Map<number, number>();
    {
        const usedIdSet = new Set(dstData.getEventArray()?.map(v => v.getEventId()));
        let nextId      = usedIdSet.size ? Math.max(...usedIdSet) + 1 : 1;
        for (const data of srcData.getEventArray()) {
            eventIdMapping.set(data.getEventId(), nextId++);
        }
    }

    const newSrcData = srcData.clone();
    {
        for (const data of newSrcData.getActionArray()) {
            const commonData    = data.createIfNotExistsWeaCommonData();
            commonData.setActionId(actionIdMapping.get(commonData.getActionId()));

            {
                const subData = data.getWeaStopPersistentAction();
                if (subData) {
                    subData.setActionIdArray(subData.getActionIdArray().map(v => actionIdMapping.get(v) ?? 0));
                }
            }
        }

        for (const data of newSrcData.getConditionArray()) {
            const commonData = data.createIfNotExistsWecCommonData();
            commonData.setConditionId(conditionIdMapping.get(commonData.getConditionId()));

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
            data.setNodeId(conditionNodeIdMapping.get(data.getNodeId()));

            for (const conditionId of data.getConditionIdAndFlagsArray()) {
                conditionId.setConditionId(conditionIdMapping.get(conditionId.getConditionId()) ?? 0);
            }
            for (const subNodeId of data.getSubNodeIdAndFlagsArray()) {
                subNodeId.setNodeId(conditionNodeIdMapping.get(subNodeId.getNodeId()) ?? 0);
            }
        }

        for (const data of newSrcData.getEventArray()) {
            data.setEventId(eventIdMapping.get(data.getEventId()));

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
