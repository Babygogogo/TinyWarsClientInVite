import {
    Cos_Constants,
    Helpers_ImageSource,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    Helpers_PointerInput,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Ui_Components_UiContainer,
    Ui_Components_UiImage,
    Ui_Components_UiLayout,
    Ui_Components_UiPanel,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiCoInfo,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScroller,
    Ui_Utils_UiSkinHelpers,
} from "../../internal.ts";

 
const enum InfoType {
    CoName,
    BpRates,
    WlRates,
}

export interface OpenData {
    currentCoCategoryIdArray        : number[];
    availableCoCategoryIdArray      : number[];
    gameConfig                      : GameConfigs_GameConfig.GameConfig;
    forceUnchosenCoCategoryIdArray  : number[] | null;
    maxChooseCount                  : number | null;
    isBan                           : boolean;
    getTitleText                    : () => string;
    getBpRates?                     : (coCategoryId: number) => number[];
    getWlRates?                     : (coCategoryId: number) => number[];
    callbackOnMap?                  : (() => void) | null;
    callbackOnConfirm               : (coCategoryIdArray: number[]) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _scrCoCategory!        : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _groupCoCategory!      : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _groupTitleButton!     : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnSwitch!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMap!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupSelected!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSelectedTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSelected!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupSelectAll!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSelectAll!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgSelectAll!         : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _btnConfirm!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _uiCoInfo!             : Ui_Interfaces_IUiCoInfo.IUiCoInfo;

    private _renderersForCoNames    : RendererForCoCategory[] = [];

    private _showingInfoType        = InfoType.CoName;
    private _chosenCoCategoryIdSet  = new Set<number>();
    private _previewCoCategoryId    : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnConfirm,     callback : this._onTouchedBtnConfirm },
            { ui : this._btnClose,       callback : this.closePanel },
            { ui : this._btnMap,         callback : this._onTouchedBtnMap },
            { ui : this._btnSwitch,      callback : this._onTouchedBtnSwitch },
            { ui : this._groupSelectAll, callback : this._onTouchedGroupSelectAll },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
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
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
                    getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0088),
                    getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0133, openData.gameConfig.getCoNameAndTierText(coCategoryId)),
                });
                return;
            }
        }

        const maxCount = openData.maxChooseCount;
        if ((maxCount != null) && (chosenCoCategoryIdSet.size > maxCount)) {
            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0145, maxCount));
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
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

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
        const coCategoryId = Helpers_Misc.getExisted(renderer.getCoCategoryId());
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
                    FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0145, maxCount));
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
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._labelSelectedTitle.setLangText(Lang_Constants.TextType.B1274);
        this._labelSelectAll.setLangText(Lang_Constants.TextType.B0761);
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? Lang_Constants.UndefinedError);

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
        for (const displayCategory of Cos_Constants.DisplayCategoryArray) {
            const coIdArray1 = coIdArray.filter(v => gameConfig.getCoBasicCfg(v)?.getDisplayCategoryId() === displayCategory);
            if (coIdArray1.length <= 0) {
                continue;
            }

            let hasCo = false;
            for (const force of Cos_Constants.ForceArray) {
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
                    renderer.setCoCategoryId(Helpers_Misc.getExisted(gameConfig.getCoBasicCfg(coId)?.getCoCategoryId()));
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
            renderer.setIsSelected(chosenCoCategoryIdSet.has(Helpers_Misc.getExisted(renderer.getCoCategoryId())));
        }
    }

    private _initGroupSelectAll(): void {
        const openData          = this.getOpenData();
        const maxChooseCount    = openData?.maxChooseCount;
        this._groupSelectAll.setIsVisible(
            (openData?.callbackOnConfirm != null)                                                           &&
            ((maxChooseCount == null) || (maxChooseCount >= openData.availableCoCategoryIdArray.length)),
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
        this._setPreviewCoCategoryId(Cos_Constants.CategoryId.Empty);
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
            gameConfig : gameConfig,
            coId       : gameConfig.getEnabledCoIdByCategoryId(coCategoryId) ?? gameConfig.getCoIdByCategoryId(coCategoryId),
        });
        await uiCoInfo.applyOpenData();
    }
}

