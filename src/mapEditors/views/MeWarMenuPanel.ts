import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcMapEditor from "../../gameConfig/GcMapEditor.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserSetMapEditorAutoSaveTimeS from "../../proto/schema/CommonProto/NetMessage/MsgUserSetMapEditorAutoSaveTime/S.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UsersProxy from "../../users/Proxy.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

export interface OpenData {
    war     : MapEditorInterfaceIMeWar.IMeWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnAutoSave!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnGameSettings!      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnGotoLobby!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnGotoMapList!       : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserSetMapEditorAutoSaveTime,     callback: this._onNotifyMsgUserSetMapEditorAutoSaveTime },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnAutoSave,            callback: this._onTouchedBtnAutoSave },
            { ui: this._btnGameSettings,        callback: this._onTouchedBtnGameSettings },
            { ui: this._btnGotoLobby,           callback: this._onTouchedBtnGotoLobby },
            { ui: this._btnGotoMapList,         callback: this._onTouchedBtnGotoMapList },
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
        const currValue = UsersModel.getSelfMapEditorAutoSaveTime();
        const minValue  = GameConfigGcMapEditor.AutoSaveConstants.MinAutoSaveTime;
        const maxValue  = GameConfigGcMapEditor.AutoSaveConstants.MaxAutoSaveTime;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0709),
            currentValue    : currValue ?? maxValue,
            minValue        : minValue,
            maxValue        : maxValue,
            getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0246),
            callback        : value => {
                if (value != currValue) {
                    UsersProxy.reqSetMapEditorAutoSaveTime(value);
                }
            },
        });
    }
    private _onTouchedBtnGameSettings(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserSettingsPanel, void 0);
    }
    private _onTouchedBtnGotoLobby(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0054),
            getContent : () => this.getOpenData()?.war.getIsMapModified() ? LangUtils.getText(LangConstants.TextType.A0143) : LangUtils.getText(LangConstants.TextType.A0025),
            callback: () => HelpersGameFlow.gotoLobby(),
        });
    }
    private _onTouchedBtnGotoMapList(): void {
        if (this.getOpenData()?.war.getIsReviewingMap()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().MmReviewListPanel, void 0);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getTitle       : () => LangUtils.getText(LangConstants.TextType.B1275),
                getContent     : () => LangUtils.getText(LangConstants.TextType.A0072),
                callback    : () => HelpersGameFlow.gotoMyWarListPanel(WarTypesConstants.WarTypeId.Me),
            });
        }
    }

    private _onNotifyMsgUserSetMapEditorAutoSaveTime(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserSetMapEditorAutoSaveTimeS.S;
        FloatText2.show(LangUtils.getText(data.getTime() == null ? LangConstants.TextType.A0248 : LangConstants.TextType.A0247));
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
        this._labelTitle.setLangText(LangConstants.TextType.B0155);
        this._btnAutoSave.setLangText(LangConstants.TextType.B0709);
        this._btnGameSettings.setLangText(LangConstants.TextType.B0604);
        this._btnGotoLobby.setLangText(LangConstants.TextType.B0054);
        this._btnGotoMapList.setLangText(LangConstants.TextType.B1275);
    }
}
