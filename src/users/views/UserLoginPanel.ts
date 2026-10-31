import {
    Users_Utils,
    Helpers_NoSleep,
    Tween_Executor,
    LocalData_Storage,
    GamePanels_Dict,
    Lang_Utils,
    Sounds_SoundPlayer,
    Helpers_PointerInput,
    GamePanels_Manager,
    Users_Proxy,
    Users_Model,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Graphics_Constants,
    Ui_Components_UiPanel,
    Timer_TimerModel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiPromptedInput,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgTitle!                 : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupLogin!               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupAccount!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelAccount!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputAccount!             : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;

    private readonly _groupPassword!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelPassword!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputPassword!            : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;

    private readonly _groupPasswordCommand!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupRememberPassword!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelRememberPassword!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgRememberPasswordCheck! : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _btnForgetPassword!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupButton!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnRegister!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnLogin!                 : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",     callback : this._onNotifyLanguageChanged },
            { type : "MsgUserLogin",        callback : this._onMsgUserLogin },
            { type : "MsgUserLoginAsGuest", callback : this._onMsgUserLoginAsGuest },
        ]);
        this._setUiListenerArray([
            { ui : this._groupLogin,             callback : this._onTouchedGroupLogin,            mouseStyle : Helpers_PointerInput.MouseStyleType.Default },
            { ui : this._btnLogin,               callback : this._onTouchedBtnLogin },
            { ui : this._btnRegister,            callback : this._onTouchedBtnRegister },
            { ui : this._btnForgetPassword,      callback : this._onTouchedBtnForgetPassword },
            { ui : this._groupRememberPassword,  callback : this._onTouchedGroupRememberPassword },
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

        const isRememberPassword = LocalData_Storage.getIsRememberPassword();
        this._inputAccount.setInputText(LocalData_Storage.getAccount());
        this._inputPassword.setInputText(isRememberPassword ? LocalData_Storage.getPassword() : ``);
        this._imgRememberPasswordCheck.setIsVisible(isRememberPassword);
        this._btnLogin.setShortSfxCode(Sounds_Constants.ShortSfxCode.ButtonConfirm01);
        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        // nothing to do
    }

    private _onMsgUserLogin(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0000));
        this._btnLogin.setIsTouchEnabled(false);
    }
    private _onMsgUserLoginAsGuest(): void {
        this._onMsgUserLogin();
    }
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupLogin(): void {
        Sounds_SoundPlayer.init();
    }

    private _onTouchedBtnLogin(): void {
        Helpers_NoSleep.enable();

        const account  = this._inputAccount.getInputText() ?? ``;
        const password = this._inputPassword.getInputText() ?? ``;
        if (!Users_Utils.checkIsAccountValid(account)) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0001));
        } else {
            if (!Users_Utils.checkIsPasswordValid(password)) {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0003));
            } else {
                LocalData_Storage.setAccount(account);
                LocalData_Storage.setPassword(password);
                Users_Model.setSelfAccount(account);
                Users_Model.setSelfPassword(password);
                Users_Proxy.reqLogin(account, password, false);
            }
        }
    }

    private _onTouchedBtnRegister(): void {
        Helpers_NoSleep.enable();

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserRegisterPanel, void 0);
    }

    private _onTouchedBtnForgetPassword(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserSetPasswordWithEmailPanel, {
            account : this._inputAccount.getInputText(),
        });
    }

    private _onTouchedGroupRememberPassword(): void {
        const isRemember = LocalData_Storage.getIsRememberPassword();
        LocalData_Storage.setIsRememberPassword(!isRemember);
        Sounds_SoundPlayer.playShortSfx(isRemember ? Sounds_Constants.ShortSfxCode.ButtonCancel01 : Sounds_Constants.ShortSfxCode.ButtonConfirm01);
        this._imgRememberPasswordCheck.setIsVisible(!isRemember);
    }

    private _updateComponentsForLanguage(): void {
        this._btnLogin.setLangText(Lang_Constants.TextType.B0173);
        this._btnRegister.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0174)}*`);
        this._btnForgetPassword.setLangText(Lang_Constants.TextType.B0626);
        this._labelRememberPassword.setLangText(Lang_Constants.TextType.B0172);
        this._labelAccount.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0170)}:`);
        this._labelPassword.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0171)}:`);
    }

    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._imgTitle,
            beginProps : { customAlpha : 0 },
            endProps   : { customAlpha : 1 },
            tweenTime  : 1000,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupAccount,
            beginProps : { customAlpha : 0, customY : 40 },
            endProps   : { customAlpha : 1, customY : 0 },
            waitTime   : 800,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupPassword,
            beginProps : { customAlpha : 0, customY : 40 },
            endProps   : { customAlpha : 1, customY : 0 },
            waitTime   : 900,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupPasswordCommand,
            beginProps : { customAlpha : 0, customY : 40 },
            endProps   : { customAlpha : 1, customY : 0 },
            waitTime   : 1000,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupButton,
            beginProps : { customAlpha : 0, customY : 40 },
            endProps   : { customAlpha : 1, customY : 0 },
            waitTime   : 1100,
        });

        await Timer_TimerModel.wait(1100 + Graphics_Constants.Tween.DefaultDuration);
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._imgTitle,
            beginProps : { customAlpha : 1 },
            endProps   : { customAlpha : 0 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupAccount,
            beginProps : { customAlpha : 1, customY : 0 },
            endProps   : { customAlpha : 0, customY : 40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupPassword,
            beginProps : { customAlpha : 1, customY : 0 },
            endProps   : { customAlpha : 0, customY : 40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupPasswordCommand,
            beginProps : { customAlpha : 1, customY : 0 },
            endProps   : { customAlpha : 0, customY : 40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupButton,
            beginProps : { customAlpha : 1, customY : 0 },
            endProps   : { customAlpha : 0, customY : 40 },
        });

        await Timer_TimerModel.wait();
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
