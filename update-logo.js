const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\4d2990b5-a112-436c-8dcc-efc628f4a436\\media__1772547765316.png';
const outputPath = path.join(__dirname, 'public/images/logo.png');

async function processLogo() {
    console.log('--- Processing Transparent Logo ---');
    console.log('Input:', inputPath);

    // Trim the transparency to make it tight
    await sharp(inputPath)
        .trim()
        .toFile(outputPath);

    console.log('✅ Logo replaced and tight-cropped.');
}

processLogo().catch(console.error);
