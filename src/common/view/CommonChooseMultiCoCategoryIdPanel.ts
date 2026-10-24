import * as CosConstants from "../../cos/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiContainer from "../../ui/components/UiContainer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiCoInfo from "../../ui/interfaces/IUiCoInfo.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UiUtilsUiSkinHelpers from "../../ui/utils/UiSkinHelpers.ts";

// eslint-disable-next-line no-shadow
const enum InfoType {
    CoName,
    BpRates,
    WlRates,
}

export interface OpenData {
    currentCoCategoryIdArray        : number[];
    availableCoCategoryIdArray      : number[];
    gameConfig                      : GameConfigGcData.GcData;
    forceUnchosenCoCategoryIdArray  : number[] | null;
    maxChooseCount                  : number | null;
    isBan                           : boolean;
    getTitleText                    : () => string;
    getBpRates?                     : (coCategoryId: number) => number[];
    getWlRates?                     : (coCategoryId: number) => number[];
    callbackOnMap?                  : (() => void) | null;
    callbackOnConfirm               : (coCategoryIdArray: number[]) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _scrCoCategory!        : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _groupCoCategory!      : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupTitleButton!     : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnSwitch!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMap!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _groupSelected!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSelectedTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSelected!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupSelectAll!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSelectAll!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgSelectAll!         : UiInterfacesIUiImage.IUiImage;

    private readonly _btnConfirm!           : UiInterfacesIUiButton.IUiButton;
    private readonly _uiCoInfo!             : UiInterfacesIUiCoInfo.IUiCoInfo;

    private _renderersForCoNames    : RendererForCoCategory[] = [];

