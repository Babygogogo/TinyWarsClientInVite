import {
    ForceSkins_Utils,
    HalfwayReplayWar_Model_HrwWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWar,
    FloatText,
    SinglePlayerWar_Model_SpwWar,
    type BaseWar_Interface_IBwWar,
    Notifications_Dispatcher,
    GamePanels_Dict,
    Helpers_ImageSource,
    Lang_Utils,
    GamePanels_Manager,
    LocalData_Storage,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";

export interface OpenData {
    war         : BaseWar_Interface_IBwWar.IBwWar;
    callback?   : (overridingSkinIdArray: number[] | undefined) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelOrigin!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTarget!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listSkin!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForSkinRenderer>;

    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnReset!         : Ui_Interfaces_IUiButton.IUiButton;

    private _targetSkinIdArray          : number[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnHelp,            callback : this._onTouchedBtnHelp },
            { ui : this._btnClose,           callback : this.closePanel },

            { ui : this._btnConfirm,         callback : this._onTouchedBtnConfirm },
            { ui : this._btnReset,           callback : this._onTouchedBtnReset },
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0951),
        });
    }

    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        if (war.getActionPlanner().checkIsStateRequesting()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const rawArray      = this._targetSkinIdArray;
        const revisedArray  = checkIsSame(ForceSkins_Utils.getOriginSkinIdArray(openData.war, false), rawArray) ? undefined : rawArray;
        this._checkAnsSaveTargetSkinIdArray(revisedArray);

        war.getTileMap().forEachTile(t => t.flushDataToView());
        Notifications_Dispatcher.dispatch("BwOverridingSkinIdChanged");

        openData.callback?.(revisedArray);
        this.closePanel();
    }
    private _onTouchedBtnReset(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        // this._resetTargetSkinIdArray();

        this._targetSkinIdArray = ForceSkins_Utils.getOriginSkinIdArray(openData.war, false);
        this._updateListSkin();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0609);
        this._labelOrigin.setLangText(Lang_Constants.TextType.B0543);
        this._labelTarget.setLangText(Lang_Constants.TextType.B1388);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnReset.setLangText(Lang_Constants.TextType.B0543);
    }

    private async _updateListSkin(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const originSkinIdArray = ForceSkins_Utils.getOriginSkinIdArray(openData.war, false);
        const length            = originSkinIdArray.length;
        const dataArray         : DataForSkinRenderer[] = [];
        for (let i = 0; i < length; ++i) {
            dataArray.push({
                playerIndex   : i + 1,
                originSkinId  : originSkinIdArray[i],
                showSeparator : i < length - 1,
                panel         : this,
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

        this._targetSkinIdArray = ForceSkins_Utils.getRevisedOverridingSkinIdArray(openData.war);
    }
    private _checkAnsSaveTargetSkinIdArray(arr: number[] | undefined): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            const warId = war.getWarId();
            if (warId != null) {
                LocalData_Storage.setMpwOverridingSkinIdArray(warId, arr);
            }
            return;
        }

        if (war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) {
            const warId = war.getWarId();
            if (warId != null) {
                LocalData_Storage.setMpwOverridingSkinIdArray(warId, arr);
            }
            return;
        }

        if (war instanceof ReplayWar_Model_RwWar.RwWar) {
            const replayId = war.getReplayId();
            if (replayId != null) {
                LocalData_Storage.setRwOverridingSkinIdArray(replayId, arr);
            }
            return;
        }

        if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            const extraData = war.getSaveSlotExtraData();
            if (extraData != null) {
                extraData.setOverridingSkinIdArray(arr ?? []);
            } else {
                war.setSaveSlotExtraData(SpmWarSaveSlotExtraData.fromJson({
                    overridingSkinIdArray : arr ?? [],
                }));
            }
            return;
        }
    }
}

interface DataForSkinRenderer extends Ui_Types_UiListItemData.UiListItemData {
    playerIndex     : number;
    originSkinId    : number;
    showSeparator   : boolean;
    panel           : Panel;
}
class SkinRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForSkinRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForSkinRenderer> {
    private readonly _labelPlayerIndex! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgSrcSkin!       : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgDstSkin!       : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgSeparator!     : Ui_Interfaces_IUiImage.IUiImage;

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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleSkinIdPanel, {
            availableSkinIdArray : ForceSkins_Utils.getAllSkinIdArray(false),
            currentSkinId        : panel.getTargetSkinId(playerIndex) ?? openData.originSkinId,
            callback             : skinId => {
                panel.setTargetSkinId(playerIndex, skinId);
                this._updateView();
            },
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
        this._imgSrcSkin.loadSource(Helpers_ImageSource.getSkinCircle(openData.originSkinId, true));
        this._imgDstSkin.loadSource(Helpers_ImageSource.getSkinCircle(openData.panel.getTargetSkinId(playerIndex) ?? originSkinId, true));
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
