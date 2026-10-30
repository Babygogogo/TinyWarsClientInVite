import {
    Medals_Constants,
    GamePanels_Dict,
    GameConfigs_Provider,
    Helpers_ImageSource,
    Lang_Utils,
    Helpers_Collection,
    Users_Model,
    Timer_TimerModel,
    GamePanels_Manager,
    Users_Proxy,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listMedal!        : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMedalRenderer>;
    private readonly _labelNoMedal!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupDesc!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutTime!       : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _layoutObtainTime! : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelObtainTitle! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelObtain!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutExpireTime! : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelExpireTitle! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelExpire!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutShow!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelShow!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgMedal!         : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnHelp,        callback: this._onTouchedBtnHelp },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            { ui: this._btnClose,       callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        const list = this._listMedal;
        list.setItemRendererClass(MedalRenderer);
        list.setMaxSelection(Medals_Constants.Common.MedalMaxShowCount);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listMedal.removeAllItems();

        await super._onClosed();
    }

    public updateOnSetSelectedMedal(): void {
        this._updateComponentsForSelectedMedal();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0402),
        });
    }
    private _onTouchedBtnConfirm(): void {
        const medalId = (this._listMedal.getSelectedDataArray() ?? [])[0]?.medalId;
        if (medalId != Users_Model.getSelfShowMedalIdArray()[0]) {
            Users_Proxy.reqUserSetShowMedalIdArray(Helpers_Collection.getNonNullElements([medalId]));
        }
        this.closePanel();
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
        await this._updateComponentsForListMedal();
        this._updateComponentsForSelectedMedal();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1018);
        this._labelNoMedal.setLangText(Lang_Constants.TextType.A0401);
        this._labelObtainTitle.setLangText(Lang_Constants.TextType.B1020);
        this._labelExpireTitle.setLangText(Lang_Constants.TextType.B1021);
        this._labelShow.setLangText(Lang_Constants.TextType.B1019);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);

        this._layoutExpireTime.arrangeItems();
        this._layoutObtainTime.arrangeItems();
        this._layoutTime.arrangeItems();
        this._groupDesc.arrangeItems();
        this._layoutShow.arrangeItems();
    }

    private async _updateComponentsForSelectedMedal(): Promise<void> {
        const selectedDataArray = this._listMedal.getSelectedDataArray() ?? [];
        const medalId           = (selectedDataArray.length ? selectedDataArray[selectedDataArray.length - 1] : null)?.medalId;
        const imgMedal          = this._imgMedal;
        const groupDesc         = this._groupDesc;
        if (medalId == null) {
            imgMedal.setIsVisible(false);
            groupDesc.setIsVisible(false);
        } else {
            const gameConfig    = await GameConfigs_Provider.getLatestGameConfig();
            imgMedal.setIsVisible(true);
            imgMedal.loadSource(Helpers_ImageSource.getMedal(medalId));

            const medalInfo = Users_Model.getSelfInfo()?.getUserComplexInfo()?.getUserMedalInfo()?.getOwnMedalArray()?.find(v => v.getMedalId() === medalId);
            if (medalInfo == null) {
                groupDesc.setIsVisible(false);
            } else {
                groupDesc.setIsVisible(true);

                const expireTimestamp   = medalInfo.getExpireTimestamp();
                this._labelExpire.setText(expireTimestamp == null ? `--` : getTextForTimestamp(expireTimestamp));
                this._labelObtain.setText(getTextForTimestamp(medalInfo.getObtainTimestamp()));
                this._labelDesc.setText(Lang_Utils.getMedalDesc(medalId) ?? Lang_Constants.UndefinedError);

                this._layoutExpireTime.arrangeItems();
                this._layoutObtainTime.arrangeItems();
                this._layoutTime.arrangeItems();
                this._groupDesc.arrangeItems();
            }
        }
    }
    private async _updateComponentsForListMedal(): Promise<void> {
        const timestamp     = Timer_TimerModel.getServerTimestamp();
        const dataArray     : DataForMedalRenderer[] = [];
        for (const medalInfo of Users_Model.getSelfInfo()?.getUserComplexInfo()?.getUserMedalInfo()?.getOwnMedalArray() ?? []) {
            const expireTimestamp = medalInfo.getExpireTimestamp();
            if ((expireTimestamp == null) || (expireTimestamp >= timestamp)) {
                dataArray.push({
                    medalId : medalInfo.getMedalId(),
                    panel   : this,
                });
            }
        }

        const listMedal     = this._listMedal;
        const labelNoMedal  = this._labelNoMedal;
        if (dataArray.length <= 0) {
            labelNoMedal.setIsVisible(true);
            listMedal.setIsVisible(false);
            await listMedal.removeAllItems();
        } else {
            labelNoMedal.setIsVisible(false);
            listMedal.setIsVisible(true);
            await listMedal.bindData(dataArray);

            const showMedalId = Users_Model.getSelfShowMedalIdArray()[0];
            listMedal.setSelectedItemIndexes([listMedal.getRevisedFirstIndex(v => v?.medalId == showMedalId)]);
        }
    }
}

interface DataForMedalRenderer extends Ui_Types_UiListItemData.UiListItemData {
    medalId     : number;
    panel       : Panel;
}
class MedalRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMedalRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForMedalRenderer>
{
    private readonly _imgMedal! : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgMedal.loadSource(Helpers_ImageSource.getMedal(openData.medalId));
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateOnSetSelectedMedal();
    }
}

function getTextForTimestamp(timestamp: number): string {
    const text1 = Lang_Utils.getTimestampShortText(timestamp, { hour: false, minute: false, second: false });
    const text2 = Lang_Utils.getTimestampShortText(timestamp, { year: false, month: false, date: false });
    return `${text1} ${text2}`;
}
