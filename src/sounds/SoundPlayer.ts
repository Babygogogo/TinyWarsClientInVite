import {
    Notifications_Dispatcher,
    Sounds_Constants,
    Egret_Egret,
    Utils_ClientErrorCode,
    Logger,
    Sounds_Utils,
    Helpers_Misc,
    LocalData_Storage,
    Egret_Res,
    Lang_Utils,
    FloatText,
    CoSkills_Constants,
    Lang_Constants,
    type Sounds_Types,
    type BaseWar_Interface_IBwWar,
    type Notifications_Types,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";

export const DEFAULT_MUTE   = false;
export const DEFAULT_VOLUME = 1;

type ShortSfxParams = {
    name    : string;
};
type OngoingLongSfxData = {
    gainNode            : GainNode;
    sourceNode          : AudioBufferSourceNode | null;
    concurrentCount     : number;
    buffer              : AudioBuffer;
    timeoutId           : number | null;
    isStarted           : boolean;
};

const _SOUND_PATH       = "resource/assets/sound/";
const _SHORT_SFX_PARAM  = new Map<Sounds_Constants.ShortSfxCode, ShortSfxParams>([   // 必须和config保持一致
    [ Sounds_Constants.ShortSfxCode.FootMove01,          { name : "footMove.mp3"          } ],
    [ Sounds_Constants.ShortSfxCode.TireMove01,          { name : "tireMove.mp3"          } ],
    [ Sounds_Constants.ShortSfxCode.TankMove01,          { name : "tankMove.mp3"          } ],
    [ Sounds_Constants.ShortSfxCode.CopterMove01,        { name : "copterMove.mp3"        } ],
    [ Sounds_Constants.ShortSfxCode.JetMove01,           { name : "jetMove.mp3"           } ],
    [ Sounds_Constants.ShortSfxCode.NavalMove01,         { name : "navalMove.mp3"         } ],
    [ Sounds_Constants.ShortSfxCode.ButtonNeutral01,     { name : "buttonNeutral01.mp3"   } ],
    [ Sounds_Constants.ShortSfxCode.ButtonConfirm01,     { name : "buttonConfirm01.mp3"   } ],
    [ Sounds_Constants.ShortSfxCode.ButtonCancel01,      { name : "buttonCancel01.mp3"    } ],
    [ Sounds_Constants.ShortSfxCode.ButtonForbidden01,   { name : `buttonForbidden01.mp3` } ],
    [ Sounds_Constants.ShortSfxCode.CursorConfirm01,     { name : "cursorConfirm01.mp3"   } ],
    [ Sounds_Constants.ShortSfxCode.CursorMove01,        { name : "cursorMove01.mp3"      } ],
    [ Sounds_Constants.ShortSfxCode.Explode,             { name : "explode.mp3"           } ],
    [ Sounds_Constants.ShortSfxCode.Attack,              { name : "attack.m4a"            } ],
    [ Sounds_Constants.ShortSfxCode.Block,               { name : "block.m4a"             } ],
    [ Sounds_Constants.ShortSfxCode.Capture,             { name : "capture.m4a"           } ],
    [ Sounds_Constants.ShortSfxCode.SpendMoney,          { name : "spendMoney.m4a"        } ],
    [ Sounds_Constants.ShortSfxCode.UnitProduction,      { name : "unitProduction.m4a"    } ],
]);
const _UNIT_MOVE_FADEOUT_TIME   = 0.6;
const _NOTIFY_EVENTS    : Notifications_Types.Listener[] = [
    { type : "GameShown",    callback : _onNotifyGameShown },
    { type : "GameHidden",   callback : _onNotifyGameHidden },
];

let _isInitialized              = false;
let _audioContext               : AudioContext;

let _mainGain                   : GainNode;
let _mainMute                   = DEFAULT_MUTE;
let _mainVolume                 = DEFAULT_VOLUME;

let _bgmMute                    = DEFAULT_MUTE;
let _bgmVolume                  = DEFAULT_VOLUME;    // 音量范围是0～1，1为最大音量
let _playingBgmCode             = Sounds_Constants.BgmSfxCode.None;

const _bgmBufferCache           = new Map<number, AudioBuffer>();
let _bgmGain                    : GainNode;
let _bgmSourceNode              : AudioBufferSourceNode | null = null;

let _effectMute                 = DEFAULT_MUTE;
let _effectVolume               = DEFAULT_VOLUME;
const _ongoingLongSfxDataDict   = new Map<Sounds_Types.BgmSfxCfg, OngoingLongSfxData>();
const _queueDictForLongSfx      = new Map<Sounds_Types.BgmSfxCfg, (() => Promise<void>)[]>();

const _longSfxBufferCache       = new Map<number, AudioBuffer>();
const _shortSfxBufferCache      = new Map<Sounds_Constants.ShortSfxCode, AudioBuffer>();
let _shortSfxGain               : GainNode;
let _longSfxMainGain            : GainNode | null = null;

// const _shortSfxDict         : { [shortSfxCode: number]: egret.SoundChannel | null } = {};

// const audio = new Audio(getResourcePath("war01.mp3", SoundType.Bgm));
// audio.play();
// audio.addEventListener(
//     'timeupdate',
//     () => {
//         if (audio.currentTime > audio.duration - 0.77) {
//             audio.currentTime = 1.75;
//             audio.play();
//         }
//     },
//     false
// );

export async function init(): Promise<void> {
    if (_isInitialized) {
        return;
    }
    _isInitialized = true;

    try {
        _audioContext       = new AudioContext();
        _mainGain           = _audioContext.createGain();
        _bgmGain            = _audioContext.createGain();
        _shortSfxGain       = _audioContext.createGain();
        _longSfxMainGain    = _audioContext.createGain();

        _mainGain.connect(_audioContext.destination);
        _bgmGain.connect(_mainGain);
        _shortSfxGain.connect(_mainGain);
        _longSfxMainGain.connect(_mainGain);
    } catch (e) {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0196));
    }

    _initMainMute();
    _initMainVolume();
    _initBgmMute();
    _initBgmVolume();
    _initEffectMute();
    _initEffectVolume();

    Notifications_Dispatcher.addEventListeners(_NOTIFY_EVENTS, null);
    // playBgm(GameConfig.BgmSfxCode.Lobby);
}

