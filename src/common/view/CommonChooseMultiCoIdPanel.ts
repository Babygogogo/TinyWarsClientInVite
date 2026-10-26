import { DisplayCategoryArray, ForceArray, CoId } from "../../cos/Constants.ts";
import { show } from "../../FloatText.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getCoEyeBackgroundByCoId, getCoEye } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { MouseStyleType, PointerEventType } from "../../helpers/PointerInput.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getFormattedText, getText } from "../../lang/Utils.ts";
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
    gameConfig          : GameConfig;
    currentCoIdArray    : number[];
    availableCoIdArray  : number[];
    maxChooseCount      : number | null;
    minChooseCount      : number | null;
    isBan               : boolean;
    callbackOnConfirm   : (coIdArray: number[]) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelAvailableCoTitle!    : IUiLabel;
    private readonly _btnClose!                 : IUiButton;
    private readonly _btnConfirm!               : IUiButton;

    private readonly _groupSelected!            : IUiLayout;
    private readonly _labelSelectedTitle!       : IUiLabel;
    private readonly _labelSelected!            : IUiLabel;

    private readonly _groupSelectAll!           : IUiLayout;
    private readonly _labelSelectAll!           : IUiLabel;
    private readonly _imgSelectAll!             : IUiImage;

    private readonly _scrCoNames!               : IUiScroller<IUiLayout>;
    private readonly _groupCoNames!             : IUiLayout;
    private readonly _uiCoInfo!                 : IUiCoInfo;

    private _renderersForCoNames    : RendererForCoName[] = [];

    private _chosenCoIdSet  = new Set<number>();
    private _previewCoId    : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._groupSelectAll, callback: this._onTouchedGroupSelectAll },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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

        this._initButtons();
        this._initGroupCoNames();
        this._initGroupSelectAll();
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

    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const chosenCoIdSet = this._chosenCoIdSet;
        {
            const maxCount = openData.maxChooseCount;
            if ((maxCount != null) && (chosenCoIdSet.size > maxCount)) {
                show(getFormattedText(TextType.F0145, maxCount));
                return;
            }
        }
        {
            const minCount = openData.minChooseCount;
            if ((minCount != null) && (chosenCoIdSet.size < minCount)) {
                show(getFormattedText(TextType.F0150, minCount));
                return;
            }
        }

        const callback = openData.callbackOnConfirm;
        if (callback) {
            callback([...chosenCoIdSet]);
        }

        this.closePanel();
    }

    private _onTouchedGroupSelectAll(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const chosenCoIdSet = this._chosenCoIdSet;
        chosenCoIdSet.clear();
        if (!this._imgSelectAll.getIsVisible()) {
            for (const coId of this.getOpenData()?.availableCoIdArray ?? []) {
                chosenCoIdSet.add(coId);
            }
        }

        this._updateComponentsForSelectedCo();
    }

    public updateOnTouchedCoNameRenderer(renderer: RendererForCoName): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const coId = getExisted(renderer.getCoId());
        this._setPreviewCoId(coId);

        const chosenCoIdSet = this._chosenCoIdSet;
        if (renderer.getIsSelected()) {
            const minCount = openData.minChooseCount;
            if ((minCount != null) && (chosenCoIdSet.size <= minCount)) {
                if (minCount !== 1) {
                    show(getFormattedText(TextType.F0150, minCount));
                }
                return;
            }

            chosenCoIdSet.delete(coId);
            this._updateComponentsForSelectedCo();

        } else {
            const maxCount = openData.maxChooseCount;
            if ((maxCount != null) && (chosenCoIdSet.size >= maxCount)) {
                if (maxCount == 1) {
                    chosenCoIdSet.clear();
                } else {
                    show(getFormattedText(TextType.F0145, maxCount));
                    return;
                }
            }

            chosenCoIdSet.add(coId);
            this._updateComponentsForSelectedCo();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelAvailableCoTitle.setText(getText(this.getOpenData()?.maxChooseCount === 1 ? TextType.B0145 : TextType.B0898));
        this._labelSelectedTitle.setText(getText(TextType.B1274));
        this._labelSelectAll.setText(getText(TextType.B0761));
        this._btnConfirm.setText(getText(TextType.B0026));

        this._groupSelectAll.arrangeItems();
        this._groupSelected.arrangeItems();
    }

    private _initButtons(): void {
        this._btnConfirm.setIsVisible(this.getOpenData()?.callbackOnConfirm != null);
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

        const isBan                 = openData.isBan;
        const canSelect             = openData.callbackOnConfirm != null;
        const groupCoNames          = this._groupCoNames;
        let isFirstCategory         = true;
        for (const displayCategory of DisplayCategoryArray) {
            const coIdArray1 = availableCoIdArray.filter(v => gameConfig.getCoBasicCfg(v)?.getDisplayCategoryId() === displayCategory);
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
                    renderer.setPanel(this);
                    renderer.setGameConfig(gameConfig);
                    renderer.setCoId(coId);
                    renderer.setIsSelected(false);
                    renderer.setCanSelect(canSelect);

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
        this._scrCoNames.updateOnItemsChanged();
        this._updateComponentsForSelectedCo();
    }

    private _updateGroupCoNames(): void {
        const chosenCoIdSet = this._chosenCoIdSet;
        for (const renderer of this._renderersForCoNames) {
            renderer.setIsSelected(chosenCoIdSet.has(getExisted(renderer.getCoId())));
        }
    }

    private _initGroupSelectAll(): void {
        const openData          = this.getOpenData();
        const maxChooseCount    = openData?.maxChooseCount;
        this._groupSelectAll.setIsVisible(
            (openData?.callbackOnConfirm != null)                                                   &&
            ((maxChooseCount == null) || (maxChooseCount >= openData.availableCoIdArray.length))
        );

        this._updateImgSelectAll();
    }

    private _updateComponentsForSelectedCo(): void {
        this._updateGroupCoNames();
        this._updateLabelSelected();
        this._updateImgSelectAll();
    }
    private _updateLabelSelected(): void {
        this._labelSelected.setText(`${this._chosenCoIdSet.size} / ${this.getOpenData()?.maxChooseCount ?? `--`}`);
        this._groupSelected.arrangeItems();
    }
    private _updateImgSelectAll(): void {
        this._imgSelectAll.setIsVisible(this._chosenCoIdSet.size >= (this.getOpenData()?.availableCoIdArray.length ?? 0));
    }

    private _initComponentsForPreviewCo(): void {
        this._setPreviewCoId(CoId.Empty);
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

    private _panel?         : Panel;
    private _gameConfig     : GameConfig | null = null;
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
        this.getPanel()?.updateOnTouchedCoNameRenderer(this);
    }

    public setPanel(panel: Panel): void {
        this._panel = panel;
    }
    public getPanel(): Panel | undefined {
        return this._panel;
    }

    public setGameConfig(config: GameConfig): void {
        this._gameConfig = config;
    }
    public getGameConfig(): GameConfig | null {
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

        const coId          = this.getCoId();
        const labelName     = this._labelName;
        const imgCoForce    = this._imgCoForce;
        const imgCoHead     = this._imgCoHead;
        if (coId == null) {
            labelName.setText(UndefinedError);
            imgCoForce.loadSource(``);
            imgCoHead.loadSource(``);
        } else {
            const gcData = this.getGameConfig();
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
