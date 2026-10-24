import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersNoSleep from "../../helpers/NoSleep.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocalDataStorage2 from "../../localData/Storage.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiPromptedInput from "../../ui/interfaces/IUiPromptedInput.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";
import * as UsersUtils from "../Utils.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgTitle!                 : UiInterfacesIUiImage.IUiImage;

    private readonly _groupLogin!               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupAccount!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelAccount!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputAccount!             : UiInterfacesIUiPromptedInput.IUiPromptedInput;

    private readonly _groupPassword!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelPassword!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputPassword!            : UiInterfacesIUiPromptedInput.IUiPromptedInput;

    private readonly _groupPasswordCommand!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupRememberPassword!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelRememberPassword!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgRememberPasswordCheck! : UiInterfacesIUiImage.IUiImage;
    private readonly _btnForgetPassword!        : UiInterfacesIUiButton.IUiButton;

    private readonly _groupButton!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnRegister!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnLogin!                 : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserLogin,        callback: this._onMsgUserLogin },
            { type: NotificationsTypeId.TypeId.MsgUserLoginAsGuest, callback: this._onMsgUserLoginAsGuest },
        ]);
        this._setUiListenerArray([
            { ui: this._groupLogin,             callback: this._onTouchedGroupLogin,            mouseStyle: HelpersPointerInput.MouseStyleType.Default },
            { ui: this._btnLogin,               callback: this._onTouchedBtnLogin },
            { ui: this._btnRegister,            callback: this._onTouchedBtnRegister },
            { ui: this._btnForgetPassword,      callback: this._onTouchedBtnForgetPassword },
            { ui: this._groupRememberPassword,  callback: this._onTouchedGroupRememberPassword },
            // { ui: this._imgTitle,               callback: () => {
            //     this._imgTitle.setIsTouchEnabled(true);

            //     let counter         = 0;
            //     const img           = createTestImg(false);
            //     const label         = createTestLabel(false);
            //     const promptedInput = createTestPromptedInput(false);
            //     const scrollList    = createTestScrollList(true);

            //     // FloatText.floatText("title touched");
            //     Ui.Utils.UiSizerHelpers.checkAndAddAutoSizerInfo(scrollList, true);
            //     // {
            //     //     const input = promptedInput.getInputComponent()!;
            //     //     input.setIsMultiline(!input.getIsMultiline());
            //     //     input.focus();
            //     // }
            //     testRotation(img);
            // }, },
        ]);

        const isRememberPassword = LocalDataStorage2.getIsRememberPassword();
        this._inputAccount.setInputText(LocalDataStorage2.getAccount());
        this._inputPassword.setInputText(isRememberPassword ? LocalDataStorage2.getPassword() : ``);
        this._imgRememberPasswordCheck.setIsVisible(isRememberPassword);
        this._btnLogin.setShortSfxCode(SoundsConstants.ShortSfxCode.ButtonConfirm01);
        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        // nothing to do
    }

    private _onMsgUserLogin(): void {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0000));
        this._btnLogin.setIsTouchEnabled(false);
    }
    private _onMsgUserLoginAsGuest(): void {
        this._onMsgUserLogin();
    }
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupLogin(): void {
        SoundsSoundPlayer.init();
    }

    private _onTouchedBtnLogin(): void {
        HelpersNoSleep.enable();

        const account  = this._inputAccount.getInputText() ?? ``;
        const password = this._inputPassword.getInputText() ?? ``;
        if (!UsersUtils.checkIsAccountValid(account)) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0001));
        } else {
            if (!UsersUtils.checkIsPasswordValid(password)) {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0003));
            } else {
                LocalDataStorage2.setAccount(account);
                LocalDataStorage2.setPassword(password);
                UsersModel.setSelfAccount(account);
                UsersModel.setSelfPassword(password);
                UsersProxy.reqLogin(account, password, false);
            }
        }
    }

    private _onTouchedBtnRegister(): void {
        HelpersNoSleep.enable();

        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserRegisterPanel, void 0);
    }

    private _onTouchedBtnForgetPassword(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserSetPasswordWithEmailPanel, {
            account : this._inputAccount.getInputText(),
        });
    }

    private _onTouchedGroupRememberPassword(): void {
        const isRemember = LocalDataStorage2.getIsRememberPassword();
        LocalDataStorage2.setIsRememberPassword(!isRemember);
        SoundsSoundPlayer.playShortSfx(isRemember ? SoundsConstants.ShortSfxCode.ButtonCancel01 : SoundsConstants.ShortSfxCode.ButtonConfirm01);
        this._imgRememberPasswordCheck.setIsVisible(!isRemember);
    }

    private _updateComponentsForLanguage(): void {
        this._btnLogin.setText(LangUtils.getText(LangConstants.TextType.B0173));
        this._btnRegister.setText(`${LangUtils.getText(LangConstants.TextType.B0174)}*`);
        this._btnForgetPassword.setText(LangUtils.getText(LangConstants.TextType.B0626));
        this._labelRememberPassword.setText(LangUtils.getText(LangConstants.TextType.B0172));
        this._labelAccount.setText(`${LangUtils.getText(LangConstants.TextType.B0170)}:`);
        this._labelPassword.setText(`${LangUtils.getText(LangConstants.TextType.B0171)}:`);
    }

    protected async _showOpenAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._imgTitle,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
            tweenTime   : 1000,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupAccount,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            waitTime    : 800,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupPassword,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            waitTime    : 900,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupPasswordCommand,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            waitTime    : 1000,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupButton,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            waitTime    : 1100,
        });

        await TimerTimerModel.wait(1100 + GraphicsConstants.Tween.DefaultDuration);
    }
    protected async _showCloseAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._imgTitle,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupAccount,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: 40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupPassword,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: 40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupPasswordCommand,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: 40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupButton,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: 40 },
        });

        await TimerTimerModel.wait();
    }
}

