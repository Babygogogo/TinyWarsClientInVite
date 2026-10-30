import {
    Sounds_SoundPlayer,
    Sounds_Constants,
    ActionPlanners_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type BaseWar_Interface_IBwWar,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../internal.ts";

export interface OpenData {
    war: BaseWar_Interface_IBwWar.IBwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupIgnoreObstructiveUnits!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitleIgnoreObstructiveUnits! : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupAlly!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelIgnoreAlliedUnits!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgAlly!                          : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupEnemy!                       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelIgnoreEnemyUnits!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgEnemy!                         : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.ActionPlannerStateChanged,       callback: this._onNotifyActionPlannerStateChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupAlly,                              callback: this._onTouchedGroupAlly },
            { ui: this._groupEnemy,                             callback: this._onTouchedGroupEnemy },
        ]);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateGroupIgnoreObstructiveUnits();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyActionPlannerStateChanged(): void {
        this._updateGroupIgnoreObstructiveUnits();
    }

    private _onTouchedGroupAlly(): void {
        const actionPlanner = this.getOpenData()?.war.getActionPlanner();
        if (actionPlanner == null) {
            return;
        }

        const img   = this._imgAlly;
        const state = actionPlanner.getStateId();
        const isOn  = !img.getIsVisible();
        if (state === ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea) {
            actionPlanner.setIsIgnoreAllyForPreviewingAttackableArea(isOn);
        }
        img.setIsVisible(isOn);

        Sounds_SoundPlayer.playShortSfx(isOn
            ? Sounds_Constants.ShortSfxCode.CursorConfirm01
            : Sounds_Constants.ShortSfxCode.ButtonCancel01
        );
    }

    private _onTouchedGroupEnemy(): void {
        const actionPlanner = this.getOpenData()?.war.getActionPlanner();
        if (actionPlanner == null) {
            return;
        }

        const img   = this._imgEnemy;
        const state = actionPlanner.getStateId();
        const isOn  = !img.getIsVisible();
        if (state === ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea) {
            actionPlanner.setIsIgnoreEnemyForPreviewingAttackableArea(isOn);
        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitMovableArea) {
            actionPlanner.setIsIgnoreEnemyForPreviewingMovableArea(isOn);
        }
        img.setIsVisible(isOn);

        Sounds_SoundPlayer.playShortSfx(isOn
            ? Sounds_Constants.ShortSfxCode.CursorConfirm01
            : Sounds_Constants.ShortSfxCode.ButtonCancel01
        );
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitleIgnoreObstructiveUnits.setLangText(Lang_Constants.TextType.B1297);
        this._labelIgnoreAlliedUnits.setLangText(Lang_Constants.TextType.B1298);
        this._labelIgnoreEnemyUnits.setLangText(Lang_Constants.TextType.B1299);
    }

    private _updateGroupIgnoreObstructiveUnits(): void {
        const actionPlanner = this.getOpenData()?.war.getActionPlanner();
        if (actionPlanner == null) {
            return;
        }

        const state     = actionPlanner.getStateId();
        const group     = this._groupIgnoreObstructiveUnits;
        const groupAlly = this._groupAlly;
        const imgAlly   = this._imgAlly;
        const imgEnemy  = this._imgEnemy;
        if (state === ActionPlanners_Constants.StateId.PreviewingUnitAttackableArea) {
            group.setIsVisible(true);
            groupAlly.setIsVisible(true);
            imgAlly.setIsVisible(actionPlanner.getIsIgnoreAllyForPreviewingAttackableArea());
            imgEnemy.setIsVisible(actionPlanner.getIsIgnoreEnemyForPreviewingAttackableArea());

        } else if (state === ActionPlanners_Constants.StateId.PreviewingUnitMovableArea) {
            group.setIsVisible(true);
            groupAlly.setIsVisible(false);
            imgEnemy.setIsVisible(actionPlanner.getIsIgnoreEnemyForPreviewingMovableArea());

        } else {
            group.setIsVisible(false);
        }
    }
}
