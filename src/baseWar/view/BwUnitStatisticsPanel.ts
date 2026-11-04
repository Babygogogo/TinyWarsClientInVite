import {
    ForceSkins_Utils,
    GamePanels_Dict,
    GamePanels_Manager,
    Helpers_Text,
    Lang_Constants,
    Lang_Utils,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Units_Constants,
    Units_UnitView,
    Units_UnitViewPool,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Interface_IBwWar,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { Info } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetUnitStatistics/Info.ts";

let IsShowHp = true;

export interface OpenData {
    war             : BaseWar_Interface_IBwWar.IBwWar;
    infoArray       : Info[];
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelPlayerIndex!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUnitGain0!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUnitLoss0!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUnitRemain0!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNormalizedHpGain0!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNormalizedHpLoss0!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNormalizedHpRemain0! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUnitGain1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUnitLoss1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUnitRemain1!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNormalizedHpGain1!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNormalizedHpLoss1!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNormalizedHpRemain1! : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _listUnit!                 : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUnitRenderer>;
    private readonly _btnSwitch!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnPreviousPlayer!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextPlayer!            : Ui_Interfaces_IUiButton.IUiButton;

    private _playerIndex    : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",             callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnHelp,            callback : this._onTouchedBtnHelp },
            { ui : this._btnSwitch,          callback : this._onTouchedBtnSwitch },
            { ui : this._btnPreviousPlayer,  callback : this._onTouchedBtnPreviousPlayer },
            { ui : this._btnNextPlayer,      callback : this._onTouchedBtnNextPlayer },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listUnit.setItemRendererClass(UnitRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._playerIndex = 1;
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listUnit.removeAllItems();

        await super._onClosed();
    }

    public getSelectedData(): DataForUnitRenderer | undefined {
        return this._listUnit.getFirstSelectedData();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0477),
        });
    }
    private _onTouchedBtnSwitch(): void {
        IsShowHp = !IsShowHp;
        this._updateView();
    }
    private _onTouchedBtnPreviousPlayer(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex = this._playerIndex;
        if (playerIndex != null) {
            const newPlayerIndex    = playerIndex - 1;
            this._playerIndex       = newPlayerIndex <= 0 ? openData.war.getPlayersCountUnneutral() : newPlayerIndex;
            this._updateComponentsForUnits(false);
        }
    }
    private _onTouchedBtnNextPlayer(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex = this._playerIndex;
        if (playerIndex != null) {
            const newPlayerIndex    = playerIndex + 1;
            this._playerIndex       = newPlayerIndex > openData.war.getPlayersCountUnneutral() ? 1 : newPlayerIndex;
            this._updateComponentsForUnits(false);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1148);
        this._btnSwitch.setLangText(Lang_Constants.TextType.B0520);
        this._btnPreviousPlayer.setLangText(Lang_Constants.TextType.B1029);
        this._btnNextPlayer.setLangText(Lang_Constants.TextType.B1030);
        this._labelNormalizedHpGain0.setLangText(IsShowHp ? Lang_Constants.TextType.B1149 : Lang_Constants.TextType.B1171);
        this._labelNormalizedHpLoss0.setLangText(IsShowHp ? Lang_Constants.TextType.B1150 : Lang_Constants.TextType.B1172);
        this._labelNormalizedHpRemain0.setLangText(IsShowHp ? Lang_Constants.TextType.B1153 : Lang_Constants.TextType.B1173);
        this._labelUnitGain0.setLangText(Lang_Constants.TextType.B1151);
        this._labelUnitLoss0.setLangText(Lang_Constants.TextType.B1152);
        this._labelUnitRemain0.setLangText(Lang_Constants.TextType.B1154);
        this._labelNormalizedHpGain1.setLangText(IsShowHp ? Lang_Constants.TextType.B1149 : Lang_Constants.TextType.B1171);
        this._labelNormalizedHpLoss1.setLangText(IsShowHp ? Lang_Constants.TextType.B1150 : Lang_Constants.TextType.B1172);
        this._labelNormalizedHpRemain1.setLangText(IsShowHp ? Lang_Constants.TextType.B1153 : Lang_Constants.TextType.B1173);
        this._labelUnitGain1.setLangText(Lang_Constants.TextType.B1151);
        this._labelUnitLoss1.setLangText(Lang_Constants.TextType.B1152);
        this._labelUnitRemain1.setLangText(Lang_Constants.TextType.B1154);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateComponentsForUnits(true);
    }

    private async _updateComponentsForUnits(resetScroll: boolean): Promise<void> {
        const playerIndex = this._playerIndex;
        this._labelPlayerIndex.setText(playerIndex == null ? `` : `P${playerIndex}`);
        await this._listUnit.bindData(this._createDataForList(), resetScroll);
    }

    private _createDataForList(): DataForUnitRenderer[] {
        const playerIndex = this._playerIndex;
        if (playerIndex == null) {
            return [];
        }

        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const dataList          : DataForUnitRenderer[] = [];
        const war               = openData.war;
        const gameConfig        = war.getGcData();
        const skinId            = war.getPlayer(playerIndex).getUnitAndTileSkinId();
        const overridingSkinId  = ForceSkins_Utils.getRawOverridingSkinId(war, playerIndex);
        const infoArray         = openData.infoArray;
        const unitTypeArray     = gameConfig.getAllUnitTypeArray();
        const subLength         = Math.ceil(unitTypeArray.length / 2);
        const subArray0         = unitTypeArray.slice(0, subLength);
        const subArray1         = unitTypeArray.slice(subLength);
        let index               = 0;
        for (let i = 0; i < subLength; ++i) {
            const unitType0     = subArray0[i];
            const unitType1     = subArray1[i];
            const singleData0   : SingleData = {
                unitType         : unitType0,
                unitGain         : 0,
                unitLoss         : 0,
                normalizedHpGain : 0,
                normalizedHpLoss : 0,
            };
            for (const info of infoArray.filter(v => ((v.getPlayerIndex() ?? 0)=== playerIndex) && ((v.getUnitType() ?? 0) == unitType0))) {
                singleData0.normalizedHpGain    += info.getNormalizedHpGain() ?? 0;
                singleData0.normalizedHpLoss    += info.getNormalizedHpLoss() ?? 0;
                singleData0.unitLoss            += info.getUnitLoss() ?? 0;
                singleData0.unitGain            += info.getUnitGain() ?? 0;
            }
            if (!IsShowHp) {
                const cost                      = gameConfig.getUnitTemplateCfg(singleData0.unitType)?.getProductionCost() ?? 0;
                singleData0.normalizedHpGain    = (singleData0.normalizedHpGain) * cost / Units_Constants.Hp.MaxNormalizedHp;
                singleData0.normalizedHpLoss    = (singleData0.normalizedHpLoss) * cost / Units_Constants.Hp.MaxNormalizedHp;
            }

            let singleData1: SingleData | null = null;
            if (unitType1 != null) {
                singleData1 = {
                    unitType         : unitType1,
                    unitGain         : 0,
                    unitLoss         : 0,
                    normalizedHpGain : 0,
                    normalizedHpLoss : 0,
                };
                for (const info of infoArray.filter(v => ((v.getPlayerIndex() ?? 0)=== playerIndex) && ((v.getUnitType() ?? 0) == unitType1))) {
                    singleData1.normalizedHpGain    += info.getNormalizedHpGain() ?? 0;
                    singleData1.normalizedHpLoss    += info.getNormalizedHpLoss() ?? 0;
                    singleData1.unitLoss            += info.getUnitLoss() ?? 0;
                    singleData1.unitGain            += info.getUnitGain() ?? 0;
                }

                if (!IsShowHp) {
                    const cost                      = gameConfig.getUnitTemplateCfg(singleData1.unitType)?.getProductionCost() ?? 0;
                    singleData1.normalizedHpGain    = (singleData1.normalizedHpGain) * cost / Units_Constants.Hp.MaxNormalizedHp;
                    singleData1.normalizedHpLoss    = (singleData1.normalizedHpLoss) * cost / Units_Constants.Hp.MaxNormalizedHp;
                }
            }

            dataList.push({
                index            : index++,
                playerIndex      : playerIndex,
                skinId           : skinId,
                overridingSkinId : overridingSkinId,
                gameConfig       : gameConfig,
                singleData0      : singleData0,
                singleData1      : singleData1,
            });
        }

        return dataList;
    }
}

