import { show, showLang } from "../../FloatText.ts";
import { Common } from "../../maps/Constants.ts";
import { getLatestGameConfig } from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { gotoLobby } from "../../helpers/GameFlow.ts";
import { newError, getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getFormattedText, getLanguageText } from "../../lang/Utils.ts";
import { reqMeSubmitNormalMap } from "../../mapEditor/model/MeProxy.ts";
import { getDecodedMapTagIdList, getEncodedMapTagId } from "../../mapTags/Utils.ts";
import { getRawData, getMapTag, getBriefData, getMapNameInCurrentLanguage } from "../../normalMap/model/NormalMapModel.ts";
import {
    reqMmDeleteRedundantWarEvent,
    reqMmSetMapEnabled,
    reqMmDeleteWarRule,
    reqMmSetMapTagIdFlags,
    reqMmSetMapName,
} from "../../normalMap/model/NormalMapProxy.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import { checkIsEmptyWarEventFullData, trimWarEventFullData } from "../../warEvents/fullDatas/Utils.ts";

export interface OpenData {
    normalMapId   : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;

    private readonly _btnDeleteRedundantEvent!  : IUiButton;
    private readonly _btnDeleteMap!             : IUiButton;
    private readonly _btnWarRule!               : IUiButton;
    private readonly _btnRename!                : IUiButton;
    private readonly _btnEditWarEvent!          : IUiButton;
    private readonly _btnMapTag!                : IUiButton;
    private readonly _btnClose!                 : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgMmSetMapTagIdFlags,           callback: this._onNotifyMsgMmSetMapTagIdFlags },
            { type: TypeId.MsgMmDeleteRedundantWarEvent,    callback: this._onNotifyMsgMmDeleteRedundantWarEvent },
            { type: TypeId.MsgMmSetMapName,                 callback: this._onNotifyMsgMmSetMapName },
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
        show(getText(TextType.A0151));
    }
    private _onNotifyMsgMmDeleteRedundantWarEvent(): void {
        show(getText(TextType.OperationSucceeded));
    }
    private _onNotifyMsgMmSetMapName(): void {
        showLang(TextType.OperationSucceeded);
        this._updateLabelTitle();
    }

    private async _onTouchedBtnDeleteRedundantEvent(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapRawData = await getRawData(normalMapId);
        if (mapRawData == null) {
            throw newError(`No mapRawData: ${normalMapId}.`);
        }

        const srcWarEventFullData = mapRawData.getWarEventFullData();
        if ((srcWarEventFullData == null) || (checkIsEmptyWarEventFullData(srcWarEventFullData))) {
            show(getText(TextType.A0389));
            return;
        }

        const warEventIdSet = new Set<number>();
        for (const warRule of mapRawData.getTemplateWarRuleArray()) {
            for (const warEventId of warRule.getWarEventIdArray()) {
                warEventIdSet.add(warEventId);
            }
        }

        const newWarEventFullData       = trimWarEventFullData(srcWarEventFullData, [...warEventIdSet], false);
        const newActionIdSet            = new Set(newWarEventFullData.getActionArray().map(v => getExisted(v.getWeaCommonData()?.getActionId())));
        const redundantActionArray      = srcWarEventFullData.getActionArray().filter(v => !newActionIdSet.has(getExisted(v.getWeaCommonData()?.getActionId()))) ?? [];
        const newEventIdSet             = new Set(newWarEventFullData.getEventArray().map(v => getExisted(v.getEventId())));
        const redundantEventArray       = srcWarEventFullData.getEventArray().filter(v => !newEventIdSet.has(getExisted(v.getEventId()))) ?? [];
        const newNodeIdSet              = new Set(newWarEventFullData.getConditionNodeArray().map(v => getExisted(v.getNodeId())));
        const redundantNodeArray        = srcWarEventFullData.getConditionNodeArray().filter(v => !newNodeIdSet.has(getExisted(v.getNodeId()))) ?? [];
        const newConditionIdSet         = new Set(newWarEventFullData.getConditionArray()?.map(v => getExisted(v.getWecCommonData()?.getConditionId())));
        const redundantConditionArray   = srcWarEventFullData.getConditionArray().filter(v => !newConditionIdSet.has(getExisted(v.getWecCommonData()?.getConditionId()))) ?? [];

        if ((!redundantActionArray.length)      &&
            (!redundantEventArray.length)       &&
            (!redundantNodeArray.length)        &&
            (!redundantConditionArray.length)
        ) {
            show(getText(TextType.A0389));
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getFormattedText(
                TextType.F0158,
                redundantEventArray.length,
                redundantEventArray.length ? redundantEventArray.map(v => `E${v.getEventId()}`).join(`, `) : `----`,
                redundantNodeArray.length,
                redundantNodeArray.length ? redundantNodeArray.map(v => `N${v.getNodeId()}`).join(`, `) : `----`,
                redundantConditionArray.length,
                redundantConditionArray.length ? redundantConditionArray.map(v => `C${v.getWecCommonData()?.getConditionId()}`).join(`, `) : `----`,
                redundantActionArray.length,
                redundantActionArray.length ? redundantActionArray.map(v => `A${v.getWeaCommonData()?.getActionId()}`).join(`, `) : `----`,
            ),
            callback    : () => reqMmDeleteRedundantWarEvent(normalMapId),
        });
    }

    private _onTouchedBtnDeleteMap(): void {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0080),
            callback: () => {
                reqMmSetMapEnabled(normalMapId, false);
                this.closePanel();
            },
        });
    }

    private async _onTouchedBtnEditWarEvent(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapRawData = getExisted(await getRawData(normalMapId));
        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getText(TextType.A0391),
            callback    : () => openPanel(getDict().CommonChooseSingleMapEditorSlotPanel, {
                currentSlotIndex        : 0,
                needConfirmOverwrite    : true,
                needNonEmptySlot        : false,
                getHelpText             : null,
                callback                : slotIndex => {
                    reqMeSubmitNormalMap({
                        slotIndex                   : slotIndex,
                        mapRawData                  : mapRawData,
                        needReview                  : false,
                        srcNormalMapIdForAddEvent   : normalMapId,
                        gridMarkData                : null,
                    });
                    gotoLobby();
                    show(getText(TextType.A0393));
                },
            }),
        });
    }

    private async _onTouchedBtnWarRule(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapRawData = await getRawData(normalMapId);
        if (mapRawData == null) {
            throw newError(`MmCommandPanel._onTouchedBtnWarRule() empty mapRawData.`);
        }

        // GamePanels.openPanel(PanelHelpers.PanelDict.MmDeprecatedWarRulePanel, {
        //     mapRawData,
        // });
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : () => getText(TextType.B0314),
            availableNumberArray    : [1, 2, 3],
            currentNumber           : null,
            getNumberMainText       : num => {
                switch (num) {
                    case 1  : return getText(TextType.B0320);
                    case 2  : return getText(TextType.B0317);
                    case 3  : return getText(TextType.B0220);
                    default : return UndefinedError;
                }
            },
            callbackOnConfirm       : async num => {
                const ruleArray = mapRawData.getTemplateWarRuleArray();

                if (num === 1) {
                    await generateHandler(
                        ruleArray,
                        () => getText(TextType.B1471),
                        async ruleId => openPanel(getDict().MmWarRulePanel, {
                            gcData          : await getLatestGameConfig(),
                            mapRawData      : mapRawData,
                            templateWarRule : getExisted(ruleArray.find(v => v.getRuleId() === ruleId)?.clone()),
                        })
                    )();

                } else if (num === 2) {
                    await generateHandler(
                        ruleArray,
                        () => getText(TextType.B0317),
                        ruleId => openPanel(getDict().MmModifyWarRulePanel, {
                            normalMapId         : normalMapId,
                            templateWarRuleId   : ruleId,
                        })
                    )();

                } else if (num === 3) {
                    if (ruleArray.length <= 1) {
                        showLang(TextType.A0978);
                        return;
                    }

                    await generateHandler(
                        ruleArray,
                        () => getText(TextType.B0220),
                        ruleId => openPanel(getDict().CommonConfirmPanel, {
                            getContent     : () => getFormattedText(
                                TextType.F0265,
                                `#${ruleId}, ${getLanguageText({ textArray: ruleArray.find(v => v.getRuleId() === ruleId)?.getRuleNameArray()})}`
                            ),
                            callback       : () => reqMmDeleteWarRule(normalMapId, ruleId),
                        })
                    )();

                } else {
                    throw newError(`MmCommandPanel._onTouchedBtnWarRule() invalid command: ${num}.`);
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

        const mapRawData = await getRawData(normalMapId);
        if (mapRawData == null) {
            return;
        }

        const currentGroupedMapTagId    = mapRawData.getMapTagIdFlags() ?? 0;
        const mapTag                    = await getMapTag();
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            availableNumberArray    : getNonNullElements(mapTag?.getMapTagDataArray()?.map(v => v.getIsEnabled() ? v.getMapTagId() : null) ?? []).sort((v1, v2) => v1 - v2),
            currentNumberArray      : getDecodedMapTagIdList(currentGroupedMapTagId),
            showNumber              : true,
            getTitleText            : () => getFormattedText(TextType.F0092, getText(TextType.B0445)),
            getNumberMainText       : mapTagId => getLanguageText({ textArray: mapTag?.getMapTagDataArray()?.find(v => (v.getMapTagId() ?? 0) === mapTagId)?.getNameArray() }) ?? UndefinedError,
            callbackOnConfirm       : newMapTagIdArray => {
                const newGroupedMapTagId = getEncodedMapTagId(newMapTagIdArray);
                if (newGroupedMapTagId !== currentGroupedMapTagId) {
                    reqMmSetMapTagIdFlags(normalMapId, newGroupedMapTagId);
                }
            },
        });
    }

    private async _onTouchedBtnRename(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        openPanel(getDict().CommonInputShortLangTextPanel, {
            getTitleText        : () => getText(TextType.B0708),
            maxTextLength       : Common.MaxNameLength,
            currentTextArray    : (await getBriefData(normalMapId))?.getMapNameArray() ?? [],
            callback            : mapNameArray => reqMmSetMapName(normalMapId, mapNameArray),
        });
    }

    private async _updateComponentsForLanguage(): Promise<void> {
        this._btnDeleteRedundantEvent.setLangText(TextType.B1005);
        this._btnDeleteMap.setLangText(TextType.B0270);
        this._btnEditWarEvent.setLangText(TextType.B1099);
        this._btnWarRule.setLangText(TextType.B0314);
        this._btnRename.setLangText(TextType.B0708);
        this._btnMapTag.setLangText(TextType.B0445);
        this._updateLabelTitle();
    }
    private async _updateLabelTitle(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        this._labelTitle.setText(`#${normalMapId} ${await getMapNameInCurrentLanguage(normalMapId)}`);
    }
}

function generateHandler(
    ruleArray   : TemplateWarRule[],
    getTitleText: () => string,
    callback    : (ruleId: number) => void,
): () => Promise<void> {
    return async () => {
        await closePanel(getDict().CommonChooseSingleNumberPanel);
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            getTitleText            : getTitleText,
            availableNumberArray    : ruleArray.map(v => v.getRuleId()),
            currentNumber           : null,
            showNumber              : true,
            getNumberMainText       : ruleId => getLanguageText({ textArray: ruleArray.find(v => v.getRuleId() === ruleId)?.getRuleNameArray()}) ?? UndefinedError,
            callbackOnConfirm       : callback,
        });
    };
}
