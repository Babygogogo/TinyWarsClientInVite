import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
    {
        files   : ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins : {
            js           : js,
            "@stylistic" : stylistic,
        },
        extends         : ["js/recommended"],
        languageOptions : {
            globals : globals.browser,
        },
    },
    tseslint.configs.recommended,
    {
        rules : {
            "indent" : ["error", 4, {
                "SwitchCase" : 1,
            }],
            "no-shadow"                    : "off",
            "@typescript-eslint/no-shadow" : "error",
            "semi"                         : ["error", "always"],
            "no-extra-semi"                : "error",
            "object-curly-spacing"         : ["error", "always"],
            "brace-style"                  : ["error", "1tbs", {
                "allowSingleLine" : false,
            }],
            "@stylistic/comma-dangle" : ["error", "always-multiline"],
            "key-spacing"             : ["error", {
                "beforeColon" : true,
                "afterColon"  : true,
                "align"       : "colon",
            }],
            "object-property-newline" : [ "error", {
                "allowAllPropertiesOnSameLine" : true,
            }],
            "object-curly-newline" : [ "error", {
                "ObjectExpression" : {
                    "multiline"     : true,
                    "minProperties" : 4,
                    "consistent"    : true,
                },
            }],
            'max-statements-per-line' : ['error', {
                'max' : 1,
            }],
        },
    },
]);