    private _showingInfoType        = InfoType.CoName;
    private _chosenCoCategoryIdSet  = new Set<number>();
    private _previewCoCategoryId    : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnMap,         callback: this._onTouchedBtnMap },
            { ui: this._btnSwitch,      callback: this._onTouchedBtnSwitch },
            { ui: this._groupSelectAll, callback: this._onTouchedGroupSelectAll },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();
        await this._uiCoInfo.open();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._showingInfoType = InfoType.CoName;
        this._initButtons();
        this._initGroupCoCategory();
        this._initGroupSelectAll();
        this._initComponentsForPreviewCo();
    }
    protected async _onClosed(): Promise<void> {
        await this._uiCoInfo.close();
        await super._onClosed();
    }

    private _setPreviewCoCategoryId(coCategoryId: number): void {
        if (this._getPreviewCoCategoryId() !== coCategoryId) {
            this._previewCoCategoryId = coCategoryId;
            this._updateComponentsForPreviewCoCategoryId();
        }
    }
    private _getPreviewCoCategoryId(): number | null {
        return this._previewCoCategoryId;
    }

    public getShowingInfoType(): InfoType {
        return this._showingInfoType;
    }
    public getBpRates(coCategoryId: number): number[] | null {
        const func = this.getOpenData()?.getBpRates;
        return func ? func(coCategoryId) : null;
    }
    public getWlRates(coCategoryId: number): number[] | null {
        const func = this.getOpenData()?.getWlRates;
        return func ? func(coCategoryId) : null;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const chosenCoCategoryIdSet = this._chosenCoCategoryIdSet;
        for (const coCategoryId of openData.forceUnchosenCoCategoryIdArray ?? []) {
            if (chosenCoCategoryIdSet.has(coCategoryId)) {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonAlertPanel, {
                    getTitle   : () => LangUtils.getText(LangConstants.TextType.B0088),
                    getContent : () => LangUtils.getFormattedText(LangConstants.TextType.F0133, openData.gameConfig.getCoNameAndTierText(coCategoryId)),
                });
                return;
            }
        }

        const maxCount = openData.maxChooseCount;
        if ((maxCount != null) && (chosenCoCategoryIdSet.size > maxCount)) {
            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0145, maxCount));
            return;
        }

        const callback = openData.callbackOnConfirm;
        if (callback) {
            callback([...chosenCoCategoryIdSet]);
        }

        this.closePanel();
    }

    private _onTouchedBtnMap(): void {
        const callback = this.getOpenData()?.callbackOnMap;
        (callback) && (callback());
    }

    private _onTouchedBtnSwitch(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const infoType = this.getShowingInfoType();
        if (infoType === InfoType.CoName) {
            if (openData.getBpRates) {
                this._showingInfoType = InfoType.BpRates;
            } else if (openData.getWlRates) {
                this._showingInfoType = InfoType.WlRates;
            }
        } else if (infoType === InfoType.BpRates) {
            if (openData.getWlRates) {
                this._showingInfoType = InfoType.WlRates;
            } else {
                this._showingInfoType = InfoType.CoName;
            }
        } else {
            this._showingInfoType = InfoType.CoName;
        }

        for (const renderer of this._renderersForCoNames) {
            renderer.updateView();
        }
    }

    private _onTouchedGroupSelectAll(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const chosenCoCategoryIdSet = this._chosenCoCategoryIdSet;
        chosenCoCategoryIdSet.clear();
        if (!this._imgSelectAll.getIsVisible()) {
            for (const coId of this.getOpenData()?.availableCoCategoryIdArray ?? []) {
                chosenCoCategoryIdSet.add(coId);
            }
        }

        this._updateComponentsForSelectedCo();
    }

    public updateOnTouchedCoCategoryRenderer(renderer: RendererForCoCategory): void {
        const coCategoryId = HelpersMisc.getExisted(renderer.getCoCategoryId());
        this._setPreviewCoCategoryId(coCategoryId);

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }
        if (openData.callbackOnConfirm == null) {
            return;
        }

        const chosenCoCategoryIdSet = this._chosenCoCategoryIdSet;
        if (renderer.getIsSelected()) {
            chosenCoCategoryIdSet.delete(coCategoryId);
            this._updateComponentsForSelectedCo();
        } else {
            const maxCount = openData.maxChooseCount;
            if ((maxCount != null) && (chosenCoCategoryIdSet.size >= maxCount)) {
                if (maxCount == 1) {
                    chosenCoCategoryIdSet.clear();
                } else {
                    FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0145, maxCount));
                    return;
                }
            }

            chosenCoCategoryIdSet.add(coCategoryId);
            this._updateComponentsForSelectedCo();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._labelSelectedTitle.setText(LangUtils.getText(LangConstants.TextType.B1274));
        this._labelSelectAll.setText(LangUtils.getText(LangConstants.TextType.B0761));
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? LangConstants.UndefinedError);

        this._groupSelected.arrangeItems();
        this._groupSelectAll.arrangeItems();
    }

    private _initButtons(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._btnConfirm.setIsVisible(openData.callbackOnConfirm != null);

        const group = this._groupTitleButton;
        group.removeAllItems(false);
        if ((openData.getBpRates) || (openData.getWlRates)) {
            group.addItem(this._btnSwitch, false);
        }
        if (openData.callbackOnMap) {
            group.addItem(this._btnMap, false);
        }
        group.addItem(this._btnClose, false);
        group.arrangeItems();
    }

    private _initGroupCoCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const renderersForCoNames   = this._renderersForCoNames;
        renderersForCoNames.length  = 0;

        const chosenCoCategoryIdSet         = this._chosenCoCategoryIdSet;
        const availableCoCategoryIdArray    = openData.availableCoCategoryIdArray;
        for (const coCategoryId of openData.currentCoCategoryIdArray) {
            if (availableCoCategoryIdArray.indexOf(coCategoryId) >= 0) {
                chosenCoCategoryIdSet.add(coCategoryId);
            }
        }

        const gameConfig            = openData.gameConfig;
        const coIdArray             = availableCoCategoryIdArray.map(v => gameConfig.getCoIdByCategoryId(v)).sort((v1, v2) => (gameConfig.getCoBasicCfg(v1)?.getName() ?? ``).localeCompare(gameConfig.getCoBasicCfg(v2)?.getName() ?? ``));
        const canSelect             = openData.callbackOnConfirm != null;
        const isBan                 = openData.isBan;
        const groupCoCategory       = this._groupCoCategory;
        let isFirstCategory         = true;
        for (const displayCategory of CosConstants.DisplayCategoryArray) {
            const coIdArray1 = coIdArray.filter(v => gameConfig.getCoBasicCfg(v)?.getDisplayCategoryId() === displayCategory);
            if (coIdArray1.length <= 0) {
                continue;
            }

            let hasCo = false;
            for (const force of CosConstants.ForceArray) {
                const coIdArray2 = coIdArray1.filter(v => gameConfig.getCoBasicCfg(v)?.getForce() === force);
                if (coIdArray2.length <= 0) {
                    continue;
                }

                if ((!isFirstCategory) && (!hasCo)) {
                    groupCoCategory.addItem(createSeparator(), false);
                }
                hasCo = true;

                const container = createCoContainer();
                for (const coId of coIdArray2) {
                    const renderer = new RendererForCoCategory(isBan);
                    renderer.setGameConfig(gameConfig);
                    renderer.setCoCategoryId(HelpersMisc.getExisted(gameConfig.getCoBasicCfg(coId)?.getCoCategoryId()));
                    renderer.setPanel(this);
                    renderer.setIsSelected(false);
                    renderer.setCanSelect(canSelect);

                    container.addItem(renderer, false);
                    renderersForCoNames.push(renderer);
                }
                container.arrangeItems();
                groupCoCategory.addItem(container, false);
            }

            if (hasCo) {
                isFirstCategory = false;
            }
        }

        groupCoCategory.arrangeItems();
        this._scrCoCategory.updateOnItemsChanged();
        this._updateComponentsForSelectedCo();
    }

    private _updateGroupCoNames(): void {
        const chosenCoCategoryIdSet = this._chosenCoCategoryIdSet;
        for (const renderer of this._renderersForCoNames) {
            renderer.setIsSelected(chosenCoCategoryIdSet.has(HelpersMisc.getExisted(renderer.getCoCategoryId())));
        }
    }

    private _initGroupSelectAll(): void {
        const openData          = this.getOpenData();
        const maxChooseCount    = openData?.maxChooseCount;
        this._groupSelectAll.setIsVisible(
            (openData?.callbackOnConfirm != null)                                                           &&
            ((maxChooseCount == null) || (maxChooseCount >= openData.availableCoCategoryIdArray.length))
        );

        this._updateImgSelectAll();
    }

    private _updateComponentsForSelectedCo(): void {
        this._updateGroupCoNames();
        this._updateLabelSelected();
        this._updateImgSelectAll();
    }
    private _updateLabelSelected(): void {
        this._labelSelected.setText(`${this._chosenCoCategoryIdSet.size} / ${this.getOpenData()?.maxChooseCount ?? `--`}`);
        this._groupSelected.arrangeItems();
    }
    private _updateImgSelectAll(): void {
        this._imgSelectAll.setIsVisible(this._chosenCoCategoryIdSet.size >= (this.getOpenData()?.availableCoCategoryIdArray.length ?? 0));
    }

    private _initComponentsForPreviewCo(): void {
        this._setPreviewCoCategoryId(CosConstants.CategoryId.Empty);
    }

    private async _updateComponentsForPreviewCoCategoryId(): Promise<void> {
        const coCategoryId = this._previewCoCategoryId;
        if (coCategoryId == null) {
            return;
        }

        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const uiCoInfo = this._uiCoInfo;
        uiCoInfo.setOpenData({
            gameConfig  : gameConfig,
            coId        : gameConfig.getEnabledCoIdByCategoryId(coCategoryId) ?? gameConfig.getCoIdByCategoryId(coCategoryId),
        });
        await uiCoInfo.applyOpenData();
    }
}

