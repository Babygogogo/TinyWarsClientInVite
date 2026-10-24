import * as ExpressionParsersEnums from "./Enums.ts";
import type * as ExpressionParsersTextReader from "./TextReader.ts";

export class Tokenizer {
    private _reader         : ExpressionParsersTextReader.TextReader;
    private _currentChar    = '\0';
    private _currentToken   = ExpressionParsersEnums.Token.Unknown;
    private _number         = 0;
    private _identifier     = "";

    public constructor(reader: ExpressionParsersTextReader.TextReader) {
        this._reader = reader;
        this.tickChar();
        this.tickToken();
    }

    public getToken(): ExpressionParsersEnums.Token {
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
                this._currentToken = ExpressionParsersEnums.Token.EOF;
                return;

            case '+':
                this.tickChar();
                this._currentToken = ExpressionParsersEnums.Token.Add;
                return;

            case '-':
                this.tickChar();
                this._currentToken = ExpressionParsersEnums.Token.Subtract;
                return;

            case '*':
                this.tickChar();
                this._currentToken = ExpressionParsersEnums.Token.Multiply;
                return;

            case '/':
                this.tickChar();
                this._currentToken = ExpressionParsersEnums.Token.Divide;
                return;

            case '%':
                this.tickChar();
                this._currentToken = ExpressionParsersEnums.Token.PercentageSign;
                return;

            case '(':
                this.tickChar();
                this._currentToken = ExpressionParsersEnums.Token.OpenParens;
                return;

            case ')':
                this.tickChar();
                this._currentToken = ExpressionParsersEnums.Token.CloseParens;
                return;

            case '!':
                this.tickChar();
                if (this._getCurrentChar() === '=') {
                    this.tickChar();
                    this._currentToken = ExpressionParsersEnums.Token.Unequal;
                } else {
                    this._currentToken = ExpressionParsersEnums.Token.ExclamationMark;
                }
                return;

            case '=':
                this.tickChar();
                if (this._getCurrentChar() === '=') {
                    this.tickChar();
                    this._currentToken = ExpressionParsersEnums.Token.Equal;
                } else if (this._getCurrentChar() === '>') {
                    this.tickChar();
                    this._currentToken = ExpressionParsersEnums.Token.Lambda;
                } else {
                    this._currentToken = ExpressionParsersEnums.Token.Assign;
                }
                return;

            case '>':
                this.tickChar();
                if (this._getCurrentChar() === '=') {
                    this.tickChar();
                    this._currentToken = ExpressionParsersEnums.Token.GreaterEqual;
                } else {
                    this._currentToken = ExpressionParsersEnums.Token.Greater;
                }
                return;

            case '<':
                this.tickChar();
                if (this._getCurrentChar() === '=') {
                    this.tickChar();
                    this._currentToken = ExpressionParsersEnums.Token.LessEqual;
                } else {
                    this._currentToken = ExpressionParsersEnums.Token.Less;
                }
                return;

            case '&':
                this.tickChar();
                if (this._getCurrentChar() === '&') {
                    this.tickChar();
                    this._currentToken = ExpressionParsersEnums.Token.LogicalAnd;
                } else {
                    this._currentToken = ExpressionParsersEnums.Token.Unknown;
                }
                return;

            case '|':
                this.tickChar();
                if (this._getCurrentChar() === '|') {
                    this.tickChar();
                    this._currentToken = ExpressionParsersEnums.Token.LogicalOr;
                } else {
                    this._currentToken = ExpressionParsersEnums.Token.Unknown;
                }
                return;

            case '?':
                this.tickChar();
                this._currentToken = ExpressionParsersEnums.Token.QuestionMark;
                return;

            case ':':
                this.tickChar();
                this._currentToken = ExpressionParsersEnums.Token.Colon;
                return;

            case ',':
                this.tickChar();
                this._currentToken = ExpressionParsersEnums.Token.Comma;
                return;

            case '.':
                this.tickChar();
                this._currentToken = ExpressionParsersEnums.Token.Dot;
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
            this._currentToken  = ExpressionParsersEnums.Token.Number;
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
            this._currentToken  = ExpressionParsersEnums.Token.Identifier;
            return;
        }

        // unknown char
        this.tickChar();
        this._currentToken = ExpressionParsersEnums.Token.Unknown;
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
