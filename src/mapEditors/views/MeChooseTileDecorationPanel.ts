import { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getTileDecorationName } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { getWar } from "../../mapEditor/model/MeModel.ts";
import type { DataForDrawTileDecoration } from "../../mapEditor/model/MeTypes.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { getAllTileDecorationCfgArray, getTileDecorationCfg } from "../../tileDecorations/Utils.ts";
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

    private readonly _listType!                     : IUiScrollList<DataForTypeRenderer>;
    private readonly _listTileDecoration!           : IUiScrollList<DataForTileDecorationRenderer>;
    private readonly _listRecent!                   : IUiScrollList<DataForTileDecorationRenderer>;
    private readonly _labelRecentTitle!             : IUiLabel;

    private readonly _groupRealTimeAdjust!          : IUiLayout;
    private readonly _groupRealTimeAdjustContainer! : IUiLayout;
    private readonly _imgRealTimeAdjust!            : IUiImage;
    private readonly _labelRealTimeAdjust!          : IUiLabel;
    private readonly _btnHelpRealTimeAdjust!        : IUiButton;

    private _dataListForRecent  : DataForTileDecorationRenderer[] = [];

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
        const index     = getExisted(listType.getRevisedFirstIndex(v => v?.decorationType === newType));
        listType.setSelectedItemIndex(index);
        await this._updateListTileDecoration();

        if (needScroll) {
            listType.scrollToItem(index);
        }
    }

    public async updateOnChooseTileDecoration(data: DataForDrawTileDecoration): Promise<void> {
        const dataList      = this._dataListForRecent;
        const filteredList  = dataList.filter(v => {
            const oldData = v.dataForDrawTileDecoration;
            return (oldData.decorationType != data.decorationType)
                || (oldData.shapeId != data.shapeId);
        });
        dataList.length     = 0;
        dataList[0]         = {
            dataForDrawTileDecoration : data,
            panel                     : this,
            gameConfig                : getExisted(getWar()?.getGcData()),
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

        openPanel(getDict().MeChooseTileObjectPanel, {
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
        this._labelTitle.setLangText(TextType.B0662);
        this._labelRecentTitle.setText(`${getText(TextType.B0372)}:`);
        this._labelRealTimeAdjust.setLangText(TextType.B1121);

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
        const gameConfig        = getExisted(getWar()?.getGcData());
        const decorationType    = this._listType.getFirstSelectedData()?.decorationType;
        const dataList          : DataForTileDecorationRenderer[] = [];
        if (decorationType != null) {
            const cfg = getExisted(getTileDecorationCfg(decorationType));
            for (let shapeId = 0; shapeId < cfg.shapesCount; ++shapeId) {
                dataList.push({
                    panel                     : this,
                    gameConfig                : gameConfig,
                    dataForDrawTileDecoration : {
                        decorationType : decorationType,
                        shapeId        : shapeId,
                    },
                });
            }
        }

        return dataList;
    }

    private async _updateListType(selectedType: number | undefined): Promise<void> {
        const gameConfig    = getExisted(getWar()?.getGcData());
        const dataArray     : DataForTypeRenderer[] = [];
        for (const cfg of getAllTileDecorationCfgArray()) {
            dataArray.push({
                decorationType : cfg.tileDecorationTypeId,
                gameConfig     : gameConfig,
                panel          : this,
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

interface DataForTypeRenderer extends UiListItemData {
    decorationType  : number;
    gameConfig      : GameConfig;
    panel           : Panel;
}
class TypeRenderer extends UiListItemRenderer<DataForTypeRenderer> {
    private readonly _labelType!    : IUiLabel;
    private readonly _imgBg!        : IUiImage;
    private readonly _imgSelected!  : IUiImage;

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
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelType.setText(getTileDecorationName(openData.decorationType, openData.gameConfig) ?? UndefinedError);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedPlayerIndex(openData.decorationType, false);
    }
}

interface DataForTileDecorationRenderer extends UiListItemData {
    dataForDrawTileDecoration   : DataForDrawTileDecoration;
    panel                       : Panel;
    gameConfig                  : GameConfig;
}
class TileDecorationRenderer extends UiListItemRenderer<DataForTileDecorationRenderer> {
    private readonly _group!        : IUiContainer;
    private readonly _conTileView!  : IUiContainer;
    private readonly _labelName!    : IUiLabel;

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

        const dataForDrawTileDecoration = openData.dataForDrawTileDecoration;
        const shapeId                   = dataForDrawTileDecoration.shapeId;
        this._labelName.setText(`${shapeId}`);

        const tileView = this._tileView;
        tileView.init({
            tileBaseShapeId       : null,
            tileBaseType          : null,
            tileDecorationType    : dataForDrawTileDecoration.decorationType,
            tileDecorationShapeId : shapeId,
            tileObjectShapeId     : null,
            tileObjectType        : null,
            skinId                : PlayerIndex.Neutral,
            overridingSkinId      : undefined,
            gameConfig            : openData.gameConfig,
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
        getExisted(getWar()).getDrawer().setModeDrawTileDecoration(dataForDrawTileDecoration);
    }
}