export function resume(): void {
    // playBgm(_getBgmPrevCode(), true);
    try {
        _audioContext.resume();
    } catch (e) {
        // throw newError(`SoundManager.resume() error.`);
    }
}
export function pause(): void {
    // _stopBgm();
    // _stopAllEffects();
    try {
        _audioContext.suspend();
    } catch (e) {
        // throw newError(`SoundManager.pause() error.`);
    }
    _stopAllShortSfx();
}

export function playCoBgmWithWar({ war, force, coBgmCodeArrayFromUserSettings }: {
    war                             : BaseWar_Interface_IBwWar.IBwWar;
    force                           : boolean;
    coBgmCodeArrayFromUserSettings  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>;
}): void {
    {
        const opaBgmCode = war.getWarEventManager().getOpaBgmCode();
        if (opaBgmCode != null) {
            playBgm(opaBgmCode);
            return;
        }
    }

    const player = war.getPlayerInTurn();
    if ((player.checkIsNeutral()) && (!force)) {
        return;
    }

    {
        const code = war.getOverridingBgmCode();
        if (code != null) {
            playBgm(code);
            return;
        }
    }

    const gameConfig    = war.getGcData();
    const coCategoryId  = gameConfig.getCoBasicCfg(player.getCoId())?.getCoCategoryId();
    const bgmCodeArray  = (coCategoryId == null
        ? null
        : coBgmCodeArrayFromUserSettings ?? gameConfig.getCoCategoryCfg(coCategoryId)?.getBgmCodeArray()) ?? [];
    switch (player.getCoUsingSkillType()) {
        case CoSkills_Constants.SkillTypeId.Power        : playBgm(bgmCodeArray[1] ?? Sounds_Constants.BgmSfxCode.CoPower); return;
        case CoSkills_Constants.SkillTypeId.SuperPower   : playBgm(bgmCodeArray[2] ?? Sounds_Constants.BgmSfxCode.CoPower); return;
        default                         : playBgm(bgmCodeArray[0] ?? Sounds_Constants.BgmSfxCode.CoEmpty); return;
    }
}

