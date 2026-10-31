import {
    Cos_Constants,
    Helpers_ImageSource,
    Helpers_Misc,
    Helpers_PointerInput,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Ui_Components_UiContainer,
    Ui_Components_UiImage,
    Ui_Components_UiLayout,
    Ui_Components_UiPanel,
    Lang_Constants,
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

export interface OpenData {
    currentCoCategoryIdArray        : number[];
    availableCoCategoryIdArray      : number[];
    gameConfig                      : GameConfigs_GameConfig.GameConfig;
    isBan                           : boolean;
    getTitleText                    : () => string;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _scrCoCategory!        : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _groupCoCategory!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _uiCoInfo!             : Ui_Interfaces_IUiCoInfo.IUiCoInfo;

    private _renderersForCoNames    : RendererForCoCategory[] = [];

    private _chosenCoCategoryIdSet  = new Set<number>();
    private _previewCoCategoryId    : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected async _onOpened(): Promise<void> {
        await super._onOpened();
        await this._uiCoInfo.open();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._initGroupCoCategory();
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

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    public updateOnTouchedCoCategoryRenderer(renderer: RendererForCoCategory): void {
        const coCategoryId = Helpers_Misc.getExisted(renderer.getCoCategoryId());
        this._setPreviewCoCategoryId(coCategoryId);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? Lang_Constants.UndefinedError);
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

        const gameConfig        = openData.gameConfig;
        const coIdArray         = availableCoCategoryIdArray.map(v => gameConfig.getCoIdByCategoryId(v)).sort((v1, v2) => (gameConfig.getCoBasicCfg(v1)?.getName() ?? ``).localeCompare(gameConfig.getCoBasicCfg(v2)?.getName() ?? ``));
        const isBan             = openData.isBan;
        const groupCoCategory   = this._groupCoCategory;
        let isFirstCategory     = true;
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
        this._updateGroupCoNames();
    }

    private _updateGroupCoNames(): void {
        const chosenCoCategoryIdSet = this._chosenCoCategoryIdSet;
        for (const renderer of this._renderersForCoNames) {
            renderer.setIsSelected(chosenCoCategoryIdSet.has(Helpers_Misc.getExisted(renderer.getCoCategoryId())));
        }
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

    private _isSelected     = false;
    private _panel          : Panel | null = null;
    private _gameConfig     : GameConfigs_GameConfig.GameConfig | null = null;
    private _coCategoryId   : number | null = null;

    public constructor(isBan: boolean) {
        super();

        Ui_Utils_UiSkinHelpers.loadSkinByPath(this, isBan
            ? "component/coInfo/CoHead004.exml"
            : "component/coInfo/CoHead003.exml",
        );
    }

    public updateOnLoadedSkin(): void {
        this.setIsTouchEnabled(true);
        this.setIsTouchChildrenEnabled(false);
        this.setMouseStyle(Helpers_PointerInput.MouseStyleType.Pointer);
        this.getEventAgent().addPointerEventListener(Helpers_PointerInput.PointerEventType.Tap, this._onTouchedSelf, this);

        this._updateView();
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
        this._updateView();
    }
    public getCoCategoryId(): number | null {
        return this._coCategoryId;
    }

    public setIsSelected(isSelected: boolean): void {
        this._isSelected = isSelected;
        this._updateView();
    }
    public getIsSelected(): boolean {
        return this._isSelected;
    }

    private _updateView(): void {
        const groupSelect   = this._groupSelect;
        const isSelected    = this.getIsSelected();
        if (!isSelected) {
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

        this._labelName.setText(this._gameConfig?.getCoCategoryCfg(Helpers_Misc.getExisted(this._coCategoryId))?.getName() ?? Lang_Constants.UndefinedError);
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
