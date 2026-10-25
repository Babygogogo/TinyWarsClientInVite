import { Token } from "./Enums.ts";
import type { TextReader } from "./TextReader.ts";

export class Tokenizer {
    private _reader         : TextReader;
    private _currentChar    = '\0';
    private _currentToken   = Token.Unknown;
    private _number         = 0;
    private _identifier     = "";

    public constructor(reader: TextReader) {
        this._reader = reader;
        this.tickChar();
        this.tickToken();
    }

    public getToken(): Token {
        return this._currentToken;
    }

    public getNumber(): number {
        return this._number;
    }

    public getIdentifier(): string {
        return this._identifier;
    }

    private _getCurrentChar(): string {
        return this._currentChar;
    }

    // Read the next character from the input stream
    // and store it in _currentChar, or load '\0' if EOF
    private tickChar(): void {
        const ch            = this._reader.read();
        this._currentChar   = ch == null ? '\0' : ch;
    }

    // Read the next token from the input stream
    public tickToken(): void {
        // Skip whitespace
        while (this._currentChar.trim().length <= 0) {
            this.tickChar();
        }

        // Special characters
        switch (this._currentChar) {
            case '\0':
                this._currentToken = Token.EOF;
                return;

            case '+':
                this.tickChar();
                this._currentToken = Token.Add;
                return;

            case '-':
                this.tickChar();
                this._currentToken = Token.Subtract;
                return;

            case '*':
                this.tickChar();
                this._currentToken = Token.Multiply;
                return;

            case '/':
                this.tickChar();
                this._currentToken = Token.Divide;
                return;

            case '%':
                this.tickChar();
                this._currentToken = Token.PercentageSign;
                return;

            case '(':
                this.tickChar();
                this._currentToken = Token.OpenParens;
                return;

            case ')':
                this.tickChar();
                this._currentToken = Token.CloseParens;
                return;

            case '!':
                this.tickChar();
                if (this._getCurrentChar() === '=') {
                    this.tickChar();
                    this._currentToken = Token.Unequal;
                } else {
                    this._currentToken = Token.ExclamationMark;
                }
                return;

            case '=':
                this.tickChar();
                if (this._getCurrentChar() === '=') {
                    this.tickChar();
                    this._currentToken = Token.Equal;
                } else if (this._getCurrentChar() === '>') {
                    this.tickChar();
                    this._currentToken = Token.Lambda;
                } else {
                    this._currentToken = Token.Assign;
                }
                return;

            case '>':
                this.tickChar();
                if (this._getCurrentChar() === '=') {
                    this.tickChar();
                    this._currentToken = Token.GreaterEqual;
                } else {
                    this._currentToken = Token.Greater;
                }
                return;

            case '<':
                this.tickChar();
                if (this._getCurrentChar() === '=') {
                    this.tickChar();
                    this._currentToken = Token.LessEqual;
                } else {
                    this._currentToken = Token.Less;
                }
                return;

            case '&':
                this.tickChar();
                if (this._getCurrentChar() === '&') {
                    this.tickChar();
                    this._currentToken = Token.LogicalAnd;
                } else {
                    this._currentToken = Token.Unknown;
                }
                return;

            case '|':
                this.tickChar();
                if (this._getCurrentChar() === '|') {
                    this.tickChar();
                    this._currentToken = Token.LogicalOr;
                } else {
                    this._currentToken = Token.Unknown;
                }
                return;

            case '?':
                this.tickChar();
                this._currentToken = Token.QuestionMark;
                return;

            case ':':
                this.tickChar();
                this._currentToken = Token.Colon;
                return;

            case ',':
                this.tickChar();
                this._currentToken = Token.Comma;
                return;

            case '.':
                this.tickChar();
                this._currentToken = Token.Dot;
                return;
        }

        // Number?
        if (isDigit(this._currentChar)) {
            // Capture digits/decimal point
            let str                 = "";
            let haveDecimalPoint    = false;
            while ((isDigit(this._currentChar))                     ||
                ((!haveDecimalPoint) && (this._currentChar == '.'))
            ) {
                str                 += this._currentChar;
                haveDecimalPoint    ||= this._currentChar == '.';
                this.tickChar();
            }

            // Parse it
            this._number        = parseFloat(str);
            this._currentToken  = Token.Number;
            return;
        }

        // Identifier - starts with letter or underscore
        if ((isLetter(this._currentChar)) || (this._currentChar == '_')) {
            let str = "";

            // Accept letter, digit or underscore
            while ((isLetterOrDigit(this._currentChar)) || (this._currentChar == '_')) {
                str += this._currentChar;
                this.tickChar();
            }

            // Setup token
            this._identifier    = str;
            this._currentToken  = Token.Identifier;
            return;
        }

        // unknown char
        this.tickChar();
        this._currentToken = Token.Unknown;
    }
}

function isDigit(char: string): boolean {
    return (char >= '0') && (char <= '9');
}
function isLetter(char: string): boolean {
    return ((char >= 'a') && (char <= 'z'))
        || ((char >= 'A') && (char <= 'Z'));
}
function isLetterOrDigit(char: string): boolean {
    return (isDigit(char)) || (isLetter(char));
}