class RendererForCoCategory extends UiComponentsUiContainer.UiContainer {
    private readonly _imgCoForce!       : UiInterfacesIUiImage.IUiImage;
    private readonly _imgCoHead!        : UiInterfacesIUiImage.IUiImage;
    private readonly _groupSelect!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupSelected!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelName!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupWl!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _layoutWin!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelWin!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutLose!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelLose!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupBp!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _layoutBan!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelBan!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutPick!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPick!        : UiInterfacesIUiLabel.IUiLabel;

    private _isSelected     = false;
    private _canSelect      = false;
    private _panel          : Panel | null = null;
    private _gameConfig     : GameConfigGcData.GcData | null = null;
    private _coCategoryId   : number | null = null;

    public constructor(isBan: boolean) {
        super();

        UiUtilsUiSkinHelpers.loadSkinByPath(
            this,
            isBan ? "component/coInfo/CoHead006.exml" : "component/coInfo/CoHead005.exml"
        );
    }

    public updateOnLoadedSkin(): void {
        this.setIsTouchEnabled(true);
        this.setIsTouchChildrenEnabled(false);
        this.setMouseStyle(HelpersPointerInput.MouseStyleType.Pointer);
        this.getEventAgent().addPointerEventListener(HelpersPointerInput.PointerEventType.Tap, this._onTouchedSelf, this);

        this.updateView();
    }
    private _onTouchedSelf(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        this.getPanel()?.updateOnTouchedCoCategoryRenderer(this);
    }

    public setPanel(panel: Panel): void {
        this._panel = panel;
    }
    public getPanel(): Panel | null {
        return this._panel;
    }

    public setGameConfig(config: GameConfigGcData.GcData): void {
        this._gameConfig = config;
    }
    public getGameConfig(): GameConfigGcData.GcData | null {
        return this._gameConfig;
    }

