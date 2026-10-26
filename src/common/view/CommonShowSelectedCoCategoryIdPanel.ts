import { CategoryId } from "../../cos/Constants.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { getCoEyeBackgroundByCoId, getCoEye } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { MouseStyleType, PointerEventType } from "../../helpers/PointerInput.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { MaxValue } from "../../numbers/Constants.ts";
import { PlayerIndex } from "../../players/Constants.ts";
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
import { getUiLabelClass, getUiLayoutClass, getUiImageClass } from "../../ui/utils/UiFactory.ts";
import { loadSkinByPath } from "../../ui/utils/UiSkinHelpers.ts";

export interface OpenData {
    selectedCoCategoryIdDict        : Map<number, number[]>;    // playerIndex, coCategoryId[]
    availableCoCategoryIdArray      : number[];
    gameConfig                      : GameConfig;
    isBan                           : boolean;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;

    private readonly _scrCoCategory!        : IUiScroller<IUiLayout>;
    private readonly _groupCoCategory!      : IUiLayout;

    private readonly _uiCoInfo!             : IUiCoInfo;

    private _renderersForCoNames            : RendererForCoCategory[] = [];

    private _previewCoCategoryId            : number | null = null;

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
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(getText(this.getOpenData()?.isBan ? TextType.B0403 : TextType.B1346));
    }

    private _initGroupCoCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const renderersForCoNames   = this._renderersForCoNames;
        renderersForCoNames.length  = 0;

        const selectedCoCategoryIdDict  = openData.selectedCoCategoryIdDict;
        const gameConfig                = openData.gameConfig;
        const isBan                     = openData.isBan;
        const groupCoCategory           = this._groupCoCategory;
        for (let playerIndex = PlayerIndex.First; playerIndex <= PlayerIndex.Max; ++playerIndex) {
            const selectedCoCategoryIdArray = selectedCoCategoryIdDict.get(playerIndex);
            if (selectedCoCategoryIdArray == null) {
                break;
            }

            {
                const label = new (getUiLabelClass())();
                label.setFontSize(14);
                label.setIsBold(true);
                label.setTextColor(ColorValue.Dark);
                label.setText(`P${playerIndex}: ${selectedCoCategoryIdArray.length}`);
                groupCoCategory.addItem(label, false);
            }

            if (selectedCoCategoryIdArray.length) {
                const coIdArray = selectedCoCategoryIdArray.map(v => gameConfig.getCoIdByCategoryId(v)).sort((v1, v2) => {
                    const cfg1 = gameConfig.getCoBasicCfg(v1);
                    const cfg2 = gameConfig.getCoBasicCfg(v2);
                    if (cfg1 == null) {
                        return 1;
                    } else if (cfg2 == null) {
                        return -1;
                    }

                    const force1    = cfg1.getForce() ?? MaxValue;
                    const force2    = cfg2.getForce() ?? MaxValue;
                    if (force1 !== force2) {
                        return force1 - force2;
                    } else {
                        return cfg1.getName().localeCompare(cfg2.getName());
                    }
                });

                const container = createCoContainer();
                for (const coId of coIdArray) {
                    const renderer = new RendererForCoCategory(isBan);
                    renderer.setGameConfig(gameConfig);
                    renderer.setCoCategoryId(getExisted(gameConfig.getCoBasicCfg(coId)?.getCoCategoryId()));
                    renderer.setPanel(this);
                    renderer.setIsSelected(false);

                    container.addItem(renderer, false);
                    renderersForCoNames.push(renderer);
                }
                container.arrangeItems();
                groupCoCategory.addItem(container, false);
            }

            groupCoCategory.addItem(createSeparator(), false);
        }

        {
            const coCategoryIdSet = new Set(openData.availableCoCategoryIdArray);
            for (const [, coCategoryIdArray] of selectedCoCategoryIdDict) {
                for (const coCategoryId of coCategoryIdArray) {
                    coCategoryIdSet.delete(coCategoryId);
                }
            }

            const restCoIdArray = [...coCategoryIdSet].map(v => gameConfig.getCoIdByCategoryId(v)).sort((v1, v2) => {
                const cfg1 = gameConfig.getCoBasicCfg(v1);
                const cfg2 = gameConfig.getCoBasicCfg(v2);
                if (cfg1 == null) {
                    return 1;
                } else if (cfg2 == null) {
                    return -1;
                }

                const force1    = cfg1.getForce() ?? MaxValue;
                const force2    = cfg2.getForce() ?? MaxValue;
                if (force1 !== force2) {
                    return force1 - force2;
                } else {
                    return cfg1.getName().localeCompare(cfg2.getName());
                }
            });

            {
                const label = new (getUiLabelClass());
                label.setFontSize(14);
                label.setIsBold(true);
                label.setTextColor(ColorValue.Dark);
                label.setText(`${getText(TextType.B1347)}: ${restCoIdArray.length}`);
                groupCoCategory.addItem(label, false);
            }

            {
                const container = createCoContainer();
                for (const coId of restCoIdArray) {
                    const renderer = new RendererForCoCategory(isBan);
                    renderer.setGameConfig(gameConfig);
                    renderer.setCoCategoryId(getExisted(gameConfig.getCoBasicCfg(coId)?.getCoCategoryId()));
                    renderer.setPanel(this);
                    renderer.setIsSelected(false);

                    container.addItem(renderer, false);
                    renderersForCoNames.push(renderer);
                }
                container.arrangeItems();
                groupCoCategory.addItem(container, false);
            }
        }

        groupCoCategory.arrangeItems();
        this._scrCoCategory.updateOnItemsChanged();
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
    private _panel          : Panel | null = null;
    private _gameConfig     : GameConfig | null = null;
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

    public setGameConfig(config: GameConfig): void {
        this._gameConfig = config;
    }
    public getGameConfig(): GameConfig | null {
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

        const gcData    = this.getGameConfig();
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
