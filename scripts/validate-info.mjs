import { readFileSync } from 'node:fs';

const gameData = JSON.parse(readFileSync(new URL('../config/info.json', import.meta.url), 'utf8'));
const supportedLocales = ['es', 'en'];
const errors = [];

const requireLocalizedText = (item, index, field) => {
    for (const locale of supportedLocales) {
        if (typeof item[field]?.[locale] !== 'string') {
            errors.push(`Entry ${index + 1}: ${field}.${locale} must be a string`);
        }
    }
};

gameData.forEach((item, index) => {
    if (!Number.isInteger(Number(item.date))) {
        errors.push(`Entry ${index + 1}: date must contain an integer year`);
    }

    requireLocalizedText(item, index, 'event');
    requireLocalizedText(item, index, 'bible_reference');

    if (index > 0 && Number(gameData[index - 1].date) > Number(item.date)) {
        errors.push(`Entry ${index + 1}: dates are not sorted chronologically`);
    }

    if (item.bibliografy) {
        for (const locale of supportedLocales) {
            if (!Array.isArray(item.bibliografy[locale])) {
                errors.push(`Entry ${index + 1}: bibliografy.${locale} must be an array`);
                continue;
            }

            for (const url of item.bibliografy[locale]) {
                try {
                    const parsedUrl = new URL(url);
                    if (parsedUrl.protocol !== 'https:') {
                        errors.push(`Entry ${index + 1}: bibliography URLs must use HTTPS`);
                    }
                } catch {
                    errors.push(`Entry ${index + 1}: invalid bibliography URL: ${url}`);
                }
            }
        }
    }
});

if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exit(1);
}

console.log(`Validated ${gameData.length} chronological, bilingual entries.`);
