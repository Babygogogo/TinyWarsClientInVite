import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getIsTransparentTouchLayerTouched, setIsTransparentTouchLayerTouched } from "../../common/model/CommonModel.ts";
import { CoId } from "../../cos/Constants.ts";
import { showLang, show } from "../../FloatText.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { getMapEditorData } from "../../mapEditor/model/MeModel.ts";
import { convertAwbwMap } from "../../maps/utils/Common.ts";
import { getEnabledNormalMapIdSet, getRawData } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";

export interface OpenData {
    war     : IMeWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                              : IUiImage;
    private readonly _group!                                : IUiContainer;
    private readonly _btnClose!                             : IUiButton;
    private readonly _labelTitle!                           : IUiLabel;

    private readonly _btnImportMapFromPool!                 : IUiButton;
    private readonly _btnImportMapFromClipboard!            : IUiButton;
    private readonly _btnImportMapFromClipboardAwbw!        : IUiButton;
    private readonly _btnImportMapFromMapEditorSlot!        : IUiButton;
    private readonly _btnExportMapToClipboard!              : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                           callback: this.closePanel },
            { ui: this._btnImportMapFromPool,               callback: this._onTouchedBtnImportMapFromPool },
            { ui: this._btnImportMapFromClipboard,          callback: this._onTouchedBtnImportFromMapClipboard },
            { ui: this._btnImportMapFromClipboardAwbw,      callback: this._onTouchedBtnImportFromMapClipboardAwbw },
            { ui: this._btnImportMapFromMapEditorSlot,      callback: this._onTouchedBtnImportMapFromMapEditorSlot },
            { ui: this._btnExportMapToClipboard,            callback: this._onTouchedBtnExportMapToClipboard },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _onTouchedBtnImportMapFromPool(): Promise<void> {
        const war = this.getOpenData()?.war;
        openPanel(getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : [...await getEnabledNormalMapIdSet()],
            getTitleText                : () => getText(TextType.B0681),
            callback                    : async normalMapId => {
                openPanel(getDict().MeImportContentPanel, {
                    war             : war,
                    srcMapRawData   : getExisted(await getRawData(normalMapId)),
                });
            },
        });
        this.closePanel();
    }
    private async _onTouchedBtnImportFromMapClipboard(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback  = async () => {
            let text: string | undefined;
            try {
                window.focus();
                text = await navigator.clipboard.readText();
            } catch {
                showLang(TextType.A0275);
                return;
            }

            let mapRawData: MapRawData | undefined;
            try {
                mapRawData = MapRawData.fromJson(JSON.parse(text));
            } catch {
                showLang(TextType.A0784);
                return;
            }

            handleUnsupportedCoId(mapRawData, war.getGcData());
            openPanel(getDict().MeImportContentPanel, {
                war             : war,
                srcMapRawData   : mapRawData,
            });
            this.closePanel();
        };

        if (getIsTransparentTouchLayerTouched()) {
            callback();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            openPanel(getDict().CommonConfirmPanel, {
                getContent          : () => getText(TextType.A0979),
                getTextForConfirm   : () => getText(TextType.B0026),
                getTextForCancel    : () => getText(TextType.B0026),
                showButtonClose     : false,
                callback            : async () => {
                    setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
                callbackOnCancel    : async () => {
                    setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
            });
        }
    }
    private async _onTouchedBtnImportFromMapClipboardAwbw(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback  = async () => {
            let text: string | undefined;
            try {
                window.focus();
                text = await navigator.clipboard.readText();
            } catch {
                showLang(TextType.A0275);
                return;
            }

            let mapRawData: MapRawData | undefined;
            try {
                mapRawData = convertAwbwMap(text, war.getGcData());
            } catch {
                showLang(TextType.A0784);
                return;
            }

            if (mapRawData == null) {
                showLang(TextType.A0784);
                return;
            }

            handleUnsupportedCoId(mapRawData, war.getGcData());
            openPanel(getDict().MeImportContentPanel, {
                war             : war,
                srcMapRawData   : mapRawData,
            });
            this.closePanel();
        };

        if (getIsTransparentTouchLayerTouched()) {
            callback();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            openPanel(getDict().CommonConfirmPanel, {
                getContent          : () => getText(TextType.A0979),
                getTextForConfirm   : () => getText(TextType.B0026),
                getTextForCancel    : () => getText(TextType.B0026),
                showButtonClose     : false,
                callback            : async () => {
                    setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
                callbackOnCancel    : async () => {
                    setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
            });
        }
    }
    private _onTouchedBtnImportMapFromMapEditorSlot(): void {
        const war = this.getOpenData()?.war;
        openPanel(getDict().CommonChooseSingleMapEditorSlotPanel, {
            currentSlotIndex        : 0,
            needConfirmOverwrite    : false,
            needNonEmptySlot        : true,
            getHelpText             : null,
            callback                : async slotIndex => {
                openPanel(getDict().MeImportContentPanel, {
                    war             : war,
                    srcMapRawData   : getExisted((await getMapEditorData(slotIndex))?.mapRawData),
                });
            },
        });
        this.closePanel();
    }
    private async _onTouchedBtnExportMapToClipboard(): Promise<void> {
        const mapData = await this.getOpenData()?.war.serializeForMap();
        if (mapData == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback = async () => {
            try {
                window.focus();
                await navigator.clipboard.writeText(JSON.stringify(mapData.toJson()));
            } catch {
                showLang(TextType.A0275);
                return;
            }

            show(getText(TextType.A0235));
        };

        if (getIsTransparentTouchLayerTouched()) {
            callback();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            openPanel(getDict().CommonConfirmPanel, {
                getContent          : () => getText(TextType.A0979),
                getTextForConfirm   : () => getText(TextType.B0026),
                getTextForCancel    : () => getText(TextType.B0026),
                showButtonClose     : false,
                callback            : async () => {
                    setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
                callbackOnCancel    : async () => {
                    setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1252);
        this._btnImportMapFromPool.setLangText(TextType.B0681);
        this._btnImportMapFromClipboard.setLangText(TextType.B0313);
        this._btnImportMapFromClipboardAwbw.setText(`${getText(TextType.B0313)} (AWBW)`);
        this._btnImportMapFromMapEditorSlot.setLangText(TextType.B0126);
        this._btnExportMapToClipboard.setLangText(TextType.B0680);
    }
}

function handleUnsupportedCoId(mapRawData: MapRawData, gcData: GcData): void {
    {
        for (const data1 of mapRawData.getMapSimpleDialogueArray() ?? []) {
            for (const data2 of data1.getDataArray() ?? []) {
                const data = data2.getDataForCoDialogue();
                if (data) {
                    if (checkShouldModifyCoId(data.getCoId(), gcData)) {
                        data.setCoId(CoId.Empty);
                    }
                }
            }
        }
    }
    {
        for (const data1 of mapRawData.getTemplateWarRuleArray()) {
            for (const data2 of data1.getWarRuleCommonData()?.getPlayerRuleList() ?? []) {
                if (checkShouldModifyCoId(data2.getCcwAiCoId(), gcData)) {
                    data2.setCcwAiCoId(CoId.Empty);
                }
                if (checkShouldModifyCoId(data2.getSrwAiCoId(), gcData)) {
                    data2.setSrwAiCoId(CoId.Empty);
                }
                if (checkShouldModifyCoId(data2.getCampaignAiCoId(), gcData)) {
                    data2.setCampaignAiCoId(CoId.Empty);
                }
                {
                    const arr       = data2.getCampaignHumanCoIdArray();
                    const newArr    = arr.filter(coId => !checkShouldModifyCoId(coId, gcData));
                    if (newArr.length !== arr.length) {
                        data2.setCampaignHumanCoIdArray([...newArr, CoId.Empty]);
                    }
                }
            }
        }
    }
    {
        const warEventFullData = mapRawData.getWarEventFullData();
        for (const action of warEventFullData?.getActionArray() ?? []) {
            // nothing to do?
        }
        for (const condition of warEventFullData?.getConditionArray() ?? []) {
            // nothing to do?
        }
    }
}
function checkShouldModifyCoId(coId: Undefinable<number>, gcData: GcData): boolean {
    return (coId != null) && (!gcData.checkHasCo(coId));
}