//     function createTestImg(addChild: boolean): Ui.Interfaces.IUiImage {
//         const img = new Ui.Components.UiImage();
//         img.loadSource("coHead0004");
//         img.scaleX = 2;
//         img.scaleY = 2;
//         img.rotation = 45;
//         img.anchorOffsetX = -200;
//         img.anchorOffsetY = 100;
//         const sizerInfo = img.checkAndInitSizerInfo();
//         sizerInfo.setSizerOptions({
//             horizontalAlign : {
//                 align   : Ui.Types.UiHorizontalAlign.Center,
//             },
//             verticalAlign : {
//                 align   : Ui.Types.UiVerticalAlign.Middle,
//             },
//             width   : { percentage: 50 },
//             // height  : { percentage: 50 },
//         });

//         if (addChild) {
//             StageManager.getLayer(GameConfig.GcGraphic.LayerType.Hud3).addUiChild(img);
//         }

//         // img.addEventListener(PointerManager.PointerEventType.HoverIn, () => {
//         //     FloatText.floatText("hover in img");
//         // }, undefined);
//         // img.touchEnabled = true;

//         return img;
//     }
//     function createTestLabel(addChild: boolean): Ui.Interfaces.IUiLabel {
//         const label = new Ui.Components.UiLabel();
//         label.setText(
// `=============
// asdfasdf
// wqogihqweoighqweogiqhwegoqiwehgoqiwehgoqiweghoqiwehgoqiwehgoqwiehgoqiwehgoqiwehgoqiwehgoiqwhegoiqwehgoqiwehgoiqwehgiqweogqwehogqiweghoqiweg
// oqweighoqwiegh
// qwoeighqwoeighqoweighoqwieg
// qwoeighqwoeighqoweighoqwiegqowieghoqweighoqw
// qwoeighqwoeighqoweighoqwiegoweigj
// qwoeighqwoeighqoweighoqwieg
// sdifasd
// aisdhgaisdhg
// aisudgaisudgas
// aisudgaisudgasaisud
// giasd
// =============`
//         );
//         const sizerInfo = label.checkAndInitSizerInfo();
//         sizerInfo.setSizerOptions({
//             horizontalAlign : {
//                 align   : Ui.Types.UiHorizontalAlign.Center,
//             },
//             verticalAlign : {
//                 align   : Ui.Types.UiVerticalAlign.Middle,
//             },
//             width   : { percentage: 50 },
//             height  : { percentage: 50 },
//         });
//         label.setAutoShrinkHeight(100);
//         label.setAutoShrinkWidth(100);
//         // label.setScaleX(2);
//         // label.setScaleY(3);
//         label.setAnchorOffsetX(100);
//         label.setAnchorOffsetY(200);

//         if (addChild) {
//             StageManager.getLayer(GameConfig.GcGraphic.LayerType.Hud3).addUiChild(label);
//         }

//         return label;
//     }
//     function createTestPromptedInput(addChild: boolean): Ui.Interfaces.IUiPromptedInput {
//         const promptedInput = new Ui.Components.UiPromptedInput();
//         const prompt        = new Ui.Components.UiLabel();
//         const input         = new Ui.Components.UiTextInput();
//         promptedInput.addChild(prompt);
//         promptedInput.addChild(input);
//         (promptedInput as any)._textInput   = input;
//         (promptedInput as any)._labelPrompt = prompt;

//         input.setUnscaledManualWidth(400);
//         input.setUnscaledManualHeight(100);
//         input.setFontSize(20);
//         // input.setScaleX(1.5);
//         // input.setStrokeWidth(10);
//         input.setIsBold(true);
//         input.setIsItalic(true);
//         input.setAutoShrinkWidth(200);
//         input.setTextColor(0xFFFF00);
//         input.setHorizontalAlign(Ui.Types.UiHorizontalAlign.Center);
//         input.setVerticalAlign(Ui.Types.UiVerticalAlign.Top);
//         input.setIsMultiline(true);
//         // input.setIsDisplayAsPassword(true);

