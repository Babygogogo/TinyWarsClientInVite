import * as CommonModelCommonModel from "../../common/model/CommonModel.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as GraphicsUtils from "../../graphics/Utils.ts";
import * as HelpersCompatibility from "../../helpers/Compatibility.ts";
import * as HelpersGzip from "../../helpers/Gzip.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocalDataDeprecatedStorage from "../../localData/DeprecatedStorage.ts";
import * as LocalDataStorage2 from "../../localData/Storage.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoMapMapEditorData from "../../proto/schema/CommonProto/Map/MapEditorData.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersProxy from "../Proxy.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBackground!        : UiInterfacesIUiImage.IUiImage;

    private readonly _groupTopLeft!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnGuest!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnTutorial!          : UiInterfacesIUiButton.IUiButton;

    private readonly _groupTopRight!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnLandscape!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnExportMapCache!    : UiInterfacesIUiButton.IUiButton;

    private readonly _groupRightButton!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnVersion!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSound!             : UiInterfacesIUiButton.IUiButton;

    private readonly _labelVersion!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listLanguage!         : UiInterfacesIUiScrollList.IUiScrollList<DataForLanguageRenderer>;
    private readonly _groupUnits!           : UiInterfacesIUiContainer.IUiContainer;

    private readonly _groupCopyright!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelWebGl!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPrivacy!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupCopyright1!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelCopyright0!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCopyright1!      : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
            { type: NotificationsTypeId.TypeId.MsgCommonLatestConfigVersion,   callback: this._onMsgCommonLatestConfigVersion },
        ]);
        this._setUiListenerArray([
            { ui: this._group,              callback: this._onTouchedSelf,          mouseStyle: HelpersPointerInput.MouseStyleType.Default },
            { ui: this._btnGuest,           callback: this._onTouchedBtnGuest },
            { ui: this._btnTutorial,        callback: this._onTouchedBtnTutorial },
            { ui: this._btnLandscape,       callback: this._onTouchedBtnLandscape },
            { ui: this._btnExportMapCache,  callback: this._onTouchedBtnExportMapCache },
            { ui: this._btnVersion,         callback: this._onTouchedBtnVersion },
            { ui: this._btnSound,           callback: this._onTouchedBtnSound },
        ]);
        this._listLanguage.setItemRendererClass(LanguageRenderer);

        this._imgBackground.setIsTouchEnabled(true);

        this._updateComponentsForLanguage();
        this._initListLanguage();
        this._labelWebGl.setIsVisible(!GraphicsUtils.checkIsWebGl());

        // if (Config.ConfigManager.getLatestConfigVersion()) {
        //     this._initGroupUnits();
        // }
    }
    protected override async _doApplyOpenData(): Promise<void> {
        if (LocalDataStorage2.getShowExportMapCachePopup()) {
            if (!await checkHasMapCache()) {
                LocalDataStorage2.setShowExportMapCachePopup(false);
            } else {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getTitle            : () => LangUtils.getText(LangConstants.TextType.B1470),
                    getContent          : () => LangUtils.getText(LangConstants.TextType.A0971),
                    callback            : () => openPanelForExportMapCache(),
                    callbackOnCancel    : () => GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                        getTitle            : () => LangUtils.getText(LangConstants.TextType.B1470),
                        getContent          : () => LangUtils.getText(LangConstants.TextType.A0972),
                        callback            : () => openPanelForExportMapCache(),
                        callbackOnCancel    : () => LocalDataStorage2.setShowExportMapCachePopup(false),
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
        SoundsSoundPlayer.init();
    }
    private _onTouchedBtnGuest(): void {
        UsersProxy.reqUserLoginAsGuest(null, false);
    }
    private _onTouchedBtnTutorial(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonTutorialPanel, void 0);
    }
    private _onTouchedBtnLandscape(): void {
        const inject = window.TW_APK_INJECT;
        if (inject == null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent : () => LangUtils.getText(HelpersCompatibility.isPc ? LangConstants.TextType.A0416 : LangConstants.TextType.A0417),
            });
        } else {
            let currentRotation: number | null = null;
            try {
                currentRotation = inject.getScreenOrientation();
            } catch {
                FloatText2.showLang(LangConstants.TextType.A0840);
                return;
            }

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
                getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0159),
                currentNumber           : currentRotation,
                availableNumberArray    : [0, 1, 2, 3],
                getNumberMainText       : num => {
                    switch (num) {
                        case 0  : return LangUtils.getText(LangConstants.TextType.B0377);
                        case 1  : return LangUtils.getText(LangConstants.TextType.B0419);
                        case 2  : return LangUtils.getText(LangConstants.TextType.B0591);
                        case 3  : return LangUtils.getText(LangConstants.TextType.B0597);
                        default : return LangConstants.UndefinedError;
                    }
                },
                callbackOnConfirm       : num => {
                    try {
                        LocalDataStorage2.setScreenRotation(num);
                        inject.setScreenOrientation(num);
                    } catch {
                        FloatText2.showLang(LangConstants.TextType.A0841);
                    }
                },
            });
        }
    }
    private _onTouchedBtnExportMapCache(): void {
        openPanelForExportMapCache();
    }
    private _onTouchedBtnVersion(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChangeVersionPanel, void 0);
    }
    private _onTouchedBtnSound(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SoundsSettingsPanel, void 0);
    }

    private _updateComponentsForLanguage(): void {
        this._btnGuest.setLangText(LangConstants.TextType.B0982);
        this._btnLandscape.setLangText(LangConstants.TextType.B0159);
        this._btnExportMapCache.setLangText(LangConstants.TextType.B1470);
        this._btnVersion.setLangText(LangConstants.TextType.B0620);
        this._btnSound.setLangText(LangConstants.TextType.B0540);
        this._btnTutorial.setLangText(LangConstants.TextType.B0978);
        this._labelWebGl.setLangText(LangConstants.TextType.A0736);
        this._labelPrivacy.setLangText(LangConstants.TextType.A0733);
        this._labelCopyright0.setLangText(LangConstants.TextType.A0734);
        this._labelCopyright1.setLangText(LangConstants.TextType.A0735);
        this._labelVersion.setText(`${LangUtils.getGameVersionName(window.GAME_VERSION)}\nv.${window.CLIENT_VERSION}`);
        this._groupCopyright1.arrangeItems();
        this._groupCopyright.arrangeItems();
    }
    private async _initListLanguage(): Promise<void> {
        const listLanguage  = this._listLanguage;
        const languageType  = LangUtils.getCurrentLanguageType();
        const dataArray     : DataForLanguageRenderer[] = [
            { languageType: LangConstants.LanguageType.Chinese },
            { languageType: LangConstants.LanguageType.English },
            { languageType: LangConstants.LanguageType.Spanish },
        ];
        await listLanguage.bindData(dataArray);
        listLanguage.setSelectedItemIndexes([dataArray.findIndex(v => v.languageType === languageType)]);
    }

    protected async _showOpenAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._imgBackground,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupTopLeft,
            waitTime    : 1400,
            beginProps  : { customX: -40, customAlpha: 0 },
            endProps    : { customX: 0, customAlpha: 1 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._listLanguage,
            waitTime    : 1400,
            beginProps  : { customX: -40, customAlpha: 0 },
            endProps    : { customX: 0, customAlpha: 1 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupTopRight,
            waitTime    : 1500,
            beginProps  : { customX: 40, customAlpha: 0 },
            endProps    : { customX: 0, customAlpha: 1 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupRightButton,
            waitTime    : 1500,
            beginProps  : { customX: 40, customAlpha: 0 },
            endProps    : { customX: 0, customAlpha: 1 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._labelVersion,
            waitTime    : 1600,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupCopyright,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
            waitTime    : 1700,
        });

        await TimerTimerModel.wait(1700 + GraphicsConstants.Tween.DefaultDuration);
    }
    protected async _showCloseAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._imgBackground,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupTopLeft,
            beginProps  : { customX: 0, customAlpha: 1 },
            endProps    : { customX: -40, customAlpha: 0 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._listLanguage,
            beginProps  : { customX: 0, customAlpha: 1 },
            endProps    : { customX: -40, customAlpha: 0 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._labelVersion,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupTopRight,
            beginProps  : { customX: 0, customAlpha: 1 },
            endProps    : { customX: 40, customAlpha: 0 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupRightButton,
            beginProps  : { customX: 0, customAlpha: 1 },
            endProps    : { customX: 40, customAlpha: 0 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupCopyright,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });

        await TimerTimerModel.wait();
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
        TweenExecutor.Executor.removeTweens(this._groupUnits);
    }
}

interface DataForLanguageRenderer extends UiTypesUiListItemData.UiListItemData {
    languageType: LangConstants.LanguageType;
}
class LanguageRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForLanguageRenderer> {
    private readonly _labelLanguage!    : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._applySettingsForWholeTouch();
    }
    protected override _doApplyOpenData(): void {
        const languageType = this.getOpenData()?.languageType;
        if (languageType == null) {
            return;
        }

        this._labelLanguage.setText(LangUtils.getLanguageTypeName(languageType) || `??`);

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

        if (LangUtils.getCurrentLanguageType() !== languageType) {
            LangUtils.setCurrentLanguageType(languageType);
            LocalDataStorage2.setLanguageType(languageType);
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.LanguageChanged);
        }
    }

    private _updateCurrentState(): void {
        // this.currentState = Lang.getCurrentLanguageType() === this.data.languageType ? Types.UiState.Down : Types.UiState.Up;
    }
}

