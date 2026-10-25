
const fs = require("fs");

const DEFAULT_FILE_PATH = `src/modules/tools/lang/LangCommonText.ts`;

function main() {
    const srcShortPath  = process.argv[2] ?? DEFAULT_FILE_PATH;
    const srcFullPath   = `../../${srcShortPath}`;
    const destPathArray = [
        `../../../../TinyWars2/TinyWarsClientInVite/${srcShortPath}`,
    ];

    const sourceData = fs.readFileSync(srcFullPath, { encoding: "utf-8"} );
    for (const dstPath of destPathArray) {
        fs.writeFileSync(dstPath, sourceData);
        console.log(`copied: ${dstPath}`);
    }
}

main();
