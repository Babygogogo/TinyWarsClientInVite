import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as KeyboardKbTypes from "./KbTypes.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import type * as NotificationsTypes from "../notifications/Types.ts";

type KeyCallback    = KeyboardKbTypes.KeyCallback;

interface Listener {
    callback    : KeyCallback;
    thisObject  : any;
    priority    : number;
    index       : number;
}

const _allKeys          = new Set<KeyboardKbTypes.KeyCode>();
const _newKeys          = new Set<KeyboardKbTypes.KeyCode>();
const _listenerArray    : Listener[] = [];

const _NOTIFY_EVENTS    : NotificationsTypes.Listener[] = [
    { type: NotificationsTypeId.TypeId.GameHidden,   callback: _onNotifyGameHidden },
];

export function init(): void {
    document.addEventListener("keydown",    _onKeyDown);
    document.addEventListener("keyup",      _onKeyUp);

    NotificationsDispatcher.addEventListeners(_NOTIFY_EVENTS, null);
}
export function clearKeys(): void {
    _allKeys.clear();
    _newKeys.clear();
}

function _onKeyDown(e: KeyboardEvent): void {
    const key = e.key;
    if (key == null) {
        return;
    }

    if (((key.toLowerCase() === "s") && (e.ctrlKey)) ||
        ((key.toLowerCase() === " ") && (e.altKey))
    ) {
        e.preventDefault();
    }

    const keyCode = _getKeyCode(key);
    if (keyCode == null) {
        return;
    }

    if (!_allKeys.has(keyCode)) {
        _newKeys.add(keyCode);
        _allKeys.add(keyCode);
    }

    _invokeListeners();
}
function _onKeyUp(e: KeyboardEvent): void {
    const keyCode = _getKeyCode(e.key);
    if (keyCode == null) {
        return;
    }

    _allKeys.delete(keyCode);
    _newKeys.delete(keyCode);

    _invokeListeners();
}
function _onNotifyGameHidden(): void {
    clearKeys();
}

export function addListener(callback: KeyCallback, thisObject: unknown, priority = 0): void {
    deleteListener(callback, thisObject);

    _listenerArray.push({
        callback    : callback,
        thisObject  : thisObject,
        priority    : priority,
        index       : (_listenerArray[_listenerArray.length - 1]?.index ?? 0) + 1,
    });
}
export function deleteListener(callback: KeyCallback, thisObject: unknown): void {
    for (let i = 0; i < _listenerArray.length; ++i) {
        const listener = _listenerArray[i];
        if ((listener.callback === callback) && (listener.thisObject == thisObject)) {
            _listenerArray.splice(i--, 1);
        }
    }
}

export function checkHasDirectionKeys(keys: Set<KeyboardKbTypes.KeyCode>): boolean {
    return (keys.has(KeyboardKbTypes.KeyCode.A)) || (keys.has(KeyboardKbTypes.KeyCode.S) || (keys.has(KeyboardKbTypes.KeyCode.D)) || (keys.has(KeyboardKbTypes.KeyCode.W)));
}

function _invokeListeners(): void {
    const eventData: KeyboardKbTypes.EventData = {
        newKeys     : new Set(_newKeys),
        allKeys     : new Set(_allKeys),
        isHandled   : false,
    };

    const tempListenerArray = _listenerArray.concat().sort((v1, v2) => {
        const priority1 = v1.priority;
        const priority2 = v2.priority;
        if (priority1 !== priority2) {
            return priority2 - priority1;
        } else {
            return v2.index - v1.index;
        }
    });
    for (const listener of tempListenerArray) {
        listener.callback.call(listener.thisObject, eventData);
    }

    _newKeys.clear();
}

