import {
    getIsTransparentTouchLayerTouched,
    setIsTransparentTouchLayerTouched,
} from "../../common/model/CommonModel.ts";
import { showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { Tween } from "../../graphics/Constants.ts";
import { checkIsWebGl } from "../../graphics/Utils.ts";
import { isPc } from "../../helpers/Compatibility.ts";
import {
    decompress,
    compress,
} from "../../helpers/Gzip.ts";
import { MouseStyleType } from "../../helpers/PointerInput.ts";
import {
    TextType,
    UndefinedError,
    LanguageType,
} from "../../lang/Constants.ts";
import {
    getText,
    getGameVersionName,
    getCurrentLanguageType,
    getLanguageTypeName,
    setCurrentLanguageType,
} from "../../lang/Utils.ts";
import {
    StoreNormalMapRawData,
    StoreCampaignMapRawData,
    StoreMeFullData,
} from "../../localData/DeprecatedStorage.ts";
import {
    getShowExportMapCachePopup,
    setShowExportMapCachePopup,
    setScreenRotation,
    setLanguageType,
} from "../../localData/Storage.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { MapEditorData } from "../../proto/schema/CommonProto/Map/MapEditorData.ts";
import { init } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { reqUserLoginAsGuest } from "../Proxy.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _group!                : IUiContainer;
    private readonly _imgBackground!        : IUiImage;

    private readonly _groupTopLeft!         : IUiContainer;
    private readonly _btnGuest!             : IUiButton;
    private readonly _btnTutorial!          : IUiButton;

    private readonly _groupTopRight!        : IUiContainer;
    private readonly _btnLandscape!         : IUiButton;
    private readonly _btnExportMapCache!    : IUiButton;

    private readonly _groupRightButton!     : IUiContainer;
    private readonly _btnVersion!           : IUiButton;
    private readonly _btnSound!             : IUiButton;

    private readonly _labelVersion!         : IUiLabel;
    private readonly _listLanguage!         : IUiScrollList<DataForLanguageRenderer>;
    private readonly _groupUnits!           : IUiContainer;

    private readonly _groupCopyright!       : IUiLayout;
    private readonly _labelWebGl!           : IUiLabel;
    private readonly _labelPrivacy!         : IUiLabel;
    private readonly _groupCopyright1!      : IUiLayout;
    private readonly _labelCopyright0!      : IUiLabel;
    private readonly _labelCopyright1!      : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: TypeId.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
            { type: TypeId.MsgCommonLatestConfigVersion,   callback: this._onMsgCommonLatestConfigVersion },
        ]);
        this._setUiListenerArray([
            { ui: this._group,              callback: this._onTouchedSelf,          mouseStyle: MouseStyleType.Default },
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
        this._labelWebGl.setIsVisible(!checkIsWebGl());

        // if (Config.ConfigManager.getLatestConfigVersion()) {
        //     this._initGroupUnits();
        // }
    }
    protected override async _doApplyOpenData(): Promise<void> {
        if (getShowExportMapCachePopup()) {
            if (!await checkHasMapCache()) {
                setShowExportMapCachePopup(false);
            } else {
                openPanel(getDict().CommonConfirmPanel, {
                    getTitle            : () => getText(TextType.B1470),
                    getContent          : () => getText(TextType.A0971),
                    callback            : () => openPanelForExportMapCache(),
                    callbackOnCancel    : () => openPanel(getDict().CommonConfirmPanel, {
                        getTitle            : () => getText(TextType.B1470),
                        getContent          : () => getText(TextType.A0972),
                        callback            : () => openPanelForExportMapCache(),
                        callbackOnCancel    : () => setShowExportMapCachePopup(false),
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
        init();
    }
    private _onTouchedBtnGuest(): void {
        reqUserLoginAsGuest(null, false);
    }
    private _onTouchedBtnTutorial(): void {
        openPanel(getDict().CommonTutorialPanel, void 0);
    }
    private _onTouchedBtnLandscape(): void {
        const inject = window.TW_APK_INJECT;
        if (inject == null) {
            openPanel(getDict().CommonHelpPanel, {
                getContent : () => getText(isPc ? TextType.A0416 : TextType.A0417),
            });
        } else {
            let currentRotation: number | null = null;
            try {
                currentRotation = inject.getScreenOrientation();
            } catch {
                showLang(TextType.A0840);
                return;
            }

            openPanel(getDict().CommonChooseSingleNumberPanel, {
                getTitleText            : () => getText(TextType.B0159),
                currentNumber           : currentRotation,
                availableNumberArray    : [0, 1, 2, 3],
                getNumberMainText       : num => {
                    switch (num) {
                        case 0  : return getText(TextType.B0377);
                        case 1  : return getText(TextType.B0419);
                        case 2  : return getText(TextType.B0591);
                        case 3  : return getText(TextType.B0597);
                        default : return UndefinedError;
                    }
                },
                callbackOnConfirm       : num => {
                    try {
                        setScreenRotation(num);
                        inject.setScreenOrientation(num);
                    } catch {
                        showLang(TextType.A0841);
                    }
                },
            });
        }
    }
    private _onTouchedBtnExportMapCache(): void {
        openPanelForExportMapCache();
    }
    private _onTouchedBtnVersion(): void {
        openPanel(getDict().CommonChangeVersionPanel, void 0);
    }
    private _onTouchedBtnSound(): void {
        openPanel(getDict().SoundsSettingsPanel, void 0);
    }

    private _updateComponentsForLanguage(): void {
        this._btnGuest.setLangText(TextType.B0982);
        this._btnLandscape.setLangText(TextType.B0159);
        this._btnExportMapCache.setLangText(TextType.B1470);
        this._btnVersion.setLangText(TextType.B0620);
        this._btnSound.setLangText(TextType.B0540);
        this._btnTutorial.setLangText(TextType.B0978);
        this._labelWebGl.setLangText(TextType.A0736);
        this._labelPrivacy.setLangText(TextType.A0733);
        this._labelCopyright0.setLangText(TextType.A0734);
        this._labelCopyright1.setLangText(TextType.A0735);
        this._labelVersion.setText(`${getGameVersionName(window.GAME_VERSION)}\nv.${window.CLIENT_VERSION}`);
        this._groupCopyright1.arrangeItems();
        this._groupCopyright.arrangeItems();
    }
    private async _initListLanguage(): Promise<void> {
        const listLanguage  = this._listLanguage;
        const languageType  = getCurrentLanguageType();
        const dataArray     : DataForLanguageRenderer[] = [
            { languageType: LanguageType.Chinese },
            { languageType: LanguageType.English },
            { languageType: LanguageType.Spanish },
        ];
        await listLanguage.bindData(dataArray);
        listLanguage.setSelectedItemIndexes([dataArray.findIndex(v => v.languageType === languageType)]);
    }

    protected async _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._imgBackground,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });
        Executor.reset({
            obj         : this._groupTopLeft,
            waitTime    : 1400,
            beginProps  : { customX: -40, customAlpha: 0 },
            endProps    : { customX: 0, customAlpha: 1 },
        });
        Executor.reset({
            obj         : this._listLanguage,
            waitTime    : 1400,
            beginProps  : { customX: -40, customAlpha: 0 },
            endProps    : { customX: 0, customAlpha: 1 },
        });
        Executor.reset({
            obj         : this._groupTopRight,
            waitTime    : 1500,
            beginProps  : { customX: 40, customAlpha: 0 },
            endProps    : { customX: 0, customAlpha: 1 },
        });
        Executor.reset({
            obj         : this._groupRightButton,
            waitTime    : 1500,
            beginProps  : { customX: 40, customAlpha: 0 },
            endProps    : { customX: 0, customAlpha: 1 },
        });
        Executor.reset({
            obj         : this._labelVersion,
            waitTime    : 1600,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });
        Executor.reset({
            obj         : this._groupCopyright,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
            waitTime    : 1700,
        });

        await wait(1700 + Tween.DefaultDuration);
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._imgBackground,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });
        Executor.reset({
            obj         : this._groupTopLeft,
            beginProps  : { customX: 0, customAlpha: 1 },
            endProps    : { customX: -40, customAlpha: 0 },
        });
        Executor.reset({
            obj         : this._listLanguage,
            beginProps  : { customX: 0, customAlpha: 1 },
            endProps    : { customX: -40, customAlpha: 0 },
        });
        Executor.reset({
            obj         : this._labelVersion,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });
        Executor.reset({
            obj         : this._groupTopRight,
            beginProps  : { customX: 0, customAlpha: 1 },
            endProps    : { customX: 40, customAlpha: 0 },
        });
        Executor.reset({
            obj         : this._groupRightButton,
            beginProps  : { customX: 0, customAlpha: 1 },
            endProps    : { customX: 40, customAlpha: 0 },
        });
        Executor.reset({
            obj         : this._groupCopyright,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });

        await wait();
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
        Executor.removeTweens(this._groupUnits);
    }
}

interface DataForLanguageRenderer extends UiListItemData {
    languageType: LanguageType;
}
class LanguageRenderer extends UiListItemRenderer<DataForLanguageRenderer> {
    private readonly _labelLanguage!    : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._applySettingsForWholeTouch();
    }
    protected override _doApplyOpenData(): void {
        const languageType = this.getOpenData()?.languageType;
        if (languageType == null) {
            return;
        }

        this._labelLanguage.setText(getLanguageTypeName(languageType) || `??`);

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

        if (getCurrentLanguageType() !== languageType) {
            setCurrentLanguageType(languageType);
            setLanguageType(languageType);
            dispatch(TypeId.LanguageChanged);
        }
    }

    private _updateCurrentState(): void {
        // this.currentState = Lang.getCurrentLanguageType() === this.data.languageType ? Types.UiState.Down : Types.UiState.Up;
    }
}

