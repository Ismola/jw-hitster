#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';

const infoJsonUrl = new URL('../config/info.json', import.meta.url);

function sortInfoJson() {
  try {
    console.log('Reading config/info.json...');
    const data = JSON.parse(readFileSync(infoJsonUrl, 'utf8'));

    if (!Array.isArray(data)) {
      console.error('Error: info.json does not contain an array');
      process.exit(1);
    }

    console.log(`Found ${data.length} events`);
    console.log('Sorting by date...');
    const sorted = data.sort((a, b) => Number(a.date) - Number(b.date));

    console.log('Writing sorted data back to file...');
    writeFileSync(infoJsonUrl, `${JSON.stringify(sorted, null, 4)}\n`, 'utf8');

    console.log('✓ Successfully sorted config/info.json');
    console.log(`  ${sorted.length} events sorted by date`);
    console.log(`  Date range: ${sorted[0].date} to ${sorted[sorted.length - 1].date}`);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

sortInfoJson();
