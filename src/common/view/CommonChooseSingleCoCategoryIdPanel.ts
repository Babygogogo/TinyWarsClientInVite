import { DisplayCategoryArray, ForceArray, CategoryId } from "../../cos/Constants.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import { getCoEyeBackgroundByCoId, getCoEye } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { MouseStyleType, PointerEventType } from "../../helpers/PointerInput.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
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
    currentCoCategoryId             : number | null;
    availableCoCategoryIdArray      : number[];
    gameConfig                      : GcData;
    isBan                           : boolean;
    callbackOnConfirm               : (coCategoryId: number) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _scrollCoCategory!     : IUiScroller<IUiLayout>;
    private readonly _groupCoCategory!      : IUiLayout;
    private readonly _btnClose!             : IUiButton;

    private readonly _labelTips!            : IUiLabel;
    private readonly _uiCoInfo!             : IUiCoInfo;

    private _renderersForCoNames    : RendererForCoCategory[] = [];

    private _chosenCoCategoryId     : number | null = null;
    private _previewCoCategoryId    : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
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
        const coCategoryId = getExisted(renderer.getCoCategoryId());
        this._setPreviewCoCategoryId(coCategoryId);

        if (renderer.getIsSelected()) {
            this.getOpenData()?.callbackOnConfirm(coCategoryId);
            this.closePanel();
        } else {
            this._chosenCoCategoryId = coCategoryId;
            this._updateComponentsForSelectedCo();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(getText(TextType.B0145));
        this._labelTips.setText(getText(TextType.B1249));
    }

    private _initGroupCoCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const availableCoCategoryIdArray    = openData.availableCoCategoryIdArray;
        this._chosenCoCategoryId            = openData.currentCoCategoryId;

        const renderersForCoNames   = this._renderersForCoNames;
        renderersForCoNames.length  = 0;

        const gameConfig        = openData.gameConfig;
        const coIdArray         = availableCoCategoryIdArray.map(v => gameConfig.getCoIdByCategoryId(v)).sort((v1, v2) => (gameConfig.getCoBasicCfg(v1)?.getName() ?? ``).localeCompare(gameConfig.getCoBasicCfg(v2)?.getName() ?? ``));
        const canSelect         = openData.callbackOnConfirm != null;
        const isBan             = openData.isBan;
        const groupCoCategory   = this._groupCoCategory;
        let isFirstCategory     = true;
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
                    groupCoCategory.addItem(createSeparator(), false);
                }
                hasCo = true;

                const container = createCoContainer();
                for (const coId of coIdArray2) {
                    const renderer = new RendererForCoCategory(isBan);
                    renderer.setGameConfig(gameConfig);
                    renderer.setCoCategoryId(getExisted(gameConfig.getCoBasicCfg(coId)?.getCoCategoryId()));
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
        this._scrollCoCategory.updateOnItemsChanged();
        this._updateComponentsForSelectedCo();
    }

    private _updateGroupCoNames(): void {
        const chosenCoCategoryId = this._chosenCoCategoryId;
        for (const renderer of this._renderersForCoNames) {
            renderer.setIsSelected(chosenCoCategoryId === renderer.getCoCategoryId());
        }
    }

    private _updateComponentsForSelectedCo(): void {
        this._updateGroupCoNames();
    }

    private _initComponentsForPreviewCo(): void {
        this._setPreviewCoCategoryId(CategoryId.Empty);
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

class RendererForCoCategory extends UiContainer {
    private readonly _imgCoForce!       : IUiImage;
    private readonly _imgCoHead!        : IUiImage;
    private readonly _groupSelect!      : IUiContainer;
    private readonly _groupSelected!    : IUiContainer;
    private readonly _labelName!        : IUiLabel;

    private _isSelected     = false;
    private _canSelect      = false;
    private _panel          : Panel | null = null;
    private _gameConfig     : GcData | null = null;
    private _coCategoryId   : number | null = null;

    public constructor(isBan: boolean) {
        super();

        loadSkinByPath(this, isBan
            ? "component/coInfo/CoHead004.exml"
            : "component/coInfo/CoHead003.exml"
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
        this.getPanel()?.updateOnTouchedCoCategoryRenderer(this);
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

    public setCoCategoryId(coCategoryId: number): void {
        this._coCategoryId = coCategoryId;
        this._updateView();
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

        const gcData        = this.getGameConfig();
        const coCategoryId  = this.getCoCategoryId();
        const coId          = coCategoryId == null ? null : gcData?.getCoIdByCategoryId(coCategoryId);
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

        this._labelName.setText(this._gameConfig?.getCoCategoryCfg(getExisted(this._coCategoryId))?.getName() ?? UndefinedError);
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
