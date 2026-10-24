import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import * as CoSkillsConstants from "../coSkills/Constants.ts";
import * as FloatText2 from "../FloatText.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import * as LocalDataStorage from "../localData/Storage.ts";
import * as Logger2 from "../Logger.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import type * as NotificationsTypes from "../notifications/Types.ts";
import * as SoundsConstants from "./Constants.ts";
import type * as SoundsTypes from "./Types.ts";
import * as SoundsUtils from "./Utils.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import * as VendorEgretEgret from "../vendor/egret/Egret.ts";
import * as VendorEgretRes from "../vendor/egret/Res.ts";

type BgmSfxCfg          = SoundsTypes.BgmSfxCfg;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

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
const _SHORT_SFX_PARAM  = new Map<SoundsConstants.ShortSfxCode, ShortSfxParams>([   // 必须和config保持一致
    [ SoundsConstants.ShortSfxCode.FootMove01,          { name: "footMove.mp3"          } ],
    [ SoundsConstants.ShortSfxCode.TireMove01,          { name: "tireMove.mp3"          } ],
    [ SoundsConstants.ShortSfxCode.TankMove01,          { name: "tankMove.mp3"          } ],
    [ SoundsConstants.ShortSfxCode.CopterMove01,        { name: "copterMove.mp3"        } ],
    [ SoundsConstants.ShortSfxCode.JetMove01,           { name: "jetMove.mp3"           } ],
    [ SoundsConstants.ShortSfxCode.NavalMove01,         { name: "navalMove.mp3"         } ],
    [ SoundsConstants.ShortSfxCode.ButtonNeutral01,     { name: "buttonNeutral01.mp3"   } ],
    [ SoundsConstants.ShortSfxCode.ButtonConfirm01,     { name: "buttonConfirm01.mp3"   } ],
    [ SoundsConstants.ShortSfxCode.ButtonCancel01,      { name: "buttonCancel01.mp3"    } ],
    [ SoundsConstants.ShortSfxCode.ButtonForbidden01,   { name: `buttonForbidden01.mp3` } ],
    [ SoundsConstants.ShortSfxCode.CursorConfirm01,     { name: "cursorConfirm01.mp3"   } ],
    [ SoundsConstants.ShortSfxCode.CursorMove01,        { name: "cursorMove01.mp3"      } ],
    [ SoundsConstants.ShortSfxCode.Explode,             { name: "explode.mp3"           } ],
    [ SoundsConstants.ShortSfxCode.Attack,              { name: "attack.m4a"            } ],
    [ SoundsConstants.ShortSfxCode.Block,               { name: "block.m4a"             } ],
    [ SoundsConstants.ShortSfxCode.Capture,             { name: "capture.m4a"           } ],
    [ SoundsConstants.ShortSfxCode.SpendMoney,          { name: "spendMoney.m4a"        } ],
    [ SoundsConstants.ShortSfxCode.UnitProduction,      { name: "unitProduction.m4a"    } ],
]);
const _UNIT_MOVE_FADEOUT_TIME   = 0.6;
const _NOTIFY_EVENTS    : NotificationsTypes.Listener[] = [
    { type: NotificationsTypeId.TypeId.GameShown,    callback: _onNotifyGameShown },
    { type: NotificationsTypeId.TypeId.GameHidden,   callback: _onNotifyGameHidden },
];

let _isInitialized              = false;
let _audioContext               : AudioContext;

let _mainGain                   : GainNode;
let _mainMute                   = DEFAULT_MUTE;
let _mainVolume                 = DEFAULT_VOLUME;

let _bgmMute                    = DEFAULT_MUTE;
let _bgmVolume                  = DEFAULT_VOLUME;    // 音量范围是0～1，1为最大音量
let _playingBgmCode             = SoundsConstants.BgmSfxCode.None;

const _bgmBufferCache           = new Map<number, AudioBuffer>();
let _bgmGain                    : GainNode;
let _bgmSourceNode              : AudioBufferSourceNode | null = null;

let _effectMute                 = DEFAULT_MUTE;
let _effectVolume               = DEFAULT_VOLUME;
const _ongoingLongSfxDataDict   = new Map<BgmSfxCfg, OngoingLongSfxData>();
const _queueDictForLongSfx      = new Map<BgmSfxCfg, (() => Promise<void>)[]>();

const _longSfxBufferCache       = new Map<number, AudioBuffer>();
const _shortSfxBufferCache      = new Map<SoundsConstants.ShortSfxCode, AudioBuffer>();
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
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0196));
    }

    _initMainMute();
    _initMainVolume();
    _initBgmMute();
    _initBgmVolume();
    _initEffectMute();
    _initEffectVolume();

    NotificationsDispatcher.addEventListeners(_NOTIFY_EVENTS, null);
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
    war                             : BaseWarInterfaceIBwWar.IBwWar;
    force                           : boolean;
    coBgmCodeArrayFromUserSettings  : Undefinable<number[]>;
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
        case CoSkillsConstants.SkillTypeId.Power        : playBgm(bgmCodeArray[1] ?? SoundsConstants.BgmSfxCode.CoPower); return;
        case CoSkillsConstants.SkillTypeId.SuperPower   : playBgm(bgmCodeArray[2] ?? SoundsConstants.BgmSfxCode.CoPower); return;
        default                         : playBgm(bgmCodeArray[0] ?? SoundsConstants.BgmSfxCode.CoEmpty); return;
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
    setIsMainMute(LocalDataStorage.getIsSoundMainMute(), true);
}
export function setIsMainMute(isMute: boolean, isForce = false): void {
    if ((!isForce) && (isMute === getIsMainMute())) {
        return;
    }

    _mainMute = isMute;
    _updateMainVolume();
}
export function setIsMainMuteToStore(): void {
    LocalDataStorage.setIsSoundMainMute(getIsMainMute());
}
export function getIsMainMute(): boolean {
    return _mainMute;
}

