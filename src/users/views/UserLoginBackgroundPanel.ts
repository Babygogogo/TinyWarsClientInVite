import {
    Graphics_Utils,
    Helpers_Gzip,
    Notifications_Dispatcher,
    Tween_Executor,
    Lang_Utils,
    GamePanels_Dict,
    Common_Model_CommonModel,
    LocalData_Storage,
    Sounds_SoundPlayer,
    Helpers_Compatibility,
    Lang_Constants,
    Helpers_PointerInput,
    GamePanels_Manager,
    Users_Proxy,
    FloatText,
    LocalData_DeprecatedStorage,
    Graphics_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Timer_TimerModel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import { MapEditorData } from "../../proto/schema/CommonProto/Map/MapEditorData.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBackground!        : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupTopLeft!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnGuest!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnTutorial!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupTopRight!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnLandscape!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnExportMapCache!    : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupRightButton!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnVersion!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSound!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelVersion!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listLanguage!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForLanguageRenderer>;
    private readonly _groupUnits!           : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _groupCopyright!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelWebGl!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPrivacy!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupCopyright1!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelCopyright0!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCopyright1!      : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.UnitAnimationTick,              callback : this._onNotifyUnitAnimationTick },
            { type : Notifications_TypeId.TypeId.MsgCommonLatestConfigVersion,   callback : this._onMsgCommonLatestConfigVersion },
        ]);
        this._setUiListenerArray([
            { ui : this._group,              callback : this._onTouchedSelf,          mouseStyle : Helpers_PointerInput.MouseStyleType.Default },
            { ui : this._btnGuest,           callback : this._onTouchedBtnGuest },
            { ui : this._btnTutorial,        callback : this._onTouchedBtnTutorial },
            { ui : this._btnLandscape,       callback : this._onTouchedBtnLandscape },
            { ui : this._btnExportMapCache,  callback : this._onTouchedBtnExportMapCache },
            { ui : this._btnVersion,         callback : this._onTouchedBtnVersion },
            { ui : this._btnSound,           callback : this._onTouchedBtnSound },
        ]);
        this._listLanguage.setItemRendererClass(LanguageRenderer);

        this._imgBackground.setIsTouchEnabled(true);

        this._updateComponentsForLanguage();
        this._initListLanguage();
        this._labelWebGl.setIsVisible(!Graphics_Utils.checkIsWebGl());

        // if (Config.ConfigManager.getLatestConfigVersion()) {
        //     this._initGroupUnits();
        // }
    }
    protected override async _doApplyOpenData(): Promise<void> {
        if (LocalData_Storage.getShowExportMapCachePopup()) {
            if (!await checkHasMapCache()) {
                LocalData_Storage.setShowExportMapCachePopup(false);
            } else {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getTitle         : () => Lang_Utils.getText(Lang_Constants.TextType.B1470),
                    getContent       : () => Lang_Utils.getText(Lang_Constants.TextType.A0971),
                    callback         : () => openPanelForExportMapCache(),
                    callbackOnCancel : () => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                        getTitle         : () => Lang_Utils.getText(Lang_Constants.TextType.B1470),
                        getContent       : () => Lang_Utils.getText(Lang_Constants.TextType.A0972),
                        callback         : () => openPanelForExportMapCache(),
                        callbackOnCancel : () => LocalData_Storage.setShowExportMapCachePopup(false),
                    }),
                });
            }
        }
    }
    protected override async _onClosed(): Promise<void> {
        await this._listLanguage.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyUnitAnimationTick(): void {
        // const group = this._groupUnits;
        // const tick  = Common.CommonModel.getUnitAnimationTickCount();
        // for (let i = group.numChildren - 1; i >= 0; --i) {
        //     ((group.getChildAt(i) as eui.Component).getChildAt(0) as Common.CommonMapUnitView).updateOnAnimationTick(tick);
        // }
    }
    private _onMsgCommonLatestConfigVersion(): void {
        // this._initGroupUnits();
    }
    private _onTouchedSelf(): void {
        Sounds_SoundPlayer.init();
    }
    private _onTouchedBtnGuest(): void {
        Users_Proxy.reqUserLoginAsGuest(null, false);
    }
    private _onTouchedBtnTutorial(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonTutorialPanel, void 0);
    }
    private _onTouchedBtnLandscape(): void {
        const inject = window.TW_APK_INJECT;
        if (inject == null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => Lang_Utils.getText(Helpers_Compatibility.isPc ? Lang_Constants.TextType.A0416 : Lang_Constants.TextType.A0417),
            });
        } else {
            let currentRotation: number | null = null;
            try {
                currentRotation = inject.getScreenOrientation();
            } catch {
                FloatText.showLang(Lang_Constants.TextType.A0840);
                return;
            }

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
                getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B0159),
                currentNumber        : currentRotation,
                availableNumberArray : [0, 1, 2, 3],
                getNumberMainText    : num => {
                    switch (num) {
                        case 0  : return Lang_Utils.getText(Lang_Constants.TextType.B0377);
                        case 1  : return Lang_Utils.getText(Lang_Constants.TextType.B0419);
                        case 2  : return Lang_Utils.getText(Lang_Constants.TextType.B0591);
                        case 3  : return Lang_Utils.getText(Lang_Constants.TextType.B0597);
                        default : return Lang_Constants.UndefinedError;
                    }
                },
                callbackOnConfirm : num => {
                    try {
                        LocalData_Storage.setScreenRotation(num);
                        inject.setScreenOrientation(num);
                    } catch {
                        FloatText.showLang(Lang_Constants.TextType.A0841);
                    }
                },
            });
        }
    }
    private _onTouchedBtnExportMapCache(): void {
        openPanelForExportMapCache();
    }
    private _onTouchedBtnVersion(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChangeVersionPanel, void 0);
    }
    private _onTouchedBtnSound(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SoundsSettingsPanel, void 0);
    }

    private _updateComponentsForLanguage(): void {
        this._btnGuest.setLangText(Lang_Constants.TextType.B0982);
        this._btnLandscape.setLangText(Lang_Constants.TextType.B0159);
        this._btnExportMapCache.setLangText(Lang_Constants.TextType.B1470);
        this._btnVersion.setLangText(Lang_Constants.TextType.B0620);
        this._btnSound.setLangText(Lang_Constants.TextType.B0540);
        this._btnTutorial.setLangText(Lang_Constants.TextType.B0978);
        this._labelWebGl.setLangText(Lang_Constants.TextType.A0736);
        this._labelPrivacy.setLangText(Lang_Constants.TextType.A0733);
        this._labelCopyright0.setLangText(Lang_Constants.TextType.A0734);
        this._labelCopyright1.setLangText(Lang_Constants.TextType.A0735);
        this._labelVersion.setText(`${Lang_Utils.getGameVersionName(window.GAME_VERSION)}\nv.${window.CLIENT_VERSION}`);
        this._groupCopyright1.arrangeItems();
        this._groupCopyright.arrangeItems();
    }
    private async _initListLanguage(): Promise<void> {
        const listLanguage  = this._listLanguage;
        const languageType  = Lang_Utils.getCurrentLanguageType();
        const dataArray     : DataForLanguageRenderer[] = [
            { languageType : Lang_Constants.LanguageType.Chinese },
            { languageType : Lang_Constants.LanguageType.English },
            { languageType : Lang_Constants.LanguageType.Spanish },
        ];
        await listLanguage.bindData(dataArray);
        listLanguage.setSelectedItemIndexes([dataArray.findIndex(v => v.languageType === languageType)]);
    }

    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._imgBackground,
            beginProps : { customAlpha : 0 },
            endProps   : { customAlpha : 1 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTopLeft,
            waitTime   : 1400,
            beginProps : { customX : -40, customAlpha : 0 },
            endProps   : { customX : 0, customAlpha : 1 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._listLanguage,
            waitTime   : 1400,
            beginProps : { customX : -40, customAlpha : 0 },
            endProps   : { customX : 0, customAlpha : 1 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTopRight,
            waitTime   : 1500,
            beginProps : { customX : 40, customAlpha : 0 },
            endProps   : { customX : 0, customAlpha : 1 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupRightButton,
            waitTime   : 1500,
            beginProps : { customX : 40, customAlpha : 0 },
            endProps   : { customX : 0, customAlpha : 1 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._labelVersion,
            waitTime   : 1600,
            beginProps : { customAlpha : 0 },
            endProps   : { customAlpha : 1 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupCopyright,
            beginProps : { customAlpha : 0 },
            endProps   : { customAlpha : 1 },
            waitTime   : 1700,
        });

        await Timer_TimerModel.wait(1700 + Graphics_Constants.Tween.DefaultDuration);
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._imgBackground,
            beginProps : { customAlpha : 1 },
            endProps   : { customAlpha : 0 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTopLeft,
            beginProps : { customX : 0, customAlpha : 1 },
            endProps   : { customX : -40, customAlpha : 0 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._listLanguage,
            beginProps : { customX : 0, customAlpha : 1 },
            endProps   : { customX : -40, customAlpha : 0 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._labelVersion,
            beginProps : { customAlpha : 1 },
            endProps   : { customAlpha : 0 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTopRight,
            beginProps : { customX : 0, customAlpha : 1 },
            endProps   : { customX : 40, customAlpha : 0 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupRightButton,
            beginProps : { customX : 0, customAlpha : 1 },
            endProps   : { customX : 40, customAlpha : 0 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupCopyright,
            beginProps : { customAlpha : 1 },
            endProps   : { customAlpha : 0 },
        });

        await Timer_TimerModel.wait();
    }

    // private _initGroupUnits(): void {
    //     this._clearGroupUnits();

    //     const group     = this._groupUnits;
    //     const gridWidth = ConfigManager.getGridSize().width;
    //     const count     = Math.ceil(group.width / gridWidth);
    //     for (let i = 0; i < count; ++i) {
    //         group.addChild(_createRandomUnitView());
    //     }

    //     group.x = 0;
    //     AuxiliaryHelpers.Tween.get(group, { loop: true })
    //         .to({ customX: -gridWidth / 4 }, 500)
    //         .call(() => {
    //             group.x = 0;
    //             group.removeChildAt(0);
    //             group.addChild(_createRandomUnitView());
    //         });
    // }
    private _clearGroupUnits(): void {
        this._groupUnits.removeUiChildren();
        Tween_Executor.Executor.removeTweens(this._groupUnits);
    }
}

interface DataForLanguageRenderer extends Ui_Types_UiListItemData.UiListItemData {
    languageType: Lang_Constants.LanguageType;
}
class LanguageRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForLanguageRenderer> {
    private readonly _labelLanguage!    : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);

        this._applySettingsForWholeTouch();
    }
    protected override _doApplyOpenData(): void {
        const languageType = this.getOpenData()?.languageType;
        if (languageType == null) {
            return;
        }

        this._labelLanguage.setText(Lang_Utils.getLanguageTypeName(languageType) || `??`);

        this._updateCurrentState();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateCurrentState();
    }

    public onItemTapEvent(): void {
        const languageType = this.getOpenData()?.languageType;
        if (languageType == null) {
            return;
        }

        if (Lang_Utils.getCurrentLanguageType() !== languageType) {
            Lang_Utils.setCurrentLanguageType(languageType);
            LocalData_Storage.setLanguageType(languageType);
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.LanguageChanged);
        }
    }

    private _updateCurrentState(): void {
        // this.currentState = Lang.getCurrentLanguageType() === this.data.languageType ? Types.UiState.Down : Types.UiState.Up;
    }
}

async function checkHasMapCache(): Promise<boolean> {
    return Math.max(...await Promise.all([
        LocalData_DeprecatedStorage.StoreNormalMapRawData.getAllDataCount(),
        LocalData_DeprecatedStorage.StoreCampaignMapRawData.getAllDataCount(),
        LocalData_DeprecatedStorage.StoreMeFullData.getAllDataCount(),
    ])) > 0;
}
async function openPanelForExportMapCache(): Promise<void> {
    if (!await checkHasMapCache()) {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0976),
        });
        return;
    }

    const resultArray: number[][][] = [];
    try {
        resultArray.push(...await Promise.all([
            exportCampaignMapCache(),
            exportNormalMapCache(),
            exportMapEditorCache(),
        ]));
    } catch {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0974),
        });
        return;
    }

    const campaignMap   = resultArray[0];
    const normalMap     = resultArray[1];
    const mapEditor     = resultArray[2];
    if (campaignMap.length + normalMap.length + mapEditor.length === 0) {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0974),
        });
        return;
    }

    // {
    //     const mapRawData: Proto.Schema.NsCommonProto.NsMap.MapRawData[] = [];
    //     for (const arr1 of resultArray) {
    //         for (const encodedData of arr1) {
    //             mapRawData.push(Proto.Schema.NsCommonProto.NsMap.MapRawData.decode(Helpers.Gzip.decompress(encodedData)));
    //         }
    //     }
    //     console.log(resultArray);
    //     console.log(mapRawData);
    // }

    const resultString = JSON.stringify({
        campaignMap : campaignMap,
        normalMap   : normalMap,
        mapEditor   : mapEditor,
    });
    console.log(resultString);

    const callback = async () => {
        const cb = async () => {
            try {
                window.focus();
                await navigator.clipboard.writeText(resultString);
            } catch {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                    getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0973),
                });
                return;
            }

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0975),
            });
            LocalData_Storage.setShowExportMapCachePopup(false);
        };

        if (Common_Model_CommonModel.getIsTransparentTouchLayerTouched()) {
            await cb();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0979),
                getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.B0026),
                getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.B0026),
                showButtonClose   : false,
                callback          : async () => {
                    Common_Model_CommonModel.setIsTransparentTouchLayerTouched(true);
                    await cb();
                },
                callbackOnCancel : async () => {
                    Common_Model_CommonModel.setIsTransparentTouchLayerTouched(true);
                    await cb();
                },
            });
        }
    };

    await callback();
}
async function exportCampaignMapCache(): Promise<number[][]> {
    const result: number[][] = [];
    for (const [, subDict] of await LocalData_DeprecatedStorage.StoreCampaignMapRawData.getAllEncodedDataDict()) {
        for (const [, encodedData] of subDict) {
            if (encodedData.length) {
                result.push(Array.from(encodedData));
            }
        }
    }
    return result;
}
async function exportNormalMapCache(): Promise<number[][]> {
    const result: number[][] = [];
    for (const [, encodedData] of await LocalData_DeprecatedStorage.StoreNormalMapRawData.getAllEncodedDataDict()) {
        if (encodedData.length) {
            result.push(Array.from(encodedData));
        }
    }
    return result;
}
async function exportMapEditorCache(): Promise<number[][]> {
    const result: number[][] = [];
    for (const [, subDict] of await LocalData_DeprecatedStorage.StoreMeFullData.getAllEncodedDataDict()) {
        for (const [, encodedMapEditorData] of subDict) {
            if (encodedMapEditorData.length) {
                const encodedMapRawData = (MapEditorData.decode(Helpers_Gzip.decompress(encodedMapEditorData))).getEncodedMapRawData();
                if (encodedMapRawData?.length) {
                    result.push(Array.from(Helpers_Gzip.compress(encodedMapRawData)));
                }
            }
        }
    }
    return result;
}

// function _createRandomUnitView(): eui.Component {
//     const view = new WarMap.WarMapUnitView();
//     view.update({
//         configVersion: ConfigManager.getNewestConfigVersion(),

//         gridX: 0,
//         gridY: 0,

//         viewId: ConfigManager.getUnitViewId(Math.floor(Math.random() * 26), Math.floor(Math.random() * 4) + 1),
//     });

//     const container     = new eui.Component();
//     container.width     = ConfigManager.getGridSize().width;
//     container.height    = ConfigManager.getGridSize().height;
//     container.addChild(view);
//     return container;
// }
