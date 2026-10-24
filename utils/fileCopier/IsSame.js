
const fs = require("fs");

function main() {
    const relativePath      = process.argv[2];
    const targetPathDict    = new Map([
        ["tw2", `../../../../TinyWars2/TinyWarsClientInVite/${relativePath}`],
    ]);

    const sourceData = fs.readFileSync(`../../${relativePath}`, { encoding: "utf-8" });
    for (const [version, targetPath] of targetPathDict) {
        let targetData;
        try {
            targetData = fs.readFileSync(targetPath, { encoding: "utf-8" });
        } catch (e) {
            console.log(`${version}: different! target doesn't exist.`);
            continue;
        }

        if (sourceData === targetData) {
            console.log(`${version}: same.`);
        } else {
            console.log(`${version}: different! source: ${sourceData.length}, target: ${targetData.length}`);
        }
    }
}

main();
