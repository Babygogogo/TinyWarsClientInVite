import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MapEditorModelMeProxy from "../../mapEditor/model/MeProxy.ts";
import * as MapTagsUtils from "../../mapTags/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NormalMapModelNormalMapProxy from "../../normalMap/model/NormalMapProxy.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarRuleTemplateWarRule from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import * as WarEventsFullDatasUtils from "../../warEvents/fullDatas/Utils.ts";

export interface OpenData {
    normalMapId   : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnDeleteRedundantEvent!  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteMap!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnWarRule!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnRename!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnEditWarEvent!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMapTag!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMmSetMapTagIdFlags,           callback: this._onNotifyMsgMmSetMapTagIdFlags },
            { type: NotificationsTypeId.TypeId.MsgMmDeleteRedundantWarEvent,    callback: this._onNotifyMsgMmDeleteRedundantWarEvent },
            { type: NotificationsTypeId.TypeId.MsgMmSetMapName,                 callback: this._onNotifyMsgMmSetMapName },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },
            { ui: this._btnDeleteRedundantEvent,    callback: this._onTouchedBtnDeleteRedundantEvent },
            { ui: this._btnDeleteMap,               callback: this._onTouchedBtnDeleteMap },
            { ui: this._btnEditWarEvent,            callback: this._onTouchedBtnEditWarEvent },
            { ui: this._btnWarRule,                 callback: this._onTouchedBtnWarRule },
            { ui: this._btnMapTag,                  callback: this._onTouchedBtnMapTag },
            { ui: this._btnRename,                  callback: this._onTouchedBtnRename },
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
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0151));
    }
    private _onNotifyMsgMmDeleteRedundantWarEvent(): void {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.OperationSucceeded));
    }
    private _onNotifyMsgMmSetMapName(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
        this._updateLabelTitle();
    }

    private async _onTouchedBtnDeleteRedundantEvent(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapRawData = await NormalMapModelNormalMapModel.getRawData(normalMapId);
        if (mapRawData == null) {
            throw HelpersMisc.newError(`No mapRawData: ${normalMapId}.`);
        }

        const srcWarEventFullData = mapRawData.getWarEventFullData();
        if ((srcWarEventFullData == null) || (WarEventsFullDatasUtils.checkIsEmptyWarEventFullData(srcWarEventFullData))) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0389));
            return;
        }

        const warEventIdSet = new Set<number>();
        for (const warRule of mapRawData.getTemplateWarRuleArray()) {
            for (const warEventId of warRule.getWarEventIdArray()) {
                warEventIdSet.add(warEventId);
            }
        }

        const newWarEventFullData       = WarEventsFullDatasUtils.trimWarEventFullData(srcWarEventFullData, [...warEventIdSet], false);
        const newActionIdSet            = new Set(newWarEventFullData.getActionArray().map(v => HelpersMisc.getExisted(v.getWeaCommonData()?.getActionId())));
        const redundantActionArray      = srcWarEventFullData.getActionArray().filter(v => !newActionIdSet.has(HelpersMisc.getExisted(v.getWeaCommonData()?.getActionId()))) ?? [];
        const newEventIdSet             = new Set(newWarEventFullData.getEventArray().map(v => HelpersMisc.getExisted(v.getEventId())));
        const redundantEventArray       = srcWarEventFullData.getEventArray().filter(v => !newEventIdSet.has(HelpersMisc.getExisted(v.getEventId()))) ?? [];
        const newNodeIdSet              = new Set(newWarEventFullData.getConditionNodeArray().map(v => HelpersMisc.getExisted(v.getNodeId())));
        const redundantNodeArray        = srcWarEventFullData.getConditionNodeArray().filter(v => !newNodeIdSet.has(HelpersMisc.getExisted(v.getNodeId()))) ?? [];
        const newConditionIdSet         = new Set(newWarEventFullData.getConditionArray()?.map(v => HelpersMisc.getExisted(v.getWecCommonData()?.getConditionId())));
        const redundantConditionArray   = srcWarEventFullData.getConditionArray().filter(v => !newConditionIdSet.has(HelpersMisc.getExisted(v.getWecCommonData()?.getConditionId()))) ?? [];

        if ((!redundantActionArray.length)      &&
            (!redundantEventArray.length)       &&
            (!redundantNodeArray.length)        &&
            (!redundantConditionArray.length)
        ) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0389));
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getFormattedText(
                LangConstants.TextType.F0158,
                redundantEventArray.length,
                redundantEventArray.length ? redundantEventArray.map(v => `E${v.getEventId()}`).join(`, `) : `----`,
                redundantNodeArray.length,
                redundantNodeArray.length ? redundantNodeArray.map(v => `N${v.getNodeId()}`).join(`, `) : `----`,
                redundantConditionArray.length,
                redundantConditionArray.length ? redundantConditionArray.map(v => `C${v.getWecCommonData()?.getConditionId()}`).join(`, `) : `----`,
                redundantActionArray.length,
                redundantActionArray.length ? redundantActionArray.map(v => `A${v.getWeaCommonData()?.getActionId()}`).join(`, `) : `----`,
            ),
            callback    : () => NormalMapModelNormalMapProxy.reqMmDeleteRedundantWarEvent(normalMapId),
        });
    }

    private _onTouchedBtnDeleteMap(): void {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0080),
            callback: () => {
                NormalMapModelNormalMapProxy.reqMmSetMapEnabled(normalMapId, false);
                this.closePanel();
            },
        });
    }

    private async _onTouchedBtnEditWarEvent(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapRawData = HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId));
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getText(LangConstants.TextType.A0391),
            callback    : () => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleMapEditorSlotPanel, {
                currentSlotIndex        : 0,
                needConfirmOverwrite    : true,
                needNonEmptySlot        : false,
                getHelpText             : null,
                callback                : slotIndex => {
                    MapEditorModelMeProxy.reqMeSubmitNormalMap({
                        slotIndex                   : slotIndex,
                        mapRawData                  : mapRawData,
                        needReview                  : false,
                        srcNormalMapIdForAddEvent   : normalMapId,
                        gridMarkData                : null,
                    });
                    HelpersGameFlow.gotoLobby();
                    FloatText2.show(LangUtils.getText(LangConstants.TextType.A0393));
                },
            }),
        });
    }

    private async _onTouchedBtnWarRule(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapRawData = await NormalMapModelNormalMapModel.getRawData(normalMapId);
        if (mapRawData == null) {
            throw HelpersMisc.newError(`MmCommandPanel._onTouchedBtnWarRule() empty mapRawData.`);
        }

        // GamePanels.openPanel(PanelHelpers.PanelDict.MmDeprecatedWarRulePanel, {
        //     mapRawData,
        // });
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0314),
            availableNumberArray    : [1, 2, 3],
            currentNumber           : null,
            getNumberMainText       : num => {
                switch (num) {
                    case 1  : return LangUtils.getText(LangConstants.TextType.B0320);
                    case 2  : return LangUtils.getText(LangConstants.TextType.B0317);
                    case 3  : return LangUtils.getText(LangConstants.TextType.B0220);
                    default : return LangConstants.UndefinedError;
                }
            },
            callbackOnConfirm       : async num => {
                const ruleArray = mapRawData.getTemplateWarRuleArray();

                if (num === 1) {
                    await generateHandler(
                        ruleArray,
                        () => LangUtils.getText(LangConstants.TextType.B1471),
                        async ruleId => GamePanelsManager.openPanel(GamePanelsDict.getDict().MmWarRulePanel, {
                            gcData          : await GameConfigGcModel.getLatestGameConfig(),
                            mapRawData      : mapRawData,
                            templateWarRule : HelpersMisc.getExisted(ruleArray.find(v => v.getRuleId() === ruleId)?.clone()),
                        })
                    )();

                } else if (num === 2) {
                    await generateHandler(
                        ruleArray,
                        () => LangUtils.getText(LangConstants.TextType.B0317),
                        ruleId => GamePanelsManager.openPanel(GamePanelsDict.getDict().MmModifyWarRulePanel, {
                            normalMapId         : normalMapId,
                            templateWarRuleId   : ruleId,
                        })
                    )();

                } else if (num === 3) {
                    if (ruleArray.length <= 1) {
                        FloatText2.showLang(LangConstants.TextType.A0978);
                        return;
                    }

                    await generateHandler(
                        ruleArray,
                        () => LangUtils.getText(LangConstants.TextType.B0220),
                        ruleId => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                            getContent     : () => LangUtils.getFormattedText(
                                LangConstants.TextType.F0265,
                                `#${ruleId}, ${LangUtils.getLanguageText({ textArray: ruleArray.find(v => v.getRuleId() === ruleId)?.getRuleNameArray()})}`
                            ),
                            callback       : () => NormalMapModelNormalMapProxy.reqMmDeleteWarRule(normalMapId, ruleId),
                        })
                    )();

                } else {
                    throw HelpersMisc.newError(`MmCommandPanel._onTouchedBtnWarRule() invalid command: ${num}.`);
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

        const mapRawData = await NormalMapModelNormalMapModel.getRawData(normalMapId);
        if (mapRawData == null) {
            return;
        }

        const currentGroupedMapTagId    = mapRawData.getMapTagIdFlags() ?? 0;
        const mapTag                    = await NormalMapModelNormalMapModel.getMapTag();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            availableNumberArray    : HelpersCollection.getNonNullElements(mapTag?.getMapTagDataArray()?.map(v => v.getIsEnabled() ? v.getMapTagId() : null) ?? []).sort((v1, v2) => v1 - v2),
            currentNumberArray      : MapTagsUtils.getDecodedMapTagIdList(currentGroupedMapTagId),
            showNumber              : true,
            getTitleText            : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.B0445)),
            getNumberMainText       : mapTagId => LangUtils.getLanguageText({ textArray: mapTag?.getMapTagDataArray()?.find(v => (v.getMapTagId() ?? 0) === mapTagId)?.getNameArray() }) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : newMapTagIdArray => {
                const newGroupedMapTagId = MapTagsUtils.getEncodedMapTagId(newMapTagIdArray);
                if (newGroupedMapTagId !== currentGroupedMapTagId) {
                    NormalMapModelNormalMapProxy.reqMmSetMapTagIdFlags(normalMapId, newGroupedMapTagId);
                }
            },
        });
    }

    private async _onTouchedBtnRename(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputShortLangTextPanel, {
            getTitleText        : () => LangUtils.getText(LangConstants.TextType.B0708),
            maxTextLength       : GameConfigGcMap.Constants.MaxNameLength,
            currentTextArray    : (await NormalMapModelNormalMapModel.getBriefData(normalMapId))?.getMapNameArray() ?? [],
            callback            : mapNameArray => NormalMapModelNormalMapProxy.reqMmSetMapName(normalMapId, mapNameArray),
        });
    }

    private async _updateComponentsForLanguage(): Promise<void> {
        this._btnDeleteRedundantEvent.setLangText(LangConstants.TextType.B1005);
        this._btnDeleteMap.setLangText(LangConstants.TextType.B0270);
        this._btnEditWarEvent.setLangText(LangConstants.TextType.B1099);
        this._btnWarRule.setLangText(LangConstants.TextType.B0314);
        this._btnRename.setLangText(LangConstants.TextType.B0708);
        this._btnMapTag.setLangText(LangConstants.TextType.B0445);
        this._updateLabelTitle();
    }
    private async _updateLabelTitle(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        this._labelTitle.setText(`#${normalMapId} ${await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId)}`);
    }
}

function generateHandler(
    ruleArray   : ProtoSchemaCommonProtoWarRuleTemplateWarRule.TemplateWarRule[],
    getTitleText: () => string,
    callback    : (ruleId: number) => void,
): () => Promise<void> {
    return async () => {
        await GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : getTitleText,
            availableNumberArray    : ruleArray.map(v => v.getRuleId()),
            currentNumber           : null,
            showNumber              : true,
            getNumberMainText       : ruleId => LangUtils.getLanguageText({ textArray: ruleArray.find(v => v.getRuleId() === ruleId)?.getRuleNameArray()}) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : callback,
        });
    };
}