type SingleData = {
    unitType            : number;
    normalizedHpGain    : number;
    normalizedHpLoss    : number;
    unitGain            : number;
    unitLoss            : number;
};
interface DataForUnitRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index               : number;
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    playerIndex         : number;
    skinId              : number;
    overridingSkinId    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

    singleData0         : SingleData;
    singleData1         : SingleData | null;
}
class UnitRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBackground!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _conUnitView0!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelUnitGain0!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUnitLoss0!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUnitRemain0!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNormalizedHpGain0!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNormalizedHpLoss0!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNormalizedHpRemain0! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _conUnitView1!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelUnitGain1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUnitLoss1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUnitRemain1!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNormalizedHpGain1!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNormalizedHpLoss1!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNormalizedHpRemain1! : Ui_Interfaces_IUiLabel.IUiLabel;

    private _unitView0                          : Units_UnitView.UnitView | undefined;
    private _unitView1                          : Units_UnitView.UnitView | undefined;

    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        if (this._unitView0 == null) {
            const view      = Units_UnitViewPool.UnitViewPool.getInstance().acquire();
            this._unitView0 = view;
            this._conUnitView0.addUiChild(view);

            this._updateUnitView0();
        }
        if (this._unitView1 == null) {
            const view      = Units_UnitViewPool.UnitViewPool.getInstance().acquire();
            this._unitView1 = view;
            this._conUnitView1.addUiChild(view);

            this._updateUnitView1();
        }
    }
    protected override _doApplyOpenData(): void {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        if (this._unitView0) {
            const view = this._unitView0;
            this._conUnitView0.removeUiChild(view);

            Units_UnitViewPool.UnitViewPool.getInstance().release(view);
            delete this._unitView0;
        }
        if (this._unitView1) {
            const view = this._unitView1;
            this._conUnitView1.removeUiChild(view);

            Units_UnitViewPool.UnitViewPool.getInstance().release(view);
            delete this._unitView1;
        }

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgBackground.setIsVisible(openData.index % 2 == 1);

        {
            const data = openData.singleData0;
            this._labelNormalizedHpGain0.setText(getNumShortText(data.normalizedHpGain, !IsShowHp));
            this._labelNormalizedHpLoss0.setText(getNumShortText(data.normalizedHpLoss, !IsShowHp));
            this._labelNormalizedHpRemain0.setText(getNumShortText(data.normalizedHpGain - data.normalizedHpLoss, !IsShowHp));
            this._labelUnitGain0.setText(`${data.unitGain}`);
            this._labelUnitLoss0.setText(`${data.unitLoss}`);
            this._labelUnitRemain0.setText(`${data.unitGain - data.unitLoss}`);
        }

        {
            const data                      = openData.singleData1;
            const labelNormalizedHpGain1    = this._labelNormalizedHpGain1;
            const labelNormalizedHpLoss1    = this._labelNormalizedHpLoss1;
            const labelNormalizedHpRemain1  = this._labelNormalizedHpRemain1;
            const labelUnitGain1            = this._labelUnitGain1;
            const labelUnitLoss1            = this._labelUnitLoss1;
            const labelUnitRemain1          = this._labelUnitRemain1;
            if (data == null) {
                labelNormalizedHpGain1.setIsVisible(false);
                labelNormalizedHpLoss1.setIsVisible(false);
                labelNormalizedHpRemain1.setIsVisible(false);
                labelUnitGain1.setIsVisible(false);
                labelUnitLoss1.setIsVisible(false);
                labelUnitRemain1.setIsVisible(false);
            } else {
                labelNormalizedHpGain1.setIsVisible(true);
                labelNormalizedHpLoss1.setIsVisible(true);
                labelNormalizedHpRemain1.setIsVisible(true);
                labelUnitGain1.setIsVisible(true);
                labelUnitLoss1.setIsVisible(true);
                labelUnitRemain1.setIsVisible(true);

                labelNormalizedHpGain1.setText(getNumShortText(data.normalizedHpGain, !IsShowHp));
                labelNormalizedHpLoss1.setText(getNumShortText(data.normalizedHpLoss, !IsShowHp));
                labelNormalizedHpRemain1.setText(getNumShortText(data.normalizedHpGain - data.normalizedHpLoss, !IsShowHp));
                labelUnitGain1.setText(`${data.unitGain}`);
                labelUnitLoss1.setText(`${data.unitLoss}`);
                labelUnitRemain1.setText(`${data.unitGain - data.unitLoss}`);
            }
        }

        this._updateUnitView0();
        this._updateUnitView1();
    }

    private _updateUnitView0(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitView0 = this._unitView0;
        unitView0?.loadViewData({
            unitTypeId  : openData.singleData0.unitType,
            skinId      : openData.overridingSkinId ?? openData.skinId,
            playerIndex : openData.playerIndex,
        }, true);
        unitView0?.refreshAllViews();
    }

    private _updateUnitView1(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const data      = openData.singleData1;
        const unitView1 = this._unitView1;
        if (data == null) {
            unitView1?.setIsVisible(false);
        } else {
            unitView1?.setIsVisible(true);
            unitView1?.loadViewData({
                unitTypeId  : data.unitType,
                skinId      : openData.overridingSkinId ?? openData.skinId,
                playerIndex : openData.playerIndex,
            }, true);
            unitView1?.refreshAllViews();
        }
    }
}

function getNumShortText(num: number, showKilo: boolean): string {
    if (!showKilo) {
        return `${num}`;
    }

    const newNum = num / 1000;
    return (newNum % 1 === 0) ? `${newNum}` : Helpers_Text.format(`%.1f`, newNum);
}
