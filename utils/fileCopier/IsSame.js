
const fs = require("fs");
const path = require("path");

function main() {
    const projectPath       = "TinyWarsClientInVite\\";
    const rawRelativePath   = path.normalize(process.argv[2]);
    const index             = rawRelativePath.indexOf(projectPath);
    const relativePath      = index >= 0 ? rawRelativePath.substring(index + projectPath.length) : rawRelativePath;
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
