import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as StagesConstants from "../../stages/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";

export interface OpenData {
    war     : BaseWarInterfaceIBwWar.IBwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTips!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _scrContent!               : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiLayout.IUiLayout>;
    private readonly _layoutContent!            : UiInterfacesIUiLayout.IUiLayout;

    private readonly _layoutMapName!            : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMapNameTitle!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapName!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutMapDesigner!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMapDesignerTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapDesigner!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutTurns!              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTurnsTitle!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTurns!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutOperations!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelOperationsTitle!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelOperations!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutScorePreview!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelScorePreviewTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelScorePreview!        : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,  callback: this._onNotifyLanguageChanged },
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
            this._labelTitle.setLangText(LangConstants.TextType.B0223);
            this._labelMapNameTitle.setLangText(LangConstants.TextType.B0225);
            this._labelMapDesignerTitle.setLangText(LangConstants.TextType.B0163);
            this._labelTurnsTitle.setLangText(LangConstants.TextType.Turns);
            this._labelOperationsTitle.setLangText(LangConstants.TextType.B1292);
            this._labelScorePreviewTitle.setLangText(LangConstants.TextType.B1450);
            this._labelTips.setLangText(LangConstants.TextType.A0379);
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
                const briefInfo         = await NormalMapModelNormalMapModel.getBriefData(normalMapId);
                labelMapName.setText(`#${normalMapId} ${LangUtils.getLanguageText({ textArray: briefInfo?.getMapNameArray() }) ?? LangConstants.UndefinedError}`);
                labelMapDesigner.setText(`${briefInfo?.getDesignerName() ?? LangConstants.UndefinedError}`);
            }
            this._layoutMapName.arrangeItems();
            this._layoutMapDesigner.arrangeItems();
        }

        {
            const layoutContent         = this._layoutContent;
            const layoutScorePreview    = this._layoutScorePreview;
            layoutContent.removeItem(layoutScorePreview, false);

            if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
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
            const scrollerHeight    = NumbersUtils.getValueInRange({
                rawValue    : contentHeight,
                minValue    : 160,
                maxValue    : StagesConstants.Dimension.DesignMinHeight - 80,
            });
            scrContent.setUnscaledManualHeight(scrollerHeight);
            scrContent.updateOnItemsChanged();

            this._group.setUnscaledManualHeight(scrollerHeight + 80);
            this._labelTips.setIsVisible(contentHeight > scrollerHeight);
        }
    }
}
