import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
    {
        files   : ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins : {
            js           : js,
            "@stylistic" : stylistic,
        },
        extends         : ["js/recommended"],
        languageOptions : {
            globals : globals.browser
        }
    },
    tseslint.configs.recommended,
    {
        rules : {
            "indent" : ["error", 4, {
                "SwitchCase" : 1
            }],
            "no-shadow"                    : "off",
            "@typescript-eslint/no-shadow" : "error",
            "no-extra-semi"                : "error",
            "brace-style"                  : ["error", "1tbs", {
                "allowSingleLine" : false
            }],
            "key-spacing" : ["error", {
                "beforeColon" : true,
                "afterColon"  : true,
                "align"       : "colon"
            }],
            "object-property-newline" : [ "error", {
                "allowAllPropertiesOnSameLine" : false
            }],
            "object-curly-newline" : [ "error", {
                "ObjectExpression" : {
                    "minProperties" : 1
                }
            }],
            'max-statements-per-line' : ['error', {
                'max' : 1
            }],
        },
    },
]);
