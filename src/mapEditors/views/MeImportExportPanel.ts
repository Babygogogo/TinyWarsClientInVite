import {
    Cos_Constants,
    Maps_Utils_Common,
    GamePanels_Dict,
    NormalMap_Model_NormalMapModel,
    Helpers_Misc,
    Common_Model_CommonModel,
    MapEditor_Model_MeModel,
    Lang_Utils,
    GamePanels_Manager,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type GameConfigs_GameConfig,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";

export interface OpenData {
    war     : MapEditor_Interface_IMeWar.IMeWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!                             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTitle!                           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnImportMapFromPool!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnImportMapFromClipboard!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnImportMapFromClipboardAwbw!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnImportMapFromMapEditorSlot!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnExportMapToClipboard!              : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : [...await NormalMap_Model_NormalMapModel.getEnabledNormalMapIdSet()],
            getTitleText                : () => Lang_Utils.getText(Lang_Constants.TextType.B0681),
            callback                    : async normalMapId => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeImportContentPanel, {
                    war             : war,
                    srcMapRawData   : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId)),
                });
            },
        });
        this.closePanel();
    }
    private async _onTouchedBtnImportFromMapClipboard(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback  = async () => {
            let text: string | undefined;
            try {
                window.focus();
                text = await navigator.clipboard.readText();
            } catch {
                FloatText.showLang(Lang_Constants.TextType.A0275);
                return;
            }

            let mapRawData: MapRawData | undefined;
            try {
                mapRawData = MapRawData.fromJson(JSON.parse(text));
            } catch {
                FloatText.showLang(Lang_Constants.TextType.A0784);
                return;
            }

            handleUnsupportedCoId(mapRawData, war.getGcData());
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeImportContentPanel, {
                war             : war,
                srcMapRawData   : mapRawData,
            });
            this.closePanel();
        };

        if (Common_Model_CommonModel.getIsTransparentTouchLayerTouched()) {
            callback();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent          : () => Lang_Utils.getText(Lang_Constants.TextType.A0979),
                getTextForConfirm   : () => Lang_Utils.getText(Lang_Constants.TextType.B0026),
                getTextForCancel    : () => Lang_Utils.getText(Lang_Constants.TextType.B0026),
                showButtonClose     : false,
                callback            : async () => {
                    Common_Model_CommonModel.setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
                callbackOnCancel    : async () => {
                    Common_Model_CommonModel.setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
            });
        }
    }
    private async _onTouchedBtnImportFromMapClipboardAwbw(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback  = async () => {
            let text: string | undefined;
            try {
                window.focus();
                text = await navigator.clipboard.readText();
            } catch {
                FloatText.showLang(Lang_Constants.TextType.A0275);
                return;
            }

            let mapRawData: MapRawData | undefined;
            try {
                mapRawData = Maps_Utils_Common.convertAwbwMap(text, war.getGcData());
            } catch {
                FloatText.showLang(Lang_Constants.TextType.A0784);
                return;
            }

            if (mapRawData == null) {
                FloatText.showLang(Lang_Constants.TextType.A0784);
                return;
            }

            handleUnsupportedCoId(mapRawData, war.getGcData());
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeImportContentPanel, {
                war             : war,
                srcMapRawData   : mapRawData,
            });
            this.closePanel();
        };

        if (Common_Model_CommonModel.getIsTransparentTouchLayerTouched()) {
            callback();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent          : () => Lang_Utils.getText(Lang_Constants.TextType.A0979),
                getTextForConfirm   : () => Lang_Utils.getText(Lang_Constants.TextType.B0026),
                getTextForCancel    : () => Lang_Utils.getText(Lang_Constants.TextType.B0026),
                showButtonClose     : false,
                callback            : async () => {
                    Common_Model_CommonModel.setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
                callbackOnCancel    : async () => {
                    Common_Model_CommonModel.setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
            });
        }
    }
    private _onTouchedBtnImportMapFromMapEditorSlot(): void {
        const war = this.getOpenData()?.war;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleMapEditorSlotPanel, {
            currentSlotIndex        : 0,
            needConfirmOverwrite    : false,
            needNonEmptySlot        : true,
            getHelpText             : null,
            callback                : async slotIndex => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeImportContentPanel, {
                    war             : war,
                    srcMapRawData   : Helpers_Misc.getExisted((await MapEditor_Model_MeModel.getMapEditorData(slotIndex))?.mapRawData),
                });
            },
        });
        this.closePanel();
    }
    private async _onTouchedBtnExportMapToClipboard(): Promise<void> {
        const mapData = await this.getOpenData()?.war.serializeForMap();
        if (mapData == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const callback = async () => {
            try {
                window.focus();
                await navigator.clipboard.writeText(JSON.stringify(mapData.toJson()));
            } catch {
                FloatText.showLang(Lang_Constants.TextType.A0275);
                return;
            }

            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0235));
        };

        if (Common_Model_CommonModel.getIsTransparentTouchLayerTouched()) {
            callback();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent          : () => Lang_Utils.getText(Lang_Constants.TextType.A0979),
                getTextForConfirm   : () => Lang_Utils.getText(Lang_Constants.TextType.B0026),
                getTextForCancel    : () => Lang_Utils.getText(Lang_Constants.TextType.B0026),
                showButtonClose     : false,
                callback            : async () => {
                    Common_Model_CommonModel.setIsTransparentTouchLayerTouched(true);
                    await callback();
                },
                callbackOnCancel    : async () => {
                    Common_Model_CommonModel.setIsTransparentTouchLayerTouched(true);
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B1252);
        this._btnImportMapFromPool.setLangText(Lang_Constants.TextType.B0681);
        this._btnImportMapFromClipboard.setLangText(Lang_Constants.TextType.B0313);
        this._btnImportMapFromClipboardAwbw.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0313)} (AWBW)`);
        this._btnImportMapFromMapEditorSlot.setLangText(Lang_Constants.TextType.B0126);
        this._btnExportMapToClipboard.setLangText(Lang_Constants.TextType.B0680);
    }
}

function handleUnsupportedCoId(mapRawData: MapRawData, gcData: GameConfigs_GameConfig.GameConfig): void {
    {
        for (const data1 of mapRawData.getMapSimpleDialogueArray()) {
            for (const data2 of data1.getDataArray()) {
                const data = data2.getDataForCoDialogue();
                if (data) {
                    if (checkShouldModifyCoId(data.getCoId(), gcData)) {
                        data.setCoId(Cos_Constants.CoId.Empty);
                    }
                }
            }
        }
    }
    {
        for (const data1 of mapRawData.getTemplateWarRuleArray()) {
            for (const data2 of data1.getWarRuleCommonData()?.getPlayerRuleList() ?? []) {
                if (checkShouldModifyCoId(data2.getCcwAiCoId(), gcData)) {
                    data2.setCcwAiCoId(Cos_Constants.CoId.Empty);
                }
                if (checkShouldModifyCoId(data2.getSrwAiCoId(), gcData)) {
                    data2.setSrwAiCoId(Cos_Constants.CoId.Empty);
                }
                if (checkShouldModifyCoId(data2.getCampaignAiCoId(), gcData)) {
                    data2.setCampaignAiCoId(Cos_Constants.CoId.Empty);
                }
                {
                    const arr       = data2.getCampaignHumanCoIdArray();
                    const newArr    = arr.filter(coId => !checkShouldModifyCoId(coId, gcData));
                    if (newArr.length !== arr.length) {
                        data2.setCampaignHumanCoIdArray([...newArr, Cos_Constants.CoId.Empty]);
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
function checkShouldModifyCoId(coId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>, gcData: GameConfigs_GameConfig.GameConfig): boolean {
    return (coId != null) && (!gcData.checkHasCo(coId));
}
