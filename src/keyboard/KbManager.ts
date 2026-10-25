import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { type KeyCallback as KeyboardKbTypesKeyCallback, KeyCode, type EventData } from "./KbTypes.ts";
import { addEventListeners } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import type { Listener as NotificationsTypesListener } from "../notifications/Types.ts";

type KeyCallback    = KeyboardKbTypesKeyCallback;

interface Listener {
    callback    : KeyCallback;
    thisObject  : any;
    priority    : number;
    index       : number;
}

const _allKeys          = new Set<KeyCode>();
const _newKeys          = new Set<KeyCode>();
const _listenerArray    : Listener[] = [];

const _NOTIFY_EVENTS    : NotificationsTypesListener[] = [
    { type: TypeId.GameHidden,   callback: _onNotifyGameHidden },
];

export function init(): void {
    document.addEventListener("keydown",    _onKeyDown);
    document.addEventListener("keyup",      _onKeyUp);

    addEventListeners(_NOTIFY_EVENTS, null);
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

export function checkHasDirectionKeys(keys: Set<KeyCode>): boolean {
    return (keys.has(KeyCode.A)) || (keys.has(KeyCode.S) || (keys.has(KeyCode.D)) || (keys.has(KeyCode.W)));
}

function _invokeListeners(): void {
    const eventData: EventData = {
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
function _getKeyCode(key: Undefinable<string>): KeyCode | null {
    switch (key?.toUpperCase?.()) {
        case `A`            : return KeyCode.A;
        case `B`            : return KeyCode.B;
        case `C`            : return KeyCode.C;
        case `D`            : return KeyCode.D;
        case `E`            : return KeyCode.E;
        case `F`            : return KeyCode.F;
        case `G`            : return KeyCode.G;
        case `H`            : return KeyCode.H;
        case `I`            : return KeyCode.I;
        case `J`            : return KeyCode.J;
        case `K`            : return KeyCode.K;
        case `L`            : return KeyCode.L;
        case `M`            : return KeyCode.M;
        case `N`            : return KeyCode.N;
        case `O`            : return KeyCode.O;
        case `P`            : return KeyCode.P;
        case `Q`            : return KeyCode.Q;
        case `R`            : return KeyCode.R;
        case `S`            : return KeyCode.S;
        case `T`            : return KeyCode.T;
        case `U`            : return KeyCode.U;
        case `V`            : return KeyCode.V;
        case `W`            : return KeyCode.W;
        case `X`            : return KeyCode.X;
        case `Y`            : return KeyCode.Y;
        case `Z`            : return KeyCode.Z;

        case `0`            : return KeyCode.Num0;
        case `1`            : return KeyCode.Num1;
        case `2`            : return KeyCode.Num2;
        case `3`            : return KeyCode.Num3;
        case `4`            : return KeyCode.Num4;
        case `5`            : return KeyCode.Num5;
        case `6`            : return KeyCode.Num6;
        case `7`            : return KeyCode.Num7;
        case `8`            : return KeyCode.Num8;
        case `9`            : return KeyCode.Num9;
        case `NUMPAD0`      : return KeyCode.Num0;
        case `NUMPAD1`      : return KeyCode.Num1;
        case `NUMPAD2`      : return KeyCode.Num2;
        case `NUMPAD3`      : return KeyCode.Num3;
        case `NUMPAD4`      : return KeyCode.Num4;
        case `NUMPAD5`      : return KeyCode.Num5;
        case `NUMPAD6`      : return KeyCode.Num6;
        case `NUMPAD7`      : return KeyCode.Num7;
        case `NUMPAD8`      : return KeyCode.Num8;
        case `NUMPAD9`      : return KeyCode.Num9;

        case `+`            : return KeyCode.Add;
        case `-`            : return KeyCode.Sub;

        case `BACKSPACE`    : return KeyCode.Backspace;
        case `SHIFT`        : return KeyCode.Shift;
        case `ALT`          : return KeyCode.Alt;
        case `CONTROL`      : return KeyCode.Control;
        case `ENTER`        : return KeyCode.Enter;
        case `ESCAPE`       : return KeyCode.Escape;
        case ` `            : return KeyCode.Whitespace;

        default             : return null;
    }
}
