import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import type * as MapEditorModelMeTypes from "../../mapEditor/model/MeTypes.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UsersModel from "../../users/Model.ts";

type DataForDrawTileObject  = MapEditorModelMeTypes.DataForDrawTileObject;

const MAX_RECENT_COUNT = 10;

export interface OpenData {
    war     : MapEditorInterfaceIMeWar.IMeWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSwitch!                    : UiInterfacesIUiButton.IUiButton;

    private readonly _labelRecentTitle!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listRecent!                   : UiInterfacesIUiScrollList.IUiScrollList<DataForTileObjectRenderer>;
    private readonly _listPlayerIndex!              : UiInterfacesIUiScrollList.IUiScrollList<DataForPlayerIndexRenderer>;
    private readonly _listTileObject!               : UiInterfacesIUiScrollList.IUiScrollList<DataForTileObjectRenderer>;

    private readonly _groupRealTimeAdjust!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupRealTimeAdjustContainer! : UiInterfacesIUiLayout.IUiLayout;
    private readonly _imgRealTimeAdjust!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelRealTimeAdjust!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelpRealTimeAdjust!        : UiInterfacesIUiButton.IUiButton;

    private readonly _dataListForRecent             : DataForTileObjectRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },
            { ui: this._btnSwitch,                  callback: this._onTouchedBtnSwitch },

            { ui: this._groupRealTimeAdjust,        callback: this._onTouchedGroupRealTimeAdjust },
            { ui: this._btnHelpRealTimeAdjust,      callback: this._onTouchedBtnHelpRealTimeAdjust },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listPlayerIndex.setItemRendererClass(PlayerIndexRenderer);
        this._listRecent.setItemRendererClass(TileObjectRenderer);
        this._listTileObject.setItemRendererClass(TileObjectRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listPlayerIndex.removeAllItems(),
            this._listRecent.removeAllItems(),
            this._listTileObject.removeAllItems(),
        ]);
        await super._onClosed();
    }

    public async setAndReviseSelectedPlayerIndex(newPlayerIndex: number | null, needScroll: boolean): Promise<void> {
        const listWarEventId    = this._listPlayerIndex;
        const index             = HelpersMisc.getExisted(listWarEventId.getRevisedFirstIndex(v => v?.playerIndex === newPlayerIndex));
        listWarEventId.setSelectedItemIndex(index);
        if (needScroll) {
            listWarEventId.scrollToItem(index);
        }

        await this._updateListTileObject();
    }

    public async updateOnChooseTileObject(data: DataForDrawTileObject): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const dataList      = this._dataListForRecent;
        const filteredList  = dataList.filter(v => {
            const oldData = v.dataForDrawTileObject;
            return (oldData.objectType != data.objectType)
                || (oldData.playerIndex != data.playerIndex)
                || (oldData.shapeId != data.shapeId);
        });
        dataList.length     = 0;
        dataList[0]         = {
            war                     : war,
            dataForDrawTileObject   : data,
            panel                   : this,
            gameConfig              : await GameConfigGcModel.getLatestGameConfig(),
        };
        for (const v of filteredList) {
            if (dataList.length < MAX_RECENT_COUNT) {
                dataList.push(v);
            } else {
                break;
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnSwitch(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeChooseUnitPanel, {
            war : war,
        });
        this.closePanel();
    }

    private _onTouchedGroupRealTimeAdjust(): void {
        this.getOpenData()?.war.getDrawer().setIsRealTimeAdjust(!this._imgRealTimeAdjust.getIsVisible());
        this._updateImgRealTimeAdjust();

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedBtnHelpRealTimeAdjust(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0032),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0283);
        this._labelRecentTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0372)}:`);
        this._labelRealTimeAdjust.setLangText(LangConstants.TextType.B1121);

        this._groupRealTimeAdjust.arrangeItems();
        this._groupRealTimeAdjustContainer.arrangeItems();
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        this._updateComponentsForLanguage();

        const recentData = this._dataListForRecent[0];
        if (recentData == null) {
            await this._resetListPlayerIndex(null);
        } else {
            const tileObjectData    = recentData.dataForDrawTileObject;
            const playerIndex       = tileObjectData.playerIndex;
            if (playerIndex !== PlayersConstants.PlayerIndex.Neutral) {
                await this._resetListPlayerIndex(playerIndex);
            } else {
                await this._resetListPlayerIndex(recentData.gameConfig.getTileObjectCfg(tileObjectData.objectType)?.isNeutralOnly ? null : playerIndex);
            }
        }

        await this._updateListRecent();
        await this._updateListTileObject();
        this._updateImgRealTimeAdjust();
    }

    private async _resetListPlayerIndex(selectedPlayerIndex: number | null): Promise<void> {
        const dataArray: DataForPlayerIndexRenderer[] = [{
            playerIndex : null,
            panel       : this,
        }];
        for (let playerIndex = PlayersConstants.PlayerIndex.Neutral; playerIndex <= PlayersConstants.PlayerIndex.Max; ++playerIndex) {
            dataArray.push({
                playerIndex : playerIndex,
                panel       : this,
            });
        }

        const list = this._listPlayerIndex;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.playerIndex === selectedPlayerIndex) ?? (dataArray.length ? 0 : -1));
    }

    private async _updateListTileObject(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const selectedData      = this._listPlayerIndex.getFirstSelectedData();
        const listTileObject    = this._listTileObject;
        if (selectedData == null) {
            await listTileObject.removeAllItems();
            return;
        }

        const playerIndex   = selectedData.playerIndex;
        const gameConfig    = await GameConfigGcModel.getLatestGameConfig();
        const dataArray     : DataForTileObjectRenderer[] = [];
        for (const cfg of gameConfig.getAllTileObjectCfgArray()) {
            if ((cfg.tileObjectTypeId === TilesConstantsCommon.ObjectTypeId.Headquarters) &&
                (playerIndex === PlayersConstants.PlayerIndex.Neutral)
            ) {
                continue;
            }
            if (((cfg.isNeutralOnly) && (playerIndex != null))  ||
                ((!cfg.isNeutralOnly) && (playerIndex == null))
            ) {
                continue;
            }

            const shapesCount = HelpersMisc.getExisted(UsersModel.getSelfSettingsTextureVersion() === GraphicsConstants.TextureVersionId.V0
                ? (cfg.shapesCountInEditorForV0 ?? cfg.shapesCountForV0)
                : (cfg.shapesCountInEditor ?? cfg.shapesCount)
            );
            for (let shapeId = 0; shapeId < shapesCount; ++shapeId) {
                dataArray.push({
                    panel                   : this,
                    gameConfig              : gameConfig,
                    war                     : war,
                    dataForDrawTileObject   : {
                        objectType  : cfg.tileObjectTypeId,
                        playerIndex : playerIndex ?? PlayersConstants.PlayerIndex.Neutral,
                        shapeId     : shapeId,
                    },
                });
            }
        }

        await listTileObject.bindData(dataArray);
    }

    private async _updateListRecent(): Promise<void> {
        const list = this._listRecent;
        await list.bindData(this._dataListForRecent);
        list.scrollTop();
    }

    private _updateImgRealTimeAdjust(): void {
        this._imgRealTimeAdjust.setIsVisible(!!this.getOpenData()?.war.getDrawer().getIsRealTimeAdjust());
    }
}

interface DataForPlayerIndexRenderer extends UiTypesUiListItemData.UiListItemData {
    playerIndex : number | null;
    panel       : Panel;
}
class PlayerIndexRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForPlayerIndexRenderer> {
    private readonly _labelPlayerIndex! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSelected!      : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        TweenExecutor.Executor.removeTweens(imgSelected);
        TweenExecutor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        TweenExecutor.Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        const playerIndex = this.getOpenData()?.playerIndex;
        this._labelPlayerIndex.setText(playerIndex != null ? `P${playerIndex}` : LangUtils.getText(LangConstants.TextType.B0030));
        this._imgBg.loadSource(HelpersImageSource.getSkinButtonBackground(playerIndex ?? 0));
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.playerIndex, false);
    }
}

interface DataForTileObjectRenderer extends UiTypesUiListItemData.UiListItemData {
    dataForDrawTileObject   : DataForDrawTileObject;
    gameConfig              : GameConfigGcData.GcData;
    panel                   : Panel;
    war                     : MapEditorInterfaceIMeWar.IMeWar;
}
class TileObjectRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTileObjectRenderer> {
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _conTileView!  : UiInterfacesIUiContainer.IUiContainer;

    private _tileView   = new (UiUtilsUiFactory.getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
        ]);
        this._applySettingsForWholeTouch();

        const tileView      = this._tileView;
        const conTileView   = this._conTileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgObject());
        tileView.startRunningView();
    }

    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataForDrawTileObject = openData.dataForDrawTileObject;
        const gameConfig            = openData.gameConfig;
        const tileObjectType        = dataForDrawTileObject.objectType;
        const shapeId               = dataForDrawTileObject.shapeId;
        const tileView              = this._tileView;
        this._labelName.setText(`${LangUtils.getTileObjectName(tileObjectType, gameConfig)} ${shapeId}`);
        tileView.init({
            tileObjectType          : tileObjectType,
            tileObjectShapeId       : shapeId,
            tileBaseShapeId         : null,
            tileBaseType            : null,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            skinId                  : dataForDrawTileObject.playerIndex,
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        });
        tileView.updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const panel                 = openData.panel;
        const dataForDrawTileObject = openData.dataForDrawTileObject;
        panel.updateOnChooseTileObject(dataForDrawTileObject);
        panel.closePanel();
        openData.war.getDrawer().setModeDrawTileObject(dataForDrawTileObject);
    }
}
