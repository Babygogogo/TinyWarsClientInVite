import { getLatestGameConfig } from "../../gameConfig/GcModel.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { getMedal } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getMedalDesc, getTimestampShortText } from "../../lang/Utils.ts";
import { Common } from "../../medals/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getServerTimestamp } from "../../timer/TimerModel.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getSelfShowMedalIdArray, getSelfInfo } from "../Model.ts";
import { reqUserSetShowMedalIdArray } from "../Proxy.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnHelp!          : IUiButton;
    private readonly _btnClose!         : IUiButton;

    private readonly _listMedal!        : IUiScrollList<DataForMedalRenderer>;
    private readonly _labelNoMedal!     : IUiLabel;

    private readonly _groupDesc!        : IUiLayout;
    private readonly _labelDesc!        : IUiLabel;
    private readonly _layoutTime!       : IUiLayout;

    private readonly _layoutObtainTime! : IUiLayout;
    private readonly _labelObtainTitle! : IUiLabel;
    private readonly _labelObtain!      : IUiLabel;

    private readonly _layoutExpireTime! : IUiLayout;
    private readonly _labelExpireTitle! : IUiLabel;
    private readonly _labelExpire!      : IUiLabel;

    private readonly _layoutShow!       : IUiLayout;
    private readonly _labelShow!        : IUiLabel;
    private readonly _imgMedal!         : IUiImage;

    private readonly _btnConfirm!       : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
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
        list.setMaxSelection(Common.MedalMaxShowCount);
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
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0402),
        });
    }
    private _onTouchedBtnConfirm(): void {
        const medalId = (this._listMedal.getSelectedDataArray() ?? [])[0]?.medalId;
        if (medalId != getSelfShowMedalIdArray()[0]) {
            reqUserSetShowMedalIdArray(getNonNullElements([medalId]));
        }
        this.closePanel();
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
        await this._updateComponentsForListMedal();
        this._updateComponentsForSelectedMedal();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(getText(TextType.B1018));
        this._labelNoMedal.setText(getText(TextType.A0401));
        this._labelObtainTitle.setText(getText(TextType.B1020));
        this._labelExpireTitle.setText(getText(TextType.B1021));
        this._labelShow.setText(getText(TextType.B1019));
        this._btnConfirm.setText(getText(TextType.B0026));

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
            const gameConfig    = await getLatestGameConfig();
            imgMedal.setIsVisible(true);
            imgMedal.loadSource(getMedal(medalId));

            const medalInfo = getSelfInfo()?.getUserComplexInfo()?.getUserMedalInfo()?.getOwnMedalArray()?.find(v => v.getMedalId() === medalId);
            if (medalInfo == null) {
                groupDesc.setIsVisible(false);
            } else {
                groupDesc.setIsVisible(true);

                const expireTimestamp   = medalInfo.getExpireTimestamp();
                this._labelExpire.setText(expireTimestamp == null ? `--` : getTextForTimestamp(expireTimestamp));
                this._labelObtain.setText(getTextForTimestamp(medalInfo.getObtainTimestamp() ?? 0));
                this._labelDesc.setText(getMedalDesc(medalId) ?? UndefinedError);

                this._layoutExpireTime.arrangeItems();
                this._layoutObtainTime.arrangeItems();
                this._layoutTime.arrangeItems();
                this._groupDesc.arrangeItems();
            }
        }
    }
    private async _updateComponentsForListMedal(): Promise<void> {
        const timestamp     = getServerTimestamp();
        const dataArray     : DataForMedalRenderer[] = [];
        for (const medalInfo of getSelfInfo()?.getUserComplexInfo()?.getUserMedalInfo()?.getOwnMedalArray() ?? []) {
            const expireTimestamp = medalInfo.getExpireTimestamp();
            if ((expireTimestamp == null) || (expireTimestamp >= timestamp)) {
                dataArray.push({
                    medalId : getExisted(medalInfo.getMedalId()),
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

            const showMedalId = getSelfShowMedalIdArray()[0];
            listMedal.setSelectedItemIndexes([getExisted(listMedal.getRevisedFirstIndex(v => v?.medalId == showMedalId))]);
        }
    }
}

interface DataForMedalRenderer extends UiListItemData {
    medalId     : number;
    panel       : Panel;
}
class MedalRenderer
    extends     UiListItemRenderer<DataForMedalRenderer>
    implements  IUiListItemRenderer<DataForMedalRenderer>
{
    private readonly _imgMedal! : IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgMedal.loadSource(getMedal(openData.medalId));
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateOnSetSelectedMedal();
    }
}

function getTextForTimestamp(timestamp: number): string {
    const text1 = getTimestampShortText(timestamp, { hour: false, minute: false, second: false });
    const text2 = getTimestampShortText(timestamp, { year: false, month: false, date: false });
    return `${text1} ${text2}`;
}
