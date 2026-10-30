import {
    SinglePlayerWar_Model_SpwWar,
    type BaseWar_Interface_IBwWar,
    Stages_Constants,
    NormalMap_Model_NormalMapModel,
    Lang_Utils,
    Numbers_Utils,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScroller,
} from "../../internal.ts";

export interface OpenData {
    war     : BaseWar_Interface_IBwWar.IBwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTips!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _scrContent!               : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _layoutContent!            : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _layoutMapName!            : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMapNameTitle!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapName!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutMapDesigner!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMapDesignerTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapDesigner!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutTurns!              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTurnsTitle!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTurns!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutOperations!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelOperationsTitle!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelOperations!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutScorePreview!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelScorePreviewTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelScorePreview!        : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,  callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
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
            this._labelTitle.setLangText(Lang_Constants.TextType.B0223);
            this._labelMapNameTitle.setLangText(Lang_Constants.TextType.B0225);
            this._labelMapDesignerTitle.setLangText(Lang_Constants.TextType.B0163);
            this._labelTurnsTitle.setLangText(Lang_Constants.TextType.Turns);
            this._labelOperationsTitle.setLangText(Lang_Constants.TextType.B1292);
            this._labelScorePreviewTitle.setLangText(Lang_Constants.TextType.B1450);
            this._labelTips.setLangText(Lang_Constants.TextType.A0379);
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
                const briefInfo         = await NormalMap_Model_NormalMapModel.getBriefData(normalMapId);
                labelMapName.setText(`#${normalMapId} ${Lang_Utils.getLanguageText({ textArray : briefInfo?.getMapNameArray() }) ?? Lang_Constants.UndefinedError}`);
                labelMapDesigner.setText(`${briefInfo?.getDesignerName() ?? Lang_Constants.UndefinedError}`);
            }
            this._layoutMapName.arrangeItems();
            this._layoutMapDesigner.arrangeItems();
        }

        {
            const layoutContent         = this._layoutContent;
            const layoutScorePreview    = this._layoutScorePreview;
            layoutContent.removeItem(layoutScorePreview, false);

            if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
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
            const scrollerHeight    = Numbers_Utils.getValueInRange({
                rawValue : contentHeight,
                minValue : 160,
                maxValue : Stages_Constants.Dimension.DesignMinHeight - 80,
            });
            scrContent.setUnscaledManualHeight(scrollerHeight);
            scrContent.updateOnItemsChanged();

            this._group.setUnscaledManualHeight(scrollerHeight + 80);
            this._labelTips.setIsVisible(contentHeight > scrollerHeight);
        }
    }
}
