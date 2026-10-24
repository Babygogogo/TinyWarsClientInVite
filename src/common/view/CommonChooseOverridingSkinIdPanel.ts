import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocalDataStorage2 from "../../localData/Storage.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    war         : BaseWarInterfaceIBwWar.IBwWar;
    callback?   : (overridingSkinIdArray: number[] | undefined) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _labelOrigin!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTarget!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listSkin!         : UiInterfacesIUiScrollList.IUiScrollList<DataForSkinRenderer>;

    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnReset!         : UiInterfacesIUiButton.IUiButton;

    private _targetSkinIdArray          : number[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
            { ui: this._btnClose,           callback: this.closePanel },

            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
            { ui: this._btnReset,           callback: this._onTouchedBtnReset },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listSkin.setItemRendererClass(SkinRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._resetTargetSkinIdArray();
        this._updateListSkin();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listSkin.removeAllItems();

        await super._onClosed();
    }

    public getTargetSkinId(playerIndex: number): number | undefined {
        return this._targetSkinIdArray[playerIndex - 1];
    }
    public setTargetSkinId(playerIndex: number, skinId: number): void {
        this._targetSkinIdArray[playerIndex - 1] = skinId;
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0951),
        });
    }

    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        if (war.getActionPlanner().checkIsStateRequesting()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const rawArray      = this._targetSkinIdArray;
        const revisedArray  = checkIsSame(ForceSkinsUtils.getOriginSkinIdArray(openData.war, false), rawArray) ? undefined : rawArray;
        this._checkAnsSaveTargetSkinIdArray(revisedArray);

        war.getTileMap().forEachTile(t => t.flushDataToView());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwOverridingSkinIdChanged);

        openData.callback?.(revisedArray);
        this.closePanel();
    }
    private _onTouchedBtnReset(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        // this._resetTargetSkinIdArray();

        this._targetSkinIdArray = ForceSkinsUtils.getOriginSkinIdArray(openData.war, false);
        this._updateListSkin();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0609);
        this._labelOrigin.setLangText(LangConstants.TextType.B0543);
        this._labelTarget.setLangText(LangConstants.TextType.B1388);
        this._btnConfirm.setLangText(LangConstants.TextType.B0026);
        this._btnReset.setLangText(LangConstants.TextType.B0543);
    }

    private async _updateListSkin(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const originSkinIdArray = ForceSkinsUtils.getOriginSkinIdArray(openData.war, false);
        const length            = originSkinIdArray.length;
        const dataArray         : DataForSkinRenderer[] = [];
        for (let i = 0; i < length; ++i) {
            dataArray.push({
                playerIndex     : i + 1,
                originSkinId    : originSkinIdArray[i],
                showSeparator   : i < length - 1,
                panel           : this,
            });
        }

        this._group.setUnscaledManualWidth(Math.max(300, length * 50 + 70));
        await this._listSkin.bindData(dataArray);
    }

    private _resetTargetSkinIdArray(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            this._targetSkinIdArray = [];
            return;
        }

        this._targetSkinIdArray = ForceSkinsUtils.getRevisedOverridingSkinIdArray(openData.war);
    }
    private _checkAnsSaveTargetSkinIdArray(arr: number[] | undefined): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            const warId = war.getWarId();
            if (warId != null) {
                LocalDataStorage2.setMpwOverridingSkinIdArray(warId, arr);
            }
            return;
        }

        if (war instanceof GameHelpersGhFactory.getHrwWarClass()) {
            const warId = war.getWarId();
            if (warId != null) {
                LocalDataStorage2.setMpwOverridingSkinIdArray(warId, arr);
            }
            return;
        }

        if (war instanceof GameHelpersGhFactory.getRwWarClass()) {
            const replayId = war.getReplayId();
            if (replayId != null) {
                LocalDataStorage2.setRwOverridingSkinIdArray(replayId, arr);
            }
            return;
        }

        if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            const extraData = war.getSaveSlotExtraData();
            if (extraData != null) {
                extraData.setOverridingSkinIdArray(arr ?? []);
            } else {
                war.setSaveSlotExtraData(ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData.fromJson({
                    overridingSkinIdArray   : arr ?? [],
                }));
            }
            return;
        }
    }
}

interface DataForSkinRenderer extends UiTypesUiListItemData.UiListItemData {
    playerIndex     : number;
    originSkinId    : number;
    showSeparator   : boolean;
    panel           : Panel;
}
class SkinRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForSkinRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForSkinRenderer>
{
    private readonly _labelPlayerIndex! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgSrcSkin!       : UiInterfacesIUiImage.IUiImage;
    private readonly _imgDstSkin!       : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSeparator!     : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex   = openData.playerIndex;
        const panel         = openData.panel;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleSkinIdPanel, {
            availableSkinIdArray    : ForceSkinsUtils.getAllSkinIdArray(false),
            currentSkinId           : panel.getTargetSkinId(playerIndex) ?? openData.originSkinId,
            callback                : skinId => {
                panel.setTargetSkinId(playerIndex, skinId);
                this._updateView();
            }
        });
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex   = openData.playerIndex;
        const originSkinId  = openData.originSkinId;
        this._labelPlayerIndex.setText(`P${playerIndex}`);
        this._imgSrcSkin.loadSource(HelpersImageSource.getSkinCircle(openData.originSkinId, true));
        this._imgDstSkin.loadSource(HelpersImageSource.getSkinCircle(openData.panel.getTargetSkinId(playerIndex) ?? originSkinId, true));
        this._imgSeparator.setIsVisible(openData.showSeparator);
    }
}

function checkIsSame(originSkinIdArray: number[], targetSkinIdArray: number[]): boolean {
    for (let i = 0; i < targetSkinIdArray.length; ++i) {
        if (targetSkinIdArray[i] !== originSkinIdArray[i]) {
            return false;
        }
    }

    return true;
}
