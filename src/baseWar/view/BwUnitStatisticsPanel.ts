import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import * as CommonModelCommonModel from "../../common/model/CommonModel.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsInfo from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetUnitStatistics/Info.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiTypesUiUnitViewData from "../../ui/types/UiUnitViewData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";

type UnitStatisticsInfo = ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsInfo.Info;

let IsShowHp = true;

export interface OpenData {
    war             : BaseWarInterfaceIBwWar.IBwWar;
    infoArray       : UnitStatisticsInfo[];
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _labelPlayerIndex!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUnitGain0!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUnitLoss0!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUnitRemain0!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNormalizedHpGain0!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNormalizedHpLoss0!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNormalizedHpRemain0! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUnitGain1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUnitLoss1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUnitRemain1!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNormalizedHpGain1!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNormalizedHpLoss1!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNormalizedHpRemain1! : UiInterfacesIUiLabel.IUiLabel;

    private readonly _listUnit!                 : UiInterfacesIUiScrollList.IUiScrollList<DataForUnitRenderer>;
    private readonly _btnSwitch!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnPreviousPlayer!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextPlayer!            : UiInterfacesIUiButton.IUiButton;

    private _playerIndex    : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
            { ui: this._btnSwitch,          callback: this._onTouchedBtnSwitch },
            { ui: this._btnPreviousPlayer,  callback: this._onTouchedBtnPreviousPlayer },
            { ui: this._btnNextPlayer,      callback: this._onTouchedBtnNextPlayer },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0477),
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1148));
        this._btnSwitch.setText(LangUtils.getText(LangConstants.TextType.B0520));
        this._btnPreviousPlayer.setText(LangUtils.getText(LangConstants.TextType.B1029));
        this._btnNextPlayer.setText(LangUtils.getText(LangConstants.TextType.B1030));
        this._labelNormalizedHpGain0.setText(LangUtils.getText(IsShowHp ? LangConstants.TextType.B1149 : LangConstants.TextType.B1171));
        this._labelNormalizedHpLoss0.setText(LangUtils.getText(IsShowHp ? LangConstants.TextType.B1150 : LangConstants.TextType.B1172));
        this._labelNormalizedHpRemain0.setText(LangUtils.getText(IsShowHp ? LangConstants.TextType.B1153 : LangConstants.TextType.B1173));
        this._labelUnitGain0.setText(LangUtils.getText(LangConstants.TextType.B1151));
        this._labelUnitLoss0.setText(LangUtils.getText(LangConstants.TextType.B1152));
        this._labelUnitRemain0.setText(LangUtils.getText(LangConstants.TextType.B1154));
        this._labelNormalizedHpGain1.setText(LangUtils.getText(IsShowHp ? LangConstants.TextType.B1149 : LangConstants.TextType.B1171));
        this._labelNormalizedHpLoss1.setText(LangUtils.getText(IsShowHp ? LangConstants.TextType.B1150 : LangConstants.TextType.B1172));
        this._labelNormalizedHpRemain1.setText(LangUtils.getText(IsShowHp ? LangConstants.TextType.B1153 : LangConstants.TextType.B1173));
        this._labelUnitGain1.setText(LangUtils.getText(LangConstants.TextType.B1151));
        this._labelUnitLoss1.setText(LangUtils.getText(LangConstants.TextType.B1152));
        this._labelUnitRemain1.setText(LangUtils.getText(LangConstants.TextType.B1154));
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
        const overridingSkinId  = ForceSkinsUtils.getRawOverridingSkinId(war, playerIndex);
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
                unitType            : unitType0,
                unitGain            : 0,
                unitLoss            : 0,
                normalizedHpGain    : 0,
                normalizedHpLoss    : 0,
            };
            for (const info of infoArray.filter(v => ((v.getPlayerIndex() ?? 0)=== playerIndex) && ((v.getUnitType() ?? 0) == unitType0))) {
                singleData0.normalizedHpGain    += info.getNormalizedHpGain() ?? 0;
                singleData0.normalizedHpLoss    += info.getNormalizedHpLoss() ?? 0;
                singleData0.unitLoss            += info.getUnitLoss() ?? 0;
                singleData0.unitGain            += info.getUnitGain() ?? 0;
            }
            if (!IsShowHp) {
                const cost                      = gameConfig.getUnitTemplateCfg(singleData0.unitType)?.getProductionCost() ?? 0;
                singleData0.normalizedHpGain    = (singleData0.normalizedHpGain ?? 0) * cost / UnitsConstants.Hp.MaxNormalizedHp;
                singleData0.normalizedHpLoss    = (singleData0.normalizedHpLoss ?? 0) * cost / UnitsConstants.Hp.MaxNormalizedHp;
            }

            let singleData1: SingleData | null = null;
            if (unitType1 != null) {
                singleData1 = {
                    unitType            : unitType1,
                    unitGain            : 0,
                    unitLoss            : 0,
                    normalizedHpGain    : 0,
                    normalizedHpLoss    : 0,
                };
                for (const info of infoArray.filter(v => ((v.getPlayerIndex() ?? 0)=== playerIndex) && ((v.getUnitType() ?? 0) == unitType1))) {
                    singleData1.normalizedHpGain    += info.getNormalizedHpGain() ?? 0;
                    singleData1.normalizedHpLoss    += info.getNormalizedHpLoss() ?? 0;
                    singleData1.unitLoss            += info.getUnitLoss() ?? 0;
                    singleData1.unitGain            += info.getUnitGain() ?? 0;
                }

                if (!IsShowHp) {
                const cost                      = gameConfig.getUnitTemplateCfg(singleData1.unitType)?.getProductionCost() ?? 0;
                singleData1.normalizedHpGain    = (singleData1.normalizedHpGain ?? 0) * cost / UnitsConstants.Hp.MaxNormalizedHp;
                singleData1.normalizedHpLoss    = (singleData1.normalizedHpLoss ?? 0) * cost / UnitsConstants.Hp.MaxNormalizedHp;
                }
            }

            dataList.push({
                index               : index++,
                playerIndex         : playerIndex,
                skinId              : skinId,
                overridingSkinId    : overridingSkinId,
                gameConfig          : gameConfig,
                singleData0         : singleData0,
                singleData1         : singleData1,
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
interface DataForUnitRenderer extends UiTypesUiListItemData.UiListItemData {
    index               : number;
    gameConfig          : GameConfigGcData.GcData;
    playerIndex         : number;
    skinId              : number;
    overridingSkinId    : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;

    singleData0         : SingleData;
    singleData1         : SingleData | null;
}
class UnitRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBackground!            : UiInterfacesIUiImage.IUiImage;
    private readonly _conUnitView0!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelUnitGain0!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUnitLoss0!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUnitRemain0!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNormalizedHpGain0!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNormalizedHpLoss0!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNormalizedHpRemain0! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _conUnitView1!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelUnitGain1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUnitLoss1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUnitRemain1!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNormalizedHpGain1!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNormalizedHpLoss1!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNormalizedHpRemain1! : UiInterfacesIUiLabel.IUiLabel;

    private readonly _unitView0                 = new (UiUtilsUiFactory.getUiUnitViewClass())();
    private readonly _unitView1                 = new (UiUtilsUiFactory.getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
            { type: NotificationsTypeId.TypeId.StateIndicatorTick,      callback: this._onNotifyUnitStateIndicatorTick },
        ]);

        this._conUnitView0.addUiChild(this._unitView0);
        this._conUnitView1.addUiChild(this._unitView1);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onNotifyUnitAnimationTick(): void {
        const tick = CommonModelCommonModel.getUnitAnimationTickCount();
        this._unitView0.updateOnAnimationTick(tick);
        this._unitView1.updateOnAnimationTick(tick);
    }
    private _onNotifyUnitStateIndicatorTick(): void {
        this._unitView0.updateOnStateIndicatorTick();
        this._unitView1.updateOnStateIndicatorTick();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig        = openData.gameConfig;
        const skinId            = openData.skinId;
        const overridingSkinId  = openData.overridingSkinId;
        this._imgBackground.setIsVisible(openData.index % 2 == 1);

        {
            const data = openData.singleData0;
            this._labelNormalizedHpGain0.setText(getNumShortText(data.normalizedHpGain, !IsShowHp));
            this._labelNormalizedHpLoss0.setText(getNumShortText(data.normalizedHpLoss, !IsShowHp));
            this._labelNormalizedHpRemain0.setText(getNumShortText(data.normalizedHpGain - data.normalizedHpLoss, !IsShowHp));
            this._labelUnitGain0.setText(`${data.unitGain}`);
            this._labelUnitLoss0.setText(`${data.unitLoss}`);
            this._labelUnitRemain0.setText(`${data.unitGain - data.unitLoss}`);
            this._unitView0.update(new UiTypesUiUnitViewData.UiUnitViewData({
                gameConfig          : gameConfig,
                skinId              : skinId,
                overridingSkinId    : overridingSkinId,
                unitData            : UnitsUtilsSerialization.createDefault({
                    gridIndex   : { x: 0, y: 0 },
                    unitTypeId  : data.unitType,
                    unitId      : -1,
                    playerIndex : openData.playerIndex,
                    gcData      : gameConfig,
                }),
            }), CommonModelCommonModel.getUnitAnimationTickCount());
        }

        {
            const data                      = openData.singleData1;
            const labelNormalizedHpGain1    = this._labelNormalizedHpGain1;
            const labelNormalizedHpLoss1    = this._labelNormalizedHpLoss1;
            const labelNormalizedHpRemain1  = this._labelNormalizedHpRemain1;
            const labelUnitGain1            = this._labelUnitGain1;
            const labelUnitLoss1            = this._labelUnitLoss1;
            const labelUnitRemain1          = this._labelUnitRemain1;
            const unitView1                 = this._unitView1;
            if (data == null) {
                labelNormalizedHpGain1.setIsVisible(false);
                labelNormalizedHpLoss1.setIsVisible(false);
                labelNormalizedHpRemain1.setIsVisible(false);
                labelUnitGain1.setIsVisible(false);
                labelUnitLoss1.setIsVisible(false);
                labelUnitRemain1.setIsVisible(false);
                unitView1.setIsVisible(false);
            } else {
                labelNormalizedHpGain1.setIsVisible(true);
                labelNormalizedHpLoss1.setIsVisible(true);
                labelNormalizedHpRemain1.setIsVisible(true);
                labelUnitGain1.setIsVisible(true);
                labelUnitLoss1.setIsVisible(true);
                labelUnitRemain1.setIsVisible(true);
                unitView1.setIsVisible(true);

                labelNormalizedHpGain1.setText(getNumShortText(data.normalizedHpGain, !IsShowHp));
                labelNormalizedHpLoss1.setText(getNumShortText(data.normalizedHpLoss, !IsShowHp));
                labelNormalizedHpRemain1.setText(getNumShortText(data.normalizedHpGain - data.normalizedHpLoss, !IsShowHp));
                labelUnitGain1.setText(`${data.unitGain}`);
                labelUnitLoss1.setText(`${data.unitLoss}`);
                labelUnitRemain1.setText(`${data.unitGain - data.unitLoss}`);
                unitView1.update(new UiTypesUiUnitViewData.UiUnitViewData({
                    gameConfig          : gameConfig,
                    skinId              : skinId,
                    overridingSkinId    : overridingSkinId,
                    unitData            : UnitsUtilsSerialization.createDefault({
                        gridIndex   : { x: 0, y: 0 },
                        unitTypeId  : data.unitType,
                        playerIndex : openData.playerIndex,
                        unitId      : -1,
                        gcData      : gameConfig,
                    }),
                }), CommonModelCommonModel.getUnitAnimationTickCount());
            }
        }
    }
}

function getNumShortText(num: number, showKilo: boolean): string {
    if (!showKilo) {
        return `${num}`;
    }

    const newNum = num / 1000;
    return (newNum % 1 === 0) ? `${newNum}` : HelpersText.format(`%.1f`, newNum);
}