function _initMainVolume(): void {
    setMainVolume(LocalDataStorage.getSoundMainVolume(), true);
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
    LocalDataStorage.setSoundMainVolume(getMainVolume());
}
export function getMainVolume(): number {
    return _mainVolume;
}
function _getRevisedMainVolume(): number {
    return (getIsMainMute() ? 0 : getMainVolume()) * (VendorEgretEgret.Capabilities.isMobile ? 0.5 : 1);
}

function _updateMainVolume(): void {
    _mainGain?.gain.setValueAtTime(_getRevisedMainVolume(), _audioContext.currentTime);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// bgm(背景音乐)
////////////////////////////////////////////////////////////////////////////////////////////////////
function _initBgmMute(): void {
    setIsBgmMute(LocalDataStorage.getIsSoundBgmMute());
}
export function setIsBgmMute(isMute: boolean): void {
    if (isMute == getIsBgmMute()) {
        return;
    }

    _bgmMute = isMute;
    _updateBgmVolumeForNormal();
}
export function setIsBgmMuteToStore(): void {
    LocalDataStorage.setIsSoundBgmMute(getIsBgmMute());
}
export function getIsBgmMute(): boolean {
    return _bgmMute;
}

function _initBgmVolume(): void {
    setBgmVolume(LocalDataStorage.getSoundBgmVolume());
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
    LocalDataStorage.setSoundBgmVolume(getBgmVolume());
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
    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.SoundManagerPlayingBgmCodeChanged);
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
    const bgmCfg        = HelpersMisc.getExisted(SoundsUtils.getBgmSfxCfg(bgmCode), UtilsClientErrorCode.ClientErrorCode.SoundManager_PlayBgmForNormal_00);
    const cacheDict     = _bgmBufferCache;
    const cachedBuffer  = cacheDict.get(bgmCode);
    if (cachedBuffer) {
        _doPlayBgmForNormal(cachedBuffer, bgmCfg);
    } else {
        const filename  = bgmCfg.filename;
        let audioBuffer : AudioBuffer;
        try {
            audioBuffer = HelpersMisc.getExisted(await loadAudioBuffer(getResourcePath(filename, SoundsConstants.SoundTypeId.Bgm)));
        } catch {
            Logger2.error(`Failed to load audio buffer, bgmCode: ${bgmCode}, filename: ${filename}.`);
            return;
        }

        cacheDict.set(bgmCode, audioBuffer);
        if (bgmCode === getPlayingBgmCode()) {
            _doPlayBgmForNormal(audioBuffer, bgmCfg);
        }
    }
}
function _doPlayBgmForNormal(buffer: AudioBuffer, params: BgmSfxCfg): void {
    if (!buffer) {
        return;
    }

    _stopBgm();

    _bgmSourceNode              = _audioContext.createBufferSource();
    _bgmSourceNode.buffer       = buffer;
    _bgmSourceNode.loopStart    = HelpersMisc.getExisted(params.loopStart) / 10000;
    _bgmSourceNode.loopEnd      = HelpersMisc.getExisted(params.loopEnd) / 10000;
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
    setIsEffectMute(LocalDataStorage.getIsSoundEffectMute());
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
    LocalDataStorage.setIsSoundEffectMute(getIsEffectMute());
}
export function getIsEffectMute(): boolean {
    return _effectMute;
}

