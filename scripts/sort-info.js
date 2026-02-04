#!/usr/bin/env node

/**
 * Script to sort config/info.json by date
 * Usage: node scripts/sort-info.js
 */

const fs = require('fs');
const path = require('path');

const INFO_JSON_PATH = path.join(__dirname, '../config/info.json');

function sortInfoJson() {
  try {
    // Read the file
    console.log('Reading config/info.json...');
    const data = JSON.parse(fs.readFileSync(INFO_JSON_PATH, 'utf8'));

    // Verify it's an array
    if (!Array.isArray(data)) {
      console.error('Error: info.json does not contain an array');
      process.exit(1);
    }

    console.log(`Found ${data.length} events`);

    // Sort by date (numerically)
    console.log('Sorting by date...');
    const sorted = data.sort((a, b) => {
      const dateA = parseInt(a.date, 10);
      const dateB = parseInt(b.date, 10);
      return dateA - dateB;
    });

    // Write back to file with proper formatting
    console.log('Writing sorted data back to file...');
    fs.writeFileSync(
      INFO_JSON_PATH,
      JSON.stringify(sorted, null, 4) + '\n',
      'utf8'
    );

    console.log('✓ Successfully sorted config/info.json');
    console.log(`  ${sorted.length} events sorted by date`);
    console.log(`  Date range: ${sorted[0].date} to ${sorted[sorted.length - 1].date}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

sortInfoJson();
