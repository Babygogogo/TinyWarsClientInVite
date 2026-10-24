import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MedalsConstants from "../../medals/Constants.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _listMedal!        : UiInterfacesIUiScrollList.IUiScrollList<DataForMedalRenderer>;
    private readonly _labelNoMedal!     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupDesc!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutTime!       : UiInterfacesIUiLayout.IUiLayout;

    private readonly _layoutObtainTime! : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelObtainTitle! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelObtain!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutExpireTime! : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelExpireTitle! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelExpire!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutShow!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelShow!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgMedal!         : UiInterfacesIUiImage.IUiImage;

    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
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
        list.setMaxSelection(MedalsConstants.Common.MedalMaxShowCount);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0402),
        });
    }
    private _onTouchedBtnConfirm(): void {
        const medalId = (this._listMedal.getSelectedDataArray() ?? [])[0]?.medalId;
        if (medalId != UsersModel.getSelfShowMedalIdArray()[0]) {
            UsersProxy.reqUserSetShowMedalIdArray(HelpersCollection.getNonNullElements([medalId]));
        }
        this.closePanel();
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
        await this._updateComponentsForListMedal();
        this._updateComponentsForSelectedMedal();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1018));
        this._labelNoMedal.setText(LangUtils.getText(LangConstants.TextType.A0401));
        this._labelObtainTitle.setText(LangUtils.getText(LangConstants.TextType.B1020));
        this._labelExpireTitle.setText(LangUtils.getText(LangConstants.TextType.B1021));
        this._labelShow.setText(LangUtils.getText(LangConstants.TextType.B1019));
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));

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
            const gameConfig    = await GameConfigGcModel.getLatestGameConfig();
            imgMedal.setIsVisible(true);
            imgMedal.loadSource(HelpersImageSource.getMedal(medalId));

            const medalInfo = UsersModel.getSelfInfo()?.getUserComplexInfo()?.getUserMedalInfo()?.getOwnMedalArray()?.find(v => v.getMedalId() === medalId);
            if (medalInfo == null) {
                groupDesc.setIsVisible(false);
            } else {
                groupDesc.setIsVisible(true);

                const expireTimestamp   = medalInfo.getExpireTimestamp();
                this._labelExpire.setText(expireTimestamp == null ? `--` : getTextForTimestamp(expireTimestamp));
                this._labelObtain.setText(getTextForTimestamp(medalInfo.getObtainTimestamp() ?? 0));
                this._labelDesc.setText(LangUtils.getMedalDesc(medalId) ?? LangConstants.UndefinedError);

                this._layoutExpireTime.arrangeItems();
                this._layoutObtainTime.arrangeItems();
                this._layoutTime.arrangeItems();
                this._groupDesc.arrangeItems();
            }
        }
    }
    private async _updateComponentsForListMedal(): Promise<void> {
        const timestamp     = TimerTimerModel.getServerTimestamp();
        const dataArray     : DataForMedalRenderer[] = [];
        for (const medalInfo of UsersModel.getSelfInfo()?.getUserComplexInfo()?.getUserMedalInfo()?.getOwnMedalArray() ?? []) {
            const expireTimestamp = medalInfo.getExpireTimestamp();
            if ((expireTimestamp == null) || (expireTimestamp >= timestamp)) {
                dataArray.push({
                    medalId : HelpersMisc.getExisted(medalInfo.getMedalId()),
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

            const showMedalId = UsersModel.getSelfShowMedalIdArray()[0];
            listMedal.setSelectedItemIndexes([HelpersMisc.getExisted(listMedal.getRevisedFirstIndex(v => v?.medalId == showMedalId))]);
        }
    }
}

interface DataForMedalRenderer extends UiTypesUiListItemData.UiListItemData {
    medalId     : number;
    panel       : Panel;
}
class MedalRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMedalRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForMedalRenderer>
{
    private readonly _imgMedal! : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgMedal.loadSource(HelpersImageSource.getMedal(openData.medalId));
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateOnSetSelectedMedal();
    }
}

function getTextForTimestamp(timestamp: number): string {
    const text1 = LangUtils.getTimestampShortText(timestamp, { hour: false, minute: false, second: false });
    const text2 = LangUtils.getTimestampShortText(timestamp, { year: false, month: false, date: false });
    return `${text1} ${text2}`;
}