class RendererForCoCategory extends Ui_Components_UiContainer.UiContainer {
    private readonly _imgCoForce!       : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCoHead!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _groupSelect!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupSelected!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupWl!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutWin!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelWin!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutLose!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelLose!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupBp!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutBan!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelBan!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutPick!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPick!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private _isSelected     = false;
    private _canSelect      = false;
    private _panel          : Panel | null = null;
    private _gameConfig     : GameConfigs_GameConfig.GameConfig | null = null;
    private _coCategoryId   : number | null = null;

    public constructor(isBan: boolean) {
        super();

        Ui_Utils_UiSkinHelpers.loadSkinByPath(
            this,
            isBan ? "component/coInfo/CoHead006.exml" : "component/coInfo/CoHead005.exml",
        );
    }

    public updateOnLoadedSkin(): void {
        this.setIsTouchEnabled(true);
        this.setIsTouchChildrenEnabled(false);
        this.setMouseStyle(Helpers_PointerInput.MouseStyleType.Pointer);
        this.getEventAgent().addPointerEventListener(Helpers_PointerInput.PointerEventType.Tap, this._onTouchedSelf, this);

        this.updateView();
    }
    private _onTouchedSelf(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        this.getPanel()?.updateOnTouchedCoCategoryRenderer(this);
    }

    public setPanel(panel: Panel): void {
        this._panel = panel;
    }
    public getPanel(): Panel | null {
        return this._panel;
    }

    public setGameConfig(config: GameConfigs_GameConfig.GameConfig): void {
        this._gameConfig = config;
    }
    public getGameConfig(): GameConfigs_GameConfig.GameConfig | null {
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
            labelName.setText(Lang_Constants.UndefinedError);
            imgCoForce.loadSource(``);
            imgCoHead.loadSource(``);
        } else {
            labelName.setText(gcData?.getCoBasicCfg(coId)?.getName() ?? Lang_Constants.UndefinedError);

            if (gcData == null) {
                imgCoForce.loadSource(``);
                imgCoHead.loadSource(``);
            } else {
                imgCoForce.loadSource(Helpers_ImageSource.getCoEyeBackgroundByCoId(gcData, coId) ?? ``);
                imgCoHead.loadSource(Helpers_ImageSource.getCoEye(gcData, coId, true) ?? ``);
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

            labelName.setText(gcData?.getCoCategoryCfg(Helpers_Misc.getExisted(coCategoryId))?.getName() ?? Lang_Constants.UndefinedError);

        } else if (showingInfoType === InfoType.BpRates) {
            labelName.setIsVisible(false);
            groupWl.setIsVisible(false);
            groupBp.setIsVisible(true);

            const bpRates           = panel?.getBpRates(Helpers_Misc.getExisted(coCategoryId)) ?? [];
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

            const wlRates           = panel?.getWlRates(Helpers_Misc.getExisted(coCategoryId)) ?? [];
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

function createCoContainer(): Ui_Interfaces_IUiLayout.IUiLayout {
    const layout = new Ui_Components_UiLayout.UiLayout({
        itemsHMargin       : 10,
        itemsVMargin       : 10,
        multiItemsPerBlock : true,
    });
    layout.setUnscaledManualWidth(310);

    return layout;
}

function createSeparator(): Ui_Interfaces_IUiImage.IUiImage {
    const img = new Ui_Components_UiImage.UiImage();
    img.loadSource(`uncompressedColorWhite0000`);
    img.setUnscaledManualWidth(310);
    img.setUnscaledManualHeight(1);
    img.setIsSmoothing(false);
    return img;
}