function _initEffectVolume(): void {
    setEffectVolume(LocalDataStorage.getSoundEffectVolume());
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
    LocalDataStorage.setSoundEffectVolume(getEffectVolume());
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
export async function playShortSfx(shortSfxCode: SoundsConstants.ShortSfxCode): Promise<void> {
    if (!_isInitialized) {
        return;
    }

    if ((shortSfxCode == null) || (shortSfxCode === SoundsConstants.ShortSfxCode.None)) {
        return;
    }

    const params        = HelpersMisc.getExisted(_SHORT_SFX_PARAM.get(shortSfxCode), UtilsClientErrorCode.ClientErrorCode.SoundManager_PlayShortSfx_00);
    const cacheDict     = _shortSfxBufferCache;
    const cachedBuffer  = cacheDict.get(shortSfxCode);
    if (cachedBuffer) {
        _doPlayShortSfx(cachedBuffer);
    } else {
        const path          = getResourcePath(params.name, SoundsConstants.SoundTypeId.Sfx);
        const currentTime   = Date.now();
        let audioBuffer     : AudioBuffer;
        try {
            audioBuffer = HelpersMisc.getExisted(await loadAudioBuffer(path));
        } catch {
            Logger2.error(`Failed to load audio buffer, shortSfxCode: ${shortSfxCode}, path: ${path}.`);
            return;
        }

        cacheDict.set(shortSfxCode, audioBuffer);
        if (Date.now() - currentTime > 200) {
            Logger2.log(`SoundManager.playShortSfx() spent too much time on loading.`);
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
export async function playLongSfxForMoveUnit(cfg: BgmSfxCfg): Promise<void> {
    addToQueueForLongSfx(cfg, () => doPlayLongSfxForMoveUnit(cfg));
}
async function doPlayLongSfxForMoveUnit(cfg: BgmSfxCfg): Promise<void> {
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
            VendorEgretEgret.clearTimeout(timeoutId);
            ongoingData.timeoutId = null;
        }

        ++ongoingData.concurrentCount;
        if (ongoingData.sourceNode == null) {
            ongoingData.sourceNode  = createLongSfxSourceNode(ongoingData.buffer, gainNode, cfg, true);
            ongoingData.isStarted   = true;
        }
    }
}
function createLongSfxSourceNode(buffer: AudioBuffer, gainNode: GainNode, params: BgmSfxCfg, needStart: boolean): AudioBufferSourceNode {
    const sourceNode        = _audioContext.createBufferSource();
    sourceNode.buffer       = buffer;
    sourceNode.loopStart    = HelpersMisc.getExisted(params.loopStart) / 10000;
    sourceNode.loopEnd      = HelpersMisc.getExisted(params.loopEnd) / 10000;
    sourceNode.loop         = true;
    sourceNode.connect(gainNode);

    if (needStart) {
        sourceNode.start();
    }

    return sourceNode;
}
async function getLongSfxBuffer(cfg: BgmSfxCfg): Promise<AudioBuffer | null> {
    const cache             = _longSfxBufferCache;
    const longSfxCode       = cfg.code;
    const existingBuffer    = cache.get(longSfxCode);
    if (existingBuffer) {
        return existingBuffer;
    }

    const path      = getResourcePath(cfg.filename, SoundsConstants.SoundTypeId.Sfx);
    let audioBuffer : AudioBuffer;
    try {
        audioBuffer = HelpersMisc.getExisted(await loadAudioBuffer(path));
    } catch {
        Logger2.error(`Failed to load audio buffer, longSfxCode: ${longSfxCode}, path: ${path}`);
        return null;
    }

    cache.set(longSfxCode, audioBuffer);
    return audioBuffer;
}

export function fadeoutLongSfxForMoveUnit(cfg: BgmSfxCfg): void {
    addToQueueForLongSfx(cfg, () => doFadeoutLongSfxForMoveUnit(cfg));
}
async function doFadeoutLongSfxForMoveUnit(cfg: BgmSfxCfg): Promise<void> {
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
            VendorEgretEgret.clearTimeout(timeoutId);
        }

        data.timeoutId = VendorEgretEgret.setTimeout(
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
            _UNIT_MOVE_FADEOUT_TIME * 1000
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

function addToQueueForLongSfx<T>(cfg: BgmSfxCfg, rawFunc: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve) => {
        const func = async (): Promise<void> => {
            const funcList = _queueDictForLongSfx.get(cfg);
            if (!funcList) {
                throw HelpersMisc.newError(`SoundManager.addToQueueForLongSfx() exception queueing 1!!`);
            } else {
                if (funcList[0] !== func) {
                    throw HelpersMisc.newError(`SoundManager.addToQueueForLongSfx() exception queueing 2!!`);
                } else {
                    const result = await rawFunc();
                    if (funcList.shift() !== func) {
                        throw HelpersMisc.newError(`SoundManager.addToQueueForLongSfx() exception queueing 3!!`);
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

function getResourcePath(musicName: string, soundType: SoundsConstants.SoundTypeId): string {
    switch (soundType) {
        case SoundsConstants.SoundTypeId.Bgm  : return _SOUND_PATH + "bgm/" + musicName;
        case SoundsConstants.SoundTypeId.Sfx  : return _SOUND_PATH + "effect/" + musicName;
        default             : throw HelpersMisc.newError(`Invalid soundType: ${soundType}`, UtilsClientErrorCode.ClientErrorCode.SoundManager_GetResourcePath_00);
    }
}

async function loadAudioBuffer(fullName: string): Promise<AudioBuffer | null> {
    if (!_audioContext) {
        return null;
    }

    const arrayBuffer: Undefinable<ArrayBuffer> = await VendorEgretRes.getResByUrl(
        fullName,
        () => {
            // nothing to do.
        },
        null,
        VendorEgretRes.ResourceItemHelper.TYPE_BIN
    );
    if (!arrayBuffer) {
        return null;
    }

    try {
        return await _audioContext.decodeAudioData(arrayBuffer);
    } catch {
        // Compatibility.showError(err); throw err;
        Logger2.error(`Failed to decode audio data: ${fullName}`);
        return null;
    }
}
