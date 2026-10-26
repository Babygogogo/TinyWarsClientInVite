
const fs = require("fs");
const path = require("path");

function main() {
    const projectPath       = "TinyWarsClientInVite\\";
    const rawRelativePath   = path.normalize(process.argv[2]);
    const index             = rawRelativePath.indexOf(projectPath);
    const relativePath      = index >= 0 ? rawRelativePath.substring(index + projectPath.length) : rawRelativePath;
    const destPathArray = [
        `../../../../TinyWars2/TinyWarsClientInVite/${relativePath}`,
    ];

    const sourceData = fs.readFileSync(`../../${relativePath}`, { encoding: "utf-8" });
    for (const dstPath of destPathArray) {
        fs.writeFileSync(dstPath, sourceData);
        console.log(`copied: ${dstPath}`);
    }
}

main();
