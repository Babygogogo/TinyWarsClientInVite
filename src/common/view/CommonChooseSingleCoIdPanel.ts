import {
    Cos_Constants,
    Helpers_ImageSource,
    Helpers_Misc,
    Helpers_PointerInput,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
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
    type AuxiliaryTypes_AuxiliaryTypes,
    Ui_Utils_UiSkinHelpers,
} from "../../internal.ts";

export interface OpenData {
    currentCoId         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    availableCoIdArray  : number[];
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    isBan               : boolean;
    callbackOnConfirm   : (coId: number) => void;
    callbackOnSetNull?  : () => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _scrollCoNames!        : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _groupCoNames!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSetNull!           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelTips!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _uiCoInfo!             : Ui_Interfaces_IUiCoInfo.IUiCoInfo;

    private _renderersForCoNames            : RendererForCoName[] = [];

    private _chosenCoId                     : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    private _previewCoId                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
            { ui : this._btnSetNull,     callback : this._onTouchedBtnSetNull },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
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

        this._btnSetNull.setIsVisible(this.getOpenData()?.callbackOnSetNull != null);
        this._initGroupCoNames();
        this._initComponentsForPreviewCo();
    }
    protected async _onClosed(): Promise<void> {
        await this._uiCoInfo.close();
        await super._onClosed();
    }

    private _setPreviewCoId(coId: number): void {
        if (this._getPreviewCoId() !== coId) {
            this._previewCoId = coId;
            this._updateComponentsForPreviewCoId();
        }
    }
    private _getPreviewCoId(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
        return this._previewCoId;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnSetNull(): void {
        this.getOpenData()?.callbackOnSetNull?.();
        this.closePanel();
    }

    public updateOnTouchedCoRenderer(renderer: RendererForCoName): void {
        const coId = Helpers_Misc.getExisted(renderer.getCoId());
        this._setPreviewCoId(coId);

        if (renderer.getIsSelected()) {
            this.getOpenData()?.callbackOnConfirm(coId);
            this.closePanel();
        } else {
            this._chosenCoId = coId;
            this._updateComponentsForSelectedCo();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._btnSetNull.setLangText(Lang_Constants.TextType.B0022);
        this._labelTitle.setLangText(Lang_Constants.TextType.B0145);
        this._labelTips.setLangText(Lang_Constants.TextType.B1249);
    }

    private _initGroupCoNames(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const renderersForCoNames   = this._renderersForCoNames;
        renderersForCoNames.length  = 0;

        this._chosenCoId            = openData.currentCoId;

        const gameConfig            = openData.gameConfig;
        const coIdArray             = openData.availableCoIdArray.concat().sort((v1, v2) => (gameConfig.getCoBasicCfg(v1)?.getName() ?? ``).localeCompare(gameConfig.getCoBasicCfg(v2)?.getName() ?? ``));
        const isBan                 = openData.isBan;
        const groupCoNames          = this._groupCoNames;
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
                    groupCoNames.addItem(createSeparator(), false);
                }
                hasCo = true;

                const container = createCoContainer();
                for (const coId of coIdArray2) {
                    const renderer = new RendererForCoName(isBan);
                    renderer.setGameConfig(gameConfig);
                    renderer.setCoId(coId);
                    renderer.setPanel(this);
                    renderer.setIsSelected(false);
                    renderer.setCanSelect(true);

                    container.addItem(renderer, false);
                    renderersForCoNames.push(renderer);
                }
                container.arrangeItems();
                groupCoNames.addItem(container, false);
            }

            if (hasCo) {
                isFirstCategory = false;
            }
        }

        groupCoNames.arrangeItems();
        this._scrollCoNames.updateOnItemsChanged();
        this._updateComponentsForSelectedCo();
    }

    private _updateComponentsForSelectedCo(): void {
        const chosenCoId = this._chosenCoId;
        for (const renderer of this._renderersForCoNames) {
            renderer.setIsSelected(chosenCoId === renderer.getCoId());
        }
    }

    private _initComponentsForPreviewCo(): void {
        this._setPreviewCoId(this.getOpenData()?.currentCoId ?? Cos_Constants.CoId.Empty);
    }

    private async _updateComponentsForPreviewCoId(): Promise<void> {
        const coId = this._previewCoId;
        if (coId == null) {
            return;
        }

        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const uiCoInfo = this._uiCoInfo;
        uiCoInfo.setOpenData({
            gameConfig : gameConfig,
            coId       : coId,
        });
        await uiCoInfo.applyOpenData();
    }
}

class RendererForCoName extends Ui_Components_UiContainer.UiContainer {
    private readonly _imgCoForce!       : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCoHead!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _groupSelect!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupSelected!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private _isSelected     = false;
    private _canSelect      = false;
    private _panel          : Panel | null = null;
    private _gameConfig     : GameConfigs_GameConfig.GameConfig | null = null;
    private _coId           : number | null = null;

    public constructor(isBan: boolean) {
        super();

        Ui_Utils_UiSkinHelpers.loadSkinByPath(
            this,
            isBan ? "component/coInfo/CoHead004.exml" : "component/coInfo/CoHead003.exml",
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
        this.getPanel()?.updateOnTouchedCoRenderer(this);
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

    public setCoId(coId: number): void {
        this._coId = coId;
        this._updateView();
    }
    public getCoId(): number | null {
        return this._coId;
    }

    public setCanSelect(canSelect: boolean): void {
        this._canSelect = canSelect;
    }
    public getCanSelect(): boolean {
        return this._canSelect;
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
        if ((!this.getCanSelect()) && (!isSelected)) {
            groupSelect.setIsVisible(false);
        } else {
            groupSelect.setIsVisible(true);
            this._groupSelected.setIsVisible(isSelected);
        }

        const gcData    = this.getGameConfig();
        const coId          = this.getCoId();
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
