import { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getLatestGameConfig } from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextureVersionId } from "../../graphics/Constants.ts";
import { getSkinButtonBackground } from "../../helpers/ImageSource.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getTileObjectName,
} from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import type { DataForDrawTileObject } from "../../mapEditor/model/MeTypes.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import {
    getAllTileObjectCfgArray,
    getTileObjectCfg,
} from "../../tileObjects/Utils.ts";
import { ObjectTypeId } from "../../tiles/constants/Common.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getUiTileViewClass } from "../../ui/utils/UiFactory.ts";
import { getSelfSettingsTextureVersion } from "../../users/Model.ts";

const MAX_RECENT_COUNT = 10;

export interface OpenData {
    war     : IMeWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnClose!                     : IUiButton;
    private readonly _btnSwitch!                    : IUiButton;

    private readonly _labelRecentTitle!             : IUiLabel;
    private readonly _listRecent!                   : IUiScrollList<DataForTileObjectRenderer>;
    private readonly _listPlayerIndex!              : IUiScrollList<DataForPlayerIndexRenderer>;
    private readonly _listTileObject!               : IUiScrollList<DataForTileObjectRenderer>;

    private readonly _groupRealTimeAdjust!          : IUiLayout;
    private readonly _groupRealTimeAdjustContainer! : IUiLayout;
    private readonly _imgRealTimeAdjust!            : IUiImage;
    private readonly _labelRealTimeAdjust!          : IUiLabel;
    private readonly _btnHelpRealTimeAdjust!        : IUiButton;

    private readonly _dataListForRecent             : DataForTileObjectRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                   callback : this.closePanel },
            { ui : this._btnSwitch,                  callback : this._onTouchedBtnSwitch },

            { ui : this._groupRealTimeAdjust,        callback : this._onTouchedGroupRealTimeAdjust },
            { ui : this._btnHelpRealTimeAdjust,      callback : this._onTouchedBtnHelpRealTimeAdjust },
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
        const index             = listWarEventId.getRevisedFirstIndex(v => v?.playerIndex === newPlayerIndex);
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
            war                   : war,
            dataForDrawTileObject : data,
            panel                 : this,
            gameConfig            : await getLatestGameConfig(),
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

        openPanel(getDict().MeChooseUnitPanel, {
            war : war,
        });
        this.closePanel();
    }

    private _onTouchedGroupRealTimeAdjust(): void {
        this.getOpenData()?.war.getDrawer().setIsRealTimeAdjust(!this._imgRealTimeAdjust.getIsVisible());
        this._updateImgRealTimeAdjust();

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedBtnHelpRealTimeAdjust(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0032),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0283);
        this._labelRecentTitle.setText(`${getText(TextType.B0372)}:`);
        this._labelRealTimeAdjust.setLangText(TextType.B1121);

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
            if (playerIndex !== PlayerIndex.Neutral) {
                await this._resetListPlayerIndex(playerIndex);
            } else {
                await this._resetListPlayerIndex(getTileObjectCfg(tileObjectData.objectType)?.isNeutralOnly ? null : playerIndex);
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
        for (let playerIndex = PlayerIndex.Neutral; playerIndex <= PlayerIndex.Max; ++playerIndex) {
            dataArray.push({
                playerIndex : playerIndex,
                panel       : this,
            });
        }

        const list = this._listPlayerIndex;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.playerIndex === selectedPlayerIndex));
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
        const gameConfig    = await getLatestGameConfig();
        const dataArray     : DataForTileObjectRenderer[] = [];
        for (const cfg of getAllTileObjectCfgArray()) {
            if ((cfg.tileObjectTypeId === ObjectTypeId.Headquarters) &&
                (playerIndex === PlayerIndex.Neutral)
            ) {
                continue;
            }
            if (((cfg.isNeutralOnly) && (playerIndex != null))  ||
                ((!cfg.isNeutralOnly) && (playerIndex == null))
            ) {
                continue;
            }

            const shapesCount = (getSelfSettingsTextureVersion() === TextureVersionId.V0
                ? (cfg.shapesCountInEditorForV0)
                : (cfg.shapesCountInEditor));
            for (let shapeId = 0; shapeId < shapesCount; ++shapeId) {
                dataArray.push({
                    panel                 : this,
                    gameConfig            : gameConfig,
                    war                   : war,
                    dataForDrawTileObject : {
                        objectType  : cfg.tileObjectTypeId,
                        playerIndex : playerIndex ?? PlayerIndex.Neutral,
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

interface DataForPlayerIndexRenderer extends UiListItemData {
    playerIndex : number | null;
    panel       : Panel;
}
class PlayerIndexRenderer extends UiListItemRenderer<DataForPlayerIndexRenderer> {
    private readonly _labelPlayerIndex! : IUiLabel;
    private readonly _imgBg!            : IUiImage;
    private readonly _imgSelected!      : IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Executor.removeTweens(imgSelected);
        Executor.get(imgSelected, { loop : true })
            .to({ customAlpha : 0.6 }, 500)
            .to({ customAlpha : 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        const playerIndex = this.getOpenData()?.playerIndex;
        this._labelPlayerIndex.setText(playerIndex != null ? `P${playerIndex}` : getText(TextType.B0030));
        this._imgBg.loadSource(getSkinButtonBackground(playerIndex ?? 0));
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.playerIndex, false);
    }
}

interface DataForTileObjectRenderer extends UiListItemData {
    dataForDrawTileObject   : DataForDrawTileObject;
    gameConfig              : GameConfig;
    panel                   : Panel;
    war                     : IMeWar;
}
class TileObjectRenderer extends UiListItemRenderer<DataForTileObjectRenderer> {
    private readonly _group!        : IUiContainer;
    private readonly _labelName!    : IUiLabel;
    private readonly _conTileView!  : IUiContainer;

    private _tileView   = new (getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : TypeId.TileAnimationTick,  callback : this._onNotifyTileAnimationTick },
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
        this._labelName.setText(`${getTileObjectName(tileObjectType, gameConfig)} ${shapeId}`);
        tileView.init({
            tileObjectType        : tileObjectType,
            tileObjectShapeId     : shapeId,
            tileBaseShapeId       : null,
            tileBaseType          : null,
            tileDecorationType    : null,
            tileDecorationShapeId : null,
            skinId                : dataForDrawTileObject.playerIndex,
            overridingSkinId      : undefined,
            gameConfig            : gameConfig,
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
