import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as CommonModelCommonModel from "../../common/model/CommonModel.ts";
import * as CosConstants from "../../cos/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as MapEditorModelMeModel from "../../mapEditor/model/MeModel.ts";
import * as MapsUtilsCommon from "../../maps/utils/Common.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";

type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export interface OpenData {
    war     : MapEditorInterfaceIMeWar.IMeWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!                             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTitle!                           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnImportMapFromPool!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnImportMapFromClipboard!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnImportMapFromClipboardAwbw!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnImportMapFromMapEditorSlot!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnExportMapToClipboard!              : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : [...await NormalMapModelNormalMapModel.getEnabledNormalMapIdSet()],
            getTitleText                : () => LangUtils.getText(LangConstants.TextType.B0681),
            callback                    : async normalMapId => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().MeImportContentPanel, {
                    war             : war,
                    srcMapRawData   : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId)),
                });
            },
        });
        this.closePanel();
    }
    private async _onTouchedBtnImportFromMapClipboard(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback  = async () => {
            let text: string | undefined;
            try {
                window.focus();
                text = await navigator.clipboard.readText();
            } catch {
                FloatText2.showLang(LangConstants.TextType.A0275);
                return;
            }

            let mapRawData: ProtoSchemaCommonProtoMapMapRawData.MapRawData | undefined;
            try {
                mapRawData = ProtoSchemaCommonProtoMapMapRawData.MapRawData.fromJson(JSON.parse(text));
            } catch {
                FloatText2.showLang(LangConstants.TextType.A0784);
                return;
            }

            handleUnsupportedCoId(mapRawData, war.getGcData());
            GamePanelsManager.openPanel(GamePanelsDict.getDict().MeImportContentPanel, {
                war             : war,
                srcMapRawData   : mapRawData,
            });
            this.closePanel();
        };

        if (CommonModelCommonModel.getIsTransparentTouchLayerTouched()) {
            callback();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent          : () => LangUtils.getText(LangConstants.TextType.A0979),
                getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B0026),
                getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B0026),
                showButtonClose     : false,
                callback            : async () => {
                    CommonModelCommonModel.setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
                callbackOnCancel    : async () => {
                    CommonModelCommonModel.setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
            });
        }
    }
    private async _onTouchedBtnImportFromMapClipboardAwbw(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback  = async () => {
            let text: string | undefined;
            try {
                window.focus();
                text = await navigator.clipboard.readText();
            } catch {
                FloatText2.showLang(LangConstants.TextType.A0275);
                return;
            }

            let mapRawData: ProtoSchemaCommonProtoMapMapRawData.MapRawData | undefined;
            try {
                mapRawData = MapsUtilsCommon.convertAwbwMap(text, war.getGcData());
            } catch {
                FloatText2.showLang(LangConstants.TextType.A0784);
                return;
            }

            if (mapRawData == null) {
                FloatText2.showLang(LangConstants.TextType.A0784);
                return;
            }

            handleUnsupportedCoId(mapRawData, war.getGcData());
            GamePanelsManager.openPanel(GamePanelsDict.getDict().MeImportContentPanel, {
                war             : war,
                srcMapRawData   : mapRawData,
            });
            this.closePanel();
        };

        if (CommonModelCommonModel.getIsTransparentTouchLayerTouched()) {
            callback();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent          : () => LangUtils.getText(LangConstants.TextType.A0979),
                getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B0026),
                getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B0026),
                showButtonClose     : false,
                callback            : async () => {
                    CommonModelCommonModel.setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
                callbackOnCancel    : async () => {
                    CommonModelCommonModel.setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
            });
        }
    }
    private _onTouchedBtnImportMapFromMapEditorSlot(): void {
        const war = this.getOpenData()?.war;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleMapEditorSlotPanel, {
            currentSlotIndex        : 0,
            needConfirmOverwrite    : false,
            needNonEmptySlot        : true,
            getHelpText             : null,
            callback                : async slotIndex => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().MeImportContentPanel, {
                    war             : war,
                    srcMapRawData   : HelpersMisc.getExisted((await MapEditorModelMeModel.getMapEditorData(slotIndex))?.mapRawData),
                });
            },
        });
        this.closePanel();
    }
    private async _onTouchedBtnExportMapToClipboard(): Promise<void> {
        const mapData = await this.getOpenData()?.war.serializeForMap();
        if (mapData == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback = async () => {
            try {
                window.focus();
                await navigator.clipboard.writeText(JSON.stringify(mapData.toJson()));
            } catch {
                FloatText2.showLang(LangConstants.TextType.A0275);
                return;
            }

            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0235));
        };

        if (CommonModelCommonModel.getIsTransparentTouchLayerTouched()) {
            callback();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent          : () => LangUtils.getText(LangConstants.TextType.A0979),
                getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B0026),
                getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B0026),
                showButtonClose     : false,
                callback            : async () => {
                    CommonModelCommonModel.setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
                callbackOnCancel    : async () => {
                    CommonModelCommonModel.setIsTransparentTouchLayerTouched(true);
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
        this._labelTitle.setLangText(LangConstants.TextType.B1252);
        this._btnImportMapFromPool.setLangText(LangConstants.TextType.B0681);
        this._btnImportMapFromClipboard.setLangText(LangConstants.TextType.B0313);
        this._btnImportMapFromClipboardAwbw.setText(`${LangUtils.getText(LangConstants.TextType.B0313)} (AWBW)`);
        this._btnImportMapFromMapEditorSlot.setLangText(LangConstants.TextType.B0126);
        this._btnExportMapToClipboard.setLangText(LangConstants.TextType.B0680);
    }
}

function handleUnsupportedCoId(mapRawData: ProtoSchemaCommonProtoMapMapRawData.MapRawData, gcData: GameConfigGcData.GcData): void {
    {
        for (const data1 of mapRawData.getMapSimpleDialogueArray() ?? []) {
            for (const data2 of data1.getDataArray() ?? []) {
                const data = data2.getDataForCoDialogue();
                if (data) {
                    if (checkShouldModifyCoId(data.getCoId(), gcData)) {
                        data.setCoId(CosConstants.CoId.Empty);
                    }
                }
            }
        }
    }
    {
        for (const data1 of mapRawData.getTemplateWarRuleArray()) {
            for (const data2 of data1.getWarRuleCommonData()?.getPlayerRuleList() ?? []) {
                if (checkShouldModifyCoId(data2.getCcwAiCoId(), gcData)) {
                    data2.setCcwAiCoId(CosConstants.CoId.Empty);
                }
                if (checkShouldModifyCoId(data2.getSrwAiCoId(), gcData)) {
                    data2.setSrwAiCoId(CosConstants.CoId.Empty);
                }
                if (checkShouldModifyCoId(data2.getCampaignAiCoId(), gcData)) {
                    data2.setCampaignAiCoId(CosConstants.CoId.Empty);
                }
                {
                    const arr       = data2.getCampaignHumanCoIdArray();
                    const newArr    = arr.filter(coId => !checkShouldModifyCoId(coId, gcData));
                    if (newArr.length !== arr.length) {
                        data2.setCampaignHumanCoIdArray([...newArr, CosConstants.CoId.Empty]);
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
function checkShouldModifyCoId(coId: Undefinable<number>, gcData: GameConfigGcData.GcData): boolean {
    return (coId != null) && (!gcData.checkHasCo(coId));
}
