import type { IBwWar } from "../interface/IBwWar.ts";
import { getSpwWarClass } from "../../gameHelpers/GhFactory.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getLanguageText } from "../../lang/Utils.ts";
import { getBriefData } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { Dimension } from "../../stages/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";

export interface OpenData {
    war     : IBwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _btnClose!                 : IUiButton;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _labelTips!                : IUiLabel;

    private readonly _scrContent!               : IUiScroller<IUiLayout>;
    private readonly _layoutContent!            : IUiLayout;

    private readonly _layoutMapName!            : IUiLayout;
    private readonly _labelMapNameTitle!        : IUiLabel;
    private readonly _labelMapName!             : IUiLabel;

    private readonly _layoutMapDesigner!        : IUiLayout;
    private readonly _labelMapDesignerTitle!    : IUiLabel;
    private readonly _labelMapDesigner!         : IUiLabel;

    private readonly _layoutTurns!              : IUiLayout;
    private readonly _labelTurnsTitle!          : IUiLabel;
    private readonly _labelTurns!               : IUiLabel;

    private readonly _layoutOperations!         : IUiLayout;
    private readonly _labelOperationsTitle!     : IUiLabel;
    private readonly _labelOperations!          : IUiLabel;

    private readonly _layoutScorePreview!       : IUiLayout;
    private readonly _labelScorePreviewTitle!   : IUiLabel;
    private readonly _labelScorePreview!        : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,  callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
        this._scrContent.scrollTop();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }

    private async _updateView(): Promise<void> {
        {
            this._labelTitle.setLangText(TextType.B0223);
            this._labelMapNameTitle.setLangText(TextType.B0225);
            this._labelMapDesignerTitle.setLangText(TextType.B0163);
            this._labelTurnsTitle.setLangText(TextType.Turns);
            this._labelOperationsTitle.setLangText(TextType.B1292);
            this._labelScorePreviewTitle.setLangText(TextType.B1450);
            this._labelTips.setLangText(TextType.A0379);
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        {
            const commonSettingsManager = war.getCommonSettingManager();
            const labelOperations       = this._labelOperations;
            this._labelTurns.setText(`${war.getTurnManager().getTurnIndex()} / ${commonSettingsManager.getTurnsLimit()}`);
            labelOperations.setText(`${war.getExecutedOperationManager().getExecutedOperationsCount()} / ${commonSettingsManager.getWarOperationsLimit()}`);
            this._layoutTurns.arrangeItems();
            this._layoutOperations.arrangeItems();
        }

        {
            const normalMapId       = war.getNormalMapId();
            const labelMapName      = this._labelMapName;
            const labelMapDesigner  = this._labelMapDesigner;
            if (normalMapId == null) {
                labelMapName.setText(`--`);
                labelMapDesigner.setText(`--`);
            } else {
                const briefInfo         = await getBriefData(normalMapId);
                labelMapName.setText(`#${normalMapId} ${getLanguageText({ textArray: briefInfo?.getMapNameArray() }) ?? UndefinedError}`);
                labelMapDesigner.setText(`${briefInfo?.getDesignerName() ?? UndefinedError}`);
            }
            this._layoutMapName.arrangeItems();
            this._layoutMapDesigner.arrangeItems();
        }

        {
            const layoutContent         = this._layoutContent;
            const layoutScorePreview    = this._layoutScorePreview;
            layoutContent.removeItem(layoutScorePreview, false);

            if (war instanceof getSpwWarClass()) {
                layoutContent.addItem(layoutScorePreview, false);
                this._labelScorePreview.setText(`${war.calculateTotalScore()}`);
                layoutScorePreview.arrangeItems();
            }
        }

        {
            const layoutContent = this._layoutContent;
            layoutContent.arrangeItems();

            const scrContent        = this._scrContent;
            const contentHeight     = layoutContent.getScaledHeight();
            const scrollerHeight    = getValueInRange({
                rawValue    : contentHeight,
                minValue    : 160,
                maxValue    : Dimension.DesignMinHeight - 80,
            });
            scrContent.setUnscaledManualHeight(scrollerHeight);
            scrContent.updateOnItemsChanged();

            this._group.setUnscaledManualHeight(scrollerHeight + 80);
            this._labelTips.setIsVisible(contentHeight > scrollerHeight);
        }
    }
}