function _onNotifyGameShown(): void {
    resume();
}
function _onNotifyGameHidden(): void {
    pause();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// 主音量控制
////////////////////////////////////////////////////////////////////////////////////////////////////
function _initMainMute(): void {
    setIsMainMute(LocalData_Storage.getIsSoundMainMute(), true);
}
export function setIsMainMute(isMute: boolean, isForce = false): void {
    if ((!isForce) && (isMute === getIsMainMute())) {
        return;
    }

    _mainMute = isMute;
    _updateMainVolume();
}
export function setIsMainMuteToStore(): void {
    LocalData_Storage.setIsSoundMainMute(getIsMainMute());
}
export function getIsMainMute(): boolean {
    return _mainMute;
}

function _initMainVolume(): void {
    setMainVolume(LocalData_Storage.getSoundMainVolume(), true);
}
export function setMainVolume(volume: number, isForce = false): void {
    volume = Math.min(1, Math.max(0, volume || 0));
    if ((!isForce) && (volume === getMainVolume())) {
        return;
    }

    _mainVolume = volume;
    _updateMainVolume();
}
export function setMainVolumeToStore(): void {
    LocalData_Storage.setSoundMainVolume(getMainVolume());
}
export function getMainVolume(): number {
    return _mainVolume;
}
function _getRevisedMainVolume(): number {
    return (getIsMainMute() ? 0 : getMainVolume()) * (Egret_Egret.Capabilities.isMobile ? 0.5 : 1);
}

function _updateMainVolume(): void {
    _mainGain?.gain.setValueAtTime(_getRevisedMainVolume(), _audioContext.currentTime);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// bgm(背景音乐)
////////////////////////////////////////////////////////////////////////////////////////////////////
function _initBgmMute(): void {
    setIsBgmMute(LocalData_Storage.getIsSoundBgmMute());
}
export function setIsBgmMute(isMute: boolean): void {
    if (isMute == getIsBgmMute()) {
        return;
    }

    _bgmMute = isMute;
    _updateBgmVolumeForNormal();
}
export function setIsBgmMuteToStore(): void {
    LocalData_Storage.setIsSoundBgmMute(getIsBgmMute());
}
export function getIsBgmMute(): boolean {
    return _bgmMute;
}

function _initBgmVolume(): void {
    setBgmVolume(LocalData_Storage.getSoundBgmVolume());
}
export function setBgmVolume(volume: number): void {
    volume = Math.min(1, Math.max(0, volume || 0));
    if (volume === getBgmVolume()) {
        return;
    }

    _bgmVolume = volume;
    _updateBgmVolumeForNormal();
}
export function setBgmVolumeToStore(): void {
    LocalData_Storage.setSoundBgmVolume(getBgmVolume());
}
export function getBgmVolume(): number {
    return _bgmVolume;
}
function _getRevisedBgmVolume(): number {
    return getIsBgmMute() ? 0 : getBgmVolume();
}
function _updateBgmVolumeForNormal(): void {
    const gain = _bgmGain;
    if (gain) {
        gain.gain.setValueAtTime(_getRevisedBgmVolume(), _audioContext.currentTime);
    }
}

function _setPlayingBgmCode(bgmCode: number): void {
    _playingBgmCode = bgmCode;
    Notifications_Dispatcher.dispatch("SoundManagerPlayingBgmCodeChanged");
}
export function getPlayingBgmCode(): number {
    return _playingBgmCode;
}
/** 播放背景音乐，同时只能有一个在播放 */
export function playBgm(bgmCode: number, forcePlayFromBeginning = false): void {
    if (!_isInitialized) {
        return;
    }

    if (!bgmCode) {
        _setPlayingBgmCode(bgmCode);
        _stopBgm();
        return;
    }

    if ((getPlayingBgmCode() !== bgmCode) || (forcePlayFromBeginning)) {
        _setPlayingBgmCode(bgmCode);
        _playBgmForNormal(bgmCode);
    }
}
async function _playBgmForNormal(bgmCode: number): Promise<void> {
    const bgmCfg        = Helpers_Misc.getExisted(Sounds_Utils.getBgmSfxCfg(bgmCode), Utils_ClientErrorCode.ClientErrorCode.SoundManager_PlayBgmForNormal_00);
    const cacheDict     = _bgmBufferCache;
    const cachedBuffer  = cacheDict.get(bgmCode);
    if (cachedBuffer) {
        _doPlayBgmForNormal(cachedBuffer, bgmCfg);
    } else {
        const filename  = bgmCfg.filename;
        let audioBuffer : AudioBuffer;
        try {
            audioBuffer = Helpers_Misc.getExisted(await loadAudioBuffer(getResourcePath(filename, Sounds_Constants.SoundTypeId.Bgm)));
        } catch {
            Logger.error(`Failed to load audio buffer, bgmCode: ${bgmCode}, filename: ${filename}.`);
            return;
        }

        cacheDict.set(bgmCode, audioBuffer);
        if (bgmCode === getPlayingBgmCode()) {
            _doPlayBgmForNormal(audioBuffer, bgmCfg);
        }
    }
}
function _doPlayBgmForNormal(buffer: AudioBuffer, params: Sounds_Types.BgmSfxCfg): void {
    if (!buffer) {
        return;
    }

    _stopBgm();

    _bgmSourceNode              = _audioContext.createBufferSource();
    _bgmSourceNode.buffer       = buffer;
    _bgmSourceNode.loopStart    = Helpers_Misc.getExisted(params.loopStart) / 10000;
    _bgmSourceNode.loopEnd      = Helpers_Misc.getExisted(params.loopEnd) / 10000;
    _bgmSourceNode.loop         = true;
    _bgmSourceNode.connect(_bgmGain);
    _bgmSourceNode.start();
}

function _stopBgm(): void {
    _stopBgmForNormal();
}
function _stopBgmForNormal(): void {
    if (_bgmSourceNode) {
        _bgmSourceNode.stop();
        _bgmSourceNode.disconnect();
        _bgmSourceNode = null;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// 音效音量控制
////////////////////////////////////////////////////////////////////////////////////////////////////
function _initEffectMute(): void {
    setIsEffectMute(LocalData_Storage.getIsSoundEffectMute());
}
export function setIsEffectMute(isMute: boolean): void {
    if (isMute === getIsEffectMute()) {
        return;
    }

    _effectMute = isMute;
    _updateShortEffectVolume();
    _updateLongEffectVolume();
}
export function setIsEffectMuteToStore(): void {
    LocalData_Storage.setIsSoundEffectMute(getIsEffectMute());
}
export function getIsEffectMute(): boolean {
    return _effectMute;
}

function _initEffectVolume(): void {
    setEffectVolume(LocalData_Storage.getSoundEffectVolume());
}
export function setEffectVolume(volume: number): void {
    volume = Math.min(1, Math.max(0, volume || 0));
    if (volume === getEffectVolume()) {
        return;
    }

    _effectVolume = volume;
    _updateShortEffectVolume();
    _updateLongEffectVolume();
}
export function setEffectVolumeToStore(): void {
    LocalData_Storage.setSoundEffectVolume(getEffectVolume());
}
export function getEffectVolume(): number {
    return _effectVolume;
}
function _getRevisedEffectVolume(): number {
    return getIsEffectMute() ? 0 : getEffectVolume();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// 短音效，可以同时播放多个
////////////////////////////////////////////////////////////////////////////////////////////////////
function _updateShortEffectVolume(): void {
    const volume        = _getRevisedEffectVolume();
    const shortSfxGain  = _shortSfxGain;
    if (shortSfxGain) {
        shortSfxGain.gain.setValueAtTime(volume, _audioContext.currentTime);
    }
}

/** 技能或按钮的点击音效，可以同时播放多个 */
export async function playShortSfx(shortSfxCode: Sounds_Constants.ShortSfxCode): Promise<void> {
    if (!_isInitialized) {
        return;
    }

    if ((shortSfxCode == null) || (shortSfxCode === Sounds_Constants.ShortSfxCode.None)) {
        return;
    }

    const params        = Helpers_Misc.getExisted(_SHORT_SFX_PARAM.get(shortSfxCode), Utils_ClientErrorCode.ClientErrorCode.SoundManager_PlayShortSfx_00);
    const cacheDict     = _shortSfxBufferCache;
    const cachedBuffer  = cacheDict.get(shortSfxCode);
    if (cachedBuffer) {
        _doPlayShortSfx(cachedBuffer);
    } else {
        const path          = getResourcePath(params.name, Sounds_Constants.SoundTypeId.Sfx);
        const currentTime   = Date.now();
        let audioBuffer     : AudioBuffer;
        try {
            audioBuffer = Helpers_Misc.getExisted(await loadAudioBuffer(path));
        } catch {
            Logger.error(`Failed to load audio buffer, shortSfxCode: ${shortSfxCode}, path: ${path}.`);
            return;
        }

        cacheDict.set(shortSfxCode, audioBuffer);
        if (Date.now() - currentTime > 200) {
            Logger.log(`SoundManager.playShortSfx() spent too much time on loading.`);
            return;
        }

        _doPlayShortSfx(audioBuffer);
    }
}
function _doPlayShortSfx(buffer: AudioBuffer): void {
    if (!buffer) {
        return;
    }

    // _stopShortSfx(buffer);

    const sourceNode    = _audioContext.createBufferSource();
    sourceNode.buffer   = buffer;
    sourceNode.connect(_shortSfxGain);
    sourceNode.start();
}

// function _stopShortSfx(shortSfxCode: ShortSfxCode): void {
//     const effectDict    = _shortSfxDict;
//     const eff           = effectDict[shortSfxCode];
//     if (eff) {
//         try {
//             eff.stop();
//         } catch (e) {
//             throw newError(`SoundManager._stopShortSfx() error.`);
//         }
//         effectDict[shortSfxCode] = null;
//     }
// }

function _stopAllShortSfx(): void {
    // const dict = _shortSfxDict;
    // for (const name in dict) {
    //     const eff = dict[name];
    //     if (eff) {
    //         try {
    //             eff.stop();
    //         } catch (e) {
    //             throw newError(`SoundManager._stopAllShortSfx() error.`);
    //         }
    //     }
    // }
    // _shortSfxDict = {};
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// 长音效
////////////////////////////////////////////////////////////////////////////////////////////////////
export async function playLongSfxForMoveUnit(cfg: Sounds_Types.BgmSfxCfg): Promise<void> {
    addToQueueForLongSfx(cfg, () => doPlayLongSfxForMoveUnit(cfg));
}
async function doPlayLongSfxForMoveUnit(cfg: Sounds_Types.BgmSfxCfg): Promise<void> {
    if (_longSfxMainGain == null) {
        return;
    }

    const ongoingData = _ongoingLongSfxDataDict.get(cfg);
    if (ongoingData == null) {
        const currentTime   = Date.now();
        const buffer        = await getLongSfxBuffer(cfg);
        if (buffer == null) {
            return;
        }

        const gainNode = _audioContext.createGain();
        gainNode.connect(_longSfxMainGain);

        const isStarted = Date.now() - currentTime < 200;
        _ongoingLongSfxDataDict.set(cfg, {
            gainNode        : gainNode,
            sourceNode      : createLongSfxSourceNode(buffer, gainNode, cfg, isStarted),
            concurrentCount : 1,
            buffer          : buffer,
            timeoutId       : null,
            isStarted       : isStarted,
        });

    } else {
        const gainNode      = ongoingData.gainNode;
        const gain          = gainNode.gain;
        const currentTime   = _audioContext.currentTime;
        gain.cancelScheduledValues(currentTime);
        gain.setValueAtTime(1, currentTime);

        const timeoutId = ongoingData.timeoutId;
        if (timeoutId != null) {
            Egret_Egret.clearTimeout(timeoutId);
            ongoingData.timeoutId = null;
        }

        ++ongoingData.concurrentCount;
        if (ongoingData.sourceNode == null) {
            ongoingData.sourceNode  = createLongSfxSourceNode(ongoingData.buffer, gainNode, cfg, true);
            ongoingData.isStarted   = true;
        }
    }
}
function createLongSfxSourceNode(buffer: AudioBuffer, gainNode: GainNode, params: Sounds_Types.BgmSfxCfg, needStart: boolean): AudioBufferSourceNode {
    const sourceNode        = _audioContext.createBufferSource();
    sourceNode.buffer       = buffer;
    sourceNode.loopStart    = Helpers_Misc.getExisted(params.loopStart) / 10000;
    sourceNode.loopEnd      = Helpers_Misc.getExisted(params.loopEnd) / 10000;
    sourceNode.loop         = true;
    sourceNode.connect(gainNode);

    if (needStart) {
        sourceNode.start();
    }

    return sourceNode;
}
async function getLongSfxBuffer(cfg: Sounds_Types.BgmSfxCfg): Promise<AudioBuffer | null> {
    const cache             = _longSfxBufferCache;
    const longSfxCode       = cfg.code;
    const existingBuffer    = cache.get(longSfxCode);
    if (existingBuffer) {
        return existingBuffer;
    }

    const path      = getResourcePath(cfg.filename, Sounds_Constants.SoundTypeId.Sfx);
    let audioBuffer : AudioBuffer;
    try {
        audioBuffer = Helpers_Misc.getExisted(await loadAudioBuffer(path));
    } catch {
        Logger.error(`Failed to load audio buffer, longSfxCode: ${longSfxCode}, path: ${path}`);
        return null;
    }

    cache.set(longSfxCode, audioBuffer);
    return audioBuffer;
}

export function fadeoutLongSfxForMoveUnit(cfg: Sounds_Types.BgmSfxCfg): void {
    addToQueueForLongSfx(cfg, () => doFadeoutLongSfxForMoveUnit(cfg));
}
async function doFadeoutLongSfxForMoveUnit(cfg: Sounds_Types.BgmSfxCfg): Promise<void> {
    const data = _ongoingLongSfxDataDict.get(cfg);
    if ((data == null) || (data.concurrentCount <= 0)) {
        return;
    }

    if (--data.concurrentCount === 0) {
        const gain          = data.gainNode.gain;
        const currentTime   = _audioContext.currentTime;
        gain.cancelScheduledValues(currentTime);    // 看上去没用，但实际上如果删掉，复用时音量会突然变小
        gain.setValueAtTime(1, currentTime);        // 看上去没用，但实际上如果删掉，复用时音量会突然变小
        gain.exponentialRampToValueAtTime(0.01, currentTime + _UNIT_MOVE_FADEOUT_TIME);

        const timeoutId = data.timeoutId;
        if (timeoutId) {
            Egret_Egret.clearTimeout(timeoutId);
        }

        data.timeoutId = Egret_Egret.setTimeout(
            () => {
                const sourceNode = data.sourceNode;
                if (data.isStarted) {
                    sourceNode?.stop();
                }
                sourceNode?.disconnect();

                data.timeoutId  = null;
                data.sourceNode = null;
            },
            null,
            _UNIT_MOVE_FADEOUT_TIME * 1000,
        );
    }
}

function _updateLongEffectVolume(): void {
    const volume        = _getRevisedEffectVolume();
    const longSfxGain   = _longSfxMainGain;
    if (longSfxGain) {
        longSfxGain.gain.setValueAtTime(volume, _audioContext.currentTime);
    }
}

function addToQueueForLongSfx<T>(cfg: Sounds_Types.BgmSfxCfg, rawFunc: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve) => {
        const func = async (): Promise<void> => {
            const funcList = _queueDictForLongSfx.get(cfg);
            if (!funcList) {
                throw Helpers_Misc.newError(`SoundManager.addToQueueForLongSfx() exception queueing 1!!`);
            } else {
                if (funcList[0] !== func) {
                    throw Helpers_Misc.newError(`SoundManager.addToQueueForLongSfx() exception queueing 2!!`);
                } else {
                    const result = await rawFunc();
                    if (funcList.shift() !== func) {
                        throw Helpers_Misc.newError(`SoundManager.addToQueueForLongSfx() exception queueing 3!!`);
                    }
                    resolve(result);

                    if (funcList.length) {
                        funcList[0]();
                    } else {
                        // _queueDict.delete(config);
                    }
                }
            }
        };

        const currQueue = _queueDictForLongSfx.get(cfg);
        if (currQueue) {
            currQueue.push(func);
            (currQueue.length === 1) && (func());
        } else {
            _queueDictForLongSfx.set(cfg, [func]);
            func();
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// 资源回收
////////////////////////////////////////////////////////////////////////////////////////////////////
export function dispose(): void {
    _disposeAllBgm();
    _disposeAllSfx();
}
function _disposeAllBgm(): void {
    _bgmBufferCache.clear();

    _stopBgm();
}
function _disposeAllSfx(): void {
    _shortSfxBufferCache.clear();

    _stopAllShortSfx();
}

function getResourcePath(musicName: string, soundType: Sounds_Constants.SoundTypeId): string {
    switch (soundType) {
        case Sounds_Constants.SoundTypeId.Bgm  : return _SOUND_PATH + "bgm/" + musicName;
        case Sounds_Constants.SoundTypeId.Sfx  : return _SOUND_PATH + "effect/" + musicName;
        default             : throw Helpers_Misc.newError(`Invalid soundType: ${soundType}`, Utils_ClientErrorCode.ClientErrorCode.SoundManager_GetResourcePath_00);
    }
}

async function loadAudioBuffer(fullName: string): Promise<AudioBuffer | null> {
    if (!_audioContext) {
        return null;
    }

    const arrayBuffer: AuxiliaryTypes_AuxiliaryTypes.Undefinable<ArrayBuffer> = await Egret_Res.getResByUrl(
        fullName,
        () => {
            // nothing to do.
        },
        null,
        Egret_Res.ResourceItemHelper.TYPE_BIN,
    );
    if (!arrayBuffer) {
        return null;
    }

    try {
        return await _audioContext.decodeAudioData(arrayBuffer);
    } catch {
        // Compatibility.showError(err); throw err;
        Logger.error(`Failed to decode audio data: ${fullName}`);
        return null;
    }
}
