// eslint-disable-next-line no-shadow
export const enum KeyCode {
    A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,
    Num0, Num1, Num2, Num3, Num4, Num5, Num6, Num7, Num8, Num9,
    Add, Sub,
    Shift, Alt, Control, Enter, Escape, Backspace, Whitespace,
}

export interface EventData {
    allKeys     : Set<KeyCode>;
    newKeys     : Set<KeyCode>;
    isHandled   : boolean;
}

export type KeyCallback = (eventData: EventData) => void;
