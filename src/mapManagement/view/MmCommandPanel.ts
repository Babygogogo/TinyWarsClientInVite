import {
    WarEvents_FullDatas_Utils,
    GamePanels_Manager,
    Maps_Constants,
    NormalMap_Model_NormalMapModel,
    MapTags_Utils,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GameConfigs_Provider,
    Helpers_Collection,
    Helpers_GameFlow,
    MapEditor_Model_MeProxy,
    NormalMap_Model_NormalMapProxy,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";

export interface OpenData {
    normalMapId   : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnDeleteRedundantEvent!  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteMap!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnWarRule!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRename!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnEditWarEvent!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMapTag!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                 callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgMmSetMapTagIdFlags,           callback : this._onNotifyMsgMmSetMapTagIdFlags },
            { type : Notifications_TypeId.TypeId.MsgMmDeleteRedundantWarEvent,    callback : this._onNotifyMsgMmDeleteRedundantWarEvent },
            { type : Notifications_TypeId.TypeId.MsgMmSetMapName,                 callback : this._onNotifyMsgMmSetMapName },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                   callback : this.closePanel },
            { ui : this._btnDeleteRedundantEvent,    callback : this._onTouchedBtnDeleteRedundantEvent },
            { ui : this._btnDeleteMap,               callback : this._onTouchedBtnDeleteMap },
            { ui : this._btnEditWarEvent,            callback : this._onTouchedBtnEditWarEvent },
            { ui : this._btnWarRule,                 callback : this._onTouchedBtnWarRule },
            { ui : this._btnMapTag,                  callback : this._onTouchedBtnMapTag },
            { ui : this._btnRename,                  callback : this._onTouchedBtnRename },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgMmSetMapTagIdFlags(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0151));
    }
    private _onNotifyMsgMmDeleteRedundantWarEvent(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.OperationSucceeded));
    }
    private _onNotifyMsgMmSetMapName(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
        this._updateLabelTitle();
    }

    private async _onTouchedBtnDeleteRedundantEvent(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapRawData = await NormalMap_Model_NormalMapModel.getRawData(normalMapId);
        if (mapRawData == null) {
            throw Helpers_Misc.newError(`No mapRawData: ${normalMapId}.`);
        }

        const srcWarEventFullData = mapRawData.getWarEventFullData();
        if ((srcWarEventFullData == null) || (WarEvents_FullDatas_Utils.checkIsEmptyWarEventFullData(srcWarEventFullData))) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0389));
            return;
        }

        const warEventIdSet = new Set<number>();
        for (const warRule of mapRawData.getTemplateWarRuleArray()) {
            for (const warEventId of warRule.getWarEventIdArray()) {
                warEventIdSet.add(warEventId);
            }
        }

        const newWarEventFullData       = WarEvents_FullDatas_Utils.trimWarEventFullData(srcWarEventFullData, [...warEventIdSet], false);
        const newActionIdSet            = new Set(newWarEventFullData.getActionArray().map(v => Helpers_Misc.getExisted(v.getWeaCommonData()?.getActionId())));
        const redundantActionArray      = srcWarEventFullData.getActionArray().filter(v => !newActionIdSet.has(Helpers_Misc.getExisted(v.getWeaCommonData()?.getActionId())));
        const newEventIdSet             = new Set(newWarEventFullData.getEventArray().map(v => v.getEventId()));
        const redundantEventArray       = srcWarEventFullData.getEventArray().filter(v => !newEventIdSet.has(v.getEventId()));
        const newNodeIdSet              = new Set(newWarEventFullData.getConditionNodeArray().map(v => v.getNodeId()));
        const redundantNodeArray        = srcWarEventFullData.getConditionNodeArray().filter(v => !newNodeIdSet.has(v.getNodeId()));
        const newConditionIdSet         = new Set(newWarEventFullData.getConditionArray()?.map(v => Helpers_Misc.getExisted(v.getWecCommonData()?.getConditionId())));
        const redundantConditionArray   = srcWarEventFullData.getConditionArray().filter(v => !newConditionIdSet.has(Helpers_Misc.getExisted(v.getWecCommonData()?.getConditionId())));

        if ((!redundantActionArray.length)      &&
            (!redundantEventArray.length)       &&
            (!redundantNodeArray.length)        &&
            (!redundantConditionArray.length)
        ) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0389));
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getFormattedText(
                Lang_Constants.TextType.F0158,
                redundantEventArray.length,
                redundantEventArray.length ? redundantEventArray.map(v => `E${v.getEventId()}`).join(`, `) : `----`,
                redundantNodeArray.length,
                redundantNodeArray.length ? redundantNodeArray.map(v => `N${v.getNodeId()}`).join(`, `) : `----`,
                redundantConditionArray.length,
                redundantConditionArray.length ? redundantConditionArray.map(v => `C${v.getWecCommonData()?.getConditionId()}`).join(`, `) : `----`,
                redundantActionArray.length,
                redundantActionArray.length ? redundantActionArray.map(v => `A${v.getWeaCommonData()?.getActionId()}`).join(`, `) : `----`,
            ),
            callback : () => NormalMap_Model_NormalMapProxy.reqMmDeleteRedundantWarEvent(normalMapId),
        });
    }

    private _onTouchedBtnDeleteMap(): void {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0080),
            callback   : () => {
                NormalMap_Model_NormalMapProxy.reqMmSetMapEnabled(normalMapId, false);
                this.closePanel();
            },
        });
    }

    private async _onTouchedBtnEditWarEvent(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapRawData = Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId));
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0391),
            callback   : () => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleMapEditorSlotPanel, {
                currentSlotIndex     : 0,
                needConfirmOverwrite : true,
                needNonEmptySlot     : false,
                getHelpText          : null,
                callback             : slotIndex => {
                    MapEditor_Model_MeProxy.reqMeSubmitNormalMap({
                        slotIndex                 : slotIndex,
                        mapRawData                : mapRawData,
                        needReview                : false,
                        srcNormalMapIdForAddEvent : normalMapId,
                        gridMarkData              : null,
                    });
                    Helpers_GameFlow.gotoLobby();
                    FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0393));
                },
            }),
        });
    }

    private async _onTouchedBtnWarRule(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapRawData = await NormalMap_Model_NormalMapModel.getRawData(normalMapId);
        if (mapRawData == null) {
            throw Helpers_Misc.newError(`MmCommandPanel._onTouchedBtnWarRule() empty mapRawData.`);
        }

        // GamePanels.openPanel(PanelHelpers.PanelDict.MmDeprecatedWarRulePanel, {
        //     mapRawData,
        // });
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B0314),
            availableNumberArray : [1, 2, 3],
            currentNumber        : null,
            getNumberMainText    : num => {
                switch (num) {
                    case 1  : return Lang_Utils.getText(Lang_Constants.TextType.B0320);
                    case 2  : return Lang_Utils.getText(Lang_Constants.TextType.B0317);
                    case 3  : return Lang_Utils.getText(Lang_Constants.TextType.B0220);
                    default : return Lang_Constants.UndefinedError;
                }
            },
            callbackOnConfirm : async num => {
                const ruleArray = mapRawData.getTemplateWarRuleArray();

                if (num === 1) {
                    await generateHandler(
                        ruleArray,
                        () => Lang_Utils.getText(Lang_Constants.TextType.B1471),
                        async ruleId => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmWarRulePanel, {
                            gcData          : await GameConfigs_Provider.getLatestGameConfig(),
                            mapRawData      : mapRawData,
                            templateWarRule : Helpers_Misc.getExisted(ruleArray.find(v => v.getRuleId() === ruleId)?.clone()),
                        }),
                    )();

                } else if (num === 2) {
                    await generateHandler(
                        ruleArray,
                        () => Lang_Utils.getText(Lang_Constants.TextType.B0317),
                        ruleId => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmModifyWarRulePanel, {
                            normalMapId       : normalMapId,
                            templateWarRuleId : ruleId,
                        }),
                    )();

                } else if (num === 3) {
                    if (ruleArray.length <= 1) {
                        FloatText.showLang(Lang_Constants.TextType.A0978);
                        return;
                    }

                    await generateHandler(
                        ruleArray,
                        () => Lang_Utils.getText(Lang_Constants.TextType.B0220),
                        ruleId => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                            getContent : () => Lang_Utils.getFormattedText(
                                Lang_Constants.TextType.F0265,
                                `#${ruleId}, ${Lang_Utils.getLanguageText({ textArray : ruleArray.find(v => v.getRuleId() === ruleId)?.getRuleNameArray() })}`,
                            ),
                            callback : () => NormalMap_Model_NormalMapProxy.reqMmDeleteWarRule(normalMapId, ruleId),
                        }),
                    )();

                } else {
                    throw Helpers_Misc.newError(`MmCommandPanel._onTouchedBtnWarRule() invalid command: ${num}.`);
                }
            },
        });

        this.closePanel();
    }

    private async _onTouchedBtnMapTag(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapRawData = await NormalMap_Model_NormalMapModel.getRawData(normalMapId);
        if (mapRawData == null) {
            return;
        }

        const currentGroupedMapTagId    = mapRawData.getMapTagIdFlags();
        const mapTag                    = await NormalMap_Model_NormalMapModel.getMapTag();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            availableNumberArray : Helpers_Collection.getNonNullElements(mapTag?.getMapTagDataArray()?.map(v => v.getIsEnabled() ? v.getMapTagId() : null) ?? []).sort((v1, v2) => v1 - v2),
            currentNumberArray   : MapTags_Utils.getDecodedMapTagIdList(currentGroupedMapTagId),
            showNumber           : true,
            getTitleText         : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B0445)),
            getNumberMainText    : mapTagId => Lang_Utils.getLanguageText({ textArray : mapTag?.getMapTagDataArray()?.find(v => (v.getMapTagId()) === mapTagId)?.getNameArray() }) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : newMapTagIdArray => {
                const newGroupedMapTagId = MapTags_Utils.getEncodedMapTagId(newMapTagIdArray);
                if (newGroupedMapTagId !== currentGroupedMapTagId) {
                    NormalMap_Model_NormalMapProxy.reqMmSetMapTagIdFlags(normalMapId, newGroupedMapTagId);
                }
            },
        });
    }

    private async _onTouchedBtnRename(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputShortLangTextPanel, {
            getTitleText     : () => Lang_Utils.getText(Lang_Constants.TextType.B0708),
            maxTextLength    : Maps_Constants.Common.MaxNameLength,
            currentTextArray : (await NormalMap_Model_NormalMapModel.getBriefData(normalMapId))?.getMapNameArray() ?? [],
            callback         : mapNameArray => NormalMap_Model_NormalMapProxy.reqMmSetMapName(normalMapId, mapNameArray),
        });
    }

    private async _updateComponentsForLanguage(): Promise<void> {
        this._btnDeleteRedundantEvent.setLangText(Lang_Constants.TextType.B1005);
        this._btnDeleteMap.setLangText(Lang_Constants.TextType.B0270);
        this._btnEditWarEvent.setLangText(Lang_Constants.TextType.B1099);
        this._btnWarRule.setLangText(Lang_Constants.TextType.B0314);
        this._btnRename.setLangText(Lang_Constants.TextType.B0708);
        this._btnMapTag.setLangText(Lang_Constants.TextType.B0445);
        this._updateLabelTitle();
    }
    private async _updateLabelTitle(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        this._labelTitle.setText(`#${normalMapId} ${await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId)}`);
    }
}

function generateHandler(
    ruleArray   : TemplateWarRule[],
    getTitleText: () => string,
    callback    : (ruleId: number) => void,
): () => Promise<void> {
    return async () => {
        await GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText         : getTitleText,
            availableNumberArray : ruleArray.map(v => v.getRuleId()),
            currentNumber        : null,
            showNumber           : true,
            getNumberMainText    : ruleId => Lang_Utils.getLanguageText({ textArray : ruleArray.find(v => v.getRuleId() === ruleId)?.getRuleNameArray() }) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : callback,
        });
    };
}