async function checkHasMapCache(): Promise<boolean> {
    return Math.max(...await Promise.all([
        StoreNormalMapRawData.getAllDataCount(),
        StoreCampaignMapRawData.getAllDataCount(),
        StoreMeFullData.getAllDataCount(),
    ])) > 0;
}
async function openPanelForExportMapCache(): Promise<void> {
    if (!await checkHasMapCache()) {
        openPanel(getDict().CommonHelpPanel, {
            getContent: () => getText(TextType.A0976),
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
        openPanel(getDict().CommonHelpPanel, {
            getContent: () => getText(TextType.A0974),
        });
        return;
    }

    const campaignMap   = resultArray[0];
    const normalMap     = resultArray[1];
    const mapEditor     = resultArray[2];
    if (campaignMap.length + normalMap.length + mapEditor.length === 0) {
        openPanel(getDict().CommonHelpPanel, {
            getContent: () => getText(TextType.A0974),
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
                openPanel(getDict().CommonHelpPanel, {
                    getContent: () => getText(TextType.A0973),
                });
                return;
            }

            openPanel(getDict().CommonHelpPanel, {
                getContent: () => getText(TextType.A0975),
            });
            setShowExportMapCachePopup(false);
        };

        if (getIsTransparentTouchLayerTouched()) {
            await cb();
        } else {
            window.TRANSPARENT_TOUCH_LAYER.style.pointerEvents = "auto";

            openPanel(getDict().CommonConfirmPanel, {
                getContent          : () => getText(TextType.A0979),
                getTextForConfirm   : () => getText(TextType.B0026),
                getTextForCancel    : () => getText(TextType.B0026),
                showButtonClose     : false,
                callback            : async () => {
                    setIsTransparentTouchLayerTouched(true);
                    await cb();
                },
                callbackOnCancel    : async () => {
                    setIsTransparentTouchLayerTouched(true);
                    await cb();
                },
            });
        }
    };

    await callback();
}
async function exportCampaignMapCache(): Promise<number[][]> {
    const result: number[][] = [];
    for (const [, subDict] of await StoreCampaignMapRawData.getAllEncodedDataDict()) {
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
    for (const [, encodedData] of await StoreNormalMapRawData.getAllEncodedDataDict()) {
        if (encodedData.length) {
            result.push(Array.from(encodedData));
        }
    }
    return result;
}
async function exportMapEditorCache(): Promise<number[][]> {
    const result: number[][] = [];
    for (const [, subDict] of await StoreMeFullData.getAllEncodedDataDict()) {
        for (const [, encodedMapEditorData] of subDict) {
            if (encodedMapEditorData.length) {
                const encodedMapRawData = (MapEditorData.decode(decompress(encodedMapEditorData))).getEncodedMapRawData();
                if (encodedMapRawData?.length) {
                    result.push(Array.from(compress(encodedMapRawData)));
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
