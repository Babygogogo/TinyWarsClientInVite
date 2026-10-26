
const fs            = require("fs");
const execSync      = require('child_process').execSync;
const PublishConfig = require("../../../TinyWarsExternals/utils/Publisher/PublishConfig");

const DESTINATION_PATH  = "dist/";
const INDEX_PATH        = `${DESTINATION_PATH}index.html`;

async function main() {
    const publishConfig = PublishConfig[process.argv[2]];
    if (publishConfig == null) {
        console.error(`Publisher index.js empty publishConfig!!`);
        return;
    }

    console.log(execSync(`npm run build`, {encoding: "utf8"}));

    const clientVersion = getVersion();
    fs.writeFileSync(
        INDEX_PATH,
        fs.readFileSync(INDEX_PATH, "utf8")
            .replace(/window\.CLIENT_VERSION.*/,    `window.CLIENT_VERSION = "${clientVersion}";`)
            .replace(/window\.GAME_VERSION.*/,      `window.GAME_VERSION = "${publishConfig.gameVersion}";`)
            .replace(`<title>TinyWars</title>`,     `<title>${publishConfig.gameName}</title>`)
    );

    {
        const releasePath = publishConfig.clientReleasePath;
        fs.rmSync(releasePath, { recursive: true });
        fs.mkdirSync(releasePath, { recursive: true });
        fs.cpSync(DESTINATION_PATH, releasePath, { recursive: true });
    }

    console.log(`Publish succeeded: ${process.argv[2]}`);
}

function getVersion() {
    const d = new Date();
    return `${d.getFullYear() % 100}.${getNumText(d.getMonth() + 1)}${getNumText(d.getDate())}.${getNumText(d.getHours())}${getNumText(d.getMinutes())}`;
}

function repeatString(str, times) {
    return (new Array(times + 1)).join(str);
}

function getDigitsCount(num) {
    num = Math.abs(num);
    let count = 1;
    while (num >= 10) {
        ++count;
        num = Math.floor(num / 10);
    }

    return count;
}

function getNumText(num, targetLength = 2) {
    return repeatString("0", targetLength - getDigitsCount(num)) + num;
}

main();
