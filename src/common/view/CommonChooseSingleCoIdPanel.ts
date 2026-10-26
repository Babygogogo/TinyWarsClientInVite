import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { DisplayCategoryArray, ForceArray, CoId } from "../../cos/Constants.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import { getCoEyeBackgroundByCoId, getCoEye } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { MouseStyleType, PointerEventType } from "../../helpers/PointerInput.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiContainer } from "../../ui/components/UiContainer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiCoInfo } from "../../ui/interfaces/IUiCoInfo.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { getUiLayoutClass, getUiImageClass } from "../../ui/utils/UiFactory.ts";
import { loadSkinByPath } from "../../ui/utils/UiSkinHelpers.ts";

export interface OpenData {
    currentCoId         : Undefinable<number>;
    availableCoIdArray  : number[];
    gameConfig          : GcData;
    isBan               : boolean;
    callbackOnConfirm   : (coId: number) => void;
    callbackOnSetNull?  : () => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _scrollCoNames!        : IUiScroller<IUiLayout>;
    private readonly _groupCoNames!         : IUiLayout;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnSetNull!           : IUiButton;

    private readonly _labelTips!            : IUiLabel;
    private readonly _uiCoInfo!             : IUiCoInfo;

    private _renderersForCoNames            : RendererForCoName[] = [];

    private _chosenCoId                     : Undefinable<number>;
    private _previewCoId                    : Undefinable<number>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnSetNull,     callback: this._onTouchedBtnSetNull },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
    private _getPreviewCoId(): Undefinable<number> {
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
        const coId = getExisted(renderer.getCoId());
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
        this._btnSetNull.setLangText(TextType.B0022);
        this._labelTitle.setLangText(TextType.B0145);
        this._labelTips.setLangText(TextType.B1249);
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
        for (const displayCategory of DisplayCategoryArray) {
            const coIdArray1 = coIdArray.filter(v => gameConfig.getCoBasicCfg(v)?.getDisplayCategoryId() === displayCategory);
            if (coIdArray1.length <= 0) {
                continue;
            }

            let hasCo = false;
            for (const force of ForceArray) {
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
        this._setPreviewCoId(this.getOpenData()?.currentCoId ?? CoId.Empty);
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

class RendererForCoName extends UiContainer {
    private readonly _imgCoForce!       : IUiImage;
    private readonly _imgCoHead!        : IUiImage;
    private readonly _groupSelect!      : IUiContainer;
    private readonly _groupSelected!    : IUiContainer;
    private readonly _labelName!        : IUiLabel;

    private _isSelected     = false;
    private _canSelect      = false;
    private _panel          : Panel | null = null;
    private _gameConfig     : GcData | null = null;
    private _coId           : number | null = null;

    public constructor(isBan: boolean) {
        super();

        loadSkinByPath(
            this,
            isBan ? "component/coInfo/CoHead004.exml" : "component/coInfo/CoHead003.exml"
        );
    }

    public updateOnLoadedSkin(): void {
        this.setIsTouchEnabled(true);
        this.setIsTouchChildrenEnabled(false);
        this.setMouseStyle(MouseStyleType.Pointer);
        this.getEventAgent().addPointerEventListener(PointerEventType.Tap, this._onTouchedSelf, this);

        this._updateView();
    }
    private _onTouchedSelf(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        this.getPanel()?.updateOnTouchedCoRenderer(this);
    }

    public setPanel(panel: Panel): void {
        this._panel = panel;
    }
    public getPanel(): Panel | null {
        return this._panel;
    }

    public setGameConfig(config: GcData): void {
        this._gameConfig = config;
    }
    public getGameConfig(): GcData | null {
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
            labelName.setText(UndefinedError);
            imgCoForce.loadSource(``);
            imgCoHead.loadSource(``);
        } else {
            labelName.setText(gcData?.getCoBasicCfg(coId)?.getName() ?? UndefinedError);

            if (gcData == null) {
                imgCoForce.loadSource(``);
                imgCoHead.loadSource(``);
            } else {
                imgCoForce.loadSource(getCoEyeBackgroundByCoId(gcData, coId) ?? ``);
                imgCoHead.loadSource(getCoEye(gcData, coId, true) ?? ``);
            }
        }
    }
}

function createCoContainer(): IUiLayout {
    const layout = new (getUiLayoutClass())({
        itemsHMargin        : 10,
        itemsVMargin        : 10,
        multiItemsPerBlock  : true,
    });
    layout.setUnscaledManualWidth(310);

    return layout;
}

function createSeparator(): IUiImage {
    const img = new (getUiImageClass())();
    img.loadSource(`uncompressedColorWhite0000`);
    img.setUnscaledManualWidth(310);
    img.setUnscaledManualHeight(1);
    img.setIsSmoothing(false);
    return img;
}