//         prompt.setUnscaledManualWidth(300);
//         prompt.setUnscaledManualHeight(100);
//         prompt.setFontSize(20);
//         // prompt.setScaleX(1.5);
//         // prompt.setStrokeWidth(10);
//         // prompt.setIsBold(true);
//         // prompt.setIsItalic(true);
//         prompt.setAutoShrinkWidth(200);
//         prompt.setTextColor(0x888800);
//         prompt.setHorizontalAlign(Ui.Types.UiHorizontalAlign.Center);
//         prompt.setVerticalAlign(Ui.Types.UiVerticalAlign.Top);

//         // this._groupLogin.addChild(input);

//         promptedInput.setX(100);
//         promptedInput.setY(50);
//         promptedInput.setPromptText("prompt");
//         promptedInput.setInputText("input");

//         if (addChild) {
//             StageManager.getLayer(GameConfig.GcGraphic.LayerType.Hud3).addUiChild(promptedInput);
//         }

//         return promptedInput;
//     }
//     function createTestScrollList(addChild: boolean): Ui.Interfaces.IUiScrollList<TestItemData> {
//         const scrollList = new Ui.Components.UiScrollList<TestItemData>({
//             orientation : Ui.Types.UiOrientation.Vertical,

//         });
//         scrollList.setUnscaledManualWidth(600);
//         scrollList.setUnscaledManualHeight(300);
//         scrollList.setX(100);
//         scrollList.setY(50);

//         {
//             const list = new Ui.Components.UiList<TestItemData>({
//                 orientation         : Ui.Types.UiLayoutOrientation.Rows,
//                 multiItemsPerBlock  : true,
//                 itemsVMargin        : 20,
//             });
//             scrollList.initViewport(list);
//             scrollList.setItemRendererClass(TestItemRenderer);
//         }

//         {
//             const sizerInfo = scrollList.checkAndInitSizerInfo();
//             sizerInfo.setSizerOptions({
//                 horizontalAlign : {
//                     align   : Ui.Types.UiHorizontalAlign.Center,
//                 },
//                 verticalAlign   : {
//                     align   : Ui.Types.UiVerticalAlign.Middle,
//                 },
//                 height          : {
//                     percentage  : 80,
//                 },
//                 // width           : {
//                 //     percentage  : 50,
//                 // },
//             });
//         }

//         {
//             const dataArray: TestItemData[] = [];
//             for (let i = 0; i < 30; ++i) {
//                 dataArray.push({
//                     num : i,
//                 });
//             }
//             scrollList.bindData(dataArray);
//         }

//         if (addChild) {
//             StageManager.getLayer(GameConfig.GcGraphic.LayerType.Hud3).addUiChild(scrollList);
//         }

//         return scrollList;
//     }
//     function testRotation(component: Ui.Interfaces.IUiComponent): void {
//         component.getEventAgent().addAutoEnterFrameListener(() => {
//             component.setRotationInDegree(component.getRotationInDegree() + 0.5);
//             Ui.Utils.UiSizerHelpers.addAutoSizerInfo(component.checkAndInitSizerInfo(), false);
//         }, undefined);
//     }

//     interface TestItemData extends Ui.Types.UiListItemData {
//         num     : number;
//     }
//     class TestItemRenderer extends Ui.Components.UiListItemRenderer<TestItemData> {
//         private _imgBg  = new Ui.Components.UiImage({
//             textureSourceName   : "uncompressedRectangle0014",
//             scale9Grid          : [6, 6, 2, 2],
//         });
//         private _labelText  = new Ui.Components.UiLabel();

//         public constructor() {
//             super();

//             this.setUnscaledManualWidth(200),
//             this.setUnscaledManualHeight(30);
//             this.setIsTouchEnabled(true);
//             this.setMouseStyle(PointerManager.MouseStyleType.Pointer);

//             {
//                 const img       = this._imgBg;
//                 const sizerInfo = img.checkAndInitSizerInfo();
//                 sizerInfo.setSizerOptions({
//                     width   : { percentage: 100 },
//                     height  : { percentage: 100 },
//                 });

//                 this.addChild(img);
//             }

//             {
//                 const label     = this._labelText;
//                 const sizerInfo = label.checkAndInitSizerInfo();
//                 sizerInfo.setSizerOptions({
//                     horizontalAlign : {
//                         align   : Ui.Types.UiHorizontalAlign.Center,
//                     },
//                     verticalAlign : {
//                         align   : Ui.Types.UiVerticalAlign.Middle,
//                     },
//                 });
//                 this.addChild(label);
//             }

//             this.getEventAgent().addPointerEventListener(PointerManager.PointerEventType.Tap, this._onPointerTap, this);
//         }
//         private _onPointerTap(): void {
//             FloatText.floatText(`tap ${this.getOpenData()?.num}`);
//         }
//         public override _doApplyOpenData(): void {
//             this._labelText.setText(`${this.getOpenData()?.num}`);
//         }
//     }
