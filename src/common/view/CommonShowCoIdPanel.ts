import * as CosConstants from "../../cos/Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
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

export interface OpenData {
    gameConfig          : GameConfigGcData.GcData;
    currentCoIdArray    : number[];
    availableCoIdArray  : number[];
    isBan               : boolean;
    showCoId?           : boolean;
    getTitleText        : (() => string) | null;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _scrollCoNames!    : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _groupCoNames!     : UiInterfacesIUiLayout.IUiLayout;
    private readonly _uiCoInfo!         : UiInterfacesIUiCoInfo.IUiCoInfo;

    private _renderersForCoNames    : RendererForCoName[] = [];

    private _chosenCoIdSet  = new Set<number>();
    private _previewCoId    : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.closePanel },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
    private _getPreviewCoId(): number | null {
        return this._previewCoId;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    public updateOnTouchedCoRenderer(renderer: RendererForCoName): void {
        const coId = HelpersMisc.getExisted(renderer.getCoId());
        this._setPreviewCoId(coId);

        const chosenCoIdSet = this._chosenCoIdSet;
        chosenCoIdSet.clear();
        chosenCoIdSet.add(coId);
        this._updateComponentsForSelectedCo();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        const getTitleText = this.getOpenData()?.getTitleText;
        this._labelTitle.setText(getTitleText ? getTitleText() : LangUtils.getText(LangConstants.TextType.B0140));

        this._updateComponentsForPreviewCoId();
    }

    private _initGroupCoNames(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const renderersForCoNames   = this._renderersForCoNames;
        renderersForCoNames.length  = 0;

        const chosenCoIdSet         = this._chosenCoIdSet;
        const gameConfig            = openData.gameConfig;
        const availableCoIdArray    = openData.availableCoIdArray.concat().sort((v1, v2) => (gameConfig.getCoBasicCfg(v1)?.getName() ?? ``).localeCompare(gameConfig.getCoBasicCfg(v2)?.getName() ?? ``));
        // .concat().sort((v1, v2) => (gameConfig.getCoCategoryCfgByCoId(v1)?.sort ?? 0) - (gameConfig.getCoCategoryCfgByCoId(v2)?.sort ?? 0));
        for (const coId of openData.currentCoIdArray) {
            if (availableCoIdArray.indexOf(coId) >= 0) {
                chosenCoIdSet.add(coId);
            }
        }

        const groupCoNames          = this._groupCoNames;
        const isBan                 = openData.isBan;
        const showCoId              = !!openData.showCoId;
        let isFirstCategory         = true;
        for (const displayCategory of CosConstants.DisplayCategoryArray) {
            const coIdArray1 = availableCoIdArray.filter(v => gameConfig.getCoBasicCfg(v)?.getDisplayCategoryId() === displayCategory);
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
                    renderer.setShowCoId(showCoId);
                    renderer.updateView();

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
        const chosenCoIdSet = this._chosenCoIdSet;
        for (const renderer of this._renderersForCoNames) {
            renderer.setIsSelected(chosenCoIdSet.has(HelpersMisc.getExisted(renderer.getCoId())));
            renderer.updateView();
        }
    }

    private _initComponentsForPreviewCo(): void {
        this._setPreviewCoId(CosConstants.CoId.Empty);
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
            gameConfig  : gameConfig,
            coId        : coId,
        });
        await uiCoInfo.applyOpenData();
    }
}

class RendererForCoName extends UiComponentsUiContainer.UiContainer {
    private readonly _imgCoForce!       : UiInterfacesIUiImage.IUiImage;
    private readonly _imgCoHead!        : UiInterfacesIUiImage.IUiImage;
    private readonly _groupSelect!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupSelected!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelName!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCoId!        : UiInterfacesIUiLabel.IUiLabel;

    private _isSelected     = false;
    private _canSelect      = false;
    private _showCoId       = false;

    private _gameConfig     : GameConfigGcData.GcData | null = null;
    private _coId           : number | null = null;
    private _panel          : Panel | null = null;

    public constructor(isBan: boolean) {
        super();

        UiUtilsUiSkinHelpers.loadSkinByPath(this, isBan
            ? "component/coInfo/CoHead004.exml"
            : "component/coInfo/CoHead003.exml"
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
        this.getPanel()?.updateOnTouchedCoRenderer(this);
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

    public setCoId(coId: number): void {
        this._coId = coId;
    }
    public getCoId(): number | null {
        return this._coId;
    }

    public setIsSelected(isSelected: boolean): void {
        this._isSelected = isSelected;
    }
    public getIsSelected(): boolean {
        return this._isSelected;
    }

    public setShowCoId(showCoId: boolean): void {
        this._showCoId = showCoId;
    }
    public getShowCoId(): boolean {
        return this._showCoId;
    }

    public updateView(): void {
        this._groupSelected.setIsVisible(this.getIsSelected());

        const coId          = this.getCoId();
        const labelName     = this._labelName;
        const labelCoId     = this._labelCoId;
        const imgCoForce    = this._imgCoForce;
        const imgCoHead     = this._imgCoHead;
        if (coId == null) {
            labelName.setText(LangConstants.UndefinedError);
            labelCoId.setText(``);
            imgCoForce.loadSource(``);
            imgCoHead.loadSource(``);
        } else {
            const gcData = this.getGameConfig();
            labelName.setText(gcData?.getCoBasicCfg(coId)?.getName() ?? LangConstants.UndefinedError);
            labelCoId.setText(this.getShowCoId() ? `ID ${coId}` : ``);

            if (gcData == null) {
                imgCoForce.loadSource(``);
                imgCoHead.loadSource(``);
            } else {
                imgCoForce.loadSource(HelpersImageSource.getCoEyeBackgroundByCoId(gcData, coId) ?? ``);
                imgCoHead.loadSource(HelpersImageSource.getCoEye(gcData, coId, true) ?? ``);
            }
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
