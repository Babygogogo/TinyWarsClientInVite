import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as MapEditorModelMeModel from "../../mapEditor/model/MeModel.ts";
import type * as MapEditorModelMeTypes from "../../mapEditor/model/MeTypes.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
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

    private readonly _listType!                     : UiInterfacesIUiScrollList.IUiScrollList<DataForTypeRenderer>;
    private readonly _listTileDecoration!           : UiInterfacesIUiScrollList.IUiScrollList<DataForTileDecorationRenderer>;
    private readonly _listRecent!                   : UiInterfacesIUiScrollList.IUiScrollList<DataForTileDecorationRenderer>;
    private readonly _labelRecentTitle!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupRealTimeAdjust!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupRealTimeAdjustContainer! : UiInterfacesIUiLayout.IUiLayout;
    private readonly _imgRealTimeAdjust!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelRealTimeAdjust!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelpRealTimeAdjust!        : UiInterfacesIUiButton.IUiButton;

    private _dataListForRecent  : DataForTileDecorationRenderer[] = [];

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

        this._listType.setItemRendererClass(TypeRenderer);
        this._listTileDecoration.setItemRendererClass(TileDecorationRenderer);
        this._listRecent.setItemRendererClass(TileDecorationRenderer);
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
            this._listRecent.removeAllItems(),
            this._listTileDecoration.removeAllItems(),
            this._listType.removeAllItems(),
        ]);
        await super._onClosed();
    }

    public async setAndReviseSelectedPlayerIndex(newType: number | null, needScroll: boolean): Promise<void> {
        const listType  = this._listType;
        const index     = HelpersMisc.getExisted(listType.getRevisedFirstIndex(v => v?.decorationType === newType));
        listType.setSelectedItemIndex(index);
        await this._updateListTileDecoration();

        if (needScroll) {
            listType.scrollToItem(index);
        }
    }

    public async updateOnChooseTileDecoration(data: MapEditorModelMeTypes.DataForDrawTileDecoration): Promise<void> {
        const dataList      = this._dataListForRecent;
        const filteredList  = dataList.filter(v => {
            const oldData = v.dataForDrawTileDecoration;
            return (oldData.decorationType != data.decorationType)
                || (oldData.shapeId != data.shapeId);
        });
        dataList.length     = 0;
        dataList[0]         = {
            dataForDrawTileDecoration   : data,
            panel                       : this,
            gameConfig                  : HelpersMisc.getExisted(MapEditorModelMeModel.getWar()?.getGcData()),
        };
        for (const v of filteredList) {
            if (dataList.length < MAX_RECENT_COUNT) {
                dataList.push(v);
            } else {
                break;
            }
        }
        await this._updateListRecent();
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeChooseTileObjectPanel, {
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
        this._labelTitle.setLangText(LangConstants.TextType.B0662);
        this._labelRecentTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0372)}:`);
        this._labelRealTimeAdjust.setLangText(LangConstants.TextType.B1121);

        this._groupRealTimeAdjust.arrangeItems();
        this._groupRealTimeAdjustContainer.arrangeItems();
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        await this._updateListType(this._dataListForRecent[0]?.dataForDrawTileDecoration.decorationType);
        await this._updateListTileDecoration();
        await this._updateListRecent();
        this._updateImgRealTimeAdjust();
    }

    private _createDataForListTileDecoration(): DataForTileDecorationRenderer[] {
        const gameConfig        = HelpersMisc.getExisted(MapEditorModelMeModel.getWar()?.getGcData());
        const decorationType    = this._listType.getFirstSelectedData()?.decorationType;
        const dataList          : DataForTileDecorationRenderer[] = [];
        if (decorationType != null) {
            const cfg = HelpersMisc.getExisted(gameConfig.getTileDecorationCfg(decorationType));
            for (let shapeId = 0; shapeId < cfg.shapesCount; ++shapeId) {
                dataList.push({
                    panel                       : this,
                    gameConfig                  : gameConfig,
                    dataForDrawTileDecoration: {
                        decorationType  : decorationType,
                        shapeId         : shapeId,
                    },
                });
            }
        }

        return dataList;
    }

    private async _updateListType(selectedType: number | undefined): Promise<void> {
        const gameConfig    = HelpersMisc.getExisted(MapEditorModelMeModel.getWar()?.getGcData());
        const dataArray     : DataForTypeRenderer[] = [];
        for (const cfg of gameConfig.getAllTileDecorationCfgArray()) {
            dataArray.push({
                decorationType  : cfg.tileDecorationTypeId,
                gameConfig      : gameConfig,
                panel           : this,
            });
        }

        const list = this._listType;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.decorationType === selectedType) ?? (dataArray.length ? 0 : -1));
    }

    private async _updateListTileDecoration(): Promise<void> {
        const list = this._listTileDecoration;
        await list.bindData(this._createDataForListTileDecoration());
        list.scrollToItem(0);
    }

    private async _updateListRecent(): Promise<void> {
        const list = this._listRecent;
        await list.bindData(this._dataListForRecent);
        list.scrollToItem(0);
    }

    private _updateImgRealTimeAdjust(): void {
        this._imgRealTimeAdjust.setIsVisible(!!this.getOpenData()?.war.getDrawer().getIsRealTimeAdjust());
    }
}

interface DataForTypeRenderer extends UiTypesUiListItemData.UiListItemData {
    decorationType  : number;
    gameConfig      : GameConfigGcData.GcData;
    panel           : Panel;
}
class TypeRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
    private readonly _labelType!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgBg!        : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSelected!  : UiInterfacesIUiImage.IUiImage;

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
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelType.setText(LangUtils.getTileDecorationName(openData.decorationType, openData.gameConfig) ?? LangConstants.UndefinedError);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.decorationType, false);
    }
}

interface DataForTileDecorationRenderer extends UiTypesUiListItemData.UiListItemData {
    dataForDrawTileDecoration   : MapEditorModelMeTypes.DataForDrawTileDecoration;
    panel                       : Panel;
    gameConfig                  : GameConfigGcData.GcData;
}
class TileDecorationRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTileDecorationRenderer> {
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _conTileView!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

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

        const dataForDrawTileDecoration = openData.dataForDrawTileDecoration;
        const shapeId                   = dataForDrawTileDecoration.shapeId;
        this._labelName.setText(`${shapeId}`);

        const tileView = this._tileView;
        tileView.init({
            tileBaseShapeId         : null,
            tileBaseType            : null,
            tileDecorationType      : dataForDrawTileDecoration.decorationType,
            tileDecorationShapeId   : shapeId,
            tileObjectShapeId       : null,
            tileObjectType          : null,
            skinId                  : PlayersConstants.PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : openData.gameConfig,
        });
        tileView.updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const panel                     = openData.panel;
        const dataForDrawTileDecoration = openData.dataForDrawTileDecoration;
        panel.updateOnChooseTileDecoration(dataForDrawTileDecoration);
        panel.closePanel();
        HelpersMisc.getExisted(MapEditorModelMeModel.getWar()).getDrawer().setModeDrawTileDecoration(dataForDrawTileDecoration);
    }
}