async function checkHasMapCache(): Promise<boolean> {
    return Math.max(...await Promise.all([
        LocalDataDeprecatedStorage.StoreNormalMapRawData.getAllDataCount(),
        LocalDataDeprecatedStorage.StoreCampaignMapRawData.getAllDataCount(),
        LocalDataDeprecatedStorage.StoreMeFullData.getAllDataCount(),
    ])) > 0;
}
async function openPanelForExportMapCache(): Promise<void> {
    if (!await checkHasMapCache()) {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent: () => LangUtils.getText(LangConstants.TextType.A0976),
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent: () => LangUtils.getText(LangConstants.TextType.A0974),
        });
        return;
    }

    const campaignMap   = resultArray[0];
    const normalMap     = resultArray[1];
    const mapEditor     = resultArray[2];
    if (campaignMap.length + normalMap.length + mapEditor.length === 0) {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent: () => LangUtils.getText(LangConstants.TextType.A0974),
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
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                    getContent: () => LangUtils.getText(LangConstants.TextType.A0973),
                });
                return;
            }

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent: () => LangUtils.getText(LangConstants.TextType.A0975),
            });
            LocalDataStorage2.setShowExportMapCachePopup(false);
        };

        if (CommonModelCommonModel.getIsTransparentTouchLayerTouched()) {
            await cb();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent          : () => LangUtils.getText(LangConstants.TextType.A0979),
                getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B0026),
                getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B0026),
                showButtonClose     : false,
                callback            : async () => {
                    CommonModelCommonModel.setIsTransparentTouchLayerTouched(true);
                    await cb();
                },
                callbackOnCancel    : async () => {
                    CommonModelCommonModel.setIsTransparentTouchLayerTouched(true);
                    await cb();
                },
            });
        }
    };

    await callback();
}
async function exportCampaignMapCache(): Promise<number[][]> {
    const result: number[][] = [];
    for (const [, subDict] of await LocalDataDeprecatedStorage.StoreCampaignMapRawData.getAllEncodedDataDict()) {
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
    for (const [, encodedData] of await LocalDataDeprecatedStorage.StoreNormalMapRawData.getAllEncodedDataDict()) {
        if (encodedData.length) {
            result.push(Array.from(encodedData));
        }
    }
    return result;
}
async function exportMapEditorCache(): Promise<number[][]> {
    const result: number[][] = [];
    for (const [, subDict] of await LocalDataDeprecatedStorage.StoreMeFullData.getAllEncodedDataDict()) {
        for (const [, encodedMapEditorData] of subDict) {
            if (encodedMapEditorData.length) {
                const encodedMapRawData = (ProtoSchemaCommonProtoMapMapEditorData.MapEditorData.decode(HelpersGzip.decompress(encodedMapEditorData))).getEncodedMapRawData();
                if (encodedMapRawData?.length) {
                    result.push(Array.from(HelpersGzip.compress(encodedMapRawData)));
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