    public setCoCategoryId(coCategoryId: number): void {
        this._coCategoryId = coCategoryId;
        this.updateView();
    }
    public getCoCategoryId(): number | null {
        return this._coCategoryId;
    }

    public setCanSelect(canSelect: boolean): void {
        this._canSelect = canSelect;
    }
    public getCanSelect(): boolean {
        return this._canSelect;
    }

    public setIsSelected(isSelected: boolean): void {
        this._isSelected = isSelected;
        this.updateView();
    }
    public getIsSelected(): boolean {
        return this._isSelected;
    }

    public updateView(): void {
        const groupSelect   = this._groupSelect;
        const isSelected    = this.getIsSelected();
        if ((!this.getCanSelect()) && (!isSelected)) {
            groupSelect.setIsVisible(false);
        } else {
            groupSelect.setIsVisible(true);
            this._groupSelected.setIsVisible(isSelected);
        }

        const gcData        = this.getGameConfig();
        const coCategoryId  = this.getCoCategoryId();
        const coId          = coCategoryId == null ? null : gcData?.getCoIdByCategoryId(coCategoryId);
        const labelName     = this._labelName;
        const imgCoForce    = this._imgCoForce;
        const imgCoHead     = this._imgCoHead;
        if (coId == null) {
            labelName.setText(LangConstants.UndefinedError);
            imgCoForce.loadSource(``);
            imgCoHead.loadSource(``);
        } else {
            labelName.setText(gcData?.getCoBasicCfg(coId)?.getName() ?? LangConstants.UndefinedError);

            if (gcData == null) {
                imgCoForce.loadSource(``);
                imgCoHead.loadSource(``);
            } else {
                imgCoForce.loadSource(HelpersImageSource.getCoEyeBackgroundByCoId(gcData, coId) ?? ``);
                imgCoHead.loadSource(HelpersImageSource.getCoEye(gcData, coId, true) ?? ``);
            }
        }

        const panel             = this.getPanel();
        const showingInfoType   = panel?.getShowingInfoType();
        const groupWl           = this._groupWl;
        const groupBp           = this._groupBp;
        if ((showingInfoType == null) || (showingInfoType === InfoType.CoName)) {
            labelName.setIsVisible(true);
            groupWl.setIsVisible(false);
            groupBp.setIsVisible(false);

            labelName.setText(gcData?.getCoCategoryCfg(HelpersMisc.getExisted(coCategoryId))?.getName() ?? LangConstants.UndefinedError);

        } else if (showingInfoType === InfoType.BpRates) {
            labelName.setIsVisible(false);
            groupWl.setIsVisible(false);
            groupBp.setIsVisible(true);

            const bpRates           = panel?.getBpRates(HelpersMisc.getExisted(coCategoryId)) ?? [];
            const banRate           = bpRates[0];
            const pickRate          = bpRates[1];
            this._labelBan.setText(banRate == null ? `--` : `${Math.floor(banRate * 100 + 0.5)}%`);
            this._labelPick.setText(pickRate == null ? `--` : `${Math.floor(pickRate * 100 + 0.5)}%`);
            this._layoutBan.arrangeItems();
            this._layoutPick.arrangeItems();
            this._groupBp.arrangeItems();

        } else if (showingInfoType === InfoType.WlRates) {
            labelName.setIsVisible(false);
            groupWl.setIsVisible(true);
            groupBp.setIsVisible(false);

            const wlRates           = panel?.getWlRates(HelpersMisc.getExisted(coCategoryId)) ?? [];
            const winRate           = wlRates[0];
            const loseRate          = wlRates[1];
            this._labelWin.setText(winRate == null ? `--` : `${Math.floor(winRate * 100 + 0.5)}%`);
            this._labelLose.setText(loseRate == null ? `--` : `${Math.floor(loseRate * 100 + 0.5)}%`);
            this._layoutWin.arrangeItems();
            this._layoutLose.arrangeItems();
            this._groupWl.arrangeItems();
        }
    }
}

function createCoContainer(): UiInterfacesIUiLayout.IUiLayout {
    const layout = new (UiUtilsUiFactory.getUiLayoutClass())({
        itemsHMargin        : 10,
        itemsVMargin        : 10,
        multiItemsPerBlock  : true,
    });
    layout.setUnscaledManualWidth(310);

    return layout;
}

function createSeparator(): UiInterfacesIUiImage.IUiImage {
    const img = new (UiUtilsUiFactory.getUiImageClass())();
    img.loadSource(`uncompressedColorWhite0000`);
    img.setUnscaledManualWidth(310);
    img.setUnscaledManualHeight(1);
    img.setIsSmoothing(false);
    return img;
}
