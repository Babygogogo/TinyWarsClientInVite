import {
    Helpers_Misc,
    type Notifications_Mapping,
    MapEditors_Constants,
    GamePanels_Dict,
    Users_Model,
    Lang_Utils,
    Helpers_GameFlow,
    GamePanels_Manager,
    Users_Proxy,
    FloatText,
    Lang_Constants,
    Ui_Components_UiPanel,
    WarTypes_Constants,
    type Egret_Egret,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";

export interface OpenData {
    war     : MapEditor_Interface_IMeWar.IMeWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnAutoSave!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnGameSettings!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnGotoLobby!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnGotoMapList!       : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                     callback : this._onNotifyLanguageChanged },
            { type : "MsgUserSetMapEditorAutoSaveTime",     callback : this._onNotifyMsgUserSetMapEditorAutoSaveTime },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._btnAutoSave,            callback : this._onTouchedBtnAutoSave },
            { ui : this._btnGameSettings,        callback : this._onTouchedBtnGameSettings },
            { ui : this._btnGotoLobby,           callback : this._onTouchedBtnGotoLobby },
            { ui : this._btnGotoMapList,         callback : this._onTouchedBtnGotoMapList },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnAutoSave(): void {
        const currValue = Users_Model.getSelfMapEditorAutoSaveTime();
        const minValue  = MapEditors_Constants.AutoSaveConstants.MinAutoSaveTime;
        const maxValue  = MapEditors_Constants.AutoSaveConstants.MaxAutoSaveTime;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputNullableIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0709),
            currentValue : currValue ?? maxValue,
            minValue     : minValue,
            maxValue     : maxValue,
            getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0246),
            callback     : value => {
                if (value != currValue) {
                    Users_Proxy.reqSetMapEditorAutoSaveTime(value);
                }
            },
        });
    }
    private _onTouchedBtnGameSettings(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserSettingsPanel, void 0);
    }
    private _onTouchedBtnGotoLobby(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0054),
            getContent : () => this.getOpenData()?.war.getIsMapModified() ? Lang_Utils.getText(Lang_Constants.TextType.A0143) : Lang_Utils.getText(Lang_Constants.TextType.A0025),
            callback   : () => Helpers_GameFlow.gotoLobby(),
        });
    }
    private _onTouchedBtnGotoMapList(): void {
        if (this.getOpenData()?.war.getIsReviewingMap()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MmReviewListPanel, void 0);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B1275),
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0072),
                callback   : () => Helpers_GameFlow.gotoMyWarListPanel(WarTypes_Constants.WarTypeId.Me),
            });
        }
    }

    private _onNotifyMsgUserSetMapEditorAutoSaveTime(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgUserSetMapEditorAutoSaveTime"]>): void {
        const data = (Helpers_Misc.getExisted(e.data)).msg;
        FloatText.show(Lang_Utils.getText(data.getTime() == null ? Lang_Constants.TextType.A0248 : Lang_Constants.TextType.A0247));
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0155);
        this._btnAutoSave.setLangText(Lang_Constants.TextType.B0709);
        this._btnGameSettings.setLangText(Lang_Constants.TextType.B0604);
        this._btnGotoLobby.setLangText(Lang_Constants.TextType.B0054);
        this._btnGotoMapList.setLangText(Lang_Constants.TextType.B1275);
    }
}