// function _checkIsSameListener(listener: KeyListener, callback: KeyCallback, thisObject: unknown): boolean {
//     return (listener.callback === callback) && (listener.thisObject == thisObject);
// }
function _getKeyCode(key: AuxiliaryTypesAuxiliaryTypes.Undefinable<string>): KeyboardKbTypes.KeyCode | null {
    switch (key?.toUpperCase?.()) {
        case `A`            : return KeyboardKbTypes.KeyCode.A;
        case `B`            : return KeyboardKbTypes.KeyCode.B;
        case `C`            : return KeyboardKbTypes.KeyCode.C;
        case `D`            : return KeyboardKbTypes.KeyCode.D;
        case `E`            : return KeyboardKbTypes.KeyCode.E;
        case `F`            : return KeyboardKbTypes.KeyCode.F;
        case `G`            : return KeyboardKbTypes.KeyCode.G;
        case `H`            : return KeyboardKbTypes.KeyCode.H;
        case `I`            : return KeyboardKbTypes.KeyCode.I;
        case `J`            : return KeyboardKbTypes.KeyCode.J;
        case `K`            : return KeyboardKbTypes.KeyCode.K;
        case `L`            : return KeyboardKbTypes.KeyCode.L;
        case `M`            : return KeyboardKbTypes.KeyCode.M;
        case `N`            : return KeyboardKbTypes.KeyCode.N;
        case `O`            : return KeyboardKbTypes.KeyCode.O;
        case `P`            : return KeyboardKbTypes.KeyCode.P;
        case `Q`            : return KeyboardKbTypes.KeyCode.Q;
        case `R`            : return KeyboardKbTypes.KeyCode.R;
        case `S`            : return KeyboardKbTypes.KeyCode.S;
        case `T`            : return KeyboardKbTypes.KeyCode.T;
        case `U`            : return KeyboardKbTypes.KeyCode.U;
        case `V`            : return KeyboardKbTypes.KeyCode.V;
        case `W`            : return KeyboardKbTypes.KeyCode.W;
        case `X`            : return KeyboardKbTypes.KeyCode.X;
        case `Y`            : return KeyboardKbTypes.KeyCode.Y;
        case `Z`            : return KeyboardKbTypes.KeyCode.Z;

        case `0`            : return KeyboardKbTypes.KeyCode.Num0;
        case `1`            : return KeyboardKbTypes.KeyCode.Num1;
        case `2`            : return KeyboardKbTypes.KeyCode.Num2;
        case `3`            : return KeyboardKbTypes.KeyCode.Num3;
        case `4`            : return KeyboardKbTypes.KeyCode.Num4;
        case `5`            : return KeyboardKbTypes.KeyCode.Num5;
        case `6`            : return KeyboardKbTypes.KeyCode.Num6;
        case `7`            : return KeyboardKbTypes.KeyCode.Num7;
        case `8`            : return KeyboardKbTypes.KeyCode.Num8;
        case `9`            : return KeyboardKbTypes.KeyCode.Num9;
        case `NUMPAD0`      : return KeyboardKbTypes.KeyCode.Num0;
        case `NUMPAD1`      : return KeyboardKbTypes.KeyCode.Num1;
        case `NUMPAD2`      : return KeyboardKbTypes.KeyCode.Num2;
        case `NUMPAD3`      : return KeyboardKbTypes.KeyCode.Num3;
        case `NUMPAD4`      : return KeyboardKbTypes.KeyCode.Num4;
        case `NUMPAD5`      : return KeyboardKbTypes.KeyCode.Num5;
        case `NUMPAD6`      : return KeyboardKbTypes.KeyCode.Num6;
        case `NUMPAD7`      : return KeyboardKbTypes.KeyCode.Num7;
        case `NUMPAD8`      : return KeyboardKbTypes.KeyCode.Num8;
        case `NUMPAD9`      : return KeyboardKbTypes.KeyCode.Num9;

        case `+`            : return KeyboardKbTypes.KeyCode.Add;
        case `-`            : return KeyboardKbTypes.KeyCode.Sub;

        case `BACKSPACE`    : return KeyboardKbTypes.KeyCode.Backspace;
        case `SHIFT`        : return KeyboardKbTypes.KeyCode.Shift;
        case `ALT`          : return KeyboardKbTypes.KeyCode.Alt;
        case `CONTROL`      : return KeyboardKbTypes.KeyCode.Control;
        case `ENTER`        : return KeyboardKbTypes.KeyCode.Enter;
        case `ESCAPE`       : return KeyboardKbTypes.KeyCode.Escape;
        case ` `            : return KeyboardKbTypes.KeyCode.Whitespace;

        default             : return null;
    }
}
